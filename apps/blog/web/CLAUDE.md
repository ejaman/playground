# CLAUDE.md (블로그 앱)

This file provides guidance to Claude Code (claude.ai/code) when working with the blog app.

## 기술 스택

- **Framework**: Next.js 16 (App Router), React 19
- **Build Tool**: Turbopack (dev), Webpack (prod)
- **Content**: Velite (MDX processing)
- **Analytics**: Google Analytics 4

## 폴더 구조 (FSD)

```
apps/blog/web/src/
├── app/        # Next.js App Router: pages, layouts, metadata, API routes
│   ├── blog/      # 블로그 관련 페이지들
│   ├── experiment/ # 실험 기능 페이지들
│   └── hub/       # 허브 페이지
├── shared/     # 횡단 관심사: ui/, hooks/, lib/, api/, store/, assets/
├── entities/   # 도메인 모델: post/, series/, experiment/
├── features/   # 사용자 상호작용: auth/, blog/, search/
└── widgets/    # 페이지 섹션: header/, footer/, sidebar/
```

경로 별칭: `@/*` → `src/*`, `#site/content` → `.velite/`

## 도메인 컨텍스트

- **Post**: 마크다운 기반 블로그 포스트
  - frontmatter: `title`, `date`, `tags`, `series`, `description`,
    `ogTitle`, `keywords`, `published`
  - `published: true`인 포스트만 공개 표시
  - 위치: `apps/blog/posts/`
- **Series**: 관련 포스트들의 그룹
  - 정의 위치: `apps/blog/series.json`
  - Post의 frontmatter `series` 필드로 연결
- **Experiment**: 프로토타이핑/실험 기능
  - Post와 완전히 별개 섹션, 별도 라우트(`/experiment`)

### 콘텐츠 파이프라인

```
apps/blog/posts/ (Markdown 작성)
  └─ Velite (빌드 시 처리)
       └─ .velite/ (타입 안전한 데이터로 변환)
            └─ Next.js (정적 HTML 생성 → out/)
```

### 포스트 frontmatter

```markdown
---
title: "포스트 제목"
date: "2026-03-27"
tags: ["태그1", "태그2"]
series: "시리즈-이름"
description: "포스트 설명"
ogTitle: "Open Graph 제목"
keywords: ["키워드1", "키워드2"]
published: true
---
```

## 빌드/테스트

```bash
pnpm dev            # Velite 감시 + Next.js dev (포트 3000)
pnpm build          # Velite 콘텐츠 처리 + Next.js 빌드
pnpm preview        # 프로덕션 빌드 미리보기
pnpm test           # Vitest 단일 실행
pnpm test:watch     # Vitest 감시 모드
pnpm test:coverage  # 커버리지 리포트
pnpm check-types    # 타입 체크
pnpm create-post    # AI 지원 포스트 생성
```

## SSG 전략

- **`output: 'export'`**: 프로덕션 빌드 시 완전한 정적 HTML 생성
- **`trailingSlash: true`**: 호스팅 호환을 위한 후행 슬래시 설정
- **`images.unoptimized: true`**: 정적 호스팅에서 Next.js Image 최적화 비활성화

## Supabase 역할

| 기능          | 설명                                                  |
| ------------- | ----------------------------------------------------- |
| 조회수 추적   | `increment_view_count` RPC → `post_views` 테이블 저장 |
| 조회 이력     | `view_history` 테이블에 시간별/일별 기록              |
| Admin 인증    | Google OAuth를 통한 관리자 로그인                     |
| Analytics RPC | 대시보드용 집계 함수                                  |

## 환경변수

| 변수                            | 목적                       | 필수 |
| ------------------------------- | -------------------------- | ---- |
| `NEXT_PUBLIC_BASE_URL`          | 프로덕션 URL               | ✅   |
| `NEXT_PUBLIC_GA_ID`             | Google Analytics           | ✅   |
| `NEXT_PUBLIC_SUPABASE_URL`      | Supabase URL               | ✅   |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase 익명 키           | ✅   |
| `ANTHROPIC_API_KEY`             | Claude API (포스트 생성용) | ❌   |

## 디자인 시스템

토큰은 `src/app/styles/tokens.css`에서 관리, `globals.css`에서 Tailwind에 연결.

**사용 방법:**

```tsx
// Tailwind 클래스로 사용
<div className="bg-background text-foreground rounded-xl shadow-md" />

// CSS 변수 직접 사용
.custom { background: var(--card); border-radius: var(--radius-lg); }

// shadcn/ui 커스터마이징
<Button className="bg-point text-point-foreground" />
```

**원칙:**

- 직접 색상 값(`#fff`) 대신 토큰 변수 사용
- 다크모드는 `.dark` 클래스로 자동 전환, 컴포넌트 수정 불필요
- 모바일 퍼스트 반응형
