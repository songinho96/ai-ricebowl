// AI 기술 트렌드 및 개발자 생존 가이드 블로그 데이터베이스
const aiTrendsData = [
  {
    id: 1,
    title: "DeepSeek-V3 & R1의 등장과 오픈소스 LLM의 대격변",
    category: "LLM",
    date: "2026-06-28",
    readTime: "5 min read",
    views: "1,240",
    tags: ["DeepSeek", "LLM", "OpenSource", "CostEfficiency"],
    summary: "독보적인 가성비와 성능으로 전 세계를 놀라게 한 DeepSeek 모델들의 아키텍처 분석과 오픈소스 진영에 미친 파급 효과를 정리합니다.",
    content: "DeepSeek-V3와 추론 전문 모델인 R1의 등장은 AI 산업의 패러다임을 바꿨습니다. 극도의 비용 효율성을 달성한 Mixture-of-Experts(MoE) 아키텍처와 Multi-head Latent Attention(MLA) 기술을 통해 기존 빅테크 기업들의 독점 구도를 깨뜨렸습니다. 개발자들은 이제 API 비용 부담을 최소화하면서 강력한 로컬 LLM을 인프라에 배포하여 프라이빗 에이전트를 구축할 수 있게 되었습니다.",
    trends: [
      "Mixture-of-Experts(MoE) 아키텍처로 활성화 매개변수를 낮추어 연산 비용 극적으로 절감",
      "Multi-head Latent Attention(MLA)을 통해 Key-Value 캐시 메모리 병목 해결",
      "Reinforcement Learning (RL) 기반 추론 모델 R1의 사고 체인(CoT) 활성화 방식 및 성과",
      "로컬 서버 환경(Llama.cpp, Ollama)에서의 구동 최적화 팁"
    ]
  },
  {
    id: 2,
    title: "LangGraph와 CrewAI를 활용한 멀티 에이전트 워크플로우 실무",
    category: "Agent",
    date: "2026-06-25",
    readTime: "8 min read",
    views: "980",
    tags: ["LangGraph", "CrewAI", "MultiAgent", "Workflow"],
    summary: "단일 챗봇의 한계를 극복하고, 복잡한 업무를 스스로 조율하고 해결하는 멀티 에이전트 시스템 설계 및 협업 패턴을 해부합니다.",
    content: "단일 LLM 호출은 고도화된 논리 검증이나 복잡한 파이프라인 처리에 한계가 있습니다. LangGraph의 상태 기반 그래프 제어와 CrewAI의 역할 중심 협업 아키텍처는 이를 해결하는 핵심 도구입니다. 기획자, 개발자, QA 에이전트가 서로 메시지를 주고받으며 코드를 작성하고 검증하는 워크플로우가 이제 실무 수준에서 작동하기 시작했습니다.",
    trends: [
      "상태 관리(State Management)와 루프(Looping) 구조를 활용한 순환형 에이전트 워크플로우 구축",
      "CrewAI의 Role, Task, Tool 개념을 활용한 직관적인 협업 조직 구성",
      "Human-in-the-loop 패턴을 통한 결정적 에이전트 행동 제어 및 승인 단계 구현",
      "검증 및 모니터링 툴(LangSmith)을 활용한 에이전트 디버깅 및 비용 관리 기법"
    ]
  },
  {
    id: 3,
    title: "Cursor와 GitHub Copilot Workspace가 바꾸는 IDE 생태계",
    category: "Tool",
    date: "2026-06-22",
    readTime: "6 min read",
    views: "1,560",
    tags: ["Cursor", "Copilot", "IDE", "CodingAssistant"],
    summary: "단순한 코드 자동완성을 넘어, 프로젝트 컨텍스트를 통째로 이해하고 멀티 파일 편집을 수행하는 차세대 AI 개발 도구 트렌드입니다.",
    content: "Cursor의 Composer(Ctrl+I) 및 챗 기능은 개발자의 작업 속도를 폭발적으로 증가시키고 있습니다. 전체 프로젝트 디렉토리를 인덱싱하여 다중 파일에 걸친 코드 리팩토링과 신규 기능 구현을 명령 한 번으로 끝냅니다. 이제 주니어 개발자도 시니어 수준의 보일러플레이트 코드를 순식간에 작성할 수 있게 되었습니다.",
    trends: [
      "프로젝트 임베딩 및 `@Folder`, `@Git` 등 고도화된 컨텍스트 매핑 기술",
      "다중 파일 수정을 지원하는 Agentic Edit 기능과 충돌 해결 메커니즘",
      "GitHub Copilot Workspace의 이슈 기반 풀 리퀘스트(PR) 자동 생성 및 테스트 파이프라인 연동",
      "AI 코딩 비서 도입에 따른 커스텀 프롬프트 룰셋(.cursorrules) 모범 사례"
    ]
  },
  {
    id: 4,
    title: "로컬 AI 구동을 위한 최신 하드웨어 및 NPU 가속화 동향",
    category: "OpenSource",
    date: "2026-06-19",
    readTime: "7 min read",
    views: "710",
    tags: ["NPU", "AppleSilicon", "ONNX", "LocalAI"],
    summary: "클라우드 의존성 및 보안 문제를 탈피하기 위해 엣지 및 데스크톱 환경에서 대형 언어 모델을 구동하기 위한 하드웨어 기술입니다.",
    content: "데이터 유출 우려와 네트워크 지연 때문에 기업들은 점차 로컬 온프레미스 LLM 구동으로 선회하고 있습니다. Apple Silicon의 통합 메모리 아키텍처와 최신 그래픽 카드의 Tensor Core 활용, 그리고 AI PC에 탑재된 전용 NPU의 ONNX/TensorRT 가속이 이를 가속화하고 있습니다.",
    trends: [
      "Apple Silicon(M-series) Unified Memory를 활용한 70B+ 대형 모델 구동 방법",
      "Intel Ultra / AMD Ryzen AI NPU 기반 엣지 AI 구동 최적화 현황",
      "4-bit 및 8-bit 양자화(Quantization) 기법을 통한 VRAM 요구량 절감 트렌드",
      "로컬 개발 환경에서의 보안 및 데이터 개인정보 보호 아키텍처 설계 요령"
    ]
  },
  {
    id: 5,
    title: "Claude 3.5 Sonnet과 Gemini 1.5 Pro의 멀티모달 추론 격돌",
    category: "LLM",
    date: "2026-06-15",
    readTime: "6 min read",
    views: "1,120",
    tags: ["Claude", "Gemini", "Multimodal", "Reasoning"],
    summary: "이미지, 비디오, 음성 및 1M+ 토큰의 방대한 코드를 읽어내는 두 플래그십 AI 모델의 성능 비교와 강점을 비교합니다.",
    content: "Claude 3.5 Sonnet은 완벽에 가까운 코딩 지능과 Artifacts 인터페이스로 시장을 지배하는 한편, Gemini 1.5 Pro는 200만 토큰에 달하는 초거대 컨텍스트 윈도우로 전체 코드베이스나 대용량 문서를 즉각 분석하는 강점을 보여줍니다. 상황에 맞는 적절한 멀티모달 모델 선택 기준을 정의합니다.",
    trends: [
      "Claude 3.5 Sonnet의 논리 추론 성능 및 UI 가이드를 통한 프로토타이핑 장점",
      "Gemini 1.5 Pro의 비디오 프레임 추출 분석 및 수백 페이지 분석력 실무 활용",
      "텍스트 외 오디오/비디오 직접 입력 처리를 통한 멀티모달 에이전트의 가능성",
      "동적 실시간 벤치마크 점수 비교와 비용 대 성능비 정리"
    ]
  }
];

