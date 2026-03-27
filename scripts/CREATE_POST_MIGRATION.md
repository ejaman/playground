# create-post 스크립트 마이그레이션 가이드

## 개요

`scripts/create-post.mjs`를 기존 **Anthropic REST API 직접 호출** 방식에서 **Claude Code SDK** 방식으로 전환했습니다.

---

## 변경 이유

기존 방식은 블로그 포스트 하나를 만들기 위해 Claude를 **최대 3번** 순차적으로 호출했습니다.

```
슬러그 생성 (한글일 때) → 초안 생성 → SEO 메타데이터 생성
```

각 호출이 독립적으로 이루어지다 보니 불필요한 오버헤드가 있었고, API 키도 직접 관리해야 했습니다.

---

## 무엇이 바뀌었나

### 제거된 것

| 항목 | 설명 |
|------|------|
| `callClaude()` 함수 | REST API를 직접 호출하던 공통 함수 |
| `import "dotenv/config"` | API 키 로딩 |
| `ANTHROPIC_API_KEY` 환경변수 의존 | `.env` 파일 관리 필요 없음 |
| 슬러그/초안/SEO 분리 호출 | 3번의 개별 API 호출 |
| `fs.writeFileSync()` 파일 생성 로직 | 에이전트가 직접 처리 |

### 추가된 것

| 항목 | 설명 |
|------|------|
| `import { query } from "@anthropic-ai/claude-code"` | Claude Code SDK |
| 단일 `query()` 호출 | 슬러그 + 초안 + SEO + 파일 생성을 한 번에 처리 |

---

## 장점

### 1. API 호출 횟수 감소

```
기존: 최대 3회 (슬러그 1회 + 초안 1회 + SEO 1회)
변경: 1회 (에이전트가 모든 작업을 한 세션에서 처리)
```

### 2. API 키 관리 불필요

기존에는 `.env` 파일에 `ANTHROPIC_API_KEY`를 직접 관리해야 했습니다.
Claude Code SDK는 `claude` CLI의 인증을 그대로 사용하므로 별도 키 설정이 필요 없습니다.

### 3. 코드 단순화

파일 생성, 중복 체크 등 직접 구현하던 로직을 에이전트 프롬프트로 위임해 코드량이 줄었습니다.

### 4. 에이전트 방식의 유연성

Claude Code 에이전트는 필요에 따라 파일을 읽고 쓰는 작업을 스스로 판단해서 처리합니다.
향후 기능 추가 시 프롬프트 수정만으로 동작을 확장할 수 있습니다.

---

## 사용 방법

### 사전 조건

1. **Claude Code CLI 설치 및 인증** — SDK가 내부적으로 `claude` CLI를 사용합니다.

```bash
# 설치 확인
claude --version

# 미설치 시
npm install -g @anthropic-ai/claude-code
```

2. **패키지 설치** — 프로젝트 루트에서 한 번만 실행합니다.

```bash
pnpm add @anthropic-ai/claude-code -w
```

### 실행

기존과 동일하게 프로젝트 루트에서 실행합니다.

```bash
pnpm create-post
```

### 실행 흐름

```
1. 시리즈 선택 (목록에서 선택 / 새로 생성 / 없음)
2. 게시글 제목 입력
3. 태그 입력 (쉼표 구분, 없으면 엔터)
4. 초안 생성 여부 선택 (y/n)
   └─ y: 슬러그 생성 + 초안 작성 + SEO 메타데이터 생성 + 파일 생성
   └─ n: 슬러그 생성 + 빈 본문으로 파일 생성
```

### 생성되는 파일

```
apps/blog/posts/{날짜}-{슬러그}.md
```

초안 생성 선택 시 frontmatter 예시:

```yaml
---
title: "게시글 제목"
date: "2026-03-27T00:00:00.000Z"
tags: ["tag1", "tag2"]
series: "series-key"
description: "SEO 설명"
ogTitle: "SNS 공유용 제목"
keywords: "키워드1, 키워드2"
published: false
---
```

---

## 파일 구조 변화

```
scripts/
├── create-post.mjs   ← 수정됨
└── model-list.mjs    ← 변경 없음
```

```
package.json          ← @anthropic-ai/claude-code 의존성 추가됨
```
