// Codex Automation이 매일 갱신하는 개발자 생존 가이드 데이터
window.dailySurvivalGuides = [
  {
    id: "daily-survival-agent-permission-2026-07-05",
    title: "에이전트에게 도구를 열기 전에 권한표부터 만들어라",
    subtitle: "A2A, MCP, Context Provider를 붙이는 속도보다 중요한 것은 어떤 에이전트가 어떤 자원을 왜 만질 수 있는지 설명 가능한 상태로 두는 일입니다.",
    date: "2026-07-05",
    readTime: "17 min read",
    category: "에이전트 운영",
    author: "AI 밥그릇 데일리 리포트",
    image: "assets/blog_survival.png",
    introduction: "오늘 RSS에서 AWS의 A2A gateway와 AgentCore Memory, Cloudflare의 Temporary Accounts, NAVER의 Context Provider, LINE의 보안 MCP 사례가 동시에 잡혔습니다. 공통점은 간단합니다. 에이전트가 실제 일을 하려면 모델 호출보다 권한, 라우팅, 메모리, 감사 로그가 먼저 안정화되어야 합니다. 내일부터 에이전트를 붙일 개발자는 새 프롬프트보다 tool permission matrix를 먼저 작성해야 합니다.",
    sections: [
      {
        title: "1. 에이전트를 사용자 대신 행동하는 actor로 모델링하라",
        content: `에이전트를 단순한 API client로 보면 위험합니다. 에이전트는 사용자의 요청을 해석하고, 내부 문서를 읽고, 여러 도구를 호출하고, 때로는 데이터를 수정합니다. 따라서 로그와 권한 모델에서도 사람, 서비스 계정, 배치 작업과 다른 actor type으로 다뤄야 합니다.

최소한 아래 필드를 남기십시오.

- actor_type: human, service, agent 중 하나
- agent_id: 어떤 에이전트 또는 워크플로인지
- delegated_user_id: 누구의 권한을 위임받았는지
- delegation_reason: 사용자가 어떤 작업을 요청했는지
- tool_name: 호출한 도구
- resource_id: 읽거나 바꾼 대상
- request_id: 전체 작업을 묶는 추적 키
- approval_state: 자동 실행인지, 사람 승인 후 실행인지

이 정보가 없으면 사고가 났을 때 "AI가 했다"는 말밖에 남지 않습니다. 운영에서는 그런 설명이 아무 가치가 없습니다.`
      },
      {
        title: "2. tool permission matrix를 먼저 작성하라",
        content: `MCP 서버나 내부 tool을 붙이기 전 표 하나를 만드십시오. 행은 에이전트, 열은 도구입니다. 각 셀에는 허용 범위와 승인 조건을 씁니다.

권한 등급은 단순해야 오래 갑니다.

- read: 조회만 가능
- suggest: 변경안을 만들 수 있지만 적용은 불가
- write: 제한된 리소스 변경 가능
- deploy: 배포나 외부 공개 가능
- admin: 권한, 결제, 보안 설정 변경 가능

기본값은 deny여야 합니다. 에이전트가 read 권한으로 충분한데 write 토큰을 받는 순간, 작은 프롬프트 오류가 데이터 변경 사고로 커집니다. 특히 admin, billing, deploy 권한은 사람 승인 없이 자동 실행하지 않는 편이 안전합니다.`
      },
      {
        title: "3. Context Provider에는 본문보다 메타데이터가 중요하다",
        content: `컨텍스트 공급 계층은 문서를 많이 넣는 시스템이 아닙니다. 에이전트가 믿어도 되는 지식과 믿으면 안 되는 지식을 구분하게 만드는 시스템입니다.

문서나 데이터 조각마다 아래 메타데이터를 붙이십시오.

- owner: 누가 관리하는 정보인가
- source_url: 원본은 어디인가
- updated_at: 언제 갱신되었는가
- freshness_policy: 얼마나 오래 유효한가
- permission_scope: 어떤 사용자와 에이전트가 볼 수 있는가
- confidence: 자동 추출인지, 사람이 승인한 정보인지
- related_system: 어떤 서비스나 DB와 연결되는가

에이전트의 답변 품질은 모델보다 컨텍스트 품질에 더 자주 막힙니다. 오래된 runbook, 권한 없는 데이터, 출처 없는 요약이 섞이면 좋은 모델도 위험한 답을 냅니다.`
      },
      {
        title: "4. 도구 호출은 이벤트 소싱처럼 기록하라",
        content: `에이전트 작업은 단일 함수 호출이 아니라 작은 workflow입니다. 문서를 찾고, API를 조회하고, 변경안을 만들고, 배포하고, 알림을 보냅니다. 실패 분석을 하려면 이 단계를 시간순 이벤트로 기록해야 합니다.

각 이벤트에는 다음을 남기십시오.

- started_at, finished_at
- input_summary와 input_hash
- output_summary와 output_hash
- external_network_call 여부
- cost 또는 token usage
- retry count
- error class
- rollback handler 존재 여부

원문 입력 전체를 항상 저장하면 개인정보와 비밀값 문제가 생깁니다. 대신 요약과 hash를 남기고, 민감한 원문은 보존 정책이 있는 별도 저장소에 두는 편이 낫습니다.`
      },
      {
        title: "5. 내일 아침 적용할 체크리스트",
        content: `작게 시작하려면 현재 팀에서 쓰는 AI 자동화 하나만 골라 아래를 적용하십시오.

- 에이전트 이름과 소유자를 정한다
- 호출 가능한 도구 목록을 만든다
- 각 도구를 read, suggest, write, deploy, admin으로 분류한다
- write 이상은 사람 승인 필요 여부를 적는다
- tool invocation 로그 스키마를 만든다
- 실패 시 되돌릴 수 있는 리소스와 없는 리소스를 나눈다
- 컨텍스트 소스마다 owner와 updated_at을 붙인다
- 한 달 뒤 삭제하거나 축소할 권한을 표시한다

이 정도만 해도 에이전트 도입 대화가 훨씬 구체적으로 바뀝니다. "무엇을 자동화할까"보다 "어디까지 맡겨도 되는가"가 먼저 정리되기 때문입니다.`
      }
    ]
  },
  {
    id: "daily-survival-ai-coding-verification-2026-07-05",
    title: "AI 코딩을 쓰는 팀은 실패 재현 루프를 제품처럼 관리하라",
    subtitle: "AI가 코드를 빠르게 쓰는 시대에는 구현력보다 검증력, 테스트 데이터, 롤백 기준이 팀의 실제 생산성을 결정합니다.",
    date: "2026-07-05",
    readTime: "18 min read",
    category: "AI 개발 프로세스",
    author: "AI 밥그릇 데일리 리포트",
    image: "assets/blog_survival.png",
    introduction: "TechCrunch의 Claude Code 금지 보도, GitHub의 agent-driven development 회고, LINE의 검증력 중심 개발 경험, NAVER의 Playwright E2E 하네스, Toss의 테스트 문화 글은 한 방향을 가리킵니다. AI 코딩 도입의 성패는 누가 더 많은 코드를 생성하느냐가 아니라 누가 더 빨리 실패를 재현하고 안전하게 되돌리느냐에 달려 있습니다.",
    sections: [
      {
        title: "1. 구현 요청 전에 실패 조건 5개를 먼저 쓰라",
        content: `AI에게 바로 "이 기능 구현해줘"라고 말하면 대부분 성공 경로 중심의 코드가 나옵니다. 실무 사고는 성공 경로가 아니라 예외 경로에서 납니다. 구현 요청 전에 실패 조건을 먼저 써야 합니다.

기능마다 아래 질문에 답하십시오.

- 입력이 비어 있거나 오래되면 어떻게 되는가
- 같은 요청이 두 번 실행되면 안전한가
- 외부 API가 느리거나 실패하면 사용자는 무엇을 보는가
- 권한이 없는 사용자는 어디에서 막히는가
- 기존 데이터와 새 스키마가 동시에 존재하는 전환 기간이 있는가
- 로그에 민감 정보가 남지 않는가
- 배포 후 문제가 생기면 어떤 단위로 되돌릴 수 있는가

AI에게는 이 실패 조건을 먼저 읽히고 구현안을 만들게 하십시오. 생성 결과가 곧바로 달라집니다.`
      },
      {
        title: "2. AI 생성 PR 템플릿을 따로 둬라",
        content: `AI가 만든 PR은 변경량이 많고 설명은 그럴듯하며, 사람이 모든 줄을 완전히 이해하기 어렵습니다. 그래서 기존 PR보다 더 엄격한 요약 구조가 필요합니다.

AI 생성 PR에는 최소한 아래 항목을 요구하십시오.

- 목표: 어떤 사용자 문제를 해결하는가
- 생성 방식: 어떤 AI 도구와 어떤 주요 프롬프트를 썼는가
- 실패 조건: 의도적으로 막은 케이스는 무엇인가
- 테스트 결과: 단위, 통합, E2E, 수동 검증 중 무엇을 실행했는가
- 계약 변화: API, DB, 이벤트, 권한 정책이 바뀌었는가
- 새 의존성: 라이선스와 출처를 확인했는가
- 운영 확인: 배포 후 볼 로그와 지표는 무엇인가
- 롤백 계획: 어떤 파일, feature flag, migration을 되돌릴 수 있는가

이 항목을 채우지 못하면 아직 리뷰 가능한 작업 단위가 아닙니다.`
      },
      {
        title: "3. E2E 테스트는 적게, 하지만 위험 흐름부터 고정하라",
        content: `AI 시대라고 모든 화면을 E2E로 덮을 필요는 없습니다. 하지만 위험 흐름은 반드시 고정해야 합니다.

우선순위는 아래 순서가 좋습니다.

- 결제, 삭제, 권한 변경처럼 되돌리기 어려운 흐름
- 로그인부터 핵심 작업 완료까지의 대표 흐름
- 외부 API 실패, 빈 데이터, 권한 부족 같은 예외 흐름
- AI가 자주 수정하는 화면의 회귀 흐름

AI에게 테스트를 만들게 할 때는 이렇게 요청하십시오.

사용자 관점의 실패 시나리오 기준으로 Playwright E2E 테스트를 설계해줘. 구현 세부사항을 따라가지 말고, 테스트마다 예방하려는 장애를 한 줄로 설명해줘. 테스트 데이터 준비와 정리 방법도 포함해줘.

핵심은 "코드를 테스트"가 아니라 "사용자 약속을 테스트"하게 만드는 것입니다.`
      },
      {
        title: "4. AI 리뷰는 스타일보다 운영 리스크에 쓰라",
        content: `AI 리뷰 도구를 스타일 지적에만 쓰면 효과가 작습니다. 사람 리뷰어의 시간을 아끼려면 운영 리스크 후보를 먼저 찾게 해야 합니다.

리뷰 프롬프트에는 아래 기준을 넣으십시오.

- API 계약이 깨지는가
- 사용자가 볼 수 없는 데이터가 노출되는가
- 기존 데이터가 덮어써지거나 삭제되는가
- 실패 시 재시도와 중복 실행이 안전한가
- 로그에 비밀값이나 개인정보가 남는가
- 새 dependency가 supply chain 위험을 늘리는가
- feature flag나 rollback path가 있는가
- 관측 가능한 metric과 error log가 있는가

AI 리뷰 결과는 판결이 아니라 후보 목록입니다. 사람은 제품 맥락과 장애 비용을 기준으로 최종 위험도를 판단해야 합니다.`
      },
      {
        title: "5. 팀 루틴으로 고정하라",
        content: `개인 생산성 팁으로 끝내면 효과가 오래가지 않습니다. 팀 루틴으로 만들어야 합니다.

내일부터 적용할 운영 방식은 간단합니다.

- AI 작업 시작 전 실패 조건을 issue에 남긴다
- AI 생성 PR에는 별도 템플릿을 적용한다
- 위험 흐름 E2E는 병합 전 필수로 돌린다
- 새 의존성은 자동 검사와 사람 승인을 모두 거친다
- 운영 로그와 롤백 계획이 없으면 deploy하지 않는다
- 매주 AI가 만든 장애 후보와 놓친 테스트를 회고한다

AI 코딩의 목적은 코드를 많이 만드는 것이 아닙니다. 더 작은 비용으로 더 안전한 변경을 더 자주 배포하는 것입니다. 검증 루프가 없으면 그 목적에 도달할 수 없습니다.`
      }
    ]
  },
  {
    id: "daily-survival-ai-traffic-security-2026-07-05",
    title: "AI 트래픽과 보안 경계를 같은 로그에서 보라",
    subtitle: "AI crawler, agent, browser, package toolchain은 모두 개발자가 운영하는 자원을 소비합니다. 이제 접근 정책과 보안 로그를 제품 요구사항으로 다뤄야 합니다.",
    date: "2026-07-05",
    readTime: "16 min read",
    category: "웹 운영과 보안",
    author: "AI 밥그릇 데일리 리포트",
    image: "assets/blog_survival.png",
    introduction: "Cloudflare의 AI traffic options와 Monetization Gateway, Ars의 AI browser 공격 보도, AWS의 AI-generated phishing 탐지, 당근의 내부 PyPI proxy 방어 사례는 서로 다른 이야기가 아닙니다. AI가 웹과 개발 도구를 더 많이 소비할수록 접근 로그, 권한 정책, supply chain 방어가 개발자의 기본 업무가 됩니다.",
    sections: [
      {
        title: "1. AI 트래픽을 목적별로 분리해 기록하라",
        content: `AI bot을 단순히 허용 또는 차단으로만 다루면 곧 한계가 옵니다. 검색 노출은 필요하지만 학습은 막고 싶을 수 있습니다. 문서는 공개하지만 API 대량 호출은 과금하고 싶을 수 있습니다. 에이전트 실행은 허용하되 특정 tool은 인증 뒤에 두고 싶을 수 있습니다.

로그에는 최소한 아래 축이 필요합니다.

- actor: human, search crawler, training crawler, agent, unknown bot
- resource_type: page, docs, API, dataset, MCP tool
- auth_state: anonymous, user, partner, paid
- purpose_guess: search, train, summarize, action, abuse
- response_size와 compute_cost
- rate_limit_result
- policy_result: allow, block, challenge, paid_required

처음에는 purpose_guess가 완벽하지 않아도 됩니다. 중요한 것은 모든 AI 트래픽을 하나로 뭉개지 않는 것입니다.`
      },
      {
        title: "2. 공개 자원에도 라이선스와 freshness를 붙여라",
        content: `AI 에이전트는 사람이 읽는 페이지보다 구조화된 정보를 선호합니다. 개발자가 운영하는 문서와 API도 곧 에이전트가 소비하는 상품이 됩니다.

에이전트가 읽을 가능성이 큰 자원에는 아래 정보를 명시하십시오.

- 이 정보를 사용할 수 있는 목적
- 학습 데이터 사용 허용 여부
- 상업적 재사용 조건
- 마지막 갱신 시간
- 원본 출처
- rate limit과 인증 방식
- 오래된 정보일 때 확인할 endpoint

이 메타데이터가 없으면 AI 시스템은 오래된 문서를 자신 있게 요약하거나, 허용되지 않은 방식으로 데이터를 재사용할 수 있습니다.`
      },
      {
        title: "3. AI 브라우저와 에이전트는 hostile page로 테스트하라",
        content: `AI 브라우저의 위험은 사용자가 직접 클릭하지 않은 행동을 페이지 내용이 유도할 수 있다는 점입니다. 그래서 일반적인 happy path 테스트만으로는 부족합니다.

테스트 페이지에는 아래 시나리오를 넣으십시오.

- 숨겨진 instruction이 있는 HTML
- 링크 텍스트와 실제 URL이 다른 페이지
- 다운로드를 유도하는 prompt injection
- 내부 파일 경로를 읽으라고 지시하는 콘텐츠
- 세션 쿠키가 있는 상태에서 외부 전송을 유도하는 콘텐츠
- 사용자가 보지 못하는 aria-label이나 metadata에 명령을 숨긴 콘텐츠

목표는 모델을 속이는 재미있는 데모가 아닙니다. 에이전트가 어떤 입력 경계에서 행동을 멈춰야 하는지 명확히 정하는 것입니다.`
      },
      {
        title: "4. 공급망 방어를 AI 개발 루프에 넣어라",
        content: `AI 코딩 도구는 새 패키지를 쉽게 추천합니다. 이 장점은 dependency confusion, typosquatting, unmaintained package 위험과 붙어 있습니다.

내부 패키지 정책에는 아래를 포함하십시오.

- 사내 registry 또는 proxy 우선 사용
- package lock 필수
- 새 dependency 추가 시 license와 maintainer 확인
- 이름 유사 패키지 탐지
- hash pinning 또는 provenance 확인
- quarantine 기간 또는 수동 승인
- CI에서 known vulnerability scan 실행

AI가 추천한 패키지라는 이유로 더 신뢰해서는 안 됩니다. 오히려 출처 검증을 자동화해야 합니다.`
      },
      {
        title: "5. 개발자가 바로 할 수 있는 1주일 작업",
        content: `이번 주에 큰 플랫폼을 만들 필요는 없습니다. 다음 다섯 가지를 적용하면 충분히 출발점이 됩니다.

- 웹/API 로그에 bot과 agent 의심 traffic 필드를 추가한다
- 문서와 API의 AI 사용 정책을 한 페이지로 정리한다
- AI 코딩 도구가 새 dependency를 추가하면 PR에 이유와 대안을 쓰게 한다
- 에이전트 브라우저 테스트용 hostile page 3개를 만든다
- 내부 패키지 proxy 또는 registry 정책을 점검한다

AI 보안은 미래의 거대한 연구 주제가 아닙니다. 오늘 개발자가 쓰는 브라우저, 패키지, 로그, API 경계에서 이미 시작된 운영 문제입니다.`
      }
    ]
  }
];
