#!/bin/bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
WRANGLER_HOME_DIR="${WRANGLER_HOME_DIR:-$REPO_ROOT/.wrangler-home}"

cd "$REPO_ROOT"
mkdir -p "$WRANGLER_HOME_DIR"

echo "Logging in to Cloudflare with Wrangler home:"
echo "  $WRANGLER_HOME_DIR"
echo
echo "If browser authorization fails, re-run with:"
echo "  BROWSER=0 $0"
echo
echo "If OAuth keeps failing, use a Cloudflare API Token instead:"
echo "  1. Create $REPO_ROOT/.env.cloudflare"
echo "  2. Add CLOUDFLARE_API_TOKEN=..."
echo "  3. Run bash scripts/deploy_cloudflare_dynamic.sh"
echo

BROWSER_FLAG="${BROWSER:-1}"
if [[ "$BROWSER_FLAG" == "0" ]]; then
  BROWSER_ARG="--browser=false"
else
  BROWSER_ARG="--browser=true"
fi

HOME="$WRANGLER_HOME_DIR" npx wrangler login \
  "$BROWSER_ARG" \
  --callback-host 127.0.0.1 \
  --callback-port 8976 \
  --scopes account:read \
  --scopes user:read \
  --scopes pages:write \
  --scopes d1:write

HOME="$WRANGLER_HOME_DIR" npx wrangler whoami
