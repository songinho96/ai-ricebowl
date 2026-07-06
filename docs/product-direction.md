# AI RiceBowl Product Direction

AI RiceBowl should become a developer-focused AI/IT signal intelligence product, not a generic RSS dashboard.

## Product Thesis

Developers do not need more headlines. They need a daily, source-backed answer to:

- What changed?
- Why does it matter for my work?
- What should I do differently tomorrow morning?
- Which risks should I watch before adopting this trend?

The product should convert noisy RSS feeds into practical engineering judgment.

## Primary Users

| User | Need | Product Response |
| --- | --- | --- |
| Individual developer | Keep up with AI/tooling shifts without doomscrolling | Daily trend cards, survival guides, source links |
| Tech lead | Decide what to try, block, or standardize | Risk/action sections, team workflow guidance |
| Engineering manager | Understand organizational impact | domestic/overseas comparison, adoption roadmap |
| Product builder | Spot product opportunities | signal clusters, unmet needs, market movement |

## Content Pillars

1. **Daily Trend Intelligence**
   - 4-6 cards per day
   - Source-backed
   - Includes why it matters, developer actions, and risks

2. **Developer Survival Guides**
   - 2-4 practical long-form guides
   - Grounded in the day's signals
   - Focused on review, testing, security, architecture, documentation, and AI-assisted workflow discipline

3. **Signal Map**
   - Recurring themes across sources
   - Domestic vs overseas contrast
   - Noise vs actionable signal separation

4. **Action Playbooks**
   - Concrete checklists
   - Prompt/workflow examples
   - Team adoption templates

5. **Source Transparency**
   - Every insight links to the article that justified it
   - Collection failures and coverage gaps are visible

## Near-Term Feature Backlog

### P0: Trust and Reliability

- Add launchd fallback runner for local 09:00 execution.
- Keep per-day markdown reports under `reports/rss/`.
- Surface collection failures in the dashboard, not only logs.
- Add a simple "last updated" indicator to the UI.

### P1: Better Insight UX

- Add a "Why this matters" section to the top of the dashboard.
- Add source-backed detail pages for survival guides, similar to trend detail pages.
- Add filters for signal type: `Agent`, `Security`, `Workflow`, `Testing`, `Infra`, `Product`.
- Add a small "adoption difficulty" label to each trend card.

### P2: Product Strategy Layer

- Create weekly synthesis reports that compare daily signals.
- Add "opportunity cards" for product ideas, internal tooling ideas, and team process improvements.
- Add a decision log: adopted, watching, ignored, blocked.

### P3: Managed RSS Backend

- Evaluate FreshRSS for deduplication, category management, and unread-state based analysis.
- Move direct feed fetching behind a source adapter so FreshRSS and raw RSS can coexist.

## Daily Report Quality Bar

Each daily run should produce:

- A short conclusion
- Overseas signals
- Domestic signals
- Important source links
- Developer implications
- Risks/noise
- Tomorrow/weekly watch items
- Updated trend cards
- Updated survival guides

Avoid:

- Generic "AI is changing everything" language
- Vendor announcement summaries without engineering implication
- Unsourced claims
- More cards than the user can scan in one sitting

## Metrics to Track

- Number of collected articles
- Source failure count
- Number of source-backed trend cards
- Number of survival guide sections
- Time since last successful update
- Repeated themes over 7 days
- Manual corrections needed after automation

## Strategic Direction

The product should move from "news dashboard" to "developer operating brief."

The strongest differentiator is not collecting more feeds. It is turning feeds into:

- Engineering decisions
- Team practices
- Risk checklists
- Adoption playbooks
- Source-backed learning loops
