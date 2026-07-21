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
    `SELECT id, title, category, date, read_time, views, tags_json, summary, content,
            trends_json, why_matters_json, developer_actions_json, risks_json, source_links_json
     FROM trend_cards
     WHERE active = 1
     ORDER BY date DESC, sort_order ASC`
  ).all();

  return new Response(JSON.stringify({
    trends: results.map((row) => ({
      id: row.id,
      title: row.title,
      category: row.category,
      date: row.date,
      readTime: row.read_time,
      views: row.views,
      tags: parseJson(row.tags_json, []),
      summary: row.summary,
      content: row.content,
      trends: parseJson(row.trends_json, []),
      whyMatters: parseJson(row.why_matters_json, []),
      developerActions: parseJson(row.developer_actions_json, []),
      risks: parseJson(row.risks_json, []),
      sourceLinks: parseJson(row.source_links_json, [])
    }))
  }), { headers: JSON_HEADERS });
}
