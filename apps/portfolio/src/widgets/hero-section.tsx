import { Container, Line } from "@/shared/ui";
import { ChatTrigger } from "@/features/chatbot";
import { HeroCanvas, MonogramCanvas } from "@/features/pretext";
import { profile } from "@/content";

export function HeroSection() {
  return (
    <section aria-label="Identity" className="pt-sm">
      <Container>
        <p className="text-label-sm mb-sm">
          <span className="md:hidden">PORTFOLIO // 2024</span>
          <span className="hidden md:inline">01 / IDENTITY</span>
        </p>

        {/* 모바일: 일반 h1 / 데스크탑: canvas repulsion */}
        <h1 className="text-huge leading-none md:hidden">{profile.monogram}</h1>
        <div className="hidden md:block" aria-hidden="true">
          <MonogramCanvas />
        </div>

        <p className="text-body-base mt-xs mb-sm md:hidden">
          {profile.subtitle}
        </p>

        <Line className="my-sm" />

        <div className="pb-lg md:grid md:grid-cols-5  md:pb-xl">
          <div className="md:col-span-3">
            <ChatTrigger />
          </div>
          <div className="hidden md:col-span-2 md:flex md:items-center">
            <HeroCanvas />
          </div>
        </div>
      </Container>
    </section>
  );
}
