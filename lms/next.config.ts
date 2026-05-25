import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  reactCompiler: true,
  transpilePackages: ['@therobotage/ui'],
};

export default nextConfig;
