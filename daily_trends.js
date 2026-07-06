// Codex Automation이 매일 갱신하는 개발자용 트렌드 카드 데이터
// 파일이 없거나 로드에 실패하면 data.js의 기본 aiTrendsData가 사용됩니다.
window.dailyTrendCards = [
  {
    id: "daily-2026-07-05-agent-permission-layer",
    title: "에이전트 시대의 병목은 모델이 아니라 권한 계층이다",
    category: "Agent Infrastructure",
    date: "2026-07-05",
    readTime: "8 min read",
    views: "Codex Daily",
    tags: ["Agent", "A2A", "MCP", "IAM", "Audit Log", "Context"],
    summary: "AWS, Cloudflare, NAVER, LINE 피드는 모두 같은 방향을 가리킵니다. 에이전트가 실제 시스템을 만질수록 발견, 라우팅, 메모리, 권한, 감사 로그가 별도 플랫폼 계층이 됩니다.",
    content: "오늘 가장 강한 개발자 신호는 에이전트 기능 자체보다 에이전트를 둘러싼 통제면입니다. AWS는 A2A gateway와 AgentCore Memory, row-level security 사례를 내고 있고 Cloudflare는 Temporary Accounts와 agent framework 런타임을 밀고 있습니다. 국내에서는 NAVER의 Context Provider와 LINE의 시멘틱 컨텍스트 OS, 보안 MCP 글이 같은 문제를 실무 언어로 다룹니다. 에이전트는 더 이상 'LLM 호출 한 번'이 아니라 사용자를 대신해 내부 지식, 외부 API, 배포 도구, 데이터베이스를 오가는 실행 주체입니다.",
    trends: [
      "에이전트 discovery, routing, memory filtering, access control이 애플리케이션 코드 밖의 공통 계층으로 분리되고 있습니다.",
      "MCP와 A2A는 도구 연결 표준을 넓히지만, 실제 운영 리스크는 인증, 권한 범위, 로그 보존에서 발생합니다.",
      "Context Provider는 문서 검색 기능을 넘어 팀 지식과 데이터 권한을 함께 공급하는 내부 플랫폼이 되고 있습니다."
    ],
    whyMatters: [
      "권한 설계 없는 에이전트는 편리한 자동화가 아니라 내부 시스템을 조작하는 불투명한 봇이 됩니다.",
      "에이전트 장애는 한 번의 API 실패가 아니라 여러 도구 호출이 얽힌 분산 변경으로 나타납니다.",
      "개발자는 프롬프트보다 먼저 tool contract, tenant boundary, audit schema를 설계해야 합니다."
    ],
    developerActions: [
      "에이전트가 호출할 수 있는 도구를 read, write, deploy, billing, admin으로 분류하고 기본값을 deny로 두세요.",
      "모든 tool invocation에 user id, delegated actor, reason, input hash, output summary, request id, changed resource를 남기세요.",
      "Context Provider에는 문서 본문뿐 아니라 freshness, owner, permission scope, source URL을 함께 넣으세요.",
      "MCP 서버를 붙일 때 토큰 권한, 네트워크 접근, 파일 시스템 접근, 외부 전송 가능 여부를 체크리스트로 검토하세요."
    ],
    risks: [
      "벤더별 에이전트 런타임에 권한과 로그가 흩어지면 사고 후 재구성이 어려워집니다.",
      "컨텍스트 공급 계층이 오래된 문서나 권한 없는 데이터를 섞으면 에이전트 답변이 운영 사고로 이어질 수 있습니다.",
      "MCP 서버 하나가 내부 API 전체로 이어지는 과권한 통로가 될 수 있습니다."
    ],
    sourceLinks: [
      {
        title: "Building a serverless A2A gateway for agent discovery, routing, and access control",
        source: "AWS ML Blog",
        url: "https://aws.amazon.com/blogs/machine-learning/building-a-serverless-a2a-gateway-for-agent-discovery-routing-and-access-control/"
      },
      {
        title: "Structured memory filtering with metadata in AgentCore Memory",
        source: "AWS ML Blog",
        url: "https://aws.amazon.com/blogs/machine-learning/structured-memory-filtering-with-metadata-in-agentcore-memory/"
      },
      {
        title: "Temporary Cloudflare Accounts for AI agents",
        source: "Cloudflare Blog",
        url: "https://blog.cloudflare.com/temporary-accounts/"
      },
      {
        title: "사람과 AI Agent를 위한 통합 Context Provider 구축",
        source: "NAVER D2",
        url: "https://d2.naver.com/helloworld/7056385"
      },
      {
        title: "ODW #3: MCP 서버를 안전하게 활용해 개발 효율 높이기",
        source: "LINE Engineering",
        url: "https://techblog.lycorp.co.jp/ko/improving-development-efficiency-with-secure-mcp-servers"
      }
    ]
  },
  {
    id: "daily-2026-07-05-ai-coding-verification",
    title: "AI 코딩의 생산성은 검증 루프가 결정한다",
    category: "Engineering Practice",
    date: "2026-07-05",
    readTime: "7 min read",
    views: "Codex Daily",
    tags: ["AI Coding", "Testing", "Code Review", "Playwright", "Governance"],
    summary: "Claude Code 금지 보도, GitHub의 agent-driven 개발 회고, LINE/NAVER/Toss의 검증 사례는 같은 결론으로 모입니다. AI가 코드를 빨리 쓰는 만큼 팀은 더 빠르게 실패를 재현해야 합니다.",
    content: "AI 코딩 도구가 성숙할수록 조직의 관심은 '얼마나 빨리 구현되는가'에서 '어디까지 믿고 병합할 수 있는가'로 이동합니다. TechCrunch의 Alibaba Claude Code 금지 보도는 기업 보안 정책의 현실을 보여주고, GitHub의 agent-driven development 회고는 에이전트와 함께 일할 때의 실무 감각을 제공합니다. 국내에서는 LINE이 검증력과 로컬 환경 전략을 강조하고, NAVER는 Playwright 기반 E2E 하네스를, Toss는 테스트하는 법 자체를 제품화하는 방향을 보여줍니다.",
    trends: [
      "AI 생성 코드는 변경량과 속도를 늘리지만 리뷰, 테스트, 롤백의 병목도 함께 키웁니다.",
      "기업은 AI 코딩 도구를 무조건 허용하기보다 코드 유출, 라이선스, 비밀정보, 외부 전송 정책을 따지기 시작했습니다.",
      "E2E 테스트와 로컬 재현 환경이 AI 생성 코드의 최소 신뢰 계층으로 부상하고 있습니다."
    ],
    whyMatters: [
      "검증 루프 없이 AI 코딩을 확대하면 생산성이 아니라 미검증 변경량만 늘어납니다.",
      "개발자의 차별점은 프롬프트 문장보다 실패 조건, 테스트 데이터, 리뷰 기준을 설계하는 능력으로 이동합니다.",
      "AI 리뷰 도구도 운영 리스크 기준이 없으면 스타일 코멘트 이상의 가치를 내기 어렵습니다."
    ],
    developerActions: [
      "AI에게 구현을 맡기기 전 실패 조건 5개, 금지 변경 3개, 테스트해야 할 사용자 흐름 3개를 먼저 쓰세요.",
      "AI 생성 PR 템플릿에 실행한 테스트, 변경된 API 계약, 롤백 계획, 새 의존성 검토 결과를 필수로 넣으세요.",
      "핵심 경로는 Playwright 같은 E2E 하네스로 고정하고, AI가 만든 변경마다 스크린샷/로그 증거를 남기세요.",
      "외부 AI 코딩 도구 사용 정책에는 금지 파일, 비밀값 처리, 사내 코드 업로드 범위, 승인 절차를 명시하세요."
    ],
    risks: [
      "AI가 만든 테스트가 구현 세부사항만 따라가면 실제 사용자 실패를 막지 못합니다.",
      "보안 정책 없이 터미널형 코딩 에이전트를 쓰면 로컬 파일, 환경 변수, 내부 레포 노출 위험이 커집니다.",
      "리뷰어가 코드 전체를 이해하지 못한 채 AI 설명만 믿으면 회귀 버그가 숨어 들어갑니다."
    ],
    sourceLinks: [
      {
        title: "Alibaba reportedly bans employees from using Claude Code",
        source: "TechCrunch AI",
        url: "https://techcrunch.com/2026/07/04/alibaba-reportedly-bans-employees-from-using-claude-code/"
      },
      {
        title: "Agent-driven development in Copilot Applied Science",
        source: "GitHub Engineering",
        url: "https://github.blog/ai-and-ml/github-copilot/agent-driven-development-in-copilot-applied-science/"
      },
      {
        title: "AI 시대의 개발 능력은 검증력으로 결정된다, Flava API Gateway 개발 중 배운 빠른 검증과 로컬 환경 구성 전략",
        source: "LINE Engineering",
        url: "https://techblog.lycorp.co.jp/ko/techverse2026-223"
      },
      {
        title: "AI 에이전트를 위한 Playwright E2E 테스트 하네스 구축하기",
        source: "NAVER D2",
        url: "https://d2.naver.com/helloworld/6811215"
      },
      {
        title: "누군가는 토스를 테스트하는 동안, 우리는 테스트하는 법을 만듭니다.",
        source: "Toss Tech",
        url: "https://toss.tech/article/50893"
      }
    ]
  },
  {
    id: "daily-2026-07-05-ai-traffic-economy",
    title: "AI 트래픽은 차단 목록에서 계약 가능한 자원으로 바뀐다",
    category: "Web Platform",
    date: "2026-07-05",
    readTime: "7 min read",
    views: "Codex Daily",
    tags: ["AI Crawlers", "x402", "Content", "MCP", "Search", "Monetization"],
    summary: "Cloudflare의 AI traffic options, attribution, monetization gateway는 웹 콘텐츠 접근 정책이 검색, 학습, 에이전트 실행, 유료 API 호출로 쪼개지고 있음을 보여줍니다.",
    content: "웹 운영자가 고민해야 할 질문이 robots.txt 허용/차단에서 더 복잡해졌습니다. Cloudflare는 AI traffic 목적 분리, Attribution Business Insights, x402 기반 Monetization Gateway를 내놓았고 TechCrunch도 AI 회사가 퍼블리셔 콘텐츠 비용을 지불하도록 압박하는 정책 변화를 다뤘습니다. 이 흐름은 웹페이지뿐 아니라 데이터셋, API, MCP tool까지 '에이전트가 접근하는 자원'으로 묶어 정책과 가격을 붙이는 방향입니다.",
    trends: [
      "AI crawler는 검색 인덱싱, 모델 학습, 에이전트 작업 수행 목적별로 분리 관리되는 방향입니다.",
      "콘텐츠와 API는 사람이 읽는 페이지와 에이전트가 소비하는 기계 자원으로 동시에 설계되어야 합니다.",
      "x402 같은 결제/권한 프로토콜은 MCP tool과 데이터 API의 사용량 기반 과금 실험으로 이어질 수 있습니다."
    ],
    whyMatters: [
      "개발자가 운영하는 문서, API, 데이터셋도 AI 에이전트의 소비 대상이 되면서 접근 정책이 제품 기능이 됩니다.",
      "무조건 차단하면 검색과 발견성을 잃고, 무조건 허용하면 비용과 IP 리스크가 커집니다.",
      "AI 트래픽 로그를 구분하지 못하면 어떤 봇이 어떤 목적으로 어떤 자원을 쓰는지 판단할 수 없습니다."
    ],
    developerActions: [
      "웹 로그에서 user agent만 보지 말고 목적, 경로, 응답 크기, 인증 여부, rate limit 결과를 함께 집계하세요.",
      "문서, API, 데이터셋, MCP tool별로 search, train, agent-action, paid-access 정책을 나누세요.",
      "에이전트용 엔드포인트에는 사람이 보는 HTML과 다른 요약, 스키마, 라이선스, freshness 정보를 명시하세요.",
      "비용이 큰 API는 무료 크롤링 경로와 인증된 유료 경로를 분리하고 사용량 지표를 대시보드화하세요."
    ],
    risks: [
      "AI bot 식별은 아직 불완전하므로 정책을 과신하면 정상 검색 유입이나 파트너 통합이 깨질 수 있습니다.",
      "콘텐츠 과금이 표준화되기 전까지는 벤더별 구현에 묶일 가능성이 큽니다.",
      "에이전트에게 제공한 API가 곧 재판매 가능한 데이터 상품이 될 수 있으므로 약관과 로그 보존이 필요합니다."
    ],
    sourceLinks: [
      {
        title: "Announcing the Monetization Gateway: charge for any resource behind Cloudflare via x402",
        source: "Cloudflare Blog",
        url: "https://blog.cloudflare.com/monetization-gateway/"
      },
      {
        title: "Content Independence Day, one year on: building the business model for the agentic Internet",
        source: "Cloudflare Blog",
        url: "https://blog.cloudflare.com/agentic-internet-bot-report/"
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
        title: "Cloudflare’s new policy pushes AI companies to pay for publishers’ content",
        source: "TechCrunch AI",
        url: "https://techcrunch.com/2026/07/01/cloudflares-new-policy-pushes-ai-companies-to-pay-for-publishers-content/"
      }
    ]
  },
  {
    id: "daily-2026-07-05-model-operations",
    title: "모델 운영은 성능 경쟁보다 배포 경계 설계로 간다",
    category: "ModelOps",
    date: "2026-07-05",
    readTime: "8 min read",
    views: "Codex Daily",
    tags: ["ModelOps", "Bedrock", "Open Models", "GovCloud", "Evaluation", "Cost"],
    summary: "AWS와 Anthropic, OpenAI 관련 피드는 모델 선택이 단일 리더보드 문제가 아니라 규제, 비용, 데이터 민감도, 평가 하네스를 묶은 운영 문제로 바뀌고 있음을 보여줍니다.",
    content: "오늘 해외 AI 인프라 피드는 모델의 이름보다 모델을 어디에, 어떤 데이터로, 얼마의 비용으로, 어떤 평가 기준 아래 배포할지가 더 중요하다는 신호를 냅니다. AWS는 GovCloud에서 open-weight 모델을 제공하고, Bedrock Model Profiler와 multi-turn RL 모범 사례, resilient LLM gateway 패턴을 소개합니다. Anthropic 모델 글로벌 릴리스와 안전 테스트 보도, custom chip 논의도 모델 공급망이 규제와 하드웨어, 클라우드 배포 경계에 묶여 움직인다는 점을 보여줍니다.",
    trends: [
      "오픈 모델과 관리형 frontier 모델을 같은 플랫폼에서 목적별로 라우팅하려는 수요가 커지고 있습니다.",
      "정부/규제 환경에서는 모델 성능보다 데이터 위치, 접근 통제, 안전 테스트, 감사 가능성이 우선됩니다.",
      "모델 선택 도구, eval harness, gateway resilience가 애플리케이션 품질의 핵심 운영 부품이 됩니다."
    ],
    whyMatters: [
      "제품팀은 모델 벤치마크만 보고 선택하면 비용 폭증, 규제 부적합, 장애 전파를 놓칠 수 있습니다.",
      "open-weight 모델 도입은 자유도가 높지만 패치, 평가, 배포, 보안 책임도 팀 쪽으로 이동합니다.",
      "LLM gateway는 단순 프록시가 아니라 라우팅, fallback, rate limit, prompt/version audit을 담당해야 합니다."
    ],
    developerActions: [
      "모델 선택 기준을 quality, latency, cost, data sensitivity, residency, tool support, fallback 가능성으로 나눠 기록하세요.",
      "프로덕션 프롬프트와 모델 버전, 평가 데이터셋, 실패 사례를 함께 버전 관리하세요.",
      "LLM gateway에 timeout, retry budget, fallback model, circuit breaker, redaction log를 넣으세요.",
      "오픈 모델은 배포 전 사내 데이터와 실제 실패 케이스로 최소 eval suite를 통과시키세요."
    ],
    risks: [
      "모델 profiler나 managed platform이 제공하는 메타데이터만 믿으면 실제 업무 데이터에서의 실패를 놓칩니다.",
      "fallback 모델이 기능적으로 다르면 장애 상황에서 사용자가 다른 답변 정책을 경험할 수 있습니다.",
      "규제 환경에 맞춘 모델을 일반 제품에 그대로 쓰면 비용과 개발 속도 면에서 과한 선택이 될 수 있습니다."
    ],
    sourceLinks: [
      {
        title: "Run NVIDIA Nemotron and OpenAI GPT OSS models on Amazon Bedrock in AWS GovCloud (US)",
        source: "AWS ML Blog",
        url: "https://aws.amazon.com/blogs/machine-learning/run-nvidia-nemotron-and-openai-gpt-oss-models-on-amazon-bedrock-in-aws-govcloud-us/"
      },
      {
        title: "Simplify model selection in Amazon Bedrock with the open source Model Profiler",
        source: "AWS ML Blog",
        url: "https://aws.amazon.com/blogs/machine-learning/simplify-model-selection-in-amazon-bedrock-with-the-open-source-model-profiler/"
      },
      {
        title: "Best practices for multi-turn reinforcement learning in Amazon SageMaker AI",
        source: "AWS ML Blog",
        url: "https://aws.amazon.com/blogs/machine-learning/best-practices-for-multi-turn-reinforcement-learning-in-amazon-sagemaker-ai/"
      },
      {
        title: "Implementing resilience patterns with Amazon Bedrock and LLM gateway",
        source: "AWS ML Blog",
        url: "https://aws.amazon.com/blogs/machine-learning/implementing-resilience-patterns-with-amazon-bedrock-and-llm-gateway/"
      },
      {
        title: "After spooking Trump into safety testing, Anthropic AI models get global release",
        source: "Ars Technica AI",
        url: "https://arstechnica.com/tech-policy/2026/07/after-spooking-trump-into-safety-testing-anthropic-ai-models-get-global-release/"
      }
    ]
  },
  {
    id: "daily-2026-07-05-product-workflow-ai",
    title: "AI 도입은 챗봇 기능보다 팀 워크플로 재설계에 가깝다",
    category: "Product Engineering",
    date: "2026-07-05",
    readTime: "7 min read",
    views: "Codex Daily",
    tags: ["Workflow", "Product", "Metrics", "Frontend", "Design", "Automation"],
    summary: "LINE, Kakao, Toss, Netflix 사례는 AI가 별도 기능으로 붙는 단계를 넘어 프런트엔드 제작, 지표 분석, 디자인 실험, 홈페이지 생성 같은 팀 운영 흐름으로 들어오고 있음을 보여줍니다.",
    content: "국내 피드는 AI를 제품팀의 실제 작업 흐름에 넣는 사례가 많았습니다. LINE은 AI로 LINE 앱 안의 그룹 영상 통화 서비스를 만들고 프런트엔드 생산성을 워크플로로 끌어올리는 사례를 냈고, Kakao는 카카오톡 추천 지표 분석을 에이전트로 자동화했습니다. Toss는 디자이너 AI Contest와 기술 문서 책임을 다루며 역할 경계 변화를 보여줍니다. Netflix의 GenPage는 개인화된 홈페이지 구성 자체가 생성형 시스템으로 이동하는 신호입니다.",
    trends: [
      "AI 기능은 검색창 옆 버튼이 아니라 기획, 디자인, 프런트엔드, 지표 분석의 연결 방식에 들어오고 있습니다.",
      "비개발자도 프로토타입을 만들 수 있지만, 운영 가능한 제품으로 바꾸는 책임은 여전히 엔지니어링 시스템에 남습니다.",
      "추천, 홈페이지, 지표 분석처럼 데이터와 사용자 경험이 맞물린 영역에서 생성형 AI 실험이 늘고 있습니다."
    ],
    whyMatters: [
      "AI 워크플로는 역할 간 handoff를 줄이지만, 품질 기준이 없으면 검증되지 않은 산출물이 더 빨리 쌓입니다.",
      "제품 개발자는 AI가 만든 화면이나 분석 결과를 사용자 계약, 데이터 정의, 접근성, 성능 기준으로 재검토해야 합니다.",
      "팀의 경쟁력은 AI 도구 목록보다 어떤 반복 업무를 표준 워크플로로 흡수했는지에서 드러납니다."
    ],
    developerActions: [
      "AI로 만든 프로토타입은 디자인, 데이터 계약, 접근성, 성능, 보안 체크리스트를 통과해야 개발 backlog로 올리세요.",
      "지표 분석 에이전트에는 metric definition, source table, aggregation rule, confidence note를 답변에 포함시키세요.",
      "프런트엔드 AI 워크플로에는 component inventory, design token, visual regression, browser support 기준을 연결하세요.",
      "AI 실험 결과를 일회성 데모로 두지 말고 재사용 가능한 prompt, script, template, eval checklist로 남기세요."
    ],
    risks: [
      "비개발자가 만든 AI 프로토타입이 운영 데이터, 권한, 성능 비용을 고려하지 못한 채 제품 기대치를 만들 수 있습니다.",
      "지표 분석 에이전트가 데이터 정의를 잘못 이해하면 의사결정 오류가 빠르게 확산됩니다.",
      "AI 워크플로가 개인별 노하우로만 남으면 팀 표준이 아니라 자동화된 그림자 프로세스가 됩니다."
    ],
    sourceLinks: [
      {
        title: "AI로 웹 엔지니어 없이 LINE 앱 안에서 그룹 영상 통화 서비스 만들기",
        source: "LINE Engineering",
        url: "https://techblog.lycorp.co.jp/ko/building-group-video-calls-inside-line-app-with-ai-and-line-planet"
      },
      {
        title: "프롬프팅에서 워크플로로, AI로 프런트엔드 개발 생산성 끌어올리기",
        source: "LINE Engineering",
        url: "https://techblog.lycorp.co.jp/ko/techverse2026-10"
      },
      {
        title: "AI 에이전트로 카카오톡 추천 지표 분석 자동화하기",
        source: "Kakao Tech",
        url: "https://tech.kakao.com/posts/824"
      },
      {
        title: "디자이너에게 AI로 뭐든 만들어보라고 한다면",
        source: "Toss Tech",
        url: "https://toss.tech/article/ai_contest"
      },
      {
        title: "GenPage: Towards End-to-End Generative Homepage Construction at Netflix",
        source: "Netflix TechBlog",
        url: "https://netflixtechblog.com/genpage-towards-end-to-end-generative-homepage-construction-at-netflix-77146fba8a08?source=rss----2615bd06b42e---4"
      }
    ]
  },
  {
    id: "daily-2026-07-05-ai-security-supply-chain",
    title: "AI 시대 보안은 프롬프트보다 공급망과 실행 경계를 본다",
    category: "Security",
    date: "2026-07-05",
    readTime: "8 min read",
    views: "Codex Daily",
    tags: ["Security", "Supply Chain", "AI Browser", "Phishing", "PyPI", "WAF"],
    summary: "AI browser 공격, AI-generated phishing, 내부 PyPI 방어, vulnerability harness 사례가 동시에 잡혔습니다. AI 보안은 모델 필터링만으로는 부족하고 실행 환경과 공급망 통제가 핵심입니다.",
    content: "오늘 보안 신호는 AI 자체보다 AI가 접속하는 브라우저, 패키지 저장소, 이메일, WAF, 배포 도구의 경계에서 나왔습니다. Ars는 AI 브라우저가 guardrail을 우회하는 공격을 다뤘고 AWS는 AI-generated phishing 탐지를, Cloudflare는 vulnerability harness와 threat intel WAF rule을 소개했습니다. 국내에서는 당근의 내부 PyPI proxy 공급망 방어 글이 개발팀이 바로 적용할 수 있는 현실적인 보안 신호입니다.",
    trends: [
      "AI 에이전트와 브라우저는 웹 페이지, 로컬 파일, 세션, 내부 도구 사이의 기존 신뢰 경계를 흐립니다.",
      "AI로 생성된 피싱과 취약점 탐지는 방어 측에도 자동화와 triage loop를 요구합니다.",
      "패키지 저장소, 내부 proxy, dependency policy 같은 기본 공급망 통제가 AI 개발 속도 증가와 함께 더 중요해집니다."
    ],
    whyMatters: [
      "AI 에이전트가 코드를 쓰고 명령을 실행하면 dependency confusion, secret leakage, malicious prompt가 실제 변경으로 이어질 수 있습니다.",
      "보안팀만의 문제가 아니라 개발자가 사용하는 도구 체인 전체가 공격면이 됩니다.",
      "모델 안전장치보다 sandbox, permission, provenance, logging이 더 직접적인 방어선일 때가 많습니다."
    ],
    developerActions: [
      "AI 코딩 도구가 접근 가능한 디렉터리, 명령어, 네트워크 대상, 환경 변수를 제한하세요.",
      "내부 패키지 proxy에는 allowlist, hash pinning, quarantine, typosquat 탐지를 적용하세요.",
      "AI 브라우저/에이전트 테스트에는 prompt injection 페이지, malicious link, hidden instruction, file exfiltration 시나리오를 넣으세요.",
      "보안 자동화는 탐지 결과만 만들지 말고 triage owner, severity rule, rollback playbook까지 연결하세요."
    ],
    risks: [
      "AI 보안 논의를 모델 alignment로만 좁히면 실제 침투 경로인 패키지, 세션, 권한, 로그를 놓칩니다.",
      "자동 triage가 잘못된 우선순위를 만들면 중요한 취약점이 노이즈에 묻힐 수 있습니다.",
      "에이전트 sandbox가 개발 편의 때문에 예외를 많이 허용하면 사실상 통제가 사라집니다."
    ],
    sourceLinks: [
      {
        title: "New attack provides one more reason why AI browsers are a bad idea",
        source: "Ars Technica AI",
        url: "https://arstechnica.com/security/2026/06/ai-browsers-can-be-lulled-into-a-dream-world-where-guardrails-no-longer-apply/"
      },
      {
        title: "How Amazon Bedrock catches AI-generated phishing",
        source: "AWS ML Blog",
        url: "https://aws.amazon.com/blogs/machine-learning/how-amazon-bedrock-catches-ai-generated-phishing/"
      },
      {
        title: "Build your own vulnerability harness",
        source: "Cloudflare Blog",
        url: "https://blog.cloudflare.com/build-your-own-vulnerability-harness/"
      },
      {
        title: "Turning Cloudflare’s threat indicators into real-time WAF rules",
        source: "Cloudflare Blog",
        url: "https://blog.cloudflare.com/realtime-threat-intel-waf-rules/"
      },
      {
        title: "How We Protect Karrot’s Internal PyPI Proxy from Supply Chain Attacks",
        source: "Daangn Tech",
        url: "https://medium.com/daangn/how-we-protect-karrots-internal-pypi-proxy-from-supply-chain-attacks-0cf197205915?source=rss----4505f82a2dbd---4"
      }
    ]
  }
];
