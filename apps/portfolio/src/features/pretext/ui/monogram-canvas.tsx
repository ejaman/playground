"use client";

import { useCallback } from "react";
import { RepelCanvas, measureGlyphs } from "@/shared/ui";
import type { RepelLayoutResult } from "@/shared/ui";
import { profile } from "@/content";

export function MonogramCanvas() {
  const handleLayout = useCallback(
    (ctx: CanvasRenderingContext2D, W: number): RepelLayoutResult => {
      // 컨테이너 너비에 맞춰 폰트 크기 동적 계산 (최대 120px)
      // padX 여백을 뺀 영역에 텍스트가 딱 맞도록 스케일
      const padX = 60;
      const maxFont = 120;
      ctx.font = `700 ${maxFont}px Inter, sans-serif`;
      const rawWidth = ctx.measureText(profile.monogram).width;
      const availableW = W - padX * 2;
      const fontSize = rawWidth > availableW
        ? Math.floor(maxFont * (availableW / rawWidth))
        : maxFont;
      const font = `700 ${fontSize}px Inter, sans-serif`;

      ctx.font = font;
      const metrics = ctx.measureText(profile.monogram);
      const ascent = metrics.actualBoundingBoxAscent;
      const descent = metrics.actualBoundingBoxDescent;
      const textWidth = metrics.width;

      // repelForce=50이므로 글자가 최대 ~50px 이동 → 상하 여백 확보
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
