import "server-only";

/**
 * Thin server-side wrapper around the OpenAI Chat Completions API for the
 * dashboard AI tools. Resolves the owner's key (dashboard-stored or env),
 * calls the model, and maps common failures to friendly messages. gpt-4o-mini
 * is a cheap, widely-available default that suits short marketing copy.
 */
import OpenAI from "openai";
import { getOpenAiKey } from "@/lib/queries";

export type AiResult =
  | { ok: true; text: string }
  | { ok: false; error: string };

export async function runOpenAi(
  system: string,
  user: string,
  opts?: { maxTokens?: number }
): Promise<AiResult> {
  const apiKey = await getOpenAiKey();
  if (!apiKey) {
    return {
      ok: false,
      error: "Connect your OpenAI key on this page first, then try again.",
    };
  }

  try {
    const client = new OpenAI({ apiKey });
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.7,
      max_tokens: opts?.maxTokens ?? 700,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    });
    const text = completion.choices[0]?.message?.content?.trim();
    if (!text) return { ok: false, error: "No content came back — please try again." };
    return { ok: true, text };
  } catch (err: unknown) {
    const status =
      typeof err === "object" && err !== null && "status" in err
        ? (err as { status?: number }).status
        : undefined;
    const message =
      status === 401
        ? "Your OpenAI key was rejected. Check it under “Connect OpenAI” above."
        : status === 429
          ? "OpenAI is rate-limited or out of credit. Add billing credit and retry."
          : "Couldn’t generate content. Please try again in a moment.";
    console.error(
      "[ai] runOpenAi",
      err instanceof Error ? err.message : String(err)
    );
    return { ok: false, error: message };
  }
}
