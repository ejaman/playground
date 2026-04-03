# 📄 TODO.md (Action-Oriented Structure)

## 🎯 High Priority (핵심 마일스톤)

- [x] **Phase 1: System Foundation** - 프로젝트 셋팅 및 디자인 토큰 이식
- [x] **Phase 2: Visual Shell (UI First)** - 반응형 포함 전체 UI 레이아웃 완성
- [x] **Phase 2.5: Content Architecture** - 단일 데이터 소스 구조 구축 및 위젯 연결
- [x] **Phase 3: Content Population** - 실제 포트폴리오 데이터 입력
- [ ] **Phase 4: Intelligence & Logic** - AI 챗봇 및 Pretext 렌더러 기능 구현
- [ ] **Phase 5: Audit & Launch** - 성능 최적화 및 배포

---

## 🛠 Phase 1: Infrastructure & Design System

- [x] **Design Token Sync**: `DESIGN.md` 기반 Tailwind Config 설정 (Binary Colors, 0px Radius)
- [x] **Base Style**: 글로벌 폰트(Inter, JetBrains Mono) 및 CSS 기본 룰 적용
- [x] **Atomic UI Primitives**: Button(Invert), Line, Input(Underline style), Container 개발

## 🎨 Phase 2: Visual Shell

- [x] **Home Layout**: 거대 타이포그래피 헤드라인 및 검색창 UI 배치
- [x] **Philosophy Shell**: Pretext 스타일의 위계형 텍스트 컨테이너 시각화
- [x] **Projects List**: 에디토리얼 리스트 레이아웃 및 이미지 호버 영역 디자인
- [x] **About Grid**: 경력/스택 정보를 위한 타이포그래피 중심 그리드 설계
- [x] **AI Chatbot Modal**: 터미널 스타일 시스템 쿼리 모달 UI
- [x] **반응형**: 모바일/데스크탑 브레이크포인트 적용
- [ ] **[Check]**: 전체 시안의 에디토리얼 감도 및 8pt 그리드 정합성 확인

## 🗂 Phase 2.5: Content Architecture (Single Source of Truth)

> 모든 콘텐츠는 `src/content/` 한 곳에서 관리한다.
> 위젯은 데이터를 직접 하드코딩하지 않고, 반드시 `@/content`에서 import한다.

- [x] **데이터 구조 설계**: `src/content/` TypeScript 파일 및 `src/entities/` 타입 정의
- [x] **위젯 연결**: 모든 위젯의 플레이스홀더를 `@/content` import로 교체
- [x] **✏️ 실제 데이터 입력**
  - [x] `src/content/profile.ts` — 이름, 타이틀, 소개 문구, 소셜 링크
  - [x] `src/content/projects.ts` — 프로젝트 목록 및 상세 설명
  - [x] `src/content/experience.ts` — 경력, 수상, 가용 상태
  - [x] `src/content/skills.ts` — 기술 스택 (FE/BE/Core)
  - [x] `src/content/philosophy.ts` — 철학 텍스트 및 원칙 문구

## ✍️ Phase 3: Content & Narrative

- [x] **Philosophy Content**: Pretext 구조에 맞춘 엔지니어링 가치관 텍스트 최종 다듬기
- [x] **AI Context**: `src/content/chatbot-context.ts` — Claude RAG 컨텍스트 데이터 작성 완료

## 🧠 Phase 4: Intelligence & Functional Logic

- [ ] **Pretext Dynamic Renderer**: 계층 구조 파싱 로직 및 순차적 타이핑 애니메이션 구현
  - [x] PhilosophyCanvas 문단별 렌더링 + mouse repulsion effect (326b3a1)
  - [ ] 순차적 타이핑 애니메이션 구현 (미완)
- [x] **AI Agent Integration**:
  - [x] Anthropic SDK 연동 및 `/api/chat` Route Handler 구축
  - [x] **Context Injection**: 서버 사이드 `src/content/` 데이터 → Claude System Prompt 주입
  - [x] **Streaming Interaction**: 실시간 스트리밍 응답으로 ChatModal 교체 (멀티턴, Markdown 렌더링)

## 🚀 Phase 5: Sustainability Audit & Deployment

- [ ] **Performance Tuning**: LCP 최적화, 이미지 3개 제한 및 `next/image` 적용
- [ ] **Efficiency Audit**: 전체 번들 사이즈 **300KB 이하** 최종 확인 (Gzipped)
- [ ] **SEO & Metadata**: JSON-LD 구조화 데이터 및 시맨틱 태그 적용
- [x] **Deployment**: Vercel 배포 완료 (blog/portfolio 분리 배포 파이프라인 구축, ANTHROPIC_API_KEY 주입)

