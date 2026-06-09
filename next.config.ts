import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Royalty-free image hosts used by seed data / demo content.
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "images.pexels.com" },
      // Supabase Storage (uploaded listing photos). Wildcard keeps it portable
      // for the buyer's own project after transfer.
      { protocol: "https", hostname: "**.supabase.co" },
    ],
  },
};

export default nextConfig;
