import { Container } from "@/shared/ui";
import { Line } from "@/shared/ui";

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-pure-white">
      <Container>
        <div className="flex items-center justify-between py-xs">
          <span className="text-label-sm font-bold tracking-[0.2em]">CURATOR</span>

          <nav className="hidden items-center gap-md md:flex">
            {(["HOME", "PROJECTS", "BLOG", "ABOUT"] as const).map((item, i) => (
              <a
                key={item}
                href={item === "HOME" ? "#" : `#${item.toLowerCase()}`}
                className={`text-label-sm transition-none hover:border-b hover:border-pure-black hover:pb-0.5 ${
                  i === 0 ? "border-b border-pure-black pb-0.5" : ""
                }`}
              >
                {item}
              </a>
            ))}
          </nav>

          <button
            aria-label="메뉴 열기"
            className="cursor-pointer p-1 hover:bg-pure-black hover:text-pure-white"
          >
            <svg
              width="22"
              height="14"
              viewBox="0 0 22 14"
              fill="none"
              aria-hidden="true"
            >
              <line x1="0" y1="1" x2="22" y2="1" stroke="currentColor" strokeWidth="1.5" />
              <line x1="0" y1="7" x2="22" y2="7" stroke="currentColor" strokeWidth="1.5" />
              <line x1="0" y1="13" x2="22" y2="13" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </button>
        </div>
      </Container>
      <Line />
    </header>
  );
}
