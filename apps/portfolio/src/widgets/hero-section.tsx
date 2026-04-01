import { Container, Line } from "@/shared/ui";
import { ChatTrigger } from "@/features/chatbot";
import { profile } from "@/content";

export function HeroSection() {
  return (
    <section aria-label="Identity" className="pt-sm">
      <Container>
        <p className="text-label-sm mb-sm">
          <span className="md:hidden">PORTFOLIO // 2024</span>
          <span className="hidden md:inline">01 / IDENTITY</span>
        </p>

        <h1 className="text-huge leading-none">{profile.monogram}</h1>

        <p className="text-body-base mt-xs mb-sm md:hidden">{profile.subtitle}</p>

        <Line className="my-sm" />

        <div className="pb-lg md:grid md:grid-cols-3 md:gap-md md:pb-xl">
          <div className="md:col-span-2">
            <ChatTrigger />
          </div>
          <div className="hidden md:col-span-1 md:flex md:items-center">
            <p className="text-body-intro uppercase leading-tight">
              {profile.heroIntro}
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
