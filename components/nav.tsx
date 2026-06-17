"use client";

/**
 * Site header / primary navigation.
 * Scroll-aware backdrop, animated link underlines, a sheen-sweep CTA, and an
 * animated mobile sheet. Uses framer-motion's scroll hooks (no scroll listeners).
 */
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";

const NAV_LINKS: ReadonlyArray<{ href: string; label: string }> = [
  { href: "/properties", label: "Properties" },
  { href: "/open-houses", label: "Open Houses" },
  { href: "/home-valuation", label: "Home Value" },
  { href: "/mortgage-calculator", label: "Mortgage" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Nav({
  companyName = "PropDrive",
  logoUrl = null,
}: {
  companyName?: string;
  logoUrl?: string | null;
}) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const initial = companyName.trim().charAt(0).toUpperCase() || "P";

  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 24));

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "border-b border-line bg-background/80 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="group flex items-center gap-2.5">
          {logoUrl ? (
            // User-uploaded brand logo (arbitrary aspect) — plain img avoids
            // next/image fixed-dimension constraints for white-label logos.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={logoUrl}
              alt={companyName}
              className="h-9 w-auto max-w-[200px] object-contain"
            />
          ) : (
            <>
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-ink text-background transition-transform duration-300 group-hover:-rotate-6">
                <span className="font-display text-lg leading-none">{initial}</span>
              </span>
              <span className="text-lg font-semibold tracking-tight text-ink">
                {companyName}
              </span>
            </>
          )}
        </Link>

        <ul className="hidden items-center gap-7 lg:flex">
          {NAV_LINKS.map((link) => {
            const active = pathname.startsWith(link.href);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="group relative text-sm font-medium text-muted transition-colors hover:text-ink"
                >
                  {link.label}
                  <span
                    className={`absolute -bottom-1.5 left-0 h-px bg-accent transition-all duration-300 ${
                      active ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="hidden lg:block">
          <Link
            href="/auth/login"
            className="group relative inline-flex items-center overflow-hidden rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-background transition-colors duration-300 hover:bg-accent active:translate-y-px"
          >
            <span className="relative z-10">Agent Login</span>
            {/* Elegant sheen — a soft light glides across on hover (button stays put) */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 -translate-x-[120%] bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-[120%] motion-reduce:hidden"
            />
          </Link>
        </div>

        <button
          type="button"
          aria-label="Toggle navigation menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="rounded-xl bg-surface/60 p-2 text-ink backdrop-blur transition-colors hover:bg-surface lg:hidden"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-t border-line bg-background lg:hidden"
          >
            <ul className="flex flex-col px-4 py-3">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="block py-2.5 text-sm font-medium text-muted hover:text-ink"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/auth/login"
                  onClick={() => setOpen(false)}
                  className="mt-2 block rounded-full bg-ink px-4 py-2.5 text-center text-sm font-semibold text-background"
                >
                  Agent Login
                </Link>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
