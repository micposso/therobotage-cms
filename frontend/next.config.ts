import type { NextConfig } from "next";
import appRedirects from "./src/lib/redirects";
import imageAssets from './src/lib/image-assets.json';

const imageOrigins = [...new Set(Object.values(imageAssets).map(value => new URL(value).origin))];

// Set SITE_NOINDEX=true in the Railway staging environment only.
// Keeps staging out of every search engine while staying publicly viewable.
const noindex = process.env.SITE_NOINDEX === "true";

const nextConfig: NextConfig = {
  transpilePackages: ['@therobotage/ui'],
  outputFileTracingIncludes: {
    '/*': ['./translations/**/*.md', './news/*.md', './robots-profiles/*.md', './robots/*.md', './jobs/*.md', './src/content/scores/*.md'],
  },
  async redirects() {
    return [
      ...appRedirects,
      ...Object.entries(imageAssets).filter(([source]) => source.startsWith('/')).map(([source, destination]) => ({ source, destination, permanent: false })),
    ]
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
      ...imageOrigins.map(origin => ({ protocol: 'https' as const, hostname: new URL(origin).hostname, pathname: '/website/**' })),
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
    dangerouslyAllowLocalIP: true,
  },
};

export default nextConfig;
