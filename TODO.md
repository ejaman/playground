# 📄 TODO.md (Action-Oriented Structure)

## 🎯 High Priority (핵심 마일스톤)

- [x] **Phase 1: System Foundation** - 프로젝트 셋팅 및 디자인 토큰 이식
- [ ] **Phase 2: Visual Shell (UI First)** - 데이터 없는 빈 UI 레이아웃 및 컴포넌트 완성
- [ ] **Phase 3: Content Population** - 프로젝트/이력서 데이터 생성 및 UI 주입
- [ ] **Phase 4: Intelligence & Logic** - AI 챗봇 및 Pretext 렌더러 기능 구현
- [ ] **Phase 5: Audit & Launch** - 성능 최적화 및 배포

---

## 🛠 Phase 1: Infrastructure & Design System

- [x] **Design Token Sync**: `DESIGN.md` 기반 Tailwind Config 설정 (Binary Colors, 0px Radius)
- [x] **Base Style**: 글로벌 폰트(Inter, JetBrains Mono) 및 CSS 기본 룰 적용
- [x] **Atomic UI Primitives**: Button(Invert), Line, Input(Underline style), Container 개발

## 🎨 Phase 2: Visual Shell (Developer Check Milestone)

- [x] **Home Layout**: 거대 타이포그래피 헤드라인 및 검색창 UI 껍데기 배치
- [x] **Philosophy Shell**: Pretext 스타일의 위계형 텍스트 컨테이너 시각화
- [x] **Projects List**: 에디토리얼 리스트 레이아웃 및 이미지 호버 영역 디자인
- [x] **About Grid**: 경력/스택 정보를 위한 타이포그래피 중심 그리드 설계
- [ ] **[Check]**: 전체 시안의 에디토리얼 감도 및 8pt 그리드 정합성 확인

## ✍️ Phase 3: Content & Narrative

- [ ] **Data Mapping**: `content/` 폴더 내 `resume.md`, `projects.md` 마크다운 데이터를 각 섹션 UI에 연결 및 렌더링
- [ ] **Philosophy Content**: Pretext 구조에 맞춘 엔지니어링 가치관 텍스트 주입

## 🧠 Phase 4: Intelligence & Functional Logic

- [ ] **Pretext Dynamic Renderer**: 계층 구조 파싱 로직 및 순차적 타이핑 애니메이션 구현
- [ ] **AI Agent Integration**:
  - [ ] Anthropic SDK 연동 및 `/api/chat` Route Handler 구축
  - [ ] **Context Injection**: 서버 사이드 마크다운 데이터 → Claude System Prompt 주입 로직
  - [ ] **Streaming Interaction**: Vercel AI SDK 기반 검색창 실시간 대화 기능 완성

## 🚀 Phase 5: Sustainability Audit & Deployment

- [ ] **Performance Tuning**: LCP 최적화, 이미지 3개 제한 및 `next/image` 적용
- [ ] **Efficiency Audit**: 전체 번들 사이즈 **300KB 이하** 최종 확인 (Gzipped)
- [ ] **SEO & Metadata**: JSON-LD 구조화 데이터 및 시맨틱 태그 적용
- [ ] **Deployment**: Vercel 배포 및 최종 환경 변수 점검

---

## 📝 Notes & Summary

### 2026-04-01

**Phase 1 완료 (환경 설정 & 디자인 토큰)**

- `src/` FSD 폴더 구조 생성 (`app/`, `shared/`, `entities/`, `features/`, `widgets/`, `content/`)
- 기존 `app/` 루트 폴더 → `src/app/`으로 이전
- `postcss.config.js` 생성 (`@repo/tailwind-config/postcss` 연결)
- `src/app/globals.css` - Tailwind v4 `@theme` 토큰 주입:
  - Colors: `pure-white`, `pure-black`, `neutral-100`, `neutral-800` + Semantic 토큰
  - Spacing: `xs(12)` ~ `xl(160)` 5단계
  - Border-radius: 전체 `0px` 고정
  - Typography utilities: `text-huge` ~ `text-mono-base` 7종
- `src/app/layout.tsx` - Inter + JetBrains Mono (next/font/google) 적용

---

> **[현재 작업의 핵심 목표 리마인드]**
> 이번 프로젝트의 핵심은 **"AI를 단순한 도구가 아니라 시스템 설계의 파트너로 활용하여, 가장 정제된 UI 속에 가장 깊은 기술적 통찰을 담아내는 것"**입니다. 이 TODO 리스트는 귀하의 작업 순서와 브랜딩 전략을 동시에 충족하도록 설계되었습니다.
