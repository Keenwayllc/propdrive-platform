import type { MetadataRoute } from "next";

/** robots.txt — allow the public site, keep dashboard/auth out of indexes. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard/", "/auth/"],
    },
    sitemap: "https://getpropdrive.com/sitemap.xml",
  };
}
