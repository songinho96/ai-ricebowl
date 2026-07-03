// Codex Automation이 매일 갱신하는 개발자용 트렌드 카드 데이터
// 파일이 없거나 로드에 실패하면 data.js의 기본 aiTrendsData가 사용됩니다.
window.dailyTrendCards = [
  {
    id: "daily-2026-07-03-agent-runtime-infra",
    title: "에이전트는 앱 기능이 아니라 런타임 인프라가 되고 있다",
    category: "Agent",
    date: "2026-07-03",
    readTime: "8 min read",
    views: "Codex Daily",
    tags: ["Agent", "Runtime", "MCP", "A2A", "Cloudflare", "AWS"],
    summary: "오늘 수집된 해외 피드의 강한 신호는 에이전트가 챗봇 UI를 넘어 배포, 인증, 라우팅, 도구 호출, 관측성까지 포함하는 실행 인프라로 이동하고 있다는 점입니다.",
    content: "Cloudflare는 에이전트가 계정을 만들고 배포할 수 있는 Temporary Accounts와 Agents SDK 확장을 내놓았고, AWS는 A2A 게이트웨이와 AgentCore 관측성, 메모리 필터링을 강조했습니다. X의 MCP 서버, GitHub의 agent-driven development, VentureBeat의 Claude/Goose/Cowork 흐름까지 합치면 이제 개발자는 '모델을 어디에 붙일까'보다 '에이전트가 어떤 권한과 실행 경로로 움직일까'를 설계해야 합니다.",
    trends: [
      "에이전트 기능이 IDE나 채팅앱 내부 보조 기능에서 배포/운영 가능한 실행 계층으로 확장되고 있습니다.",
      "MCP, A2A, AgentCore처럼 에이전트와 도구를 연결하는 프로토콜/게이트웨이/런타임이 경쟁 축으로 떠오르고 있습니다.",
      "에이전트가 실제 리소스를 생성하거나 수정하기 시작하면서 임시 계정, 권한 위임, 감사 로그가 필수 설계 요소가 되고 있습니다."
    ],
    whyMatters: [
      "개발자는 에이전트를 '똑똑한 함수 호출기'가 아니라 권한을 가진 비인간 실행자로 모델링해야 합니다.",
      "서비스 아키텍처 안에 에이전트가 들어오면 인증, 비용, 장애 대응, 관측성의 책임 경계가 바뀝니다.",
      "팀 단위 생산성은 모델 성능보다 에이전트 실행 경로를 얼마나 통제 가능하게 설계했는지에 좌우됩니다."
    ],
    developerActions: [
      "에이전트가 호출할 수 있는 도구 목록을 read/write/admin 권한으로 분리하세요.",
      "MCP/A2A 도입 전 tool invocation log, request id, user delegation 정보를 저장할 위치를 먼저 정하세요.",
      "에이전트가 만든 변경은 일반 사용자 변경과 구분되는 audit trail을 남기도록 설계하세요.",
      "프로덕션 에이전트에는 실패 재현용 prompt, retrieved context, tool result snapshot을 함께 기록하세요."
    ],
    risks: [
      "권한 경계 없이 연결된 MCP 서버는 내부 시스템 자동 조작 통로가 될 수 있습니다.",
      "에이전트 실패는 단일 API 오류가 아니라 여러 도구 호출이 얽힌 분산 트랜잭션 장애로 나타날 수 있습니다.",
      "관측성 없이 에이전트를 배포하면 문제 발생 시 모델, 컨텍스트, 도구 중 무엇이 원인인지 분리하기 어렵습니다."
    ],
    sourceLinks: [
      {
        title: "Building a serverless A2A gateway for agent discovery, routing, and access control",
        source: "AWS ML Blog",
        url: "https://aws.amazon.com/blogs/machine-learning/building-a-serverless-a2a-gateway-for-agent-discovery-routing-and-access-control/"
      },
      {
        title: "Temporary Cloudflare Accounts for AI agents",
        source: "Cloudflare Blog",
        url: "https://blog.cloudflare.com/temporary-accounts/"
      },
      {
        title: "X now offers an MCP server to make its platform easier for AI tools to use",
        source: "TechCrunch AI",
        url: "https://techcrunch.com/2026/06/30/x-now-offers-an-mcp-server-to-make-its-platform-easier-for-ai-tools-to-use/"
      },
      {
        title: "Agent-driven development in Copilot Applied Science",
        source: "GitHub Engineering",
        url: "https://github.blog/ai-and-ml/github-copilot/agent-driven-development-in-copilot-applied-science/"
      }
    ]
  },
  {
    id: "daily-2026-07-03-context-engineering",
    title: "컨텍스트 엔지니어링이 AI 개발 생산성의 병목으로 부상",
    category: "AI",
    date: "2026-07-03",
    readTime: "7 min read",
    views: "Codex Daily",
    tags: ["Context Engineering", "RAG", "Memory", "Token Cost", "Developer Experience"],
    summary: "국내외 피드 모두에서 '모델에게 무엇을 얼마나 줄 것인가'가 핵심 주제로 반복됩니다. 단순 프롬프트보다 컨텍스트 제공자, 메모리 필터링, 토큰 비용 관리가 실무 과제가 되고 있습니다.",
    content: "NAVER D2의 통합 Context Provider, LINE의 ADK 컨텍스트 엔지니어링과 시멘틱 컨텍스트 OS, AWS AgentCore Memory의 metadata filtering은 같은 문제를 다른 층위에서 다룹니다. 에이전트가 복잡한 사내 시스템과 연결될수록 소스 전체를 넣는 방식은 비용과 품질 양쪽에서 한계를 드러냅니다.",
    trends: [
      "사내 데이터/서빙 자산을 자동 수집해 사람과 AI 모두에게 제공하는 Context Provider 패턴이 등장하고 있습니다.",
      "토큰 절감은 단순 비용 문제가 아니라 AI 응답 품질과 지연시간, 보안 범위를 동시에 좌우합니다.",
      "RAG는 검색 품질만이 아니라 어떤 메타데이터로 필터링하고 어떤 컨텍스트를 제외할지의 설계 문제로 이동합니다."
    ],
    whyMatters: [
      "개발자는 프롬프트 작성자보다 컨텍스트 설계자에 가까운 역할을 맡게 됩니다.",
      "AI 도입이 커질수록 문서, 코드, 로그, 스키마의 최신성과 소유권이 제품 품질에 직접 연결됩니다.",
      "잘못된 컨텍스트는 잘못된 코드보다 조용히 더 큰 의사결정 오류를 만듭니다."
    ],
    developerActions: [
      "팀의 핵심 컨텍스트를 source code, API schema, product rule, incident log, user data로 분류하세요.",
      "각 컨텍스트에 owner, freshness, sensitivity, allowed-use 필드를 붙이는 규칙을 만드세요.",
      "RAG/에이전트 입력에는 '무엇을 넣었는가'만큼 '무엇을 제외했는가'를 로그로 남기세요.",
      "토큰 절감 실험은 응답 품질 회귀 테스트와 함께 진행하세요."
    ],
    risks: [
      "컨텍스트가 오래되면 AI가 낡은 설계를 자신 있게 재생산합니다.",
      "민감 정보가 컨텍스트에 섞이면 모델/로그/외부 도구 경로로 퍼질 수 있습니다.",
      "토큰 절감만 목표로 하면 중요한 예외 규칙이 빠져 품질 사고로 이어질 수 있습니다."
    ],
    sourceLinks: [
      {
        title: "사람과 AI Agent를 위한 통합 Context Provider 구축",
        source: "NAVER D2",
        url: "https://d2.naver.com/helloworld/7056385"
      },
      {
        title: "ODW #7: 세 가지 방법으로 토큰 소비량 40% 절감! ADK를 이용한 컨텍스트 엔지니어링",
        source: "LINE Engineering",
        url: "https://techblog.lycorp.co.jp/ko/cut-token-usage-40-percent-with-adk-context-engineering"
      },
      {
        title: "Structured memory filtering with metadata in AgentCore Memory",
        source: "AWS ML Blog",
        url: "https://aws.amazon.com/blogs/machine-learning/structured-memory-filtering-with-metadata-in-agentcore-memory/"
      },
      {
        title: "시멘틱 컨텍스트 OS 설계: 에이전트 시스템의 토큰 스터핑을 넘어",
        source: "LINE Engineering",
        url: "https://techblog.lycorp.co.jp/ko/techverse2026-59"
      }
    ]
  },
  {
    id: "daily-2026-07-03-ai-verification-loop",
    title: "AI 시대 개발 능력은 생성보다 검증 루프에서 갈린다",
    category: "Tool",
    date: "2026-07-03",
    readTime: "7 min read",
    views: "Codex Daily",
    tags: ["Testing", "E2E", "Observability", "Code Review", "QA"],
    summary: "오늘 국내 피드의 가장 실무적인 메시지는 명확합니다. AI가 코드를 빨리 쓰게 만들수록 Playwright E2E, 로컬 검증, 리뷰 자동화, 관측성 같은 검증 체계가 더 중요해집니다.",
    content: "NAVER D2는 AI 에이전트를 위한 Playwright E2E 테스트 하네스를 다뤘고, LINE은 '개발 능력은 검증력으로 결정된다'는 메시지와 AI 코드 리뷰 플랫폼화 사례를 공유했습니다. Toss의 테스트 방법론 글과 AWS의 production agent debugging까지 보면, AI 개발의 경쟁력은 생성 속도가 아니라 실패를 빠르게 발견하는 루프에 있습니다.",
    trends: [
      "AI 에이전트가 작성한 코드를 신뢰하기 위해 E2E 테스트 하네스와 로컬 재현 환경이 중요해지고 있습니다.",
      "코드 리뷰는 사람이 모두 읽는 방식에서 AI가 1차 검토하고 사람이 리스크를 판단하는 구조로 이동합니다.",
      "프로덕션 에이전트는 일반 백엔드 서비스처럼 trace, evaluation, failure pattern 분석이 필요합니다."
    ],
    whyMatters: [
      "개발자의 차별점은 코드를 많이 만드는 능력보다 실패를 정의하고 재현하는 능력으로 이동합니다.",
      "테스트 없는 AI 코딩은 생산성 향상이 아니라 변경량 증가에 가깝습니다.",
      "검증 루프를 갖춘 팀은 AI 도구를 과감하게 쓰면서도 품질 리스크를 통제할 수 있습니다."
    ],
    developerActions: [
      "주요 사용자 흐름 3개를 Playwright/Cypress 같은 E2E 테스트로 먼저 고정하세요.",
      "AI가 생성한 PR에는 '어떤 실패 모드를 막는 테스트인가'를 설명하게 하세요.",
      "리뷰 자동화는 스타일 지적보다 권한, 데이터 손실, API 계약 변경 탐지에 집중시키세요.",
      "에이전트 작업에는 prompt, diff, test result, rollback plan을 하나의 리뷰 단위로 묶으세요."
    ],
    risks: [
      "AI 리뷰가 통과했다는 사실이 제품 품질을 보장하지 않습니다.",
      "E2E 테스트가 느리고 불안정하면 팀은 결국 AI 생성 코드를 수동 감으로 승인하게 됩니다.",
      "검증 기준 없이 자동화만 늘리면 리뷰 병목이 더 커질 수 있습니다."
    ],
    sourceLinks: [
      {
        title: "AI 에이전트를 위한 Playwright E2E 테스트 하네스 구축하기",
        source: "NAVER D2",
        url: "https://d2.naver.com/helloworld/6811215"
      },
      {
        title: "AI 시대의 개발 능력은 검증력으로 결정된다",
        source: "LINE Engineering",
        url: "https://techblog.lycorp.co.jp/ko/techverse2026-223"
      },
      {
        title: "Claude Code Action: 조직 전반의 코드 품질을 지키는 AI 코드 리뷰 플랫폼화",
        source: "LINE Engineering",
        url: "https://techblog.lycorp.co.jp/ko/building-ai-code-review-platform-with-claude-code-action"
      },
      {
        title: "Debugging production agents with Amazon Bedrock AgentCore Observability",
        source: "AWS ML Blog",
        url: "https://aws.amazon.com/blogs/machine-learning/debugging-production-agents-with-amazon-bedrock-agentcore-observability/"
      }
    ]
  },
  {
    id: "daily-2026-07-03-agent-security-monetization",
    title: "에이전트 보안과 콘텐츠 과금이 AI 제품의 기본 설계 항목으로 들어왔다",
    category: "Security",
    date: "2026-07-03",
    readTime: "6 min read",
    views: "Codex Daily",
    tags: ["Security", "AuthZ", "Crawler", "Monetization", "Supply Chain"],
    summary: "Cloudflare의 콘텐츠 과금/크롤러 정책, LINE의 AI 에이전트 인증·인가, Daangn의 PyPI 공급망 방어는 AI 제품이 이제 보안과 권리 비용을 먼저 설계해야 함을 보여줍니다.",
    content: "AI 에이전트가 웹 자원, 내부 시스템, 패키지 저장소를 오가며 실행되면 보안 리스크는 모델 문제가 아니라 시스템 설계 문제가 됩니다. Cloudflare는 콘텐츠 접근과 과금 모델을 인프라에서 다루고 있고, LINE은 ID-JAG와 보안 MCP 활용을, Daangn은 내부 PyPI 프록시 보호를 공유했습니다.",
    trends: [
      "AI 크롤러와 에이전트 접근은 검색/학습/도구 호출 목적별로 분리되어 관리되는 방향입니다.",
      "에이전트 인증·인가는 사람이 로그인하는 기존 OAuth 모델만으로 설명하기 어려운 위임 문제를 드러냅니다.",
      "AI가 추천한 패키지와 도구를 빠르게 붙이는 개발 습관은 공급망 공격면을 넓힙니다."
    ],
    whyMatters: [
      "AI 제품의 데이터 수집과 도구 호출은 법무/보안 이슈가 아니라 초기 아키텍처 이슈입니다.",
      "권한 없는 에이전트는 무력하고, 과권한 에이전트는 위험합니다.",
      "출처, 라이선스, 패키지 신뢰도를 저장하지 않는 시스템은 나중에 설명 가능성을 잃습니다."
    ],
    developerActions: [
      "크롤링/RAG 파이프라인에는 source, collectedAt, purpose, licenseHint 필드를 필수로 넣으세요.",
      "에이전트별 권한을 user-delegated, service-account, temporary-account로 구분하세요.",
      "패키지 설치는 내부 프록시, lockfile, allowlist를 통해 재현 가능하게 만드세요.",
      "MCP 서버 연결 전 도구별 read/write 범위와 민감정보 노출 여부를 검토하세요."
    ],
    risks: [
      "콘텐츠 출처와 목적을 기록하지 않으면 차단/삭제/과금 요구에 대응하기 어렵습니다.",
      "에이전트가 인간 계정을 공유하면 감사와 책임 소재가 무너집니다.",
      "AI가 제안한 의존성을 그대로 설치하면 typosquatting이나 가짜 패키지 위험이 커집니다."
    ],
    sourceLinks: [
      {
        title: "Announcing the Monetization Gateway: charge for any resource behind Cloudflare via x402",
        source: "Cloudflare Blog",
        url: "https://blog.cloudflare.com/monetization-gateway/"
      },
      {
        title: "ID-JAG The Hard Way: 실패로 배우는 AI 에이전트 보안 핸즈온",
        source: "LINE Engineering",
        url: "https://techblog.lycorp.co.jp/ko/id-jag-the-hard-way-learning-ai-agent-authz-through-failure"
      },
      {
        title: "ODW #3: MCP 서버를 안전하게 활용해 개발 효율 높이기",
        source: "LINE Engineering",
        url: "https://techblog.lycorp.co.jp/ko/improving-development-efficiency-with-secure-mcp-servers"
      },
      {
        title: "How We Protect Karrot’s Internal PyPI Proxy from Supply Chain Attacks",
        source: "Daangn Tech",
        url: "https://medium.com/daangn/how-we-protect-karrots-internal-pypi-proxy-from-supply-chain-attacks-0cf197205915"
      }
    ]
  },
  {
    id: "daily-2026-07-03-korea-ai-workflow",
    title: "국내 기술 조직은 AI를 개인 도구가 아니라 조직 학습 시스템으로 다루기 시작했다",
    category: "AI",
    date: "2026-07-03",
    readTime: "6 min read",
    views: "Codex Daily",
    tags: ["Organization", "Workshop", "Documentation", "Workflow", "AI Adoption"],
    summary: "LINE의 Orchestration Development Workshop, Toss의 기술문서/테스트 글, Kakao의 AI 에이전트 사례는 AI 도입의 핵심이 도구 구매가 아니라 조직의 작업 방식을 바꾸는 데 있음을 보여줍니다.",
    content: "국내 피드는 특히 실무 적용 관점이 강했습니다. LINE은 워크숍 기사 목록을 통해 사내 AI 활용 능력 확산을 구조화했고, Toss는 기술문서와 테스트 방식의 책임을 강조했으며, Kakao는 추천 지표 분석 자동화와 메시징 스트레스 테스트에서 AI가 덜어준 부분을 공유했습니다.",
    trends: [
      "AI 활용은 개인 생산성 경쟁에서 팀 단위 학습/워크숍/가이드 운영으로 이동하고 있습니다.",
      "문서화와 테스트는 AI가 대체할 일이 아니라 AI를 안정적으로 쓰기 위한 기준 역할을 합니다.",
      "업무 자동화 성공 사례는 모델보다 문제 정의, 운영 데이터, 검증 루프가 명확한 곳에서 나옵니다."
    ],
    whyMatters: [
      "개발자는 AI를 잘 쓰는 개인을 넘어 팀의 반복 가능한 방법론을 만드는 사람으로 평가받게 됩니다.",
      "조직 지식이 문서화되지 않으면 AI 도입 효과는 개인 노하우에 갇힙니다.",
      "국내 사례는 바로 적용 가능한 워크숍/문서/테스트 운영 힌트를 제공합니다."
    ],
    developerActions: [
      "팀에서 AI로 해결한 업무를 사례 카드로 남기고 실패 사례도 함께 기록하세요.",
      "문서화 기준을 '사람이 읽기 좋음'에서 'AI가 참조해도 오해하지 않음'까지 확장하세요.",
      "AI 워크숍은 도구 소개보다 실제 팀 업무 하나를 끝까지 자동화하는 형식으로 설계하세요.",
      "AI 도입 효과는 생성 코드 줄 수가 아니라 리드타임, 리뷰 대기, 장애 재현 시간으로 측정하세요."
    ],
    risks: [
      "개인별 AI 사용법만 늘어나면 팀 전체의 품질 기준은 오히려 불균일해질 수 있습니다.",
      "자동화 사례를 문서화하지 않으면 같은 시행착오가 팀 안에서 반복됩니다.",
      "도구 중심 교육은 실제 업무 전환으로 이어지지 않을 가능성이 큽니다."
    ],
    sourceLinks: [
      {
        title: "AI 활용 능력을 높이기 위한 사내 워크숍, Orchestration Development Workshop 기사 목록",
        source: "LINE Engineering",
        url: "https://techblog.lycorp.co.jp/ko/orchestration-development-workshop-article-list"
      },
      {
        title: "6. 도구를 넘어, 기준과 책임으로",
        source: "Toss Tech",
        url: "https://toss.tech/article/technical-writing-6"
      },
      {
        title: "AI 에이전트로 카카오톡 추천 지표 분석 자동화하기",
        source: "Kakao Tech",
        url: "https://tech.kakao.com/posts/824"
      },
      {
        title: "메시징 서버의 스트레스 테스트 노하우와 AI가 덜어 준 부분",
        source: "Kakao Tech",
        url: "https://tech.kakao.com/posts/822"
      }
    ]
  }
];
