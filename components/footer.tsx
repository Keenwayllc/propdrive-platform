/**
 * Site footer — large editorial wordmark, link columns, and a CTA strip.
 * Content is placeholder; in production it reads from `site_settings`.
 */
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const FOOTER_COLUMNS: ReadonlyArray<{
  title: string;
  links: ReadonlyArray<{ href: string; label: string }>;
}> = [
  {
    title: "Explore",
    links: [
      { href: "/properties", label: "All Properties" },
      { href: "/neighborhoods", label: "Neighborhoods" },
      { href: "/open-houses", label: "Open Houses" },
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

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-ink text-background">
      {/* CTA strip */}
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
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-background text-ink">
                <span className="font-display text-lg leading-none">P</span>
              </span>
              <span className="text-lg font-semibold tracking-tight">PropDrive</span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/55">
              The real estate lead platform built for agents — listings, a lead
              CRM, and a brand-ready public site.
            </p>
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
          <p>&copy; {year} PropDrive. All rights reserved.</p>
          <p>Equal Housing Opportunity &middot; DRE License #00000000</p>
        </div>
      </div>
    </footer>
  );
}
