"use client";

import { useEffect, useRef } from "react";

const SIZE = 8;

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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
