---
title: "2. md 파일을 데이터로 처리하기"
date: "2026-02-27"
tags: ["velite", "contentlayer", "migration", "playground"]
series: "playground"
published: true
---

# 2. md 파일을 데이터로 처리하기

이번에는 마크다운 처리 라이브러리를 Contentlayer에서 Velite로 교체한 과정을 기록해보려 한다.

## 라이브러리 변경 개기

처음에는 Contentlayer가 NextJS 마크다운 처리의 표준이라고 생각해 그냥 Contentlayer를 활용했다. 래퍼런스도 많고 문서도 잘 정리되어 있었기 때문이다.

그러나 실제 사용하다 Github을 보니 이슈와 PR이 방치되고 있었고 다른 블로그에서도 Contentlayer를 버리고 갈아탄 사람들이 많았다.
이 블로그는 나의 프론트엔드 개발기를 쭉 기록할 블로그인데 유지보수가 멈춘 라이브러리를 사용하기보단 새로운 라이브러리를 사용하고 싶어서 Velite으로 갈아탔다.

## Contentlayer VS Velite

### Contentlayer 스키마 정의 방식

Contentlayer는 자체 타입 시스템을 사용

```typescript
// contentlayer.config.ts
export const Post = defineDocumentType(() => ({
  name: "Post",
  filePathPattern: `**/*.md`,
  fields: {
    title: { type: "string", required: true },
    date: { type: "date", required: true },
    tags: { type: "list", of: { type: "string" } },
  },
  computedFields: {
    url: {
      type: "string",
      resolve: (post) => `/posts/${post._raw.flattenedPath}`,
    },
  },
}));
```

### Velite 스키마 정의 방식

Velite은 zod 기반 스키마 정의 사용
그래서 만약 zod를 알고 있는 사용자라면 Velite의 정의 방식이 더 직관적이라고 느낄 것이다.

```typescript
// velite.config.ts
const posts = defineCollection({
  name: "Post",
  pattern: "**/*.md",
  schema: s
    .object({
      title: s.string(),
      date: s.isodate(),
      tags: s.array(s.string()).optional().default([]),
    })
    .transform((data) => ({
      ...data,
      url: `/posts/${data.slug}`,
    })),
});
```

## 마크다운 처리 방식

이 부분은 두 라이브러리 모두 rehype/remark 파이프라인을 지원하며 설정 방식도 거의 동일했다.

```typescript
// Contentlayer
markdown: {
  rehypePlugins: [rehypeSlug, rehypePrettyCode],
}

// Velite
mdx: {
  rehypePlugins: [rehypeSlug, rehypePrettyCode],
}
```

## 마이그레이션!

### 1. 라이브러리 설치

일단 가장 먼저 패키지를 교체해 준다

```bash
# 제거
pnpm remove contentlayer next-contentlayer rehype-prism-plus --filter web

# 설치
pnpm add velite --filter web
```

기존에 rehype-pretty-code와 함께 설치되어 있었는데, 두 라이브러리가 같은 역할(코드 하이라이팅)을 하는 중복 의존성이었다. 그래서 하는 김에 rehype-prism-plus도 함께 제거!

### 2. velite.config.ts 작성

```ts
// @ts-nocheck
import { defineCollection, defineConfig, s } from "velite";
import type { Options as RehypePrettyCodeOptions } from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeCodeTitles from "rehype-code-titles";
import rehypePrettyCode from "rehype-pretty-code";
import fs from "fs";
import path from "path";

const getSeriesTitle = (seriesKey: string): string => {
  try {
    const seriesPath = path.resolve(process.cwd(), "../../series.json");
    if (fs.existsSync(seriesPath)) {
      const seriesData = JSON.parse(fs.readFileSync(seriesPath, "utf-8"));
      return seriesData[seriesKey]?.title || seriesKey;
    }
  } catch {
    console.warn("⚠️ series.json 로드 실패, 기본 키를 사용합니다.");
  }
  return seriesKey;
};

const posts = defineCollection({
  name: "Post",
  pattern: "**/*.md",
  schema: s
    .object({
      // zod랑 비슷하죠
      title: s.string(),
      date: s.isodate(),
      tags: s.array(s.string()).optional().default([]),
      series: s.string().optional(),
      slug: s.path(),
      body: s.markdown(),
    })
    .transform((data) => ({
      ...data,
      url: `/posts/${data.slug}`,
      seriesTitle: data.series ? getSeriesTitle(data.series) : undefined,
    })),
});

