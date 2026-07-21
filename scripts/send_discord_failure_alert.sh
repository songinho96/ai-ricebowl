#!/bin/bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
REPORT_DATE="${1:-$(date '+%Y-%m-%d')}"
EXIT_CODE="${2:-1}"
LOG_FILE="${3:-$REPO_ROOT/logs/daily-rss-runner.log}"
DISCORD_TARGET="${DISCORD_NOTIFY_TO:-${AI_RICEBOWL_DISCORD_TO:-channel:1522113030924664934}}"

if [[ -s "$HOME/.nvm/nvm.sh" ]]; then
  # shellcheck disable=SC1091
  source "$HOME/.nvm/nvm.sh"
  nvm use 22.19.0 >/dev/null
fi

if ! command -v openclaw >/dev/null 2>&1; then
  echo "OpenClaw CLI is not available." >&2
  exit 1
fi

LOG_TAIL=""
if [[ -f "$LOG_FILE" ]]; then
  LOG_TAIL="$(tail -n 12 "$LOG_FILE" | sed 's/[`]/'\''/g')"
fi

MESSAGE="$(cat <<EOF
**AI 밥그릇 자동화 실패 - ${REPORT_DATE}**

상태: 실패
exit code: ${EXIT_CODE}
로그: ${LOG_FILE}

최근 로그:
\`\`\`text
${LOG_TAIL}
\`\`\`
EOF
)"

openclaw message send \
  --channel discord \
  --target "$DISCORD_TARGET" \
  --message "$MESSAGE"
