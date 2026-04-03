import { Container } from "@/shared/ui";
import { philosophy } from "@/content";
import { PhilosophyCanvas } from "@/features/pretext";

export function PhilosophySection() {
  return (
    <section
      aria-label="Core Philosophy"
      className="bg-pure-black py-md md:py-sm"
    >
      <Container>
        <p className="text-label-sm mb-md text-white/50">
          <span className="md:hidden">/PHILOSOPHY</span>
        </p>

        {/* ── MOBILE ── */}
        <div className="md:hidden">
          <h2 className="text-display-lg mb-md text-pure-white">
            {philosophy.titleMobile}
          </h2>
          <div className="mb-md border-l-2 border-pure-white pl-sm">
            <p className="text-label-sm mb-xs text-white/50">01 — CONTEXT</p>
            <p className="text-body-intro italic text-pure-white">
              &ldquo;{philosophy.quote}&rdquo;
            </p>
          </div>
          <div className="mb-md border border-white/20 p-sm">
            <p className="text-label-sm mb-xs text-white/50">02 — EXECUTION</p>
            <p className="text-body-base text-white/80">
              {philosophy.execution}
            </p>
          </div>
          <div className="flex items-baseline gap-sm">
            <span
              className="font-bold leading-none text-white/20"
              style={{ fontSize: "96px" }}
              aria-hidden="true"
            >
              03
            </span>
            <p className="text-label-sm text-white/60">{philosophy.slogan}</p>
          </div>
        </div>

        {/* ── DESKTOP: canvas-based interactive text (pretext mouse repulsion) ── */}
        <div className="hidden md:block">
          <PhilosophyCanvas />
        </div>
      </Container>
    </section>
  );
}
