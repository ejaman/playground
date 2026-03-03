"use client";

import { useState, useEffect } from "react";
// import { ChevronDown } from "lucide-react";
import type { HeadingItem } from "../../../shared/lib/parseHeadingsFromHtml";

const variantClasses = {
  /** 좁은 화면: 상단 배치, 배경 + 접기/펼치기 */
  "sticky-top":
    "w-full bg-background/95 p-0 text-sm backdrop-blur supports-backdrop-filter:bg-background/80 xl:hidden",
  /** 넓은 화면: 우측 상단 고정 */
  "fixed-right":
    "fixed right-12 top-28 z-10 w-52 max-h-[calc(100vh-6rem)] border-l border-border  overflow-y-auto  pl-4 text-sm hidden xl:block",
} as const;

type TableOfContentsProps = {
  title?: string;
  headings: HeadingItem[];
  variant: keyof typeof variantClasses;
};

export function TableOfContents({
  title,
  headings,
  variant,
}: TableOfContentsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort(
            (a, b) =>
              (a.boundingClientRect.top ?? 0) - (b.boundingClientRect.top ?? 0),
          );
        const first = visible[0];
        if (first?.target?.id) setActiveId(first.target.id);
      },
      {
        rootMargin: "-80px 0px -70% 0px",
        threshold: 0,
      },
    );

    headings.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const listContent = (
    <ul className="space-y-1.5">
      {headings.map(({ id, text, level }) => {
        const isActive = id === activeId;
        return (
          <li
            key={id}
            style={{ paddingLeft: `${(level - 1) * 0.5}rem` }}
            className="truncate"
          >
            <a
              href={`#${id}`}
              onClick={(e) => handleClick(e, id)}
              className={`transition-colors hover:underline ${
                isActive
                  ? "font-semibold text-foreground text-[0.9375rem]"
                  : "text-muted-foreground hover:text-foreground text-sm"
              }`}
              aria-current={isActive ? "location" : undefined}
            >
              {text}
            </a>
          </li>
        );
      })}
    </ul>
  );

  if (variant === "sticky-top") {
    return (
      <nav aria-label="목차" className={variantClasses[variant]}>
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="flex w-full items-center justify-between px-4 py-3 text-left font-semibold text-foreground hover:bg-muted/50 rounded-t-lg transition-colors"
          aria-expanded={isOpen}
        >
          <span>목차</span>
          {/* <ChevronDown
            className="size-5 shrink-0 text-muted-foreground transition-transform"
            style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
            aria-hidden
          /> */}
        </button>
        {isOpen && (
          <div className="max-h-40 overflow-y-auto border-t border-border px-4 py-3">
            {listContent}
          </div>
        )}
      </nav>
    );
  }

  return (
    <nav aria-label="목차" className={variantClasses[variant]}>
      {listContent}
    </nav>
  );
}
