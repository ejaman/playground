import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import localFont from "next/font/local";

const pretendard = localFont({
  src: "../../../public/fonts/PretendardVariable.woff2",
  display: "swap",
  variable: "--pretendard",
});

export const fonts = {
  sans: GeistSans,
  mono: GeistMono,
  pretendard: pretendard,
};
