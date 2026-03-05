import type { MetadataRoute } from "next";
import { publishedPosts } from "@/entities/post/lib/posts";
import { BASE_URL } from "@/shared/lib/constants";

export default function sitemap(): MetadataRoute.Sitemap {
  // 정적 페이지
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/blog/posts`,
      lastModified: new Date(),
      changeFrequency: "weekly", // 목록은 글이 추가될 때마다 바뀜
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/blog/series`,
      lastModified: new Date(),
      changeFrequency: "weekly", // 목록은 글이 추가될 때마다 바뀜
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/hub`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
  ];

  // 포스트 상세 페이지 (publishedPosts 기반으로 동적 생성)
  const postRoutes: MetadataRoute.Sitemap = publishedPosts.map((post) => ({
    url: `${BASE_URL}${post.url}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly", // 글은 한번 쓰면 잘 안 바뀜
    priority: 0.6, // 페이지 중요도
  }));

  return [...staticRoutes, ...postRoutes];
}
