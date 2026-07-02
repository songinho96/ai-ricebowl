#!/bin/bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
JOB_NAME="ai-ricebowl-daily-rss"

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

if [ -n "$EXISTING_ID" ]; then
  echo "기존 OpenClaw cron job 업데이트: $EXISTING_ID"
  openclaw cron edit "$EXISTING_ID" \
    --cron "0 9 * * *" \
    --tz "Asia/Seoul" \
    --command "bash run_crawler.sh" \
    --command-cwd "$PROJECT_DIR" \
    --timeout-seconds 300 \
    --output-max-bytes 20000 \
    --no-deliver \
    --clear-channel
else
  echo "OpenClaw cron job 생성: $JOB_NAME"
  openclaw cron add \
    --name "$JOB_NAME" \
    --description "Collect RSS feeds and regenerate crawled_data.js every morning" \
    --cron "0 9 * * *" \
    --tz "Asia/Seoul" \
    --command "bash run_crawler.sh" \
    --command-cwd "$PROJECT_DIR" \
    --timeout-seconds 300 \
    --output-max-bytes 20000 \
    --no-deliver
fi

echo "등록 완료. 확인: openclaw cron show <job-id>"
