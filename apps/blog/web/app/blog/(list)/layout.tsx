"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Profile } from "@repo/ui";
import { TabLine } from "../../../src/entities/post/ui/TabLine";

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isPostDetail = pathname.startsWith("/blog/posts/");

  // 게시글 상세 페이지([slug])에서는 프로필/탭 없이 내용만 표시
  if (isPostDetail) {
    return <div className="max-w-3xl mx-auto py-8">{children}</div>;
  }

  // /blog, /blog/series 등 리스트 페이지에서는 프로필 + 탭 + 콘텐츠
  return (
    <div className="max-w-3xl mx-auto py-8 space-y-6">
      <Profile
        name="Frontend Playground"
        image="/images/jellyfish.webp"
        description={`실무에서 새로운 기능 실험까지!\n새로운 도약을 위한 자유로운 실험실입니다.`}
        socials={[
          { type: "github", url: "https://github.com/ejaman" },
          { type: "link", url: "https://velog.io/@ejaman/posts" },
        ]}
      />

      <TabLine />

      {children}
    </div>
  );
}
