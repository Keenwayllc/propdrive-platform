/**
 * Site footer — large editorial CTA, link columns, and identity/contact info,
 * fed by the editable site_settings / brand_settings.
 */
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SocialIcon, SOCIAL_PLATFORMS } from "@/components/social-icons";
import type { SiteSettings, BrandSettings } from "@/lib/types";

const FOOTER_COLUMNS: ReadonlyArray<{
  title: string;
  links: ReadonlyArray<{ href: string; label: string }>;
}> = [
  {
    title: "Explore",
    links: [
      { href: "/properties", label: "All Properties" },
      { href: "/open-houses", label: "Open Houses" },
      { href: "/home-valuation", label: "Home Valuation" },
    ],
  },
  {
    title: "Tools",
    links: [
      { href: "/home-valuation", label: "Home Valuation" },
      { href: "/mortgage-calculator", label: "Mortgage Calculator" },
      { href: "/contact", label: "Contact an Agent" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/terms", label: "Terms of Service" },
    ],
  },
];

export interface FooterProps {
  site?: SiteSettings | null;
  brand?: BrandSettings | null;
}

export default function Footer({ site, brand }: FooterProps) {
  const year = new Date().getFullYear();
  const company = site?.company_name || brand?.company_name || "PropDrive";
  const initial = company.trim().charAt(0).toUpperCase() || "P";
  const logoUrl = brand?.logo_url ?? null;
  const logoLightUrl = brand?.logo_light_url ?? null;
  const tagline =
    site?.footer_text || "A professional realtor website with a built-in admin dashboard.";
  const license = brand?.license_number || "DRE License #00000000";
  const social = site?.social_links ?? {};

  const socialLinks = SOCIAL_PLATFORMS.map((p) => ({
    key: p.key,
    label: p.label,
    href: social[p.key],
  })).filter((s) => s.href && s.href.trim() !== "");

  return (
    <footer className="bg-ink text-background">
      <div className="mx-auto max-w-7xl px-4 pt-16 sm:px-6">
        <div className="flex flex-col items-start justify-between gap-6 border-b border-white/10 pb-12 md:flex-row md:items-end">
          <h2 className="max-w-xl font-display text-3xl font-medium leading-tight tracking-tight sm:text-4xl">
            Ready to find your place in Los Angeles?
          </h2>
          <Link
            href="/contact"
            className="group inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-strong active:translate-y-px"
          >
            Start a conversation
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <div className="flex items-center gap-2.5">
              {logoLightUrl ? (
                // Brand-provided light logo — sits directly on the dark footer.
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={logoLightUrl}
                  alt={company}
                  className="h-8 w-auto max-w-[190px] object-contain"
                />
              ) : logoUrl ? (
                // No light version: place the main logo on a light chip so any
                // logo stays legible on the dark background.
                <span className="inline-flex items-center rounded-lg bg-background px-2.5 py-1.5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={logoUrl}
                    alt={company}
                    className="h-7 w-auto max-w-[170px] object-contain"
                  />
                </span>
              ) : (
                <>
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-background text-ink">
                    <span className="font-display text-lg leading-none">{initial}</span>
                  </span>
                  <span className="text-lg font-semibold tracking-tight">{company}</span>
                </>
              )}
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/55">
              {tagline}
            </p>

            {socialLinks.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-2.5">
                {socialLinks.map((s) => (
                  <a
                    key={s.key}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    title={s.label}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/70 transition-colors hover:border-white/40 hover:bg-white/10 hover:text-white"
                  >
                    <SocialIcon name={s.key} className="h-4 w-4" />
                  </a>
                ))}
              </div>
            )}
          </div>

          {FOOTER_COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-white/40">
                {col.title}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/70 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-white/10 pt-6 text-xs text-white/45 sm:flex-row sm:items-center">
          <p>
            &copy; {year} {company}. All rights reserved.
          </p>
          <p>Equal Housing Opportunity &middot; {license}</p>
        </div>
      </div>
    </footer>
  );
}
