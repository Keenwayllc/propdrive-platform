"use client";

/**
 * Floating "back to top" control. Appears once the user has scrolled past the
 * first viewport, scrolls smoothly to the top (instant under reduced-motion),
 * and sits clear of the iOS home indicator via safe-area insets.
 */
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp } from "lucide-react";

const EASE = [0.16, 1, 0.3, 1] as const;

export default function ScrollToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function toTop() {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          type="button"
          onClick={toTop}
          aria-label="Scroll back to top"
          initial={{ opacity: 0, y: 14, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 14, scale: 0.9 }}
          transition={{ duration: 0.28, ease: EASE }}
          whileTap={{ scale: 0.92 }}
          style={{
            bottom: "calc(1.5rem + env(safe-area-inset-bottom))",
            right: "calc(1.5rem + env(safe-area-inset-right))",
          }}
          className="fixed z-40 flex h-12 w-12 items-center justify-center rounded-full bg-ink text-background shadow-lg shadow-ink/25 transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <ArrowUp className="h-5 w-5" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
