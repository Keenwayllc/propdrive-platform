"use client";

/**
 * "On the market" highlight stack for the homepage — real-estate framing of the
 * DisplayCards primitive (recent wins / activity), in the Coastal Luxe palette.
 */
import { TrendingUp, Sparkles, Handshake } from "lucide-react";
import DisplayCards from "@/components/ui/display-cards";

// `after:from-ink` overrides the component's default cream edge-fade so the
// cards blend into the dark band instead of smearing light on their right edge.
const HIGHLIGHT_CARDS = [
  {
    icon: <TrendingUp className="size-4 text-accent" />,
    title: "Sold over ask",
    description: "Bel Air · 9 days on market",
    date: "Closed last week",
    titleClassName: "text-accent-strong",
    className:
      "[grid-area:stack] after:from-ink hover:-translate-y-10 before:absolute before:w-[100%] before:outline-1 before:rounded-2xl before:outline-line/30 before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-ink/40 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration-700 hover:grayscale-0 before:left-0 before:top-0",
  },
  {
    icon: <Sparkles className="size-4 text-accent" />,
    title: "Just listed",
    description: "Santa Monica · $4,200,000",
    date: "2 days ago",
    titleClassName: "text-accent-strong",
    className:
      "[grid-area:stack] after:from-ink translate-x-16 translate-y-10 hover:-translate-y-1 before:absolute before:w-[100%] before:outline-1 before:rounded-2xl before:outline-line/30 before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-ink/40 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration-700 hover:grayscale-0 before:left-0 before:top-0",
  },
  {
    icon: <Handshake className="size-4 text-accent" />,
    title: "In escrow",
    description: "Pacific Palisades · 5 days",
    date: "Today",
    titleClassName: "text-accent-strong",
    className:
      "[grid-area:stack] after:from-ink translate-x-32 translate-y-20 hover:translate-y-10",
  },
];

export default function HomeHighlights() {
  return <DisplayCards cards={HIGHLIGHT_CARDS} />;
}
