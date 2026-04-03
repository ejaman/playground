import { Container, Line } from "@/shared/ui";
import { profile } from "@/content";
import { NavLinks } from "./nav-links";

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
