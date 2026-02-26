---
title: "마크다운 가독성 향상"
date: "2026-02-26"
tags: []
series: "playground"
---

# rehype-pretty-code 적용 내역

마크다운 가독성 향상(코드 하이라이팅 등)을 위해 rehype-pretty-code 및 관련 rehype 플러그인을 적용한 변경 사항입니다.

---

## 1. 설치한 패키지

- **shiki** – 문법 하이라이팅 엔진 (rehype-pretty-code의 peer dependency)
- **rehype-pretty-code** – Shiki 기반 rehype 플러그인 (코드 블록 하이라이팅)

기존에 사용하던 패키지:

- rehype-slug
- rehype-autolink-headings
- rehype-code-titles

코드 하이라이팅만 **rehype-prism-plus** → **rehype-pretty-code** 로 교체했습니다.

---

## 2. contentlayer.config.ts 변경

### 추가한 import

```ts
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeCodeTitles from "rehype-code-titles";
import rehypePrettyCode from "rehype-pretty-code";
```

### makeSource 옵션 추가

`markdown.rehypePlugins` 를 설정했습니다.

| 순서 | 플러그인               | 역할                                    |
| ---- | ---------------------- | --------------------------------------- |
| 1    | rehypeSlug             | 제목(`#`, `##` 등)에 고유 `id` 부여     |
| 2    | rehypeAutolinkHeadings | 제목에 앵커 링크 추가 (클래스 `anchor`) |
| 3    | rehypeCodeTitles       | 코드 블록 위에 제목(파일명 등) 표시     |
| 4    | rehypePrettyCode       | Shiki로 코드 블록 문법 하이라이팅       |

rehypePrettyCode 옵션:

- `theme: "github-dark-dimmed"`
- `keepBackground: false` (배경은 CSS에서 처리)

> rehype와 contentlayer의 unified/vfile 버전 차이로 인해 `rehypePlugins` 배열에 `as any` 타입 단언을 사용했습니다.

---

## 3. globals.css 변경

### 제목 앵커 링크 (rehype-autolink-headings)

```css
.prose .anchor {
  @apply no-underline text-muted-foreground;
}
.prose .anchor:hover {
  @apply text-foreground;
}
```

### rehype-pretty-code 코드 블록

```css
.prose pre {
  @apply overflow-x-auto rounded-lg border border-border bg-muted py-4;
}
.prose pre [data-line] {
  @apply px-4;
}
.prose pre code {
  @apply bg-transparent p-0 text-sm;
}
```

---

## 4. 사용 방법

### 코드 블록

마크다운에서 언어만 지정하면 Shiki가 하이라이팅합니다.

````md
```ts
const x = 1;
```
````

### 코드 블록 제목 (파일명)

`:` 뒤에 제목을 붙이면 rehype-code-titles가 표시합니다.

````md
```ts:src/app.ts
const x = 1;
```
````

### 특정 줄 하이라이트 (rehype-pretty-code)

메타에 `{줄번호}` 또는 `{시작-끝}` 을 넣습니다.

````md
```ts {2,4}
const a = 1;
const b = 2; // 강조
const c = 3;
const d = 4; // 강조
```
````

---

## 5. 선택 사항

- **rehype-prism-plus** 는 더 이상 사용하지 않습니다. 제거하려면:
  ```bash
  pnpm remove rehype-prism-plus
  ```
- 테마 변경: `contentlayer.config.ts` 의 rehypePrettyCode 옵션에서 `theme` 값을 다른 Shiki 테마(예: `"one-dark-pro"`, `"github-light"`)로 바꿀 수 있습니다.

# rehype 적용 전·후 차이

이번에 `contentlayer.config.ts`에 `markdown.rehypePlugins`를 넣기 **전**에는, Contentlayer가 마크다운을 **기본 설정만으로** HTML로 바꾸고 있었습니다.  
그래서 rehype 플러그인 적용 **전**과 **후**에 실제로 달라지는 부분만 정리했습니다.

---

## 1. 적용 전 (rehype 없을 때)

- **제목 (`#`, `##` …)**
  - 그냥 `<h1>`, `<h2>` 등으로만 나옴.
  - `id`가 없어서 **특정 제목으로 딱 떨어지는 링크**(예: `...#설치-방법`)를 줄 수 없음.
  - 제목 옆에 “이 구간 링크 복사” 같은 앵커도 없음.

- **코드 블록 (```)**
  - `<pre><code>...</code></pre>` 로만 출력.
  - **문법별 색상(하이라이팅)** 없음 → 키워드/문자열/주석 구분 없이 한 가지 스타일.
  - 코드 블록 위에 **파일명/제목**을 붙이는 기능도 없음.
  - “이 줄만 강조” 같은 **줄 단위 하이라이트**도 없음.

- **스타일**
  - `.prose` 안의 `pre`/`code`는 Tailwind Typography 기본 스타일만 적용.
  - 제목용 앵커 스타일도 없음.

정리하면, **적용 전**에는 “일반 마크다운 → HTML”만 되고, **제목 앵커·코드 하이라이팅·코드 제목·줄 강조**는 없었습니다.

---

## 2. 적용 후 (지금 설정)

| 항목               | 적용 후 동작                                                                                                                                                              |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **제목**           | `rehype-slug`로 각 제목에 `id` 부여 (예: `id="설치-방법"`). `rehype-autolink-headings`로 제목 안에 앵커 링크(`<a class="anchor">`)가 들어가서, **주소 복사·딥링크** 가능. |
| **코드 블록**      | `rehype-pretty-code`(Shiki)로 **문법 하이라이팅** (키워드/문자열/주석 등 색 구분). 테마는 `github-dark-dimmed`.                                                           |
| **코드 블록 제목** | `rehype-code-titles`로 ` ```ts:src/app.ts ` 같은 메타에서 **파일명/제목**을 코드 블록 위에 표시.                                                                          |
| **줄 하이라이트**  | ` ```ts {2,4} ` 처럼 메타에 `{줄번호}`를 넣으면 **해당 줄만 강조** 가능.                                                                                                  |
| **스타일**         | `globals.css`에서 `.prose pre`(둥근 모서리, 테두리, 배경), `[data-line]` 패딩, `.anchor` 색/호버 적용.                                                                    |

---

## 3. 한 줄 요약

- **적용 전**: 제목은 그냥 제목, 코드는 한 가지 스타일의 평문. 딥링크·코드 제목·줄 강조 없음.
- **적용 후**: 제목에 id + 앵커(딥링크), 코드는 Shiki 문법 하이라이팅 + 제목 + 줄 강조, 그리고 코드/앵커용 CSS 적용.

즉, **“어디가 달라지냐”**면 **제목 앵커/딥링크**와 **코드 블록(하이라이팅·제목·줄 강조·스타일)** 이 전부 적용 후에 생긴 부분입니다.

```typescript
const test = 1;
```
