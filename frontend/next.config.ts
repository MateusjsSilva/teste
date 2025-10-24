import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  turbopack: {
    root: './src'
  }
};

export default nextConfig;
