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

function responseJson(payload, init = {}) {
  return new Response(JSON.stringify(payload), {
    ...init,
    headers: {
      ...JSON_HEADERS,
      ...(init.headers || {})
    }
  });
}

export async function onRequestGet(context) {
  const db = context.env.AI_RICEBOWL_DB;
  if (!db) {
    return responseJson({ error: 'AI_RICEBOWL_DB binding is not configured.' }, { status: 503 });
  }

  const url = new URL(context.request.url);
  const region = url.searchParams.get('region');
  const limit = Math.min(Number(url.searchParams.get('limit') || 80), 250);
  const params = [];
  let where = '';

  if (region === 'overseas' || region === 'domestic') {
    where = 'WHERE region = ?';
    params.push(region);
  }

  params.push(limit);

  const { results } = await db.prepare(
    `SELECT source, title, link, description, pub_date, region, region_label, categories_json
     FROM crawled_news
     ${where}
     ORDER BY sort_order ASC
     LIMIT ?`
  ).bind(...params).all();

  return responseJson({
    news: results.map((row) => ({
      source: row.source,
      title: row.title,
      link: row.link,
      description: row.description,
      pubDate: row.pub_date,
      region: row.region,
      regionLabel: row.region_label,
      categories: parseJson(row.categories_json, [])
    }))
  });
}
