---
title: "1. 개인 블로그 시작"
date: "2026-02-26"
tags: ["playground", "architecture", "side-project"]
series: "playground"
published: true
---

# 플레이그라운드 만들기

뻔하게 느껴질 수 있는 블로그 만들기지만, 창업할 것도 아닌데 아이디어 구상에 많은 시간을 허비하고 싶지 않았다.
그래서 블로그를 만들고 그 안에서 적용해보고 싶었던 기술과 아키텍처를 실험하는 공간으로 사용하려 한다.

# 아키텍처 개요

## 1. Turborepo 기반 모노레포

전체 프로젝트는 Turborepo 기반의 모노레포로 구성된다.

```
playground/
├── apps/
│   ├── blog/
│   │   ├── posts/      # 마크다운 원본
│   │   └── web/        # Next.js 블로그 앱
│   └── portfolio/      # (예정) 포트폴리오 앱
└── packages/
    ├── eslint-config/
    ├── tailwind-config/
    ├── typescript-config/
    └── ui/
```

모노레포를 선택한 결정적 이유는 이 프로젝트가 블로그 하나에 그치지 않는 확장성을 가진 프로젝트이기 때문이다.
현재는 `apps/blog`만 있지만 추후 포트폴리오, 다른 사이드 프로젝트 등 여러 앱을 수용할 것을 전제로 구성했다.

같은 이유로 `packages/*`에 ESLint, Tailwind, TypeScript 설정과 공통 UI를 분리했다.
디자이너 없이 여러 앱의 디자인을 일관되게 유지하려면 설정이 처음부터 중앙화되어 있어야 한다고 생각했다.
나중에 포트폴리오 앱을 추가할 때 `workspace:*`로 참조하는 것만으로 동일한 환경을 보장할 수 있다.

또한 `packages/ui`에는 컴포넌트뿐만 아니라 여러 앱에서 공통으로 사용할 의존성도 함께 관리한다.
현재 `date-fns`, `lucide-react`가 여기 포함되어 있다. 각 앱에서 따로 설치하면 버전 관리가 분산되기 때문에 `packages/ui`에서 한 곳에서 관리하도록 했다.

Turborepo의 태스크 캐싱도 중요한 이유 중 하나였다.
`turbo run build`는 변경되지 않은 패키지의 결과를 캐싱해 재사용하기 때문에 앱이 늘어도 빌드 시간이 선형적으로 증가하지 않는다.

## 2. 마크다운을 데이터로 처리하기

개인 블로그이기 때문에 글을 게시할 때 별도의 글 작성 페이지가 존재하지 않고 md 파일로 글을 작성한다.
마크다운으로 작성된 포스트를 Next.js에서 사용하기 위한 처리가 필요했고, **Velite**를 도입했다.

Velite는 `posts/*.md`를 빌드 타임에 파싱해 타입이 있는 데이터로 변환해준다.

### 1. 스키마 기반 유효성 검사

Zod로 정의한 스키마에 맞지 않는 프론트매터가 있다면 빌드 타임에 에러가 발생한다. 런타임이 아닌 배포 전에 데이터 오류를 잡을 수 있다.

```typescript
// velite.config.ts
const posts = defineCollection({
  schema: s.object({
    title: s.string(),
    date: s.isodate(),
    tags: s.array(s.string()),
    published: s.boolean().default(false),
  }),
});
```

### 2. rehype/remark 파이프라인 통합

Shiki 코드 하이라이팅, rehype-slug로 제목 앵커 생성 등 마크다운 후처리를 설정 한 곳에서 관리할 수 있다.

### 3. 자동 타입 생성

`.velite/` 디렉토리에 TypeScript 타입을 자동으로 생성해 별도 선언 없이 바로 사용할 수 있다.

```typescript
import { posts } from "#site/content";

const post = posts.find((p) => p.slug === "my-post");
post.title; // string — 타입 자동 추론
post.date; // string
```

처음에는 Contentlayer를 사용했지만 GitHub 저장소를 보니 이슈와 PR이 장기간 방치되며 유지보수가 멈춘 상태였다.
Next.js 최신 버전 대응도 공식 지원이 아닌 커뮤니티 패치에 의존하고 있었다.
자세한 마이그레이션 과정은 다음 글에서 다룬다.

## 4. published 필드로 빌드 레벨 노출 제어

Velite 스키마에 `published` 필드를 추가해 글 노출 여부를 빌드 타임에 제어한다.

```yaml
---
title: "발행할 글"
published: true # 이 필드가 없으면 default(false) 적용
---
```

`published: true`인 글만 `generateStaticParams`에 포함시키면, `false`인 글은 HTML 자체가 생성되지 않아 URL로 직접 접근해도 404가 반환된다.

```typescript
// entities/post/api/posts.ts
export const publishedPosts = posts.filter((post) => post.published);

// app/posts/[slug]/page.tsx
export async function generateStaticParams() {
  return publishedPosts.map((post) => ({ slug: post.slug }));
}
```

앱 레벨 필터만으로도 UI 노출을 막을 수 있지만, `generateStaticParams`까지 연결하면 빌드 레벨에서 완전히 차단할 수 있다.

## 3. FSD 구조

블로그 도메인은 복잡도가 낮기 때문에 FSD가 과한 선택으로 보일 수 있다.
그러나 오히려 간단한 도메인이기 때문에 FSD 패턴을 체화할 수 있는 좋은 기회라고 생각해 적용하기로 했다.

```
src/
├── shared/     # 도메인을 모르는 공통 유틸, UI
├── entities/   # post 엔티티 관련 UI·도메인
└── features/   # 공감하기 등 사용자 인터랙션 기능
```

의존 방향은 `shared → entities → features` 단방향으로 고정된다.

한 가지 판단 기준을 정해두었다. **Post 타입을 알고 있는 컴포넌트는 `packages/ui`로 올리지 않는다.** `PostCard`, `PostToc` 같은 컴포넌트는 Post 도메인을 알아야 동작하기 때문에 `entities/post/ui` 안에 있어야 한다. `packages/ui`에는 도메인과 무관한 `Button`, `Card` 같은 원자 컴포넌트만 위치한다.

이 경계를 지키면 나중에 `apps/portfolio`를 추가할 때 `packages/ui`를 그대로 가져다 쓸 수 있고, 블로그 도메인 코드가 딸려오지 않는다.

---

# TODO - AI 활용 능력 키우기

지금은 스크립트에서 슬러그·제목 자동화 정도지만 추후 다음을 AI를 통해 구현하고 싶다.

1. GitHub Actions에서 빌드 에러를 분석하고 수정 제안을 PR 코멘트로 자동 게시하는 워크플로우 구축
2. PPR + Lighthouse 성능 자동화로 수치 기반 성능 개선 기록
3. 마크다운 본문을 AI가 요약해 `description` 프론트매터를 자동 생성

---

블로그로 시작하지만, 이 레포로 다양한 프로젝트를 실험해보고 싶다.

다음 글에서는 Turborepo 세팅 과정과 Vercel 배포에서 마주쳤던 경로 이슈를 구체적으로 다룰 예정이다.
