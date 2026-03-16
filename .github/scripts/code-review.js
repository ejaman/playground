const fs = require("fs");
const { execSync } = require("child_process");

async function run() {
  const {
    GITHUB_TOKEN,
    GITHUB_REPOSITORY,
    GITHUB_PR_NUMBER,
    GITHUB_HEAD_REF,
    ANTHROPIC_API_KEY,
  } = process.env;

  // 1. diff 읽기 (워크플로우에서 이미 필터링 + 6000자 제한된 파일)
  const diff = fs.readFileSync("diff.txt", "utf8").trim();

  if (!diff) {
    console.log("리뷰할 코드 변경사항 없음, 스킵");
    return;
  }

  // 2. diff 크기에 따라 모델 분기 (토큰 절감)
  const model =
    diff.length > 3000
      ? "claude-sonnet-4-20250514" // 큰 변경은 Sonnet
      : "claude-haiku-4-5-20251001"; // 작은 변경은 Haiku

  console.log(`diff 크기: ${diff.length}자 → 모델: ${model}`);

  const systemPrompt = `Next.js + TypeScript 코드 리뷰어다.
아래 두 가지 섹션을 반드시 포함해 반환하라.

[REVIEW]
버그 가능성, 타입 오류, 성능 문제만 지적하라.
스타일·네이밍·주석은 무시하라.
지적사항은 최대 5개, 마크다운으로 작성하라.
문제없으면 "LGTM ✅" 한 줄만 작성하라.

[FIXES]
자동 수정 가능한 항목이 있으면 아래 JSON 배열 형식으로만 반환하라.
수정사항 없으면 빈 배열 []을 반환하라.
반드시 JSON만 반환하고 다른 텍스트는 포함하지 마라.

[
  {
    "file": "apps/blog/web/app/page.tsx",
    "search": "수정 전 코드 (파일에서 정확히 일치하는 문자열)",
    "replace": "수정 후 코드"
  }
]`;

  // 3. Claude API 호출
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model,
      max_tokens: 1024,
      system: systemPrompt,
      messages: [{ role: "user", content: `[diff]\n${diff}` }],
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    console.error("Claude API 호출 실패:", err);
    process.exit(1);
  }

  const aiData = await response.json();
  const fullResponse = aiData.content[0].text;

  // 4. [REVIEW] / [FIXES] 파싱
  const reviewMatch = fullResponse.match(/\[REVIEW\]([\s\S]*?)(?=\[FIXES\]|$)/);
  const fixesMatch = fullResponse.match(/\[FIXES\]([\s\S]*?)$/);

  const reviewContent = reviewMatch
    ? reviewMatch[1].trim()
    : fullResponse.trim();
  const fixesContent = fixesMatch ? fixesMatch[1].trim() : "NONE";

  // 5. PR 리뷰 코멘트 작성
  const comment = `### 🤖 Claude 코드 리뷰\n\n${reviewContent}`;

  await fetch(
    `https://api.github.com/repos/${GITHUB_REPOSITORY}/issues/${GITHUB_PR_NUMBER}/comments`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3+json",
      },
      body: JSON.stringify({ body: comment }),
    },
  );

  console.log("리뷰 코멘트 작성 완료");

  // 6. 자동 수정 커밋 (빈 배열이 아닐 때만)
  let fixes = [];
  try {
    // 코드블록 제거 후 파싱
    const cleanJson = fixesContent.replace(/```json\n?|\n?```/g, "").trim();
    fixes = JSON.parse(cleanJson);
  } catch {
    console.log("FIXES 파싱 실패, 스킵");
    console.log("FIXES 원본:", fixesContent);
    return;
  }

  if (!Array.isArray(fixes) || fixes.length === 0) {
    console.log("자동 수정 없음, 스킵");
    return;
  }

  // search/replace 방식으로 파일 직접 수정
  let fixedCount = 0;
  for (const fix of fixes) {
    try {
      const content = fs.readFileSync(fix.file, "utf8");
      if (!content.includes(fix.search)) {
        console.warn(`검색 문자열 없음, 스킵: ${fix.file}`);
        continue;
      }
      const updated = content.replace(fix.search, fix.replace);
      fs.writeFileSync(fix.file, updated);
      fixedCount++;
      console.log(`수정 완료: ${fix.file}`);
    } catch (err) {
      console.warn(`파일 수정 실패, 스킵: ${fix.file} - ${err.message}`);
    }
  }

  if (fixedCount === 0) {
    console.log("적용된 수정 없음, 스킵");
    return;
  }

  try {
    // claude 계정으로 커밋
    execSync('git config user.name "claude"');
    execSync('git config user.email "claude@anthropic.com"');
    execSync("git add -A");
    execSync('git commit -m "fix: auto-fix by Claude code review"');
    execSync(`git push origin ${GITHUB_HEAD_REF}`);

    console.log(`자동 수정 커밋 완료 (${fixedCount}개 파일)`);

    await fetch(
      `https://api.github.com/repos/${GITHUB_REPOSITORY}/issues/${GITHUB_PR_NUMBER}/comments`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3+json",
        },
        body: JSON.stringify({
          body: `🔧 ${fixedCount}개 항목을 자동 수정했어요.`,
        }),
      },
    );
  } catch (err) {
    console.warn("커밋 실패:", err.message);
  }
}

run().catch(console.error);
