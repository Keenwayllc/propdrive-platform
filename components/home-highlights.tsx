"use client";

/**
 * "Recent results" highlight stack for the homepage — real-estate framing of the
 * DisplayCards primitive (recent wins / activity), in the Coastal Luxe palette.
 *
 * Content (icon / title / description / date) is owner-editable via the Website
 * Editor (site_settings.highlights_cards). The fanned-stack positioning stays
 * fixed per slot and is mapped onto the content by index.
 */
import {
  TrendingUp,
  Sparkles,
  Handshake,
  Home,
  KeyRound,
  Award,
  BadgeCheck,
  MapPin,
} from "lucide-react";
import DisplayCards from "@/components/ui/display-cards";
import type { HighlightCard } from "@/lib/types";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  "trending-up": TrendingUp,
  sparkles: Sparkles,
  handshake: Handshake,
  home: Home,
  key: KeyRound,
  award: Award,
  "badge-check": BadgeCheck,
  "map-pin": MapPin,
};

// `after:from-ink` overrides the component's default cream edge-fade so the
// cards blend into the dark band instead of smearing light on their right edge.
// One entry per stacked position; content is layered on by index.
const POSITION_CLASSES = [
  "[grid-area:stack] after:from-ink hover:-translate-y-10 before:absolute before:w-[100%] before:outline-1 before:rounded-2xl before:outline-line/30 before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-ink/40 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration-700 hover:grayscale-0 before:left-0 before:top-0",
  "[grid-area:stack] after:from-ink translate-x-16 translate-y-10 hover:-translate-y-1 before:absolute before:w-[100%] before:outline-1 before:rounded-2xl before:outline-line/30 before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-ink/40 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration-700 hover:grayscale-0 before:left-0 before:top-0",
  "[grid-area:stack] after:from-ink translate-x-32 translate-y-20 hover:translate-y-10",
];

export default function HomeHighlights({ cards }: { cards: HighlightCard[] }) {
  const displayCards = cards.slice(0, 3).map((card, i) => {
    const Icon = ICONS[card.icon] ?? Sparkles;
    return {
      icon: <Icon className="size-4 text-accent" />,
      title: card.title,
      description: card.description,
      date: card.date,
      titleClassName: "text-accent-strong",
      className: POSITION_CLASSES[i],
    };
  });

  return <DisplayCards cards={displayCards} />;
}
