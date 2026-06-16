"use server";

/**
 * Server actions for the dashboard AI tools. Each tool turns a few form fields
 * into an OpenAI prompt and returns generated copy. Requires a signed-in
 * session; the key is resolved server-side (see lib/ai → getOpenAiKey).
 */
import { createServerSupabase } from "@/lib/supabase-server";
import { runOpenAi, type AiResult } from "@/lib/ai";
import { getAiTool } from "@/lib/ai-tools-config";

/** Compact "Label: value" lines for the fields the user actually filled in. */
function fieldLines(
  toolId: string,
  fields: Record<string, string>
): string {
  const tool = getAiTool(toolId);
  if (!tool) return "";
  return tool.fields
    .map((f) => {
      const v = (fields[f.name] ?? "").trim();
      return v ? `${f.label}: ${v}` : null;
    })
    .filter(Boolean)
    .join("\n");
}

function buildPrompt(
  toolId: string,
  fields: Record<string, string>
): { system: string; user: string } | null {
  const details = fieldLines(toolId, fields);

  switch (toolId) {
    case "listing-description":
      return {
        system:
          "You are an expert real estate copywriter. Write a polished MLS-style property description: 2–3 short paragraphs, vivid but truthful, no clichés like 'must see' or 'won't last'. Never invent facts not provided. Honor the requested tone. Do not include a headline or the price unless given.",
        user: `Write a listing description from these details:\n\n${details}`,
      };
    case "social-post":
      return {
        system:
          "You are a social media manager for a real estate agent. Write one engaging, platform-appropriate caption. Keep it concise, add a clear call to action, and include 3–6 relevant hashtags on their own line. Match the platform's style. Do not invent facts.",
        user: `Write a social caption from these details:\n\n${details}`,
      };
    case "follow-up-email":
      return {
        system:
          "You are a thoughtful real estate agent writing a personalized follow-up email to a lead. Keep it warm, specific, and short (under 150 words). Reference their interest, suggest a clear next step, and end with a friendly sign-off placeholder like '[Your name]'. Include a subject line on the first line as 'Subject: …'.",
        user: `Draft a follow-up email from these details:\n\n${details}`,
      };
    case "neighborhood-highlights":
      return {
        system:
          "You are a knowledgeable local real estate advisor. Summarize what makes a neighborhood appealing to the given audience in 2 short paragraphs plus 3–5 bullet highlights. Be specific and balanced; avoid exaggeration and do not fabricate statistics.",
        user: `Summarize this neighborhood's appeal:\n\n${details}`,
      };
    default:
      return null;
  }
}

export async function runAiTool(
  toolId: string,
  fields: Record<string, string>
): Promise<AiResult> {
  const tool = getAiTool(toolId);
  if (!tool) return { ok: false, error: "Unknown tool." };

  // Require a signed-in session.
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "You must be signed in to do that." };

  // Required-field guard (cheap, before spending an API call).
  for (const f of tool.fields) {
    if (f.required && !(fields[f.name] ?? "").trim()) {
      return { ok: false, error: `Please fill in “${f.label}”.` };
    }
  }

  const prompt = buildPrompt(toolId, fields);
  if (!prompt) return { ok: false, error: "Unknown tool." };

  return runOpenAi(prompt.system, prompt.user);
}

/**
 * Generic single-field copy assistant for the dashboard. Writes or improves one
 * short piece of marketing copy (a headline, subtitle, bio, blurb, tagline, a
 * polished testimonial, etc). Returns plain text ready to drop into the field.
 * Honors the "no em dashes" house style.
 */
export async function assistField(opts: {
  /** What the field is for, e.g. "a homepage hero headline for a realtor". */
  instruction: string;
  /** Existing text to improve, if any. */
  current?: string;
  /** Brand/context to ground the copy (company name, city, etc). */
  context?: string;
  /** Optional extra guidance the user typed. */
  guidance?: string;
  maxTokens?: number;
}): Promise<AiResult> {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "You must be signed in to do that." };

  const instruction = opts.instruction.trim();
  if (!instruction) return { ok: false, error: "Nothing to write." };

  const system =
    "You are an expert real estate marketing copywriter. Write polished, warm, " +
    "specific copy that sounds human and trustworthy. Avoid hype and cliches " +
    "like 'must see' or 'dream home', and never invent facts, names, or numbers " +
    "that were not provided. Never use em dashes; use commas, periods, or " +
    "parentheses instead. Return ONLY the finished text for the field, with no " +
    "quotation marks, labels, preamble, or markdown.";

  const parts = [`Task: ${instruction}.`];
  if (opts.context?.trim()) parts.push(`Brand context: ${opts.context.trim()}`);
  if (opts.current?.trim())
    parts.push(`Improve this existing text, keeping its meaning:\n${opts.current.trim()}`);
  if (opts.guidance?.trim()) parts.push(`Extra guidance: ${opts.guidance.trim()}`);

  const res = await runOpenAi(system, parts.join("\n\n"), {
    maxTokens: opts.maxTokens ?? 400,
  });
  if (!res.ok) return res;
  // Strip stray wrapping quotes and any em dashes the model slipped in.
  const text = res.text
    .replace(/^["'""]+|["'""]+$/g, "")
    .replace(/\s*—\s*/g, ", ")
    .trim();
  return { ok: true, text };
}

export type BlogDraft = { title: string; excerpt: string; body: string };

/**
 * Generate a full blog / Market Insights article from a short topic. Returns a
 * structured draft (title, excerpt, body) the owner can edit before publishing.
 */
export async function generateBlogArticle(
  topic: string
): Promise<{ ok: true; article: BlogDraft } | { ok: false; error: string }> {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "You must be signed in to do that." };

  const t = topic.trim();
  if (!t) return { ok: false, error: "Enter a topic to write about." };

  const system =
    "You are an expert real estate content writer. Write a helpful, SEO-friendly blog article for a real estate agent's website. Be specific and genuinely useful to buyers or sellers, avoid hype and clichés, and never invent statistics. Do not use em dashes. " +
    'Return ONLY valid JSON, no markdown or code fences, with exactly these keys: "title" (a compelling headline), "excerpt" (one sentence under 160 characters), and "body" (4 to 6 short paragraphs separated by blank lines).';
  const userMsg = `Write a real estate blog article about: ${t}`;

  const res = await runOpenAi(system, userMsg, { maxTokens: 1400 });
  if (!res.ok) return res;

  const cleaned = res.text
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();

  try {
    const obj = JSON.parse(cleaned) as Partial<BlogDraft>;
    if (!obj.title || !obj.body) {
      return { ok: false, error: "Could not parse the draft. Please try again." };
    }
    return {
      ok: true,
      article: {
        title: String(obj.title),
        excerpt: String(obj.excerpt ?? ""),
        body: String(obj.body),
      },
    };
  } catch {
    // Model didn't return clean JSON; fall back to using the raw text as body.
    return { ok: true, article: { title: "", excerpt: "", body: res.text } };
  }
}
