import {
  cleanText,
  createSession,
  currentAdmin,
  deleteCurrentSession,
  generateVerificationCode,
  hashCode,
  hashPassword,
  isAllowedAdminEmail,
  jsonResponse,
  normalizeEmail,
  sendVerificationEmail,
  storeVerificationCode,
  verifyPassword
} from '../../_lib/admin-auth.js';

function publicUser(user) {
  if (!user) return null;
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role
  };
}

function passwordError(password) {
  if (String(password || '').length < 10) {
    return '비밀번호는 10자 이상이어야 합니다.';
  }
  return '';
}

async function handleSignup(db, env, payload) {
  const email = normalizeEmail(payload.email);
  const name = cleanText(payload.name, 80) || email.split('@')[0];
  const password = String(payload.password || '');
  const error = passwordError(password);

  if (!isAllowedAdminEmail(email)) {
    return jsonResponse({ error: 'okestro.com 이메일만 관리자 가입이 가능합니다.' }, { status: 400 });
  }
  if (error) {
    return jsonResponse({ error }, { status: 400 });
  }

  const existing = await db.prepare('SELECT id, email_verified FROM admin_users WHERE email = ?')
    .bind(email)
    .first();

  if (existing?.email_verified) {
    return jsonResponse({ error: '이미 가입된 관리자 이메일입니다.' }, { status: 409 });
  }

  const { hash, salt } = await hashPassword(password);

  if (existing) {
    await db.prepare(
      `UPDATE admin_users
       SET name = ?, password_hash = ?, password_salt = ?, updated_at = CURRENT_TIMESTAMP
       WHERE email = ?`
    ).bind(name, hash, salt, email).run();
  } else {
    await db.prepare(
      `INSERT INTO admin_users
        (id, email, name, password_hash, password_salt, role, email_verified, active)
       VALUES (?, ?, ?, ?, ?, 'admin', 0, 1)`
    ).bind(crypto.randomUUID(), email, name, hash, salt).run();
  }

  const code = generateVerificationCode();
  const verification = await storeVerificationCode(db, email, code);
  const mail = await sendVerificationEmail(env, email, code);

  return jsonResponse({
    ok: true,
    email,
    emailSent: mail.sent,
    expiresAt: verification.expiresAt,
    message: mail.sent
      ? '인증코드를 이메일로 보냈습니다.'
      : `계정은 생성됐지만 메일 발송이 설정되지 않았습니다. ${mail.reason}`
  }, { status: 201 });
}

async function handleVerify(db, request, payload) {
  const email = normalizeEmail(payload.email);
  const code = cleanText(payload.code, 12);
  const now = new Date().toISOString();

  if (!isAllowedAdminEmail(email) || !/^\d{6}$/.test(code)) {
    return jsonResponse({ error: '이메일 또는 인증코드 형식이 올바르지 않습니다.' }, { status: 400 });
  }

  const verification = await db.prepare(
    `SELECT id, code_hash, code_salt
     FROM admin_email_verifications
     WHERE email = ? AND purpose = 'signup' AND consumed_at IS NULL AND expires_at > ?
     ORDER BY created_at DESC
     LIMIT 1`
  ).bind(email, now).first();

  if (!verification) {
    return jsonResponse({ error: '유효한 인증코드가 없습니다. 다시 가입 요청을 진행하세요.' }, { status: 400 });
  }

  const codeHash = await hashCode(code, verification.code_salt);
  if (codeHash !== verification.code_hash) {
    return jsonResponse({ error: '인증코드가 일치하지 않습니다.' }, { status: 400 });
  }

  await db.prepare('UPDATE admin_email_verifications SET consumed_at = CURRENT_TIMESTAMP WHERE id = ?')
    .bind(verification.id)
    .run();
  await db.prepare('UPDATE admin_users SET email_verified = 1, updated_at = CURRENT_TIMESTAMP WHERE email = ?')
    .bind(email)
    .run();

  const user = await db.prepare('SELECT id, email, name, role FROM admin_users WHERE email = ?')
    .bind(email)
    .first();
  const session = await createSession(db, user, request);

  return jsonResponse({
    ok: true,
    user: publicUser(user),
    message: '이메일 인증이 완료됐습니다.'
  }, {
    headers: {
      'set-cookie': session.cookie
    }
  });
}

async function handleLogin(db, request, payload) {
  const email = normalizeEmail(payload.email);
  const password = String(payload.password || '');

  if (!isAllowedAdminEmail(email)) {
    return jsonResponse({ error: 'okestro.com 이메일만 로그인할 수 있습니다.' }, { status: 400 });
  }

  const user = await db.prepare(
    `SELECT id, email, name, role, password_hash, password_salt, email_verified, active
     FROM admin_users
     WHERE email = ?`
  ).bind(email).first();

  if (!user || !user.active || !(await verifyPassword(password, user.password_salt, user.password_hash))) {
    return jsonResponse({ error: '이메일 또는 비밀번호가 올바르지 않습니다.' }, { status: 401 });
  }
  if (!user.email_verified) {
    return jsonResponse({ error: '이메일 인증이 필요합니다.' }, { status: 403 });
  }

  const session = await createSession(db, user, request);

  return jsonResponse({
    ok: true,
    user: publicUser(user)
  }, {
    headers: {
      'set-cookie': session.cookie
    }
  });
}

export async function onRequestGet(context) {
  const user = await currentAdmin(context);
  return jsonResponse({
    authenticated: Boolean(user),
    user: publicUser(user)
  });
}

export async function onRequestPost(context) {
  const db = context.env.ai_ricebowl;

  if (!db) {
    return jsonResponse({ error: 'ai_ricebowl binding is not configured.' }, { status: 503 });
  }

  let payload;
  try {
    payload = await context.request.json();
  } catch (error) {
    return jsonResponse({ error: 'JSON 본문을 읽을 수 없습니다.' }, { status: 400 });
  }

  const action = cleanText(payload.action, 30);

  if (action === 'signup') {
    return handleSignup(db, context.env, payload);
  }
  if (action === 'verify') {
    return handleVerify(db, context.request, payload);
  }
  if (action === 'login') {
    return handleLogin(db, context.request, payload);
  }
  if (action === 'logout') {
    const cookie = await deleteCurrentSession(db, context.request);
    return jsonResponse({ ok: true }, {
      headers: {
        'set-cookie': cookie
      }
    });
  }

  return jsonResponse({ error: '지원하지 않는 auth action입니다.' }, { status: 400 });
}
