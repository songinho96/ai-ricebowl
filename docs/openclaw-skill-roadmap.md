# OpenClaw Skill Roadmap

This document records which community OpenClaw skills are useful for AI RiceBowl, what was installed, and what still needs product or infrastructure setup.

## Installed Skills

The following skills were installed into the project-local `skills/` directory.

| Skill | Purpose | Status | Notes |
| --- | --- | --- | --- |
| `agents-skill-security-audit` | Heuristic audit for `SKILL.md`-style supply-chain risks | Installed | ClawHub verification passed. Useful before adding more community skills. |
| `clawgears-security-audit` | Broader OpenClaw environment security audit | Installed | ClawHub verification passed. Some checks may inspect local OpenClaw config and should remain read-only unless explicitly fixing. |
| `freshrss-reader` | Query a self-hosted FreshRSS instance | Installed, not configured | Requires `FRESHRSS_URL`, `FRESHRSS_USER`, and `FRESHRSS_API_PASSWORD`. Useful if RSS collection moves from direct feed fetching to a managed RSS backend. |

## Not Installed

| Skill | Reason |
| --- | --- |
| `cron-retry` | ClawHub verification failed because broad automatic cron re-runs can be risky. Instead, this project uses a narrow fallback runner in `scripts/run_daily_rss_with_retry.sh`. |
| `ak-rss-24h-brief` | Useful idea, but not needed because AI RiceBowl already has a project-specific RSS analyst skill. |
| `openclaw-free-web-search` | Potentially useful later for source verification, but it introduces a self-hosted SearXNG dependency and should be reviewed separately. |
| `blog-writer` | The writing need is better handled inside `.agents/skills/ai-rss-analyst` so the output stays source-backed and product-specific. |

## Current Recommendation

Use OpenClaw community skills only for narrow, inspectable capabilities. The core daily analysis should remain project-owned in `.agents/skills/ai-rss-analyst` because it understands:

- The AI RiceBowl audience
- Domestic vs overseas source balance
- Developer-focused trend cards
- Developer survival guide quality standards
- No-API-key constraints
- Discord bot's limited role

## FreshRSS Migration Path

FreshRSS is worth considering if direct RSS fetching becomes hard to maintain.

1. Deploy FreshRSS locally or on a small always-on server.
2. Add all current overseas/domestic feeds to FreshRSS categories.
3. Configure API access:

   ```bash
   export FRESHRSS_URL="https://your-freshrss-instance.example"
   export FRESHRSS_USER="your-user"
   export FRESHRSS_API_PASSWORD="your-api-password"
   ```

4. Use `skills/freshrss-reader/scripts/freshrss.sh categories` to verify access.
5. Adapt `crawler.py` to read from FreshRSS first and fall back to direct RSS feeds.

## Local Scheduling Reliability

Codex Automation is convenient, but it depends on the local Mac and app scheduler being awake. For a stronger local setup:

- Keep Codex Automation active for Codex-native analysis.
- Add macOS `launchd` fallback using `scripts/install_launchd_daily_rss.sh`.
- Keep the Mac connected to power and prevent sleep around 09:00.
- Review logs under `logs/` after the first run.

The fallback runner intentionally retries only this project's RSS workflow. It does not install a broad cron retry skill that can re-run arbitrary jobs.
