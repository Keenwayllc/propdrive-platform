/**
 * Custom page — owner-authored standalone content served at /p/[slug].
 * Dynamic route: `params` is async in this Next version. Body renders as
 * paragraphs (split on blank lines) — plain text, no raw HTML, so customer
 * content can never inject markup.
 */
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Reveal } from "@/components/motion";
import { getPageBySlug } from "@/lib/queries";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPageBySlug(slug);
  if (!page) return { title: "Page not found" };
  return { title: page.title };
}

export default async function CustomPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = await getPageBySlug(slug);
  if (!page) notFound();

  const paragraphs = page.body
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:py-24">
      <Reveal>
        <h1 className="font-display text-4xl font-medium tracking-tight text-ink sm:text-5xl">
          {page.title}
        </h1>
      </Reveal>

      {page.cover_image_url && (
        <Reveal delay={0.06}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={page.cover_image_url}
            alt={page.title}
            className="mt-8 w-full rounded-[1.5rem] border border-line object-cover"
          />
        </Reveal>
      )}

      <Reveal delay={0.1}>
        <div className="mt-8 space-y-5 text-lg leading-relaxed text-muted">
          {paragraphs.length > 0 ? (
            paragraphs.map((para, i) => <p key={i}>{para}</p>)
          ) : (
            <p>This page has no content yet.</p>
          )}
        </div>
      </Reveal>
    </div>
  );
}
