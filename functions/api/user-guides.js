import { requireUser } from '../_lib/user-auth.js';

const JSON_HEADERS = {
  'content-type': 'application/json; charset=utf-8',
  'cache-control': 'no-store'
};

const MAX_LENGTHS = {
  title: 120,
  subtitle: 240,
  category: 60,
  author: 60,
  contact: 160,
  introduction: 900,
  strategy: 1600,
  actions: 1600,
  tools: 900,
  links: 900
};

function responseJson(payload, init = {}) {
  return new Response(JSON.stringify(payload), {
    ...init,
    headers: {
      ...JSON_HEADERS,
      ...(init.headers || {})
    }
  });
}

function cleanText(value, maxLength) {
  return String(value || '')
    .replace(/[\u0000-\u001f\u007f]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLength);
}

function cleanBlock(value, maxLength) {
  return String(value || '')
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, ' ')
    .split(/\r?\n/)
    .map((line) => line.replace(/[ \t]+/g, ' ').trim())
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
    .slice(0, maxLength);
}

function splitList(value, maxItems = 8) {
  return cleanBlock(value, 1200)
    .split(/\r?\n|,/)
    .map((item) => item.replace(/^[-*]\s*/, '').trim())
    .filter(Boolean)
    .slice(0, maxItems);
}

function safeLinks(value) {
  return splitList(value, 5)
    .map((item) => {
      try {
        const url = new URL(item);
        return ['http:', 'https:'].includes(url.protocol) ? url.href : '';
      } catch (error) {
        return '';
      }
    })
    .filter(Boolean);
}

function estimateReadTime(...parts) {
  const chars = parts.join('\n').length;
  return `${Math.max(3, Math.ceil(chars / 900))} min read`;
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

function buildSections(input) {
  const actionItems = splitList(input.actions);
  const toolItems = splitList(input.tools);
  const linkItems = safeLinks(input.links);
  const toolLines = [
    ...toolItems.map((item) => `- ${item}`),
    ...linkItems.map((url) => `- ${url}`)
  ];

  return [
    {
      title: '1. 문제 상황',
      content: input.introduction
    },
    {
      title: '2. 생존 전략',
      content: input.strategy
    },
    {
      title: '3. 바로 할 액션',
      content: actionItems.length ? actionItems.map((item) => `- ${item}`).join('\n') : input.actions
    },
    {
      title: '4. 추천 도구와 참고 링크',
      content: toolLines.length ? toolLines.join('\n') : '추천 도구나 참고 링크는 아직 제공되지 않았습니다.'
    }
  ];
}

function validate(input) {
  const errors = [];

  if (input.website) {
    errors.push('자동 제출로 판단되어 저장하지 않았습니다.');
  }
  if (input.title.length < 8) {
    errors.push('제목은 8자 이상 입력하세요.');
  }
  if (input.subtitle.length < 20) {
    errors.push('요약은 20자 이상 입력하세요.');
  }
  if (input.introduction.length < 40) {
    errors.push('상황/문제는 40자 이상 입력하세요.');
  }
  if (input.strategy.length < 80) {
    errors.push('생존 전략은 80자 이상 입력하세요.');
  }
  if (input.actions.length < 30) {
    errors.push('바로 할 액션은 30자 이상 입력하세요.');
  }
  if (safeLinks(input.links).length > 5) {
    errors.push('참고 링크는 최대 5개까지 입력하세요.');
  }

  return errors;
}

function normalizePayload(payload) {
  return {
    title: cleanText(payload.title, MAX_LENGTHS.title),
    subtitle: cleanText(payload.subtitle, MAX_LENGTHS.subtitle),
    category: cleanText(payload.category, MAX_LENGTHS.category) || '사용자 생존 가이드',
    author: cleanText(payload.author, MAX_LENGTHS.author) || '익명 개발자',
    contact: cleanText(payload.contact, MAX_LENGTHS.contact),
    introduction: cleanBlock(payload.introduction, MAX_LENGTHS.introduction),
    strategy: cleanBlock(payload.strategy, MAX_LENGTHS.strategy),
    actions: cleanBlock(payload.actions, MAX_LENGTHS.actions),
    tools: cleanBlock(payload.tools, MAX_LENGTHS.tools),
    links: cleanBlock(payload.links, MAX_LENGTHS.links),
    website: cleanText(payload.website, 120)
  };
}

export async function onRequestGet(context) {
  const db = context.env.ai_ricebowl;

  if (!db) {
    return responseJson({ error: 'ai_ricebowl binding is not configured.' }, { status: 503 });
  }

  const { results } = await db.prepare(
    `SELECT id, title, subtitle, date, read_time, category, author, image, introduction, sections_json, tags_json
     FROM user_survival_guides
     WHERE status = 'published'
     ORDER BY date DESC, created_at DESC`
  ).all();

  return responseJson({
    guides: results.map((row) => ({
      id: row.id,
      title: row.title,
      subtitle: row.subtitle,
      date: row.date,
      readTime: row.read_time,
      category: row.category,
      author: row.author,
      image: row.image,
      introduction: row.introduction,
      sections: JSON.parse(row.sections_json || '[]'),
      tags: JSON.parse(row.tags_json || '[]'),
      sourceType: 'user'
    }))
  });
}

export async function onRequestPost(context) {
  const db = context.env.ai_ricebowl;

  if (!db) {
    return responseJson({ error: 'ai_ricebowl binding is not configured.' }, { status: 503 });
  }

  const auth = await requireUser(context);
  if (auth.response) return auth.response;

  let payload;
  try {
    payload = await context.request.json();
  } catch (error) {
    return responseJson({ error: 'JSON 본문을 읽을 수 없습니다.' }, { status: 400 });
  }

  const input = normalizePayload(payload || {});
  input.author = input.author || auth.user.name || '익명 개발자';
  input.contact = input.contact
    ? `${auth.user.email} · ${input.contact}`
    : auth.user.email;

  const errors = validate(input);

  if (errors.length) {
    return responseJson({ error: errors[0], errors }, { status: 400 });
  }

  const id = `user-guide-${crypto.randomUUID()}`;
  const sections = buildSections(input);
  const tags = [
    input.category,
    ...splitList(input.tools, 4)
  ].filter(Boolean).slice(0, 6);

  await db.prepare(
    `INSERT INTO user_survival_guides
      (id, title, subtitle, date, read_time, category, author, image, introduction,
       sections_json, tags_json, status, submitter_contact)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?)`
  ).bind(
    id,
    input.title,
    input.subtitle,
    today(),
    estimateReadTime(input.introduction, input.strategy, input.actions, input.tools),
    input.category,
    input.author,
    'assets/blog_survival.png',
    input.introduction,
    JSON.stringify(sections),
    JSON.stringify(tags),
    input.contact || null
  ).run();

  return responseJson({
    ok: true,
    id,
    status: 'pending',
    message: '생존 가이드 초안이 접수되었습니다. 검토 후 공개 목록에 반영됩니다.'
  }, { status: 201 });
}
