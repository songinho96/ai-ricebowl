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
bash scripts/login_cloudflare_wrangler.sh
```

The deploy helper uses `WRANGLER_HOME_DIR="$PWD/.wrangler-home"` by default so Codex/local automation can write Wrangler logs and auth state inside the project instead of macOS user preference directories. Override `WRANGLER_HOME_DIR` only if the scheduled runner has access to another authenticated Wrangler home.

If the Cloudflare OAuth page shows "Application authorization failed", retry with a manual browser URL and minimal scopes:

```bash
BROWSER=0 bash scripts/login_cloudflare_wrangler.sh
```

Copy the printed URL into the browser where you are logged into the correct Cloudflare account.

If OAuth still fails, use a Cloudflare API Token instead. Create a local, ignored file:

```bash
cat > .env.cloudflare <<'EOF'
CLOUDFLARE_API_TOKEN=replace_with_token
# Optional if Wrangler cannot infer the account:
# CLOUDFLARE_ACCOUNT_ID=replace_with_account_id
EOF
```

Create the token in Cloudflare Dashboard with only the project deployment permissions needed for this repo:

- Account > Cloudflare Pages > Edit
- Account > D1 > Edit
- Account > Account Settings > Read

Scope the token to the account that owns `ai-ricebowl.pages.dev`.

Create the D1 database:

```bash
npx wrangler d1 create ai-ricebowl
```

Copy the returned `database_id` into `wrangler.toml`:

```toml
[[d1_databases]]
binding = "ai_ricebowl"
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
   - Variable name: `ai_ricebowl`
   - D1 database: `ai-ricebowl`
5. Redeploy the Pages project.

After the one-time D1 setup, you can deploy from the repository root with:

```bash
bash scripts/deploy_cloudflare_dynamic.sh
```

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

Or run the full deploy helper:

```bash
bash scripts/deploy_cloudflare_dynamic.sh
```

This keeps D1 aligned with:

- `crawled_data.js`
- `daily_trends.js`
- `daily_survival_guides.js`
- `reports/rss/*.md`

The local fallback runner publishes automatically after the crawler and Codex analysis complete:

```bash
RUN_CODEX_ANALYSIS=1 SYNC_CLOUDFLARE=1 bash scripts/run_daily_rss_with_retry.sh
```

`SYNC_CLOUDFLARE` defaults to `1` in the runner and in the launchd fallback installed by `scripts/install_launchd_daily_rss.sh`. If Wrangler is not authenticated, the publish step fails loudly in `logs/daily-rss-runner.log`; run `bash scripts/login_cloudflare_wrangler.sh` once on the machine that performs the scheduled run.

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
