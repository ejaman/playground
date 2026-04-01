import { Container } from "@/shared/ui";
import { philosophy } from "@/content";

export function PhilosophySection() {
  return (
    <section aria-label="Core Philosophy" className="bg-pure-black py-lg md:py-xl">
      <Container>
        <p className="text-label-sm mb-md text-white/50">
          <span className="md:hidden">/PHILOSOPHY</span>
          <span className="hidden md:inline">CORE PHILOSOPHY</span>
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
            <p className="text-body-base text-white/80">{philosophy.execution}</p>
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

        {/* ── DESKTOP ── */}
        <div className="hidden md:grid md:grid-cols-2 md:gap-xl">
          <div>
            <h2 className="text-display-lg mb-md text-pure-white">
              {philosophy.title}
            </h2>
            <ul className="flex flex-col gap-sm">
              {philosophy.principles.map((p) => (
                <li key={p} className="text-label-sm border-l-2 border-pure-white pl-sm text-white/80">
                  {p}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col justify-between gap-xl">
            <p className="text-body-intro text-pure-white">{philosophy.body}</p>
            <div>
              <div className="mb-sm h-px w-full bg-white/20" />
              <div className="grid grid-cols-2 gap-md">
                <div>
                  <p className="text-label-sm mb-xs text-white/40">METHODOLOGY</p>
                  <p className="text-mono-base text-pure-white">{philosophy.methodology}</p>
                </div>
                <div>
                  <p className="text-label-sm mb-xs text-white/40">OUTPUT</p>
                  <p className="text-mono-base text-pure-white">{philosophy.output}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
