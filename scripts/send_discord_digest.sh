#!/bin/bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
REPORT_DATE="${1:-$(date '+%Y-%m-%d')}"
REPORT_PATH="$REPO_ROOT/reports/rss/${REPORT_DATE}-ai-rss-report.md"
DISCORD_TARGET="${DISCORD_NOTIFY_TO:-${AI_RICEBOWL_DISCORD_TO:-channel:1522113030924664934}}"

if [[ ! -f "$REPORT_PATH" ]]; then
  echo "Report not found: $REPORT_PATH" >&2
  exit 1
fi

if [[ -s "$HOME/.nvm/nvm.sh" ]]; then
  # shellcheck disable=SC1091
  source "$HOME/.nvm/nvm.sh"
  nvm use 22.19.0 >/dev/null
fi

if ! command -v openclaw >/dev/null 2>&1; then
  echo "OpenClaw CLI is not available." >&2
  exit 1
fi

DIGEST="$(node - "$REPORT_PATH" "$REPORT_DATE" <<'NODE'
const fs = require('fs');
const path = process.argv[2];
const date = process.argv[3];
const text = fs.readFileSync(path, 'utf8');

function section(name) {
  const re = new RegExp(`## ${name}\\n\\n([\\s\\S]*?)(?=\\n## |$)`);
  return (text.match(re)?.[1] || '').trim();
}

function firstParagraph(name) {
  return section(name).split(/\n\n+/)[0]?.trim() || '';
}

function bullets(name, max = 2) {
  return section(name)
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.startsWith('- '))
    .slice(0, max)
    .map((line) => line.replace(/\*\*/g, ''));
}

const oneLine = firstParagraph('한줄 결론');
const overseas = bullets('해외 핵심 신호', 2);
const domestic = bullets('국내 핵심 신호', 2);

const lines = [
  `**AI 밥그릇 데일리 요약 - ${date}**`,
  '',
  `한줄 결론: ${oneLine}`,
  '',
  '해외:',
  ...overseas,
  '',
  '국내:',
  ...domestic,
  '',
  `리포트: reports/rss/${date}-ai-rss-report.md`,
  '사이트: https://ai-ricebowl.pages.dev/'
];

process.stdout.write(lines.join('\n'));
NODE
)"

openclaw message send \
  --channel discord \
  --target "$DISCORD_TARGET" \
  --message "$DIGEST"
