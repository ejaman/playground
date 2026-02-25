---
title: "Tailwind Setting"
date: "2026-02-25"
tags: ["tailwind"]
series: "playground"
---

# Tailwind CSS v4 설정 정리

블로그 웹 앱에 Tailwind CSS v4를 적용하고, Turborepo 구조에 맞춰 설정한 내용을 정리한 문서입니다.

---

## 1. 처음 상황: 스타일이 적용되지 않음

### 원인

- Tailwind v4는 **PostCSS**를 통해 CSS를 처리합니다.
- Next.js에서 PostCSS를 쓰려면 **`postcss.config.*`** 와 **`@tailwindcss/postcss`** 플러그인이 필요합니다.
- 프로젝트에는 PostCSS 설정이 없었고, `@tailwindcss/postcss` 패키지도 설치되어 있지 않았습니다.

### 한 작업

1. **`postcss.config.mjs` 추가**
   - 플러그인: `@tailwindcss/postcss`
2. **`@tailwindcss/postcss` 설치**
   - `pnpm add -D @tailwindcss/postcss` (앱 또는 모노레포 루트에서)

> **참고:** Tailwind v4부터는 `tailwind.config.js`가 필수가 아닙니다.  
> 테마·소스·플러그인은 CSS(`@theme`, `@source`, `@plugin`)에서 설정하고,  
> **PostCSS 설정만** 빌드 파이프라인용으로 필요합니다.

---

## 2. Turbopack + pnpm 모노레포에서 생기던 오류

### 오류 A: `Cannot find module '@tailwindcss/postcss'`

- Turbopack이 PostCSS를 실행할 때 **앱 루트(`apps/blog/web`)가 아닌 다른 경로**에서 모듈을 찾음.
- pnpm 워크스페이스에서는 `@tailwindcss/postcss`가 **앱의 `node_modules`** 에만 있어서, 그 경로에서 resolve가 실패함.

### 오류 B: `Can't resolve '../pkg'` (lightningcss)

- Tailwind v4는 내부적으로 **Lightning CSS**를 사용함.
- Lightning CSS는 실행 시 `../pkg` 같은 **상대 경로**로 네이티브 바이너리를 로드함.
- PostCSS 플러그인을 **절대 경로**로 넣거나 Turbopack이 플러그인을 **번들**에 포함하면,  
  실행 컨텍스트가 번들 안으로 바뀌어서 `../pkg` 경로가 깨짐.

### 해결 방향: Turborepo 공식 패턴 적용

- **공유 패키지**에서 PostCSS 설정을 관리하고,  
  앱은 그 설정을 **import해서 re-export**만 하면,  
  Turbopack이 플러그인을 resolve할 때 더 안정적으로 동작합니다.

---

## 3. Turborepo에서 Tailwind 쓰는 방식 적용

### 목표

- Vercel의 **Turborepo `with-tailwind` 예제**처럼,  
  PostCSS 설정을 **공유 패키지**로 두고 앱에서만 참조하도록 통일.

### 한 작업

1. **`packages/tailwind-config` 패키지 추가**
   - **역할:** Tailwind/PostCSS 설정을 한 곳에서 관리.
   - **내용:**
     - `postcss.config.js`: `@tailwindcss/postcss` 사용, `exports["./postcss"]`로 노출.
     - `shared-styles.css`: `@import "tailwindcss"` (필요 시 앱에서 참조).
     - `package.json`: `@tailwindcss/postcss`, `postcss`, `tailwindcss`를 **devDependencies**로 보유.

2. **`apps/blog/web` 수정**
   - **`postcss.config.js`**
     - 직접 플러그인을 나열하지 않고,  
       `import { postcssConfig } from "@repo/tailwind-config/postcss"; export default postcssConfig;` 로 **re-export**만 함.
   - **`package.json`**
     - `@repo/tailwind-config`를 **workspace** devDependency로 추가.

이렇게 하면:

- Tailwind/PostCSS 의존성이 **`tailwind-config` 패키지 한 곳**에 모이고,
- Turbopack이 PostCSS 플러그인을 resolve할 때 **공유 패키지 기준**으로 찾기 때문에,  
  pnpm 워크스페이스에서도 동작하기 쉬움.

