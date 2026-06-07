import type { NextConfig } from "next";
import appRedirects from "./src/lib/redirects";

// Set SITE_NOINDEX=true in the Railway staging environment only.
// Keeps staging out of every search engine while staying publicly viewable.
const noindex = process.env.SITE_NOINDEX === "true";

const nextConfig: NextConfig = {
  transpilePackages: ['@therobotage/ui'],
  async redirects() {
    return appRedirects
  },
  async headers() {
    if (!noindex) return []
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
        ],
      },
    ]
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
