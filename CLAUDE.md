@AGENTS.md

# SSB home page lab

Next.js app for exploring design variations of the **Scaler School of Business (SSB)** home page,
built on the Scaler Design System package `@kishanscaler/ssx-ui`. The bar the team has set is
**premium**: one deliberate, orchestrated moment per variation, everything around it quiet.

## Where this is going

1. **Now:** the home page, section by section. The hero is V2; the Faculty section below it comes
   from the team's SSB website build (`ssb-website/ssb-site`, content from the deck
   `ssb-website/SSB Website vF _ Sep'26.pdf`). `ssb-website/` is source material, not part of this
   app: it is excluded from `tsconfig.json`; port sections from it into `src/`.
2. **Later (not yet):** winning sections become Storyblok bloks so other projects can reuse them.

**No Storyblok work yet.** Don't add the Storyblok SDK, create bloks, or touch the Scaler Storyblok
space until asked. What we do now to prepare: each section takes its content as flat, typed props
(plain strings, string unions, lists of small objects), kept separate from layout. Those props become
the blok schema later.

This is design exploration, not a live A/B test. Nothing here serves production traffic.

## Stack

- Next.js 16.3 (App Router, Turbopack), React 19.3, TypeScript 5.9
- Tailwind CSS v4 via `@tailwindcss/postcss`
- `@kishanscaler/ssx-ui` 0.7 (components + tokens), `gsap` 3.15 (for `@kishanscaler/ssx-ui/motion`),
  `@phosphor-icons/react` (icons)

```bash
npm run dev        # http://localhost:3000 (the lab index lists every variation)
npm run build      # production build (also type-checks)
npm run typecheck
```

## Layout

```
src/
  app/
    layout.tsx          <html data-brand="ssb">, fonts via next/font
    globals.css         Tailwind + ssx-ui styles, font token wiring
    page.tsx            lab index: links to every variation
    v2/                 one route per variation: the hero, then the sections below it
  content/
    home.ts             hero copy, shared by every variation
    people.ts           faculty, mentors and founding team (deck slide 13)
    company-logos.ts    company wordmarks for the faculty cards (files in public/logos)
  lib/
    logos.ts            organisation logos from Wikidata (P154) at build time, no key
  sections/hero/
    types.ts            HeroContent: the content contract every variation shares
    HeroTitle.tsx       title with a brand-coloured phrase; keeps "B-school" unbroken
    shared/             pieces the cinematic variations share
      Splash.tsx          full-screen splash: the SSB shield the camera zooms into
      intro.ts            zoom into the shield and land on campus, then the copy fades in
      LogoTicker.tsx      marquee of the `logos`, one tone, dark-mode aware
      FactsStrip.tsx      the facts on a frosted-glass strip (static text, no count-up)
      HeroNav.tsx         sticky nav: logo + Apply now, line below; render it at page level
      frame.ts            centred 16:9 frame maths for the scroll moment
      VideoOrPlaceholder.tsx  the campus film, or a moving placeholder until there is one
      hero.css            keyframes, masks, the splash's no-JS fallback
    v2/                 black hero laid out like a poster on desktop: the video fills the top,
                        feathered into the black; the copy sits at the bottom in two left-aligned
                        columns (title + ticker + CTAs | description + facts). Scroll brings the
                        video down into a frame inside the page margins, then the black fades to
                        the white page below
  sections/faculty/
    FacultySection.tsx  header + an auto-scrolling row of photo story cards (portraits in public/faculty)
    HScroller.tsx       the row: a real scroller that loops, pauses on hover/focus/touch, arrow buttons
    StoryCard.tsx       photo card: name, role, one company logo in white
    useSectionEntrance.ts  the section's entrance (below)
```

## Adding a hero variation

- New folder `src/sections/hero/v<N>/` with `HeroV<N>.tsx` (a server component taking
  `HeroContent`) and, if it moves, a `'use client'` `HeroV<N>Motion.tsx`. Add a route in
  `src/app/v<N>/page.tsx` and a line in the lab index (`src/app/page.tsx`).
- Every variation renders the **same** `HeroContent`, so variations compare layouts on identical copy.
  If a variation needs a new field, add it to `types.ts` as optional, don't fork the type.
  `HeroContent` is the future Storyblok schema; treat changes to it as schema changes.
- To reuse the splash and entrance, render `<Splash />`, mark every block that should fade in with
  `data-hero-fade` (and the other hooks `intro.ts` lists at its top), then call `runIntro()` inside
  `useMotion`. Add the variation's own
  media entrance through its `media` option.
- Add a doc comment at the top of the variation saying what makes it different.

## Design system rules (from the ssx-ui README)

The package README is the reference: `node_modules/@kishanscaler/ssx-ui/README.md`. Parts of its
Status section are out of date (it lists as "unreleased" things that ship in 0.7), and the `docs/`
it links to are not in the package. The `.d.ts` files are the reliable source for props.

- **Brand and theme** are attributes on `<html>`: `data-brand="ssb"` is set; `data-theme` is left
  unset so the page follows the OS. Always check both light and dark.
