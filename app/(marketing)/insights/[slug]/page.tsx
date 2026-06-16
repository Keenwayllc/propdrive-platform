/**
 * Single Market Insights article. Dynamic route: `params` is async.
 */
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Reveal } from "@/components/motion";
import { getPostBySlug } from "@/lib/queries";

const fmt = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Article" };
  return { title: post.title, description: post.excerpt };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const paragraphs = post.body.split(/\n{2,}/).filter((p) => p.trim());

  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:py-24">
      <Reveal>
        <Link
          href="/insights"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-ink"
        >
          <ArrowLeft className="h-4 w-4" /> All articles
        </Link>
        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.14em] text-faint">
          {fmt.format(new Date(post.published_at))}
          {post.author ? ` · ${post.author}` : ""}
        </p>
        <h1 className="mt-3 font-display text-4xl font-medium leading-tight tracking-tight text-ink sm:text-5xl">
          {post.title}
        </h1>
      </Reveal>

      {post.cover_image_url && (
        <Reveal>
          <div className="relative mt-8 aspect-[16/9] w-full overflow-hidden rounded-[1.75rem] border border-line bg-line">
            <Image
              src={post.cover_image_url}
              alt={post.title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
            />
          </div>
        </Reveal>
      )}

      <Reveal>
        <div className="mt-8 space-y-5 text-lg leading-relaxed text-ink/85">
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </Reveal>

      <div className="mt-12 border-t border-line pt-8">
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-background transition-colors hover:bg-accent active:translate-y-px"
        >
          Work with us
        </Link>
      </div>
    </article>
  );
}
