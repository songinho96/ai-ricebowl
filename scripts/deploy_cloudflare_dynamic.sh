#!/bin/bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
PROJECT_NAME="${PROJECT_NAME:-ai-ricebowl}"
DB_NAME="${DB_NAME:-ai-ricebowl}"

cd "$REPO_ROOT"

if ! command -v npm >/dev/null 2>&1; then
  echo "npm is required." >&2
  exit 1
fi

if [ ! -d node_modules ]; then
  npm install
fi

if ! npx wrangler whoami >/dev/null 2>&1; then
  echo "Cloudflare Wrangler is not authenticated."
  echo "Run: npx wrangler login"
  exit 1
fi

if grep -q 'REPLACE_WITH_CLOUDFLARE_D1_DATABASE_ID' wrangler.toml; then
  echo "wrangler.toml still has a placeholder database_id."
  echo "Create a D1 database, then copy its database_id into wrangler.toml:"
  echo "  npx wrangler d1 create ${DB_NAME}"
  exit 1
fi

npm run db:seed
npx wrangler d1 execute "$DB_NAME" --remote --file=db/schema.sql
npx wrangler d1 execute "$DB_NAME" --remote --file=db/seed.sql

npx wrangler pages deploy . \
  --project-name "$PROJECT_NAME" \
  --branch "$(git branch --show-current 2>/dev/null || echo main)" \
  --commit-hash "$(git rev-parse HEAD 2>/dev/null || echo manual)" \
  --commit-message "$(git log -1 --pretty=%s 2>/dev/null || echo 'Manual Cloudflare deploy')" \
  --commit-dirty=false
