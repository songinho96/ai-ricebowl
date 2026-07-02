#!/bin/bash
set -euo pipefail

# AI 밥그릇 실시간 크롤러 실행기
# 이 스크립트를 주기적으로 실행하면 최신 IT 뉴스와 로컬 요약본이 갱신됩니다.

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
LOG_FILE="$SCRIPT_DIR/crawler.log"
PYTHON_BIN="${PYTHON_BIN:-/usr/bin/python3}"

echo "[$(date)] 크롤링 작업 시작..." | tee -a "$LOG_FILE"
"$PYTHON_BIN" "$SCRIPT_DIR/crawler.py" 2>&1 | tee -a "$LOG_FILE"
echo "[$(date)] 크롤링 작업 종료." | tee -a "$LOG_FILE"

# --- cron 스케줄링 가이드 ---
# 터미널에서 `crontab -e` 명령어를 실행하고 아래 줄을 추가하면 매일 오전 9시에 자동으로 크롤러가 실행됩니다.
# 0 9 * * * /bin/bash /Users/songinho/Desktop/AI밥그릇/run_crawler.sh
