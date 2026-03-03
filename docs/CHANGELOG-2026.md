# 변경 사항 정리 (2026)

지금까지 적용한 구조·설정 변경을 정리한 문서입니다.

---

## 1. 모듈·의존성

### 1.1 `@repo/ui` 모듈을 찾을 수 없음 (ts 2307)

- **원인**: `packages/ui`의 `exports`에 루트 진입점(`"."`)이 없어서 `import from "@repo/ui"`가 실패함. 또 `format`/`parseISO`는 date-fns 함수인데 UI 패키지에서 import하고 있음.
- **조치**
  - `packages/ui/package.json`: `exports`에 `".": "./src/index.ts"` 추가.
  - `packages/ui/src/index.ts`: button, card, code re-export.
  - PostCard 등에서는 `format`/`parseISO`를 **date-fns에서 직접** import하도록 수정.

### 1.2 UI 패키지 의존성 정리

- **변경**: `packages/ui`에서 `date-fns`, `lucide-react` 제거 → `apps/blog/web`에만 설치.
- **이유**: 폰트·유틸은 앱에서만 쓰고, UI 패키지는 순수 컴포넌트만 두기 위함.

---

## 2. 블로그·콘텐츠

### 2.1 PostCard에 태그 노출

- `post.tags`가 있으면 날짜·시리즈 아래에 태그 칩(rounded-full, 작은 라벨)으로 표시.
- 접근성용 `aria-label="태그"` 추가.

### 2.2 playground 폴더명 → blog

- **경로**: `apps/playground` → `apps/blog` (웹 앱은 `apps/blog/web`, 글은 `apps/blog/posts` 등).
- **수정한 곳**
  - `scripts/create-post.mjs`: `SERIES_PATH`, `POSTS_PATH`를 `./apps/blog/...`로 변경.
  - `README.md`, `apps/blog/GUIDE.md`, 포스트 md들: 문서 내 `apps/playground` → `apps/blog`.
  - `pnpm install --no-frozen-lockfile`로 락 반영.

---

## 3. 앱 구조 (FSD + Blog / Hub / Portfolio)

### 3.1 라우트 분리

| 경로 | 설명 |
|------|------|
| `/` | 홈 → **`/blog`로 리다이렉트** |
| `/blog` | 블로그 목록 |
| `/blog/posts/[slug]` | 글 상세 |
| `/hub` | Hub (준비 중) |
| ~~`/portfolio`~~ | → 별도 앱으로 분리 (아래 4번) |

- **velite**: 글 URL을 `/posts/...` → **`/blog/posts/...`** 로 생성하도록 수정.

### 3.2 FSD 레이어

- **app**: 앱 초기화, 전역 스타일 (`src/app/styles/globals.css`), 폰트 로딩.
- **shared**: 공통 UI·유틸 (`Header`, `Tag`, utils, parseHeadingsFromHtml, fonts). 정적 자산은 `shared/assets/fonts`.
- **entities**: 비즈니스 엔티티 (예: `post` – ui, lib).
- **features**: 사용자 시나리오/액션 (추후 추가).
- **widgets**: 조합 블록 (추후 추가).

- `src/README.md`에 FSD 레이어 설명 추가.
- import 경로를 **`@/shared/...`**, **`@/entities/...`** 등으로 통일.

### 3.3 Header 네비게이션

- Blog, Hub 링크 추가 (Portfolio는 별도 앱으로 분리 후 제거).

### 3.4 홈 = 블로그

- `app/page.tsx`: 기존 카드형 홈 제거 → **`redirect("/blog")`** 만 호출. `/` 접속 시 `/blog`로 리다이렉트.

---

## 4. 폰트 (FSD)

- **위치**: `app/fonts` + `public/fonts`에 흩어져 있던 폰트 파일 → **`src/shared/assets/fonts`** 로 통합.
- **이유**: FSD에서 앱 전역 자산은 **shared**에 두는 것이 맞고, 바이너리/정적 파일은 `shared/assets`에 두는 관례.
- **수정**: `src/shared/lib/fonts.ts`에서 Pretendard 경로를 `../assets/fonts/PretendardVariable.woff2`로 변경.
- `app/fonts` 폴더 제거.

---

## 5. Portfolio 앱 분리

### 5.1 구조

- **Blog+Hub**: `apps/blog/web` (단일 Next.js 앱, `/blog`, `/hub`).
- **Portfolio**: **`apps/portfolio`** (별도 Next.js 앱).

### 5.2 추가한 것

- `apps/portfolio/`: `package.json`(name: `portfolio`), `app/layout.tsx`, `app/page.tsx`, `tsconfig.json`, `next.config.ts`, `.gitignore`.
- 의존성: Next 16, React 19, `@repo/ui` (workspace).
- 실행: `pnpm --filter portfolio dev` → **포트 3001**.

### 5.3 제거한 것 (playground/web)

- `app/portfolio/` 라우트 전체.
- Header의 "Portfolio" 링크.

---

## 6. Vercel 배포 설정

### 6.1 앱별 vercel.json

- **루트 `vercel.json` 삭제** (한 루트 설정으로 두 앱을 구분할 수 없음).
- **`apps/blog/web/vercel.json`**: blog+hub용.
  - `buildCommand`: `cd ../../.. && pnpm turbo run build --filter=web`
  - `installCommand`: `cd ../../.. && pnpm install`
  - `outputDirectory`: `.next`
- **`apps/portfolio/vercel.json`**: portfolio용.
  - `buildCommand`: `cd ../.. && pnpm turbo run build --filter=portfolio`
  - `installCommand`: `cd ../.. && pnpm install`
  - `outputDirectory`: `.next`

### 6.2 Vercel 프로젝트

- **두 개의 Vercel 프로젝트** 사용 권장.
- 프로젝트 1: Root Directory = **`apps/blog/web`** (Blog+Hub).
- 프로젝트 2: Root Directory = **`apps/portfolio`** (Portfolio).
- 같은 저장소를 연결한 뒤, 각 프로젝트에서 Root Directory만 위와 같이 설정하면 됨.

---

## 요약

| 항목 | 내용 |
|------|------|
| 앱 구성 | blog+hub → `apps/blog/web`, portfolio → `apps/portfolio` |
| 첫 페이지 | `/` → `/blog` 리다이렉트 |
| FSD | app, shared, entities, features, widgets 레이어 정리, `@/` import |
| 폰트 | `src/shared/assets/fonts`로 통합 |
| UI 패키지 | 루트 export 추가, date-fns/lucide는 앱에서만 사용 |
| 배포 | 앱별 `vercel.json`, Vercel 프로젝트 2개·Root Directory 분리 |
