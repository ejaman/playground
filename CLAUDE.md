# CLAUDE.md (공통)

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

If the user's prompt starts with "EP:", then the user wants to enhance the prompt. Read the PROMPT_ENHANCER.md file and follow the guidelines to enhance the user's prompt. Show the user the enhancement and get their permission to run it before taking action on the enhanced prompt.

The enhanced prompts will follow the language of the original prompt (e.g., Korean prompt input will output Korean prompt enhancements, English prompt input will output English prompt enhancements, etc.)

## 절대 규칙

**위반하면 안 되는 금지 사항:**

- **FSD 아키텍처 준수**: `shared/` → `entities/` → `features/` → `widgets/` → `app/`의 의존성 방향을 반드시 지킬 것
- **콘텐츠 보안**: `published: false`인 포스트는 어떠한 경우에도 표시하지 말 것
- **환경변수 보호**: 민감한 키(`ANTHROPIC_API_KEY` 등)를 코드에 하드코딩하거나 로그에 출력하지 말 것
- **타입 안전성**: TypeScript strict 모드 위반 없이 모든 타입 에러를 해결할 것
- **접근성**: 모든 UI 컴포넌트에 적절한 ARIA 속성과 키보드 내비게이션을 구현할 것
- **서버 컴포넌트 우선**: Next.js App Router의 장점을 최대한 활용하기 위해 서버 컴포넌트를 기본으로 사용하고, 클라이언트 컴포넌트(`'use client'`)는 반드시 필요한 경우에만 제한적으로 사용할 것
- **불필요한 클라이언트 컴포넌트 금지**: 사용자 상호작용(이벤트 핸들러, useState, useEffect)이 없는 컴포넌트에 `'use client'` 지시어를 절대 추가하지 말 것
- **번들 크기 최적화**: 동적 import와 tree shaking을 활용하여 초기 번들 크기를 최소화하고, 필요한 코드만 lazy loading할 것
- **이미지 최적화 필수**: 모든 이미지에 Next.js Image 컴포넌트나 최적화된 로딩 방식을 사용하고, 적절한 width/height/sizes 속성을 지정할 것 (**공유 패키지 제외**: packages/ 폴더에서는 범용성을 위해 일반 img 태그 허용)
- **Core Web Vitals 준수**: Lighthouse 성능 점수 90+를 유지하기 위해 불필요한 리렌더링을 방지하고, Critical Rendering Path를 최적화할 것

## 아키텍처 개요

### 시스템 아키텍처

```
┌─────────────────────────────────────────────────────────────────────┐
│                        Build Time (CI/CD)                          │
│                                                                     │
│  apps/blog/posts/  ──→  Velite (MDX 처리)  ──→  .velite/ (타입 안전) │
│  (Markdown/MDX)    ──→  next build (static)  ──→  out/             │
│                    ──→  generate-sitemap.ts   ──→  sitemap.xml      │
│                    ──→  generate-rss.mjs      ──→  rss.xml          │
│                    ──→  pnpm create-post      ──→  새 포스트 템플릿 │
└─────────────────────────────────────────────────────────────────────┘
         │
         ▼
┌──────────────────┐     ┌──────────────────────────────────────────┐
│     Vercel       │     │  Supabase (Cloud)                        │
│  (Static Host)   │     │  ┌─────────────────────────────────────┐ │
│                  │     │  │ PostgreSQL                          │ │
│  - HTML/CSS/JS   │     │  │  - post_views (조회수)              │ │
│  - Images        │◄───►│  │  - view_history (조회 이력)         │ │
│  - sitemap.xml   │     │  │  - analytics (통계 데이터)         │ │
│  - rss.xml       │     │  │  - RPC functions (커스텀 함수)     │ │
│  - robots.txt    │     │  ├─────────────────────────────────────┤ │
│                  │     │  │ Auth (Google OAuth)                 │ │
│                  │     │  │  - 사용자 인증                      │ │
│                  │     │  │  - Admin 권한                       │ │
└──────────────────┘     └──────────────────────────────────────────┘
         │
         ▼
┌──────────────────┐
│  Google Analytics│
│  (GA4)           │
│                  │
│  - 페이지뷰 추적 │
│  - 사용자 행동   │
│  - 성능 메트릭   │
└──────────────────┘
```

### 데이터 흐름

1. **콘텐츠 생성**: `apps/blog/posts/`에 마크다운 작성
2. **빌드 처리**: Velite가 타입 안전한 데이터로 변환 (`.velite/`)
3. **정적 생성**: Next.js가 정적 HTML 생성 (`out/`)
4. **배포**: Vercel에 정적 파일 호스팅
5. **실시간 데이터**: Supabase에서 조회수, 인증 등 동적 데이터 관리
6. **분석**: Google Analytics로 사용자 행동 추적

### 기술 스택 (공통)

- **Monorepo**: Turborepo
- **Language**: TypeScript (strict)
- **Styling**: Tailwind CSS + shadcn/ui
- **Database**: Supabase (PostgreSQL + Auth)
- **State**: TanStack React Query v5 (server), Zustand v5 (client)
- **Testing**: Vitest + React Testing Library
- **Linting**: ESLint (custom config)
- **Deployment**: Vercel

