"use client";

import { useEffect, useRef, useState } from "react";

// ─── Mock data (Phase 4에서 실제 AI 스트리밍으로 교체) ─────────────────────
const MOCK = {
  resultLabel: "PROMPT_RESULT_01 //",
  body: `Jim operates at the intersection of high-end editorial aesthetics and robust digital systems. With over 8 years in the field, he has transitioned from pure graphic design into system-led UI architecture.`,
  competencies: [
    { skill: "Editorial Layout", pct: "100%" },
    { skill: "Design Systems", pct: "95%" },
    { skill: "Technical SEO", pct: "80%" },
    { skill: "Creative Direction", pct: "90%" },
  ],
  milestones: [
    "2024: Principal @ JIM_EDITORIAL",
    "2022: Lead Architect at VECTOR_FLOW",
    "2019: Senior Designer at MONO_GRID",
    "2017: BA Graphic Arts (Pratt)",
  ],
  conclusion:
    "Recommendation: Proceed with recruitment for high-complexity visual systems requiring a balance of artistic rigor and technical scalability.",
};

type ModalState =
  | { phase: "idle" }
  | { phase: "responded"; query: string };

type ChatModalProps = {
  onClose: () => void;
};

export function ChatModal({ onClose }: ChatModalProps) {
  const [state, setState] = useState<ModalState>({ phase: "idle" });
  const [draft, setDraft] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // 열릴 때 input 포커스
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Escape 닫기
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const handleSubmit = () => {
    const q = draft.trim();
    if (!q) return;
    // Phase 4: API 호출로 교체
    setState({ phase: "responded", query: q });
    setDraft("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSubmit();
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === overlayRef.current) onClose();
  };

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-pure-black/60"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="System Query"
        className="flex w-full max-w-3xl flex-col bg-pure-black text-pure-white"
        style={{ maxHeight: "85vh" }}
      >
        {/* ── Title bar ─────────────────────────────────────── */}
        <div className="flex items-center justify-between border-b border-pure-white/20 px-sm py-xs">
          <div className="flex items-center gap-xs">
            {(["bg-[#ff5f57]", "bg-[#febc2e]", "bg-[#28c840]"] as const).map(
              (color, i) => (
                <span
                  key={i}
                  className={`inline-block h-3 w-3 ${color}`}
                  aria-hidden="true"
                />
              )
            )}
          </div>
          <span className="text-label-sm text-pure-white/60">
            SYSTEM_QUERY // EXPERIENCE_RETRIEVAL
          </span>
          <button
            onClick={onClose}
            aria-label="닫기"
            className="text-label-sm text-pure-white/60 hover:text-pure-white"
          >
            ×
          </button>
        </div>

        {/* ── Body (scrollable) ─────────────────────────────── */}
        <div className="flex-1 overflow-y-auto p-sm font-[family-name:var(--font-mono)]">
          {state.phase === "idle" ? (
            /* 입력 대기 상태 */
            <div className="flex items-start gap-xs">
              <span className="text-mono-base text-pure-white/60 shrink-0">&gt;</span>
              <input
                ref={inputRef}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Query Jim's experience..."
                className="text-mono-base w-full bg-transparent text-pure-white outline-none placeholder:text-pure-white/30"
              />
            </div>
          ) : (
            /* 응답 상태 */
            <div className="flex flex-col gap-md">
              {/* User query */}
              <p className="text-mono-base">
                <span className="text-pure-white/50">&gt; USER_QUERY: </span>
                <span className="text-pure-white">"{state.query}"</span>
              </p>

              {/* Result label + body */}
              <div>
                <p className="text-label-sm mb-sm text-pure-white/50">
                  {MOCK.resultLabel}
                </p>
                <p className="text-[18px] leading-relaxed text-pure-white">
                  {MOCK.body}
                </p>
              </div>

              {/* Data panels */}
              <div className="grid grid-cols-2 gap-sm">
                <div className="border border-pure-white/20 p-sm">
                  <p className="text-label-sm mb-sm text-pure-white/60">
                    ⁃: CORE_COMPETENCIES
                  </p>
                  <ul className="flex flex-col gap-xs">
                    {MOCK.competencies.map(({ skill, pct }) => (
                      <li
                        key={skill}
                        className="text-mono-base flex justify-between"
                      >
                        <span>{skill}</span>
                        <span className="text-pure-white/60">{pct}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="border border-pure-white/20 p-sm">
                  <p className="text-label-sm mb-sm text-pure-white/60">
                    ◎ MILESTONES
                  </p>
                  <ul className="flex flex-col gap-xs">
                    {MOCK.milestones.map((m) => (
                      <li key={m} className="text-mono-base">
                        {m}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Conclusion */}
              <div>
                <p className="text-label-sm mb-xs text-pure-white/50">
                  CONCLUSION //
                </p>
                <p className="text-mono-base italic text-pure-white/80">
                  {MOCK.conclusion}
                </p>
              </div>

              {/* Awaiting cursor */}
              <div className="flex items-center gap-xs text-pure-white/40">
                <span className="animate-pulse text-lg leading-none">▌</span>
                <span className="text-label-sm">AWAITING_INPUT...</span>
              </div>
            </div>
          )}
        </div>

        {/* ── Footer actions ────────────────────────────────── */}
        <div className="grid grid-cols-2 border-t border-pure-white/20">
          <button className="text-label-sm flex items-center justify-center gap-xs border-r border-pure-white/20 py-sm text-pure-white hover:bg-pure-white hover:text-pure-black">
            <span aria-hidden="true">↓</span> DOWNLOAD_CV.PDF
          </button>
          <button className="text-label-sm flex items-center justify-center gap-xs py-sm text-pure-white hover:bg-pure-white hover:text-pure-black">
            <span aria-hidden="true">✉</span> REACH_OUT
          </button>
        </div>
      </div>
    </div>
  );
}
