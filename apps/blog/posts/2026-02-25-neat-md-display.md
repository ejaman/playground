---
title: "깔끔하게 md 보여주기"
date: "2026-02-25"
tags: []
series: "playground"
---

# 깔끔하게 md 보여주기

md 파일을 위한 라이브러리 설치

```
# 스타일 및 가독성 (Tailwind 기반)
pnpm add -D @tailwindcss/typography

# 코드 하이라이팅 및 마크다운 강화 (Contentlayer 연동)
pnpm add rehype-prism-plus rehype-code-titles rehype-slug rehype-autolink-headings
```

# FSD 계층 구조

Shared: 프로젝트 전체에서 공통으로 쓰는 것 (UI 컴포넌트, 유틸리티, 스타일).

Entities: 비즈니스 실체 (예: Post, User). 데이터 구조와 관련된 최소 단위.

Features: 사용자가 행하는 구체적인 행동 (예: SearchPost, LikePost).

Widgets: 여러 Entity와 Feature를 조합한 완성형 UI 조각 (예: PostCard, Header).

Pages: 최종적인 페이지 단위.

Processes (선택): 여러 페이지에 걸친 복잡한 로직.

App: 전역 설정 (Providers, Global Styles).

# 디자인 시스템 만들기

1. shadcn/ui + Radix UI 조합 (강력 추천)
   현재 프론트엔드 생태계에서 가장 핫한 방식입니다.

이유: 라이브러리를 통째로 설치하는 게 아니라 코드를 내 프로젝트로 가져오는 방식이라, 나중에 FSD 구조에 맞춰 src/shared/ui 폴더에 넣고 관리하기가 매우 편합니다.

장점: 접근성(Accessibility)이 완벽하게 구현된 Radix UI 기반이라, 지민님은 스타일(Tailwind)만 조금씩 수정하면 됩니다.

Step 1: 기본 토큰(Tokens) 정의
tailwind.config.ts 파일에 지민님만의 규칙을 먼저 박아두세요. 이것만 해도 디자인의 80%는 통일됩니다.

Color Palette: 메인 브랜드 컬러(Primary), 배경(Background), 텍스트(Foreground), 포인트 컬러(Accent) 딱 4가지만 정하세요.

Typography: 제목용 폰트와 본문용 폰트를 구분하고, prose 클래스와 연동합니다.

Step 2: FSD 구조에 디자인 시스템 배치
디자인 시스템은 FSD의 Shared 레이어에 위치해야 합니다.

src/shared/ui: 버튼, 입력창, 카드 등 최소 단위 컴포넌트 (shadcn 컴포넌트들이 여기 들어갑니다)

src/shared/lib: 스타일 관련 유틸리티 함수 (cn 함수 등)

src/shared/styles: 전역 CSS (globals.css)

Step 3: Tailwind Typography (prose) 커스터마이징
마크다운 상세 페이지의 스타일을 프로젝트 전체와 맞추기 위해 tailwind.config.ts에서 typography 테마를 수정합니다.

```
// tailwind.config.ts 예시
theme: {
  extend: {
    typography: {
      DEFAULT: {
        css: {
          'code::before': { content: '""' }, // 백틱 제거 등 커스텀
          'code::after': { content: '""' },
        },
      },
    },
  },
}
```

3. 디자이너 없는 지민님을 위한 꿀팁
   컬러 팔레트 추출: 직접 정하기 힘들다면 Raycast나 Coolors 같은 사이트에서 'Technical', 'Minimal' 키워드로 검색해 보세요.

아이콘 시스템: lucide-react를 추천합니다. 디자인이 깔끔하고 shadcn/ui와 찰떡궁합입니다.

폰트 선택: 기술 블로그라면 본문 가독성이 최우선입니다. Pretendard나 구글의 Geist 폰트를 추천해요.

# 트러블슈팅

## 폰트 적용이 안됨

시도한 과정 (정상)
설계: 전역 폰트 시스템 구축 및 FSD 레이어 준수.

구현: shared에서 폰트 선언, globals.css에서 Tailwind v4 @theme 연동, layout.tsx 주입.

2. 문제 발생 및 원인 분석 (핵심)
   현상: variable 방식 사용 시 폰트 미적용(Apple SD Gothic 노출).

기술적 원인 (The "Why"):

컴파일 시점 차이: Tailwind v4 엔진은 빌드 타임에 CSS를 처리하는데, Next.js의 variable은 브라우저에서 실행될 때(Runtime) 클래스에 주입됩니다. v4 엔진이 "아직 존재하지 않는" 변수(var(--pretendard))를 테마로 미리 확정 짓지 못해 발생한 동기화 실패입니다.

우선순위 역전: 스크린샷에서 보셨던 '취소선'은 브라우저가 해당 변수를 찾지 못해 기본 시스템 폰트로 회귀(Fallback)했음을 의미합니다.

3. 해결 및 결론
   해결: fonts.pretendard.className 사용.

이유: className 방식은 Next.js가 폰트 스타일을 인라인 CSS 클래스로 직접 생성하여 DOM에 박아버립니다. 이는 Tailwind 엔진이나 변수 상속 여부와 관계없이 브라우저가 읽는 즉시 적용되는 가장 강력하고 확실한 방식입니다.
