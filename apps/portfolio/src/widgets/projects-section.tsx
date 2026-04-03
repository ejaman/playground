import { Container, Line } from "@/shared/ui";
import { loadProjects } from "@/content/projects/loader";
import { ProjectList } from "@/features/projects";

export function ProjectsSection() {
  const projects = loadProjects();

  return (
    <section aria-label="Selected Archives" className="py-md" id="projects">
      <Container>
        <div className="mb-lg">
          <div className="flex items-end justify-between md:hidden">
            <div>
              <p className="text-label-sm text-neutral-800/40">
                SELECTED WORKS
              </p>
              <p className="text-headline-md">ARCHIVE</p>
            </div>
            <a
              href="#"
              className="text-label-sm border-b border-pure-black pb-0.5"
            >
              VIEW ALL ({projects.length})
            </a>
          </div>
        </div>
        <Line />
        <ProjectList projects={projects} />
      </Container>
    </section>
  );
}
