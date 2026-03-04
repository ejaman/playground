---
title: "컴포넌트 네이밍 컨벤션(Feat, MacOS 대소문자 이슈)"
date: "2026-03-04"
tags: ["macOS", "convention"]
series: "playground"
published: true
---

# 컴포넌트 네이밍 컨벤션(MacOS 대소문자 이슈)

# 코드 컨벤션

## 파일 네이밍 규칙

### 컴포넌트 파일

**shadcn 컴포넌트 — 소문자 (kebab-case)**

shadcn CLI가 생성하는 파일은 소문자로 유지한다.

```
src/shared/ui/button.tsx
src/shared/ui/card.tsx
src/shared/ui/tabs.tsx
src/shared/ui/dropdown-menu.tsx
```

shadcn 컴포넌트라는 걸 한눈에 알 수 있고, "기본적으로 수정하지 않는 파일"이라는 신호가 된다.

**커스텀 컴포넌트 — PascalCase**

직접 만든 컴포넌트는 PascalCase로 작성한다.

```
src/shared/ui/Header.tsx
src/shared/ui/Tag.tsx
src/entities/post/ui/PostCard.tsx
src/entities/post/ui/PostBody.tsx
src/entities/series/ui/SerieCard.tsx
```

**왜 다른 규칙을 쓰는가**

두 규칙이 혼재하는 게 불편해 보일 수 있지만, 오히려 파일만 봐도 출처를 구분할 수 있다는 장점이 있다.

```
shared/ui/
├── button.tsx       # shadcn — 건드리지 않는 게 기본
├── card.tsx         # shadcn — 건드리지 않는 게 기본
├── Header.tsx       # 커스텀 — 자유롭게 수정 가능
└── Tag.tsx          # 커스텀 — 자유롭게 수정 가능
```

### 주의 — macOS 대소문자 이슈

macOS 파일 시스템(APFS)은 기본적으로 대소문자를 구분하지 않는다. `button.tsx`를 `Button.tsx`로 바꿔도 Git과 TypeScript가 변경을 감지하지 못할 수 있다.

파일명 대소문자를 변경할 때는 중간 이름을 거쳐야 한다.

```bash
# ❌ 이렇게 하면 변경이 안 잡힘
mv button.tsx Button.tsx

# ✅ 중간 이름을 거쳐야 함
mv button.tsx button_temp.tsx
mv button_temp.tsx Button.tsx
```

shadcn 컴포넌트는 소문자로 유지하고, 커스텀 컴포넌트는 처음부터 PascalCase로 만들면 이 문제를 피할 수 있다.

---

## 컴포넌트 작성 규칙

### Props 인터페이스

props는 반드시 `interface`로 정의한다. 컴포넌트 파일 상단, import 아래에 위치한다.

```tsx
// ✅ 올바른 방식
interface PostCardProps {
  title: string;
  date: string;
  tags: string[];
  seriesTitle?: string; // 선택 props는 ? 사용
}

export function PostCard({ title, date, tags, seriesTitle }: PostCardProps) {
  // ...
}
```

```tsx
// ❌ 인라인 타입 정의 — 재사용 불가
export function PostCard({ title, date }: { title: string; date: string }) {
  // ...
}
```

**`packages/ui` 컴포넌트는 interface를 export한다.**

여러 앱에서 해당 타입을 참조할 수 있도록 인터페이스를 함께 export한다.

```tsx
// packages/ui/src/profile.tsx
export interface ProfileProps {   // export 필수
  image: string;
  description: string;
  socials?: SocialLink[];
  skills?: string[];
  className?: string;
}

export function Profile({ ... }: ProfileProps) {
  // ...
}
```

### export 방식

**named export를 기본으로 사용한다.**

```tsx
// ✅ named export
export function PostCard() { ... }
export function PostHeader() { ... }

// ❌ default export — import 시 이름이 달라질 수 있음
export default function PostCard() { ... }
```

예외적으로 Next.js의 `page.tsx`, `layout.tsx`는 프레임워크 요구사항에 따라 default export를 사용한다.

```tsx
// app/blog/posts/page.tsx — Next.js 규칙상 default export
export default function PostsPage() { ... }
```

### className prop

`packages/ui` 컴포넌트는 반드시 `className` prop을 받는다. 여러 앱에서 레이아웃에 맞게 외부 스타일을 추가할 수 있어야 한다.

```tsx
// ✅ className prop 포함
export function Profile({ className, ...props }: ProfileProps) {
  return (
    <div className={cn("flex gap-4", className)}>
      ...
    </div>
  );
}

// 사용 시 — 앱마다 다른 스타일 추가 가능
<Profile className="border-b pb-6" ... />          // blog
<Profile className="py-12 max-w-2xl mx-auto" ... /> // portfolio
```

`apps/blog/web` 내부 컴포넌트는 `className` prop이 필수는 아니지만, 재사용 가능성이 있는 컴포넌트라면 추가하는 걸 권장한다.

### cn() 유틸 함수

조건부 클래스나 외부 className 병합 시 반드시 `cn()`을 사용한다.

```tsx
import { cn } from "@/shared/lib/utils";

// ✅ cn() 사용
<div className={cn("flex gap-4", isActive && "bg-muted", className)}>

// ❌ 문자열 직접 병합 — 클래스 충돌 해결 안 됨
<div className={`flex gap-4 ${className}`}>
```
