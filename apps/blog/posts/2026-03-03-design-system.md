---
title: "디자인 시스템 만들기"
date: "2026-03-03"
tags: ["design-system", "shadcn", "tailwind"]
series: "playground"
published: true
---

# 디자인 시스템 만들기

기능을 추가하려 보니 컴포넌트 디자인에 통일성이 걱정되었다. 컴포넌트가 늘어날수록 디자인을 통일적으로 유지하기 어려울텐데 🤔  
그래서 본격 개발 전 디자인 시스템을 잡기로 했다. 거창한 건 아니고 그냥 색상, 타이포그래피, 간격 등을 한 곳에서 정의하고 모든 컴포넌트가 그것을 참조하는 구조로 구상했다.

## 디자인 라이브러리 선택

다음은 컴포넌트 라이브러리를 고를 때 고려했던 후부 3가지다.

#### 1. MUI/Ant Design

완성형 라이브러리, 디자인이 이미 정해져 있기 때문에 커스터마이징 시 비용이 큼  
디자인 변경 시 코드량이 더 증가하는 불상사 발생

```tsx
//스타일을 커스터마이징하려면  sx prop이나 styled()를 써야 함
import Button from "@mui/material/Button";

<Button
  sx={{
    backgroundColor: "#3b82f6",
    borderRadius: "9999px",
    "&:hover": { backgroundColor: "#2563eb" },
  }}
>
  클릭
</Button>;
```

#### 2. Radix UI

headless 컴포넌트 라이브러리, 스타일 없이 기능만 제공함  
접근성이 좋고 유연하지만 스타일을 처음부터 직접 작성해야 함

```tsx
// 기능은 있는데 스타일이 없음
import * as Dialog from "@radix-ui/react-dialog";

<Dialog.Root>
  <Dialog.Trigger>열기</Dialog.Trigger>
  <Dialog.Portal>
    <Dialog.Overlay /> {/* 스타일 직접 작성 필요 */}
    <Dialog.Content>
      {/* 스타일 직접 작성 필요 */}
      내용
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>;
```

#### 3. shadcn/ui

Radix UI 기반 + Tailwind CSS로 스타일을 입힌 컴포넌트 모음집  
특징은 컴포넌트를 패키지로 설치하는 게 아니라 소스코드를 복사해오는 방식이라는 것  
컴포넌트가 내 플젝 안에 있기 때문에 자유롭게 수정 가능 + 불필요한 의존성이 없음

```tsx
import { cn } from "@/shared/lib/utils";

export function Button({ className, ...props }) {
  return (
    <button
      className={cn(
        "inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium",
        className,
      )}
      {...props}
    />
  );
}
```

최종 선택은 shadcn/ui!  
플레이그라운드의 목적성이 확장성있는 다양한 플젝 실험이기 때문에 정해진 스타일보단 자유롭게 제어할 수 있는 디자인을 선택하는 것이 좋다고 생각했다.

## 설치

