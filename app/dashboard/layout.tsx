"use client";

/**
 * Dashboard shell — sidebar navigation + content area.
 *
 * Route protection is enforced by proxy.ts (redirects signed-out users to
 * /auth/login). This client shell adds the signed-in email + sign-out control.
 *
 * Responsive: the sidebar collapses below `lg` into a slide-in drawer reached
 * from a hamburger in the top bar, so the dashboard is fully usable on phones
 * and tablets.
 */
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  Building2,
  Pencil,
  Palette,
  Images,
  Quote,
  Settings,
  LogOut,
  Menu,
  X,
  LifeBuoy,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { LogoBadge } from "@/components/logo";
import ScrollToTop from "@/components/scroll-to-top";
import { supabase } from "@/lib/supabase-client";
import { signOut } from "@/lib/auth";
import { SUPPORT_EMAIL } from "@/lib/site";

/** "Need help?" support link, shown when a support email is configured. */
function SupportLink({ onNavigate }: { onNavigate?: () => void }) {
  if (!SUPPORT_EMAIL) return null;
  return (
    <a
      href={`mailto:${SUPPORT_EMAIL}?subject=PropDrive%20support`}
      onClick={onNavigate}
      className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted transition-colors hover:bg-line"
    >
      <LifeBuoy className="h-5 w-5 shrink-0" /> Need help?
    </a>
  );
}

const EASE = [0.16, 1, 0.3, 1] as const;

const NAV: ReadonlyArray<{ href: string; label: string; icon: LucideIcon }> = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/leads", label: "Leads", icon: Users },
  { href: "/dashboard/appointments", label: "Appointments", icon: CalendarCheck },
  { href: "/dashboard/properties", label: "Properties", icon: Building2 },
  { href: "/dashboard/website-editor", label: "Website Editor", icon: Pencil },
  { href: "/dashboard/banners", label: "Banners", icon: Images },
  { href: "/dashboard/branding", label: "Branding", icon: Palette },
  { href: "/dashboard/testimonials", label: "Testimonials", icon: Quote },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

function NavLinks({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <nav className="p-3">
      {NAV.map((item) => {
        const active =
          item.href === "/dashboard"
            ? pathname === "/dashboard"
            : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={`mb-1 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              active ? "bg-accent-soft text-accent" : "text-muted hover:bg-line"
            }`}
          >
            <item.icon className="h-5 w-5 shrink-0" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const [navOpen, setNavOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? null));
  }, []);

  // Lock background scroll while the drawer is open.
  useEffect(() => {
    document.body.style.overflow = navOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [navOpen]);

  async function handleSignOut() {
    await signOut();
    router.refresh();
    router.push("/auth/login");
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-line bg-white lg:flex">
        <div className="flex h-16 items-center gap-2 border-b border-line px-6 text-ink">
          <LogoBadge size={32} />
          <span className="font-display text-xl tracking-tight">PropDrive</span>
        </div>
        <div className="flex-1 overflow-y-auto">
          <NavLinks pathname={pathname} />
        </div>
        {SUPPORT_EMAIL && (
          <div className="border-t border-line p-3">
            <SupportLink />
          </div>
        )}
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {navOpen && (
          <div className="lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setNavOpen(false)}
              className="fixed inset-0 z-50 bg-ink/40 backdrop-blur-sm"
              aria-hidden="true"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.32, ease: EASE }}
              className="fixed inset-y-0 left-0 z-50 flex w-72 max-w-[82%] flex-col bg-white shadow-2xl"
              role="dialog"
              aria-modal="true"
              aria-label="Dashboard navigation"
            >
              <div className="flex h-16 items-center justify-between border-b border-line pl-6 pr-3 text-ink">
                <span className="flex items-center gap-2">
                  <LogoBadge size={30} />
                  <span className="font-display text-xl tracking-tight">PropDrive</span>
                </span>
                <button
                  type="button"
                  onClick={() => setNavOpen(false)}
                  aria-label="Close navigation"
                  className="flex h-10 w-10 items-center justify-center rounded-lg text-muted hover:bg-line"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">
                <NavLinks pathname={pathname} onNavigate={() => setNavOpen(false)} />
              </div>
              <div className="border-t border-line p-3">
                <SupportLink onNavigate={() => setNavOpen(false)} />
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-line"
                >
                  <LogOut className="h-5 w-5 shrink-0" /> Sign out
                </button>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 items-center justify-between gap-3 border-b border-line bg-white px-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-2.5">
            <button
              type="button"
              onClick={() => setNavOpen(true)}
              aria-label="Open navigation"
              className="flex h-10 w-10 items-center justify-center rounded-lg text-ink hover:bg-background lg:hidden"
            >
              <Menu className="h-6 w-6" />
            </button>
            <Link href="/dashboard" className="lg:hidden" aria-label="PropDrive dashboard">
              <LogoBadge size={28} />
            </Link>
            <span className="hidden truncate text-sm text-muted lg:block">
              {email ? `Signed in as ${email}` : "Agent Dashboard"}
            </span>
          </div>
          <div className="flex shrink-0 items-center gap-2 sm:gap-4">
            <Link
              href="/"
              className="text-sm font-medium text-accent hover:underline"
            >
              View site
            </Link>
            <button
              type="button"
              onClick={handleSignOut}
              className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-sm font-medium text-ink transition-colors hover:bg-background"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>

      <ScrollToTop />
    </div>
  );
}
