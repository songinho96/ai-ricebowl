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
RUN_CODEX_ANALYSIS="${RUN_CODEX_ANALYSIS:-0}"
CODEX_MODEL="${CODEX_MODEL:-gpt-5.5}"

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
- Update reports/rss/YYYY-MM-DD-ai-rss-report.md for today.
- Update daily_trends.js with developer-useful source-backed trend cards.
- Update daily_survival_guides.js with detailed developer survival guides.
- Do not read or print secrets.
- Keep changes scoped to RSS/report/site data files.'

  log "Starting Codex analytical refresh for ${TODAY}."
  codex exec -C "$REPO_ROOT" -m "$CODEX_MODEL" -s workspace-write -a never "$PROMPT" >>"$LOG_FILE" 2>&1
  log "Codex analytical refresh completed."
else
  log "Skipping Codex analytical refresh. Set RUN_CODEX_ANALYSIS=1 to enable it."
fi

log "Daily RSS fallback runner completed."