- **Light site.** The site is light mode. A dark hero is a dark island inside a light page.
- **Dark island:** put `data-brand="ssb" data-theme="dark"` together on one element to force dark
  tokens inside it (V2's hero). Both attributes must be on the same element.
  `data-theme="light"` does the same the other way.
- **Tokens only, and wrong names fail silently.** Tailwind's stock colours, spacing, radius, shadow
  and type scales are switched off, so an off-scale class compiles to nothing with no error:
  - Spacing has no 7, 9, 11, 14 … (`0 px 0.5 1 1.5 2 2.5 3 4 5 6 8 10 12 16 20 24 32 40`).
    `h-7` once collapsed every logo to 0×0.
  - Colour utilities are named after `--color-*` in `theme.css`: the page background is `bg-page`,
    **not** `bg-surface-page` (that one silently produced a transparent splash and a white V2).
  - After adding classes, check the built CSS actually contains them.
- **Breakpoints:** `xs` 320, `sm` 672, `md` 1056, `lg` 1312, `xl` 1584 (px). Not Tailwind's.
- **Type:** set text by role. `Heading` (the `as` prop is required) and `Text` (`size`, `tone`),
  or `type-*` utilities. Marketing heroes use `type-hero` / `type-billboard-*`. 12px is the floor.
- **Page layout:** `Section density="roomy"` for marketing sections, `Container` for the width and
  page gutter (`px-gutter`), `Stack` and `Grid` for spacing between things.
- **Icons:** pass an svg as a child; the component sizes it. In server components import from
  `@phosphor-icons/react/ssr`.
- **Links styled as buttons:** `<Button asChild><a href="…">…</a></Button>`. Icon well: `<ButtonIcon>`.
- **Class merging:** use `cn` from `@kishanscaler/ssx-ui`. It knows the type roles.

## The intro

The SSB shield (monogram only, no wordmark, no loader) is on screen from the first paint and
settles in with CSS. After `LOGO_HOLD` (1.25s from navigation, once fonts and video are ready) the
campus footage fades up in the shield's openings and the camera eases, then rushes, straight into
the shield's centre: motion blur from GPU-upscaled layers, trailing ghosts and a lens blur, and the
shield dissolves as it goes. The footage is already travelling to its slot as the shield clears,
launching at the zoom's speed and decelerating in. Then the nav's contents, the copy and the facts
fade in together, once. Tuning lives in the constants at the top of `intro.ts`.

**The desktop scroll moment** is CSS `position: sticky` inside a tall track (`data-hero-pin`), with
GSAP only scrubbing to scroll progress. Not ScrollTrigger pinning: pinning fixes the hero's width
when it starts, so any later width change (the scrollbar returning when the intro unlocks
scrolling, a resize) left the hero misaligned with a strip beside it; and it re-parents the hero,
which restarts CSS animations like the ticker.

**The sticky nav** (`HeroNav`) is lead-gen: logo and Apply now, always on screen. It lives at page
level because a sticky element only sticks inside its parent. On V2 it starts dark and turns light
with the page.

**The Faculty entrance** plays in two moments, each once, when its part is on screen: the header
(eyebrow, headline line by line, then the rest) when it is 85% of the way up, and the cards (wiped
open bottom to top, one after another) when their row is at 75%. One trigger for the whole section
fired while the cards were still below the fold. Starts use `clamp()` so they stay reachable when
the section is the last thing on the page.

## Motion rules

- GSAP through `@kishanscaler/ssx-ui/motion`: `useMotion` for scoped setup and cleanup, and
  `motionTokens`, `ease()`, `entrance()`, `stagger()` for every duration, curve and distance.
- The package's `Reveal` / `TextReveal` / `CountUp` only trigger on mount or in-view, which fires
  under a splash. Sequences that must wait for something use one timeline (see `intro.ts`).
- **Never tween a package `Button` directly.** Its `transition-all` corrupts GSAP's end values and
  the button stays invisible. Animate a wrapper.
- **Content enters with one gentle fade, not part by part.** No word splits, no staggered pieces,
  no count-ups on numbers: they read as the page stuttering in.
- **Never let the DOM move under a CSS animation.** Re-inserting an element restarts its CSS
  animations (the ticker jumped back). ScrollTrigger `pin` does this; use CSS sticky instead.
- **Never lock scrolling with `overflow: hidden`.** On screens that always show a scrollbar it hides
  the scrollbar, and when it comes back the page narrows and everything jumps sideways. The intro
  blocks wheel, touch and scroll keys instead (`holdScroll` in `intro.ts`).
- **Big scale animations need `will-change: transform`**, or the browser redraws the layer at full
  resolution every frame and stalls (the zoom did, 250–770ms). Measure frame times, don't eyeball.
- Every moving thing has a reduced-motion path that shows the final state: no splash, no pinning.

## Content

Copy in `src/content/home.ts` comes from the team's hero mock (2026-09-30). CTA hrefs are
placeholders and there is no campus video yet (a placeholder frame stands in; set `media.videoSrc`).
The five logos (BCG, ISB, McKinsey, IIMA, Bain) are confirmed. ISB and IIMA have no logo on Wikidata,
so they show as wordmarks until a `logoUrl` is added.

## Checking changes visually

Check every variation at 320px, 390px and desktop, in light and dark, and with reduced motion.
Plain headless-Chrome screenshots can't scroll, can't wait for a timeline, and won't lay out narrower
than about 500px. Drive Chrome over the DevTools protocol instead
(`Emulation.setDeviceMetricsOverride` for width, `Emulation.setEmulatedMedia` for dark mode and
reduced motion, `Runtime.evaluate` to scroll), and capture frames at set times after load.
