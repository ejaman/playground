import { build } from "velite";

const nextConfig = {
  turbopack: {},
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
        pathname: "/**",
      },
    ],
  },
};

if (process.env.NODE_ENV !== "development") {
  build({ logLevel: "warn" });
}

export default nextConfig;
