"use client";

/**
 * Dashboard shell — sidebar navigation + content area.
 *
 * Route protection is enforced by proxy.ts (redirects signed-out users to
 * /auth/login). This client shell adds the signed-in email + sign-out control.
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
  Sparkles,
  Plug,
  Settings,
  LogOut,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { LogoBadge } from "@/components/logo";
import { supabase } from "@/lib/supabase-client";
import { signOut } from "@/lib/auth";

const NAV: ReadonlyArray<{ href: string; label: string; icon: LucideIcon }> = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/leads", label: "Leads", icon: Users },
  { href: "/dashboard/appointments", label: "Appointments", icon: CalendarCheck },
  { href: "/dashboard/properties", label: "Properties", icon: Building2 },
  { href: "/dashboard/website-editor", label: "Website Editor", icon: Pencil },
  { href: "/dashboard/branding", label: "Branding", icon: Palette },
  { href: "/dashboard/ai-tools", label: "AI Tools", icon: Sparkles },
  { href: "/dashboard/integrations", label: "Integrations", icon: Plug },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? null));
  }, []);

  async function handleSignOut() {
    await signOut();
    router.refresh();
    router.push("/auth/login");
  }

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden w-64 shrink-0 border-r border-line bg-white lg:block">
        <div className="flex h-16 items-center gap-2 border-b border-line px-6 text-ink">
          <LogoBadge size={32} />
          <span className="font-display text-xl tracking-tight">PropDrive</span>
        </div>
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
                className={`mb-1 flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "bg-accent-soft text-accent"
                    : "text-muted hover:bg-line"
                }`}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-line bg-white px-6">
          <span className="text-sm text-muted">
            {email ? `Signed in as ${email}` : "Agent Dashboard"}
          </span>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-sm font-medium text-accent hover:underline">
              View site
            </Link>
            <button
              type="button"
              onClick={handleSignOut}
              className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-sm font-medium text-ink transition-colors hover:bg-background"
            >
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </div>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
