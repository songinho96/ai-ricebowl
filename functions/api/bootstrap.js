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
    `SELECT id, source, title, korean_title, link, description, summary, full_summary, korean_summary,
            pub_date, region, region_label, categories_json, feed_categories_json,
            author, guid, comments, enclosure_json, feed_meta_json
     FROM crawled_news
     ORDER BY sort_order ASC`
  );
  const { results: chunkRows } = await all(
    db,
    `SELECT news_id, chunk_index, content
     FROM crawled_news_summary_chunks
     ORDER BY news_id ASC, chunk_index ASC`
  );
  const chunksByNewsId = {};

  chunkRows.forEach((row) => {
    chunksByNewsId[row.news_id] = chunksByNewsId[row.news_id] || [];
    chunksByNewsId[row.news_id].push(row.content);
  });

  return results.map((row) => ({
    id: row.id,
    source: row.source,
    title: row.title,
    koreanTitle: row.korean_title,
    link: row.link,
    description: row.description,
    summary: row.summary,
    fullSummary: chunksByNewsId[row.id]?.join('') || row.full_summary,
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
     ORDER BY date DESC, sort_order ASC`
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
     ORDER BY date DESC, sort_order ASC`
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
     ORDER BY date DESC`
  );

  return results.map((row) => ({
    date: row.date,
    title: row.title,
    path: row.path,
    createdAt: row.created_at
  }));
}

export async function onRequestGet(context) {
  const db = context.env.ai_ricebowl;

  if (!db) {
    return responseJson({
      error: 'ai_ricebowl binding is not configured.'
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
