// Codex Automation이 매일 갱신하는 개발자용 트렌드 카드 데이터
// 파일이 없거나 로드에 실패하면 data.js의 기본 aiTrendsData가 사용됩니다.
window.dailyTrendCards = [
  {
    id: "daily-2026-07-02-ai-office-stack",
    title: "AI 오피스와 에이전트형 업무도구가 개발 생산성 레이어로 이동 중",
    category: "Agent",
    date: "2026-07-02",
    readTime: "7 min read",
    views: "Codex Daily",
    tags: ["AI Office", "Agent", "Workflow", "Productivity"],
    summary: "AI가 단순 챗봇이 아니라 문서, 메일, 협업, 코드 생성까지 묶는 업무 운영체제 레이어로 확장되는 흐름이 강해지고 있습니다.",
    content: "TechCrunch의 AI 오피스 대체재 투자 기사와 Gemini Spark의 Mac 출시 흐름은 AI 도구가 별도 앱이 아니라 매일 쓰는 생산성 앱 안으로 들어오고 있음을 보여줍니다. 개발자 입장에서는 IDE 안의 코드 보조만 볼 것이 아니라, 기획 문서, 이슈 정리, 릴리즈 노트, 고객 응답까지 이어지는 엔드투엔드 업무 흐름을 자동화 대상으로 봐야 합니다.",
    trends: [
      "AI 오피스 제품은 문서 작성보다 업무 맥락 보존과 다음 행동 제안을 경쟁력으로 삼고 있습니다.",
      "데스크톱 상주형 에이전트는 IDE 밖의 개발자 업무까지 자동화 대상으로 가져옵니다.",
      "개발 조직의 생산성 개선은 코드 생성 속도보다 요구사항 정리, 회의록, QA, 배포 커뮤니케이션 자동화에서 더 크게 나타날 수 있습니다."
    ],
    whyMatters: [
      "개발자는 코드 작성자에서 업무 흐름 설계자로 이동해야 합니다.",
      "팀 내부 문서와 이슈 트래커를 AI가 읽기 좋은 구조로 정리하는 역량이 중요해집니다.",
      "AI 도구 도입 기준은 모델 성능보다 실제 협업 루프에 얼마나 잘 붙는지로 바뀝니다."
    ],
    developerActions: [
      "반복되는 개발 문서 작업을 목록화하고 자동화 후보를 3개 선정하세요.",
      "PR 설명, 릴리즈 노트, 장애 회고 템플릿을 AI가 채우기 쉬운 구조로 정리하세요.",
      "개인 생산성 앱보다 팀 표준 워크플로우에 붙일 수 있는 도구를 우선 평가하세요."
    ],
    risks: [
      "업무 데이터가 외부 도구로 흐를 때 보안/권한 경계가 흐려질 수 있습니다.",
      "AI가 만든 문서가 사실 검증 없이 의사결정 자료로 쓰이는 위험이 있습니다."
    ],
    sourceLinks: [
      {
        title: "Indian tech tycoon bets $30M to build an AI alternative to Microsoft Office",
        source: "TechCrunch AI",
        url: "https://techcrunch.com/2026/07/01/indian-tech-tycoon-bets-30m-to-build-an-ai-alternative-to-microsoft-office/"
      },
      {
        title: "Gemini Spark, Google’s agentic assistant, is now available on Mac",
        source: "TechCrunch AI",
        url: "https://techcrunch.com/2026/07/01/gemini-spark-googles-agentic-assistant-is-now-available-on-mac/"
      }
    ]
  },
  {
    id: "daily-2026-07-02-ai-crawler-economy",
    title: "AI 크롤러 유료화와 콘텐츠 권리 정책이 기술 스택 이슈로 부상",
    category: "AI",
    date: "2026-07-02",
    readTime: "6 min read",
    views: "Codex Daily",
    tags: ["Crawler", "Content", "Policy", "Cloudflare"],
    summary: "AI 학습용 크롤러와 검색용 크롤러를 분리하고 비용을 부과하려는 움직임은 개발자에게도 API, 캐싱, 데이터 라이선스 설계 문제로 이어집니다.",
    content: "Cloudflare의 정책 변화는 AI 기업과 퍼블리셔 사이의 갈등을 인프라 레이어에서 조정하려는 신호입니다. 웹 데이터를 활용하는 제품을 만드는 팀은 이제 robots.txt만 확인하는 수준을 넘어, 검색 인덱싱, 모델 학습, RAG 수집, 캐시 재배포의 목적을 명확히 나누어야 합니다.",
    trends: [
      "AI 학습용 크롤링과 검색용 크롤링을 기술적으로 구분하려는 압력이 커지고 있습니다.",
      "콘텐츠 접근 제어가 CDN, WAF, 봇 관리 정책과 더 직접적으로 결합되고 있습니다.",
      "RAG 서비스와 에이전트형 브라우저 도구는 출처 추적과 라이선스 설명 가능성이 더 중요해집니다."
    ],
    whyMatters: [
      "데이터 수집 파이프라인도 제품 리스크의 핵심 일부가 됩니다.",
      "출처 저장, 수집 목적 기록, 재사용 범위 제한이 개발 구현 요구사항으로 내려올 가능성이 높습니다.",
      "무단 수집에 기대는 기능은 이후 비용이나 차단 리스크를 크게 가질 수 있습니다."
    ],
    developerActions: [
      "RSS/RAG/크롤링 파이프라인에 source, license, collectedAt, purpose 필드를 명시하세요.",
      "캐시된 원문과 요약문을 구분 저장하고 삭제 요청 대응 경로를 설계하세요.",
      "서비스 약관상 재사용 가능한 데이터와 단순 링크/메타데이터만 사용할 데이터를 분리하세요."
    ],
    risks: [
      "출처 없는 요약은 신뢰성과 법적 대응력이 모두 낮습니다.",
      "AI 제품 성장 이후에 데이터 권리 문제를 고치려면 비용이 크게 증가합니다."
    ],
    sourceLinks: [
      {
        title: "Cloudflare’s new policy pushes AI companies to pay for publishers’ content",
        source: "TechCrunch AI",
        url: "https://techcrunch.com/2026/07/01/cloudflares-new-policy-pushes-ai-companies-to-pay-for-publishers-content/"
      }
    ]
  },
  {
    id: "daily-2026-07-02-korea-testing-docs",
    title: "국내 기술 블로그는 테스트, 문서화, 내부 플랫폼 품질로 무게중심 이동",
    category: "Tool",
    date: "2026-07-02",
    readTime: "6 min read",
    views: "Codex Daily",
    tags: ["Testing", "Technical Writing", "Platform", "Quality"],
    summary: "국내 피드에서는 화려한 모델 출시보다 테스트 체계, 기술문서, 내부 플랫폼 품질처럼 조직 생산성을 지탱하는 주제가 많이 보입니다.",
    content: "Toss, LINE, NAVER, Daangn 계열 피드에서는 AI 도입 자체보다 AI 시대에 더 중요해지는 엔지니어링 운영 역량이 두드러집니다. 테스트 방식을 만드는 팀, 기술문서의 책임, 사내 라이브러리 운영, 데이터/플랫폼 품질 관리가 개발자 생산성의 기반으로 다뤄지고 있습니다.",
    trends: [
      "국내 조직은 AI 도구보다 개발 프로세스와 품질 기준을 정비하는 이야기를 많이 공유하고 있습니다.",
      "테스트 자동화와 기술문서는 AI가 코드를 많이 만들수록 더 중요한 검증 레이어가 됩니다.",
      "사내 플랫폼과 공통 라이브러리 운영 경험이 외부 오픈소스 영향력으로 이어지는 사례가 늘고 있습니다."
    ],
    whyMatters: [
      "AI가 코드를 빨리 만들수록 테스트와 문서 품질이 개발팀의 병목이 됩니다.",
      "개발자는 기능 구현뿐 아니라 검증 가능한 기준을 만드는 능력을 보여줘야 합니다.",
      "국내 실무형 블로그는 바로 적용 가능한 프로세스 개선 힌트를 제공할 가능성이 큽니다."
    ],
    developerActions: [
      "팀의 테스트 작성 기준과 실패 분석 템플릿을 문서화하세요.",
      "AI가 생성한 코드에 반드시 붙어야 할 테스트/문서 체크리스트를 만드세요.",
      "사내 공통 도구를 외부 오픈소스 수준으로 설명할 수 있는 README 구조를 정비하세요."
    ],
    risks: [
      "AI 도입을 코드 생성 속도만으로 평가하면 품질 부채가 빠르게 쌓입니다.",
      "문서와 테스트가 뒤처지면 자동화가 오히려 리뷰 비용을 키울 수 있습니다."
    ],
    sourceLinks: [
      {
        title: "누군가는 토스를 테스트하는 동안, 우리는 테스트하는 법을 만듭니다.",
        source: "Toss Tech",
        url: "https://toss.tech/"
      },
      {
        title: "es-toolkit: How a Small Internal Library Became a Global Project",
        source: "Toss Tech",
        url: "https://toss.tech/"
      }
    ]
  },
  {
    id: "daily-2026-07-02-supply-chain-security",
    title: "공급망 보안은 AI 시대에도 개발자의 기본 방어선",
    category: "Security",
    date: "2026-07-02",
    readTime: "5 min read",
    views: "Codex Daily",
    tags: ["Security", "SupplyChain", "PyPI", "DevOps"],
    summary: "패키지 저장소와 내부 프록시 보호 사례는 AI가 만든 코드가 늘어날수록 의존성 검증과 배포 통제가 더 중요해진다는 점을 보여줍니다.",
    content: "Daangn/Karrot의 내부 PyPI 프록시 보호 사례는 AI 도구가 제안하는 패키지와 스니펫을 무비판적으로 받아들이는 개발 환경에서 특히 의미가 있습니다. 개발 생산성을 높이는 만큼, 의존성 출처 검증과 내부 저장소 정책도 함께 강화되어야 합니다.",
    trends: [
      "패키지 공급망 공격은 AI 코드 생성 시대에 더 쉽게 개발 흐름 안으로 들어올 수 있습니다.",
      "내부 패키지 프록시와 승인된 레지스트리 정책은 선택이 아니라 기본 안전장치가 되고 있습니다.",
      "보안은 별도 팀의 일이 아니라 개발 워크플로우의 기본 가드레일로 흡수되고 있습니다."
    ],
    whyMatters: [
      "AI가 제안한 라이브러리도 출처와 유지보수 상태를 검증해야 합니다.",
      "개발자는 의존성 추가 PR에서 보안 리스크를 설명할 수 있어야 합니다.",
      "내부 패키지 정책은 생산성과 보안을 동시에 잡는 플랫폼 과제가 됩니다."
    ],
    developerActions: [
      "새 의존성 추가 시 라이선스, 다운로드 출처, maintainer, 최근 릴리즈 여부를 체크하세요.",
      "패키지 설치 경로를 내부 프록시나 lockfile 기반으로 제한하는 방안을 검토하세요.",
      "AI 코드 리뷰 체크리스트에 의존성/공급망 항목을 추가하세요."
    ],
    risks: [
      "생성형 AI가 제안한 가짜 패키지나 typosquatting 패키지를 설치할 수 있습니다.",
      "개발 속도만 강조하면 lockfile 관리와 취약점 패치가 뒤로 밀립니다."
    ],
    sourceLinks: [
      {
        title: "How We Protect Karrot’s Internal PyPI Proxy from Supply Chain Attacks",
        source: "Daangn Tech",
        url: "https://medium.com/daangn/how-we-protect-karrots-internal-pypi-proxy-from-supply-chain-attacks-0cf197205915"
      },
      {
        title: "당근이 파이썬 공급망 공격에 대응하는 방법",
        source: "Daangn Tech",
        url: "https://medium.com/daangn/"
      }
    ]
  }
];
