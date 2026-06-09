/**
 * Terms of service. Placeholder legal copy — must be reviewed by the buyer's
 * legal counsel before going live (see docs/TRANSFER_CHECKLIST.md).
 */
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms governing use of this website.",
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-bold text-ink">Terms of Service</h1>
      <p className="mt-2 text-sm text-faint">Last updated: placeholder</p>

      <div className="prose mt-8 max-w-none text-muted">
        <p>
          <strong>Template notice:</strong> This is placeholder legal text. Replace
          it with terms reviewed by qualified counsel before launch.
        </p>
        <h2>Use of this site</h2>
        <p>
          This website provides real estate information for general purposes.
          Listings, pricing, and availability are subject to change without notice.
        </p>
        <h2>No warranty</h2>
        <p>
          Information is provided &quot;as is&quot; without warranties of any kind.
          Verify all details independently before making decisions.
        </p>
        <h2>Contact</h2>
        <p>
          Questions about these terms can be directed to the contact details on
          our contact page.
        </p>
      </div>
    </div>
  );
}