const blogPostsData = [
  {
    id: "post-1",
    title: "AI 시대의 개발자 생존 가이드: 코더에서 AI 에이전트 오케스트레이터로의 진화",
    subtitle: "왜 구문 작성(Syntax) 능력은 무력해지고 있는가, 그리고 우리는 어떤 능력으로 무장해야 하는가",
    date: "2026-06-30",
    readTime: "12 min read",
    category: "개발자 생존 전략",
    author: "송인호 (플랫폼 리드)",
    image: "assets/blog_survival.png",
    introduction: "기술 블로그와 업계 커뮤니티는 하루가 멀게 '개발자의 종말'을 속삭입니다. 과연 AI가 우리의 직업을 정말 빼앗아 갈까요? 결론부터 말씀드리면, '코더(Coder)'의 시대는 저물고 있지만, 문제를 정의하고 솔루션을 설계하는 '소프트웨어 엔지니어'의 가치는 그 어느 때보다 빛날 것입니다. 본 글에서는 코드를 수동으로 타이핑하던 과거의 패러다임에서 벗어나, 여러 명의 AI 협업 에이전트를 진두지휘하는 '오케스트레이터'로 거듭나는 구체적인 생존 전략을 소개합니다.",
    sections: [
      {
        title: "1. 단순 코딩(Coding)의 시대는 끝났다: 왜 구문 작성이 더 이상 차별점이 되지 않는가",
        content: `최근 2~3년간 일어난 대규모 언어 모델(LLM)의 코드 생성 능력 향상은 경이로운 수준입니다. 과거 구글링과 스택오버플로우를 뒤지며 밤을 새우던 API 연동, 기본적인 CRUD 보일러플레이트 작성, 까다로운 정규 표현식 매칭 등은 이제 탭(Tab) 키 한 번이나 한 줄의 주석문으로 해결되는 영역이 되었습니다.

이것이 의미하는 바는 명확합니다. **"프로그래밍 언어의 문법(Syntax)을 기억하고 타이핑하는 숙련도"**는 더 이상 시장에서 높은 단가의 가치를 인정받기 어렵다는 점입니다. 

초기 주니어 개발자들이 고전하던 구문 오류 해결과 단순 라이브러리 조합은 AI 코딩 어시스턴트가 가장 잘하는 영역입니다. 이제 단순 코더(Coder)로 머물러 있는 인력은 AI의 놀라운 효율성 앞에 점차 설 자리를 잃어가고 있습니다. 그렇다면 우리는 어디로 나아가야 할까요?`
      },
      {
        title: "2. AI 에이전트 오케스트레이터(Orchestrator)의 정의: 설계자이자 감독으로서의 개발자",
        content: `우리가 지향해야 할 새로운 역할은 바로 **'AI 에이전트 오케스트레이터(Orchestrator)'**입니다. 
오케스트레이터는 지휘자입니다. 각 악기가 내는 소리를 조율하여 하나의 교향곡을 만들듯, 개발자는 서로 다른 특성과 역할을 가진 AI 에이전트들을 기획, 설계, 구현, 검증 프로세스에 적절히 배치하고 제어하는 사령탑이 되어야 합니다.

- **과거의 개발자**: 기획서를 받음 -> 손으로 한 줄 한 줄 코드를 작성 -> 컴파일 에러 수정 -> 수동 테스트 -> 배포.
- **오케스트레이터 개발자**: 기획의 맹점을 찾아내고 논리적 도메인 모델 설계 -> 설계 프롬프트를 작성하여 AI 설계 파트너와 아키텍처 합의 -> 구현 에이전트에게 모듈별 구현 위임 -> 테스트 코드 생성기 및 정적 분석 에이전트를 가동하여 검증 수행 -> 최종 승인 및 지속적 모니터링 피드백 반영.

즉, 실질적인 코드 생성과 반복적인 디버깅 노동은 AI 에이전트에게 전적으로 맡기고, 인간 개발자는 **'아키텍처 설계'**와 **'비즈니스 요구사항 부합 여부 판단'**이라는 상위 개념의 의사결정에 집중하는 구조입니다.`
      },
      {
        title: "3. 우리가 갖추어야 할 핵심 역량 3가지",
        content: `오케스트레이터로 진화하기 위해 주력해서 길러야 할 역량은 다음 세 가지로 압축할 수 있습니다.

#### ① 시스템 설계 및 아키텍처 역량 (추상화 능력)
AI는 훌륭한 일꾼이지만 전체 프로젝트의 아키텍처(클린 아키텍처, MSA, DDD 등)에 대한 일관성 있는 뼈대를 혼자서 설계하기는 어렵습니다. 컨텍스트가 조금만 복잡해져도 환각(Hallucination) 현상이 발생하여 스파게티 코드를 양산하기 십상입니다. 
따라서 인간 개발자는 컴포넌트 간의 결합도를 낮추고 응집도를 높이는 **클린 아키텍처 설계 지식**을 탄탄히 다져야 합니다. 그래야 AI가 생성한 코드가 올바른 위치에 조립되고 유지보수가 가능한지 올바르게 평가하고 수정할 수 있습니다.

#### ② 명확한 문제 정의 및 도메인 분석 능력
AI에게 좋은 결과를 얻으려면 '올바른 질문'을 던져야 합니다. 비즈니스 요구사항이 복잡하게 얽혀 있을 때, 이를 잘게 쪼개어 AI가 소화할 수 있는 단위 태스크로 번역하는 능력이 필요합니다. 
도메인 지식을 바탕으로 비즈니스 문제를 소프트웨어 문제로 모델링하는 능력은 단순히 기술 명세서를 받아 적는 것보다 수십 배 중요한 생존 무기가 됩니다.

#### ③ 프롬프트 디자인 및 AI 컨텍스트 관리 (Context Management)
아무리 뛰어난 AI 모델이라도 프로젝트의 전체 소스코드를 한 번에 완벽하게 이해하고 기억하는 데는 한계가 있습니다. 개발자는 AI에게 어떤 정보를 어떤 시점에 '컨텍스트'로 제공해야 최고의 결과물이 나오는지 조율할 수 있어야 합니다. 
개발 폴더 구조에 맞는 \`.cursorrules\`를 설계하고, 임베딩 검색 가이드를 제공하며, 코드 의존성 맵을 그려서 AI 비서에게 주입해 주는 **'컨텍스트 관리 능력'**이 곧 개발 생산성의 격차를 만듭니다.`
      },
      {
        title: "4. 결론: AI는 적이 아닌, 내 통제 하에 움직이는 가상 개발팀이다",
        content: `AI를 두려워하며 거부할 필요는 전혀 없습니다. AI는 개발자의 밥그릇을 빼앗아 갈 경쟁자가 아니라, 나를 보좌하고 업무 생산성을 극대화해 줄 **'최고의 주니어 개발자 집단'**입니다.

내가 설계 능력을 갖추고 아키텍처의 큰 그림을 그린 뒤, AI 군단을 효율적으로 제어한다면 과거에 5명의 개발자가 3개월 동안 해야 했던 프로젝트를 혼자서 2주일 만에 고품질로 완수할 수 있습니다. 

단순 타이핑 중심의 코딩은 오늘부로 AI에게 완전히 넘겨주고, 더 거시적인 구조를 보고 올바른 설계를 다듬는 엔지니어로 거듭나십시오. 그것이 다가오는 완전한 AI 시대에 살아남는 유일하고 확실한 생존 비결입니다.`
      }
    ]
  },
  {
    id: "post-2",
    title: "실무에 바로 쓰는 AI 활용 백서: 개발 생산성 10배 끌어올리는 워크플로우",
    subtitle: "Cursor IDE, 프롬프트 엔지니어링 패턴, 그리고 독자적인 업무 자동화 에이전트 구축 실무",
    date: "2026-06-30",
    readTime: "10 min read",
    category: "실무 AI 활용 방안",
    author: "송인호 (플랫폼 리드)",
    image: "assets/hero_banner.png",
    introduction: "AI가 코딩을 도와준다는 것은 누구나 알고 있습니다. 하지만 실무에서 실제로 활용해 보면 AI가 엉뚱한 코드를 짜서 수정하는 데 시간이 더 걸리거나, 대답이 빙빙 돌아 답답했던 경험이 많으실 겁니다. 본 가이드는 추상적인 개념을 배제하고, 실제 업무 현장에서 당장 적용해 개발 생산성을 즉각적으로 10배 끌어올릴 수 있는 도구 활용법과 구체적인 프롬프트 엔지니어링 패턴, 그리고 간단한 자동화 에이전트 빌드 방안을 제시합니다.",
    sections: [
      {
        title: "1. Cursor IDE의 진수: 단순 Chat을 넘어선 Composer와 Context 지휘법",
        content: `Cursor IDE는 단순히 우측 패널에서 대화를 나누는 도구가 아닙니다. 가장 강력한 기능은 멀티 파일 수정을 결정적으로 지원하는 **Composer(Cmd+I / Ctrl+I)** 기능입니다. 

#### 💡 Composer를 통한 신규 기능 스캐폴딩 워크플로우:
1. **요구사항 정의**: 신규로 구현할 비즈니스 로직을 마크다운 메모에 상세하게 작성합니다.
2. **Context 참조 주입**: Composer 창을 열고 \`@Files\`를 통해 변경에 영향을 받는 라우터, 컨트롤러, 데이터베이스 스키마 파일을 명시적으로 선언합니다.
3. **지시**: *"내가 작성한 요구사항에 따라 3개 파일의 의존성을 유지하면서 연동 로직을 추가하고 수정해 줘."* 라고 입력합니다.
4. **승인 및 검토**: 각 파일의 Diff 뷰를 보며 부분 수락(Accept) 혹은 거부(Reject)를 결정합니다.

#### 💡 .cursorrules 커스터마이징을 통한 코딩 컨벤션 강제:
루트 디렉토리에 \`.cursorrules\` 파일을 배치하여 프로젝트의 정적 도구(Eslint, Prettier), 프레임워크 아키텍처 규칙(FSD 아키텍처 사용, Vue3 Setup Script 필수 사용 등)을 미리 선언하십시오. 
이 규칙이 잡히면 AI가 짜주는 코드의 스타일이 우리 팀의 기본 컨벤션과 95% 일치하게 되어 리뷰 및 병합 리스크가 획기적으로 줄어듭니다.`
      },
      {
        title: "2. 실무 디버깅과 코드 리뷰를 위한 2가지 핵심 프롬프트 패턴",
        content: `AI에게 오류를 해결해 달라고 할 때 그냥 에러 로그만 띡 던지면 엉뚱한 해결책을 줍니다. 다음과 같은 정형화된 프롬프트 템플릿(Pattern)을 사용해 보십시오.

#### 🛠️ 패턴 1: 'Context-Oriented Debugging' (컨텍스트 기반 디버깅)
> **[프롬프트 예시]**
> *"다음은 현재 발생한 예외 로그입니다: [에러 로그 복사]\n*
> *이 에러가 발생한 지점의 함수는 [파일명]의 [함수명] 입니다. 해당 소스코드는 아래와 같습니다: [코드 복사]\n*
> *또한 이 함수를 호출하는 상위 흐름은 다음과 같습니다: [호출 컨텍스트 설명]\n*
> *해당 에러가 발생하는 근본적인 원인을 3가지 가설로 나누어 제시하고, 각 가설별로 수정되어야 하는 구체적인 코드 대안을 작성해 줘."*

이 템플릿은 에러의 전후 맥락을 인과관계에 맞춰 제공하므로, 환각이 전혀 없는 100% 실용적인 핫픽스 코드를 받아낼 수 있습니다.

#### 🛠️ 패턴 2: 'Edge Case & Security Reviewer' (엣지 케이스 및 취약점 검증)
코드를 리포지토리에 커밋하기 전에 AI에게 보안 및 구조적 단점을 리뷰하게 만드십시오.
> **[프롬프트 예시]**
> *"너는 15년 차 시니어 백엔드 및 보안 아키텍트이다. 내가 작성한 이 코드를 코드 리뷰해 줘: [작성한 코드 복사]\n*
> *아래 관점에 초점을 맞춰 분석해 줘:\n*
> *1. NullPointerException 또는 Undefined 참조가 발생할 수 있는 엣지 케이스가 있는가?\n*
> *2. 대용량 트래픽이 몰릴 때 성능 병목(N+1 쿼리, 과도한 메모리 사용 등)이 발생할 지점이 있는가?\n*
> *3. SQL 인젝션, XSS, 불필요한 예외 노출 등 보안 취약점이 존재하는가?\n*
> *발견된 이슈에 대해 개선 방향과 리팩토링된 코드를 제시해 줘."*`
      },
      {
        title: "3. 자체 업무용 AI 에이전트 빌드로 단순 반복 작업 자동화하기",
        content: `매일 아침 특정 사이트의 지표를 긁어서 모니터링 보고서를 쓰고 이메일로 보내야 하거나, 원천 반출 데이터의 정합성을 검증하여 엑셀을 만드는 따위의 반복 작업이 있다면, 이제는 **직접 경량 AI 에이전트를 빌드**해 둘 때입니다.

예를 들어, Python과 LangChain/LangGraph를 이용하면 다음과 같은 3단계 정합성 검증 에이전트를 반나절 만에 구축할 수 있습니다:
1. **데이터 수집 노드(Node)**: 원본 데이터베이스에서 당일 정산/미터링 데이터를 CSV로 추출.
2. **에이전트 검증 노드**: LLM 또는 규칙 기반 분석을 병행하여 전일 대비 오차가 5% 이상인 구간을 적출하고 가설 수립.
3. **보고서 생성 노드**: 적출된 위반 데이터와 AI 가설을 템플릿에 주입하여 마크다운 보고서로 작성 및 Slack 채널 공유.

실제로 당사 플랫폼 부서 내 정합성 검증 도구를 에이전트 기반으로 연동하여 검증 리포트 작성 시간이 일 평균 **2시간에서 2분으로 단축**되는 성과를 확인했습니다. 이것이 바로 단순 반복을 자동화하여 고부가가치 설계 업무에 시간을 투자하는 진정한 엔지니어의 워크플로우입니다.`
      },
      {
        title: "4. 결론: 나만의 AI 활용 매뉴얼을 구축하라",
        content: `AI를 잘 다루는 것은 재능의 영역이 아닌 **'경험과 습관의 영역'**입니다. 
스스로 효과를 보았던 좋은 프롬프트 템플릿, 효과적이었던 컨텍스트 매핑 방식, 나만의 코딩 규칙 파일 등을 위키나 Notion에 지속적으로 문서화해 두십시오.

나만의 AI 협업 플레이북(Playbook)이 두터워질수록, 비즈니스 요구사항을 실제 동작하는 소프트웨어로 빌드해 내는 생산성은 기하급수적으로 올라갈 것입니다. 오늘 바로 Cursor의 Composer 기능을 켜고 첫 번째 요구사항 기술서 연동 작업을 시작해 보십시오!`
      }
    ]
  }
];

