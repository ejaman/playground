import "dotenv/config";

async function listModels() {
  const API_KEY = process.env.GEMINI_API_KEY;
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error?.message || "모델 목록을 가져오지 못했습니다.",
      );
    }

    console.log("✅ 현재 내 키로 사용 가능한 모델 목록:", data);
    data.models.forEach((model) => {
      // 'generateContent'를 지원하는 모델만 출력
      if (model.supportedGenerationMethods.includes("generateContent")) {
        console.log(
          `* ${model.name.replace("models/", "")}: ${model.description}`,
        );
      }
    });
  } catch (error) {
    console.error("❌ 에러 발생:", error.message);
  }
}

listModels();
