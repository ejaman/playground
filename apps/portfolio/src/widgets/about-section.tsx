export function AboutSection() {
  return (
    <div>
      <p className="text-label-sm mb-md">04 / TECHNICAL STACK & BIO</p>

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
  );
}
