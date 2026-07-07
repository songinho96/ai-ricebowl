# Cloudflare Dynamic Deployment

AI RiceBowl can run as a dynamic site on Cloudflare Pages Functions with Cloudflare D1 as the database.

This keeps the public site free to start:

- Cloudflare Pages serves the frontend.
- Pages Functions serve `/api/*`.
- D1 stores crawled news, summaries, trend cards, survival guides, and report metadata.
- Existing static JS files remain as fallback data if the API or D1 binding is unavailable.

## Why Cloudflare

The current project is a small read-heavy dashboard. Cloudflare's free developer platform is a good fit because:

- Static assets can be served from Pages.
- Pages Functions can read D1 through a binding.
- D1 Free currently includes enough capacity for this project scale: 5 million rows read/day, 100,000 rows written/day, and 5 GB total storage.
- Workers Free currently includes 100,000 dynamic requests/day, while static asset requests are free and unlimited.

Confirm current limits before serious public launch:

- D1 pricing: https://developers.cloudflare.com/d1/platform/pricing/
- Workers/Pages Functions pricing: https://developers.cloudflare.com/workers/platform/pricing/
- Pages D1 bindings: https://developers.cloudflare.com/pages/functions/bindings/

## One-time Setup

Install dependencies:

```bash
npm install
```

Log in to Cloudflare:

```bash
npx wrangler login
```

Create the D1 database:

```bash
npx wrangler d1 create ai-ricebowl
```

Copy the returned `database_id` into `wrangler.toml`:

```toml
[[d1_databases]]
binding = "AI_RICEBOWL_DB"
database_name = "ai-ricebowl"
database_id = "<returned-database-id>"
```

Apply schema and seed data:

```bash
npm run db:seed
npx wrangler d1 execute ai-ricebowl --remote --file=db/schema.sql
npx wrangler d1 execute ai-ricebowl --remote --file=db/seed.sql
```

Create a Cloudflare Pages project:

1. Cloudflare Dashboard > Workers & Pages > Create application > Pages.
2. Connect the GitHub repository.
3. Use these build settings:
   - Framework preset: None
   - Build command: empty
   - Build output directory: `/`
4. Add a D1 binding:
   - Settings > Bindings > Add > D1 database bindings
   - Variable name: `AI_RICEBOWL_DB`
   - D1 database: `ai-ricebowl`
5. Redeploy the Pages project.

## Local Development

For simple static fallback testing:

```bash
python3 -m http.server 8088
```

For dynamic API testing with Wrangler:

```bash
npm install
npm run db:seed
npx wrangler d1 execute ai-ricebowl --local --file=db/schema.sql
npx wrangler d1 execute ai-ricebowl --local --file=db/seed.sql
npm run dev:cloudflare
```

The app fetches `/api/bootstrap`. If the function or DB binding is unavailable, it falls back to the committed JS files.

## Daily Update Flow

After the Codex RSS analyst automation updates local files:

```bash
npm run db:seed
npx wrangler d1 execute ai-ricebowl --remote --file=db/schema.sql
npx wrangler d1 execute ai-ricebowl --remote --file=db/seed.sql
```

This keeps D1 aligned with:

- `crawled_data.js`
- `daily_trends.js`
- `daily_survival_guides.js`
- `reports/rss/*.md`

## API Endpoints

- `GET /api/bootstrap`: complete dashboard payload
- `GET /api/news?region=overseas&limit=80`: news list
- `GET /api/trends`: trend cards
- `GET /api/guides`: survival guides

All current endpoints are read-only.

## Operational Notes

- Keep `wrangler.toml` committed with the binding name, but do not commit account tokens.
- `db/seed.sql` contains public RSS/report content only. Regenerate it after daily content updates.
- If traffic grows beyond the free limits, optimize queries with indexes before considering a paid plan.
- If you need authenticated editing in the browser later, add Cloudflare Access or a protected admin route instead of exposing write APIs publicly.
