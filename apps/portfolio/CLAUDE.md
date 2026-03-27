# CLAUDE.md (포트폴리오 앱)

This file provides guidance to Claude Code (claude.ai/code) when working with the portfolio app.

## 아키텍처 (포트폴리오 특화)

### 기술 스택

- **Framework**: Next.js 15 (App Router), React 19
- **Build Tool**: Turbopack (dev), Webpack (prod)
- **Analytics**: Google Analytics 4

### 폴더 구조 (Feature-Sliced Design)

```
apps/portfolio/src/
├── app/           # Next.js App Router: pages, layouts, metadata
│   └── page.tsx   # 메인 포트폴리오 페이지
├── shared/        # 횡단 관심사: ui/, hooks/, lib/, api/, store/, assets/
│   ├── ui/        # 디자인 시스템 컴포넌트 (@repo/ui)
│   ├── hooks/     # 범용 React hooks
│   ├── lib/       # 유틸리티 함수, 설정
│   ├── api/       # 외부 API 클라이언트
│   ├── store/     # 전역 상태 (Zustand)
│   └── assets/    # 정적 파일, 아이콘, 폰트
├── entities/      # 도메인 모델: project/, skill/, experience/
│   ├── project/   # 프로젝트 관련 타입, API, 비즈니스 로직
│   ├── skill/     # 기술 스킬 관련 타입, API, 비즈니스 로직
│   └── experience/ # 경력 관련 타입, API, 비즈니스 로직
├── features/      # 사용자 상호작용: contact/, projects/, skills/
└── widgets/       # 페이지 섹션: header/, footer/, hero/
```

**경로 별칭:**

- `@/*` → `src/*`

## 빌드/테스트 (포트폴리오 전용)

### 개발 서버

```bash
pnpm dev            # Next.js dev (port 3001)
pnpm build          # Next.js 빌드
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
- **특징**: 정적 콘텐츠 기반 포트폴리오 사이트

## 도메인 컨텍스트 (포트폴리오)

### 비즈니스 용어

- **Project**: 포트폴리오에展示할 프로젝트
  - 속성: `title`, `description`, `technologies`, `githubUrl`, `liveUrl`, `featured`
- **Skill**: 보유 기술 스택
  - 카테고리: `frontend`, `backend`, `tools`, `design`
- **Experience**: 경력 및 교육 배경

### 데이터 흐름

1. **콘텐츠 관리**: 정적 데이터 또는 Supabase에서 프로젝트 정보 관리
2. **서버 상태**: React Query로 외부 API 데이터 fetch
3. **클라이언트 상태**: Zustand로 UI 상태 관리
4. **인증**: 필요시 Supabase Auth로 관리자 기능

### 주요 워크플로우

- **프로젝트 추가**: 새로운 프로젝트 정보 입력/수정
- **기술 스택 업데이트**: 보유 기술 정보 관리
- **SEO 최적화**: 메타 태그 및 구조화된 데이터 활용

## 콘텐츠 관리

### 프로젝트 데이터 구조

```typescript
interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### 기술 스택 카테고리

```typescript
type SkillCategory = "frontend" | "backend" | "tools" | "design";

interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  proficiency: number; // 1-5
  icon?: string;
}
```

## 환경변수 (포트폴리오 전용)

| 변수                   | 목적             | 필수 |
| ---------------------- | ---------------- | ---- |
| `NEXT_PUBLIC_BASE_URL` | 프로덕션 URL     | ✅   |
| `NEXT_PUBLIC_GA_ID`    | Google Analytics | ✅   |

## 개발 팁

- **레이아웃 확인**: 다양한 화면 크기에서 반응형 디자인 테스트
- **성능 최적화**: 이미지 최적화 및 로딩 성능 확인
- **접근성**: 키보드 내비게이션 및 스크린 리더 지원 확인
- **SEO**: 메타 태그, 구조화된 데이터, Core Web Vitals 점수 확인
