/**
 * Layout for all public marketing pages: shared header + footer chrome, fed by
 * the editable site_settings / brand_settings. The agent's brand colors are
 * applied across the whole public site via scoped CSS vars:
 *   primary_color   -> --color-accent       (buttons, links, icons)
 *   accent_color    -> --color-accent-strong (hover states, emphasis text)
 *   secondary_color -> --color-ink          (headings & body text)
 * The soft accent tint is derived from the primary so backgrounds never clash.
 */
import type { CSSProperties } from "react";
import Nav from "@/components/nav";
import Footer from "@/components/footer";
import ScrollToTop from "@/components/scroll-to-top";
import {
  getSiteSettings,
  getBrandSettings,
  getPublishedPages,
} from "@/lib/queries";

export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [site, brand, pages] = await Promise.all([
    getSiteSettings(),
    getBrandSettings(),
    getPublishedPages(),
  ]);

  const navPages = pages
    .filter((p) => p.show_in_nav)
    .map((p) => ({ href: `/p/${p.slug}`, label: p.title }));
  const footerPages = pages
    .filter((p) => p.show_in_footer)
    .map((p) => ({ href: `/p/${p.slug}`, label: p.title }));

  const companyName = site?.company_name || brand?.company_name || "PropDrive";
  const accent = brand?.primary_color || "#006aff";
  const accentStrong = brand?.accent_color || "#0a53c2";
  const ink = brand?.secondary_color || "#15181f";
  const brandStyle = {
    "--color-accent": accent,
    "--color-accent-strong": accentStrong,
    "--color-ink": ink,
    "--color-accent-soft": `color-mix(in srgb, ${accent} 14%, white)`,
  } as CSSProperties;

  return (
    <div style={brandStyle} className="flex min-h-screen flex-col">
      <Nav companyName={companyName} logoUrl={brand?.logo_url} pages={navPages} />
      <main className="flex-1">{children}</main>
      <Footer site={site} brand={brand} pages={footerPages} />
      <ScrollToTop />
    </div>
  );
}
