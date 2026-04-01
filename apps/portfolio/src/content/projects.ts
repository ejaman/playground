import type { ProjectT } from "@/entities/project";

/**
 * ✏️ 수정 필요: 실제 프로젝트로 교체하세요
 * id는 "001", "002" 형식으로 유지하면 에디토리얼 넘버링이 자동 적용됩니다.
 */
export const projects: ProjectT[] = [
  {
    id: "001",
    title: "PROJECT ALPHA",
    category: "SYSTEM DESIGN",
    description: "프로젝트 설명을 입력하세요.",
    year: "2024",
    tech: ["Next.js", "TypeScript", "Postgres"],
    link: null,
  },
  {
    id: "002",
    title: "PROJECT BETA",
    category: "AI ARCHITECTURE",
    description: "프로젝트 설명을 입력하세요.",
    year: "2023",
    tech: ["Python", "FastAPI", "Redis"],
    link: null,
  },
  {
    id: "003",
    title: "PROJECT GAMMA",
    category: "ECOMMERCE INFRA",
    description: "프로젝트 설명을 입력하세요.",
    year: "2023",
    tech: ["React", "Node.js", "AWS"],
    link: null,
  },
];
