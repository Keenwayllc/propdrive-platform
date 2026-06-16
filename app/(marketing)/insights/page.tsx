/**
 * Market Insights — the blog index. Lists published posts newest-first.
 */
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { getPosts } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Market Insights",
  description: "Local real estate news, market updates, and guides for buyers and sellers.",
};

const fmt = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

export default async function InsightsPage() {
  const posts = await getPosts();

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
      <Reveal>
        <header className="mb-10 max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            Market Insights
          </p>
          <h1 className="mt-3 font-display text-4xl font-medium tracking-tight text-ink sm:text-5xl">
            News, trends, and guides.
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-muted">
            Local market updates and practical advice for buying and selling across
            Los Angeles County.
          </p>
        </header>
      </Reveal>

      {posts.length === 0 ? (
        <div className="rounded-[1.75rem] border border-dashed border-line bg-surface p-16 text-center text-muted">
          No articles yet. Check back soon.
        </div>
      ) : (
        <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <StaggerItem key={p.id}>
              <Link
                href={`/insights/${p.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-line bg-surface shadow-[0_18px_44px_-30px_rgba(26,23,20,0.4)] transition-all duration-300 hover:-translate-y-1 hover:border-accent/40"
              >
                {p.cover_image_url && (
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-line">
                    <Image
                      src={p.cover_image_url}
                      alt={p.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-[600ms] ease-out group-hover:scale-[1.05]"
                    />
                  </div>
                )}
                <div className="flex flex-1 flex-col p-6">
                  <p className="text-xs font-medium uppercase tracking-[0.14em] text-faint">
                    {fmt.format(new Date(p.published_at))}
                  </p>
                  <h2 className="mt-2 font-display text-xl font-medium leading-snug tracking-tight text-ink">
                    {p.title}
                  </h2>
                  <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-muted">
                    {p.excerpt}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
                    Read more
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      )}
    </div>
  );
}
