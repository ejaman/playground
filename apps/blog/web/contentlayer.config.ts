import { defineDocumentType, makeSource } from "contentlayer/source-files";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// 현재 파일의 URL을 경로로 변환하고, 폴더 경로만 추출합니다.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// series.json에서 제목 정보를 가져오는 헬퍼 함수
const getSeriesTitle = (seriesKey: string) => {
  const seriesPath = path.resolve(__dirname, "../series.json");

  if (!fs.existsSync(seriesPath)) {
    // 파일이 진짜 어디 있는지 확인하기 위한 디버깅용 로그
    console.warn(`⚠️ 파일을 못 찾았어요. 시도한 경로: ${seriesPath}`);
    return seriesKey;
  }

  const seriesData = JSON.parse(fs.readFileSync(seriesPath, "utf-8"));
  return seriesData[seriesKey]?.title || seriesKey;
};

export const Post = defineDocumentType(() => ({
  name: "Post",
  filePathPattern: `**/*.md`, // 마크다운 파일 대상
  fields: {
    title: { type: "string", required: true },
    date: { type: "date", required: true },
    tags: { type: "list", of: { type: "string" } },
    series: { type: "string" }, // series.json의 key값
  },
  computedFields: {
    url: {
      type: "string",
      resolve: (post) => `/posts/${post._raw.flattenedPath}`,
    },
    // 시리즈 key를 실제 화면에 표시할 제목으로 변환
    seriesTitle: {
      type: "string",
      resolve: (post) => (post.series ? getSeriesTitle(post.series) : null),
    },
  },
}));

const sourceConfig: ReturnType<typeof makeSource> = makeSource({
  contentDirPath: "../posts",
  documentTypes: [Post],
});

export default sourceConfig;
