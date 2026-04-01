"use client";

import { useEffect, useRef } from "react";
import { prepareWithSegments, layoutWithLines } from "@chenglou/pretext";
import { philosophy } from "@/content";

const REPEL_R = 80;
const REPEL_F = 10;

type Glyph = {
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

type LineSeg = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color: string;
  lw: number;
};

function glyphsForLine(
  ctx: CanvasRenderingContext2D,
  text: string,
  startX: number,
  baseline: number,
  font: string,
  color: string,
): Glyph[] {
  ctx.font = font;
  const result: Glyph[] = [];
  let x = startX;
  for (const char of text) {
    const w = ctx.measureText(char).width;
    result.push({ char, homeX: x, homeY: baseline, x, y: baseline, ox: 0, oy: 0, font, color });
    x += w;
  }
  return result;
}

function layoutBlock(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  firstBaseline: number,
  font: string,
  color: string,
  maxWidth: number,
  lineHeight: number,
): { glyphs: Glyph[]; endY: number } {
  const prepared = prepareWithSegments(text, font);
  const { lines } = layoutWithLines(prepared, maxWidth, lineHeight);
  const glyphs: Glyph[] = [];
  let baseline = firstBaseline;
  for (const line of lines) {
    glyphs.push(...glyphsForLine(ctx, line.text, x, baseline, font, color));
    baseline += lineHeight;
  }
  return { glyphs, endY: baseline };
}

export function PhilosophyCanvas() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    // TypeScript-safe closure captures (non-null after guard)
    const wr: HTMLDivElement = wrap;
    const el: HTMLCanvasElement = canvas;
    const ctx: CanvasRenderingContext2D | null = el.getContext("2d");
    if (!ctx) return;
    const c: CanvasRenderingContext2D = ctx;

    let W = 0, H = 0, dpr = 1;
    let glyphs: Glyph[] = [];
    let segs: LineSeg[] = [];
    let mouse = { x: -9999, y: -9999 };
    let raf = 0;
    let dirty = true;

    function doLayout() {
      dpr = Math.min(devicePixelRatio || 1, 2);
      W = wr.getBoundingClientRect().width;

      // gap-xl = 160px (design token)
      const GAP = 160;
      const colW = Math.floor((W - GAP) / 2);
      const lx = 0;          // left column x
      const rx = colW + GAP; // right column x

      glyphs = [];
      segs = [];

      // ── Font definitions (matches globals.css tokens) ──
      const titleF = '700 72px Inter, sans-serif';
      const titleLH = Math.round(72 * 1.1); // text-display-lg lh: 1.1
      const labelF = '400 12px "JetBrains Mono", monospace';
      const labelLH = Math.round(12 * 1.4); // text-label-sm lh: 1.4
      const bodyF = '700 20px Inter, sans-serif';
      const bodyLH = Math.round(20 * 1.6); // text-body-intro lh: 1.6
      const monoF = '400 14px "JetBrains Mono", monospace';
      const monoLH = Math.round(14 * 1.6); // text-mono-base lh: 1.6

      // ── Left: Title ──
      const { glyphs: tg, endY: tEndY } = layoutBlock(
        c, philosophy.title, lx, titleLH,
        titleF, "#FFFFFF", colW, titleLH,
      );
      glyphs.push(...tg);
      let ly = tEndY + 48; // mb-md

      // ── Left: Principles (with left border) ──
      for (const p of philosophy.principles) {
        const topY = ly;
        const { glyphs: pg, endY: pEndY } = layoutBlock(
          c, p, lx + 16, ly + labelLH,
          labelF, "rgba(255,255,255,0.8)", colW - 16, labelLH,
        );
        glyphs.push(...pg);
        // border-l-2 border-pure-white
        segs.push({ x1: lx, y1: topY, x2: lx, y2: pEndY - Math.round(labelLH * 0.3), color: "#FFFFFF", lw: 2 });
        ly = pEndY + 24; // gap-sm
      }

      // ── Right: Body ──
      const { glyphs: bg, endY: bEndY } = layoutBlock(
        c, philosophy.body, rx, bodyLH,
        bodyF, "#FFFFFF", colW, bodyLH,
      );
      glyphs.push(...bg);

      // ── Divider + Metadata ──
      const bottomY = Math.max(ly, bEndY);
      const divY = bottomY + 24;
      segs.push({ x1: rx, y1: divY, x2: rx + colW, y2: divY, color: "rgba(255,255,255,0.2)", lw: 1 });

      const metaY = divY + 24;
      const halfW = Math.floor(colW / 2) - 24;
      const outputX = rx + Math.floor(colW / 2) + 24;

      const { glyphs: mlg } = layoutBlock(c, "METHODOLOGY", rx, metaY, labelF, "rgba(255,255,255,0.4)", halfW, labelLH);
      glyphs.push(...mlg);
      const { glyphs: mvg } = layoutBlock(c, philosophy.methodology, rx, metaY + labelLH + 4, monoF, "#FFFFFF", halfW, monoLH);
      glyphs.push(...mvg);

      const { glyphs: olg } = layoutBlock(c, "OUTPUT", outputX, metaY, labelF, "rgba(255,255,255,0.4)", halfW, labelLH);
      glyphs.push(...olg);
      const { glyphs: ovg } = layoutBlock(c, philosophy.output, outputX, metaY + labelLH + 4, monoF, "#FFFFFF", halfW, monoLH);
      glyphs.push(...ovg);

      H = metaY + monoLH + 24;

      el.width = Math.round(W * dpr);
      el.height = Math.round(H * dpr);
      el.style.width = `${W}px`;
      el.style.height = `${H}px`;
      c.setTransform(dpr, 0, 0, dpr, 0, 0);

      dirty = false;
    }

    function loop() {
      if (dirty) doLayout();

      // Physics: 읽기(homeX/Y) → 거리 계산 → 쓰기(ox/oy) 분리
      // DOM 읽기 없이 pretext 사전 계산 좌표 사용 → layout flush 없음
      for (const g of glyphs) {
        const dx = g.homeX - mouse.x;
        const dy = g.homeY - mouse.y;
        const d = Math.hypot(dx, dy);
        let fx = 0, fy = 0;
        if (d < REPEL_R && d > 0.1) {
          const t = 1 - d / REPEL_R;
          const f = t * t * REPEL_F;
          fx = (dx / d) * f;
          fy = (dy / d) * f;
        }
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
  }, []);

  return (
    <div ref={wrapRef} className="w-full">
      {/* 스크린 리더용 접근성 텍스트 */}
      <div
        style={{
          position: "absolute",
          width: "1px",
          height: "1px",
          padding: 0,
          margin: "-1px",
          overflow: "hidden",
          clip: "rect(0,0,0,0)",
          whiteSpace: "nowrap",
          borderWidth: 0,
        }}
      >
        <h2>{philosophy.title}</h2>
        <ul>
          {philosophy.principles.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
        <p>{philosophy.body}</p>
        <dl>
          <dt>METHODOLOGY</dt>
          <dd>{philosophy.methodology}</dd>
          <dt>OUTPUT</dt>
          <dd>{philosophy.output}</dd>
        </dl>
      </div>
      <canvas ref={canvasRef} aria-hidden="true" />
    </div>
  );
}
