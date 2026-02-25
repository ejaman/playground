import { nextJsConfig } from "@repo/eslint-config/next-js";
import tailwindV4 from "eslint-plugin-tailwind-v4";

/** @type {import("eslint").Linter.Config[]} */
export default [
  ...nextJsConfig,
  {
    plugins: { "tailwind-v4": tailwindV4 },
    rules: {
      // Tailwind v4: @theme 기준으로 정의된 클래스만 허용, 오타/미정의 클래스 린트 시 에러
      "tailwind-v4/no-undefined-classes": [
        "error",
        { cssFile: "src/shared/styles/globals.css" },
      ],
    },
  },
];
