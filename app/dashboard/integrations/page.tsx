/**
 * Integrations page. Lists third-party services, shows live connection status
 * from env vars, and gives each one a self-serve setup guide (where to get the
 * key, the exact env var names with copy buttons, and how to apply them in
 * Vercel). Server component — reads process.env at request time; env vars are
 * referenced statically so Next's build-time inlining works.
 */
import {
  Database,
  Mail,
  MessageSquare,
  Sparkles,
  MapPin,
  CreditCard,
  BarChart3,
  CheckCircle2,
  Circle,
  ExternalLink,
  ChevronDown,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import CopyButton from "@/components/copy-button";
import { getOpenAiKeyStatus } from "@/lib/queries";

type Integration = {
  icon: LucideIcon;
  name: string;
  purpose: string;
  required: boolean;
  configured: boolean;
  /** Where the customer gets the key. */
  docsUrl: string;
  docsLabel: string;
  /** All env vars this service needs (first is used for the status check). */
  envVars: string[];
  /** OpenAI can also be connected from the dashboard (no Vercel needed). */
  dashboardConnect?: string;
  /** A short orienting note shown at the top of the setup steps. */
  note?: string;
  /** Provider APIs the customer must turn on (e.g. Google Cloud APIs), each
   *  with a plain-language description of what it powers in PropDrive. */
  enableApis?: { name: string; what: string }[];
};

function buildIntegrations(openaiConfigured: boolean): Integration[] {
  return [
  {
    icon: Database,
    name: "Supabase",
    purpose: "Database, auth & storage",
    required: true,
    configured: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
    docsUrl: "https://supabase.com/dashboard/project/_/settings/api",
    docsLabel: "Supabase API settings",
    envVars: ["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY"],
  },
  {
    icon: Mail,
    name: "Resend",
    purpose: "Transactional email",
    required: false,
    configured: Boolean(process.env.RESEND_API_KEY),
    docsUrl: "https://resend.com/api-keys",
    docsLabel: "Resend API keys",
    envVars: ["RESEND_API_KEY", "NOTIFY_TO", "NOTIFY_FROM"],
    note:
      "For a quick test, add RESEND_API_KEY and set NOTIFY_TO to the email you signed up to Resend with (the shared test sender only delivers to the account owner). To send from your own address in production, verify your domain in Resend and set NOTIFY_FROM. NOTIFY_FROM is optional.",
  },
  {
    icon: MessageSquare,
    name: "Twilio",
    purpose: "SMS notifications",
    required: false,
    configured: Boolean(process.env.TWILIO_ACCOUNT_SID),
    docsUrl: "https://console.twilio.com",
    docsLabel: "Twilio Console",
    envVars: ["TWILIO_ACCOUNT_SID", "TWILIO_AUTH_TOKEN", "TWILIO_PHONE_NUMBER"],
  },
  {
    icon: Sparkles,
    name: "OpenAI",
    purpose: "AI content tools",
    required: false,
    configured: openaiConfigured,
    docsUrl: "https://platform.openai.com/api-keys",
    docsLabel: "OpenAI API keys",
    envVars: ["OPENAI_API_KEY"],
    dashboardConnect: "/dashboard/ai-tools",
  },
  {
    icon: MapPin,
    name: "Google Maps",
    purpose: "Upgraded property maps & address autocomplete",
    required: false,
    configured: Boolean(process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY),
    docsUrl: "https://console.cloud.google.com/google/maps-apis/credentials",
    docsLabel: "Google Maps credentials",
    envVars: ["NEXT_PUBLIC_GOOGLE_MAPS_API_KEY"],
    note:
      "Optional. Your maps and address autocomplete already work for free using OpenStreetMap, no key needed. Add a Google key only if you want Google's maps and Places autocomplete. Google requires a billing account, though its free monthly credit covers most small sites.",
    enableApis: [
      {
        name: "Maps JavaScript API",
        what: "Draws the interactive map with pins on your property pages.",
      },
      {
        name: "Places API",
        what: "Powers the address suggestions that appear as visitors type in your forms.",
      },
      {
        name: "Geocoding API",
        what: "Turns a street address into map coordinates so each listing's pin lands in the right spot.",
      },
    ],
  },
  {
    icon: BarChart3,
    name: "Google Analytics",
    purpose: "Visitor & traffic stats (GA4)",
    required: false,
    configured: Boolean(process.env.NEXT_PUBLIC_GA_ID),
    docsUrl: "https://analytics.google.com/",
    docsLabel: "Google Analytics",
    envVars: ["NEXT_PUBLIC_GA_ID"],
    note:
      "Recommended if you plan to sell on a marketplace. Create a free GA4 property, copy its Measurement ID (looks like G-XXXXXXXXXX), and add it below. Listings with Analytics connected attract noticeably more buyer interest.",
  },
  {
    icon: CreditCard,
    name: "Stripe",
    purpose: "Payments (optional)",
    required: false,
    configured: Boolean(process.env.STRIPE_SECRET_KEY),
    docsUrl: "https://dashboard.stripe.com/apikeys",
    docsLabel: "Stripe API keys",
    envVars: ["STRIPE_SECRET_KEY"],
  },
  ];
}

export default async function IntegrationsPage() {
  const openai = await getOpenAiKeyStatus();
  const INTEGRATIONS = buildIntegrations(openai.source !== null);
  const connectedCount = INTEGRATIONS.filter((s) => s.configured).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ink">Integrations</h1>
          <p className="mt-1 text-sm text-muted">
            Connect a service by adding its key. Open the setup steps on any card
            below.
          </p>
        </div>
        <span className="rounded-full border border-line bg-white px-3 py-1 text-xs font-medium text-muted">
          {connectedCount} of {INTEGRATIONS.length} connected
        </span>
      </div>

      {/* How keys are applied — one-time orientation */}
      <div className="rounded-xl border border-line bg-accent-soft/50 p-4 text-sm text-ink">
        <p className="font-medium">How setup works</p>
        <p className="mt-1 text-muted">
          Keys are stored as secure environment variables in your Vercel project
          (not in this page). For each service: get the key from the provider,
          add it in{" "}
          <span className="font-medium text-ink">
            Vercel → your project → Settings → Environment Variables
          </span>
          , then redeploy. Each card below has the exact variable names to copy.
        </p>
        <p className="mt-2 text-muted">
          <span className="font-medium text-ink">Only Supabase is required</span>{" "}
          to run PropDrive. Everything else is optional and adds a feature:
          Resend sends lead and alert emails, Twilio sends SMS, OpenAI powers the
          AI writing tools, Stripe takes payments, and Google Maps upgrades your
          maps. Your maps and address autocomplete already work for free with
          OpenStreetMap, so Google Maps is only needed if you want Google&apos;s
          version.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {INTEGRATIONS.map((svc) => (
          <div
            key={svc.name}
            className="rounded-xl border border-line bg-white p-5 shadow-sm"
          >
            <div className="flex items-start gap-4">
              <span
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${
                  svc.configured
                    ? "bg-accent-soft text-accent"
                    : "bg-line text-faint"
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
              </div>

              {svc.configured ? (
                <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Connected
                </span>
              ) : (
                <span
                  className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                    svc.required
                      ? "bg-red-50 text-red-700"
                      : "bg-line/60 text-muted"
                  }`}
                >
                  <Circle className="h-3.5 w-3.5" />
                  {svc.required ? "Action needed" : "Not set"}
                </span>
              )}
            </div>

            {/* Self-serve setup guide */}
            <details className="group mt-4 border-t border-line pt-3">
              <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-medium text-ink [&::-webkit-details-marker]:hidden">
                {svc.configured ? "View / update setup" : "Setup instructions"}
                <ChevronDown className="h-4 w-4 text-faint transition-transform group-open:rotate-180" />
              </summary>

              <div className="mt-3 space-y-3 text-sm">
                {svc.note && (
                  <p className="rounded-lg bg-amber-50 px-3 py-2 text-amber-800">
                    {svc.note}
                  </p>
                )}
                {svc.enableApis && (
                  <div>
                    <p className="font-medium text-ink">
                      Turn on these APIs in Google Cloud
                    </p>
                    <p className="mt-0.5 text-muted">
                      In the Google Cloud console, open APIs &amp; Services →
                      Library, then enable each one (they all use the same key):
                    </p>
                    <ul className="mt-1.5 space-y-1.5">
                      {svc.enableApis.map((api) => (
                        <li
                          key={api.name}
                          className="rounded-md bg-surface/60 px-2.5 py-1.5"
                        >
                          <code className="text-xs font-semibold text-ink">
                            {api.name}
                          </code>
                          <span className="mt-0.5 block text-xs text-muted">
                            {api.what}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {svc.dashboardConnect && (
                  <div className="rounded-lg border border-accent/30 bg-accent-soft/50 p-3">
                    <p className="font-medium text-ink">
                      Easier — no Vercel needed
                    </p>
                    <p className="mt-0.5 text-muted">
                      You can paste this key right in the dashboard instead.{" "}
                      <Link
                        href={svc.dashboardConnect}
                        className="font-medium text-accent hover:underline"
                      >
                        Connect on the AI Tools page →
                      </Link>
                    </p>
                  </div>
                )}
                <div>
                  <p className="font-medium text-ink">
                    {svc.dashboardConnect ? "Or, set a Vercel env var — " : ""}1.
                    Get your key
                  </p>
                  <a
                    href={svc.docsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-flex items-center gap-1.5 text-accent hover:underline"
                  >
                    Open {svc.docsLabel}
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>

                <div>
                  <p className="font-medium text-ink">
                    2. Add{" "}
                    {svc.envVars.length > 1
                      ? `these ${svc.envVars.length} variables`
                      : "this variable"}{" "}
                    in Vercel
                  </p>
                  <ul className="mt-1.5 space-y-1.5">
                    {svc.envVars.map((v) => (
                      <li
                        key={v}
                        className="flex items-center justify-between gap-2 rounded-md bg-surface/60 px-2.5 py-1.5"
                      >
                        <code className="truncate text-xs text-ink">{v}</code>
                        <CopyButton value={v} />
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p className="font-medium text-ink">3. Redeploy</p>
                  <p className="mt-1 text-muted">
                    In Vercel, redeploy the project so the new key takes effect.
                    This card will switch to{" "}
                    <span className="font-medium text-green-700">Connected</span>.
                  </p>
                </div>
              </div>
            </details>
          </div>
        ))}
      </div>
    </div>
  );
}
