#!/bin/bash
set -euo pipefail

# Installs a macOS launchd fallback job for the daily RSS pipeline.
# This is meant to complement Codex Automation when the local app scheduler
# misses a trigger. It does not replace the Codex Automation card.

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
PLIST_PATH="$HOME/Library/LaunchAgents/com.ai-ricebowl.daily-rss.plist"
LOG_DIR="$REPO_ROOT/logs"

mkdir -p "$HOME/Library/LaunchAgents" "$LOG_DIR"

cat >"$PLIST_PATH" <<PLIST
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN"
  "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key>
  <string>com.ai-ricebowl.daily-rss</string>

  <key>ProgramArguments</key>
  <array>
    <string>/bin/bash</string>
    <string>${REPO_ROOT}/scripts/run_daily_rss_with_retry.sh</string>
  </array>

  <key>WorkingDirectory</key>
  <string>${REPO_ROOT}</string>

  <key>StartCalendarInterval</key>
  <dict>
    <key>Hour</key>
    <integer>9</integer>
    <key>Minute</key>
    <integer>0</integer>
  </dict>

  <key>EnvironmentVariables</key>
  <dict>
    <key>RUN_CODEX_ANALYSIS</key>
    <string>1</string>
    <key>CODEX_MODEL</key>
    <string>gpt-5.5</string>
  </dict>

  <key>StandardOutPath</key>
  <string>${LOG_DIR}/launchd-daily-rss.out.log</string>
  <key>StandardErrorPath</key>
  <string>${LOG_DIR}/launchd-daily-rss.err.log</string>

  <key>RunAtLoad</key>
  <false/>
</dict>
</plist>
PLIST

launchctl unload "$PLIST_PATH" >/dev/null 2>&1 || true
launchctl load "$PLIST_PATH"

echo "Installed launchd job: $PLIST_PATH"
echo "Check logs:"
echo "  $LOG_DIR/launchd-daily-rss.out.log"
echo "  $LOG_DIR/launchd-daily-rss.err.log"
echo "  $LOG_DIR/daily-rss-runner.log"
