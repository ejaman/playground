"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/shared";

const tabs = [
  {
    label: "포스트",
    href: "/blog",
  },
  {
    label: "시리즈",
    href: "/blog/series",
  },
];

export function TabLine() {
  const pathname = usePathname();

  return (
    <div className="text-xs font-medium">
      <div className="flex w-full p-[3px]">
        {tabs.map((tab) => (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "text-base inline-flex h-[40px] flex-1 items-center justify-center gap-1.5 border-2 border-transparent p-3 text-foreground/60 whitespace-nowrap text-center",
              pathname === tab.href
                ? "text-point font-bold border-0 border-b-2 border-point"
                : "text-muted-foreground hover:text-foreground border-b-2 border-transparent",
            )}
          >
            {tab.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
