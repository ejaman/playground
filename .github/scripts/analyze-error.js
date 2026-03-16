const fs = require("fs");

async function run() {
  const {
    GITHUB_TOKEN,
    GITHUB_REPOSITORY,
    GITHUB_PR_NUMBER,
    ANTHROPIC_API_KEY,
  } = process.env;

  // 마지막 1500자만 추출 (3000자 → 절반으로 입력 토큰 절감)
  const errorLog = fs.readFileSync("error.log", "utf8").slice(-1500);

  // 시스템 프롬프트 압축 (장황한 설명 제거)
  const systemPrompt = `너는 10년 차 프론트엔드 DevOps 엔지니어다. GitHub Actions CI 에러 로그를 분석해 근본 원인을 3줄 이내로 요약하고, 수정 코드나 명령어를 마크다운으로 제시하라. 인사 생략.`;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001", // 단순 분석엔 Haiku로 충분, Sonnet 대비 약 10배 저렴
      max_tokens: 512, // 요약 + 코드 스니펫에 512면 충분
      system: systemPrompt,
      messages: [{ role: "user", content: `[에러 로그]\n${errorLog}` }],
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    console.error("Claude API 호출 실패:", err);
    process.exit(1);
  }

  const aiData = await response.json();
  const aiComment = aiData.content[0].text;

  await fetch(
    `https://api.github.com/repos/${GITHUB_REPOSITORY}/issues/${GITHUB_PR_NUMBER}/comments`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3+json",
      },
      body: JSON.stringify({
        body: `### 🤖 Claude CI 에러 분석 리포트\n\n${aiComment}`,
      }),
    },
  );
}

run().catch(console.error);
