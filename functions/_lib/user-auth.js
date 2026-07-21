const SESSION_COOKIE = 'ai_ricebowl_user';
const SESSION_DAYS = 30;
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

export function isValidUserEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizeEmail(email));
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

export function publicUser(user) {
  if (!user) return null;
  return {
    id: user.id,
    email: user.email,
    name: user.name
  };
}

export async function createUserSession(db, user, request) {
  const token = bytesToBase64Url(randomBytes(32));
  const tokenHash = await sha256(token);
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000).toISOString();

  await db.prepare(
    `INSERT INTO user_sessions (id, user_id, token_hash, expires_at, user_agent)
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

export async function deleteCurrentUserSession(db, request) {
  const cookies = parseCookies(request.headers.get('cookie') || '');
  const token = cookies[SESSION_COOKIE];

  if (token) {
    const tokenHash = await sha256(token);
    await db.prepare('DELETE FROM user_sessions WHERE token_hash = ?').bind(tokenHash).run();
  }

  return sessionCookie('', request, 0);
}

export async function currentUser(context) {
  const db = context.env.ai_ricebowl;
  if (!db) return null;

  const cookies = parseCookies(context.request.headers.get('cookie') || '');
  const token = cookies[SESSION_COOKIE];
  if (!token) return null;

  const tokenHash = await sha256(token);
  const now = new Date().toISOString();
  const row = await db.prepare(
    `SELECT s.id AS session_id, s.expires_at, u.id, u.email, u.name, u.active
     FROM user_sessions s
     JOIN user_accounts u ON u.id = s.user_id
     WHERE s.token_hash = ? AND s.expires_at > ?`
  ).bind(tokenHash, now).first();

  if (!row || !row.active) return null;

  await db.prepare('UPDATE user_sessions SET last_seen_at = CURRENT_TIMESTAMP WHERE id = ?')
    .bind(row.session_id)
    .run();

  return {
    id: row.id,
    email: row.email,
    name: row.name
  };
}

export async function requireUser(context) {
  const user = await currentUser(context);

  if (!user) {
    return {
      user: null,
      response: jsonResponse({ error: '로그인 후 가이드를 작성할 수 있습니다.' }, { status: 401 })
    };
  }

  return { user, response: null };
}
