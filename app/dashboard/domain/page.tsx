/**
 * Domain page — explains how the owner connects their own custom domain. The
 * site runs on Vercel, so this is a DNS + Vercel task (no code). Shows the exact
 * records to copy and an honest "or have it done for you" option.
 */
import { Globe, CheckCircle2, ExternalLink, Mail } from "lucide-react";
import CopyButton from "@/components/copy-button";
import { SITE_URL, SUPPORT_EMAIL } from "@/lib/site";

const DNS_RECORDS = [
  {
    type: "A",
    name: "@ (root / apex)",
    value: "76.76.21.21",
    note: "Points yourdomain.com to the site.",
  },
  {
    type: "CNAME",
    name: "www",
    value: "cname.vercel-dns.com",
    note: "Points www.yourdomain.com to the site.",
  },
];

export default function DomainPage() {
  const currentHost = SITE_URL.replace(/^https?:\/\//, "");

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink">Domain</h1>
        <p className="mt-1 text-sm text-muted">
          Use your own web address (like yourname.com) instead of the default.
        </p>
      </div>

      {/* Current domain */}
      <div className="flex items-center gap-3 rounded-xl border border-line bg-white p-4 shadow-sm">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent-soft text-accent">
          <Globe className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-[0.12em] text-faint">
            Your site is live at
          </p>
          <p className="truncate font-medium text-ink">{currentHost}</p>
        </div>
      </div>

      {/* Do it for you */}
      <div className="rounded-xl border border-accent/30 bg-accent-soft/50 p-4 text-sm">
        <p className="font-medium text-ink">
          Want this done for you? Domain &amp; Launch Setup, $99 one-time
        </p>
        <p className="mt-1 text-muted">
          Connecting a domain takes about ten minutes but involves DNS settings.
          If you would rather not touch that, we will connect your domain,
          verify it, and confirm your site is live and secure for a one-time fee
          of $99. Prefer to do it yourself? Follow the four free steps below.
        </p>
        {SUPPORT_EMAIL && (
          <a
            href={`mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(
              "Domain & Launch Setup ($99)"
            )}`}
            className="mt-3 inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent"
          >
            <Mail className="h-4 w-4" /> Email us to set it up
          </a>
        )}
      </div>

      {/* Steps */}
      <ol className="space-y-4">
        <Step n={1} title="Buy a domain (skip if you already own one)">
          Get your domain from any registrar, for example Namecheap, GoDaddy, or
          Google Domains. A standard .com is usually about ten to fifteen dollars
          a year.
        </Step>

        <Step n={2} title="Add the domain in Vercel">
          <p>
            Open your project in{" "}
            <a
              href="https://vercel.com/dashboard"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-medium text-accent hover:underline"
            >
              Vercel <ExternalLink className="h-3.5 w-3.5" />
            </a>
            , go to <strong>Settings → Domains</strong>, type your domain, and
            click <strong>Add</strong>. Vercel will then show you the records to
            enter in step 3.
          </p>
        </Step>

        <Step n={3} title="Add these records at your registrar">
          <p className="mb-3">
            In your registrar&apos;s DNS settings, add the two records below.
            These are the standard Vercel values; if Vercel shows you different
            ones in step 2, use those instead.
          </p>
          <div className="space-y-2">
            {DNS_RECORDS.map((r) => (
              <div
                key={r.type}
                className="rounded-lg border border-line bg-surface/60 p-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <span className="rounded bg-ink/5 px-1.5 py-0.5 font-mono text-xs font-semibold text-ink">
                      {r.type}
                    </span>
                    <span className="text-sm text-muted">
                      Name: <code className="text-ink">{r.name}</code>
                    </span>
                    <span className="text-sm text-muted">
                      Value: <code className="text-ink">{r.value}</code>
                    </span>
                  </div>
                  <CopyButton value={r.value} />
                </div>
                <p className="mt-1.5 text-xs text-faint">{r.note}</p>
              </div>
            ))}
          </div>
        </Step>

        <Step n={4} title="Tell the site its new address">
          <p>
            In Vercel, go to <strong>Settings → Environment Variables</strong>,
            add a variable named <code className="text-ink">NEXT_PUBLIC_SITE_URL</code>{" "}
            set to your full address (for example{" "}
            <code className="text-ink">https://www.yourdomain.com</code>), then
            redeploy. This keeps your search-engine links, sitemap, and social
            previews pointed at your domain.
          </p>
          <div className="mt-2 flex items-center justify-between gap-3 rounded-lg border border-line bg-surface/60 px-3 py-2">
            <code className="truncate text-xs text-ink">NEXT_PUBLIC_SITE_URL</code>
            <CopyButton value="NEXT_PUBLIC_SITE_URL" />
          </div>
        </Step>
      </ol>

      {/* Done */}
      <div className="flex items-start gap-3 rounded-xl border border-line bg-white p-4 text-sm shadow-sm">
        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
        <p className="text-muted">
          DNS changes can take anywhere from a few minutes to a few hours to take
          effect. Once verified, Vercel issues a free SSL certificate
          automatically, so your site loads securely on the new domain with the
          padlock. Nothing else needs to change.
        </p>
      </div>
    </div>
  );
}

function Step({
  n,
  title,
  children,
}: {
  n: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <li className="rounded-xl border border-line bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ink text-sm font-semibold text-white">
          {n}
        </span>
        <h2 className="font-semibold text-ink">{title}</h2>
      </div>
      <div className="mt-2.5 pl-10 text-sm leading-relaxed text-muted">
        {children}
      </div>
    </li>
  );
}
