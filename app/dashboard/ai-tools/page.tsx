/**
 * AI tools hub. A self-serve "Connect OpenAI" card lets the owner add their key
 * from here (no Vercel needed); each tool below generates real copy via OpenAI.
 */
import OpenAiKeyForm from "@/components/openai-key-form";
import AiToolCard from "@/components/ai-tool-card";
import { AI_TOOLS } from "@/lib/ai-tools-config";
import { getOpenAiKeyStatus } from "@/lib/queries";

export default async function AiToolsPage() {
  const { source, masked } = await getOpenAiKeyStatus();
  const connected = source !== null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink">AI Tools</h1>
        <p className="mt-1 text-sm text-muted">
          Save time with AI-powered content generation. Connect your OpenAI key
          below, then open any tool to generate copy.
        </p>
      </div>

      <OpenAiKeyForm source={source} masked={masked} />

      <div className="grid gap-4">
        {AI_TOOLS.map((tool) => (
          <AiToolCard key={tool.id} tool={tool} connected={connected} />
        ))}
      </div>
    </div>
  );
}
