// contentlayer.config.ts
import { defineDocumentType, makeSource } from "contentlayer/source-files";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
var getSeriesTitle = (seriesKey) => {
  const seriesPath = path.resolve(__dirname, "../series.json");
  if (!fs.existsSync(seriesPath)) {
    console.warn(`\u26A0\uFE0F \uD30C\uC77C\uC744 \uBABB \uCC3E\uC558\uC5B4\uC694. \uC2DC\uB3C4\uD55C \uACBD\uB85C: ${seriesPath}`);
    return seriesKey;
  }
  const seriesData = JSON.parse(fs.readFileSync(seriesPath, "utf-8"));
  return seriesData[seriesKey]?.title || seriesKey;
};
var Post = defineDocumentType(() => ({
  name: "Post",
  filePathPattern: `**/*.md`,
  // 마크다운 파일 대상
  fields: {
    title: { type: "string", required: true },
    date: { type: "date", required: true },
    tags: { type: "list", of: { type: "string" } },
    series: { type: "string" }
    // series.json의 key값
  },
  computedFields: {
    url: {
      type: "string",
      resolve: (post) => `/posts/${post._raw.flattenedPath}`
    },
    // 시리즈 key를 실제 화면에 표시할 제목으로 변환
    seriesTitle: {
      type: "string",
      resolve: (post) => post.series ? getSeriesTitle(post.series) : null
    }
  }
}));
var sourceConfig = makeSource({
  contentDirPath: "../posts",
  documentTypes: [Post]
});
var contentlayer_config_default = sourceConfig;
export {
  Post,
  contentlayer_config_default as default
};
//# sourceMappingURL=compiled-contentlayer-config-DDFMO5NG.mjs.map
