import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        hostname: "scintillating-bear-192.convex.cloud"
      }
    ]
  }
};

export default nextConfig;
