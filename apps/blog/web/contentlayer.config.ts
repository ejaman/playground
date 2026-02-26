import { defineDocumentType, makeSource } from "contentlayer/source-files";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeCodeTitles from "rehype-code-titles";
import rehypePrettyCode from "rehype-pretty-code";

const getSeriesTitle = (seriesKey: string) => {
  try {
    // ESM 환경에서 가장 확실한 경로 계산
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const seriesPath = path.resolve(__dirname, "../series.json");

    if (fs.existsSync(seriesPath)) {
      const seriesData = JSON.parse(fs.readFileSync(seriesPath, "utf-8"));
      return seriesData[seriesKey]?.title || seriesKey;
    }
  } catch (error) {
    console.warn("⚠️ 빌드 중 series.json 로드 실패, 기본 키를 사용합니다.");
  }
  return seriesKey; // 에러가 나더라도 빌드가 멈추지 않게 key를 반환
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
  markdown: {
    // rehype와 contentlayer의 unified/vfile 버전 차이로 타입 단언 필요
    rehypePlugins: [
      rehypeSlug,
      [rehypeAutolinkHeadings, { properties: { className: ["anchor"] } }],
      rehypeCodeTitles,
      [
        rehypePrettyCode,
        {
          theme: "github-dark-dimmed",
          keepBackground: false,
        },
      ],
    ] as any,
  },
});

export default sourceConfig;
