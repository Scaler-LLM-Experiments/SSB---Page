# Requests for the design team — `@kishanscaler/ssx-ui`

**Written 2026-09-30 for sharing with the design team.** What the site had to build itself to
replicate the SSB home-page hero (the design team's own lab, `SSB---Page`, V2) as Storyblok
blocks, and which package feature would let us delete each piece.

Everything here is an **approved, scoped exception to CLAUDE.md rule 7** ("no custom UI, no
explicit styling"). It lives in two places only and nowhere else:

- `apps/web/src/motion/` — the motion layer any block can switch on (entrances, marquee, scroll
  frame, splash, nav theme flip)
- `apps/web/src/components/storyblok/cinematic-hero*` — the hero's layout

The longer-standing gaps (unexported components, carousel dots, sticky, alignment, …) are in the
handoff, `docs/history/2026-09-30-handoff.md` §9. This file is the motion and hero list.

Priority: **P1** blocks the design as specified; **P2** we built a workaround that works but
duplicates the system; **P3** nice to have.

---

## 1. A motion vocabulary the package can drive from markup — P1

**What we built.** Blocks are server-rendered and carry `data-motion-*` attributes; a lazily
loaded runtime applies the package's own `revealFrom()` / `entrance()` / `stagger()` / `ease()`
to them. We could not use `Reveal`, `Stagger` or `TextReveal` directly because:

- they are React wrappers, and a server-rendered CMS block tree cannot wrap arbitrary children
  in client components without shipping them on every page (Next ships every client component a
  route can reach — measured: the package's `GlassButton` alone added 4.6 KB gz to *every* page
  until we split it);
- they trigger on mount / in-view only, which fires under a splash (your lab's CLAUDE.md says
  the same).

**Ask.** Either a documented `data-motion` attribute contract the package's motion entry
applies to any element (`data-ssx-reveal="fade-up" data-ssx-trigger="in-view"`), or a single
`<MotionScope>` client component that finds them — so every consumer does not rebuild this.
Also: a no-flash recipe (hide before the script, CSS fallback reveal) documented alongside it.
Ours is `motion/motion-head.tsx` + `motion/css.ts` (`ENTRANCE`).

## 2. Marquee — P1 (already in handoff §9.3)

**What we built.** `motion/marquee.tsx` + `css.ts` (`MARQUEE`): the row, then enough hidden
copies to fill two screen widths (a five-pill row is ~485px; it must repeat to cover a 1584px
screen or a gap opens), sliding by half its width; pauses on hover and `:focus-within`; a
manually scrollable row under reduced motion; only the first copy exposed to assistive tech.
Speed scales with the item count through an inline custom property.

**Ask.** A `Marquee` primitive (or a `marquee` prop on `Stack`) with: gap-matched seams,
repeat-to-fill, pause on hover/focus, reduced-motion fallback, and one accessible copy. Used by
`logo_strip`, `pill_row` and the hero's logos.

## 3. Sticky — P1 (already in handoff §9.9)

**What we built.** `css.ts` (`NAV_CSS`): `position: sticky; top: 0; z-index: var(--z-sticky)` on
the site header, only on pages that turn on the splash or the nav theme flip. And the scroll
frame's stage: `position: sticky; top: var(--motion-nav-h)` inside a `240svh` track.

**Ask.** `TopNav sticky` and a `Sticky` layout primitive (stick under an offset). The track
height is a design decision (how long the moment lasts) — a token would do.

## 4. Scroll-scrubbed "frame" moment — P2

**What we built.** `motion/effects/scroll-frame.ts` + `frame.ts`: your V2 scroll moment made
generic, so any media block can use it. The card leaves the flow, a timeline scrubbed to scroll
progress moves it into the biggest 16:9 box that fits under the nav and inside the content
column, rounds it to `--radius-2xl`, hardens feathered edges, reveals a caption/play control at
30% and fades a light backdrop in at 60%.

Findings you may want in the package if it ever ships this:

- ScrollTrigger measures once; a lazy image loading above the frame pushed it ~500px late. We
  re-measure on body resize (`effects/refresh-on-layout.ts`).
- A lazy image has no size until it loads (Storyblok's delivery API has no dimensions), so the
  frame must be built after `load`.
- In a shrink-to-fit column the slot collapses to 0 wide once the card leaves the flow; the
  slot needs its measured width *and* aspect ratio.
- A responsive image must be told its new display width (`sizes`), or the framed image is the
  small file upscaled (2.75x measured).
- **Animating `left`/`top`/`width`/`height` is a layout shift every frame** — your lab's
  intro and scroll moment do this, and on our live page it cost desktop Lighthouse 7–8
  points (CLS 0.13). We now draw the card with transforms only: scaled onto the target,
  its media a CSS cover box (container units) counter-scaled so it never squashes, its
  overlays scaled back to 1:1. CLS 0.0068. Worth fixing in `SSB---Page` too.

**Ask.** Low priority as a component; high value as documentation of these four traps.

## 5. Image/video feathering (soft edges) — P2

**What we built.** `cinematic-hero.css.ts`: four `mask-image` gradients composed with
`intersect`, each edge's feather a custom property (`--feather-left/right/top/bottom`) so motion
can tween them to 0%. Your lab's `hero-v2.css`, verbatim in idea.

**Ask.** A `feather` prop (per edge) on an image/media primitive — which also needs to exist
(handoff §9.12: no image primitive, no rounded corners).

## 6. The cinematic hero's poster layout — P2

**What we built.** `cinematic-hero.css.ts`, ported from `HeroV2.tsx`: on desktop the video slot is
absolutely positioned across the top 68% of one screen under the nav; the copy sits in a
two-column grid (`minmax(0,1fr) auto`), bottom-aligned; the description takes the width of the
facts strip under it (`width: 0; min-width: 100%`). On a phone, one column in reading order and
the video as a 4:5 rounded card. None of this is expressible with `Section`/`Container`/`Grid`
props (no absolute layers, no `auto` track, no row placement, no "one screen" height).

**Ask.** A `Hero` / `Poster` layout primitive with a media layer and a copy grid, or at least:
`Grid` column templates beyond equal fractions, row/column placement props, and a
`min-height: one screen under the nav` option on `Section`.

## 7. Frosted facts strip — P3

**What we built.** `[data-hero-facts]` in `cinematic-hero.css.ts`: a flex row on
`--glass-on-image-surface` + `backdrop-filter: blur(var(--glass-blur))`, hairline dividers from
`--on-image-ink` at `--opacity-faint`. The tokens are yours; the recipe is ours.

**Ask.** A `GlassPanel` (or `Surface variant="glass-on-image"`) and a divided inline list.

## 8. Brand splash — P3

**What we built.** `motion/splash.tsx` + `effects/splash.ts` + `css.ts` (`SPLASH`): your lab's
intro, generalised by brand. It reads `--brand-mark` and cuts the shield's outline out of the
ground so the footage shows through.

**Gap found:** the camera flies into a measured point inside the mark (SSB: the opening at
(14.45, 22.5) in its 29×40 viewBox, found by a distance transform). **SST's point has not been
measured**; the splash falls back to the mark's centre on SST pages. If the package exported
each mark's "opening" coordinates next to `--brand-mark`, the splash would be correct for both.

## 9. Things that tripped us, for the package docs — P3

- A package `Button` must never be tweened directly: its `transition-all` fights GSAP's
  per-frame values and the button stays invisible. We switch transitions off on every entrance
  target while it tweens (`effects/entrance.ts`).
- `data-brand` and `data-theme` must be on the **same element** for a dark island to get the
  brand's dark tokens; a block cannot see the page's brand, so the page has to hand it down.
- The package's `motion` entry re-exports `TextReveal`, which imports SplitText; tree-shaking
  kept our entrance chunk at 4.3 KB gz, but a consumer importing the barrel differently could pay
  for SplitText on every page.
- React 19 merges same-precedence `<style href>` tags into one; a selector like
  `style[data-href="x"]` will not find them. Worth a line wherever consumers are told to hoist
  CSS this way.

## Measured cost of all of the above (2026-09-30, gzip)

| Page | JS beyond a no-motion page |
|---|---|
| Any page with every toggle off | **+1.1 KB** vs `main` (thin wrappers), CSS +95 B, HTML +121 B; no GSAP |
| Entrances only | ~36 KB (GSAP core 27.4 + runtime/tokens 4.4 + entrance incl. SplitText 4.3) |
| School of Business with the full hero (splash, frame, flip, marquee) | **+59.8 KB** (+ ScrollTrigger 17.7, hero media/GlassButton 4.4, splash 2.5, frame 2.1, flip 0.7) |

GSAP core is the single biggest line. CSS scroll-driven animations / WAAPI for the entrances
would remove it from pages that only fade things in.
