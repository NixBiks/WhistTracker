import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: { unoptimized: true },
  // Uncomment and set this if deploying to github.io/repo-name (not custom domain)
  // basePath: '/your-repo-name',
};

export default nextConfig;
