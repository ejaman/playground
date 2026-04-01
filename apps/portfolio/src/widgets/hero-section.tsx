import { Container, Input, Line } from "@/shared/ui";

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5" />
      <line x1="13.5" y1="13.5" x2="17" y2="17" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export function HeroSection() {
  return (
    <section aria-label="Identity" className="pt-sm">
      <Container>
        <p className="text-label-sm mb-sm">01 / IDENTITY</p>

        <h1 className="text-huge leading-none">JIM</h1>

        <Line className="my-sm" />

        <div className="grid grid-cols-3 gap-md pb-xl">
          <div className="col-span-2">
            <Input
              placeholder="Ask Jim about his experience..."
              aria-label="Jim에게 질문하기"
              rightElement={<SearchIcon />}
            />
          </div>
          <div className="col-span-1 flex items-center">
            <p className="text-body-intro uppercase leading-tight">
              A digital curator focused on architecting high-performance
              interfaces and robust technical systems.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
