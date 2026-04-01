"use client";

import { useCallback, useEffect, useState } from "react";
import { ChatModal } from "./chat-modal";

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5" />
      <line x1="13.5" y1="13.5" x2="17" y2="17" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export function ChatTrigger() {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  // Cmd+K / Ctrl+K 단축키
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <button
        onClick={open}
        aria-label="Jim에게 질문하기 (Cmd+K)"
        className="flex w-full cursor-pointer items-center justify-between border border-pure-black px-sm py-xs text-left hover:bg-neutral-100"
      >
        <span className="text-mono-base text-black/35">
          Ask Jim about his experience...
        </span>
        <SearchIcon />
      </button>

      {isOpen && <ChatModal onClose={close} />}
    </>
  );
}
