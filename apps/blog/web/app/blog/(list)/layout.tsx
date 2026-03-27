import React from "react";
import Image from "next/image";
import { Profile } from "@repo/ui";
import { TabLine } from "../../../src/entities/post/ui/TabLine";

export default function BlogLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
        ImageComponent={Image}
      />

      <TabLine />

      {children}
    </div>
  );
}
