import { query } from "@anthropic-ai/claude-code";
import fs from "fs";
import path from "path";
import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (prompt) =>
  new Promise((resolve) => rl.question(prompt, resolve));

const SERIES_PATH = "./apps/blog/series.json";
const POSTS_PATH = "./apps/blog/posts";

// ─── 시리즈 선택 ───────────────────────────────────────────────

const seriesData = JSON.parse(fs.readFileSync(SERIES_PATH, "utf-8"));
const seriesKeys = Object.keys(seriesData);

console.log("\n📚 현재 등록된 시리즈 목록:");
seriesKeys.forEach((key, index) => {
  console.log(`  ${index + 1}. ${seriesData[key].title} (${key})`);
});
console.log("  0. 시리즈 없음 (단발성 게시글)");
console.log("  N. 새 시리즈 만들기");

const seriesAnswer = await question("\n시리즈 번호를 선택하세요: ");

let selectedKey = null;

if (seriesAnswer.toUpperCase() === "N") {
  const newKey = await question("시리즈 키를 입력하세요 (영문, 하이픈 허용): ");
  const newTitle = await question("시리즈 제목을 입력하세요: ");
  const newDescription = await question("시리즈 설명을 입력하세요: ");

  if (!/^[a-z0-9-]+$/.test(newKey)) {
    console.error("❌ 시리즈 키는 영문 소문자, 숫자, 하이픈만 허용됩니다.");
    rl.close();
    process.exit(1);
  }
  if (seriesData[newKey]) {
    console.error(`❌ 이미 존재하는 시리즈 키입니다: ${newKey}`);
    rl.close();
    process.exit(1);
  }

  seriesData[newKey] = { title: newTitle, description: newDescription };
  fs.writeFileSync(SERIES_PATH, JSON.stringify(seriesData, null, 2));
  console.log(`\n✅ 새 시리즈가 등록되었습니다: ${newTitle} (${newKey})`);
  selectedKey = newKey;
} else if (seriesAnswer === "0") {
  selectedKey = null;
} else {
  const index = parseInt(seriesAnswer) - 1;
  if (isNaN(index) || index < 0 || index >= seriesKeys.length) {
    console.error("❌ 올바른 번호를 입력해주세요.");
    rl.close();
    process.exit(1);
  }
  selectedKey = seriesKeys[index];
}

// ─── 제목 입력 ────────────────────────────────────────────────

const title = await question("\n게시글 제목을 입력하세요: ");

// ─── 태그 입력 ────────────────────────────────────────────────

const tagsInput = await question(
  "태그를 입력하세요 (쉼표로 구분, 없으면 엔터): ",
);
const tags = tagsInput
  .split(",")
  .map((t) => t.trim())
  .filter(Boolean);

// ─── 초안 생성 여부 확인 ──────────────────────────────────────

const draftAnswer = await question(
  "\n✍️  AI가 포스트 초안을 생성할까요? (y/n): ",
);
const generateDraft = draftAnswer.trim().toLowerCase() === "y";

rl.close();

// ─── Claude Code 에이전트로 나머지 전부 처리 ─────────────────
// 기존: callClaude() 를 최대 3번 호출 (슬러그 → 초안 → SEO)
// 변경: query() 를 1번 호출해 에이전트가 모든 작업을 처리

const now = new Date();
const dateISO = now.toISOString();
const datePart = dateISO.split("T")[0];
const hasKorean = /[ㄱ-ㅎㅏ-ㅣ가-힣]/.test(title);

const tagsYaml =
  tags.length > 0 ? `[${tags.map((t) => `"${t}"`).join(", ")}]` : "[]";

const prompt = `
블로그 포스트 MD 파일을 다음 순서로 생성해줘.

## 입력 정보
- 제목: "${title}"
- 날짜: "${dateISO}"
- 태그: ${tags.length > 0 ? tags.join(", ") : "없음"}
- 시리즈: ${selectedKey ? `${seriesData[selectedKey].title} (key: ${selectedKey})` : "없음"}
- 초안 생성: ${generateDraft ? "예" : "아니오"}

## 단계 1 — 슬러그 결정
${
  hasKorean
    ? `제목이 한글이므로 영어로 번역 후 소문자+하이픈 슬러그로 변환해줘.
예) "게시글 만들기" → "create-post"`
    : `제목을 소문자+하이픈 슬러그로 변환해줘.
예) "My Blog Post" → "my-blog-post"`
}

## 단계 2 — 파일 생성
경로: ${POSTS_PATH}/${datePart}-{슬러그}.md

frontmatter 형식:
\`\`\`
---
title: "${title}"
date: "${dateISO}"
tags: ${tagsYaml}${selectedKey ? `\nseries: "${selectedKey}"` : ""}${
  generateDraft
    ? `\ndescription: "{80자 이내 한국어 SEO 설명}"\nogTitle: "{클릭 유도형 한국어 제목}"\nkeywords: "{한국어 키워드, 5개 이내}"`
    : ""
}
published: false
---
\`\`\`

## 단계 3 — 본문
${
  generateDraft
    ? `마크다운 초안을 작성해줘.
- 구조: 도입 → 배경/문제 → 본론(## 헤딩으로 나눈 2~3개 섹션) → 마무리
- 실제 내용 대신 뼈대와 TODO 주석만 작성 (작성자가 직접 채울 수 있게)
- frontmatter의 description, ogTitle, keywords는 본문 내용 기반으로 채워줘`
    : `본문은 "여기에 내용을 작성하세요!" 한 줄만 넣어줘.`
}

파일이 이미 존재하면 오류로 알려줘. 완료 후 생성된 파일의 전체 경로를 알려줘.
`;

console.log("\n🤖 Claude Code가 파일을 생성 중입니다...\n");

try {
  for await (const event of query({
    prompt,
    options: {
      maxTurns: 10,
      cwd: process.cwd(),
    },
  })) {
    if (event.type === "result") {
      console.log(event.result ?? "✅ 완료");
    }
  }
} catch (e) {
  console.error("\n❌ 오류 발생:", e?.message ?? String(e));
  process.exit(1);
}
