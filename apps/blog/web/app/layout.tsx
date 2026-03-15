import "@/app/styles/globals.css";
import { Metadata } from "next";
import { GoogleAnalytics } from "@next/third-parties/google";
import { BASE_URL } from "@/shared/lib/constants";
import { fonts } from "@/shared/lib/fonts";
import { Header } from "@/shared/ui/Header";
import { Providers } from "@/shared/ui";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Frontend Playground",
    template: "%s | Playground",
  },
  description:
    "실무에서 새로운 기능 실험까지! 새로운 도약을 위한 자유로운 실험실입니다.",
  openGraph: {
    title: "Playground",
    description:
      "실무에서 새로운 기능 실험까지! 새로운 도약을 위한 자유로운 실험실입니다.",
    url: BASE_URL,
    siteName: "Playground",
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Playground",
    description:
      "실무에서 새로운 기능 실험까지! 새로운 도약을 위한 자유로운 실험실입니다.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${fonts.pretendard.variable}`}>
      <Providers>
        <body
          className={`${fonts.pretendard.className} ${fonts.pretendard.variable} antialiased`}
        >
          <Header />
          <main>{children}</main>
        </body>
      </Providers>
      <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID!} />
    </html>
  );
}
