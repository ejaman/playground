import { Container, Line } from "@/shared/ui";
import { profile } from "@/content";
import { NavLinks } from "./nav-links";

function SearchIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5" />
      <line
        x1="13.5"
        y1="13.5"
        x2="17"
        y2="17"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-pure-white">
      <Container>
        <div className="flex items-center justify-between py-xs">
          <div>
            <span className="hidden text-label-sm font-bold tracking-[0.2em] md:block">
              {profile.brandName}
            </span>
            <span className="border border-pure-black px-xs py-1 text-label-sm font-bold md:hidden">
              [{profile.monogram}]
            </span>
          </div>

          <NavLinks />
        </div>
      </Container>
      <Line />
    </header>
  );
}