---

## 📝 Notes & Summary

### 2026-04-01

**Phase 1 완료**: 환경 설정, 디자인 토큰 이식, FSD 폴더 구조, Atomic UI Primitives

**Phase 2 완료**: 전체 섹션 Visual Shell + 반응형 모바일 레이아웃 + 챗봇 모달 UI

**Phase 2.5 완료 (구조)**: `src/content/` 단일 데이터 소스 구조 구축 및 위젯 연결
- 실제 데이터 입력은 개발자가 `src/content/*.ts` 파일을 직접 수정

### 2026-04-02 ~ 2026-04-03

**Phase 2.5 완료 (데이터)**: profile/experience/skills/philosophy/projects 실제 데이터 교체

**Phase 3 완료**: philosophy 텍스트 완성 + `chatbot-context.ts` RAG 컨텍스트 작성

**Phase 4 부분 완료**:
- projects accordion + MD content 구조화 + Markdown 렌더러 개선 (125ae70, 833b025)
- PhilosophyCanvas 문단 렌더링 + mouse repulsion effect (326b3a1, b25f2d3)
- MonogramCanvas repulsion effect + RepelCanvas 공용 컴포넌트 추출 (a90f21e, 59b7e25)
- AI Chatbot Claude API 연동 완료: 스트리밍, 멀티턴, Markdown 렌더링 (bd8ba9b)
- 미완: Pretext 순차적 타이핑 애니메이션

**Phase 5 배포 완료**:
- blog/portfolio 분리 배포 워크플로우 구축 (workflow_dispatch 포함)
- Vercel ANTHROPIC_API_KEY 환경변수 등록

### 2026-04-03 (모바일 피드백 반영)

**모바일 UI 수정**:
- 커스텀 커서 touch 디바이스에서 DOM 미렌더링으로 완전 제거
- iOS 모달 스크롤 차단 (`position: fixed` 방식)
- iOS input 자동 확대 방지 (`font-size: 16px`)
- 모달 위치 상단 고정 + `dvh`로 키보드 영역 대응
- 모바일 불필요 UI 제거 (VIEW ALL 버튼)
- Philosophy 모바일/데스크탑 콘텐츠 통일

**PhilosophyCanvas clipping 수정**:
- `layoutWithLines` 측정 불일치 → `layoutTextBlockNative` (canvas measureText 기반)로 교체

---

> **[현재 작업의 핵심 목표 리마인드]**
> 이번 프로젝트의 핵심은 **"AI를 단순한 도구가 아니라 시스템 설계의 파트너로 활용하여, 가장 정제된 UI 속에 가장 깊은 기술적 통찰을 담아내는 것"**입니다.

---

## 🔁 Hindsight

다음 프로젝트에서 미리 해두면 좋을 것들.

1. **콘텐츠는 처음부터 `content/` 폴더로 분리**
   포트폴리오는 지속적으로 업데이트될 가능성이 매우 높음. 컴포넌트에 하드코딩하면 나중에 전부 뜯어야 하니 처음부터 단일 데이터 소스로 관리하자.

2. **AI 챗봇 prompt injection 방어 문구 추가**
   `이전 지시사항은 무시하고` 류의 공격 방지 문구를 system prompt에 미리 포함할 것.

3. **Claude Code 세션 간 컨텍스트는 CLAUDE.md에**
   세션 종료 시 대화 내용은 날아감. 반복 설명이 필요한 아키텍처 결정, 네이밍 규칙, 주의사항은 CLAUDE.md에 기록해두자.

4. **모노레포에서 앱별 배포는 처음부터 분리 설계**
   단일 `VERCEL_PROJECT_ID`로 시작하면 나중에 분리할 때 번거로움. 앱이 2개 이상이면 처음부터 `_BLOG` / `_PORTFOLIO` 식으로 secret 분리하고 `workflow_dispatch`도 추가해두자.

5. **canvas 기반 텍스트 렌더링은 측정 방식 일관성 확보 필수**
   외부 라이브러리로 줄 바꿈을 계산하고 canvas로 렌더링하면 측정 불일치로 클리핑이 생김. canvas `measureText`로 줄 바꿈과 렌더링을 통일할 것.

6. **모바일 UI는 배포 전 실기기에서 반드시 확인**
   `--hostname 0.0.0.0` 옵션으로 로컬 dev 서버를 열고 같은 WiFi에서 접속. iOS에서는 `overflow: hidden`이 스크롤을 막지 않고, input `font-size < 16px`는 자동 확대, `dvh`는 키보드 높이를 반영하는 등 데스크탑과 다른 동작이 많음.