export default defineConfig({
  root: "../posts",
  output: {
    data: ".velite",
    assets: "public/static",
    base: "/static/",
    name: "[name]-[hash:8].[ext]",
    clean: true,
  },
  collections: { posts },
  mdx: {
    rehypePlugins: [
      rehypeSlug,
      [rehypeAutolinkHeadings, { properties: { className: ["anchor"] } }],
      rehypeCodeTitles,
      [
        rehypePrettyCode,
        {
          theme: "github-dark-dimmed",
          keepBackground: false,
        } satisfies RehypePrettyCodeOptions,
      ],
    ],
  },
});
```

참고로 [코드 테마](https://shiki.style/themes#themes)는 짱많으니까 원하는 거 찾아서 사용하면 된다. 나는 그냥 디폴트인 `github-dark-dimmed`를 사용했다.

### 3. next.config.ts 변경

공식 문서에 따르면 Velite는 [webpack 플러그인 방식](https://velite.js.org/guide/with-nextjs#start-velite-with-next-js-webpack-plugin)을 사용한다.

그런데 Next.js 16부터 Turbopack이 기본값이 되면서 이 방식이 동작하지 않았다.
그래서 Turbopack 환경에서는 빌드 전에 Velite를 직접 실행하는 방식으로 우회해야 한다.
([공식 문서를 보면 turbopack으로 갈아타고 있는 듯!](https://velite.js.org/guide/with-nextjs#start-velite-with-next-js-webpack-plugin))

```typescript
// next.config.ts
import { build } from "velite";

const nextConfig = {
  turbopack: {},
};

if (process.env.NODE_ENV === "development") {
  build({ watch: true, logLevel: "warn" });
} else {
  build({ logLevel: "warn" });
}

export default nextConfig;
```

### 4. tsconfig.json 확인

여기서 path를 설정하고 velite.config.ts를 exclude에 추가했다.
이유는 아래 트러블슈팅 섹션에서 참고 🙏

```json
{
  "compilerOptions": {
    "paths": {
      "#site/content": ["./.velite"]
    }
  },
  "include": [".velite"],
  "exclude": [
    "node_modules",
    "velite.config.ts" // 추가
  ]
}
```

### 5. import 경로 변경

당근 경로가 다르니 여기도 변경해 준다/

```
// 변경 전
import { allPosts, type Post } from "contentlayer/generated";

// 변경 후
import { posts, type Post } from "#site/content";
```

변수명이 `allPosts`에서 `posts`로 바뀐 것에 주의해야 했다.

### 6. 사용 방식 변경

기존 Contentlayer에서 body.html로 HTML 문자열을 받아서 dangerouslySetInnerHTML로 렌더링하고 있었다. Velite로 교체하면서 s.mdx()를 사용했더니 post.body가 HTML 문자열이 아닌 아래와 같은 코드로 반환됐다.

```
"const{Fragment:n,jsx:e,jsxs:l}=arguments[0];function _createMdxContent(r){..."
```

`s.mdx()`는 마크다운을 컴파일된 JSX 함수 코드(문자열)로 변환한다. 이를 렌더링하려면 new Function(code)로 실행해서 React 컴포넌트로 만드는 별도 런타임이 필요하다. 반면 `s.markdown()`은 마크다운을 HTML 문자열로 변환해서 dangerouslySetInnerHTML로 바로 렌더링할 수 있다.

현재는 마크다운 안에 React 컴포넌트를 삽입할 계획이 없으므로 `s.markdown()`으로 변경했다. 나중에 포스팅에 인터랙티브 컴포넌트를 넣고 싶어지면 그때 `s.mdx()`로 전환할 예정이다.

```typescript
// velite.config.ts
    body: s.markdown(),
```

## 🚧 문제 발생 - 타입 에러

`velite.config.ts`를 설정하려고 보니 타입 에러가 발생했다.

```
Default export of the module has or is using private name 'ParseContext'.ts(4082)
Default export of the module has or is using private name 'RefinementCtx'.ts(4082)
```

Velite가 내부적으로 Zod를 사용하는데, Zod의 일부 내부 타입(ParseContext, RefinementCtx 등)을 외부로 re-export하지 않은 채 반환 타입에 포함시켰다.
TypeScript는 export된 변수의 타입을 완전히 서술할 수 있어야 하는데, 참조하는 타입이 private이라 서술이 불가능한 상황이었다.

`velite.config.ts`는 빌드 도구 설정 파일이라 TypeScript 컴파일 대상에서 제외해도 무방하다고 판단했다.
그래서 `tsconfig.json`의 exclude에 추가하고, 파일 상단에 `// @ts-nocheck`를 달아 VSCode에서도 타입 검사를 껐다.

