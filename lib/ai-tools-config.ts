/**
 * Shared config for the dashboard AI tools — used by both the client form
 * (components/ai-tool-card) and the server action (lib/ai-actions). Field names
 * here must match what the prompt builders read. No server-only imports, so it
 * is safe to import from client components.
 */
export type AiField = {
  name: string;
  label: string;
  type: "text" | "textarea" | "select";
  placeholder?: string;
  options?: string[];
  required?: boolean;
};

export type AiToolConfig = {
  id: string;
  title: string;
  description: string;
  cta: string;
  fields: AiField[];
};

export const AI_TOOLS: AiToolConfig[] = [
  {
    id: "listing-description",
    title: "Listing Description Writer",
    description: "Generate a compelling property description from a few details.",
    cta: "Write description",
    fields: [
      { name: "address", label: "Address or area", type: "text", placeholder: "e.g. 412 Ocean Ave, Santa Monica", required: true },
      { name: "beds", label: "Bedrooms", type: "text", placeholder: "e.g. 4" },
      { name: "baths", label: "Bathrooms", type: "text", placeholder: "e.g. 3" },
      { name: "sqft", label: "Square feet", type: "text", placeholder: "e.g. 2,400" },
      { name: "price", label: "Price", type: "text", placeholder: "e.g. $2,150,000" },
      { name: "features", label: "Standout features", type: "textarea", placeholder: "Ocean views, chef's kitchen, pool, walk to the pier…", required: true },
      { name: "tone", label: "Tone", type: "select", options: ["Warm & inviting", "Luxury & elevated", "Concise & factual"] },
    ],
  },
  {
    id: "social-post",
    title: "Social Post Generator",
    description: "Create a ready-to-post caption for a listing or open house.",
    cta: "Write caption",
    fields: [
      { name: "subject", label: "Listing or event", type: "text", placeholder: "e.g. Open house Sat 1–4, 412 Ocean Ave", required: true },
      { name: "platform", label: "Platform", type: "select", options: ["Instagram", "Facebook", "X / Twitter", "LinkedIn"] },
      { name: "highlight", label: "Key highlight", type: "text", placeholder: "e.g. Steps from the beach, just listed" },
      { name: "cta", label: "Call to action", type: "text", placeholder: "e.g. DM for a private tour" },
    ],
  },
  {
    id: "follow-up-email",
    title: "Lead Follow-up Email",
    description: "Draft a personalized follow-up email for a new lead.",
    cta: "Draft email",
    fields: [
      { name: "name", label: "Lead's name", type: "text", placeholder: "e.g. Jordan", required: true },
      { name: "interest", label: "What they're interested in", type: "text", placeholder: "e.g. 3-bed homes in Santa Monica under $2M", required: true },
      { name: "context", label: "Context / notes", type: "textarea", placeholder: "How you met, what they said, next step…" },
      { name: "tone", label: "Tone", type: "select", options: ["Warm & personal", "Professional", "Brief & direct"] },
    ],
  },
  {
    id: "neighborhood-highlights",
    title: "Neighborhood Highlights",
    description: "Summarize what makes a neighborhood appealing to buyers.",
    cta: "Summarize neighborhood",
    fields: [
      { name: "neighborhood", label: "Neighborhood", type: "text", placeholder: "e.g. Pacific Palisades", required: true },
      { name: "city", label: "City / area", type: "text", placeholder: "e.g. Los Angeles" },
      { name: "audience", label: "Audience", type: "select", options: ["Families", "First-time buyers", "Luxury buyers", "Investors"] },
    ],
  },
];

export function getAiTool(id: string): AiToolConfig | undefined {
  return AI_TOOLS.find((t) => t.id === id);
}
