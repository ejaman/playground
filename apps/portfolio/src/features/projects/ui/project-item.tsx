"use client";

import { Line, Markdown } from "@/shared/ui";
import type { ProjectT } from "@/entities/project";

function ChevronDown({ open }: { open: boolean }) {
  return (
    <svg
      width="16"
      height="10"
      viewBox="0 0 16 10"
      fill="none"
      aria-hidden="true"
      style={{
        transform: open ? "rotate(180deg)" : "rotate(0deg)",
        transition: "transform 0.2s ease",
      }}
    >
      <path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

type Props = {
  project: ProjectT;
  isOpen: boolean;
  onToggle: () => void;
};

export function ProjectItem({ project, isOpen, onToggle }: Props) {
  const { id, title, category, description, year, tech, link } = project;

  return (
    <li>
      <button
        type="button"
        aria-expanded={isOpen}
        onClick={onToggle}
        className="[margin-inline:-24px] flex w-[calc(100%+48px)] cursor-pointer items-center justify-between px-sm py-md hover:bg-neutral-100"
      >
        <div className="flex items-baseline gap-sm">
          <span className="text-label-sm text-neutral-800/40">{id}</span>
          <span className="text-[24px] font-bold uppercase leading-tight tracking-[-0.02em]">
            {title}
          </span>
        </div>
        <div className="flex items-center gap-sm">
          <span className="hidden text-label-sm md:block">{category}</span>
          <ChevronDown open={isOpen} />
        </div>
      </button>

      {isOpen && (
        <div className="[margin-inline:-24px] border-t border-neutral-200 px-sm py-md">
          <Markdown>{description ?? ""}</Markdown>
          <div className="mt-lg border-t border-neutral-100 pt-md flex flex-wrap items-center gap-x-lg gap-y-sm">
            <span className="text-label-sm text-neutral-800/40">{year}</span>
            <div className="flex flex-wrap gap-xs">
              {tech.map((t) => (
                <span
                  key={t}
                  className="text-label-sm border border-neutral-300 px-xs py-0.5"
                >
                  {t}
                </span>
              ))}
            </div>
            {link && (
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-label-sm border-b border-pure-black pb-0.5"
              >
                VISIT →
              </a>
            )}
          </div>
        </div>
      )}

      <Line />
    </li>
  );
}
