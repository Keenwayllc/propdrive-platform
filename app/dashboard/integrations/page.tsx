/**
 * Integrations page. Lists third-party services the platform can connect to
 * and their configuration source. Status is derived from env vars in Phase 2.
 */
import { Database, Mail, MessageSquare, Sparkles, MapPin, CreditCard } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const INTEGRATIONS: ReadonlyArray<{
  icon: LucideIcon;
  name: string;
  purpose: string;
  envVar: string;
  required: boolean;
}> = [
  { icon: Database, name: "Supabase", purpose: "Database, auth & storage", envVar: "NEXT_PUBLIC_SUPABASE_URL", required: true },
  { icon: Mail, name: "Resend", purpose: "Transactional email", envVar: "RESEND_API_KEY", required: false },
  { icon: MessageSquare, name: "Twilio", purpose: "SMS notifications", envVar: "TWILIO_ACCOUNT_SID", required: false },
  { icon: Sparkles, name: "OpenAI", purpose: "AI content tools", envVar: "OPENAI_API_KEY", required: false },
  { icon: MapPin, name: "Google Maps", purpose: "Property maps", envVar: "NEXT_PUBLIC_GOOGLE_MAPS_API_KEY", required: false },
  { icon: CreditCard, name: "Stripe", purpose: "Payments (optional)", envVar: "STRIPE_SECRET_KEY", required: false },
];

export default function IntegrationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink">Integrations</h1>
        <p className="mt-1 text-sm text-muted">
          Configure these services via environment variables. See
          docs/THIRD_PARTY_SERVICES.md for setup instructions.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {INTEGRATIONS.map((svc) => (
          <div key={svc.name} className="flex items-start gap-4 rounded-xl border border-line bg-white p-5 shadow-sm">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-line text-ink">
              <svc.icon className="h-6 w-6" />
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-ink">{svc.name}</h3>
                {svc.required && (
                  <span className="rounded-full bg-accent-soft px-2 py-0.5 text-xs font-medium text-accent">
                    Required
                  </span>
                )}
              </div>
              <p className="text-sm text-muted">{svc.purpose}</p>
              <code className="mt-1 block truncate text-xs text-faint">{svc.envVar}</code>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
