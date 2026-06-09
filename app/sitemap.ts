import type { MetadataRoute } from "next";
import { getActiveProperties } from "@/lib/queries";

const BASE = "https://getpropdrive.com";

/** Sitemap: static marketing routes + every active listing. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPaths = [
    "",
    "/properties",
    "/neighborhoods",
    "/open-houses",
    "/home-valuation",
    "/mortgage-calculator",
    "/about",
    "/contact",
    "/privacy",
    "/terms",
  ];

  const staticRoutes: MetadataRoute.Sitemap = staticPaths.map((path) => ({
    url: `${BASE}${path}`,
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.7,
  }));

  const properties = await getActiveProperties();
  const propertyRoutes: MetadataRoute.Sitemap = properties.map((p) => ({
    url: `${BASE}/properties/${p.id}`,
    lastModified: new Date(p.updated_at),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...propertyRoutes];
}
