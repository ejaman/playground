import type { MetadataRoute } from "next";
import { BASE_URL } from "@/shared/lib/constants";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*", // 모든 크롤러 적용
      allow: "/", // 전체 허용
      disallow: "/api/", // API 라우트는 제외
    },
    sitemap: `${BASE_URL}/sitemap.xml`, // sitemap.xml 파일 위치
  };
}
