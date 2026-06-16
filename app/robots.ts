import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/** robots.txt — allow the public site, keep dashboard/auth out of indexes. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard/", "/auth/"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
