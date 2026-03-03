## ✍️ 내가 헷갈려서 작성하는 블로그 글 작성 가이드

블로그 구조는 velog를 참고함
블로그는 전체 | 시리즈 탭으로 구성됨
사용자는 전체 글을 생성 순으로 보거나 아니면 시리즈 탭에서 시리즈 별로 볼 수 있음


### 1. Ground Rules
- 모든 글은 `apps/blog/posts` 하위에 위치한다.
- 파일명 규칙: `YYYY-MM-DD-slug.md` (예: `2026-02-24-turborepo-setup.md`)
- 이미지는 포스트와 동일한 경로에 폴더를 만들어 관리한다.

### 2. 시리즈 관리
시리즈 중복 생성을 막기 위해 모든 시리즈를 `serise.json`에서 중앙 관리하도록 한다.
새로운 시리즈를 만들 때는 반드시 이 파일에 먼저 등록해야 한다.
- 관리 파일: apps/blog/posts/series.json

파일 구조 예시
```
{
  "monorepo-study": { "title": "모노레포 정복기", "description": "터보레포와 pnpm 학습 기록" }
}
```


### 3. 필수 메타데이터 (Frontmatter)
모든 마크다운 상단에는 아래 형식을 반드시 포함해야 한다.
---
title: "제목"
date: "YYYY-MM-DD"
tags: ["태그1", "태그2"]
series: "시리즈명" (선택)
---
단 시리즈의 값이 있다면 그 값은 `serise.json` 키 값과 일치해야 한다.


### 4. Workflow
- 직접 파일을 만들지 않고 pnpm new-post 명령어를 사용
- GitHub Actions가 series.json에 없는 값이 들어오거나 필수 필드가 누락되면 배포를 차단
- main 브랜치 병합 시 Vercel을 통해 자동 배포