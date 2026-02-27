---
title: "1. 개인 블로그 시작"
date: "2026-02-26"
tags: ["playground", "architecture", "side-project"]
series: "playground"
published: true
---

# 플레이그라운드 만들기

와! 드디어 사이드 프로젝트를 시작했다.  
뻔하게 느껴질 수 있는 **블로그 만들기**지만, 창업할 것도 아닌데 아이디어 구상에 많은 시간을 허비하고 싶지 않았다.  
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
│   └── portfolio/      # (example) 포트폴리오 앱
└── packages/
    ├── eslint-config/
    ├── tailwind-config/
    ├── typescript-config/
    └── ui/
```

모로레포를 선택한 결정적 이유는 내가 생각한 플레이그라운드 플로젝트는 그냥 브로그 하나에 그치지 않는 확장성을 가진 프로젝트이기 때문었다.
현재는 `apps/blog`만 있지만 추후 포트폴리오, 다른 사이드 플젝 등 여러가지를 수용할 것을 전제로 구성하였다.

그래서 같은 이유로 packages/_에 ESLint, Tailwind, TypeScript 설정과 공통 UI를 분리했다.
디자이너가 없는 상태에서 여러 앱의 디자인을 하려면 통일된 디자인 시스템과 개발 컨벤션 공유가 필요했고 설정이 처음부터 중앙화되어 있어야 한다고 생각했기 때문이다.
그래서 나중에 포트폴리오 앱을 추가한다고 하면 `workspace:_`로 참조하는 것만으로 동일 환경을 보장할 수 있다.

또한 Turborepo의 태스크 캐싱도 중요 이유 중 하나였다.
`turbo run build`는 변경되지 않은 패키지의 결과를 캐싱해 재사용하기 떄문에 앱이 늘어도 빌드 시간이 선형적으로 증가하지 않는다.

## 2. 마크다운을 데이터로 처리하기

개인 블로그이기 때문에 글을 게시할 땐 별도의 글 작성 페이지가 존재하지 않고 md 파일로 글을 작성한다.
그럼 마크다운으로 작성된 포스트를 Next에서 사용하기 위한 작업이 필요했다.

Velite는 `posts/*.md`를 빌드 타임에 파싱해 타입이 있는 데이터로 변환해준다.

### 1. 스키마 기반 유효성 검사

: Zod로 정의한 스키마에 맞지 않는 프론트매터가 있다면 빌드 타임 에러 발생. 따라서 배포 전 데이터 오류를 잡을 수 있다

```typescript
// velite.config.ts
const posts = defineCollection({
  schema: s.object({
    title: s.string(),
    date: s.isodate(),
    tags: s.array(s.string()),
  }),
});
```

### 2. rehype/remark 파이프라인 통합

: shiki 코드 하이라이팅, rehype-slug로 제목 앵커 생성 등 마크다운 후처리를 설정 한 곳에서 관리할 수 있다.

### 3. 자동 타입 생성

.velite/ 디렉토리에 TypeScript 타입을 자동으로 생성해 별도 선언 없이 바로 사용할 수 있다.

```typescript
import { allPosts } from ".velite";

const post = allPosts.find((p) => p.slug === "my-post");
post.title; // string — 타입 자동 추론
post.date; // string
```

처음에는 contentlayer를 사용해서 마크다운을 데이터로 처리했지만 위와 같은 장점
＋
contentlayer의 깃헙을 보면 이슈와 pr이 장기간 방치되며 유지보수가 멈춘 상태임을 알 수 있었다.
그리고 Next 최신 버전 대응도 공식 지원이 아닌 커뮤니티 패치에 의존되고 있었다.

따라서 contentlayer ➡️ velite로 마이그레이션을 결정했다.
자세한 과정은 다음 글에 기록해보겠다.

## 3. FSD 구조

블로그 도메인은 복잡도가 낮기 때문에 FSD가 과한 선택으로 보일 수 있다.
그러나 오히려 간단한 도메인이기때문에 FSD 패턴을 체화할 수 있는 좋은 기회라고 생각해 적용하기로 했다.

---

# TODO - AI 활용 능력 키우기

지금은 script에서 번역 자동화 정도지만 추후

1. Github Actions에서 빌드 분석, 수정 제안을 PR 코멘트로 자동 게시하는 워크플로우를 구축
2. PPR, LightHouse 성능 자동화
   를 AI를 통해 구현하고 싶다

---

블로그로 시작하지만, 이 레포로 다양한 프로젝트를 실험해보고 싶다.

다음 글에서는 Turborepo 세팅 과정과 Vercel 배포에서 마주쳤던 경로 이슈를 구체적으로 다룰 예정이다.
