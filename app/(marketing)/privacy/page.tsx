/**
 * Privacy policy. Body is owner-editable from the dashboard (Pages → Privacy);
 * falls back to placeholder template copy. Either way it must be reviewed by the
 * buyer's legal counsel before going live (see docs/BUYER-SETUP.md).
 */
import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/queries";
import { DEFAULT_PRIVACY_BODY } from "@/lib/form-schemas";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How we handle your personal information.",
};

export default async function PrivacyPage() {
  const site = await getSiteSettings();
  const body = site?.privacy_body?.trim() || DEFAULT_PRIVACY_BODY;
  const updated = site?.privacy_updated?.trim();
  const paragraphs = body.split(/\n{2,}/).filter((p) => p.trim() !== "");

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-bold text-ink">Privacy Policy</h1>
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
