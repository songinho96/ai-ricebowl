import {
  cleanText,
  createUserSession,
  currentUser,
  deleteCurrentUserSession,
  hashPassword,
  isValidUserEmail,
  jsonResponse,
  normalizeEmail,
  publicUser,
  verifyPassword
} from '../_lib/user-auth.js';

function passwordError(password) {
  if (String(password || '').length < 8) {
    return '비밀번호는 8자 이상이어야 합니다.';
  }
  return '';
}

async function handleSignup(db, request, payload) {
  const email = normalizeEmail(payload.email);
  const name = cleanText(payload.name, 80) || email.split('@')[0];
  const password = String(payload.password || '');
  const error = passwordError(password);

  if (!isValidUserEmail(email)) {
    return jsonResponse({ error: '올바른 이메일 주소를 입력하세요.' }, { status: 400 });
  }
  if (error) {
    return jsonResponse({ error }, { status: 400 });
  }

  const existing = await db.prepare('SELECT id FROM user_accounts WHERE email = ?')
    .bind(email)
    .first();

  if (existing) {
    return jsonResponse({ error: '이미 가입된 이메일입니다.' }, { status: 409 });
  }

  const { hash, salt } = await hashPassword(password);
  const user = {
    id: crypto.randomUUID(),
    email,
    name
  };

  await db.prepare(
    `INSERT INTO user_accounts (id, email, name, password_hash, password_salt, active)
     VALUES (?, ?, ?, ?, ?, 1)`
  ).bind(user.id, user.email, user.name, hash, salt).run();

  const session = await createUserSession(db, user, request);

  return jsonResponse({
    ok: true,
    user: publicUser(user),
    message: '회원가입이 완료됐습니다.'
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

  if (!isValidUserEmail(email)) {
    return jsonResponse({ error: '올바른 이메일 주소를 입력하세요.' }, { status: 400 });
  }

  const user = await db.prepare(
    `SELECT id, email, name, password_hash, password_salt, active
     FROM user_accounts
     WHERE email = ?`
  ).bind(email).first();

  if (!user || !user.active || !(await verifyPassword(password, user.password_salt, user.password_hash))) {
    return jsonResponse({ error: '이메일 또는 비밀번호가 올바르지 않습니다.' }, { status: 401 });
  }

  const session = await createUserSession(db, user, request);

  return jsonResponse({
    ok: true,
    user: publicUser(user),
    message: '로그인했습니다.'
  }, {
    headers: {
      'set-cookie': session.cookie
    }
  });
}

export async function onRequestGet(context) {
  const user = await currentUser(context);
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
  if (action === 'login') {
    return handleLogin(db, context.request, payload);
  }
  if (action === 'logout') {
    const cookie = await deleteCurrentUserSession(db, context.request);
    return jsonResponse({ ok: true }, {
      headers: {
        'set-cookie': cookie
      }
    });
  }

  return jsonResponse({ error: '지원하지 않는 auth action입니다.' }, { status: 400 });
}
