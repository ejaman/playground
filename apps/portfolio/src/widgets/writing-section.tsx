import { Line } from "@/shared/ui";

const PLACEHOLDER_ARTICLES = [
  {
    date: "2024.12.13",
    title: "PROJECT ARCHITECTURE: THE MONOLITH VS MICROSERVICES",
    description: "A technical deep-dive into scalable systems.",
  },
  {
    date: "2024.09.08",
    title: "BUILDING THE PORTFOLIO: A CURATORIAL APPROACH",
    description: "Rationalizing the aesthetic of digital archives.",
  },
  {
    date: "2024.08.21",
    title: "THE CASE FOR BOLD TYPOGRAPHY IN MODERN UI",
    description: "Why oversized text is the new functionalism.",
  },
] as const;

function ArrowRight() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <line x1="3" y1="9" x2="15" y2="9" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10 4L15 9L10 14" stroke="currentColor" strokeWidth="1.5" fill="none" />
    </svg>
  );
}

export function WritingSection() {
  return (
    <div>
      {/* Label — mobile: JOURNAL / desktop: 03 / WRITTEN ARTIFACTS */}
      <p className="text-label-sm mb-md">
        <span className="md:hidden">JOURNAL</span>
        <span className="hidden md:inline">03 / WRITTEN ARTIFACTS</span>
      </p>
      <Line />
      <ul>
        {PLACEHOLDER_ARTICLES.map(({ date, title, description }) => (
          <li key={title}>
            <a
              href="#"
              className="[margin-inline:-24px] flex items-center justify-between px-sm py-md hover:bg-neutral-100"
            >
              <div>
                <p className="text-label-sm mb-xs text-neutral-800/40">{date}</p>
                <h3 className="text-body-intro mb-xs">{title}</h3>
                <p className="text-body-base text-neutral-800/60">{description}</p>
              </div>
              <span className="ml-sm shrink-0">
                <ArrowRight />
              </span>
            </a>
            <Line />
          </li>
        ))}
      </ul>
    </div>
  );
}
