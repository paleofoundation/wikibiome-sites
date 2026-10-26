import type { NextConfig } from "next";
import { articleAliasRedirects } from "./lib/article-alias-redirects.mjs";

const nextConfig: NextConfig = {
  // WB-COST-KILL-1: serve stable original assets without paid transformations.
  images: { unoptimized: true },
  async redirects() {
    return [...articleAliasRedirects];
  },
};

export default nextConfig;
