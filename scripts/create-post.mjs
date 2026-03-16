import fs from "fs";
import path from "path";
import readline from "readline";
import "dotenv/config";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (prompt) =>
  new Promise((resolve) => rl.question(prompt, resolve));

const SERIES_PATH = "./apps/blog/series.json";
const POSTS_PATH = "./apps/blog/posts";

// ─── Claude API 공통 호출 함수 ────────────────────────────────

async function callClaude({ model, max_tokens, system, prompt }) {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model,
      max_tokens,
      ...(system && { system }),
      messages: [{ role: "user", content: prompt }],
    }),
  });
  if (!response.ok) throw new Error(`API 오류: ${response.status}`);
  const data = await response.json();
  return data.content[0].text.trim();
}

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

// ─── 슬러그 생성 ──────────────────────────────────────────────

const now = new Date();
const datePart = now.toISOString().split("T")[0];
const dateISO = now.toISOString();
let slug = "";

const hasKorean = /[ㄱ-ㅎㅏ-ㅣ가-힣]/.test(title);

if (hasKorean) {
  console.log("\n🤖 한글이 감지되어 AI가 영어 슬러그를 생성 중입니다...");
  try {
    const raw = await callClaude({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 20,
      prompt: `Translate to English, return ONLY the translation, no explanation: "${title}"`,
    });
    // "게시글 만들기" → "create post"
    slug = raw
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
    // → "create-post"
  } catch (e) {
    console.error("\n❌ AI 호출 실패:", e?.message ?? String(e));
    console.warn("⚠️ 기본 슬러그로 생성합니다.");
    slug = `post-${Date.now()}`;
  }
} else {
  console.log("\n⚡ 영어 제목이므로 바로 슬러그를 생성합니다.");
  slug = title
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

// ─── 초안 생성 여부 확인 ──────────────────────────────────────

const draftAnswer = await question(
  "\n✍️  AI가 포스트 초안을 생성할까요? (y/n): ",
);
const generateDraft = draftAnswer.trim().toLowerCase() === "y";

let draftContent = "여기에 내용을 작성하세요!";
let seoMeta = { description: "", ogTitle: "", keywords: "" };

if (generateDraft) {
  // ─── 초안 생성 ──────────────────────────────────────────────
  console.log("\n📝 포스트 초안을 생성 중입니다...");
  try {
    const tagsContext = tags.length > 0 ? `태그: ${tags.join(", ")}` : "";
    const seriesContext = selectedKey
      ? `시리즈: ${seriesData[selectedKey].title}`
      : "";

    draftContent = await callClaude({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      system: `너는 프론트엔드 개발자를 위한 기술 블로그 글쓰기 도우미다.
마크다운 형식으로 포스트 초안을 작성하라.
frontmatter는 제외하고 본문만 작성하라.
구조는 다음을 따르라: 도입 → 배경/문제 → 본론(섹션 2~3개) → 마무리
각 섹션은 ## 헤딩으로 구분하고 내용은 간략한 설명과 TODO 주석으로 채워라.
실제 내용은 작성자가 채울 수 있도록 뼈대만 잡아라.`,
      prompt: `제목: ${title}
${tagsContext}
${seriesContext}

위 정보를 바탕으로 포스트 초안을 작성해줘.`,
    });

    console.log("✅ 초안 생성 완료");

    // ─── SEO 메타데이터 생성 ──────────────────────────────────
    console.log("🔍 SEO 메타데이터를 생성 중입니다...");
    try {
      const seoRaw = await callClaude({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 200,
        system: `SEO 메타데이터를 JSON으로만 반환하라. 다른 텍스트는 절대 포함하지 마라.
형식: {"description": "...", "ogTitle": "...", "keywords": "..."}
- description: 검색 결과에 표시될 설명 (80자 이내, 한국어)
- ogTitle: SNS 공유 시 표시될 제목 (원제목보다 클릭을 유도하는 형태, 한국어)
- keywords: 쉼표로 구분된 검색 키워드 (5개 이내, 한국어)`,
        prompt: `제목: ${title}
${tagsContext}
초안 내용: ${draftContent.slice(0, 500)}`,
      });

      const cleanJson = seoRaw.replace(/```json\n?|\n?```/g, "").trim();
      seoMeta = JSON.parse(cleanJson);
      console.log("✅ SEO 메타데이터 생성 완료");
    } catch (e) {
      console.warn("⚠️ SEO 메타데이터 생성 실패, 빈 값으로 진행합니다.");
    }
  } catch (e) {
    console.error("\n❌ 초안 생성 실패:", e?.message ?? String(e));
    console.warn("⚠️ 빈 초안으로 진행합니다.");
  }
}

// ─── 파일 생성 ────────────────────────────────────────────────

const fileName = `${datePart}-${slug}.md`;
const fullPath = path.join(POSTS_PATH, fileName);

if (fs.existsSync(fullPath)) {
  console.error(`\n❌ 이미 존재하는 파일입니다: ${fullPath}`);
  rl.close();
  process.exit(1);
}

const tagsYaml =
  tags.length > 0 ? `[${tags.map((t) => `"${t}"`).join(", ")}]` : "[]";

const seoFields = generateDraft
  ? `
description: "${seoMeta.description}"
ogTitle: "${seoMeta.ogTitle}"
keywords: "${seoMeta.keywords}"`
  : "";

const frontmatter = `---
title: "${title}"
date: "${dateISO}"
tags: ${tagsYaml}${selectedKey ? `\nseries: "${selectedKey}"` : ""}${seoFields}
published: false
---

${draftContent}
`;

fs.writeFileSync(fullPath, frontmatter);
console.log(`\n✅ 생성이 완료되었습니다: ${fullPath}`);
rl.close();
