import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    isrMemoryCacheSize: 0,
  },
};

export default nextConfig;
