import type { NextConfig } from "next";
import appRedirects from "./src/lib/redirects";

const nextConfig: NextConfig = {
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
