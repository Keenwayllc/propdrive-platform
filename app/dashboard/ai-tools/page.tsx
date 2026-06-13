/**
 * AI tools hub. A self-serve "Connect OpenAI" card lets the owner add their key
 * from here (no Vercel needed); Phase 1 lists the planned tools as cards;
 * Phase 2 wires the OpenAI-backed generators.
 */
import { FileText, Megaphone, Mail, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import OpenAiKeyForm from "@/components/openai-key-form";
import { getOpenAiKeyStatus } from "@/lib/queries";

const TOOLS: ReadonlyArray<{
  icon: LucideIcon;
  title: string;
  description: string;
}> = [
  {
    icon: FileText,
    title: "Listing Description Writer",
    description: "Generate compelling property descriptions from a few details.",
  },
  {
    icon: Megaphone,
    title: "Social Post Generator",
    description: "Create ready-to-post captions for new listings and open houses.",
  },
  {
    icon: Mail,
    title: "Lead Follow-up Emails",
    description: "Draft personalized follow-up emails for new leads.",
  },
  {
    icon: Sparkles,
    title: "Neighborhood Highlights",
    description: "Summarize what makes each neighborhood appealing to buyers.",
  },
];

export default async function AiToolsPage() {
  const { source, masked } = await getOpenAiKeyStatus();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink">AI Tools</h1>
        <p className="mt-1 text-sm text-muted">
          Save time with AI-powered content generation. Connect your OpenAI key
          below to enable them.
        </p>
      </div>

      <OpenAiKeyForm source={source} masked={masked} />

      <div className="grid gap-4 sm:grid-cols-2">
        {TOOLS.map((tool) => (
          <div key={tool.title} className="rounded-xl border border-line bg-white p-6 shadow-sm">
            <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-accent-soft text-accent">
              <tool.icon className="h-6 w-6" />
            </span>
            <h3 className="mt-4 font-semibold text-ink">{tool.title}</h3>
            <p className="mt-1 text-sm text-muted">{tool.description}</p>
            <button
              type="button"
              disabled
              className="mt-4 rounded-lg border border-line px-3 py-1.5 text-sm font-medium text-faint"
            >
              Coming in Phase 2
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
