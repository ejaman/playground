import fs from "node:fs";
import path from "node:path";
import type { ProjectT } from "@/entities/project";
import { projects } from "../projects";

const dir = path.join(process.cwd(), "src/content/projects");

function readDescription(id: string): string {
  const filePath = path.join(dir, `${id}.md`);
  try {
    return fs.readFileSync(filePath, "utf-8").trim();
  } catch {
    return "";
  }
}

export function loadProjects(): (ProjectT & { description: string })[] {
  return projects.map((project) => ({
    ...project,
    description: readDescription(project.id),
  }));
}
