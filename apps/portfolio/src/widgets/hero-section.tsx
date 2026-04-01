import { Container, Line } from "@/shared/ui";
import { ChatTrigger } from "@/features/chatbot";

export function HeroSection() {
  return (
    <section aria-label="Identity" className="pt-sm">
      <Container>
        {/* Section label — mobile: PORTFOLIO // 2024 / desktop: 01 / IDENTITY */}
        <p className="text-label-sm mb-sm">
          <span className="md:hidden">PORTFOLIO // 2024</span>
          <span className="hidden md:inline">01 / IDENTITY</span>
        </p>

        <h1 className="text-huge leading-none">JIM</h1>

        {/* Mobile: intro text below JIM */}
        <p className="text-body-base mt-xs mb-sm md:hidden">
          Digital Curator &amp; Creative Technologist.
          <br />
          Architecting high-end editorial experiences.
        </p>

        <Line className="my-sm" />

        {/* Desktop: 3-col grid / Mobile: single col */}
        <div className="pb-lg md:grid md:grid-cols-3 md:gap-md md:pb-xl">
          <div className="mb-0 md:col-span-2">
            <ChatTrigger />
          </div>
          <div className="hidden md:col-span-1 md:flex md:items-center">
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
