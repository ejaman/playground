import { Container, Line } from "@/shared/ui";

const NAV_ITEMS = ["HOME", "PROJECTS", "BLOG", "ABOUT"] as const;

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5" />
      <line x1="13.5" y1="13.5" x2="17" y2="17" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function HamburgerIcon() {
  return (
    <svg width="22" height="14" viewBox="0 0 22 14" fill="none" aria-hidden="true">
      <line x1="0" y1="1" x2="22" y2="1" stroke="currentColor" strokeWidth="1.5" />
      <line x1="0" y1="7" x2="22" y2="7" stroke="currentColor" strokeWidth="1.5" />
      <line x1="0" y1="13" x2="22" y2="13" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-pure-white">
      <Container>
        <div className="flex items-center justify-between py-xs">
          {/* Mobile: [JIM] 박스 로고 / Desktop: CURATOR 텍스트 */}
          <div>
            <span className="hidden text-label-sm font-bold tracking-[0.2em] md:block">
              CURATOR
            </span>
            <span className="border border-pure-black px-xs py-1 text-label-sm font-bold md:hidden">
              [JIM]
            </span>
          </div>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-md md:flex" aria-label="주요 메뉴">
            {NAV_ITEMS.map((item, i) => (
              <a
                key={item}
                href={item === "HOME" ? "#" : `#${item.toLowerCase()}`}
                className={`text-label-sm hover:border-b hover:border-pure-black hover:pb-0.5 ${
                  i === 0 ? "border-b border-pure-black pb-0.5" : ""
                }`}
              >
                {item}
              </a>
            ))}
          </nav>

          {/* Right icons */}
          <div className="flex items-center gap-sm">
            {/* Mobile only: search icon */}
            <button
              aria-label="검색"
              className="cursor-pointer hover:bg-pure-black hover:text-pure-white p-1 md:hidden"
            >
              <SearchIcon />
            </button>
            {/* Hamburger (both) */}
            <button
              aria-label="메뉴 열기"
              className="cursor-pointer hover:bg-pure-black hover:text-pure-white p-1"
            >
              <HamburgerIcon />
            </button>
          </div>
        </div>
      </Container>
      <Line />
    </header>
  );
}
