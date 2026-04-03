"use client";

import { useEffect, useRef, useState } from "react";

const SIZE = 8;

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // 터치 디바이스(모바일)에서는 렌더링하지 않음
    if (window.matchMedia("(pointer: coarse)").matches) return;
    setVisible(true);

    let rafId: number;
    let x = -100;
    let y = -100;

    function onMouseMove(e: MouseEvent) {
      x = e.clientX;
      y = e.clientY;
    }

    function tick() {
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${x - SIZE / 2}px, ${y - SIZE / 2}px)`;
      }
      rafId = requestAnimationFrame(tick);
    }

    document.addEventListener("mousemove", onMouseMove);
    rafId = requestAnimationFrame(tick);

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      ref={dotRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: SIZE,
        height: SIZE,
        backgroundColor: "#ffffff",
        mixBlendMode: "difference",
        borderRadius: "50%",
        pointerEvents: "none",
        zIndex: 9999,
        willChange: "transform",
      }}
    />
  );
}
