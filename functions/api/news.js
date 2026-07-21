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
  const db = context.env.ai_ricebowl;
  if (!db) {
    return responseJson({ error: 'ai_ricebowl binding is not configured.' }, { status: 503 });
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
    `SELECT source, title, korean_title, link, description, summary, full_summary, korean_summary,
            pub_date, region, region_label, categories_json, feed_categories_json,
            author, guid, comments, enclosure_json, feed_meta_json
     FROM crawled_news
     ${where}
     ORDER BY sort_order ASC
     LIMIT ?`
  ).bind(...params).all();

  return responseJson({
    news: results.map((row) => ({
      source: row.source,
      title: row.title,
      koreanTitle: row.korean_title,
      link: row.link,
      description: row.description,
      summary: row.summary,
      fullSummary: row.full_summary,
      koreanSummary: row.korean_summary,
      pubDate: row.pub_date,
      region: row.region,
      regionLabel: row.region_label,
      categories: parseJson(row.categories_json, []),
      feedCategories: parseJson(row.feed_categories_json, []),
      author: row.author,
      guid: row.guid,
      comments: row.comments,
      enclosure: parseJson(row.enclosure_json, {}),
      feedMeta: parseJson(row.feed_meta_json, {})
    }))
  });
}
