import "./_shared/lib/fonts";
import { fonts } from "./_shared/lib/fonts";

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
