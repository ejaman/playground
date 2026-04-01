import { Container } from "@/shared/ui";

const PRINCIPLES = [
  "MINIMALISM IS NOT THE ABSENCE OF CONTENT, BUT THE PURIFICATION OF INTENT.",
  "EVERY PIXEL MUST EARN ITS PLACE ON THE CANVAS.",
  "ASYMMETRY CREATES RHYTHM; RHYTHM CREATES MEMORY.",
] as const;

export function PhilosophySection() {
  return (
    <section aria-label="Core Philosophy" className="bg-pure-black py-lg md:py-xl">
      <Container>
        {/* Section label */}
        <p className="text-label-sm mb-md text-white/50">
          <span className="md:hidden">/PHILOSOPHY</span>
          <span className="hidden md:inline">CORE PHILOSOPHY</span>
        </p>

        {/* ── MOBILE layout: pretext 스타일 ── */}
        <div className="md:hidden">
          <h2 className="text-display-lg mb-md text-pure-white">
            THE DIGITAL CURATOR
          </h2>

          {/* 01 — CONTEXT */}
          <div className="mb-md border-l-2 border-pure-white pl-sm">
            <p className="text-label-sm mb-xs text-white/50">01 — CONTEXT</p>
            <p className="text-body-intro italic text-pure-white">
              &ldquo;White space isn&apos;t empty; it&apos;s the invisible
              scaffolding of authority.&rdquo;
            </p>
          </div>

          {/* 02 — EXECUTION */}
          <div className="mb-md border border-white/20 p-sm">
            <p className="text-label-sm mb-xs text-white/50">02 — EXECUTION</p>
            <p className="text-body-base text-white/80">
              Every pixel serves a narrative. We reject the standard web for an
              editorial rhythm that breathes.
            </p>
          </div>

          {/* 03 — big number */}
          <div className="flex items-baseline gap-sm">
            <span
              className="font-bold leading-none text-white/20"
              style={{ fontSize: "96px" }}
              aria-hidden="true"
            >
              03
            </span>
            <p className="text-label-sm text-white/60">PRECISION OVER NOISE</p>
          </div>
        </div>

        {/* ── DESKTOP layout: 2-col editorial ── */}
        <div className="hidden md:grid md:grid-cols-2 md:gap-xl">
          {/* Left */}
          <div>
            <h2 className="text-display-lg mb-md text-pure-white">
              THE INVISIBLE AUTHORITY.
            </h2>
            <ul className="flex flex-col gap-sm">
              {PRINCIPLES.map((p) => (
                <li
                  key={p}
                  className="text-label-sm border-l-2 border-pure-white pl-sm text-white/80"
                >
                  {p}
                </li>
              ))}
            </ul>
          </div>
          {/* Right */}
          <div className="flex flex-col justify-between gap-xl">
            <p className="text-body-intro text-pure-white">
              I treat code as a high-end publication. Every line is a structural
              element pushing the limits of the digital gallery.
            </p>
            <div>
              <div className="mb-sm h-px w-full bg-white/20" />
              <div className="grid grid-cols-2 gap-md">
                <div>
                  <p className="text-label-sm mb-xs text-white/40">METHODOLOGY</p>
                  <p className="text-mono-base text-pure-white">SWISS MINIMALISM</p>
                </div>
                <div>
                  <p className="text-label-sm mb-xs text-white/40">OUTPUT</p>
                  <p className="text-mono-base text-pure-white">TECHNICAL ARCHIVES</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
