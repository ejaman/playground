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
아래 두 가지를 반환하라.

[REVIEW]
버그 가능성, 타입 오류, 성능 문제만 지적하라.
스타일·네이밍·주석은 무시하라.
지적사항은 최대 5개, 마크다운으로 작성하라.
문제없으면 "LGTM ✅" 한 줄만 작성하라.

[FIXES]
자동 수정 가능한 항목만 unified diff 형식으로 작성하라.
수정사항 없으면 "NONE"을 작성하라.

반드시 [REVIEW]와 [FIXES] 두 섹션을 모두 포함하라.`;

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
      max_tokens: 512,
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

  // 6. 자동 수정 커밋 (NONE이 아닐 때만)
  if (fixesContent === "NONE" || !fixesContent) {
    console.log("자동 수정 없음, 스킵");
    return;
  }

  try {
    // diff 파일로 저장 후 apply
    fs.writeFileSync("claude-fixes.patch", fixesContent);
    execSync("git apply --check claude-fixes.patch", { stdio: "pipe" });
    execSync("git apply claude-fixes.patch");

    // claude 계정으로 커밋
    execSync('git config user.name "claude"');
    execSync('git config user.email "claude@anthropic.com"');
    execSync("git add -A");
    execSync('git commit -m "fix: auto-fix by Claude code review"');
    execSync(`git push origin ${GITHUB_HEAD_REF}`);

    console.log("자동 수정 커밋 완료");

    // 수정 완료 코멘트 추가
    await fetch(
      `https://api.github.com/repos/${GITHUB_REPOSITORY}/issues/${GITHUB_PR_NUMBER}/comments`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3+json",
        },
        body: JSON.stringify({
          body: "🔧 자동 수정 가능한 항목을 커밋했어요.",
        }),
      },
    );
  } catch (err) {
    // patch 적용 실패는 무시 (리뷰 코멘트는 이미 달렸으므로)
    console.warn("자동 수정 patch 적용 실패 (무시):", err.message);
  }
}

run().catch(console.error);
