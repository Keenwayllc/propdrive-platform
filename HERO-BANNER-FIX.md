# Hero Banner Headline Clipping — Fix

## Problem

Large serif hero/banner headlines were clipping letters with **descenders**
(`g`, `y`, `p`, `q`, `j`) and any glyph with a hanging tail/swash at the bottom.
Most visible on titles like:

- "Thinking of selling?" → the `g` was sliced off
- "Buying your next home?"
- "Upgrade your lifestyle"
- "Property guidance"

This was a **CSS/layout problem**, not a text or button problem.

## Root causes

1. **Tight line-height.** The hero `<h1>` used `leading-[0.98]` (line-height
   below 1.0). The line box was physically shorter than the glyphs, so anything
   below the baseline fell outside the box.

2. **Animation mask clipping.** The headline animates word-by-word via
   `WordReveal` (`components/motion.tsx`). Each word was wrapped in a
   `overflow-hidden` span to make the word "rise" out of a mask. The mask's
   `clipPath: inset(0 0 -0.15em 0)` (meant to leak 0.15em at the bottom) was
   overridden by the `overflow-hidden` on the same element, so descenders were
   cut at the box edge after the word settled.

The other suspected causes (fixed-height wrapper, parent `overflow-hidden` on
the heading, transform/mask on the title container) were checked and were **not**
contributing — the section's `overflow-hidden` only clips the background image,
well away from the headline.

## What was NOT changed (per the requirements)

- Headline text — untouched.
- Font size of the headline — untouched (still `text-5xl → lg:text-[4.75rem]`).
- Both CTA buttons — kept (the second button was restored, see below).
- The large serif display styling — kept intact.

## The fixes

### 1. Global, reusable descender-safe headings (`app/globals.css`)

Added an **unlayered** rule (intentionally unlayered so it wins over Tailwind's
per-size line-heights at any font size) that applies automatically to every
display heading, plus an opt-in `.display-heading` utility for non-heading
display text and animation wrappers:

```css
h1.font-display,
h2.font-display,
h3.font-display,
h4.font-display,
.display-heading {
  line-height: 1.12;      /* safe leading, never below ~1.1 */
  padding-bottom: 0.16em; /* em-based: scales with size; room for descenders */
  overflow: visible;      /* never clip glyphs that drop below the box */
}
```

Because the values are in `em`, they scale with the heading size — a future
`text-7xl` banner title is protected automatically. Because the rule keys off
`hN.font-display`, **every current and future heading using the display face is
covered with no per-element edits**:

- Hero banner titles / banner slide headings (`components/home-hero.tsx`)
- Homepage section headings (`app/(marketing)/page.tsx`)
- Property listing + detail headings (`app/(marketing)/properties/...`)
- Open house headings (`app/(marketing)/open-houses/page.tsx`)
- Home value headings (`app/(marketing)/home-valuation/page.tsx`)
- Mortgage, Contact, About, 404, Flyer, Footer headings
- Any new large serif headline added later

### 2. Hero headline line-height (`components/home-hero.tsx`)

Changed `leading-[0.98]` → `leading-[1.1]` on the hero `<h1>` so the explicit
value matches the safe global rule (no more sub-1.0 line box).

### 3. Animation mask room (`components/motion.tsx`, `WordReveal`)

Each masked word now reserves bottom room for descenders and starts lower so it
stays hidden until it rises:

- Added `pb-[0.18em] -mb-[0.18em]` to the masked word span (extends the mask
  downward for descenders without changing line spacing).
- Removed the ineffective `clipPath` (the padding now defines the safe box).
- Initial offset `y: "110%"` → `y: "120%"` so the word is fully hidden before it
  rises (prevents the larger mask from leaking the word early).

### 4. Restored the second CTA button (`components/home-hero.tsx`)

The hero shows **two** buttons again:

- **Primary** (dark pill): uses the banner slide's CTA text + link from the
  dashboard Banners settings (`slide.ctaText` / `slide.ctaLink`).
- **Secondary** (light pill): "What's my home worth?" → `/home-valuation`.

> Note: the requested default link `/home-value` does not exist as a route in
> this app; the working valuation page is `/home-valuation`, so the button points
> there to avoid a 404.

Both sit in a `flex flex-wrap items-center gap-3` row: they have a real gap,
never overlap, and wrap cleanly onto separate lines on mobile.

## Expected result

- Headline renders with **no clipped letters** — the `g` in "selling" shows
  fully, at every breakpoint.
- Both CTA buttons are visible, spaced, and non-overlapping.
- The fix is global: new banner titles with words like "selling", "buying",
  "property", "upgrading", or "journey" will never clip.

## Test titles (all descenders render fully)

- "Thinking of selling?"
- "Buying your next home?"
- "Upgrade your lifestyle"
- "Property guidance"
