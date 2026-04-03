"use client";

import { useCallback } from "react";
import { RepelCanvas, layoutTextBlock } from "@/shared/ui";
import type { RepelLayoutResult, RepelSeg } from "@/shared/ui";
import { philosophy } from "@/content";

export function PhilosophyCanvas() {
  const handleLayout = useCallback(
    (ctx: CanvasRenderingContext2D, W: number): RepelLayoutResult => {
      const GAP = 140; // gap-xl
      const colW = Math.floor((W - GAP) / 2);
      const padX = 28; // repulsion 이동 공간
      const padY = 28; // 상하 이동 공간
      // 왼쪽 컬럼: 왼쪽 경계만 위험 → lx = padX, maxWidth = colW - padX
      // 오른쪽 컬럼: 오른쪽 경계만 위험 → rx 그대로, maxWidth = colW - padX
      const lx = padX;
      const rx = colW + GAP;

      const titleF = "700 72px Inter, sans-serif";
      const titleLH = Math.round(72 * 1.1);
      const labelF = '400 12px "JetBrains Mono", monospace';
      const labelLH = Math.round(12 * 1.4);
      const bodyF = "700 18px Inter, sans-serif";
      const bodyLH = Math.round(18 * 1.6);
      const glyphs: RepelLayoutResult["glyphs"] = [];
      const segs: RepelSeg[] = [];

      // ── Left: Title ── (lx=padX 시작, 오른쪽은 GAP이 자연 경계)
      const { glyphs: tg, endY: tEndY } = layoutTextBlock(
        ctx,
        philosophy.title,
        lx,
        padY + titleLH,
        titleF,
        "#FFFFFF",
        colW,
        titleLH,
      );
      glyphs.push(...tg);
      let ly = tEndY + 48;

      // ── Left: Principles (border-l-2) ──
      for (const p of philosophy.principles) {
        const topY = ly;
        const { glyphs: pg, endY: pEndY } = layoutTextBlock(
          ctx,
          p,
          lx + 16,
          ly + labelLH,
          labelF,
          "rgba(255,255,255,0.8)",
          colW - padX - 16,
          labelLH,
        );
        glyphs.push(...pg);
        segs.push({
          x1: lx,
          y1: topY,
          x2: lx,
          y2: pEndY - Math.round(labelLH * 0.3),
          color: "#FFFFFF",
          lw: 2,
        });
        ly = pEndY + 24;
      }

      // ── Right: Body ── \n\n 기준으로 문단 분리 렌더링
      const paragraphs = philosophy.body.split("\n\n");
      const paraGap = Math.round(bodyLH * 0.75);
      let ry = padY + bodyLH;
      let bEndY = ry;
      for (const para of paragraphs) {
        const { glyphs: bg, endY } = layoutTextBlock(
          ctx,
          para,
          rx - padX * 2,
          ry,
          bodyF,
          "#FFFFFF",
          colW + padX + 20,
          bodyLH,
        );
        glyphs.push(...bg);
        bEndY = endY;
        ry = endY + paraGap;
      }

      // // ── DEBUG: body 영역 경계 표시 ──
      // const dbgX = rx - padX * 2;
      // const dbgW = colW;
      // const dbgY1 = padY;
      // const dbgY2 = bEndY;
      // const dbgColor = "rgba(255,0,0,0.6)";
      // segs.push(
      //   {
      //     x1: dbgX,
      //     y1: dbgY1,
      //     x2: dbgX + dbgW,
      //     y2: dbgY1,
      //     color: dbgColor,
      //     lw: 1,
      //   }, // top
      //   {
      //     x1: dbgX,
      //     y1: dbgY2,
      //     x2: dbgX + dbgW,
      //     y2: dbgY2,
      //     color: dbgColor,
      //     lw: 1,
      //   }, // bottom
      //   { x1: dbgX, y1: dbgY1, x2: dbgX, y2: dbgY2, color: dbgColor, lw: 1 }, // left
      //   {
      //     x1: dbgX + dbgW,
      //     y1: dbgY1,
      //     x2: dbgX + dbgW,
      //     y2: dbgY2,
      //     color: dbgColor,
      //     lw: 1,
      //   }, // right
      // );

      return { glyphs, segs, height: Math.max(ly, bEndY) + padY };
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
        <ul>
          {philosophy.principles.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
        <p style={{ whiteSpace: "pre-wrap" }}>{philosophy.body}</p>
      </div>
      <RepelCanvas onLayout={handleLayout} />
    </>
  );
}
