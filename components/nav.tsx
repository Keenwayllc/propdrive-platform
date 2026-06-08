"use client";

/**
 * Site header / primary navigation.
 * Includes the PropDrive wordmark, desktop links, and a mobile menu toggle.
 */
import { useState } from "react";
import Link from "next/link";
import { Home, Menu, X } from "lucide-react";

const NAV_LINKS: ReadonlyArray<{ href: string; label: string }> = [
  { href: "/properties", label: "Properties" },
  { href: "/neighborhoods", label: "Neighborhoods" },
  { href: "/open-houses", label: "Open Houses" },
  { href: "/home-valuation", label: "Home Value" },
  { href: "/mortgage-calculator", label: "Mortgage" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold text-slate-900">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-700 text-white">
            <Home className="h-5 w-5" />
          </span>
          <span className="text-lg tracking-tight">PropDrive</span>
        </Link>

        <ul className="hidden items-center gap-6 lg:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-sm font-medium text-slate-600 transition-colors hover:text-blue-700"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden lg:block">
          <Link
            href="/auth/login"
            className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-800"
          >
            Agent Login
          </Link>
        </div>

        <button
          type="button"
          aria-label="Toggle navigation menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="rounded-lg p-2 text-slate-700 lg:hidden"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-slate-200 bg-white lg:hidden">
          <ul className="flex flex-col px-4 py-2">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block py-2 text-sm font-medium text-slate-700"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/auth/login"
                onClick={() => setOpen(false)}
                className="mt-2 block rounded-lg bg-blue-700 px-4 py-2 text-center text-sm font-semibold text-white"
              >
                Agent Login
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
