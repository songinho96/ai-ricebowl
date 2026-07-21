import {
  cleanText,
  createSession,
  currentAdmin,
  deleteCurrentSession,
  hashPassword,
  isAllowedAdminEmail,
  jsonResponse,
  normalizeEmail,
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

async function handleSignup(db, request, payload) {
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

  const existing = await db.prepare('SELECT id FROM admin_users WHERE email = ?')
    .bind(email)
    .first();

  if (existing) {
    return jsonResponse({ error: '이미 가입된 관리자 이메일입니다.' }, { status: 409 });
  }

  const { hash, salt } = await hashPassword(password);
  const userId = crypto.randomUUID();

  await db.prepare(
    `INSERT INTO admin_users
      (id, email, name, password_hash, password_salt, role, email_verified, active)
     VALUES (?, ?, ?, ?, ?, 'admin', 1, 1)`
  ).bind(userId, email, name, hash, salt).run();

  const user = { id: userId, email, name, role: 'admin' };
  const session = await createSession(db, user, request);

  return jsonResponse({
    ok: true,
    user: publicUser(user),
    message: '관리자 가입이 완료됐습니다.'
  }, {
    status: 201,
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
    return handleSignup(db, context.request, payload);
  }
  if (action === 'verify') {
    return jsonResponse({ error: '이메일 인증 단계는 더 이상 사용하지 않습니다.' }, { status: 410 });
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
