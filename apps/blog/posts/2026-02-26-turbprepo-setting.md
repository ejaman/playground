---
title: "Turborepo로 블로그를 구성해보자"
date: "2026-02-26"
tags: ["turborepo", "monorepo", "pnpm", "vercel", "playground"]
series: "playground"
published: true
---

이번에는 모노레포 환경을 구성하며 고민했던 과정을 기록해 보려 한다.

## 왜 모노레포?

일단 처음부터 이 프로젝트는 높은 확장성을 목표로 했기때문에 모노레포를 고려하지 않을 수 없었다.
추후 `portfolio` 등 다른 프로젝트를 추가할 생각이었고 여러 앱이 동일한 디자인 시스템과 개발 컨벤션을 공유하게 만들고 싶었다.
설정이 분산되어 있으면 통일하는 비용이 크고 신경 쓸 부분이 많아지기 때문에 처음부터 중앙화해서 설계하고자 노력했다.

- 태스크 캐싱으로 빌드 시간 단축 가능
- 패키지 간 의존성과 실행 순서를 `turbo.json`으로 한 곳에서 명시적으로 관리할 수 있음

## 전체 구조

```
playground/
├── apps/
│   ├── blog/
│   │   ├── posts/          # 마크다운 원본
│   │   └── web/            # Next.js 블로그 앱
│   └── portfolio/          # (예정) 포트폴리오 앱
├── packages/
│   ├── eslint-config/      # 공유 ESLint 설정
│   ├── tailwind-config/    # 공유 Tailwind 설정
│   ├── typescript-config/  # 공유 TypeScript 설정
│   └── ui/                 # 공유 컴포넌트
├── scripts/                # 레포 단위 자동화 스크립트
├── turbo.json
├── pnpm-workspace.yaml
└── package.json
```

