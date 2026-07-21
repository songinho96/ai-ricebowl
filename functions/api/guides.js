const JSON_HEADERS = {
  'content-type': 'application/json; charset=utf-8',
  'cache-control': 'public, max-age=120'
};

function parseJson(value, fallback) {
  if (!value) return fallback;
  try {
    return JSON.parse(value);
  } catch (error) {
    return fallback;
  }
}

export async function onRequestGet(context) {
  const db = context.env.ai_ricebowl;
  if (!db) {
    return new Response(JSON.stringify({ error: 'ai_ricebowl binding is not configured.' }), {
      status: 503,
      headers: JSON_HEADERS
    });
  }

  const { results } = await db.prepare(
    `SELECT id, title, subtitle, date, read_time, category, author, image, introduction, sections_json
     FROM survival_guides
     WHERE active = 1
     ORDER BY date DESC, sort_order ASC`
  ).all();
  const { results: userResults } = await db.prepare(
    `SELECT id, title, subtitle, date, read_time, category, author, image, introduction, sections_json
     FROM user_survival_guides
     WHERE status = 'published'
     ORDER BY date DESC, created_at DESC`
  ).all();

  const autoGuides = results.map((row) => ({
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
    sourceType: 'auto'
  }));
  const userGuides = userResults.map((row) => ({
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
    sourceType: 'user'
  }));

  return new Response(JSON.stringify({
    guides: [...autoGuides, ...userGuides]
      .sort((a, b) => `${b.date}-${b.sourceType}`.localeCompare(`${a.date}-${a.sourceType}`))
  }), { headers: JSON_HEADERS });
}
