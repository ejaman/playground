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

function ArrowUpRight() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <line x1="3" y1="15" x2="15" y2="3" stroke="currentColor" strokeWidth="1.5" />
      <path d="M7 3H15V11" stroke="currentColor" strokeWidth="1.5" fill="none" />
    </svg>
  );
}

export function WritingSection() {
  return (
    <div>
      <p className="text-label-sm mb-md">03 / WRITTEN ARTIFACTS</p>
      <Line />
      <ul>
        {PLACEHOLDER_ARTICLES.map(({ date, title, description }) => (
          <li key={title}>
            <a
              href="#"
              className="-mx-sm flex items-start justify-between px-sm py-md hover:bg-neutral-100"
            >
              <div>
                <p className="text-label-sm mb-xs text-neutral-800/40">{date}</p>
                <h3 className="text-body-intro mb-xs">{title}</h3>
                <p className="text-body-base text-neutral-800/60">{description}</p>
              </div>
              <span className="mt-1 shrink-0">
                <ArrowUpRight />
              </span>
            </a>
            <Line />
          </li>
        ))}
      </ul>
    </div>
  );
}
