import type { ArticleT } from "@/entities/article";

export const articles: ArticleT[] = [
  {
    date: "2026.04",
    title: "CLAUDE CODE로 포트폴리오 만들기",
    description: "AI와 함께 포트폴리오를 설계하고 구현한 과정의 기록.",
    link: null, // 작성 후 추가
  },
  {
    date: "2025.11",
    title: "NEXT.JS 16 마이그레이션 회고",
    description: "JSP 레거시를 Next.js로 전환하며 마주한 문제들과 해결 과정.",
    link: "https://velog.io/@ejaman/series/%ED%9A%8C%EA%B3%A01Next16",
  },
  {
    date: "2026.02",
    title: "TURBOREPO로 블로그 모노레포 구성하기",
    description: "확장성을 위해 Turborepo 기반 모노레포를 직접 설계한 경험.",
    link: "https://velog.io/@ejaman/Turborepo%EB%A1%9C-%EB%B8%94%EB%A1%9C%EA%B7%B8%EB%A5%BC-%EA%B5%AC%EC%84%B1%ED%95%B4%EB%B3%B4%EC%9E%90",
  },
];
