**[진행 완료 (Done)]**

* **Turborepo 인프라**: 모노레포 구조 세팅 및 `apps/blog/web` 패키지 구성
* **배포 파이프라인**: Vercel을 통한 자동 배포 환경 구축 및 경로 이슈 해결
* **포스팅 아키텍처**: Contentlayer 연동 및 마크다운 기반의 동적 렌더링 뼈대 구축
* **AI 타이틀링**: AI를 활용한 포스팅 제목 생성 및 슬러그(Slug) 패턴 설계

**[남은 과제 (Roadmap)]**
#### 1. GitHub Actions: CI/CD 및 성능 자동화

* **AI Agentic Workflow (Self-Healing)**: 단순히 빌드만 하는 게 아니라, 빌드 에러가 나면 AI 에이전트가 에러 로그를 분석해서 수정 제안을 PR 코멘트로 달아주는 워크플로우를 추가
* **Lighthouse CI & PPR 실험**: **Partial Prerendering(PPR)** 적용 전후의 Lighthouse 점수를 GitHub Actions로 자동 비교하여 기록

#### 2. AI Agent 이식: n8n + LangGraph 기반 자동화

* **Structured Data Extraction**: n8n에서 수집한 마크다운 데이터를 LangChain의 Pydantic 기능을 활용해 완벽한 JSON으로 추출, 블로그 메타데이터(태그, 시리즈 등)에 바로 꽂아주기
* **AI 컨트리뷰터 & Self-Correction**: LangGraph를 통해 AI가 직접 쓴 코드 스니펫의 오류를 스스로 검수하고 발행하는 '에이전트 워크플로우'를 이식

#### 3. UI/UX & Deep Dive: 아키텍처 및 최신 패턴

* **FSD (Feature-Sliced Design)**: 디렉토리 구조를 `features`, `entities`, `shared` 레이어로 구성
* **Compound Component Pattern**: 블로그의 공통 UI(Modal, Select 등)를 이 패턴으로 설계
* **Next.js 15+ 최신 기능**: **Server Actions**와 `useActionState` 훅을 도입해 API 호출 없이 서버 로직을 안전하게 처리 -> 🔺
* **Zero-Runtime CSS**: Panda CSS 같은 기술을 도입해 런타임 오버헤드 없는 타입 안정 스타일링을 구현
* **Local-first 경험**: IndexedDB를 활용해 네트워크가 불안정해도 글 작성이 끊기지 않는 오프라인 경험을 추가 -> 🔺
