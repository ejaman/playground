"use client";

import { useCallback } from "react";
import { RepelCanvas, layoutTextBlock } from "@/shared/ui";
import type { RepelLayoutResult } from "@/shared/ui";
import { profile } from "@/content";

export function HeroCanvas() {
  const handleLayout = useCallback(
    (ctx: CanvasRenderingContext2D, W: number): RepelLayoutResult => {
      // text-body-intro: 20px Inter 700, lh 1.6, uppercase
      const font = "700 20px Inter, sans-serif";
      const lineHeight = Math.round(20 * 1.6);

      // 상하 여백: repelForce(30) 만큼 이동 공간 확보
      const padY = 36;
      // firstBaseline = padY + 실제 ascent (빈 공간 없이 텍스트 바로 시작)
      ctx.font = font;
      const ascent = ctx.measureText("H").actualBoundingBoxAscent;
      const firstBaseline = padY + ascent;

      const { glyphs, endY } = layoutTextBlock(
        ctx,
        profile.heroIntro,
        0,
        firstBaseline,
        font,
        "#1B1B1B", // neutral-800
        W,
        lineHeight,
      );

      return { glyphs, height: endY + padY };
    },
    [],
  );

  return (
    <>
      <p
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
        {profile.heroIntro}
      </p>
      <RepelCanvas onLayout={handleLayout} />
    </>
  );
}
