import { build } from "velite";

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {},
};

// dev 모드에서는 watch, build 모드에서는 한 번만 실행
if (process.env.NODE_ENV === "development") {
  build({ watch: true, logLevel: "warn" });
} else {
  build({ logLevel: "warn" });
}

export default nextConfig;
