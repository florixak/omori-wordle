import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typedRoutes: true,
  cacheComponents: true,
  images: {
    domains: ["cdn.discordapp.com"],
  },
};

export default nextConfig;
