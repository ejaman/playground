"use client";

import { useCallback } from "react";
import { RepelCanvas, measureGlyphs } from "@/shared/ui";
import type { RepelLayoutResult } from "@/shared/ui";
import { profile } from "@/content";

export function MonogramCanvas() {
  const handleLayout = useCallback(
    (ctx: CanvasRenderingContext2D, W: number): RepelLayoutResult => {
      // text-huge: 160px Inter 700, lh 0.9 (desktop)
      const fontSize = Math.min(160, W * 0.22); // 화면 폭에 따라 responsive
      const font = `700 ${fontSize}px Inter, sans-serif`;

      // 글자 높이를 canvas measureText로 정확히 계산
      ctx.font = font;
      const metrics = ctx.measureText(profile.monogram);
      const ascent = metrics.actualBoundingBoxAscent;
      const descent = metrics.actualBoundingBoxDescent;
      const padY = 20; // 상하 여백 (글자 이동 공간)

      const baseline = padY + ascent;
      const height = Math.ceil(baseline + descent + padY);

      const glyphs = measureGlyphs(
        ctx,
        profile.monogram,
        0,
        baseline,
        font,
        "#1B1B1B", // neutral-800
      );

      return { glyphs, height };
    },
    [],
  );

  return (
    <RepelCanvas
      onLayout={handleLayout}
      repelRadius={150}
      repelForce={50}
    />
  );
}
