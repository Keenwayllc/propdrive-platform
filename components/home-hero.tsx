"use client";

/**
 * Cinematic homepage hero, now a rotating slideshow. Each slide crossfades with
 * a slow Ken Burns zoom; the headline reveals word by word and the stats count
 * up. Slides come from the dashboard Banners section; with a single slide it
 * behaves exactly like the original hero. Honors prefers-reduced-motion.
 */
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { Magnetic, WordReveal, CountUp } from "@/components/motion";
import type { SiteStat } from "@/lib/types";

const EASE = [0.16, 1, 0.3, 1] as const;
const ROTATE_MS = 6500;

export interface HeroSlide {
  image: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
}

const FALLBACK_STATS: SiteStat[] = [
  { value: 127, suffix: "", label: "Homes closed" },
  { value: 11, suffix: "", label: "Avg. days on market" },
  { value: 98.2, suffix: "%", label: "Of list price" },
];

export default function HomeHero({
  slides,
  stats,
  serviceArea = "Los Angeles County, California",
}: {
  slides: HeroSlide[];
  stats?: SiteStat[];
  serviceArea?: string;
}) {
  const list = slides.length ? slides : [];
  const statList = stats && stats.length ? stats : FALLBACK_STATS;
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const [index, setIndex] = useState(0);

  // Auto-rotate when there's more than one slide. Restarts on manual change.
  useEffect(() => {
    if (list.length < 2) return;
    const t = setTimeout(() => setIndex((i) => (i + 1) % list.length), ROTATE_MS);
    return () => clearTimeout(t);
  }, [index, list.length]);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  if (!list.length) return null;
  const slide = list[Math.min(index, list.length - 1)];
  // Defense in depth: never render an unsafe href (e.g. javascript:) on the CTA.
  const safeHref = /^(\/|https?:\/\/)/i.test(slide.ctaLink || "")
    ? slide.ctaLink
    : "/properties";

  return (
    <section ref={ref} className="relative isolate overflow-hidden">
      {/* Crossfading slide images + Ken Burns */}
      <motion.div className="absolute inset-0 -z-10" style={reduce ? undefined : { y: bgY }}>
        <AnimatePresence initial={false}>
          <motion.div
            key={index}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.1, ease: EASE }}
          >
            <motion.div
              className="absolute inset-0"
              initial={reduce ? false : { scale: 1.12 }}
              animate={reduce ? undefined : { scale: 1 }}
              transition={{ duration: ROTATE_MS / 1000 + 1.5, ease: "linear" }}
            >
              <Image
                src={slide.image}
                alt={slide.title || "Featured property"}
                fill
                priority
                sizes="100vw"
                className="object-cover object-[60%_center]"
              />
            </motion.div>
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/75 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/30" />
      </motion.div>

      <motion.div
        className="mx-auto flex min-h-[88svh] max-w-7xl items-center px-4 sm:px-6"
        style={reduce ? undefined : { y: contentY, opacity: contentOpacity }}
      >
        <div className="w-full min-w-0 max-w-xl py-24">
          <motion.span
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
            className="inline-flex items-center gap-2 rounded-full border border-line bg-surface/80 px-3.5 py-1.5 text-xs font-medium text-muted backdrop-blur"
          >
            <MapPin className="h-3.5 w-3.5 text-accent" />
            {serviceArea}
          </motion.span>

          {/* Keyed by index so the headline + copy re-animate per slide */}
          <h1 className="mt-6 font-display text-5xl font-medium leading-[1.1] tracking-tight text-ink sm:text-6xl lg:text-[4.75rem]">
            <WordReveal key={`t-${index}`} text={slide.title} delay={0.15} stagger={0.07} />
          </h1>

          <motion.p
            key={`s-${index}`}
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.45 }}
            className="mt-6 max-w-md text-lg leading-relaxed text-muted"
          >
            {slide.subtitle}
          </motion.p>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.58 }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <Magnetic strength={0.4}>
              <Link
                href={safeHref}
                className="group inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 text-sm font-semibold text-background transition-colors hover:bg-accent active:translate-y-px"
              >
                {slide.ctaText || "Browse listings"}
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </Magnetic>
            {/* Secondary CTA — always-available home valuation. Sits beside the
               primary in a wrapping, gapped row so the two never overlap. */}
            <Link
              href="/home-valuation"
              className="inline-flex items-center rounded-full border border-line bg-surface/70 px-6 py-3.5 text-sm font-semibold text-ink backdrop-blur transition-colors hover:bg-surface active:translate-y-px"
            >
              What&apos;s my home worth?
            </Link>
          </motion.div>

          {/* Slide dots */}
          {list.length > 1 && (
            <div className="mt-8 flex items-center gap-2">
              {list.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  aria-current={i === index}
                  className={`h-2 rounded-full transition-all ${
                    i === index ? "w-6 bg-accent" : "w-2 bg-ink/20 hover:bg-ink/40"
                  }`}
                />
              ))}
            </div>
          )}

          <motion.dl
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.72 }}
            className="mt-12 grid max-w-md grid-cols-3 gap-6 border-t border-line/80 pt-6"
          >
            {statList.map((s, i) => (
              <div key={`${s.label}-${i}`}>
                <dt className="font-mono text-2xl font-semibold text-ink">
                  <CountUp
                    value={s.value}
                    suffix={s.suffix}
                    decimals={Number.isInteger(s.value) ? 0 : 1}
                    duration={1.4 + i * 0.15}
                  />
                </dt>
                <dd className="mt-1 text-xs leading-snug text-muted">{s.label}</dd>
              </div>
            ))}
          </motion.dl>
        </div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        aria-hidden
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.3 }}
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 sm:block"
      >
        <div className="flex h-9 w-6 items-start justify-center rounded-full border border-line/70 bg-surface/40 p-1.5 backdrop-blur">
          <motion.span
            className="block h-1.5 w-1.5 rounded-full bg-accent"
            animate={reduce ? undefined : { y: [0, 10, 0] }}
            transition={{ duration: 1.6, ease: "easeInOut", repeat: Infinity }}
          />
        </div>
      </motion.div>
    </section>
  );
}
