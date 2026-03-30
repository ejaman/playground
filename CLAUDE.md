# CLAUDE.md (공통)

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 아키텍처 개요

### 시스템 구조

```
┌─────────────────────────────────────────────────────────────────────┐
│                        Build Time (CI/CD)                          │
│                                                                     │
│  apps/blog/posts/  ──→  Velite (MDX 처리)  ──→  .velite/ (타입 안전) │
│  (Markdown/MDX)    ──→  next build (static)  ──→  out/             │
│                    ──→  generate-sitemap.ts   ──→  sitemap.xml      │
│                    ──→  generate-rss.mjs      ──→  rss.xml          │
└─────────────────────────────────────────────────────────────────────┘
         │
         ▼
┌──────────────────┐     ┌──────────────────────────────────────────┐
│     Vercel       │     │  Supabase (Cloud)                        │
│  (Static Host)   │◄───►│  - PostgreSQL (조회수, 이력, analytics)  │
│                  │     │  - Auth (Google OAuth)                   │
└──────────────────┘     └──────────────────────────────────────────┘
         │
         ▼
┌──────────────────┐
│  Google Analytics│
│  (GA4)           │
└──────────────────┘
```

### 데이터 흐름

1. 콘텐츠 생성: `apps/blog/posts/`에 마크다운 작성
2. 빌드 처리: Velite가 타입 안전한 데이터로 변환 (`.velite/`)
3. 정적 생성: Next.js가 정적 HTML 생성 (`out/`)
4. 배포: Vercel에 정적 파일 호스팅
5. 실시간 데이터: Supabase에서 조회수, 인증 등 동적 데이터 관리
6. 분석: Google Analytics로 사용자 행동 추적

### 기술 스택

- **Monorepo**: Turborepo
- **Language**: TypeScript (strict)
- **Styling**: Tailwind CSS + shadcn/ui
- **Database**: Supabase (PostgreSQL + Auth)
- **State**: TanStack React Query v5 (server), Zustand v5 (client)
- **Testing**: Vitest + React Testing Library
- **Deployment**: Vercel

### 프로젝트 구조

```
├── apps/
│   ├── blog/web/     # 메인 블로그 앱 (Next.js)
│   └── portfolio/    # 포트폴리오 앱 (Next.js)
├── packages/
│   ├── ui/           # 디자인 시스템 (@repo/ui)
│   ├── eslint-config/
│   ├── tailwind-config/
│   └── typescript-config/
└── scripts/
```

## 절대 규칙

- **FSD 아키텍처 준수**: `shared/` → `entities/` → `features/` → `widgets/` → `app/`
  의존성 방향을 반드시 지킬 것
- **콘텐츠 보안**: `published: false`인 포스트는 어떠한 경우에도 표시하지 말 것
- **환경변수 보호**: 민감한 키(`ANTHROPIC_API_KEY` 등)를 코드에 하드코딩하거나
  로그에 출력하지 말 것
- **타입 안전성**: TypeScript strict 모드 위반 없이 모든 타입 에러를 해결할 것
- **접근성**: 모든 UI 컴포넌트에 적절한 ARIA 속성과 키보드 내비게이션을 구현할 것
- **서버 컴포넌트 우선**: `'use client'`는 반드시 필요한 경우에만 제한적으로 사용할 것
- **불필요한 클라이언트 컴포넌트 금지**: 이벤트 핸들러, useState, useEffect가 없는
  컴포넌트에 `'use client'`를 절대 추가하지 말 것
- **번들 크기 최적화**: 동적 import와 tree shaking을 활용하여 초기 번들 크기를 최소화할 것
- **이미지 최적화 필수**: 모든 이미지에 Next.js Image 컴포넌트를 사용할 것
  (**공유 패키지 제외**: `packages/` 폴더에서는 일반 img 태그 허용)
- **Core Web Vitals 준수**: Lighthouse 성능 점수 90+를 유지할 것

## 빌드/테스트

```bash
pnpm build          # 모든 패키지 빌드
pnpm dev            # 모든 dev 서버 시작
pnpm lint           # 모든 패키지 ESLint
pnpm format         # Prettier 포맷팅
pnpm check-types    # 모든 패키지 타입 체크
pnpm create-post    # AI 지원 포스트 생성 (블로그용)
```

## 코딩 컨벤션

### 네이밍 규칙

- **컴포넌트**: PascalCase (`PostCard.tsx`)
- **훅**: camelCase, `use` 접두사 (`usePost.ts`)
- **타입**: PascalCase, `T` 접미사 (`PostT.ts`)
- **파일**: kebab-case (`post-card.tsx`)
- **폴더**: kebab-case (`blog-posts/`)

### 커밋 메시지

```
feat: 새로운 기능 추가
fix: 버그 수정
docs: 문서 업데이트
style: 코드 스타일 변경
refactor: 코드 리팩토링
test: 테스트 추가/수정
chore: 기타 변경사항
```

### 패턴

- React: 함수 컴포넌트 + hooks 우선
- API: React Query mutation/query 분리
- 에러 처리: try/catch + 사용자 친화적 메시지
- 접근성: 모든 인터랙티브 요소에 ARIA 속성

### CI/CD

- PR 체크: 타입 체크 + 린팅 (pr-check.yml)
- 배포: main 브랜치 push 시 Vercel 자동 배포 (deploy.yml)
- 환경변수: GitHub Secrets에서 Supabase URL/Key, GA ID 등 주입

## TODO.md 워크플로우

**세션 시작 시:** `TODO.md`가 루트에 존재하면 자동으로 읽고 내용을 파악한다.
사용자가 별도 지시 없이 작업을 요청하면 TODO.md의 미완료 항목(`- [ ]`)을 기준으로
우선순위를 판단한다.

**작업 완료 시:** 해당 항목을 `- [ ]` → `- [x]`로 즉시 업데이트한다.

**세션 종료 시:** 사용자가 "세션 종료" 또는 "오늘 마무리"라고 하면 TODO.md의
진행 상황을 최종 업데이트하고 메모 섹션에 오늘 한 작업 요약을 추가한다.
