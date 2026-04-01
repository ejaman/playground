import { Container, Line } from "@/shared/ui";

const PLACEHOLDER_PROJECTS = [
  { id: "001", title: "QUANTUM OS", category: "SYSTEM DESIGN" },
  { id: "002", title: "NEURAL GRID", category: "AI ARCHITECTURE" },
  { id: "003", title: "SILICON VESTIGE", category: "ECOMMERCE INFRA" },
] as const;

function ChevronDown() {
  return (
    <svg width="16" height="10" viewBox="0 0 16 10" fill="none" aria-hidden="true">
      <path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export function ProjectsSection() {
  return (
    <section aria-label="Selected Archives" className="py-lg" id="projects">
      <Container>
        <div className="mb-lg flex items-center justify-between">
          <p className="text-label-sm">02 / SELECTED ARCHIVES</p>
          <p className="text-label-sm text-neutral-800/40">
            SELECT TO EXPAND TECHNICAL SUMMARY
          </p>
        </div>

        <Line />

        <ul>
          {PLACEHOLDER_PROJECTS.map(({ id, title, category }) => (
            <li key={id}>
              {/* TODO(Phase 4): accordion expand on click */}
              <div className="[margin-inline:-24px] flex cursor-pointer items-center justify-between px-sm py-md hover:bg-neutral-100">
                <div className="flex items-baseline gap-sm">
                  <span className="text-label-sm text-neutral-800/40">{id}</span>
                  <span className="text-headline-md">{title}</span>
                </div>
                <div className="flex items-center gap-sm">
                  <span className="text-label-sm">{category}</span>
                  <ChevronDown />
                </div>
              </div>
              <Line />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
