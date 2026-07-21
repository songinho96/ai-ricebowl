// Codex Automation이 매일 갱신하는 개발자 생존 가이드 데이터
window.dailySurvivalGuides = [
  {
    id: "daily-survival-agent-swarm-governance-2026-07-21",
    title: "Agent swarm을 도입하기 전에 작업 장부와 권한 경계를 만들어라",
    subtitle: "Cursor agent swarm/model economics, VentureBeat agent gap, Cloudflare Temporary Accounts, AWS MCP 흐름은 여러 agent를 붙이는 순간 비용·권한·감사가 핵심 운영 문제가 된다는 신호입니다.",
    date: "2026-07-21",
    readTime: "25 min read",
    category: "Agent 운영",
    author: "AI 밥그릇 데일리 리포트",
    image: "assets/blog_survival.png",
    introduction: "Agent swarm은 시연에서 가장 최신스럽게 들리는 키워드입니다. 하지만 실제 팀에서 중요한 질문은 agent를 몇 개 띄우느냐가 아니라 각 agent가 어떤 작업을 맡고, 어떤 모델을 쓰고, 어떤 권한으로, 어떤 비용 상한 안에서 움직이는지입니다. 오늘 피드의 Cursor agent economics, VentureBeat agent security/evaluation/orchestration gap, Cloudflare Temporary Accounts, AWS remote MCP는 모두 agent swarm이 prompt 기술이 아니라 운영 설계 문제임을 보여줍니다.",
    sections: [
      {
        title: "1. Agent swarm 작업 장부를 먼저 설계하라",
        content: `여러 agent를 병렬로 돌리면 작업이 빨라질 수 있지만 중복 작업, context drift, 비용 폭증, 책임 불명확성이 함께 생깁니다. 그래서 agent swarm은 job queue처럼 장부가 있어야 합니다.

필수 필드는 다음과 같습니다.

- task_id
- parent_task_id
- agent_role
- assigned_model
- token_budget
- delegated_identity
- allowed_tools
- expected_output
- accepted_output
- human_reviewer
- cost_estimate
- status
- audit_log_url

이 장부가 없으면 "agent가 많이 일했다"는 사실만 남고, 어떤 결과가 실제로 제품 변경에 기여했는지 알 수 없습니다.`
      },
      {
        title: "2. Frontier model은 모든 단계가 아니라 핵심 판단에만 써라",
        content: `오늘 HN의 모델 경제성 논의는 큰 모델을 모든 단계에 쓰는 방식이 오래가지 않는다는 점을 보여줍니다. workflow를 단계로 나누고 모델을 다르게 배치해야 합니다.

권장 분리는 다음과 같습니다.

- cheap/local model: 분류, 요약, 중복 제거, 파일 후보 탐색
- mid model: 일반 코드 수정, 문서 초안, 테스트 후보 작성
- frontier model: 어려운 설계 판단, 최종 핵심 edit, 고위험 리뷰
- human review: 권한 변경, 데이터 삭제, 보안/결제/배포

이렇게 분리하면 '최신 모델을 쓴다'가 아니라 '모델 경제성을 운영한다'고 말할 수 있습니다.`
      },
      {
        title: "3. Agent 권한은 사람 계정 공유가 아니라 delegation contract로 처리하라",
        content: `agent swarm이 사내 도구, GitHub, Slack, 배포 시스템, DB에 접근하기 시작하면 사람 token을 그대로 넘기는 방식은 위험합니다.

delegation contract에는 아래가 있어야 합니다.

- requested_by
- delegated_identity
- allowed_scopes
- forbidden_scopes
- approval_required
- expires_at
- revoke_path
- irreversible_actions
- post_action_verification

Cloudflare Temporary Accounts나 AWS MCP 흐름을 말할 때도 핵심은 기술 이름이 아니라 scope가 짧고 감사 가능한 위임 구조입니다.`
      },
      {
        title: "4. Eval은 정상 성공률보다 실패 모드를 먼저 보라",
        content: `agent swarm eval을 단순 task success rate로 보면 위험합니다. 실제 사고는 성공처럼 보이는 권한 초과와 잘못된 context 사용에서 나옵니다.

eval set에는 아래 케이스를 넣으십시오.

- agent가 read-only tool만 써야 하는데 write API를 호출하는 요청
- 오래된 문서를 최신 정책처럼 사용하는 요청
- 악성 문서가 tool instruction을 덮어쓰려는 요청
- 여러 agent가 같은 파일을 충돌되게 수정하는 요청
- 비용 상한을 초과하면서 계속 재시도하는 요청
- 사람 승인 없이 삭제, 결제, 배포를 실행하는 요청

점수는 success, permission_violation, context_error, duplicate_work, unnecessary_tool_call, cost_overrun을 따로 기록해야 합니다.`
      },
      {
        title: "5. 내일 아침 실행안",
        content: `팀에서 자동화하고 싶은 workflow 하나를 고르십시오. PR 리뷰, 릴리즈 노트, 장애 요약, QA replay, RSS 분석 중 하나면 충분합니다.

90분 안에 아래 산출물을 만드십시오.

- agent 역할표 1개
- 단계별 모델 라우팅표 1개
- delegation contract 초안 1개
- 실패 eval case 20개
- 비용 상한과 중단 조건
- 사람이 최종 승인해야 하는 irreversible action 목록

이 정도만 있어도 agent swarm을 단순 유행어가 아니라 운영 가능한 설계로 설명할 수 있습니다.`
      }
    ]
  },
  {
    id: "daily-survival-context-ledger-2026-07-21",
    title: "Context ledger를 만들면 RAG와 coding agent 품질이 같이 좋아진다",
    subtitle: "Ars Technica의 context-rich AI coding harness, VentureBeat context gap, NAVER Context Provider, LINE semantic context OS는 context를 데이터 제품처럼 관리해야 한다는 신호입니다.",
    date: "2026-07-21",
    readTime: "24 min read",
    category: "Context Engineering",
    author: "AI 밥그릇 데일리 리포트",
    image: "assets/blog_survival.png",
    introduction: "AI에게 더 많은 문서를 넣는다고 좋은 결과가 나오지 않습니다. 좋은 결과는 최신이고, 권한이 맞고, 출처가 분명하고, 압축 과정이 설명되는 context에서 나옵니다. 오늘 피드의 context-rich coding harness, AI context gap, NAVER Context Provider, LINE semantic context OS/토큰 절감 사례는 context가 prompt 재료가 아니라 운영해야 하는 데이터 제품임을 보여줍니다.",
    sections: [
      {
        title: "1. Context 조각마다 provenance를 붙여라",
        content: `context ledger의 기본 단위는 문서 전체가 아니라 agent가 읽는 context 조각입니다. 각 조각에는 메타데이터가 필요합니다.

권장 필드는 다음과 같습니다.

- context_id
- source_url
- source_type
- owner
- created_at
- updated_at
- freshness_ttl
- confidence
- allowed_use
- permission_scope
- related_system
- citation_required

이 필드가 없으면 agent는 오래된 문서, 권한 없는 데이터, 자동 요약, 사람 검토 문서를 같은 무게로 사용합니다.`
      },
      {
        title: "2. Coding agent 입력은 전체 repo가 아니라 manifest로 구성하라",
        content: `repo 전체를 context에 넣는 방식은 비싸고 불안정합니다. coding agent에게는 작업에 필요한 manifest를 만들어 주는 편이 좋습니다.

manifest에는 아래를 넣으십시오.

- task intent
- relevant files
- public API boundaries
- dependency graph
- recent diff
- failing tests
- ownership map
- no-go directories
- rollback notes

이렇게 하면 context window가 커져도 agent가 집중해야 할 정보가 명확해지고, context가 줄어도 graceful degradation이 가능합니다.`
      },
      {
        title: "3. Context 압축은 손실 기록을 남겨라",
        content: `context를 줄이는 과정에서 무엇이 빠졌는지 알 수 없으면 나중에 agent 실패를 설명할 수 없습니다.

압축 로그에는 아래를 남기십시오.

- original_token_count
- compacted_token_count
- dropped_sections
- retained_constraints
- citation_loss
- stale_context_removed
- confidence_after_compaction

LINE의 토큰 절감 사례처럼 비용 절감은 좋은 목표지만, 절감 과정에서 제약과 근거가 사라지면 품질 비용이 더 커집니다.`
      },
      {
        title: "4. Context ledger를 시연 기능으로 말하라",
        content: `AI RiceBowl은 이미 기사마다 source, link, region, category, date를 갖고 있습니다. 여기에 freshness, confidence, whyMatters, developerActions를 붙이면 단순 RSS가 아니라 agent briefing용 context ledger로 설명할 수 있습니다.

시연 멘트는 이렇게 잡으면 됩니다.

\`\`\`text
이 대시보드는 최신 AI 뉴스를 그냥 모으는 것이 아니라,
agent가 읽을 수 있는 source-backed context ledger로 바꿉니다.
각 카드는 출처, 영향, 개발자 action, risk를 갖고 있어
팀의 AI 도입 체크리스트로 바로 전환할 수 있습니다.
\`\`\`

이 표현은 RAG, MCP, agent workflow를 모두 자연스럽게 묶어줍니다.`
      },
      {
        title: "5. 내일 아침 실행안",
        content: `가장 자주 AI에게 먹이는 문서 묶음 하나를 고르십시오. README, API 문서, 장애 runbook, product spec, 뉴스 feed 중 하나면 됩니다.

반나절 안에 아래를 추가하십시오.

- context metadata schema
- freshness TTL 규칙
- allowed_use 분류
- stale context 제거 정책
- citation_required 여부
- context overflow 처리 정책
- agent 답변에 sourceLinks를 강제하는 규칙

이 작업은 RAG 품질과 coding agent 품질을 동시에 올립니다.`
      }
    ]
  },
  {
    id: "daily-survival-ai-verification-harness-2026-07-21",
    title: "AI가 만든 변경에는 Playwright와 acceptance gate를 붙여라",
    subtitle: "GitHub Copilot code review 개선기, NAVER Playwright E2E harness, LINE QA/검증력 글, AWS Nova Act QA는 AI coding의 핵심이 생성보다 검증 루프임을 보여줍니다.",
    date: "2026-07-21",
    readTime: "22 min read",
    category: "AI 개발 검증",
    author: "AI 밥그릇 데일리 리포트",
    image: "assets/blog_survival.png",
    introduction: "AI coding 도구를 쓰면 변경은 빨리 생깁니다. 문제는 그 변경을 받아들일 수 있는지 증명하는 일입니다. 오늘 피드의 GitHub Copilot code review 개선기, NAVER Playwright E2E 테스트 하네스, LINE QA/검증력 글, AWS Nova Act QA 흐름은 AI 개발 생산성을 검증 루프 없이 말하면 반쪽짜리라는 점을 보여줍니다.",
    sections: [
      {
        title: "1. AI 변경 PR 템플릿을 별도로 만들어라",
        content: `AI가 만든 변경은 설명이 그럴듯할 수 있기 때문에 reviewer가 근거 없이 수락하기 쉽습니다.

AI 변경 PR에는 아래 항목을 요구하십시오.

- human intent
- agent/tool used
- files touched
- behavior changed
- tests run
- tests missing
- UI replay evidence
- data/security impact
- observability impact
- rollback plan
- known uncertainty

핵심은 AI가 무엇을 했는지가 아니라 무엇을 검증하지 못했는지를 드러내는 것입니다.`
      },
      {
        title: "2. Playwright/E2E replay를 agent workflow에 연결하라",
        content: `UI나 workflow가 있는 제품에서 AI 변경은 screenshot만으로 충분하지 않습니다. 재현 가능한 replay가 있어야 합니다.

권장 workflow는 다음과 같습니다.

1. agent가 변경 계획을 작성한다
2. 사람이 승인하거나 low-risk policy gate를 통과한다
3. agent가 코드를 수정한다
4. unit/type/static check를 실행한다
5. Playwright로 핵심 사용자 흐름을 replay한다
6. screenshot 또는 trace를 저장한다
7. 실패 시 agent가 원인을 요약하되 자동 재시도 횟수를 제한한다
8. reviewer는 trace와 diff를 함께 본다

NAVER Playwright harness 흐름은 agent를 실제 제품 변경에 붙일 때 이런 검증 장치가 필요하다는 근거입니다.`
      },
      {
        title: "3. AI reviewer에게 팀 기준을 context로 줘라",
        content: `GitHub의 Copilot code review 사례는 도구가 많아져도 기준이 없으면 리뷰가 나빠질 수 있음을 보여줍니다.

AI reviewer context에는 아래가 필요합니다.

- architecture principles
- public API rules
- auth/billing/data deletion no-go areas
- flaky test list
- observability requirements
- migration rules
- rollback expectations
- owner map

AI reviewer는 일반 코드 조언자가 아니라 팀의 acceptance 기준을 실행하는 보조 reviewer여야 합니다.`
      },
      {
        title: "4. QA는 대체가 아니라 확장으로 설계하라",
        content: `LINE의 "AI는 QA를 대체하지 않았다"는 메시지는 중요합니다. AI는 반복 replay, test candidate 생성, log triage, edge case 탐색을 도울 수 있지만 최종 위험 판단과 release 책임은 팀에 남습니다.

AI QA에 맡기기 좋은 작업은 다음과 같습니다.

- 반복 UI flow replay
- accessibility smoke check
- test case 후보 생성
- flaky pattern 요약
- release note와 실제 diff 비교
- production log anomaly 후보 탐색

반대로 결제, 삭제, 개인정보, 보안 권한 변경은 사람 승인과 별도 evidence가 필요합니다.`
      },
      {
        title: "5. 내일 아침 실행안",
        content: `현재 서비스에서 가장 중요한 사용자 flow 하나를 고르십시오. 로그인, 검색, 결제, 글 작성, 리포트 조회 중 하나면 됩니다.

90분 안에 아래를 만드십시오.

- AI 변경 PR 템플릿
- Playwright smoke test 1개
- reviewer checklist
- no-merge-without-evidence 규칙
- AI reviewer용 repo policy 파일
- rollback note 예시

이걸 만든 뒤 AI가 만든 최근 변경 3개에 적용해 보면 팀의 검증 기준이 바로 보입니다.`
      }
    ]
  },
  {
    id: "daily-survival-agentic-web-data-boundary-2026-07-21",
    title: "Agentic web 시대에는 crawler 정책과 데이터 경계를 먼저 정하라",
    subtitle: "Anthropic 저작권 합의, Cloudflare AI traffic options/Monetization Gateway, LINE Kafka E2EE와 유해성 모델은 AI 제품의 데이터 접근 정책이 아키텍처 문제가 됐음을 보여줍니다.",
    date: "2026-07-21",
    readTime: "21 min read",
    category: "AI 데이터 거버넌스",
    author: "AI 밥그릇 데일리 리포트",
    image: "assets/blog_survival.png",
    introduction: "AI 제품은 웹과 문서를 읽으면서 가치가 생깁니다. 하지만 이제는 무엇을 읽을 수 있는지, 어떤 목적으로 쓸 수 있는지, 출처를 어떻게 표시할지, 삭제 요청을 어떻게 처리할지가 제품 요구사항입니다. 오늘 피드의 Anthropic 저작권 합의, Cloudflare AI traffic options, Attribution Business Insights, Monetization Gateway, LINE E2EE/유해성 모델 사례는 crawler와 RAG pipeline을 법무 뒤에 숨길 수 없다는 신호입니다.",
    sections: [
      {
        title: "1. Source별 allowed_use를 관리하라",
        content: `뉴스, 블로그, 사내 문서, 고객 데이터는 모두 같은 입력이 아닙니다. AI pipeline은 source별 사용 가능 범위를 알아야 합니다.

source metadata에는 아래를 넣으십시오.

- source_id
- owner
- license_or_terms
- allowed_for_summary
- allowed_for_rag
- allowed_for_training
- retention_days
- attribution_required
- opt_out_path
- deletion_request_path

AI RiceBowl처럼 외부 RSS를 쓰는 서비스는 특히 source attribution과 원문 링크를 일관되게 유지해야 합니다.`
      },
      {
        title: "2. Agentic traffic을 일반 bot traffic처럼 보지 마라",
        content: `Cloudflare의 AI traffic 옵션과 Precursor 흐름은 agentic behavior가 웹 보안과 분석의 새 대상이 됐음을 보여줍니다.

운영자가 봐야 할 질문은 다음과 같습니다.

- 이 요청은 사람 브라우저인가 agent인가
- 어떤 리소스를 반복적으로 읽는가
- 출처 표시나 과금 정책을 따라야 하는가
- rate limit과 cache 정책이 적절한가
- agent가 form submit이나 write action을 시도하는가
- user consent가 필요한 행동인가

Agentic web에서는 traffic classification이 제품 정책과 직접 연결됩니다.`
      },
      {
        title: "3. 민감 데이터는 agent가 읽기 전에 경계를 나눠라",
        content: `LINE Kafka E2EE 사례처럼 데이터가 이동하는 구간의 암호화와 접근 제어는 AI pipeline에도 중요합니다. agent가 읽고 나서 masking하는 방식은 늦습니다.

먼저 정의해야 할 경계는 다음과 같습니다.

- PII masking boundary
- tenant isolation
- purpose-based access
- audit log
- encryption in transit
- encryption at rest
- data minimization
- retention and deletion

이 경계가 없으면 RAG나 agent 기능이 커질수록 보안 검토가 병목이 됩니다.`
      },
      {
        title: "4. Moderation은 모델 하나가 아니라 운영 루프다",
        content: `LINE 오픈챗 유해성 모델은 AI safety 기능이 분류 모델 하나로 끝나지 않는다는 점을 보여줍니다.

moderation 운영에는 아래가 필요합니다.

- policy taxonomy
- training/eval dataset version
- false positive review
- false negative review
- appeal path
- drift monitoring
- adversarial examples
- human escalation

AI 제품의 안전 기능은 모델 성능표보다 정책과 피드백 루프가 더 중요합니다.`
      },
      {
        title: "5. 내일 아침 실행안",
        content: `현재 서비스의 crawler, RAG, analytics pipeline 중 하나를 고릅니다.

반나절 안에 아래를 작성하십시오.

- source registry
- allowed_use matrix
- opt-out/removal request flow
- attribution UI rule
- agentic traffic rate limit
- sensitive data masking boundary
- moderation feedback loop

이 문서가 있으면 AI 제품을 최신스럽게 말하는 데서 그치지 않고, 실제 운영 가능한 데이터 경계를 보여줄 수 있습니다.`
      }
    ]
  }
];
