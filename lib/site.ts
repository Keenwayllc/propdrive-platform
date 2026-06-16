/**
 * Canonical public base URL for the site. A new owner running PropDrive on their
 * own domain just sets NEXT_PUBLIC_SITE_URL (e.g. https://www.youragency.com) in
 * Vercel, and everything that needs an absolute URL (sitemap, robots, canonical
 * tags, Open Graph images, and listing structured data) follows automatically.
 * Falls back to the original domain when unset.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://getpropdrive.com"
).replace(/\/+$/, "");

/**
 * Support / owner contact email shown inside the dashboard (e.g. the Domain page
 * "done for you" offer and a "Need help?" link). Set NEXT_PUBLIC_SUPPORT_EMAIL
 * to the address where you want customers and buyers to reach you. Empty by
 * default so nothing is shown until an owner sets it.
 */
export const SUPPORT_EMAIL = (process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "").trim();
