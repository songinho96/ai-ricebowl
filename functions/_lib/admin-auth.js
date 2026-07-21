const SESSION_COOKIE = 'ai_ricebowl_admin';
const SESSION_DAYS = 14;
const PASSWORD_ITERATIONS = 100000;

const JSON_HEADERS = {
  'content-type': 'application/json; charset=utf-8',
  'cache-control': 'no-store'
};

function bytesToBase64Url(bytes) {
  const binary = Array.from(bytes, (byte) => String.fromCharCode(byte)).join('');
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function randomBytes(length = 32) {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return bytes;
}

function parseCookies(header = '') {
  return Object.fromEntries(
    header
      .split(';')
      .map((part) => part.trim())
      .filter(Boolean)
      .map((part) => {
        const index = part.indexOf('=');
        if (index === -1) return [part, ''];
        return [part.slice(0, index), decodeURIComponent(part.slice(index + 1))];
      })
  );
}

function sessionCookie(value, request, maxAgeSeconds = SESSION_DAYS * 24 * 60 * 60) {
  const isHttps = new URL(request.url).protocol === 'https:';
  const parts = [
    `${SESSION_COOKIE}=${encodeURIComponent(value)}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    `Max-Age=${maxAgeSeconds}`
  ];

  if (isHttps) parts.push('Secure');
  return parts.join('; ');
}

function deleteSessionCookie(request) {
  return sessionCookie('', request, 0);
}

function textBytes(value) {
  return new TextEncoder().encode(String(value || ''));
}

async function sha256(value) {
  const digest = await crypto.subtle.digest('SHA-256', textBytes(value));
  return bytesToBase64Url(new Uint8Array(digest));
}

export function jsonResponse(payload, init = {}) {
  return new Response(JSON.stringify(payload), {
    ...init,
    headers: {
      ...JSON_HEADERS,
      ...(init.headers || {})
    }
  });
}

export function cleanText(value, maxLength = 200) {
  return String(value || '')
    .replace(/[\u0000-\u001f\u007f]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLength);
}

export function normalizeEmail(email) {
  return cleanText(email, 254).toLowerCase();
}

export function isAllowedAdminEmail(email) {
  return normalizeEmail(email).endsWith('@okestro.com');
}

export async function hashPassword(password, salt = bytesToBase64Url(randomBytes(16))) {
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    textBytes(password),
    'PBKDF2',
    false,
    ['deriveBits']
  );
  const bits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: textBytes(salt),
      iterations: PASSWORD_ITERATIONS,
      hash: 'SHA-256'
    },
    keyMaterial,
    256
  );

  return {
    hash: bytesToBase64Url(new Uint8Array(bits)),
    salt
  };
}

export async function verifyPassword(password, salt, expectedHash) {
  const { hash } = await hashPassword(password, salt);
  return hash === expectedHash;
}

export async function hashCode(code, salt) {
  return sha256(`${salt}:${String(code || '').trim()}`);
}

export function generateVerificationCode() {
  const bytes = randomBytes(4);
  const value = new DataView(bytes.buffer).getUint32(0);
  return String(value % 1000000).padStart(6, '0');
}

export async function storeVerificationCode(db, email, code) {
  const id = crypto.randomUUID();
  const salt = bytesToBase64Url(randomBytes(16));
  const codeHash = await hashCode(code, salt);
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();

  await db.prepare(
    `INSERT INTO admin_email_verifications
      (id, email, code_hash, code_salt, purpose, expires_at)
     VALUES (?, ?, ?, ?, 'signup', ?)`
  ).bind(id, email, codeHash, salt, expiresAt).run();

  return { id, expiresAt };
}

export async function sendVerificationEmail(env, email, code) {
  if (!env.RESEND_API_KEY || !env.ADMIN_FROM_EMAIL) {
    return {
      sent: false,
      reason: 'RESEND_API_KEY 또는 ADMIN_FROM_EMAIL 환경변수가 설정되어 있지 않습니다.'
    };
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      authorization: `Bearer ${env.RESEND_API_KEY}`,
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      from: env.ADMIN_FROM_EMAIL,
      to: [email],
      subject: '[AI 밥그릇] 관리자 가입 인증코드',
      text: `AI 밥그릇 관리자 가입 인증코드: ${code}\n\n이 코드는 15분 동안 유효합니다.`,
      html: `<p>AI 밥그릇 관리자 가입 인증코드입니다.</p><p style="font-size:24px;font-weight:700;letter-spacing:4px;">${code}</p><p>이 코드는 15분 동안 유효합니다.</p>`
    })
  });

  if (!response.ok) {
    return {
      sent: false,
      reason: `메일 발송 실패 (${response.status})`
    };
  }

  return { sent: true };
}

export async function createSession(db, user, request) {
  const token = bytesToBase64Url(randomBytes(32));
  const tokenHash = await sha256(token);
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000).toISOString();

  await db.prepare(
    `INSERT INTO admin_sessions (id, user_id, token_hash, expires_at, user_agent)
     VALUES (?, ?, ?, ?, ?)`
  ).bind(
    crypto.randomUUID(),
    user.id,
    tokenHash,
    expiresAt,
    request.headers.get('user-agent') || ''
  ).run();

  return {
    cookie: sessionCookie(token, request),
    expiresAt
  };
}

export async function deleteCurrentSession(db, request) {
  const cookies = parseCookies(request.headers.get('cookie') || '');
  const token = cookies[SESSION_COOKIE];

  if (token) {
    const tokenHash = await sha256(token);
    await db.prepare('DELETE FROM admin_sessions WHERE token_hash = ?').bind(tokenHash).run();
  }

  return deleteSessionCookie(request);
}

export async function currentAdmin(context) {
  const db = context.env.ai_ricebowl;
  if (!db) return null;

  const cookies = parseCookies(context.request.headers.get('cookie') || '');
  const token = cookies[SESSION_COOKIE];
  if (!token) return null;

  const tokenHash = await sha256(token);
  const now = new Date().toISOString();
  const row = await db.prepare(
    `SELECT s.id AS session_id, s.expires_at, u.id, u.email, u.name, u.role, u.email_verified, u.active
     FROM admin_sessions s
     JOIN admin_users u ON u.id = s.user_id
     WHERE s.token_hash = ? AND s.expires_at > ?`
  ).bind(tokenHash, now).first();

  if (!row || !row.active || !row.email_verified) return null;

  await db.prepare('UPDATE admin_sessions SET last_seen_at = CURRENT_TIMESTAMP WHERE id = ?')
    .bind(row.session_id)
    .run();

  return {
    id: row.id,
    email: row.email,
    name: row.name,
    role: row.role
  };
}

export async function requireAdmin(context) {
  const admin = await currentAdmin(context);

  if (!admin) {
    return {
      admin: null,
      response: jsonResponse({ error: '관리자 로그인이 필요합니다.' }, { status: 401 })
    };
  }

  return { admin, response: null };
}
