/**
 * Terms of service. Body is owner-editable from the dashboard (Pages → Terms);
 * falls back to placeholder template copy. Either way it must be reviewed by the
 * buyer's legal counsel before going live (see docs/BUYER-SETUP.md).
 */
import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/queries";
import { DEFAULT_TERMS_BODY } from "@/lib/form-schemas";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms governing use of this website.",
};

export default async function TermsPage() {
  const site = await getSiteSettings();
  const body = site?.terms_body?.trim() || DEFAULT_TERMS_BODY;
  const updated = site?.terms_updated?.trim();
  const paragraphs = body.split(/\n{2,}/).filter((p) => p.trim() !== "");

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-bold text-ink">Terms of Service</h1>
      {updated && (
        <p className="mt-2 text-sm text-faint">Last updated: {updated}</p>
      )}

      <div className="mt-8 space-y-4 text-muted">
        {paragraphs.map((p, i) => (
          <p key={i} className="leading-relaxed">
            {p}
          </p>
        ))}
      </div>
    </div>
  );
}
