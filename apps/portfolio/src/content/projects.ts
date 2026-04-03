import type { ProjectT } from "@/entities/project";

/**
 * ✏️ 수정 필요: 실제 프로젝트로 교체하세요
 * id는 "001", "002" 형식으로 유지하면 에디토리얼 넘버링이 자동 적용됩니다.
 * description은 content/projects/{id}.md 파일에서 관리합니다.
 */

export const projects: ProjectT[] = [
  {
    id: "001",
    title: "NEXT.JS 마이그레이션",
    category: "LEGACY MODERNIZATION",
    year: "2025",
    tech: ["Next.js 16", "TypeScript", "TanStack Query", "Turborepo"],
    link: "https://unleashed-television-864.notion.site/327339b1f8a780cfaf09e45504e4a0d7?pvs=74",
  },
  {
    id: "002",
    title: "통계 시각화 라이브러리",
    category: "DATA VISUALIZATION",
    year: "2024 - 2025",
    tech: [
      "React",
      "TypeScript",
      "D3.js",
      "Redux Toolkit",
      "Styled-Components",
    ],
    link: "https://unleashed-television-864.notion.site/327339b1f8a7802e8886cb1d0a735a53?pvs=74",
  },
  {
    id: "003",
    title: "콘텐츠 뷰어",
    category: "CONTENT SYSTEM",
    year: "2024",
    tech: ["React", "TypeScript", "Zustand", "Vite", "Styled-Components"],
    link: "https://unleashed-television-864.notion.site/327339b1f8a78038897ae989d73a1019?pvs=74",
  },
];
