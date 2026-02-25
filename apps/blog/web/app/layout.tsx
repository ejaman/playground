import "../src/shared/lib/fonts";
import { fonts } from "../src/shared/lib/fonts";
import "../src/shared/styles/globals.css";

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
        {children}
      </body>
    </html>
  );
}
