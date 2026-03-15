"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "./button";

type ThemeMode = "auto" | "dark";

function applyTheme(mode: ThemeMode) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;

  if (mode === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
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
          className="text-lg font-semibold tracking-tight text-foreground sm:text-xl"
        >
          Playground 🤾
        </Link>

        <nav className="flex flex-1 items-center justify-end gap-2 sm:gap-6">
          <div className="flex gap-1">
            <Button asChild variant="ghost" size="sm">
              <Link href="/blog">Blog</Link>
            </Button>
            <Button asChild variant="ghost" size="sm">
              <Link href="/hub">Hub</Link>
            </Button>
          </div>

          <Button
            type="button"
            onClick={toggleTheme}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            {mode === "dark" ? (
              <Moon className="size-4" aria-hidden />
            ) : (
              <Sun className="size-4" aria-hidden />
            )}
            <span className="hidden sm:inline">
              {mode === "dark" ? "다크: 켜짐" : "다크: 자동"}
            </span>
          </Button>
        </nav>
      </div>
    </header>
  );
}
