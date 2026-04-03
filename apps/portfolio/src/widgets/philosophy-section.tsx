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
          <h2 className="mb-md text-[40px] font-bold leading-tight text-pure-white">
            {philosophy.title}
          </h2>
          <ul className="mb-md flex flex-col gap-sm">
            {philosophy.principles.map((p) => (
              <li key={p} className="border-l-2 border-pure-white pl-sm">
                <p className="text-label-sm text-white/80">{p}</p>
              </li>
            ))}
          </ul>
          <div className="flex flex-col gap-sm">
            {philosophy.body.split("\n\n").map((para, i) => (
              <p key={i} className="text-body-base font-bold text-pure-white">
                {para}
              </p>
            ))}
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
