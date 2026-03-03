# FSD (Feature-Sliced Design) 구조

- **app** – 앱 초기화, 전역 스타일, 프로바이더
- **shared** – 공통 UI, 유틸, 비즈니스 무관 (`assets/fonts` 등 정적 자산 포함)
- **entities** – 비즈니스 엔티티 (예: post)
- **features** – 사용자 시나리오/액션 (예: 공감하기, 검색)
- **widgets** – 여러 features/entities를 조합한 블록

라우트: `/` (홈), `/blog`, `/blog/posts/[slug]`, `/hub`, `/portfolio`
