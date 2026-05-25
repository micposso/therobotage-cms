import type { NextConfig } from "next";
import appRedirects from "./src/lib/redirects";

const nextConfig: NextConfig = {
  transpilePackages: ['@therobotage/ui'],
  async redirects() {
    return appRedirects
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
    dangerouslyAllowLocalIP: true,
  },
};

export default nextConfig;
