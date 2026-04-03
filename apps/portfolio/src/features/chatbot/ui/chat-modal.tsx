"use client";

import { useEffect, useRef, useState } from "react";
import { Markdown } from "@/shared/ui/markdown";

type Message = {
  role: "user" | "assistant";
  content: string;
};

type ChatModalProps = {
  onClose: () => void;
};

export function ChatModal({ onClose }: ChatModalProps) {
  const [history, setHistory] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [streaming]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  // 모달 열려있는 동안 body 스크롤 차단 (iOS 포함)
  useEffect(() => {
    const scrollY = window.scrollY;
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";
    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      window.scrollTo(0, scrollY);
    };
  }, []);

  // 새 메시지 추가 시 스크롤 하단 유지
  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight });
  }, [history, streaming]);

  const handleSubmit = async () => {
    const q = draft.trim();
    if (!q || streaming) return;

    setDraft("");
    setError(null);

    const newHistory: Message[] = [...history, { role: "user", content: q }];
    setHistory(newHistory);
    setStreaming(true);

    // assistant 자리 미리 추가
    setHistory((prev) => [...prev, { role: "assistant", content: "" }]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: q,
          history: history, // 이전 히스토리 (새 user 메시지 제외)
        }),
      });

      if (!res.ok) throw new Error(`API Error: ${res.status}`);

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) throw new Error("Stream unavailable");

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const text = decoder.decode(value);
        setHistory((prev) => {
          const updated = [...prev];
          const last = updated[updated.length - 1];
          if (last?.role === "assistant") {
            updated[updated.length - 1] = {
              ...last,
              content: last.content + text,
            };
          }
          return updated;
        });
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
      // 빈 assistant 메시지 제거
      setHistory((prev) => prev.slice(0, -1));
    } finally {
      setStreaming(false);
    }
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
      className="fixed inset-0 z-[100] flex items-start justify-center bg-black/60 md:items-center"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="System Query"
        className="flex w-full max-w-[48rem] flex-col bg-pure-black text-pure-white md:max-h-[85vh]"
        style={{ maxHeight: "100dvh" }}
      >
        {/* ── Title bar ─────────────────────────────────────── */}
        <div className="flex items-center justify-between border-b border-white/20 px-sm py-xs">
          <div className="hidden items-center gap-xs md:flex">
            <span className="inline-block h-3 w-3 bg-white/30" aria-hidden="true" />
            <span className="inline-block h-3 w-3 bg-white/30" aria-hidden="true" />
            <span className="inline-block h-3 w-3 bg-white/30" aria-hidden="true" />
          </div>
          <span className="text-label-sm text-white/60">
            SYSTEM_QUERY // EXPERIENCE_RETRIEVAL
          </span>
          <button
            onClick={onClose}
            aria-label="닫기"
            className="text-xl leading-none text-white/60 hover:text-pure-white"
          >
            ×
          </button>
        </div>

        {/* ── Body (scrollable) ─────────────────────────────── */}
        <div
          ref={bodyRef}
          className="flex-1 overflow-y-auto p-sm font-[family-name:var(--font-mono)]"
        >
          {history.length === 0 ? (
            /* 초기 상태 */
            <div className="flex items-start gap-xs">
              <span className="text-mono-base text-white/60 shrink-0">
                &gt;
              </span>
              <input
                ref={inputRef}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Query Jimin's experience..."
                className="w-full bg-transparent text-base text-pure-white outline-none placeholder:text-white/30 md:text-mono-base"
              />
            </div>
          ) : (
            <div className="flex flex-col gap-md">
              {history.map((msg, i) =>
                msg.role === "user" ? (
                  <p key={i} className="text-mono-base">
                    <span className="text-white/50">&gt; USER_QUERY: </span>
                    <span className="text-pure-white">
                      &quot;{msg.content}&quot;
                    </span>
                  </p>
                ) : (
                  <div key={i}>
                    <p className="text-label-sm mb-sm text-white/50">
                      {`PROMPT_RESULT_${String(Math.ceil((i + 1) / 2)).padStart(2, "0")} //`}
                    </p>
                    <div className="text-[18px] leading-relaxed text-pure-white">
                      <Markdown variant="dark">{msg.content}</Markdown>
                      {streaming && i === history.length - 1 && (
                        <span className="animate-pulse">▌</span>
                      )}
                    </div>
                  </div>
                ),
              )}

              {/* 에러 */}
              {error && (
                <p className="text-mono-base text-red-400">ERROR // {error}</p>
              )}

              {/* 다음 입력창 */}
              {!streaming && (
                <div className="flex items-start gap-xs">
                  <span className="text-mono-base text-white/60 shrink-0">
                    &gt;
                  </span>
                  <input
                    ref={inputRef}
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="AWAITING_INPUT..."
                    className="w-full bg-transparent text-base text-pure-white outline-none placeholder:text-white/30 md:text-mono-base"
                  />
                </div>
              )}

              {/* 스트리밍 중 로딩 표시 */}
              {streaming && history[history.length - 1]?.content === "" && (
                <div className="flex items-center gap-xs text-white/40">
                  <span className="animate-pulse text-lg leading-none">▌</span>
                  <span className="text-label-sm">PROCESSING...</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
