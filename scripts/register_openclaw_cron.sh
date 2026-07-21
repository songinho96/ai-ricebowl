#!/bin/bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
JOB_NAME="ai-ricebowl-daily-rss"
DISCORD_NOTIFY_TO="${DISCORD_NOTIFY_TO:-channel:1522113030924664934}"
JOB_COMMAND="RUN_CODEX_ANALYSIS=1 SYNC_CLOUDFLARE=1 SEND_DISCORD_DIGEST=1 bash scripts/run_daily_rss_with_retry.sh"

if [ -s "$HOME/.nvm/nvm.sh" ]; then
  # shellcheck disable=SC1091
  source "$HOME/.nvm/nvm.sh"
  nvm use 22.19.0 >/dev/null
fi

if ! command -v openclaw >/dev/null 2>&1; then
  echo "OpenClaw CLI가 설치되어 있지 않습니다."
  echo "설치: npm install -g openclaw@latest"
  exit 1
fi

if ! openclaw gateway status >/dev/null 2>&1; then
  echo "OpenClaw Gateway 상태 확인에 실패했습니다. gateway service가 실행 중인지 확인하세요."
  echo "예: openclaw gateway install && openclaw gateway start"
  exit 1
fi

EXISTING_ID="$(openclaw cron list --json 2>/dev/null | node -e "let data=''; process.stdin.on('data', c => data += c); process.stdin.on('end', () => { const parsed = JSON.parse(data || '{}'); const jobs = parsed.jobs || parsed.entries || []; const hit = jobs.find(j => j.name === '$JOB_NAME'); if (hit) process.stdout.write(hit.id || ''); });")"

DELIVERY_ARGS=(--no-deliver --clear-channel --clear-to --no-failure-alert)
if [ -n "$DISCORD_NOTIFY_TO" ]; then
  DELIVERY_ARGS=(
    --announce
    --best-effort-deliver
    --channel discord
    --to "$DISCORD_NOTIFY_TO"
  )
fi

if [ -n "$EXISTING_ID" ]; then
  echo "기존 OpenClaw cron job 업데이트: $EXISTING_ID"
  openclaw cron edit "$EXISTING_ID" \
    --cron "0 9 * * *" \
    --tz "Asia/Seoul" \
    --command "$JOB_COMMAND" \
    --command-cwd "$PROJECT_DIR" \
    --timeout-seconds 1800 \
    --output-max-bytes 60000 \
    "${DELIVERY_ARGS[@]}" \
    --failure-alert \
    --failure-alert-mode announce \
    --failure-alert-channel discord \
    --failure-alert-to "$DISCORD_NOTIFY_TO" \
    --failure-alert-after 1 \
    --failure-alert-cooldown 1h
else
  echo "OpenClaw cron job 생성: $JOB_NAME"
  CREATED_OUTPUT="$(openclaw cron add \
    --name "$JOB_NAME" \
    --description "Collect RSS feeds, refresh Codex analysis, sync D1, and deploy Cloudflare Pages every morning" \
    --cron "0 9 * * *" \
    --tz "Asia/Seoul" \
    --command "$JOB_COMMAND" \
    --command-cwd "$PROJECT_DIR" \
    --timeout-seconds 1800 \
    --output-max-bytes 60000 \
    "${DELIVERY_ARGS[@]}")"
  echo "$CREATED_OUTPUT"

  CREATED_ID="$(printf '%s' "$CREATED_OUTPUT" | node -e "let data=''; process.stdin.on('data', c => data += c); process.stdin.on('end', () => { const match = data.match(/\"id\"\\s*:\\s*\"([^\"]+)\"/); if (match) process.stdout.write(match[1]); });")"
  if [ -n "$CREATED_ID" ] && [ -n "$DISCORD_NOTIFY_TO" ]; then
    echo "OpenClaw cron failure alert 설정: $CREATED_ID"
    openclaw cron edit "$CREATED_ID" \
      --failure-alert \
      --failure-alert-mode announce \
      --failure-alert-channel discord \
      --failure-alert-to "$DISCORD_NOTIFY_TO" \
      --failure-alert-after 1 \
      --failure-alert-cooldown 1h
  fi
fi

echo "등록 완료. 확인: openclaw cron show <job-id>"
