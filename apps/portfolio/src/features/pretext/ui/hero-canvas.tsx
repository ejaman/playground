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

      // REPEL_F(30) 만큼 글자가 밀릴 수 있으므로 양쪽 여백 확보
      const padX = 50;
      const { glyphs, endY } = layoutTextBlock(
        ctx,
        profile.heroIntro.toUpperCase(),
        padX,
        lineHeight,
        font,
        "#1B1B1B", // neutral-800
        W - padX * 1.5,
        lineHeight,
      );

      return { glyphs, height: endY };
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
