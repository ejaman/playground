**[진행 완료 (Done)]**

* **Turborepo 인프라**: 모노레포 구조 세팅 및 `apps/blog/web` 패키지 구성
* **배포 파이프라인**: Vercel을 통한 자동 배포 환경 구축 및 경로 이슈 해결
* **포스팅 아키텍처**: Contentlayer 연동 및 마크다운 기반의 동적 렌더링 뼈대 구축
* **AI 타이틀링**: AI를 활용한 포스팅 제목 생성 및 슬러그(Slug) 패턴 설계

**[남은 과제 (Roadmap)]**
1. AI Self-Healing CI 
빌드 에러 자동 분석: GitHub Actions에서 빌드 실패 시 에러 로그를 AI에 전달, 수정 제안을 PR 코멘트로 자동 게시
워크플로우 설계 문서화: 단순 구현에 그치지 않고 프롬프트 설계 근거와 한계점을 블로그 포스팅으로 기록

2. PPR + Lighthouse 성능 자동화
Partial Prerendering 적용: Next.js 15+ PPR 실험적 적용
Lighthouse CI 자동 비교: 적용 전후 LCP, TBT 등 Core Web Vitals 수치를 GitHub Actions로 자동 기록 및 시각화
성과 포스팅: "PPR 적용 후 LCP X초 개선" 형태로 수치 기반 회고 작성

3. FSD 아키텍처 + UI 패턴 (설명할 수 있는 구조)
레이어 설계: features, entities, shared 경계를 왜 이렇게 그었는지 근거와 함께 구현
Compound Component Pattern: Modal, Select 등 공통 UI를 이 패턴으로 설계, 트레이드오프 정리
Zero-Runtime CSS: Panda CSS 도입, 기존 방식 대비 번들 사이즈 비교
FSD 실전 적용 포스팅: 국내 사례가 드문 만큼 블로그 콘텐츠 자체가 포트폴리오

4. 나중에(매우 후순위)

n8n + LangGraph 자동화: 마크다운 메타데이터 추출 및 AI 컨트리뷰터 워크플로우
Local-first 경험: IndexedDB 기반 오프라인 글 작성 — 블로그 도메인에서 왜 필요한지 먼저 정의하고 시작