const jobRolesData = {
  "FE": {
    name: "Frontend Engineer (프론트엔드)",
    icon: "fa-code",
    color: "#ec4899",
    trend: "v0, Lovable, Bolt.new 등 자연어로 고품질 컴포넌트와 화면 구조를 초고속 생성하는 UI 생성 모델이 주류로 정착했습니다. 브라우저에서 직접 경량 AI 추론을 실행하는 WebNN과 WASM 가속 기술도 급부상하고 있습니다.",
    tools: ["v0.dev", "Bolt.new", "Lovable.dev", "Claude Artifacts", "WebNN / ONNX Runtime Web"],
    guideline: "단순 마크업이나 반응형 스타일링 타이핑에 에너지를 낭비하지 마십시오. 요구사항을 받자마자 AI 도구로 프로토타이핑을 끝낸 뒤, 컴포넌트 간의 응집도 및 추상화(FSD 아키텍처 등), 상태 공유 흐름, 웹 접근성(a11y) 검증에 더 높은 비중을 두어야 합니다.",
    roadmap: ["AI 기반 고속 UI 디자인 도구 학습", "컴포넌트 단위 추상화 설계 역량 함양", "WASM 기반 브라우저 내 AI 추론 인프라 학습"]
  },
  "BE": {
    name: "Backend Engineer (백엔드)",
    icon: "fa-server",
    color: "#3b82f6",
    trend: "OpenAPI 스펙(Swagger)을 분석하여 API 스캐폴딩과 CRUD를 자동 작성하는 에이전트 도입. Cursor Composer를 활용해 컨트롤러와 데이터 마이그레이션 스크립트를 통합 빌드하는 형태가 일상화되었습니다.",
    tools: ["Cursor Composer", "GitHub Copilot Workspace", "Prisma / TypeORM Schema Generator", "Swagger-to-SDK Generators"],
    guideline: "단순한 비즈니스 엔드포인트 작성은 AI가 훨씬 정확하게 구현합니다. 백엔드 엔지니어는 데이터 정합성 설계, 도메인 주도 설계(DDD), MSA 환경에서의 분산 트랜잭션 및 부하 스케일링 등 고도의 아키텍처 수준 설계에 주력해야 합니다.",
    roadmap: ["도메인 주도 설계(DDD) 및 데이터 모델링 강화", "코드 생성 AI와 CI/CD 빌드 파이프라인의 연계", "AI 자동 쿼리 최적화 및 튜닝 패턴 수립"]
  },
  "DevOps": {
    name: "DevOps & Cloud Engineer (데브옵스)",
    icon: "fa-cloud",
    color: "#10b981",
    trend: "IaC(Terraform, Ansible) 코드 작성 및 Kubernetes 메니페스트 작성의 AI 자동화. 대형 시스템 로그(Log)를 분석하여 잠재 장애 요소를 예방 보고하는 에이전틱 옵저버빌리티의 일반화.",
    tools: ["Kubernetes Copilot", "Terraform Generator", "Prometheus Agentic Alerting", "AI Log Analyzers (OpenSearch AI)"],
    guideline: "IaC 보일러플레이트를 매번 수동 타이핑하는 것은 비효율적입니다. AI를 사용해 테라폼 코드를 즉각 스캐폴딩하되, 클라우드 보안 그룹 설계, 멀티 리전 백업 아키텍처, 깃옵스(GitOps) 파이프라인의 무결성 관리에 더 집중해야 합니다.",
    roadmap: ["IaC 스캐폴딩 프롬프트 라이브러리 구축", "GitOps(ArgoCD) 자동화 구조 설계", "AI 기반 장애 감지 및 자율 조치 시스템 연구"]
  },
  "AI": {
    name: "AI & BigData Engineer (AI 엔지니어)",
    icon: "fa-brain",
    color: "#8b5cf6",
    trend: "LangGraph, CrewAI, AutoGen을 활용한 자율 협업 멀티 에이전트 시스템 실무 적용. 고사양 인프라 부족을 극복하기 위한 Llama/DeepSeek 모델의 양자화 및 vLLM 서빙 가속화 트렌드.",
    tools: ["LangGraph / CrewAI SDK", "vLLM / Ollama Serving", "Hugging Face Transformers", "LangSmith Evaluation Tool"],
    guideline: "단순히 남의 API를 호출하는 챗봇 개발에서 벗어나십시오. 복잡한 시스템 내부의 데이터 상태 흐름(Stateful Graphs)을 설계하고, 모델의 응답 환각을 방지하는 RAG 파이프라인 구축 및 미세조정(Fine-Tuning) 엔지니어링에 역량을 쏟아야 합니다.",
    roadmap: ["멀티 에이전트 상태 제어 패턴 연구", "RAG 아키텍처 정밀 튜닝 및 평가", "로컬 서빙 가속화 인프라 최적화 실무"]
  },
  "Mobile": {
    name: "Mobile App Engineer (모바일)",
    icon: "fa-mobile-screen-button",
    color: "#f43f5e",
    trend: "Kotlin Multiplatform (KMP) 및 Flutter 크로스 플랫폼 코드 생성 자동화. 온디바이스 AI(Apple Intelligence, Android Gemini Nano)를 연동한 오프라인 인앱 스마트 기능 강화.",
    tools: ["Gemini Nano SDK", "KMP Code Scaffolders", "Xcode Copilot", "App Store Release Notes Autogenerator"],
    guideline: "iOS와 Android 환경의 코딩 양상이 AI 도움으로 획기적으로 일치화되고 있습니다. UI 드로잉 코딩 대신 온디바이스 AI를 디바이스 배터리/메모리 부하 없이 구동하는 모바일 디바이스 성능 튜닝에 특화해야 합니다.",
    roadmap: ["온디바이스 Gemini Nano 연동 실무", "Kotlin Multiplatform 아키텍처 및 AI 연계 학습", "모바일 성능 프로파일링 자동화 설계"]
  },
  "DBA": {
    name: "Database Engineer / DBA (데이터베이스)",
    icon: "fa-database",
    color: "#06b6d4",
    trend: "SQL 쿼리 자동 생성 및 인덱스 튜닝 조언 AI 추천 모듈 탑재. 대용량 비정형 데이터를 효율적으로 보관/검색하기 위한 벡터 데이터베이스(Vector DB) 연동 고도화.",
    tools: ["pgvector / Milvus / Qdrant", "SQL AI Copilots", "Database Index Advisor Tools", "Automated Migration Scripting"],
    guideline: "단순 SQL 질의문 타이핑이나 덤프 스케줄링은 AI 도구가 훨씬 빠르고 안전하게 수행합니다. DBA는 엔터프라이즈 통합 데이터 모델 모델링, 벡터 DB를 결합한 하이브리드 검색 아키텍처, 그리고 실시간 동기화(CDC) 파이프라인 관리에 집중해야 합니다.",
    roadmap: ["벡터 데이터베이스 구축 및 의미론적 검색 설계", "AI 기반 자동 파티셔닝 및 샤딩 아키텍처 구축", "실시간 CDC 파이프라인 최적화"]
  },
  "QA": {
    name: "QA & Testing Engineer (QA / 테스터)",
    icon: "fa-vial",
    color: "#eab308",
    trend: "Playwright / Cypress 테스트 코드의 완전 자동 작성 및 AI 기반의 동적 시나리오 테스팅. UI 변경 사항을 시각적으로 감지하여 회귀 테스트를 수행하는 비주얼 테스트 에이전트 확산.",
    tools: ["Playwright AI CodeGen", "Visual Regression Tools (Applitools)", "AI Bug Report Generators", "Mock Data Generators"],
    guideline: "테스트 케이스를 수동으로 입력하고 검증하는 단순 대면 업무는 축소되고 있습니다. QA는 기획 문서를 분석하여 자동으로 테스트 커버리지를 구성하는 AI 프롬프트를 설계하고, 전체 빌드 파이프라인에 테스트 자동화 봇을 연동하는 아키텍트가 되어야 합니다.",
    roadmap: ["테스트 시나리오 자동 생성 프롬프트 구축", "CI/CD 연동 자동 회귀 테스트 파이프라인 개발", "Playwright 기반 AI 테스팅 도구 마스터"]
  },
  "Security": {
    name: "Security Engineer (보안)",
    icon: "fa-shield-halved",
    color: "#64748b",
    trend: "소프트웨어 공급망 보안 취약점의 실시간 AI 정적 스캐닝. AI 에이전트 자체의 프롬프트 인젝션 방어(WAF for LLM) 및 사내 데이터 외부 유출을 방지하는 실시간 데이터 가드독 솔루션의 등장.",
    tools: ["Snyk AI Scan", "LLM Guard / Llama Guard", "Automated Dependency Checkers", "AI Threat Modeling Assistants"],
    guideline: "정적 보안 점검 툴의 수많은 알람을 일일이 필터링하는 대신, AI를 보안 진단 오케스트레이터로 활용해야 합니다. AI 모델 및 에이전트 시스템 자체의 보안 취약성(Prompt Injection, Data Poisoning)을 방어하는 특화 보안 장치 설계가 시급합니다.",
    roadmap: ["AI 가드독(Llama Guard) 사내 서비스 연동", "프롬프트 인젝션 및 데이터 거버넌스 프레임워크 학습", "보안 취약점 자동 패치(Autopatch) 파이프라인 설계"]
  }
};

// 브라우저 환경에서 전역 변수로 노출하거나 모듈로 내보냄
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { aiTrendsData, blogPostsData, jobRolesData };
} else {
  window.aiTrendsData = aiTrendsData;
  window.blogPostsData = blogPostsData;
  window.jobRolesData = jobRolesData;
}
