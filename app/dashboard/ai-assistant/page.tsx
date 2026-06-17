/**
 * AI Assistant — connect an OpenAI key to turn on the "Write with AI" helpers
 * across the dashboard (Website Editor copy, testimonials, property
 * descriptions). Optional: the dashboard works fully without it.
 */
import { Sparkles } from "lucide-react";
import OpenAiKeyForm from "@/components/openai-key-form";
import { getOpenAiKeyStatus } from "@/lib/queries";

export default async function AiAssistantPage() {
  const ai = await getOpenAiKeyStatus();

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink">AI Assistant</h1>
        <p className="mt-1 text-sm text-muted">
          Optional. Connect your own OpenAI (ChatGPT) key to turn on the
          &quot;Write with AI&quot; buttons across your dashboard. You only pay
          OpenAI for what you use, and you can remove the key anytime.
        </p>
      </div>

      <OpenAiKeyForm source={ai.source} masked={ai.masked} />

      <div className="rounded-2xl border border-line bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2 text-sm font-semibold text-ink">
          <Sparkles className="h-4 w-4 text-accent" /> Where the assistant helps
        </div>
        <ul className="mt-3 space-y-2 text-sm text-muted">
          <li>
            <span className="font-medium text-ink">Website Editor</span> — write or
            polish your hero headline, subtitle, about text, and footer tagline.
          </li>
          <li>
            <span className="font-medium text-ink">Testimonials</span> — lightly
            polish a client quote while keeping it honest.
          </li>
          <li>
            <span className="font-medium text-ink">Properties</span> — draft a
            listing description from the details you entered.
          </li>
        </ul>
        <p className="mt-3 text-xs text-faint">
          Look for the small &quot;Write with AI&quot; button next to those
          fields once your key is connected.
        </p>
      </div>
    </div>
  );
}
