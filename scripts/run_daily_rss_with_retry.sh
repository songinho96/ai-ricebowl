#!/bin/bash
set -euo pipefail

# Local fallback runner for AI RiceBowl daily RSS work.
# It keeps the Mac awake while running, retries transient crawler failures,
# and can optionally ask Codex CLI to refresh analytical site data.

if [[ "${AI_RICEBOWL_CAFFEINATED:-0}" != "1" ]] && command -v /usr/bin/caffeinate >/dev/null 2>&1; then
  export AI_RICEBOWL_CAFFEINATED=1
  exec /usr/bin/caffeinate -dimsu "$0" "$@"
fi

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
LOG_DIR="$REPO_ROOT/logs"
LOG_FILE="$LOG_DIR/daily-rss-runner.log"
LOCK_DIR="/tmp/ai-ricebowl-daily-rss.lock"
MAX_ATTEMPTS="${MAX_ATTEMPTS:-3}"
SLEEP_SECONDS="${SLEEP_SECONDS:-90}"
RUN_CODEX_ANALYSIS="${RUN_CODEX_ANALYSIS:-1}"
CODEX_MODEL="${CODEX_MODEL:-gpt-5.5}"
SYNC_CLOUDFLARE="${SYNC_CLOUDFLARE:-1}"
SEND_DISCORD_DIGEST="${SEND_DISCORD_DIGEST:-1}"
RUN_COMPLETED=0

mkdir -p "$LOG_DIR"

log() {
  printf '[%s] %s\n' "$(date '+%Y-%m-%d %H:%M:%S %Z')" "$*" | tee -a "$LOG_FILE"
}

if ! mkdir "$LOCK_DIR" 2>/dev/null; then
  log "Another daily RSS run is already active; exiting."
  exit 0
fi

cleanup() {
  rmdir "$LOCK_DIR" 2>/dev/null || true
}
trap cleanup EXIT

send_failure_alert() {
  local exit_code="$1"

  if [[ "$RUN_COMPLETED" == "1" || "${SEND_DISCORD_DIGEST:-1}" != "1" ]]; then
    return
  fi

  log "Daily RSS runner failed with exit code ${exit_code}; attempting Discord failure alert."
  if [[ -x "$REPO_ROOT/scripts/send_discord_failure_alert.sh" ]]; then
    bash "$REPO_ROOT/scripts/send_discord_failure_alert.sh" "$(date '+%Y-%m-%d')" "$exit_code" "$LOG_FILE" >>"$LOG_FILE" 2>&1 || true
  else
    log "Discord failure alert script is missing or not executable."
  fi
}

trap 'exit_code=$?; send_failure_alert "$exit_code"' ERR

cd "$REPO_ROOT"

attempt=1
while [[ "$attempt" -le "$MAX_ATTEMPTS" ]]; do
  log "Starting RSS crawler attempt ${attempt}/${MAX_ATTEMPTS}."
  if bash run_crawler.sh >>"$LOG_FILE" 2>&1; then
    log "RSS crawler completed."
    break
  fi

  if [[ "$attempt" -eq "$MAX_ATTEMPTS" ]]; then
    log "RSS crawler failed after ${MAX_ATTEMPTS} attempts."
    exit 1
  fi

  log "RSS crawler failed; retrying after ${SLEEP_SECONDS}s."
  sleep "$SLEEP_SECONDS"
  attempt=$((attempt + 1))
done

if [[ "$RUN_CODEX_ANALYSIS" == "1" ]]; then
  if ! command -v codex >/dev/null 2>&1; then
    log "RUN_CODEX_ANALYSIS=1 but codex CLI is not available."
    exit 1
  fi

  TODAY="$(date '+%Y-%m-%d')"
  PROMPT='$ai-rss-analyst

Run the AI RiceBowl daily RSS analyst workflow for today.

Important:
- Use the already collected crawled_data.js when it is fresh.
- Prefer current high-signal topics such as agentic workflows, MCP/context engineering, LLM serving cost, AI code review/eval, Cloudflare/edge/data boundaries, and AI governance.
- Update reports/rss/YYYY-MM-DD-ai-rss-report.md for today.
- Update daily_trends.js with developer-useful source-backed trend cards.
- Update daily_survival_guides.js with detailed developer survival guides.
- Validate crawled_data.js, daily_trends.js, and daily_survival_guides.js with Node before finishing.
- Run npm run db:seed after updating site data.
- Publish the updated site data to Cloudflare when the local Wrangler session is authenticated.
- Do not read or print secrets.
- Keep changes scoped to RSS/report/site data files.'

  log "Starting Codex analytical refresh for ${TODAY}."
  codex exec -C "$REPO_ROOT" -m "$CODEX_MODEL" -s workspace-write -a never "$PROMPT" >>"$LOG_FILE" 2>&1
  log "Codex analytical refresh completed."
else
  log "Skipping Codex analytical refresh. Set RUN_CODEX_ANALYSIS=1 to enable it."
fi

if [[ "$SYNC_CLOUDFLARE" == "1" ]]; then
  if [[ ! -f "$REPO_ROOT/scripts/deploy_cloudflare_dynamic.sh" ]]; then
    log "SYNC_CLOUDFLARE=1 but deploy script is missing."
    exit 1
  fi

  log "Publishing latest RSS data to Cloudflare Pages/D1."
  if bash "$REPO_ROOT/scripts/deploy_cloudflare_dynamic.sh" >>"$LOG_FILE" 2>&1; then
    log "Cloudflare publish completed."
  else
    log "Cloudflare publish failed; continuing so the local report and Discord digest can still complete."
  fi
else
  log "Skipping Cloudflare publish. Set SYNC_CLOUDFLARE=1 to enable it."
fi

if [[ "$SEND_DISCORD_DIGEST" == "1" ]]; then
  if [[ ! -f "$REPO_ROOT/scripts/send_discord_digest.sh" ]]; then
    log "SEND_DISCORD_DIGEST=1 but Discord digest script is missing."
    exit 1
  fi

  log "Sending Discord digest."
  if bash "$REPO_ROOT/scripts/send_discord_digest.sh" "$(date '+%Y-%m-%d')" >>"$LOG_FILE" 2>&1; then
    log "Discord digest sent."
  else
    log "Discord digest failed; report files were still generated."
  fi
else
  log "Skipping Discord digest. Set SEND_DISCORD_DIGEST=1 to enable it."
fi

RUN_COMPLETED=1
log "Daily RSS fallback runner completed."
