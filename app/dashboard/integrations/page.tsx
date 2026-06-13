/**
 * Integrations page. Lists third-party services the platform can connect to and
 * shows live connection status derived from environment variables. Server
 * component — reads process.env at request time. Env vars are referenced
 * statically (not via dynamic keys) so Next's build-time inlining works.
 */
import {
  Database,
  Mail,
  MessageSquare,
  Sparkles,
  MapPin,
  CreditCard,
  CheckCircle2,
  Circle,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const INTEGRATIONS: ReadonlyArray<{
  icon: LucideIcon;
  name: string;
  purpose: string;
  envVar: string;
  required: boolean;
  configured: boolean;
}> = [
  {
    icon: Database,
    name: "Supabase",
    purpose: "Database, auth & storage",
    envVar: "NEXT_PUBLIC_SUPABASE_URL",
    required: true,
    configured: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
  },
  {
    icon: Mail,
    name: "Resend",
    purpose: "Transactional email",
    envVar: "RESEND_API_KEY",
    required: false,
    configured: Boolean(process.env.RESEND_API_KEY),
  },
  {
    icon: MessageSquare,
    name: "Twilio",
    purpose: "SMS notifications",
    envVar: "TWILIO_ACCOUNT_SID",
    required: false,
    configured: Boolean(process.env.TWILIO_ACCOUNT_SID),
  },
  {
    icon: Sparkles,
    name: "OpenAI",
    purpose: "AI content tools",
    envVar: "OPENAI_API_KEY",
    required: false,
    configured: Boolean(process.env.OPENAI_API_KEY),
  },
  {
    icon: MapPin,
    name: "Google Maps",
    purpose: "Property maps",
    envVar: "NEXT_PUBLIC_GOOGLE_MAPS_API_KEY",
    required: false,
    configured: Boolean(process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY),
  },
  {
    icon: CreditCard,
    name: "Stripe",
    purpose: "Payments (optional)",
    envVar: "STRIPE_SECRET_KEY",
    required: false,
    configured: Boolean(process.env.STRIPE_SECRET_KEY),
  },
];

export default function IntegrationsPage() {
  const connectedCount = INTEGRATIONS.filter((s) => s.configured).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ink">Integrations</h1>
          <p className="mt-1 text-sm text-muted">
            Connect services via environment variables. See
            docs/THIRD_PARTY_SERVICES.md for setup instructions.
          </p>
        </div>
        <span className="rounded-full border border-line bg-white px-3 py-1 text-xs font-medium text-muted">
          {connectedCount} of {INTEGRATIONS.length} connected
        </span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {INTEGRATIONS.map((svc) => (
          <div
            key={svc.name}
            className="flex items-start gap-4 rounded-xl border border-line bg-white p-5 shadow-sm"
          >
            <span
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${
                svc.configured ? "bg-accent-soft text-accent" : "bg-line text-faint"
              }`}
            >
              <svc.icon className="h-6 w-6" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-ink">{svc.name}</h3>
                {svc.required && (
                  <span className="rounded-full bg-accent-soft px-2 py-0.5 text-xs font-medium text-accent">
                    Required
                  </span>
                )}
              </div>
              <p className="text-sm text-muted">{svc.purpose}</p>
              <code className="mt-1 block truncate text-xs text-faint">
                {svc.envVar}
              </code>

              <div className="mt-3">
                {svc.configured ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Connected
                  </span>
                ) : (
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                      svc.required
                        ? "bg-red-50 text-red-700"
                        : "bg-line/60 text-muted"
                    }`}
                  >
                    <Circle className="h-3.5 w-3.5" />
                    {svc.required ? "Action needed" : "Not configured"}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
