# DESIGN.md

## 1. 개요 및 디자인 철학: "The Monochromatic Manifesto"

이 포트폴리오는 기술 부채 없는 **지속 가능한 시스템 설계**를 지향하는 엔지니어의 가치관을 시각적으로 증명한다.

- **핵심 키워드**: 에디토리얼, Swiss Authority, 비대칭, Active Negative Space.
- **절대 규칙**: **모든 요소의 Corner Radius는 `0px`이다.** 단 1px의 곡선도 허용하지 않는다.

---

## 2. 컬러 시스템 (The Absolute Binary)

색상은 감정이 배제된 이진법적 구조로 정의하며, 오직 톤의 변화로만 계층을 구분한다.

### Primitives

- `pure-white`: `#FFFFFF` (Base Canvas)
- `pure-black`: `#000000` (Main Accent / Base Inverse)
- `neutral-100`: `#F9F9F9` (Subtle Surface Layering - 필요시)
- `neutral-800`: `#1B1B1B` (On-Surface Text - 완전한 검정이 아닌 가독성을 위한 검정)

### Semantics

- `surface/base`: `pure-white`
- `surface/inverse`: `pure-black` (Philosophy 섹션 전체 배경)
- `text/primary`: `neutral-800` (흰 배경 위 텍스트)
- `text/inverse`: `pure-white` (검은 배경 위 텍스트)
- `border/thin`: `pure-black` at 10% opacity (섹션/리스트 구분선)

---

## 3. 타이포그래피 (The Swiss Authority)

Inter(Bold)의 압도적인 권위와 JetBrains Mono(Technical)의 정밀함 사이의 대화를 구현한다.

### 폰트 패밀리

- **Inter**: Headlines, Display, Main Content (Bold/Strict)
- **JetBrains Mono**: Technical Metadata, Labels, Numbers (Precise)

### 위계 및 명세 (Estimated px from screenshot)

| Tailwind Class     | Font  | Weight | Size (Estimated) | Line Height | Letter Spacing | Case   | Usage                            |
| :----------------- | :---- | :----- | :--------------- | :---------- | :------------- | :----- | :------------------------------- |
| `text-huge`        | Inter | 700    | 160px            | 0.9         | -0.05em        | UP     | "JIM" Logo                       |
| `text-display-lg`  | Inter | 700    | 72px             | 1.1         | -0.04em        | UP     | Philosophy Main Title            |
| `text-headline-md` | Inter | 700    | 48px             | 1.2         | -0.02em        | UP     | Project/Article Titles (Archive) |
| `text-body-intro`  | Inter | 700    | 20px             | 1.6         | 0              | Normal | Hero Intro, Philosophy Body      |
| `text-body-base`   | Inter | 400    | 16px             | 1.6         | 0              | Normal | Detailed descriptions            |
| `text-label-sm`    | Mono  | 400    | 12px             | 1.4         | 0.1em          | UP     | Section Labels ("01 / HERETIC")  |
| `text-mono-base`   | Mono  | 400    | 14px             | 1.6         | 0              | Normal | Technical specifications text    |

---

## 4. 그리드 및 간격 (Active Negative Space)

모든 여백은 **8px 그리드 시스템**의 배수로 구성하며, 비대칭 배치를 통해 시선의 흐름을 유도한다.

| Variable     | Value | Usage                                |
| :----------- | :---- | :----------------------------------- |
| `spacing/xl` | 160px | 최상단/최하단 섹션Padding, 거대 여백 |
| `spacing/lg` | 96px  | 주요 섹션 간 간격 (Y-axis)           |
| `spacing/md` | 48px  | 컴포넌트 간 대단위 간격              |
| `spacing/sm` | 24px  | 리스트 아이템 내부, 본문 단락 간격   |
| `spacing/xs` | 12px  | 라벨과 제목 사이의 미세 간격         |

### 레이아웃 규칙 (Desktop)

- 전체 컨테이너 너비: 1600px 중앙 정렬 (매우 넓게)
- **Asymmetry**: Home/Hero 섹션에서 왼쪽 2/3는 DisplayText, 오른쪽 1/3은 IntroText 배치.
- **Horizontal Rule**: 섹션과 리스트 아이템 사이에는 오직 `1px`의 얇은 실선(`border/thin`)만 사용한다.

---

## 5. 컴포넌트 세부 명세 (Layout & Interaction)

### Header (CURATOR / NAVIGATION)

- `pure-white` 배경 고정 (Sticky).
- 좌측 로고, 우측 메뉴 링크 비대칭 배치. Spacing: `md` (48px).

### Home Section (JIM / SEARCH)

- "JIM": `text-huge`.
- **Search Bar**:
  - Border-radius: `0px`.
  - Border: `1px solid pure-black`.
  - 내부 Padding: `sm` (24px).
  - 자간 넓은 Mono 폰트 사용.
  - 호버/포커스 시: Border가 Electric Blue로 빛나거나 배경 반전 설계 (기능 구현 시).

### Philosophy Section (검은 배경)

- `surface/inverse` 전체 배경.
- 좌측: `text-display-lg` 타이틀.
- 우측: `text-body-intro` 본문 및 상세 스펙 배치.

### Archive Section (Projects)

- 세로 리스트 구조. Thin `border-variant`로 구분.
- **Interaction**: 호버 시 마우스 포인터 위치에 프로젝트 이미지가 작게 반전되어 프리뷰 되는 효과 설계 (CSS 호버 또는 JS).

---

> **[Claude Code 실행 지침]**
> 위 `apps/portfolio/DESIGN.md`를 프로젝트 폴더에 저장하고, 아까 준비하신 명령어를 실행하세요. Claude Code는 이 스펙을 읽고 피그마 데브 모드 없이도 시안과 거의 흡사한 흑백의 세련된 포트폴리오 뼈대를 잡아낼 것입니다.
