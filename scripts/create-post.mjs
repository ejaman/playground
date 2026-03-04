import fs from "fs";
import path from "path";
import readline from "readline";
import { GoogleGenerativeAI } from "@google/generative-ai";
import "dotenv/config";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

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
  // ─── 새 시리즈 생성 ───────────────────────────────────────────
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

const date = new Date().toISOString().split("T")[0];
let slug = "";

const hasKorean = /[ㄱ-ㅎㅏ-ㅣ가-힣]/.test(title);

if (hasKorean) {
  console.log("\n🤖 한글이 감지되어 AI가 영어 슬러그를 생성 중입니다...");
  const prompt = `Translate the following Korean blog title into a concise, URL-friendly English slug (lowercase, hyphens only): "${title}"`;
  try {
    const result = await model.generateContent(prompt);
    slug = result.response
      .text()
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "");
  } catch (e) {
    console.error("\n❌ AI 호출 실패 상세:");
    console.error("  message:", e?.message ?? String(e));
    if (e?.stack) console.error("  stack:", e.stack);
    if (e?.cause) console.error("  cause:", e.cause);
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

// ─── 파일 생성 ────────────────────────────────────────────────

const fileName = `${date}-${slug}.md`;
const fullPath = path.join(POSTS_PATH, fileName);

if (fs.existsSync(fullPath)) {
  console.error(`\n❌ 이미 존재하는 파일입니다: ${fullPath}`);
  rl.close();
  process.exit(1);
}

const tagsYaml =
  tags.length > 0 ? `[${tags.map((t) => `"${t}"`).join(", ")}]` : "[]";

const frontmatter = `---
title: "${title}"
date: "${date}"
tags: ${tagsYaml}${selectedKey ? `\nseries: "${selectedKey}"` : ""}
published: false
---

# ${title}

여기에 내용을 작성하세요!
`;

fs.writeFileSync(fullPath, frontmatter);
console.log(`\n✅ 생성이 완료되었습니다: ${fullPath}`);
rl.close();
