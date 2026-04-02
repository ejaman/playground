"use client";

const NAV_ITEMS = [
  { label: "HOME", href: null },
  { label: "PROJECTS", href: "projects" },
  { label: "BLOG", href: "blog" },
  { label: "ABOUT", href: "about" },
] as const;

function handleNavClick(
  e: React.MouseEvent<HTMLAnchorElement>,
  href: string | null,
) {
  e.preventDefault();
  if (href === null) {
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }
  document.getElementById(href)?.scrollIntoView({ behavior: "smooth" });
}

export function NavLinks() {
  return (
    <nav className="hidden items-center gap-md md:flex" aria-label="주요 메뉴">
      {NAV_ITEMS.map(({ label, href }, i) => (
        <a
          key={label}
          href={href ? `#${href}` : "#"}
          onClick={(e) => handleNavClick(e, href)}
          className={`text-label-sm border-b border-transparent pb-0.5 hover:border-pure-black ${
            i === 0 ? "border-pure-black" : ""
          }`}
        >
          {label}
        </a>
      ))}
    </nav>
  );
}
