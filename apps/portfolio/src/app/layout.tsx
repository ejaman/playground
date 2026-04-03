import type { Metadata } from "next";
import { fontVariables } from "@/shared/lib/fonts";
import { CustomCursor } from "@/shared/ui";
import "./globals.css";

export const metadata: Metadata = {
  title: "JIM | Frontend Dev",
  description: "프론트엔드 개발자 이지민입니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={fontVariables}>
      <body>
        <CustomCursor />
        <main>{children}</main>
      </body>
    </html>
  );
}
