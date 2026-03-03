// @ts-nocheck
import { defineCollection, defineConfig, s } from "velite";
import type { Options as RehypePrettyCodeOptions } from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeCodeTitles from "rehype-code-titles";
import rehypePrettyCode from "rehype-pretty-code";
import fs from "fs";
import path from "path";

const getSeriesTitle = (seriesKey: string): string => {
  try {
    const seriesPath = path.resolve(process.cwd(), "../../series.json");
    if (fs.existsSync(seriesPath)) {
      const seriesData = JSON.parse(fs.readFileSync(seriesPath, "utf-8"));
      return seriesData[seriesKey]?.title || seriesKey;
    }
  } catch {
    console.warn("⚠️ series.json 로드 실패, 기본 키를 사용합니다.");
  }
  return seriesKey;
};

const posts = defineCollection({
  name: "Post",
  pattern: "**/*.md",
  schema: s
    .object({
      title: s.string(),
      date: s.isodate(),
      tags: s.array(s.string()).optional().default([]),
      series: s.string().optional(),
      published: s.boolean().optional().default(false),
      slug: s.path(),
      body: s.markdown(),
    })
    .transform((data) => ({
      ...data,
      id: data.slug,
      url: `/posts/${data.slug}`,
      seriesTitle: data.series ? getSeriesTitle(data.series) : undefined,
    })),
});

const config = defineConfig({
  root: "../posts",
  output: {
    data: ".velite",
    assets: "public/static",
    base: "/static/",
    name: "[name]-[hash:8].[ext]",
    clean: true,
  },
  collections: { posts },
  markdown: {
    rehypePlugins: [
      rehypeSlug,
      [rehypeAutolinkHeadings, { properties: { className: ["anchor"] } }],
      rehypeCodeTitles,
      [
        rehypePrettyCode,
        {
          theme: "github-dark-dimmed",
          keepBackground: false,
        } as RehypePrettyCodeOptions,
      ],
    ],
  },
});

export default config;
