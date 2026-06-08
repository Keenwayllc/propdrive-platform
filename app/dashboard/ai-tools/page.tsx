/**
 * AI tools hub. Phase 1 lists the planned tools as cards; Phase 2 wires the
 * OpenAI-backed generators.
 */
import { FileText, Megaphone, Mail, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";

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

export default function AiToolsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">AI Tools</h1>
        <p className="mt-1 text-sm text-slate-500">
          Save time with AI-powered content generation. Requires an OpenAI API key
          (see Integrations).
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {TOOLS.map((tool) => (
          <div key={tool.title} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
              <tool.icon className="h-6 w-6" />
            </span>
            <h3 className="mt-4 font-semibold text-slate-900">{tool.title}</h3>
            <p className="mt-1 text-sm text-slate-500">{tool.description}</p>
            <button
              type="button"
              disabled
              className="mt-4 rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-400"
            >
              Coming in Phase 2
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