실제 빌드(pnpm build)에서는 noEmit: true 설정 덕분에 이 에러가 발생하지 않는다.
VSCode의 TypeScript 서버가 자체적으로 타입 검사를 하면서 표시하는 것이기 때문에 `// @ts-nocheck` 추가!

### as any?

여기 근데 사실 `as any`를 통해서도 타입 에러를 없앨 수 있다.

```typescript
const config = {
  // ...
} as any;

export default defineConfig(config);
```

하지만 이렇게하면 post 타입 오염 문제가 발생한다.

defineConfig에 as any를 넘기면 Velite가 생성하는 `.velite/index.d.ts`의 타입 추론이 깨진다. 결과적으로 posts를 import해서 쓰는 모든 곳에서 타입이 any로 흘러내린다.
![use as any](/images/md/2026-02-27-2-process-md-file-as-data/as_any.png)

따라서 `tsconfig.json`의 exclude에 추가하고, 파일 상단에 `// @ts-nocheck`를 다는 방식으로 해결!

## + @ 작성 중인 md 필터링하기

마이그레이션 이후 작업물을 확인해보니 작성 중인 md들이 그대로 노출되는 것이 걸리적거렸다.
그래서 `published` 속성을 추가해 글 노출 여부를 제어했다.

- 프론트매터에서 published: true인 글만 블로그에 노출
- 모든 사용하는 곳에서 filter를 걸지 않고 한 곳에서만 처리
- published 필드가 없는 기존 글은 자동으로 비공개 처리

### velite.config.ts에선 안될까?

처음엔 그냥 블로그엔 비공개인 포스트는 노출할 필요가 전혀 없으니 `velite.config.ts`에서 필터링할 수 있는 방법을 찾아봤다.

그러나 현재 Velite는 빌드 타임 필터링을 공식적으로 지원하지 않았다.

그래서 entities 레이어에서 한 곳에서만 필터링하고 그 변수를 export해 사용하도록 구성했다.
FSD 구조에서 Post 도메인을 아는 코드는 `entities/post` 안에 있어야 한다.
published 필터링도 Post 도메인을 알아야 할 수 있으므로 여기에 위치시켰다.

```typescript
// entities/post/api/posts.ts
import { posts } from "#site/content";

export const publishedPosts = posts.filter((post) => post.published);
```

이렇게해야 앱 어디서든 posts 대신 publishedPosts를 import하면 필터 로직이 항상 적용된다. 필터 조건이 바뀌어도 이 파일 한 곳만 수정하면 된다.

#### velite.config.ts에 published 필드 추가

```typescript
schema: s
.object({
title: s.string(),
date: s.isodate(),
tags: s.array(s.string()).optional().default([]),
series: s.string().optional(),
slug: s.path(),
body: s.markdown(),
published: s.boolean().default(false), // 추가
})
.transform((data) => ({ ... }))
```

default(false)로 설정했기 때문에 기존 글에 published 필드가 없어도 자동으로 false로 처리된다.

### 빌드 레벨 차단

publishedPosts를 generateStaticParams에 연결하면 `published: false`인 글은 빌드 타임에 HTML 자체가 생성되지 않는다. URL로 직접 접근해도 404가 반환된다.

```typescript
// app/posts/[slug]/page.tsx
import { publishedPosts } from "@/entities/post/api/posts";

export async function generateStaticParams() {
  return publishedPosts.map((post) => ({ slug: post.slug }));
}

export default async function PostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = publishedPosts.find((p) => p.slug === params.slug);
  if (!post) notFound();
  // ...
}
```

앱 레벨 filter만으로도 UI에서 노출을 막을 수 있지만, generateStaticParams까지 연결하면 빌드 레벨에서도 차단된다. 실수로 비공개 글이 노출될 가능성이 없어진다!

## TIL

Velite가 Contentlayer보다 무조건 낫다고 할 수는 없다. 다만 현재 시점에서 유지보수되는 라이브러리를 선택하는 것은 중요하다. 기술 선택은 기능만큼이나 지속 가능성도 고려해야 한다.
