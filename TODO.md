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
- [ ] **AI Agent Integration**:
  - [ ] Anthropic SDK 연동 및 `/api/chat` Route Handler 구축
  - [ ] **Context Injection**: 서버 사이드 `src/content/` 데이터 → Claude System Prompt 주입
  - [ ] **Streaming Interaction**: 실시간 스트리밍 응답으로 ChatModal 교체

## 🚀 Phase 5: Sustainability Audit & Deployment

- [ ] **Performance Tuning**: LCP 최적화, 이미지 3개 제한 및 `next/image` 적용
- [ ] **Efficiency Audit**: 전체 번들 사이즈 **300KB 이하** 최종 확인 (Gzipped)
- [ ] **SEO & Metadata**: JSON-LD 구조화 데이터 및 시맨틱 태그 적용
- [ ] **Deployment**: Vercel 배포 및 최종 환경 변수 점검

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
- 미완: Pretext 순차적 타이핑 애니메이션, AI Anthropic SDK 연동

---

> **[현재 작업의 핵심 목표 리마인드]**
> 이번 프로젝트의 핵심은 **"AI를 단순한 도구가 아니라 시스템 설계의 파트너로 활용하여, 가장 정제된 UI 속에 가장 깊은 기술적 통찰을 담아내는 것"**입니다.
