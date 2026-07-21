PRAGMA foreign_keys = ON;

DROP INDEX IF EXISTS idx_crawled_news_region_sort;
DROP INDEX IF EXISTS idx_crawled_news_source;
DROP TABLE IF EXISTS crawled_news_summary_chunks;
DROP TABLE IF EXISTS crawled_news;

CREATE TABLE IF NOT EXISTS crawled_news (
  id TEXT PRIMARY KEY,
  source TEXT NOT NULL,
  title TEXT NOT NULL,
  korean_title TEXT,
  link TEXT NOT NULL UNIQUE,
  description TEXT,
  summary TEXT,
  full_summary TEXT,
  korean_summary TEXT,
  pub_date TEXT,
  region TEXT NOT NULL CHECK (region IN ('overseas', 'domestic')),
  region_label TEXT NOT NULL,
  categories_json TEXT NOT NULL DEFAULT '[]',
  feed_categories_json TEXT NOT NULL DEFAULT '[]',
  author TEXT,
  guid TEXT,
  comments TEXT,
  enclosure_json TEXT NOT NULL DEFAULT '{}',
  feed_meta_json TEXT NOT NULL DEFAULT '{}',
  sort_order INTEGER NOT NULL DEFAULT 0,
  collected_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_crawled_news_region_sort
  ON crawled_news(region, sort_order);

CREATE INDEX IF NOT EXISTS idx_crawled_news_source
  ON crawled_news(source);

CREATE TABLE IF NOT EXISTS crawled_news_summary_chunks (
  news_id TEXT NOT NULL,
  chunk_index INTEGER NOT NULL,
  content TEXT NOT NULL,
  PRIMARY KEY (news_id, chunk_index)
);

CREATE TABLE IF NOT EXISTS crawled_summaries (
  region TEXT NOT NULL,
  period TEXT NOT NULL CHECK (period IN ('daily', 'weekly', 'monthly')),
  content TEXT NOT NULL,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (region, period)
);

CREATE TABLE IF NOT EXISTS trend_cards (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  date TEXT NOT NULL,
  read_time TEXT NOT NULL,
  views TEXT NOT NULL,
  tags_json TEXT NOT NULL DEFAULT '[]',
  summary TEXT NOT NULL,
  content TEXT NOT NULL,
  trends_json TEXT NOT NULL DEFAULT '[]',
  why_matters_json TEXT NOT NULL DEFAULT '[]',
  developer_actions_json TEXT NOT NULL DEFAULT '[]',
  risks_json TEXT NOT NULL DEFAULT '[]',
  source_links_json TEXT NOT NULL DEFAULT '[]',
  sort_order INTEGER NOT NULL DEFAULT 0,
  active INTEGER NOT NULL DEFAULT 1,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_trend_cards_active_sort
  ON trend_cards(active, sort_order);

CREATE INDEX IF NOT EXISTS idx_trend_cards_date_sort
  ON trend_cards(date DESC, sort_order);

CREATE TABLE IF NOT EXISTS survival_guides (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  date TEXT NOT NULL,
  read_time TEXT NOT NULL,
  category TEXT NOT NULL,
  author TEXT NOT NULL,
  image TEXT NOT NULL,
  introduction TEXT NOT NULL,
  sections_json TEXT NOT NULL DEFAULT '[]',
  sort_order INTEGER NOT NULL DEFAULT 0,
  active INTEGER NOT NULL DEFAULT 1,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_survival_guides_active_sort
  ON survival_guides(active, sort_order);

CREATE INDEX IF NOT EXISTS idx_survival_guides_date_sort
  ON survival_guides(date DESC, sort_order);

CREATE TABLE IF NOT EXISTS daily_reports (
  date TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  path TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_daily_reports_created
  ON daily_reports(created_at);
