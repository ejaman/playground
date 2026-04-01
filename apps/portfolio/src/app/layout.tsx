import type { Metadata } from "next";
import { fontVariables } from "@/shared/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "JIM — Digital Curator",
  description:
    "A digital curator focused on architecting high-performance interfaces and robust technical systems.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={fontVariables}>
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}
