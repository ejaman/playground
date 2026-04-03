"use client";

import { useEffect, useRef } from "react";
import { prepareWithSegments, layoutWithLines } from "@chenglou/pretext";

// ── Public types ──────────────────────────────────────────────────────────────

export type RepelGlyph = {
  char: string;
  homeX: number;
  homeY: number;
  x: number;
  y: number;
  ox: number;
  oy: number;
  font: string;
  color: string;
};

export type RepelSeg = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color: string;
  lw: number;
};

export type RepelLayoutResult = {
  glyphs: RepelGlyph[];
  segs?: RepelSeg[];
  height: number;
  /** 지정하면 캔버스 너비를 컨테이너 대신 이 값으로 고정한다 */
  width?: number;
};

// ── Layout helpers (export for consumers' onLayout callbacks) ─────────────────

/** 글자 단위로 위치를 계산한다. canvas measureText 사용 (DOM 읽기 없음) */
export function measureGlyphs(
  ctx: CanvasRenderingContext2D,
  text: string,
  startX: number,
  baseline: number,
  font: string,
  color: string,
): RepelGlyph[] {
  ctx.font = font;
  const result: RepelGlyph[] = [];
  let x = startX;
  for (const char of text) {
    const w = ctx.measureText(char).width;
    result.push({ char, homeX: x, homeY: baseline, x, y: baseline, ox: 0, oy: 0, font, color });
    x += w;
  }
  return result;
}

/** pretext로 줄 단위 레이아웃 후 글자 단위 좌표를 반환한다 */
export function layoutTextBlock(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  firstBaseline: number,
  font: string,
  color: string,
  maxWidth: number,
  lineHeight: number,
): { glyphs: RepelGlyph[]; endY: number } {
  const prepared = prepareWithSegments(text, font);
  const { lines } = layoutWithLines(prepared, maxWidth, lineHeight);
  const glyphs: RepelGlyph[] = [];
  let baseline = firstBaseline;
  for (const line of lines) {
    glyphs.push(...measureGlyphs(ctx, line.text, x, baseline, font, color));
    baseline += lineHeight;
  }
  return { glyphs, endY: baseline };
}

// ── Component ─────────────────────────────────────────────────────────────────

type RepelCanvasProps = {
  /** 텍스트 배치를 정의하는 콜백. useCallback(fn, [])으로 안정화 권장 */
  onLayout: (ctx: CanvasRenderingContext2D, width: number) => RepelLayoutResult;
  repelRadius?: number;
  repelForce?: number;
  className?: string;
};

export function RepelCanvas({
  onLayout,
  repelRadius = 120,
  repelForce = 30,
  className,
}: RepelCanvasProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // onLayout 변경이 effect 재실행 없이 항상 최신 버전을 사용하도록 ref로 관리
  const onLayoutRef = useRef(onLayout);
  onLayoutRef.current = onLayout;

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    // TypeScript-safe closure captures
    const wr: HTMLDivElement = wrap;
    const el: HTMLCanvasElement = canvas;
    const ctx: CanvasRenderingContext2D | null = el.getContext("2d");
    if (!ctx) return;
    const c: CanvasRenderingContext2D = ctx;

    let W = 0, H = 0, dpr = 1;
    let glyphs: RepelGlyph[] = [];
    let segs: RepelSeg[] = [];
    let mouse = { x: -9999, y: -9999 };
    let raf = 0;
    let dirty = true;

    function doLayout() {
      dpr = Math.min(devicePixelRatio || 1, 2);
      W = wr.getBoundingClientRect().width;

      const result = onLayoutRef.current(c, W);
      glyphs = result.glyphs;
      segs = result.segs ?? [];
      H = result.height;
      if (result.width !== undefined) W = result.width;

      el.width = Math.round(W * dpr);
      el.height = Math.round(H * dpr);
      el.style.width = `${W}px`;
      el.style.height = `${H}px`;
      c.setTransform(dpr, 0, 0, dpr, 0, 0);

      dirty = false;
    }

    function loop() {
      if (dirty) doLayout();

      // 읽기: 사전 계산된 homeX/Y 사용 (DOM 읽기 없음 → layout flush 없음)
      for (const g of glyphs) {
        const dx = g.homeX - mouse.x;
        const dy = g.homeY - mouse.y;
        const d = Math.hypot(dx, dy);
        let fx = 0, fy = 0;
        if (d < repelRadius && d > 0.1) {
          const t = 1 - d / repelRadius;
          const f = t * t * repelForce;
          fx = (dx / d) * f;
          fy = (dy / d) * f;
        }
        // 쓰기: 스프링 보간 → 브라우저 배치 처리
        g.ox += (fx - g.ox) * 0.12;
        g.oy += (fy - g.oy) * 0.12;
        g.x = g.homeX + g.ox;
        g.y = g.homeY + g.oy;
      }

      c.clearRect(0, 0, W, H);

      for (const s of segs) {
        c.strokeStyle = s.color;
        c.lineWidth = s.lw;
        c.beginPath();
        c.moveTo(s.x1, s.y1);
        c.lineTo(s.x2, s.y2);
        c.stroke();
      }

      for (const g of glyphs) {
        c.font = g.font;
        c.fillStyle = g.color;
        c.fillText(g.char, g.x, g.y);
      }

      raf = requestAnimationFrame(loop);
    }

    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      mouse = { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const onLeave = () => { mouse = { x: -9999, y: -9999 }; };
    const onResize = () => { dirty = true; };

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    window.addEventListener("resize", onResize);
    document.fonts.ready.then(() => { dirty = true; });

    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("resize", onResize);
    };
  }, [repelRadius, repelForce]);

  return (
    <div ref={wrapRef} className={className ?? "w-full"}>
      <canvas ref={canvasRef} aria-hidden="true" />
    </div>
  );
}
