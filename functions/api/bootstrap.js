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

async function all(db, sql, params = []) {
  return db.prepare(sql).bind(...params).all();
}

async function loadNews(db) {
  const { results } = await all(
    db,
    `SELECT source, title, link, description, pub_date, region, region_label, categories_json
     FROM crawled_news
     ORDER BY sort_order ASC`
  );

  return results.map((row) => ({
    source: row.source,
    title: row.title,
    link: row.link,
    description: row.description,
    pubDate: row.pub_date,
    region: row.region,
    regionLabel: row.region_label,
    categories: parseJson(row.categories_json, [])
  }));
}

async function loadSummaries(db) {
  const { results } = await all(
    db,
    `SELECT region, period, content
     FROM crawled_summaries
     ORDER BY region ASC, period ASC`
  );
  const summaries = {};

  results.forEach((row) => {
    summaries[row.region] = summaries[row.region] || {};
    summaries[row.region][row.period] = row.content;
  });

  return summaries;
}

async function loadTrends(db) {
  const { results } = await all(
    db,
    `SELECT id, title, category, date, read_time, views, tags_json, summary, content,
            trends_json, why_matters_json, developer_actions_json, risks_json, source_links_json
     FROM trend_cards
     WHERE active = 1
     ORDER BY sort_order ASC`
  );

  return results.map((row) => ({
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
  }));
}

async function loadGuides(db) {
  const { results } = await all(
    db,
    `SELECT id, title, subtitle, date, read_time, category, author, image, introduction, sections_json
     FROM survival_guides
     WHERE active = 1
     ORDER BY sort_order ASC`
  );

  return results.map((row) => ({
    id: row.id,
    title: row.title,
    subtitle: row.subtitle,
    date: row.date,
    readTime: row.read_time,
    category: row.category,
    author: row.author,
    image: row.image,
    introduction: row.introduction,
    sections: parseJson(row.sections_json, [])
  }));
}

async function loadReports(db) {
  const { results } = await all(
    db,
    `SELECT date, title, path, created_at
     FROM daily_reports
     ORDER BY date DESC
     LIMIT 14`
  );

  return results.map((row) => ({
    date: row.date,
    title: row.title,
    path: row.path,
    createdAt: row.created_at
  }));
}

export async function onRequestGet(context) {
  const db = context.env.AI_RICEBOWL_DB;

  if (!db) {
    return responseJson({
      error: 'AI_RICEBOWL_DB binding is not configured.'
    }, { status: 503 });
  }

  const [news, summaries, trends, guides, reports] = await Promise.all([
    loadNews(db),
    loadSummaries(db),
    loadTrends(db),
    loadGuides(db),
    loadReports(db)
  ]);

  return responseJson({
    source: 'cloudflare-d1',
    updatedAt: new Date().toISOString(),
    news,
    summaries,
    trends,
    guides,
    reports
  });
}
