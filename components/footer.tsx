/**
 * Site footer with navigation, contact info, and legal links.
 * Content here is placeholder copy; in production it reads from `site_settings`.
 */
import Link from "next/link";
import { Home } from "lucide-react";

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
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2 font-semibold text-slate-900">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-700 text-white">
                <Home className="h-5 w-5" />
              </span>
              PropDrive
            </div>
            <p className="mt-3 text-sm text-slate-500">
              The real estate lead platform built for agents.
            </p>
          </div>

          {FOOTER_COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="text-sm font-semibold text-slate-900">{col.title}</h3>
              <ul className="mt-3 space-y-2">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-500 transition-colors hover:text-blue-700"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-slate-200 pt-6 text-sm text-slate-500 sm:flex-row">
          <p>&copy; {year} PropDrive. All rights reserved.</p>
          <p>Equal Housing Opportunity. DRE License # 00000000.</p>
        </div>
      </div>
    </footer>
  );
}
