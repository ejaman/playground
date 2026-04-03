"use client";

import { useState } from "react";
import type { ProjectT } from "@/entities/project";
import { ProjectItem } from "./project-item";

export function ProjectList({ projects }: { projects: ProjectT[] }) {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <ul>
      {projects.map((project) => (
        <ProjectItem
          key={project.id}
          project={project}
          isOpen={openId === project.id}
          onToggle={() => setOpenId(openId === project.id ? null : project.id)}
        />
      ))}
    </ul>
  );
}
