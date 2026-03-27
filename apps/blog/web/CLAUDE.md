# CLAUDE.md (블로그 앱)

This file provides guidance to Claude Code (claude.ai/code) when working with the blog app.

## 아키텍처 (블로그 특화)

### 기술 스택

- **Framework**: Next.js 15 (App Router), React 19
- **Build Tool**: Turbopack (dev), Webpack (prod)
- **Content**: Velite (MDX processing)
- **Analytics**: Google Analytics 4

### 폴더 구조 (Feature-Sliced Design)

```
apps/blog/web/src/
├── app/           # Next.js App Router: pages, layouts, metadata, API routes
│   ├── blog/      # 블로그 관련 페이지들
│   ├── experiment/# 실험 기능 페이지들
│   └── hub/       # 허브 페이지
├── shared/        # 횡단 관심사: ui/, hooks/, lib/, api/, store/, assets/
│   ├── ui/        # 디자인 시스템 컴포넌트 (@repo/ui)
│   ├── hooks/     # 범용 React hooks
│   ├── lib/       # 유틸리티 함수, 설정
│   ├── api/       # 외부 API 클라이언트
│   ├── store/     # 전역 상태 (Zustand)
│   └── assets/    # 정적 파일, 아이콘, 폰트
├── entities/      # 도메인 모델: post/, series/, experiment/
│   ├── post/      # 포스트 관련 타입, API, 비즈니스 로직
│   ├── series/    # 시리즈 관련 타입, API, 비즈니스 로직
│   └── experiment/ # 실험 기능 관련 타입, API, 비즈니스 로직
├── features/      # 사용자 상호작용: auth/, blog/, search/
└── widgets/       # 페이지 섹션: header/, footer/, sidebar/
```

**경로 별칭:**

- `@/*` → `src/*`
- `#site/content` → `.velite/` (Velite 생성)

## 빌드/테스트 (블로그 전용)

### 개발 서버

```bash
pnpm dev            # Velite 감시 + Next.js dev (port 3000)
pnpm build          # Velite 콘텐츠 처리 + Next.js 빌드
pnpm preview        # 프로덕션 빌드 미리보기
```

### 테스트

```bash
pnpm test           # Vitest 단일 실행
pnpm test:watch     # Vitest 감시 모드
pnpm test:coverage  # 커버리지 리포트
```

### 배포

- **환경**: 프로덕션은 `NEXT_PUBLIC_BASE_URL` 기준
- **특징**: Velite가 빌드 시점에 모든 마크다운을 처리

## 도메인 컨텍스트 (블로그)

### 비즈니스 용어

- **Post**: 마크다운 기반 블로그 포스트
  - frontmatter: `title`, `date`, `tags`, `series`, `description`, `ogTitle`, `keywords`, `published`
  - `published: true`인 포스트만 공개 표시
- **Series**: 관련 포스트들의 그룹 (`apps/blog/series.json`에 정의)
- **Experiment**: 프로토타이핑/실험 기능 (별도 섹션)

### 데이터 흐름

1. **콘텐츠 생성**: `apps/blog/posts/`에 마크다운 작성
2. **처리**: Velite가 빌드 시 `.velite/`로 변환
3. **서버 상태**: React Query가 API에서 데이터 fetch (staleTime: 1분)
4. **클라이언트 상태**: Zustand로 UI 상태 관리
5. **인증**: Supabase Auth로 사용자 관리

### 주요 워크플로우

- **포스트 작성**: `pnpm create-post` (Claude AI 활용)
- **시리즈 관리**: `apps/blog/series.json` 편집
- **SEO 최적화**: 각 포스트의 frontmatter 메타데이터 활용

## 콘텐츠 관리

### Velite 설정

- **입력**: `apps/blog/posts/`의 마크다운 파일들
- **출력**: `.velite/` 디렉토리 (빌드 시 생성)
- **특징**: 타입 안전한 콘텐츠 처리

### 포스트 구조

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

포스트 내용...
```

## 환경변수 (블로그 전용)

| 변수                   | 목적                       | 필수 |
| ---------------------- | -------------------------- | ---- |
| `NEXT_PUBLIC_BASE_URL` | 프로덕션 URL               | ✅   |
| `NEXT_PUBLIC_GA_ID`    | Google Analytics           | ✅   |
| `ANTHROPIC_API_KEY`    | Claude API (포스트 생성용) | ❌   |

## 디자인 시스템

### 디자인 토큰

디자인 토큰은 `src/app/styles/tokens.css`에 중앙화되어 관리됩니다:

- **색상 토큰**: 기본 팔레트, 시맨틱 색상, 브랜드 색상
- **타이포그래피**: Pretendard Sans, Geist Mono 폰트
- **간격**: 1-24px 범위의 일관된 스페이싱
- **반경**: sm/md/lg/xl 크기의 border-radius
- **그림자**: sm부터 xl까지의 elevation 레벨
- **애니메이션**: 트랜지션 및 키프레임 정의

### 테마 연결

- **라이트/다크 모드**: CSS 변수 기반 테마 전환
- **Tailwind 통합**: `@theme inline`으로 디자인 토큰을 Tailwind에 연결
- **컴포넌트**: shadcn/ui 기반 일관된 디자인 컴포넌트

### 스타일링 원칙

- **CSS 우선**: Tailwind CSS 클래스로 스타일링
- **토큰 사용**: 직접 색상 값 대신 디자인 토큰 활용
- **반응형**: 모바일 퍼스트 접근법
- **접근성**: WCAG 2.1 AA 준수

## 개발 팁

- **콘텐츠 미리보기**: `pnpm dev`로 로컬에서 확인
- **포스트 생성**: `pnpm create-post`로 AI 지원 작성
- **빌드 확인**: `pnpm build`로 프로덕션 빌드 테스트
- **타입 체크**: `pnpm check-types`로 타입 안전성 확인
