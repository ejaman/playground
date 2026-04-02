import { Line } from "@/shared/ui";
import { skills, experiences, etc, status } from "@/content";

export function AboutSection() {
  return (
    <div id="about">
      {/* WritingSection의 label + Line과 높이를 맞추는 데스크탑 전용 스페이서 */}
      <p className="text-label-sm mb-md hidden md:block" aria-hidden="true" />
      <Line className="hidden md:block" />

      {/* ── MOBILE: 칩 태그 카드 ── */}
      <div className="md:hidden">
        <div className="border border-pure-black p-sm">
          <p className="text-label-sm mb-sm text-neutral-800/40">CORE STACK</p>
          <div className="mb-sm flex flex-wrap gap-xs">
            {skills.coreStack.map((t) => (
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
              <p className="text-label-sm mb-xs text-neutral-800/40">ETC</p>
              {etc.map(({ label, value }) => (
                <p key={label} className="text-mono-base">
                  {label} {value}
                </p>
              ))}
            </div>
            <div>
              <p className="text-label-sm mb-xs text-neutral-800/40">STATUS</p>
              <p className="text-mono-base">{status}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── DESKTOP: FE 그리드 + 경력 + etc ── */}
      <div className="hidden md:block">
        <div className="mb-md border border-pure-black p-sm">
          <p className="text-label-sm mb-xs text-neutral-800/40">FRONT-END</p>
          <ul className="flex flex-wrap gap-xs">
            {skills.frontend.map((t) => (
              <li key={t} className="text-mono-base">
                {t}
              </li>
            ))}
          </ul>
        </div>

        <div className="mb-md">
          <p className="text-label-sm mb-sm text-neutral-800/40">EXPERIENCE</p>
          <ul className="flex flex-col gap-xs">
            {experiences.map(({ company, role, period }) => (
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

        <div className="mb-md">
          <p className="text-label-sm mb-sm text-neutral-800/40">ETC</p>
          <ul className="flex flex-col gap-xs">
            {etc.map(({ label, value }) => (
              <li key={label} className="flex items-baseline justify-between">
                <p className="text-mono-base">{label}</p>
                <p className="text-label-sm text-neutral-800/40">{value}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
