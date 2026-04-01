const CORE_STACK = ["NEXT.JS", "TYPESCRIPT", "FRAMER MOTION", "NODE.JS"] as const;

export function AboutSection() {
  return (
    <div id="about">
      <p className="text-label-sm mb-md">04 / TECHNICAL STACK & BIO</p>

      {/* ── MOBILE: 칩 태그 카드 스타일 ── */}
      <div className="md:hidden">
        <div className="border border-pure-black p-sm">
          <p className="text-label-sm mb-sm text-neutral-800/40">CORE STACK</p>
          <div className="mb-sm flex flex-wrap gap-xs">
            {CORE_STACK.map((t) => (
              <span
                key={t}
                className="border border-pure-black px-xs py-1 text-label-sm"
              >
                {t}
              </span>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-sm border-t border-black/10 pt-sm">
            <div>
              <p className="text-label-sm mb-xs text-neutral-800/40">AWARDS</p>
              <p className="text-mono-base">AWWWARDS SOTD &apos;23</p>
              <p className="text-mono-base">FWA MOBILE AWARD</p>
            </div>
            <div>
              <p className="text-label-sm mb-xs text-neutral-800/40">STATUS</p>
              <p className="text-mono-base">AVAILABLE FOR HIRE</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── DESKTOP: FE/BE 그리드 + 경력 + 수상 ── */}
      <div className="hidden md:block">
        {/* Tech stack grid */}
        <div className="mb-md grid grid-cols-2 gap-sm border border-pure-black p-sm">
          <div>
            <p className="text-label-sm mb-xs text-neutral-800/40">FRONT-END</p>
            <ul className="flex flex-col gap-xs">
              {["REACT / NEXT.JS", "TAILWIND CSS", "THREE.JS / TS"].map((t) => (
                <li key={t} className="text-mono-base">{t}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-label-sm mb-xs text-neutral-800/40">BACK-END</p>
            <ul className="flex flex-col gap-xs">
              {["NODE / EXPRESS", "PYTHON / DJANGO", "POSTGRES / REDIS"].map((t) => (
                <li key={t} className="text-mono-base">{t}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Experience */}
        <div className="mb-md">
          <p className="text-label-sm mb-sm text-neutral-800/40">EXPERIENCE</p>
          <ul className="flex flex-col gap-xs">
            {[
              { company: "NEXUS LABS", role: "SR ENGINEER", period: "22-PRES" },
              { company: "MONO STUDIOS", role: "UI ARCHITECT", period: "18-22" },
            ].map(({ company, role, period }) => (
              <li key={company} className="flex items-baseline justify-between">
                <div>
                  <p className="text-mono-base font-bold">{company}</p>
                  <p className="text-label-sm text-neutral-800/40">{role}</p>
                </div>
                <p className="text-label-sm text-neutral-800/40">{period}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* Recognition */}
        <div>
          <p className="text-label-sm mb-sm text-neutral-800/40">RECOGNITION</p>
          <ul className="flex flex-col gap-xs">
            {["AWS SOLUTIONS ARCHITECT", "GCP PROFESSIONAL DEV"].map((r) => (
              <li key={r} className="text-mono-base flex items-center gap-xs">
                <span aria-hidden="true">◈</span>
                {r}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
