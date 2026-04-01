import { Container, Line } from "@/shared/ui";
import { ChatTrigger } from "@/features/chatbot";
import { HeroCanvas, MonogramCanvas } from "@/features/pretext";
import { profile } from "@/content";

export function HeroSection() {
  return (
    <section aria-label="Identity" className="pt-sm">
      <Container>
        <p className="text-label-sm mb-sm">
          <span className="md:hidden">PORTFOLIO // 2026</span>
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

        <div className="mt-xs mb-sm flex items-center gap-md">
          <a
            href={`mailto:${profile.email}`}
            className="text-label-sm text-neutral-800/60 hover:border-b hover:border-pure-black hover:text-neutral-800"
          >
            {profile.email}
          </a>
          {(Object.keys(profile.social) as Array<keyof typeof profile.social>)
            .filter((k) => profile.social[k] !== null)
            .map((k) => (
              <a
                key={k}
                href={profile.social[k] ?? "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="text-label-sm text-neutral-800/60 hover:border-b hover:border-pure-black hover:text-neutral-800"
              >
                {k.toUpperCase()}
              </a>
            ))}
        </div>

        <Line className="my-sm" />

        <div className="pb-lg md:grid md:grid-cols-5 md:items-start md:pb-xl">
          <div className="md:col-span-3">
            <ChatTrigger />
          </div>
          <div className="hidden md:col-span-2 md:block">
            <HeroCanvas />
          </div>
        </div>
      </Container>
    </section>
  );
}
