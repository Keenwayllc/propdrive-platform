/**
 * Privacy policy. Placeholder legal copy — must be reviewed by the buyer's
 * legal counsel before going live (see docs/TRANSFER_CHECKLIST.md).
 */
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How PropDrive handles your personal information.",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-bold text-slate-900">Privacy Policy</h1>
      <p className="mt-2 text-sm text-slate-400">Last updated: placeholder</p>

      <div className="prose mt-8 max-w-none text-slate-600">
        <p>
          <strong>Template notice:</strong> This is placeholder legal text. Replace
          it with a policy reviewed by qualified counsel before launch.
        </p>
        <h2>Information we collect</h2>
        <p>
          We collect information you provide through our contact and lead forms,
          such as your name, email, phone number, and message.
        </p>
        <h2>How we use your information</h2>
        <p>
          We use your information to respond to enquiries, schedule appointments,
          and provide real estate services you request.
        </p>
        <h2>Contact</h2>
        <p>
          Questions about this policy can be directed to the contact details on
          our contact page.
        </p>
      </div>
    </div>
  );
}
