import { ImageResponse } from "next/og";
import { publishedPosts } from "@/entities/post/lib/posts";

export const runtime = "edge";
export const alt = "Post";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function OgImage({ params }: Props) {
  const { slug } = await params;
  const post = publishedPosts.find((p) => p.id === slug);

  // 썸네일이 있으면 썸네일 이미지 사용
  if (post?.thumbnail) {
    return new ImageResponse(
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
        }}
      >
        <img
          src={`https://playground-two-lemon.vercel.app${post.thumbnail}`}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        {/* 하단 그라데이션 오버레이 */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "50%",
            background: "linear-gradient(transparent, rgba(2,6,23,0.9))",
            display: "flex",
            alignItems: "flex-end",
            padding: "48px",
          }}
        >
          <h1
            style={{
              fontSize: "48px",
              fontWeight: 700,
              color: "#f8fafc",
              margin: 0,
              lineHeight: 1.2,
            }}
          >
            {post.title}
          </h1>
        </div>
      </div>,
      { ...size },
    );
  }

  // 썸네일 없으면 기본 og 이미지 (제목 포함)
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
          Playground 🤾
        </p>
        <h1
          style={{
            fontSize: "56px",
            fontWeight: 700,
            color: "#f8fafc",
            margin: 0,
            lineHeight: 1.2,
          }}
        >
          {post?.title ?? "Playground"}
        </h1>
        {post?.description && (
          <p
            style={{
              fontSize: "24px",
              color: "#94a3b8",
              margin: 0,
              lineHeight: 1.5,
            }}
          >
            {post.description}
          </p>
        )}
      </div>
    </div>,
    { ...size },
  );
}