[공식문서: shadcn Installation](https://ui.shadcn.com/docs/installation)

```bash
pnpm dlx shadcn@latest init
```

설치가 완료되면 `components.json`이 생성되는데 aliases가 velite 경로로 잡혀있어서 수정해줬다.

> `aliases`?  
> 컴포넌트를 추가할 때 파일을 어디에 만들고, import 경로를 어떻게 쓸지 정해주는 설정

```json
// 잘못 생성된 상태
"aliases": {
  "components": "#site/content/components",
  "utils": "#site/content/lib/utils"
}
```

shadcn CLI가 `tsconfig.json`의 경로에서 첫 번째 항목을 가져가 velite 경로로 지정된 것이었다.

```json
   "paths": {
      "#site/content": ["./.velite"],
      "@/*": ["./src/*"]
    },
```

그래서 그냥 간단히 수동으로 수정해줬다.

```json
// 수정 후
"aliases": {
  "components": "@/shared/ui",
  "utils": "@/shared/lib/utils",
  "ui": "@/shared/ui",
  "lib": "@/shared/lib",
  "hooks": "@/shared/hooks"
}
```

이제 예를 들어 `pnpm dlx shadcn@latest add button`을 실행하면 버튼 파일은 src/shared/ui/button.tsx에 생성!

## globals.css 구조 설계

shadcn init이 기존 globals.css에 변수를 추가했는데 문제가 발생했다.

1. 기존에는 data-theme="dark" 방식으로 다크모드를 구현했는데 shadcn은 .dark 클래스 방식을 사용

2. @theme 블록과 @theme inline 블록에서 같은 변수가 중복 정의

3. shadcn이 추가한 색상값이 oklch() 형식인데 기존 코드는 hex(두 형식 혼합)

> oklch란?
>
> - shadcn이 기본으로 사용하는 색상 형식으로 기존 hex나 rgb보다 지각적으로 균일한 색상 공간
> - oklch(밝기 채도 색조) 형태
>
> cssoklch(0.129 0.042 264.695) -> 어두운 남색 계열  
>  oklch(0.984 0.003 247.858) -> 거의 흰색  
>  장점은 밝기 값을 조정하면 색감이 자연스럽게 변한다는 것! 다만 직관적이지 않아서 hex로 통일하기로 했다.

### 최종 globals.css 구조

```css
css/_ 1. import _/
@import "tailwindcss";
@import "tw-animate-css";

/_ 2. 다크모드 방식 정의 _/
@custom-variant dark (&:where(.dark, .dark \*));

/_ 3. Tailwind 테마 변수 연결 _/
@theme inline {
--color-background: var(--background);
--color-foreground: var(--foreground);
/_ ... _/
}

/_ 4. 라이트 모드 변수 _/
:root {
--background: #ffffff;
--foreground: #0f172a;
/_ ... _/
}

/_ 5. 다크 모드 변수 _/
.dark {
--background: #020617;
--foreground: #f8fafc;
/_ ... _/
}
```

### `@custom-variant dark`

Tailwind의 dark: 접두사가 언제 동작할지 정의한다. .dark 클래스가 조상 요소에 있을 때 활성화된다.

```css
css@custom-variant dark (&:where(.dark, .dark _));
```

### `@theme inline`

CSS 변수를 Tailwind 색상 시스템에 등록하는 연결 고리다. 이게 있어야 bg-background, text-foreground 같은 유틸리티 클래스를 쓸 수 있다.

```css
css@theme inline {
  --color-background: var(--background);
}
```

inline 키워드가 중요하다. 없으면 Tailwind가 변수를 빌드 타임에 고정값으로 처리해버려서 다크모드 전환 시 색상이 바뀌지 않는다.

### `:root`와 `.dark`

```css
:root { --background: #ffffff; } /_ 기본값 _/
.dark { --background: #020617; } /\_ .dark 클래스가 있을 때 덮어씀 \*/
```

`html` 태그에 `.dark` 클래스가 붙으면 CSS 변수가 덮어써진다. Tailwind는 `@theme inline`을 통해 그 변수를 참조하므로 bg-background가 자동으로 바뀐다.

```
버튼 클릭
→ classList.add("dark") → <html class="dark">
→ .dark { --background: #020617 } 적용
→ @theme inline의 --color-background가 그 값 참조
→ bg-background 클래스가 #020617으로 렌더링
```

## 다크모드 처리

`globals.css`를 `.dark` 클래스 방식으로 바꿨으니 Header도 그에 맞춰 수정하자.

```typescript
// 변경 전 — data-theme 방식
root.dataset.theme = "dark"; // <html data-theme="dark">
delete root.dataset.theme;

// 변경 후 — .dark 클래스 방식
root.classList.add("dark"); // <html class="dark">
root.classList.remove("dark");
```

localStorage에 theme-mode를 저장해서 페이지 새로고침 후에도 유지되도록 했다. 근데 이건 깜빡임이 있어서 나중에 바꿔야 할 듯

## 컴포넌트 위치 기준(packages/ui? shared/ui?)

앞서 설정해둔 것을 보면 shadcn 컴포넌트는 src/shared/ui에 설치된다. 여기에는 도메인을 모르는 원자 컴포넌트만 위치한다.(Button, Card, Badge etc)

packages/ui는 여러 앱에서 공유하는 컴포넌트가 위치한다. 지금은 apps/blog만 있지만 나중에 apps/portfolio가 추가될 때 공통으로 쓸 컴포넌트는 여기서 관리한다.

![project overview](/images/md/2026-03-03-design-system/project_map.png)
폴더구조를 위해 프로젝트 UI 개요를 아주 간단하게 만들어 공통으로 사용할 UI를 따로 표시해 두었다.  
이걸 기준삼아 다음과 같이 구성했다.

```
packages/ui/
└── src/
    ├── button.tsx      # blog와 portfolio가 공유하는 Button
    └── profile.tsx     # 공통 프로필 UI

apps/blog/web/src/
└── shared/
    └── ui/
        ├── button.tsx  # shadcn이 설치한 Button (blog 전용 커스터마이징)
        └── Tag.tsx     # blog에서만 쓰는 태그 컴포넌트
```

shadcn 컴포넌트는 기본적으로 shared/ui에 설치하고, 나중에 여러 앱에서 쓰게 되면 그때 packages/ui로 올리는 방식으로 운영한다.

---

### 남은 작업

- PostCard, Tag 등 기존 컴포넌트의 하드코딩된 색상을 CSS 변수 기반으로 교체
- entities/series 레이어 추가 (SerieCard 컴포넌트)
- widgets 레이어에 Header 이동
- FSD 레이어 전체 정리
