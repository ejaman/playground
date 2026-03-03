import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import localFont from "next/font/local";

const pretendard = localFont({
  src: "../assets/fonts/PretendardVariable.woff2",
  display: "swap",
  variable: "--pretendard",
});

export const fonts = {
  sans: GeistSans,
  mono: GeistMono,
  pretendard: pretendard,
};
