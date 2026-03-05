import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Playground";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "flex-end",
        backgroundColor: "#020617",
        padding: "72px",
      }}
    >
      {/* 상단 액센트 라인 */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "4px",
          backgroundColor: "#3b82f6",
        }}
      />

      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <p
          style={{
            fontSize: "20px",
            color: "#3b82f6",
            fontWeight: 600,
            margin: 0,
          }}
        >
          playground-two-lemon.vercel.app
        </p>
        <h1
          style={{
            fontSize: "64px",
            fontWeight: 700,
            color: "#f8fafc",
            margin: 0,
            lineHeight: 1.1,
          }}
        >
          Playground 🤾
        </h1>
        <p
          style={{
            fontSize: "28px",
            color: "#94a3b8",
            margin: 0,
            lineHeight: 1.5,
          }}
        >
          실무에서 새로운 기능 실험까지!{"\n"}새로운 도약을 위한 자유로운
          실험실입니다.
        </p>
      </div>
    </div>,
    { ...size },
  );
}
