"use client";

import { useCallback } from "react";
import { RepelCanvas, measureGlyphs } from "@/shared/ui";
import type { RepelLayoutResult } from "@/shared/ui";
import { profile } from "@/content";

export function MonogramCanvas() {
  const handleLayout = useCallback(
    (ctx: CanvasRenderingContext2D, W: number): RepelLayoutResult => {
      // text-display-lg 수준(72px)으로 고정 — 긴 이름에도 영역 초과 없음
      const fontSize = Math.min(72, W * 0.12); // 화면 폭에 따라 responsive
      const font = `700 ${fontSize}px Inter, sans-serif`;

      ctx.font = font;
      const metrics = ctx.measureText(profile.monogram);
      const ascent = metrics.actualBoundingBoxAscent;
      const descent = metrics.actualBoundingBoxDescent;
      const textWidth = metrics.width;

      // repelForce=50이므로 글자가 최대 ~50px 이동 → 여백을 충분히 확보
      const padX = 60;
      const padY = 60;

      const baseline = padY + ascent;
      const height = Math.ceil(baseline + descent + padY);
      const width = Math.ceil(textWidth + padX * 2);

      const glyphs = measureGlyphs(
        ctx,
        profile.monogram,
        padX,
        baseline,
        font,
        "#1B1B1B", // neutral-800
      );

      return { glyphs, height, width };
    },
    [],
  );

  return (
    <RepelCanvas onLayout={handleLayout} repelRadius={150} repelForce={50} />
  );
}
