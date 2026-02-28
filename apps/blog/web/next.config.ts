import { build } from "velite";

const nextConfig = {
  turbopack: {},
};

if (process.env.NODE_ENV !== "development") {
  build({ logLevel: "warn" });
}

export default nextConfig;
