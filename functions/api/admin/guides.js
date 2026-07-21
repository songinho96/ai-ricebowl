import {
  cleanText,
  jsonResponse,
  requireAdmin
} from '../../_lib/admin-auth.js';

function parseJson(value, fallback) {
  if (!value) return fallback;
  try {
    return JSON.parse(value);
  } catch (error) {
    return fallback;
  }
}

function guideFromRow(row) {
  return {
    id: row.id,
    title: row.title,
    subtitle: row.subtitle,
    date: row.date,
    readTime: row.read_time,
    category: row.category,
    author: row.author,
    image: row.image,
    introduction: row.introduction,
    sections: parseJson(row.sections_json, []),
    tags: parseJson(row.tags_json, []),
    status: row.status,
    submitterContact: row.submitter_contact,
    reviewNote: row.review_note,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

export async function onRequestGet(context) {
  const { response } = await requireAdmin(context);
  if (response) return response;

  const db = context.env.ai_ricebowl;
  const url = new URL(context.request.url);
  const status = cleanText(url.searchParams.get('status'), 20);
  const allowedStatuses = ['pending', 'published', 'rejected'];
  const params = [];
  let where = '';

  if (allowedStatuses.includes(status)) {
    where = 'WHERE status = ?';
    params.push(status);
  }

  const { results } = await db.prepare(
    `SELECT id, title, subtitle, date, read_time, category, author, image, introduction,
            sections_json, tags_json, status, submitter_contact, review_note, created_at, updated_at
     FROM user_survival_guides
     ${where}
     ORDER BY created_at DESC`
  ).bind(...params).all();

  return jsonResponse({
    guides: results.map(guideFromRow)
  });
}

export async function onRequestPatch(context) {
  const { response } = await requireAdmin(context);
  if (response) return response;

  const db = context.env.ai_ricebowl;
  let payload;

  try {
    payload = await context.request.json();
  } catch (error) {
    return jsonResponse({ error: 'JSON 본문을 읽을 수 없습니다.' }, { status: 400 });
  }

  const id = cleanText(payload.id, 120);
  const status = cleanText(payload.status, 20);
  const reviewNote = cleanText(payload.reviewNote, 500);

  if (!id) {
    return jsonResponse({ error: '가이드 id가 필요합니다.' }, { status: 400 });
  }
  if (!['pending', 'published', 'rejected'].includes(status)) {
    return jsonResponse({ error: 'status는 pending, published, rejected 중 하나여야 합니다.' }, { status: 400 });
  }

  const existing = await db.prepare('SELECT id FROM user_survival_guides WHERE id = ?')
    .bind(id)
    .first();

  if (!existing) {
    return jsonResponse({ error: '해당 가이드를 찾을 수 없습니다.' }, { status: 404 });
  }

  await db.prepare(
    `UPDATE user_survival_guides
     SET status = ?, review_note = ?, updated_at = CURRENT_TIMESTAMP
     WHERE id = ?`
  ).bind(status, reviewNote || null, id).run();

  const row = await db.prepare(
    `SELECT id, title, subtitle, date, read_time, category, author, image, introduction,
            sections_json, tags_json, status, submitter_contact, review_note, created_at, updated_at
     FROM user_survival_guides
     WHERE id = ?`
  ).bind(id).first();

  return jsonResponse({
    ok: true,
    guide: guideFromRow(row)
  });
}
