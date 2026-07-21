// Codex Automation이 매일 갱신하는 개발자용 트렌드 카드 데이터
// 파일이 없거나 로드에 실패하면 data.js의 기본 aiTrendsData가 사용됩니다.
window.dailyTrendCards = [
  {
    id: "daily-2026-07-21-agent-swarms-model-economics",
    title: "Agent swarms는 모델 선택을 비용 라우팅 문제로 바꾼다",
    category: "Agentic AI",
    date: "2026-07-21",
    readTime: "11 min read",
    views: "Codex Daily",
    tags: ["Agent Swarms", "Model Routing", "Open Models", "Local AI", "Cost"],
    summary: "Cursor의 agent swarm/model economics, Kimi Work, Nativ 로컬 모델, frontier model은 한 번의 핵심 edit에만 필요하다는 논의는 AI 제품이 단일 최고 모델 호출에서 다중 agent와 비용 라우팅 구조로 이동한다는 신호입니다.",
    content: "오늘 가장 시연하기 좋은 최신 신호는 agent swarms입니다. Cursor의 agent swarm/model economics 논의는 여러 agent가 작업을 나눠 수행할 때 모델 비용과 coordination cost가 새 병목이 된다는 점을 드러냅니다. HN의 'frontier model은 한 번의 핵심 edit에만 필요하다'는 글, Kimi Work, Nativ 로컬 open model 흐름, TechCrunch의 OpenAI/open-weight model 논쟁과 Google AI chip 보도까지 합치면 제품팀은 모델 하나를 고르는 대신 작업별 모델 라우팅, 로컬/클라우드 분리, frontier model 사용 예산을 설계해야 합니다.",
    trends: [
      "AI 기능은 best model 하나보다 cheap model, local model, frontier model을 섞는 routing 문제로 이동합니다.",
      "Agent swarm은 병렬성을 주지만 coordination, duplicate work, context drift, 비용 폭증을 함께 가져옵니다.",
      "open-weight/local model은 비용과 프라이버시에는 유리하지만 eval, 업데이트, abuse monitoring 책임을 팀으로 옮깁니다."
    ],
    whyMatters: [
      "시연에서는 '우리는 최신 agent swarm 경제성을 추적한다'는 메시지가 단순 뉴스 요약보다 강합니다.",
      "개발팀은 기능별로 어떤 작업에 frontier model을 쓰고 어떤 작업은 작은 모델이나 로컬 모델로 처리할지 정해야 합니다.",
      "모델 라우팅 기준이 없으면 AI 비용 절감이 품질 하락이나 재시도 비용 증가로 이어질 수 있습니다."
    ],
    developerActions: [
      "AI workflow를 plan, retrieve, edit, review, test, summarize 단계로 나누고 단계별 권장 모델을 기록하세요.",
      "frontier model 사용 조건을 '최종 핵심 edit', '고위험 reasoning', '사용자 노출 답변'처럼 명확히 제한하세요.",
      "agent swarm에는 task_id, parent_task_id, assigned_model, token_budget, accepted_output_count를 남기세요.",
      "로컬 모델 도입은 privacy benefit, latency, update cadence, eval pass rate를 함께 비교하세요."
    ],
    risks: [
      "agent 수를 늘리면 생산성이 선형 증가한다는 가정은 위험합니다.",
      "작은 모델을 무리하게 쓰면 사람이 검토하는 시간이 늘어 총비용이 오를 수 있습니다.",
      "로컬 open model은 데이터 통제에는 유리하지만 보안 패치와 품질 검증 책임이 내부로 이동합니다."
    ],
    sourceLinks: [
      {
        title: "Agent swarms and the new model economics",
        source: "Hacker News",
        url: "https://cursor.com/blog/agent-swarm-model-economics"
      },
      {
        title: "You only need the frontier model for one single edit",
        source: "Hacker News",
        url: "https://stencil.so/blog/prewalk"
      },
      {
        title: "Nativ: Run frontier open models locally on your Mac",
        source: "Hacker News",
        url: "https://blaizzy.github.io/nativ/"
      },
      {
        title: "OpenAI is scared of open-weight models. Should the US be?",
        source: "TechCrunch AI",
        url: "https://techcrunch.com/2026/07/20/openai-is-scared-of-open-weight-models-should-the-us-be/"
      },
      {
        title: "Google is working on a new AI chip designed to make Gemini more efficient",
        source: "TechCrunch AI",
        url: "https://techcrunch.com/2026/07/20/google-is-working-on-a-new-ai-chip-designed-to-make-gemini-more-efficient/"
      }
    ]
  },
  {
    id: "daily-2026-07-21-context-rich-coding-harness",
    title: "Context-rich coding harness가 AI 개발 도구의 차별점이다",
    category: "Context Engineering",
    date: "2026-07-21",
    readTime: "10 min read",
    views: "Codex Daily",
    tags: ["Context Ledger", "Coding Agent", "RAG", "MCP", "Repo Intelligence"],
    summary: "Ars Technica의 context-rich AI coding harness, VentureBeat의 AI context gap, NAVER Context Provider, LINE semantic context OS는 최신 AI 개발 도구의 핵심이 prompt가 아니라 context supply chain이라는 점을 보여줍니다.",
    content: "Coding agent가 grep보다 나아지려면 파일 검색 이상의 context가 필요합니다. 오늘 피드의 'Beyond grep'은 repo 구조, dependency graph, 최근 diff, 테스트 결과, 소유자 지식이 agent 입력으로 들어가야 한다는 방향을 보여줍니다. VentureBeat는 enterprise AI의 실패가 retrieval 양보다 신뢰할 수 있는 context 운영에서 터진다고 분석했고, 국내 NAVER Context Provider와 LINE semantic context OS/ADK 토큰 절감 사례는 같은 문제를 실무 언어로 풀고 있습니다. AI RiceBowl도 단순 뉴스 카드가 아니라 source, freshness, region, category, sourceLinks를 가진 context ledger로 설명할 수 있습니다.",
    trends: [
      "AI coding의 품질은 모델보다 repo context의 구조화 수준에 더 크게 흔들립니다.",
      "Context engineering은 긴 prompt 작성이 아니라 출처, 최신성, 권한, 압축, 폐기 정책을 운영하는 일입니다.",
      "MCP와 Context Provider는 agent가 안전하게 읽고 실행할 수 있는 boundary를 만드는 방향으로 진화합니다."
    ],
    whyMatters: [
      "시연에서 '우리는 최신 context engineering 신호를 추적한다'고 말하면 RAG/agent 이해도가 드러납니다.",
      "agent가 잘못된 문서나 오래된 코드 조각을 읽으면 더 큰 모델도 그럴듯한 오답을 냅니다.",
      "context ledger를 만들면 뉴스 분석, RAG, agent briefing, 팀 체크리스트로 같은 데이터를 재사용할 수 있습니다."
    ],
    developerActions: [
      "기사와 내부 문서마다 source_url, owner, updated_at, confidence, allowed_use, expiry를 붙이세요.",
      "coding agent 입력은 전체 repo 덤프보다 architecture map, failing tests, relevant diff, dependency edge 중심으로 구성하세요.",
      "context overflow와 stale context 발생 시 무엇을 버렸는지 로그로 남기세요.",
      "MCP tool에는 read_only, propose_change, execute_change를 분리하고 context source를 응답에 포함하세요."
    ],
    risks: [
      "context를 많이 넣는 것만으로는 trust gap이 해결되지 않습니다.",
      "권한 없는 문서가 agent context에 섞이면 데이터 유출과 잘못된 의사결정이 동시에 발생합니다.",
      "압축 전략이 불투명하면 중요한 제약이 사라진 채 agent가 실행될 수 있습니다."
    ],
    sourceLinks: [
      {
        title: "Beyond grep: The case for a context-rich AI coding harness",
        source: "Ars Technica AI",
        url: "https://arstechnica.com/ai/2026/07/beyond-grep-the-case-for-a-context-rich-ai-coding-harness/"
      },
      {
        title: "The AI context gap",
        source: "VentureBeat AI",
        url: "https://venturebeat.com/ai/the-ai-context-gap-enterprise-ai-organizations-have-a-trust-problem-not-a-retrieval-problem-and-most-are-still-building-the-fix"
      },
      {
        title: "사람과 AI Agent를 위한 통합 Context Provider 구축",
        source: "NAVER D2",
        url: "https://d2.naver.com/helloworld/7056385"
      },
      {
        title: "시멘틱 컨텍스트 OS 설계: 에이전트 시스템의 토큰 스터핑을 넘어",
        source: "LINE Engineering",
        url: "https://techblog.lycorp.co.jp/ko/techverse2026-59"
      },
      {
        title: "ODW #7: 세 가지 방법으로 토큰 소비량 40% 절감",
        source: "LINE Engineering",
        url: "https://techblog.lycorp.co.jp/ko/cut-token-usage-40-percent-with-adk-context-engineering"
      }
    ]
  },
  {
    id: "daily-2026-07-21-agent-governance-cloudflare",
    title: "Agent를 공개 서비스에 붙이려면 권한과 감지가 먼저다",
    category: "Agent Governance",
    date: "2026-07-21",
    readTime: "12 min read",
    views: "Codex Daily",
    tags: ["Agent Security", "MCP", "Cloudflare", "OAuth", "Audit"],
    summary: "VentureBeat의 agent security/evaluation/orchestration gap, Cloudflare Precursor와 Temporary Accounts, AWS remote MCP/Agent Toolkit은 agent가 실제 권한을 갖는 순간 보안·평가·감사 설계가 제품 요구사항이 된다는 신호입니다.",
    content: "Agent는 이제 대화 UI가 아니라 외부 앱, 사내 데이터, SaaS, 결제, 배포 pipeline을 건드리는 실행 주체입니다. VentureBeat는 agent 사고와 평가 공백, orchestrated deployment 실패를 반복해서 짚고 있고, Cloudflare는 agentic behavior 감지와 AI agent용 temporary account를 내놓고 있습니다. AWS는 remote MCP와 NVIDIA NeMo Agent Toolkit 기반 specialized workflow를 밀고 있습니다. 국내에서도 Kakao MCP Player와 LINE MCP 보안/Slack MCP/Git 자동화 워크숍이 같은 방향을 보여줍니다.",
    trends: [
      "agent 보안은 prompt safety가 아니라 identity, delegation, scope, audit, revoke의 문제입니다.",
      "MCP가 늘수록 tool 연결보다 tool 권한과 실행 로그가 더 중요해집니다.",
      "agentic behavior 감지는 웹 방어와 제품 분석의 새 telemetry가 될 수 있습니다."
    ],
    whyMatters: [
      "사람 계정 credential을 공유하는 agent는 데모는 빠르지만 사고 분석과 권한 회수가 어렵습니다.",
      "agent가 실제 write action을 수행하면 eval failure가 곧 운영 장애가 됩니다.",
      "시연에서 agent governance를 말하면 단순 챗봇 수준을 넘어 제품 운영 관점을 보여줄 수 있습니다."
    ],
    developerActions: [
      "agent task에 requested_by, delegated_identity, scopes, approval_state, tool_calls, audit_log_url을 저장하세요.",
      "MCP server마다 read_only/propose/execute 권한 단계를 분리하고 기본값은 deny로 두세요.",
      "agent eval set에는 권한 초과 요청, 악성 문서, stale context, irreversible action 케이스를 넣으세요.",
      "쓰기 작업은 dry-run diff, human approval, post-action verification, revoke path를 기본 workflow로 만드세요."
    ],
    risks: [
      "tool success rate만 보면 권한 오남용을 놓칠 수 있습니다.",
      "temporary account와 OAuth를 붙여도 scope 설계가 약하면 blast radius는 여전히 큽니다.",
      "agentic behavior 감지는 개인정보/추적 정책과 함께 설계해야 합니다."
    ],
    sourceLinks: [
      {
        title: "The agent security gap",
        source: "VentureBeat AI",
        url: "https://venturebeat.com/ai/the-agent-security-gap-54-of-enterprises-have-already-had-an-ai-agent-incident-and-most-still-let-agents-share-credentials"
      },
      {
        title: "The agent evaluation gap",
        source: "VentureBeat AI",
        url: "https://venturebeat.com/ai/the-agent-evaluation-gap-enterprise-ai-organizations-have-a-reality-alignment-problem-not-a-coverage-problem-and-most-are-shipping-to-production-anyway"
      },
      {
        title: "Agentic orchestration",
        source: "VentureBeat AI",
        url: "https://venturebeat.com/ai/agentic-orchestration-enterprise-ai-organizations-have-a-deployment-problem-not-a-platform-problem-and-most-are-calling-chatbots-agents"
      },
      {
        title: "Introducing Precursor: detecting agentic behavior with continuous client-side signals",
        source: "Cloudflare Blog",
        url: "https://blog.cloudflare.com/introducing-precursor/"
      },
      {
        title: "Temporary Cloudflare Accounts for AI agents",
        source: "Cloudflare Blog",
        url: "https://blog.cloudflare.com/temporary-accounts/"
      },
      {
        title: "How Smartsheet built a remote MCP server on AWS",
        source: "AWS ML Blog",
        url: "https://aws.amazon.com/blogs/machine-learning/how-smartsheet-built-a-remote-mcp-server-on-aws/"
      }
    ]
  },
  {
    id: "daily-2026-07-21-llm-serving-infra-cost",
    title: "LLM serving은 API 비용이 아니라 운영 SLO 문제다",
    category: "AI Infrastructure",
    date: "2026-07-21",
    readTime: "10 min read",
    views: "Codex Daily",
    tags: ["LLM Serving", "Kubernetes", "GPU", "Cost Visibility", "Edge"],
    summary: "Netflix LLM serving/Kueue, VentureBeat compute gap, Google AI chip, New York 데이터센터 모라토리엄, NAVER Kubernetes LLM Serving, Toss Spark Connect는 AI 기능의 병목이 serving topology와 비용 가시성으로 이동했음을 보여줍니다.",
    content: "AI 기능이 커질수록 비용 문제는 token 단가 표로 해결되지 않습니다. Netflix는 자체 LLM serving과 Kueue 기반 batch compute 단순화를 공유했고, VentureBeat는 기업들이 AI 인프라를 빠르게 사지만 비용 측정 능력은 뒤처진다고 분석했습니다. Google AI chip과 데이터센터 규제 흐름은 compute가 제품 로드맵의 외부 제약이 되었음을 보여줍니다. 국내 NAVER Kubernetes LLM Serving, Toss Spark Connect on Kubernetes, LINE Spark on Kubernetes는 같은 문제를 운영 사례로 뒷받침합니다.",
    trends: [
      "AI 비용 관리는 API bill에서 serving topology, queue, cache, GPU utilization, p95 latency 관리로 확장됩니다.",
      "batch/online/reviewer-assisted workload를 분리하지 않으면 비용과 latency가 함께 나빠집니다.",
      "데이터센터와 칩 공급은 AI 기능의 비기술 roadmap risk로 들어오고 있습니다."
    ],
    whyMatters: [
      "시연에서 Cloudflare D1/Pages Functions와 LLM serving cost를 연결하면 edge-ready AI brief로 포지셔닝할 수 있습니다.",
      "비용 가시성이 없으면 팀은 느린 기능을 더 큰 모델로 덮거나 중요한 기능을 과도하게 절감할 수 있습니다.",
      "AI 기능 장애는 외부 API 장애가 아니라 사용자가 보는 제품 장애입니다."
    ],
    developerActions: [
      "AI 기능별 request_count, cache_hit_rate, p95_latency, retry_count, tokens_per_success, cost_per_accepted_output을 측정하세요.",
      "online critical, async batch, reviewer-assisted workflow에 서로 다른 timeout, queue, fallback을 적용하세요.",
      "GPU/endpoint 공유 환경에서는 noisy neighbor와 priority inversion 테스트를 추가하세요.",
      "모델 비용 리뷰에는 infra cost, human review time, rollback cost, user-visible failure를 포함하세요."
    ],
    risks: [
      "token 단가만 낮추면 retry와 human review가 늘어 총비용이 오를 수 있습니다.",
      "단일 endpoint 의존은 quota, region outage, provider policy change에 취약합니다.",
      "AI 인프라 확장은 전력/지역 규제/데이터센터 여론과 충돌할 수 있습니다."
    ],
    sourceLinks: [
      {
        title: "In-House LLM Serving at Netflix",
        source: "Netflix TechBlog",
        url: "https://netflixtechblog.com/in-house-llm-serving-at-netflix-a5a8e799ea2c?source=rss----2615bd06b42e---4"
      },
      {
        title: "How Netflix Simplified Batch Compute with Kueue",
        source: "Netflix TechBlog",
        url: "https://netflixtechblog.com/how-netflix-simplified-batch-compute-with-kueue-87860682629c?source=rss----2615bd06b42e---4"
      },
      {
        title: "The AI compute gap",
        source: "VentureBeat AI",
        url: "https://venturebeat.com/ai/the-ai-compute-gap-enterprises-are-buying-infrastructure-faster-than-they-can-measure-what-it-costs"
      },
      {
        title: "New York bans data center construction for a year",
        source: "Ars Technica AI",
        url: "https://arstechnica.com/tech-policy/2026/07/new-york-is-the-first-state-to-impose-a-data-center-moratorium/"
      },
      {
        title: "MLXP : Kubernetes LLM Serving 최적화 기술 도입기",
        source: "NAVER D2",
        url: "https://d2.naver.com/helloworld/1059238"
      },
      {
        title: "Spark Connect on Kubernetes #1",
        source: "Toss Tech",
        url: "https://toss.tech/article/spark-connect-on-kubernetes-1"
      }
    ]
  },
  {
    id: "daily-2026-07-21-ai-change-verification",
    title: "AI coding의 최신 경쟁력은 생성보다 검증 루프다",
    category: "Engineering Practice",
    date: "2026-07-21",
    readTime: "9 min read",
    views: "Codex Daily",
    tags: ["AI Code Review", "QA", "Playwright", "Acceptance", "Testing"],
    summary: "GitHub Copilot code review 개선기, NAVER Playwright E2E harness, LINE QA/검증력 글, AWS Nova Act QA는 AI coding을 말할 때 생성 속도보다 acceptance gate와 테스트 하네스가 중요하다는 신호입니다.",
    content: "오늘 AI coding 신호는 '더 빨리 코드를 만든다'에서 끝나지 않습니다. GitHub는 도구를 더 많이 붙인 Copilot code review가 오히려 나빠진 사례와 개선 방식을 공유했고, 'The cost of saying yes has changed'로 변경 수용 비용을 재정의했습니다. NAVER는 AI agent를 위한 Playwright E2E 테스트 하네스를 다뤘고, LINE은 AI가 QA를 대체하지 않고 확장한다는 메시지를 냈습니다. AWS Nova Act의 agentic QA/UX testing 흐름까지 합치면 최신 개발팀의 차이는 생성량이 아니라 독립 검증 루프에서 납니다.",
    trends: [
      "AI coding 확산은 code generation 문제가 아니라 change acceptance 문제를 키웁니다.",
      "AI reviewer도 팀 기준과 테스트 evidence가 없으면 그럴듯한 노이즈를 늘릴 수 있습니다.",
      "Playwright/E2E/UX replay는 agent가 만든 변경을 검증하는 핵심 하네스가 됩니다."
    ],
    whyMatters: [
      "시연에서 'AI는 QA를 대체하지 않고 확장한다'고 말하면 실무 감각이 살아납니다.",
      "테스트가 없는 AI 변경은 velocity 지표를 좋게 보이게 하지만 운영 부채를 숨깁니다.",
      "agent가 직접 브라우저를 조작하는 시대에는 UI 테스트와 권한 검증이 한 세트가 됩니다."
    ],
    developerActions: [
      "AI 변경 PR 템플릿에 intent, non-goals, tests run, missing tests, observability impact, rollback plan을 요구하세요.",
      "AI reviewer에는 repository-specific rule, ownership map, known flaky tests, no-go areas를 context로 제공하세요.",
      "중요 workflow는 Playwright replay, fixture regression, production log query 중 하나로 독립 검증하세요.",
      "QA automation은 success path뿐 아니라 permission error, stale context, failed rollback까지 포함하세요."
    ],
    risks: [
      "AI reviewer의 설명력은 증거가 아니며 사람이 검증을 생략하게 만들 수 있습니다.",
      "E2E 테스트가 느리거나 flaky하면 agent workflow 전체가 신뢰를 잃습니다.",
      "생성 속도만 보여주는 데모는 운영 가능한 AI 개발 역량을 설명하지 못합니다."
    ],
    sourceLinks: [
      {
        title: "Better tools made Copilot code review worse",
        source: "GitHub Engineering",
        url: "https://github.blog/ai-and-ml/github-copilot/better-tools-made-copilot-code-review-worse-heres-how-we-actually-improved-it/"
      },
      {
        title: "The cost of saying yes has changed",
        source: "GitHub Engineering",
        url: "https://github.blog/engineering/the-cost-of-saying-yes-has-changed/"
      },
      {
        title: "AI 에이전트를 위한 Playwright E2E 테스트 하네스 구축하기",
        source: "NAVER D2",
        url: "https://d2.naver.com/helloworld/6811215"
      },
      {
        title: "AI는 QA를 대체하지 않았다, 대신 확장했다",
        source: "LINE Engineering",
        url: "https://techblog.lycorp.co.jp/ko/ai-augments-qa-rather-than-replacing-it"
      },
      {
        title: "Accelerating software delivery with agentic QA automation using Amazon Nova Act",
        source: "AWS ML Blog",
        url: "https://aws.amazon.com/blogs/machine-learning/accelerating-software-delivery-with-agentic-qa-automation-using-amazon-nova-act-part-2/"
      }
    ]
  },
  {
    id: "daily-2026-07-21-agentic-web-data-boundaries",
    title: "Agentic web에서는 콘텐츠 경계와 과금이 아키텍처가 된다",
    category: "Security & Policy",
    date: "2026-07-21",
    readTime: "10 min read",
    views: "Codex Daily",
    tags: ["Agentic Web", "AI Traffic", "Data Rights", "Cloudflare", "x402"],
    summary: "Anthropic 저작권 합의, Cloudflare AI traffic options, Attribution Business Insights, Monetization Gateway, LINE Kafka E2EE와 유해성 모델은 AI 제품이 데이터 접근·권리·보안을 아키텍처로 다뤄야 함을 보여줍니다.",
    content: "AI 제품은 데이터를 많이 읽을수록 좋아진다는 단순한 방향으로 갈 수 없습니다. Anthropic 저작권 합의와 Apple-OpenAI 소송 보도는 AI 기업의 데이터·인재·지식재산 경계가 제품 리스크가 됐음을 보여줍니다. Cloudflare는 AI traffic 옵션, Attribution Business Insights, Monetization Gateway, Content Independence Day를 통해 crawler/agent/web 콘텐츠 관계를 제품화하고 있습니다. 국내 LINE Kafka E2EE와 오픈챗 유해성 판단 모델은 데이터 이동과 AI 안전 운영의 실제 구현 사례입니다.",
    trends: [
      "콘텐츠 접근 정책은 robots.txt 수준 요청에서 active blocking, attribution, monetization, contractual boundary로 이동합니다.",
      "agentic web에서는 누가 읽었고 어떤 agent 행동이었는지 감지하는 telemetry가 중요해집니다.",
      "AI safety 기능은 분류 모델 하나가 아니라 정책, review queue, appeal, drift monitoring의 조합입니다."
    ],
    whyMatters: [
      "AI RiceBowl은 RSS를 모으는 앱이므로 콘텐츠 권리와 source attribution을 시연에서 먼저 말하는 편이 좋습니다.",
      "RAG와 crawler pipeline은 source opt-out, removal request, allowed_use를 제품 요구사항으로 가져야 합니다.",
      "Cloudflare edge 구조는 AI traffic 정책과 데이터 경계 이야기를 연결하기 좋은 데모 포인트입니다."
    ],
    developerActions: [
      "AI 입력 소스마다 owner, allowed_use, retention, trainable 여부, redaction policy를 metadata로 관리하세요.",
      "crawler/RAG pipeline에는 robots/terms check, source opt-out, removal request 처리 경로를 문서화하세요.",
      "moderation model에는 false positive review, appeal path, drift monitoring, adversarial examples를 운영 지표로 두세요.",
      "민감 이벤트 스트림은 agent가 읽기 전에 encryption boundary, masking, purpose-based access를 정의하세요."
    ],
    risks: [
      "학습 입력과 추론 입력의 권리 경계를 구분하지 않으면 출시 후 차단·소송·삭제 요구에 취약합니다.",
      "AI traffic 감지는 개인정보 및 추적 규정과 충돌할 수 있습니다.",
      "과금/x402 같은 agentic web 모델은 기술보다 생태계 채택 속도가 리스크입니다."
    ],
    sourceLinks: [
      {
        title: "Anthropic's landmark $1.5B copyright settlement is approved",
        source: "TechCrunch AI",
        url: "https://techcrunch.com/2026/07/20/anthropics-landmark-1-5b-copyright-settlement-is-approved/"
      },
      {
        title: "Your site, your rules: new AI traffic options for all customers",
        source: "Cloudflare Blog",
        url: "https://blog.cloudflare.com/content-independence-day-ai-options/"
      },
      {
        title: "Unmasking the crawls with Attribution Business Insights",
        source: "Cloudflare Blog",
        url: "https://blog.cloudflare.com/attribution-business-insights/"
      },
      {
        title: "Announcing the Monetization Gateway: charge for any resource behind Cloudflare via x402",
        source: "Cloudflare Blog",
        url: "https://blog.cloudflare.com/monetization-gateway/"
      },
      {
        title: "초당 100만 건, LINE 앱에 Apache Kafka 종단 간 암호화 적용기",
        source: "LINE Engineering",
        url: "https://techblog.lycorp.co.jp/ko/applying-e2ee-to-apache-kafka-in-line-app"
      },
      {
        title: "오픈챗 이름 및 설명 글로 유해성 판단하는 모델 개발하기",
        source: "LINE Engineering",
        url: "https://techblog.lycorp.co.jp/ko/developing-harmfulness-detection-model-for-open-chat-metadata"
      }
    ]
  }
];
