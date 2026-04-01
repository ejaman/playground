# CLAUDE.md (Portfolio App)

이 파일은 `apps/portfolio` 프로젝트에 특화된 가이드를 제공하며, 최상위 `CLAUDE.md`의 공통 아키텍처 및 규칙을 상속한다.

## 1. 아키텍처 및 폴더 구조 (FSD 준수)

공통 규칙에 따라 **Feature-Sliced Design**을 엄격히 준수한다. 의존성은 상위 레이어에서 하위 레이어로만 흐른다.

```
apps/portfolio/src/
├── app/           # Next.js App Router (Single Page: page.tsx)
├── shared/        # 프리미티브 UI (@repo/ui), Hooks, Lib, Assets
├── entities/      # Project, Experience 등 도메인 데이터 모델 및 타입
├── features/      # AI Chatbot 인터랙션, Pretext 파서 로직
├── widgets/       # Hero, Philosophy, Projects, About 섹션 단위
└── content/       # (독자적) 포트폴리오용 Markdown/JSON 데이터 자산
```

## 2. 디자인 시스템 (DESIGN.md 참조 필수)

모든 시각적 구현은 루트의 **`DESIGN.md` (Monochromatic Manifesto)**를 절대적으로 따른다.

- **Color**: Absolute Binary (`#000000`, `#FFFFFF`). Tonal Gray는 레이어링용으로만 제한적 사용.
- **Typography**: Headlines(**Inter**), Metadata/Technical(**JetBrains Mono**).
- **Radius**: 모든 요소의 Border-radius는 **`0px`**로 고정한다.
- **Interaction**: Hover 시 **Invert(색상 반전)** 효과를 기본으로 적용한다.

## 3. 핵심 기능 구현 지침

### ① Pretext Renderer (features/pretext)

- `pretext` 계층 데이터를 시각화하는 커스텀 렌더러를 구축한다.
- 왼쪽 수직선(Border)과 들여쓰기(Indentation)를 통해 사고의 위계를 시각적으로 증명한다.

### ② AI Chatbot (features/chatbot)

- `Cmd+K` 단축키로 활성화되는 검색창 UI 기반 인터페이스.
- **RAG 전략**: `content/` 폴더 내의 Markdown 데이터를 컨텍스트로 주입하여 답변을 생성한다.
  - 이 과정은 서버에서만 일어나므로 데이터 원본이 클라이언트에 노출되지 않는다.

## 4. 포트폴리오 앱 절대 규칙 (Specific Rules)

최상위 `CLAUDE.md`의 규칙에 더해 아래 사항을 추가로 준수한다.

- **지속 가능성(Sustainability)**: 기술 부채를 방지하기 위해 과도한 라이브러리 사용을 지양하고 순수 CSS/TS 로직을 우선한다.
- **성능 최적화 (300KB/LCP)**:
  - 전체 초기 번들 크기(Gzipped)를 **300KB 이하**로 유지한다.
  - 이미지 사용은 사이트 전체에서 **최대 3개**로 제한하며, 모두 `next/image`를 사용한다.
- **사실 중심 콘텐츠**: 주관적 수식어를 배제하고 엔지니어링 성과와 데이터 위주로 서술한다.

## 5. 작업 및 커밋 워크플로우

### 기능 단위 개발 (Atomic Development)

- 모든 작업은 `TODO.md`의 미완료 항목(`- [ ]`) 중 가장 우선순위가 높은 **기능 단위**로 진행한다.
- **커밋 시점**: 하나의 논리적 기능 구현이 완료되고 `TODO.md`를 업데이트한 직후 수행한다.
- **커밋 메시지**: 최상위 규칙을 따르되, 앱 이름을 명시한다 (예: `feat(portfolio): ...`).

### 세션 및 TODO 관리

- **세션 시작**: 루트의 `TODO.md`를 먼저 읽고 현재 상황을 브리핑한다.
- **세션 종료**: 작업 요약을 `TODO.md`에 기록하고 세션을 마무리한다.

## 6. 개발 커뮤니케이션

- Claude는 작업을 시작하기 전, `DESIGN.md`에서 현재 구현할 컴포넌트의 명세(간격, 폰트 등)를 먼저 확인한다.
- 성능 지표(LCP)에 영향을 줄 수 있는 라이브러리 추가 요청이 있을 경우, 반드시 사용자에게 성능적 대안을 먼저 제시한다.