### 프로젝트 구조

```
├── apps/
│   ├── blog/web/     # 메인 블로그 앱 (Next.js)
│   └── portfolio/    # 포트폴리오 앱 (Next.js)
├── packages/         # 공유 패키지
│   ├── ui/           # 디자인 시스템 (@repo/ui)
│   ├── eslint-config/
│   ├── tailwind-config/
│   └── typescript-config/
└── scripts/          # 유틸리티 스크립트
```

## 빌드/테스트 (공통)

### Root 명령어

```bash
pnpm build          # 모든 패키지 빌드
pnpm dev            # 모든 dev 서버 시작
pnpm lint           # 모든 패키지 ESLint
pnpm format         # Prettier 포맷팅
pnpm check-types    # 모든 패키지 타입 체크
pnpm create-post    # AI 지원 포스트 생성 (블로그용)
```

### Supabase 설정

**환경변수 (공통):**

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**사용 패턴:**

- 인증: Supabase Auth 사용
- 데이터베이스: PostgreSQL with Row Level Security
- 실시간: 필요시 Supabase Realtime 활용

## 디자인 패턴

### 워크스페이스 의존성

내부 패키지 의존성에는 `workspace:` 프로토콜을 사용:

```json
{
  "dependencies": {
    "@repo/ui": "workspace:^"
  }
}
```

### 카탈로그 의존성 (pnpm catalog)

pnpm 카탈로그 기능을 사용하여 앱 간 일관된 버전 관리:

```json
{
  "dependencies": {
    "react": "catalog:react19",
    "typescript": "catalog:typescript5"
  }
}
```

### 컴포넌트 구조

컴포넌트는 다음 패턴을 따름:

```
components/ComponentName/
├── ComponentName.tsx
├── ComponentName.test.tsx
└── index.ts
```

### 테스팅 접근법

- **Blog 앱**: Vitest + React Testing Library + MSW (API 모킹)
- **Portfolio 앱**: Vitest + React Testing Library
- **공통**: `data-testid` 속성으로 테스트 요소 선택

### 블로그 아키텍처 상세

#### SSG (Static Site Generation) 전략

- **Next.js `output: 'export'`**: 프로덕션 빌드 시 완전한 정적 HTML 생성
- **`trailingSlash: true`**: 호스팅 호환을 위한 후행 슬래시 설정
- **`images.unoptimized: true`**: 정적 호스팅에서 Next.js Image 최적화 비활성화

#### Supabase 백엔드 역할

| 기능              | 설명                                                  |
| ----------------- | ----------------------------------------------------- |
| **조회수 추적**   | `increment_view_count` RPC → `post_views` 테이블 저장 |
| **조회 이력**     | `view_history` 테이블에 시간별/일별 기록              |
| **Admin 인증**    | Google OAuth를 통한 관리자 로그인                     |
| **Analytics RPC** | 대시보드용 집계 함수                                  |

#### 콘텐츠 파이프라인

1. **콘텐츠 작성**: `apps/blog/posts/`에 Markdown 작성
   - Frontmatter: `title`, `date`, `tags`, `series`, `description`, `published`
2. **콘텐츠 공개 제어**: `published: true`인 포스트만 표시
3. **빌드 전 처리**: Velite로 타입 안전한 데이터 변환
4. **정적 빌드**: Next.js → `out/` 디렉토리에 정적 파일 생성
5. **배포**: Vercel 자동 배포

#### SEO & 디스커버리

- **Sitemap**: 빌드 시 자동 생성 (`/sitemap.xml`)
- **RSS**: 빌드 시 자동 생성 (`/rss.xml`)
- **OpenGraph**: 메타데이터에 설정
- **Google Analytics**: GA4 연동

## 코딩 컨벤션 (공통)

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

### 패턴 규칙

- **React**: 함수 컴포넌트 + hooks 우선
- **API**: React Query mutation/query 분리
- **에러 처리**: try/catch + 사용자 친화적 메시지
- **접근성**: 모든 인터랙티브 요소에 ARIA 속성
- **성능**: 불필요한 리렌더링 방지

### CI/CD

- **PR 체크**: 타입 체크 + 린팅 (pr-check.yml)
- **배포**: main 브랜치 push 시 Vercel 자동 배포 (deploy.yml)
- **빌드 캐싱**: Turborepo 캐시 활용으로 빌드 시간 최적화
- **환경변수**: GitHub Secrets에서 Supabase URL/Key, GA ID 등 주입

### 주요 설정 파일

| 파일                 | 역할                                          |
| -------------------- | --------------------------------------------- |
| `next.config.ts`     | Next.js 설정 (SSG output, MDX, trailingSlash) |
| `velite.config.ts`   | Velite 콘텐츠 처리 설정                       |
| `tailwind.config.js` | Tailwind CSS 설정                             |
| `package.json`       | 프로젝트 의존성 및 스크립트                   |
| `.env.local`         | 로컬 개발 환경변수                            |
| `.env.production`    | 프로덕션 환경변수                             |
