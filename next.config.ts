import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Royalty-free image hosts used by seed data / demo content.
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "images.pexels.com" },
    ],
  },
};

export default nextConfig;
