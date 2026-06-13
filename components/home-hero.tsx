"use client";

/**
 * Cinematic homepage hero. Slow Ken-Burns + parallax on the banner, a
 * word-by-word masked headline reveal, count-up stats, and a scroll cue.
 * Content (title / subtitle) comes from the server (site_settings). All motion
 * respects prefers-reduced-motion via the shared primitives.
 */
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";
import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { Magnetic, WordReveal, CountUp } from "@/components/motion";

const EASE = [0.16, 1, 0.3, 1] as const;

const STATS = [
  { value: 127, suffix: "", decimals: 0, label: "Homes closed" },
  { value: 11, suffix: "", decimals: 0, label: "Avg. days on market" },
  { value: 98.2, suffix: "%", decimals: 1, label: "Of list price" },
] as const;

export default function HomeHero({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);

  // Parallax: the banner drifts up and fades slightly as you scroll past.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section ref={ref} className="relative isolate overflow-hidden">
      {/* Generated banner — Ken Burns intro + scroll parallax */}
      <motion.div className="absolute inset-0 -z-10" style={reduce ? undefined : { y: bgY }}>
        <motion.div
          className="absolute inset-0"
          style={reduce ? undefined : { scale: bgScale }}
          initial={reduce ? false : { scale: 1.15, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.6, ease: EASE }}
        >
          <Image
            src="/hero/hero-banner.png"
            alt="Modern luxury estate overlooking Los Angeles at golden hour"
            fill
            priority
            sizes="100vw"
            className="object-cover object-[60%_center]"
          />
        </motion.div>
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
            Los Angeles County, California
          </motion.span>

          <h1 className="mt-6 font-display text-5xl font-medium leading-[0.98] tracking-tight text-ink sm:text-6xl lg:text-[4.75rem]">
            <WordReveal text={title} delay={0.25} stagger={0.07} />
          </h1>

          <motion.p
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.55 }}
            className="mt-6 max-w-md text-lg leading-relaxed text-muted"
          >
            {subtitle}
          </motion.p>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.68 }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <Magnetic strength={0.4}>
              <Link
                href="/properties"
                className="group inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 text-sm font-semibold text-background transition-colors hover:bg-accent active:translate-y-px"
              >
                Browse listings
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </Magnetic>
            <Link
              href="/home-valuation"
              className="inline-flex items-center rounded-full border border-line bg-surface/70 px-6 py-3.5 text-sm font-semibold text-ink backdrop-blur transition-colors hover:bg-surface active:translate-y-px"
            >
              What&apos;s my home worth?
            </Link>
          </motion.div>

          <motion.dl
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.82 }}
            className="mt-12 grid max-w-md grid-cols-3 gap-6 border-t border-line/80 pt-6"
          >
            {STATS.map((s, i) => (
              <div key={s.label}>
                <dt className="font-mono text-2xl font-semibold text-ink">
                  <CountUp
                    value={s.value}
                    suffix={s.suffix}
                    decimals={s.decimals}
                    duration={1.4 + i * 0.15}
                  />
                </dt>
                <dd className="mt-1 text-xs leading-snug text-muted">{s.label}</dd>
              </div>
            ))}
          </motion.dl>
        </div>
      </motion.div>

      {/* Floating listing badge over the architecture (large screens) */}
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: EASE, delay: 1 }}
        className="pd-float absolute bottom-10 right-8 hidden rounded-2xl border border-line bg-surface/90 p-4 shadow-[0_20px_40px_-20px_rgba(26,23,20,0.45)] backdrop-blur xl:block"
      >
        <p className="text-xs font-medium text-faint">Featured · Beverly Hills</p>
        <p className="mt-0.5 font-mono text-lg font-semibold text-ink">$6,450,000</p>
        <p className="text-xs text-muted">5 bd · 6 ba · canyon view</p>
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