---

## 4. `border-border` 등 “unknown utility” 오류

### 원인

- `border-border`, `outline-ring/50`, `text-muted-foreground`, `bg-muted` 등은  
  **Tailwind 테마에 색 이름이 있어야** 유틸리티로 인식됩니다.
- `globals.css`의 `:root`에는 `--border`, `--muted` 등 CSS 변수만 있고,  
  **`@theme` 블록**에 `--color-border`, `--color-muted` 등이 없었음.

### 한 작업

`globals.css`의 `@theme`에 다음을 추가했습니다.

- `--color-border: var(--border);`
- `--color-ring: var(--foreground);`
- `--color-muted: var(--muted);`
- `--color-muted-foreground: var(--muted-foreground);`

이후 `border-border`, `text-muted-foreground`, `bg-muted` 등이 정상 유틸리티로 동작합니다.

---

## 5. 컴파일(린트) 타임에 Tailwind 클래스 검사

### 목표

- 오타나 정의되지 않은 Tailwind 클래스를 **빌드/린트 단계**에서 잡고 싶음.

### 한 작업

1. **`eslint-plugin-tailwind-v4` 설치**
   - Tailwind v4의 **CSS-first 설정**(`@theme`, `@import "tailwindcss"` 등)을 읽어서  
     “정의된 클래스 목록”을 만들고, 그 목록에 없으면 ESLint로 보고하는 플러그인.

2. **`apps/blog/web/eslint.config.js` 수정**
   - 플러그인: `eslint-plugin-tailwind-v4`
   - 규칙: `tailwind-v4/no-undefined-classes` → **error**
   - 옵션: `cssFile: "src/shared/styles/globals.css"`  
     → 이 파일을 기준으로 `@theme`·기본 유틸리티·플러그인 클래스를 해석.

### 사용 방법

- **터미널:** `pnpm lint` 실행 시, 정의되지 않은 클래스가 있으면 **에러**로 표시.
- **에디터:** VS Code 등에서 ESLint 확장 사용 시, 해당 클래스에 에러/경고로 표시.

### 참고

- Tailwind 기본 유틸리티(`max-w-2xl` 등)나 `@tailwindcss/typography`의 `prose-slate` 등은  
  플러그인이 “정의됨”으로 인식하지 못해 **가끔 false positive**가 날 수 있음.
- 그런 경우:
  - 해당 줄만 예외: `// eslint-disable-next-line tailwind-v4/no-undefined-classes`
  - 규칙 완화: `"error"` → `"warn"`으로 변경

---

## 6. 최종 구조 요약

| 항목                       | 위치 / 내용                                                                                                   |
| -------------------------- | ------------------------------------------------------------------------------------------------------------- |
| PostCSS 설정 (실제 내용)   | `packages/tailwind-config/postcss.config.js`                                                                  |
| 앱 PostCSS 진입점          | `apps/blog/web/postcss.config.js` → `@repo/tailwind-config/postcss` re-export                                 |
| Tailwind 진입 CSS          | `apps/blog/web/src/shared/styles/globals.css` (`@import "tailwindcss"`, `@theme`, `@source`, `@plugin`)       |
| 테마 색 (border, muted 등) | `globals.css`의 `@theme`에 `--color-border`, `--color-muted`, `--color-muted-foreground`, `--color-ring` 추가 |
| 클래스 검증 (린트)         | `eslint-plugin-tailwind-v4` + `tailwind-v4/no-undefined-classes`, 기준 CSS: `src/shared/styles/globals.css`   |

---

## 7. 참고 링크

- [Tailwind CSS v4 – Installation (Next.js)](https://tailwindcss.com/docs/installation/framework-guides/nextjs)
- [Turborepo – with-tailwind example](https://github.com/vercel/turbo/tree/main/examples/with-tailwind)
- [eslint-plugin-tailwind-v4](https://www.npmjs.com/package/eslint-plugin-tailwind-v4)
