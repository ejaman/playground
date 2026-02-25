import "../src/shared/lib/fonts";
import { fonts } from "../src/shared/lib/fonts";
import "../src/shared/styles/globals.css";
import { Header } from "../src/shared/ui/Header";

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
