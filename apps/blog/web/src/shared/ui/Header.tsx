"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type ThemeMode = "auto" | "dark";

function applyTheme(mode: ThemeMode) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;

  if (mode === "dark") {
    root.dataset.theme = "dark";
  } else {
    delete root.dataset.theme;
  }
}

export function Header() {
  const [mode, setMode] = useState<ThemeMode>("auto");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved =
      (window.localStorage.getItem("theme-mode") as ThemeMode | null) ?? "auto";
    setMode(saved);
    applyTheme(saved);
  }, []);

  const toggleTheme = () => {
    const next: ThemeMode = mode === "dark" ? "auto" : "dark";
    setMode(next);

    if (typeof window !== "undefined") {
      if (next === "auto") {
        window.localStorage.removeItem("theme-mode");
      } else {
        window.localStorage.setItem("theme-mode", next);
      }
    }

    applyTheme(next);
  };

  return (
    <header className="border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex items-center justify-between gap-3 px-7 py-4">
        <Link
          href="/"
          className="text-sm font-semibold tracking-tight text-foreground sm:text-base"
        >
          Playground 🤾
        </Link>

        <div className="flex flex-1 items-center justify-end gap-3">
          <div className="w-40 sm:w-56">
            <label htmlFor="site-search" className="sr-only">
              검색
            </label>
            <input
              id="site-search"
              type="search"
              placeholder="게시물 검색..."
              className="w-full rounded-md border border-border bg-background px-3 py-1.5 text-sm text-foreground shadow-sm outline-none focus:ring-2 focus:ring-ring/60 focus:ring-offset-2"
            />
          </div>

          <button
            type="button"
            onClick={toggleTheme}
            className="inline-flex items-center rounded-full border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted/80 transition-colors"
          >
            {mode === "dark" ? "다크모드: 켜짐" : "다크모드: 자동"}
          </button>
        </div>
      </div>
    </header>
  );
}
