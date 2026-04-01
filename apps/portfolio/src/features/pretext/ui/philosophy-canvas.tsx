"use client";

import { useCallback } from "react";
import { RepelCanvas, layoutTextBlock } from "@/shared/ui";
import type { RepelLayoutResult, RepelSeg } from "@/shared/ui";
import { philosophy } from "@/content";

export function PhilosophyCanvas() {
  const handleLayout = useCallback(
    (ctx: CanvasRenderingContext2D, W: number): RepelLayoutResult => {
      const GAP = 160; // gap-xl
      // colW는 원래 컬럼 너비 유지 — padX는 텍스트 시작 위치와 maxWidth에만 적용
      const colW = Math.floor((W - GAP) / 2);
      const padX = 24; // 좌우 클리핑 방지 여백 (텍스트 이동 공간)
      const padY = 24; // 상하 클리핑 방지 여백
      const lx = padX;
      const rx = colW + GAP; // 오른쪽 컬럼 시작은 원래 위치 유지

      const titleF = '700 72px Inter, sans-serif';
      const titleLH = Math.round(72 * 1.1);
      const labelF = '400 12px "JetBrains Mono", monospace';
      const labelLH = Math.round(12 * 1.4);
      const bodyF = '700 20px Inter, sans-serif';
      const bodyLH = Math.round(20 * 1.6);
      const monoF = '400 14px "JetBrains Mono", monospace';
      const monoLH = Math.round(14 * 1.6);

      const glyphs: RepelLayoutResult["glyphs"] = [];
      const segs: RepelSeg[] = [];

      // ── Left: Title ──
      const { glyphs: tg, endY: tEndY } = layoutTextBlock(
        ctx, philosophy.title, lx, padY + titleLH, titleF, "#FFFFFF", colW - padX * 2, titleLH,
      );
      glyphs.push(...tg);
      let ly = tEndY + 48;

      // ── Left: Principles (border-l-2) ──
      for (const p of philosophy.principles) {
        const topY = ly;
        const { glyphs: pg, endY: pEndY } = layoutTextBlock(
          ctx, p, lx + 16, ly + labelLH, labelF, "rgba(255,255,255,0.8)", colW - padX * 2 - 16, labelLH,
        );
        glyphs.push(...pg);
        segs.push({ x1: lx, y1: topY, x2: lx, y2: pEndY - Math.round(labelLH * 0.3), color: "#FFFFFF", lw: 2 });
        ly = pEndY + 24;
      }

      // ── Right: Body ──
      const { glyphs: bg, endY: bEndY } = layoutTextBlock(
        ctx, philosophy.body, rx, padY + bodyLH, bodyF, "#FFFFFF", colW - padX, bodyLH,
      );
      glyphs.push(...bg);

      // ── Divider + Metadata ──
      const divY = Math.max(ly, bEndY) + 24;
      segs.push({ x1: rx, y1: divY, x2: rx + colW, y2: divY, color: "rgba(255,255,255,0.2)", lw: 1 });

      const metaY = divY + 24;
      const halfW = Math.floor(colW / 2) - 24;
      const outputX = rx + Math.floor(colW / 2) + 24;

      const { glyphs: mlg } = layoutTextBlock(ctx, "METHODOLOGY", rx, metaY, labelF, "rgba(255,255,255,0.4)", halfW, labelLH);
      glyphs.push(...mlg);
      const { glyphs: mvg } = layoutTextBlock(ctx, philosophy.methodology, rx, metaY + labelLH + 4, monoF, "#FFFFFF", halfW, monoLH);
      glyphs.push(...mvg);

      const { glyphs: olg } = layoutTextBlock(ctx, "OUTPUT", outputX, metaY, labelF, "rgba(255,255,255,0.4)", halfW, labelLH);
      glyphs.push(...olg);
      const { glyphs: ovg } = layoutTextBlock(ctx, philosophy.output, outputX, metaY + labelLH + 4, monoF, "#FFFFFF", halfW, monoLH);
      glyphs.push(...ovg);

      return { glyphs, segs, height: metaY + monoLH + padY };
    },
    [],
  );

  return (
    <>
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
        <ul>{philosophy.principles.map((p) => <li key={p}>{p}</li>)}</ul>
        <p>{philosophy.body}</p>
        <dl>
          <dt>METHODOLOGY</dt><dd>{philosophy.methodology}</dd>
          <dt>OUTPUT</dt><dd>{philosophy.output}</dd>
        </dl>
      </div>
      <RepelCanvas onLayout={handleLayout} />
    </>
  );
}
