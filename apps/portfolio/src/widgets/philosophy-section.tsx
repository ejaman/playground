import { Container } from "@/shared/ui";

const PRINCIPLES = [
  "MINIMALISM IS NOT THE ABSENCE OF CONTENT, BUT THE PURIFICATION OF INTENT.",
  "EVERY PIXEL MUST EARN ITS PLACE ON THE CANVAS.",
  "ASYMMETRY CREATES RHYTHM; RHYTHM CREATES MEMORY.",
] as const;

export function PhilosophySection() {
  return (
    <section aria-label="Core Philosophy" className="bg-pure-black py-xl">
      <Container>
        <p className="text-label-sm mb-lg text-pure-white/50">CORE PHILOSOPHY</p>

        <div className="grid grid-cols-2 gap-xl">
          {/* Left: title + principles */}
          <div>
            <h2 className="text-display-lg mb-md text-pure-white">
              THE INVISIBLE AUTHORITY.
            </h2>
            <ul className="flex flex-col gap-sm">
              {PRINCIPLES.map((p) => (
                <li
                  key={p}
                  className="text-label-sm border-l-2 border-pure-white pl-sm text-pure-white/80"
                >
                  {p}
                </li>
              ))}
            </ul>
          </div>

          {/* Right: body + metadata */}
          <div className="flex flex-col justify-between gap-xl">
            <p className="text-body-intro text-pure-white">
              I treat code as a high-end publication. Every line is a structural
              element pushing the limits of the digital gallery.
            </p>
            <div>
              <div className="mb-sm h-px w-full bg-pure-white/20" />
              <div className="grid grid-cols-2 gap-md">
                <div>
                  <p className="text-label-sm mb-xs text-pure-white/40">METHODOLOGY</p>
                  <p className="text-mono-base text-pure-white">SWISS MINIMALISM</p>
                </div>
                <div>
                  <p className="text-label-sm mb-xs text-pure-white/40">OUTPUT</p>
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
