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

const SERIES_PATH = "./apps/blog/series.json";
const POSTS_PATH = "./apps/blog/posts";

const seriesData = JSON.parse(fs.readFileSync(SERIES_PATH, "utf-8"));
const seriesKeys = Object.keys(seriesData);

console.log("\n📚 현재 등록된 시리즈 목록:");
seriesKeys.forEach((key, index) => {
  console.log(`${index + 1}. ${seriesData[key].title} (${key})`);
});
console.log("0. 시리즈 없음 (단발성 게시글)");

rl.question("\n시리즈 번호를 선택하세요: ", (answer) => {
  const selectedKey = answer === "0" ? null : seriesKeys[parseInt(answer) - 1];

  rl.question("게시글 제목을 입력하세요: ", async (title) => {
    console.log("🤖 AI가 슬러그를 생성 중입니다...");

    const date = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    let slug = "";

    // 한글 포함 여부 체크 (정규표현식)
    const hasKorean = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(title);

    if (hasKorean) {
      console.log("🤖 한글이 감지되어 AI가 영어 슬러그를 생성 중입니다...");
      const prompt = `Translate the following Korean blog title into a concise, URL-friendly English slug (lowercase, hyphens only): "${title}"`;
      try {
        const result = await model.generateContent(prompt);
        slug = result.response
          .text()
          .trim()
          .toLowerCase()
          .replace(/[^a-z0-9-]/g, "");
      } catch (e) {
        console.warn(
          "⚠️ AI 호출 실패(할당량 초과 등). 기본 슬러그를 생성합니다.",
        );
        console.error(e);
        // 한글 제목이라도 최소한의 파일명 생성
        slug = `post-${Date.now()}`;
      }
    } else {
      console.log("⚡ 영어 제목이므로 바로 슬러그를 생성합니다.");
      // 영문 제목은 바로 소문자 변경 및 공백을 하이픈으로 치환
      slug = title
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");
    }

    const fileName = `${date}-${slug}.md`;
    const fullPath = path.join(POSTS_PATH, fileName);

    const frontmatter = `---
title: "${title}"
date: "${date}"
tags: []
series: ${selectedKey ? `"${selectedKey}"` : "null"}
publish: false
---

# ${title}

여기에 내용을 작성하세요!
`;

    fs.writeFileSync(fullPath, frontmatter);
    console.log(`\n✅ 생성이 완료되었습니다: ${fullPath}`);
    rl.close();
  });
});
