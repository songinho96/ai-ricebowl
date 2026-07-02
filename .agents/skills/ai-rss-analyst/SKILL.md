---
name: ai-rss-analyst
description: Run and analyze the AI RiceBowl RSS pipeline, producing a Korean daily AI/IT trend report from crawled RSS data for Codex automations.
---

# AI RSS Analyst

Use this skill when a user or automation asks Codex to collect, summarize, analyze, or report on the AI RiceBowl RSS feed results.

## Goal

Produce a useful Korean daily AI/IT trend report, not just a mechanical feed summary.

The report should help the user understand:

- What changed in overseas AI/IT news
- What changed in domestic Korean tech news
- Which stories matter most for developers and product builders
- Which signals are worth watching next
- What concrete follow-up actions make sense

## Standard Workflow

1. Run the RSS collection script from the repository root:

   ```bash
   bash run_crawler.sh
   ```

2. Read `crawled_data.js`.

3. Extract and reason over:

   - `window.crawledNews`
   - `window.crawledSummaries`
   - source distribution
   - domestic vs overseas split
   - recurring technical themes
   - high-signal articles
   - weak/noisy/duplicated articles

4. Produce a Korean markdown report under:

   ```text
   reports/rss/YYYY-MM-DD-ai-rss-report.md
   ```

5. Keep the report concise but analytical. Prefer judgment over volume.

6. If Discord delivery is available in the environment, send a short digest to the configured AI RiceBowl Discord channel. If delivery fails or is unavailable, leave the report file and mention the failure in the final automation result.

## Report Format

Use this structure:

```markdown
# AI 밥그릇 데일리 리포트 - YYYY-MM-DD

## 한줄 결론

## 해외 핵심 신호

## 국내 핵심 신호

## 오늘의 중요 기사

## 개발자 관점 인사이트

## 주목할 리스크와 노이즈

## 내일/이번 주 추적할 것
```

## Selection Rules

- Prefer article links with clear technical or product implications.
- Do not over-index on repeated vendor announcements.
- Separate actual engineering signal from funding, marketing, or launch noise.
- Compare overseas and domestic signals where useful.
- Mention collection failures, feed errors, or obvious coverage gaps.
- For Discord, send only a digest of the report, not the full report.

## Discord Digest Format

Keep the Discord message compact:

```markdown
**AI 밥그릇 데일리 요약 - YYYY-MM-DD**

한줄 결론: ...

해외:
- ...
- ...

국내:
- ...
- ...

리포트: reports/rss/YYYY-MM-DD-ai-rss-report.md
```

Avoid markdown tables in Discord.
