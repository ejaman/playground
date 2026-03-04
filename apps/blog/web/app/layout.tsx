import "@/shared/lib/fonts";
import { fonts } from "@/shared/lib/fonts";
import "@/app/styles/globals.css";
import { Header } from "@/shared/ui/Header";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${fonts.pretendard.variable}`}>
      <body
        className={`${fonts.pretendard.className} ${fonts.pretendard.variable} antialiased`}
      >
        <Header />

        <main>{children}</main>
      </body>
    </html>
  );
}