apps/*에는 실행 가능한 앱이, packages/*에는 여러 앱이 공유하는 설정과 컴포넌트가 위치한다.

## pnpm workspace 설정

```yaml
# pnpm-workspace.yaml
packages:
  - "apps/**"
  - "packages/**"
```

pnpm은 `package.json`의 `workspaces` 필드가 아닌 `pnpm-workspace.yaml`을 기준으로 워크스페이스를 인식한다. 루트 `package.json`에 `workspaces`를 함께 선언해도 pnpm은 이를 무시하기 때문에 `pnpm-workspace.yaml`이 반드시 있어야 한다.

각 패키지는 `workspace:*`로 참조한다.

```json
// apps/blog/web/package.json
{
  "dependencies": {
    "@repo/ui": "workspace:*",
    "@repo/eslint-config": "workspace:*"
  }
}
```

`workspace:*`는 로컬 패키지를 심볼릭 링크로 연결한다. 버전을 명시하지 않아도 항상 현재 워크스페이스의 최신 상태를 참조한다.

---

## turbo.json 파이프라인

```json
{
  "$schema": "https://turborepo.dev/schema.json",
  "ui": "tui",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "inputs": ["$TURBO_DEFAULT$", ".env*"],
      "outputs": [".next/**", "!.next/cache/**"]
    },
    "lint": {
      "dependsOn": ["^lint"]
    },
    "check-types": {
      "dependsOn": ["^check-types"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
```

`dependsOn`의 `^` 접두사가 핵심이다. `"^build"`는 "이 패키지가 의존하는 패키지들의 build가 먼저 완료되어야 한다"는 의미다. `apps/blog/web`이 `@repo/ui`에 의존하고 있다면, `@repo/ui`의 build가 끝난 후 `apps/blog/web`의 build가 시작된다.

`outputs`에 `.next/**`를 명시하면 Turborepo가 이 결과를 캐싱한다. 다음 빌드에서 입력(`inputs`)이 바뀌지 않았다면 캐시를 재사용해 빌드를 건너뛴다.

`dev`는 `cache: false`와 `persistent: true`를 설정했다. dev 서버는 캐싱할 수 없고, 프로세스가 계속 실행되어야 하기 때문이다.

---

## packages/ui 설계

### 네임스페이스 통일

`packages/*`의 이름을 변경하려다 그냥 원래 있던 `@repo/` 네임스페이스로 통일했다.

```
@repo/ui
@repo/eslint-config
@repo/tailwind-config
@repo/typescript-config
```

나중에 `apps/portfolio`가 추가될 때도 같은 네임스페이스로 참조할 수 있다.

### export 구조

`packages/ui/src/index.ts`에서 컴포넌트를 통합 export한다.

```typescript
// packages/ui/src/index.ts
export * from "./button";
export * from "./card";
export * from "./code";
```

`package.json`의 `exports` 필드로 외부에서 접근 가능한 경로를 명시한다.

```json
{
  "exports": {
    ".": "./src/index.ts",
    "./*": "./src/*.tsx"
  }
}
```

두 가지 방식을 함께 열어두었다.

`"."` — `import { Button } from "@repo/ui"` 처럼 패키지 루트에서 한 번에 가져올 때.

`"./*"` — `import { Button } from "@repo/ui/button"` 처럼 특정 컴포넌트만 가져올 때. Tree-shaking이 더 명확하게 동작한다.

### 외부 라이브러리는 실제 사용하는 앱에 설치한다

초기에 `date-fns`, `lucide-react`를 `packages/ui`의 의존성으로 관리했다.
➡️ "여러 앱에서 쓸 것 같으니 공통으로 올리자"

그러나 바로 문제가 발생했다.
첫째, Vercel 배포 시 `apps/blog/web`에서 `date-fns`를 찾지 못했다.

```
Module not found: Can't resolve 'date-fns'
```

`packages/ui`에 설치된 의존성이 `apps/blog/web`으로 자동 호이스팅되지 않아서 생긴 문제였다.

둘째, `packages/ui`의 `exports`가 컴포넌트 파일만 열어두고 있어서 외부 라이브러리를 re-export하는 구조가 아니었다. 또 re-export하려면 `packages/ui/src/index.ts`에 추가해 줘야한다.

`packages/ui`에는 직접 만든 공유 컴포넌트만 위치한다. pnpm은 같은 버전의 패키지를 중복 설치하지 않고 content-addressable store로 관리하기 때문에, 여러 앱에 같은 라이브러리를 설치해도 디스크 낭비가 없다.

그래서 결론적으로 외부 라이브러리는 실제로 사용하는 앱에 직접 설치하는 게 맞다고 판단했다.

---

## Vercel 배포 설정

모노레포를 Vercel에 배포할 때 Root Directory 설정이 중요하다.

**Root Directory를 `apps/blog/web`으로 설정하면** Vercel이 그 디렉토리만 보기 때문에 `packages/ui` 같은 워크스페이스 패키지를 찾지 못한다.

**Root Directory를 프로젝트 최상단으로 설정하면** `package.json`에 `next`가 없어서 Next.js 프로젝트로 인식하지 못한다.

해결책은 Root Directory는 `apps/blog/web`으로 유지하되, 빌드 명령을 루트에서 실행하도록 설정하는 것이다.

```
Root Directory: apps/blog/web
Build Command: cd ../../.. && pnpm turbo run build --filter=web
Install Command: cd ../../.. && pnpm install
Output Directory: .next
```

`cd ../../..`로 루트로 이동한 후 `turbo run build --filter=web`을 실행하면, pnpm이 전체 워크스페이스를 인식한 상태에서 `web` 앱만 빌드한다. `packages/ui`도 정상적으로 참조된다.

### vercel.json 설정

Vercel은 `vercel.json`이 있으면 대시보드 설정보다 우선 적용한다.

```json
{
  "buildCommand": "cd ../../.. && pnpm turbo run build --filter=web",
  "outputDirectory": ".next",
  "installCommand": "cd ../../.. && pnpm install",
  "framework": "nextjs"
}
```

설정을 `vercel.json` 한 곳에서 관리하면 프로젝트를 새로 연결할 때 대시보드를 다시 설정할 필요가 없다는 장점이 있다.
그리고 만약 다른 개발자와 함께하는 프로젝트라면 더욱 더 `vercel.json`에서 관리하는 게 좋겠죠!

---

## 개발 환경 pnpm dev

Velite로 마이그레이션 후 로컬 개발에서 md를 수정해도 화면에 반영되지 않는 문제가 있었다. 원인은 `next.config.ts`의 `build({ watch: true })`가 Turbopack 환경에서 제대로 동작하지 않기 때문이다.

Velite를 독립 프로세스로 분리해 실행하는 방식으로 해결했다. `concurrently`를 사용해 velite watch와 next dev를 하나의 명령으로 묶었다.

`apps/blog/web/package.json`의 `dev` 스크립트를 교체한다.

```json
{
  "scripts": {
    "dev": "concurrently \"velite build --watch\" \"next dev --turbopack --port 3000\""
  }
}
```

`next.config.ts`에서 watch 코드를 제거한다.

루트에서 `pnpm dev`를 실행하면 Turborepo가 `web`의 `dev` 태스크를 실행하고, `concurrently`가 Velite watch와 Next dev를 함께 시작한다. md를 수정하면 저장 후 새로고침만으로 바로 반영된다.

`packages/ui` 같은 공유 패키지는 별도 `dev` 태스크 없이 빌드된 결과물을 `workspace:*`로 참조하기 때문에, `web`의 `dev`만 실행해도 정상 동작한다.

---

## packages 활용성

아직은 `apps/blog` 하나만 있기 때문에 `packages/*`의 공유 효과가 체감되지 않는다.

오히려 `packages/ui`에 억지로 뭔가를 올리려 해서 위에서 겪은 `date-fns` 실수처럼 불필요한 복잡성이 생겼다. 지금은 `Button`, `Card` 같이 두 앱에서 쓸 것이 확실한 컴포넌트만 `packages/ui`에 두고 점차 활용성을 늘려보려 한다.

모노레포는 지금 당장의 편의보다 나중에 확장할 때의 기반을 위한 선택이니까!
