# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

# SSB home page lab

Next.js app for exploring design variations of the **Scaler School of Business (SSB)** home page,
built on the Scaler Design System package `@kishanscaler/ssx-ui`. The bar the team has set is
**premium**: one deliberate, orchestrated moment per variation, everything around it quiet.

## Where this is going

1. **Now:** the home page, section by section, in the deck's order. The hero is V2, then
   Placements (deck slide 3), then the Faculty section, ported from a teammate's build. Placements
   was in three variations on /v2 for comparison (2026-10-01); the team picked the showcase
   (2026-10-05), so /v2 is hero, showcase, Why SSB (deck slide 4), Faculty. The stories and grid variations' files are still
   in `sections/placements/` but no route renders them (all three are in commit a15a685, so deleting
   them loses nothing). Section copy comes from the content deck
   `ssb-website/SSB Website vF _ Sep'26.pdf` (internal, so gitignored: the repo is public).
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
npm start          # serves the production build (use it for frame-time and layout-shift checks)
npx prettier --write <files>   # .prettierrc: single quotes, 110 wide (the code's style)
```

There are no tests and no linter. A change is checked by `npm run typecheck` / `npm run build`, then
in the browser (see "Checking changes visually").

Prettier with no config uses double quotes and 80 wide, and rewrites whole files; the `.prettierrc`
is there so it matches the code.

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
    placements.ts       placement figures and recruiter names (deck slide 3)
    why.ts              Why SSB: the deck's title, figures and quote; the team's mock for the rest (slide 4)
    company-logos.ts    company wordmarks for the faculty cards (files in public/logos)
  lib/
    logos.ts            logos sized to equal ink (`LogoSizing`: the ticker's, the placements grid's),
                        from our own files or Wikidata (P154) lookups
  sections/hero/
    types.ts            HeroContent: the content contract every variation shares
    HeroTitle.tsx       title with a pure-white phrase; keeps "B-school" unbroken
    shared/             pieces the cinematic variations share
      Splash.tsx          full-screen splash: the SSB shield the camera zooms into
      intro.ts            zoom into the shield and land on campus, then the copy fades in
      LogoTicker.tsx      marquee of the `logos`: one tone, equal visual weight, own colours on hover
      FactsStrip.tsx      the facts on a frosted-glass strip (static text, no count-up)
      HeroNav.tsx         sticky nav: logo (draws itself on hover) + Apply now, line below; page level
      frame.ts            the centred 16:9 frame, and drawCard: moves the video card by transforms only
      VideoOrPlaceholder.tsx  the campus film, or a moving placeholder until there is one
      hero.css            keyframes, masks, the splash's no-JS fallback
    v2/                 black hero laid out like a poster on desktop: the video fills the top,
                        feathered into the black; the copy sits at the bottom in two left-aligned
                        columns (title + ticker + CTAs | description + facts). Scroll brings the
                        video down into a frame inside the page margins, then the black fades to
                        the white page below
      HeroV2.tsx          the markup (server component); HeroV2Motion.tsx: intro media + scroll moment
      moment.ts           the scroll moment's phases, in screens of scroll; the track height from them
      FilmPlayer.tsx      the big play button, and the YouTube film with YouTube's controls rebuilt
      film-player.css     those controls, in YouTube's own values (not the design system)
  sections/faculty/
    FacultySection.tsx  header + an auto-scrolling row of photo story cards (portraits in public/faculty)
    HScroller.tsx       the row: a real scroller that loops, pauses on hover/focus/touch, arrow buttons
    StoryCard.tsx       photo card: name, role, one company logo in white
    useSectionEntrance.ts  the section's entrance (below)
  sections/why/         WhySection.tsx (server): faculty-style header, the quote as a paused clip with
                        two figures, a line whose last words cycle the roles, three stacking chapters;
                        WhyMotion.tsx; why.css; types.ts (WhyContent)
  sections/placements/  three variations on one PlacementsContent (all async server components)
    types.ts            PlacementsContent: four stats, a lead, the stories, the showcases, the logos (with
                        placeholder hires counts), the report CTA, every recruiter's name
    shared.tsx          the faculty-style header (aside at its end, or level with the title), Figure,
                        RollingFigure, FigureStrip (the strip of figures, or `boxed`), LogoImage, Drift
                        (two drifting columns of tiles), LogoTile, RoleTile
    carousel.ts         motion the carousels share: card entrance, strip roll (rollIn), the scroller's
                        controls (stops, autoplay, mouse drag), and fadeControls (the crossfading deck)
    PlacementsStories.tsx  the stories variation: wide claim cards (drifting logos or roles, or a photo),
                        arrows, no indicator, then a strip of figures
    StoriesMotion.tsx      its motion (carousel.ts)
    PlacementsShowcase.tsx the showcase variation (the one on /v2): lead with the report CTA level with
                        the title, App Store-style photo cards (Bengaluru, San Francisco), crossfading,
                        chips naming them at their top left, then one box of recruiters' logos
    ShowcaseMotion.tsx     its motion: the crossfade, the figures sliding in, the chips, the logos' cycle
    PlacementsSection.tsx  the grid variation: one tight panel of four stats, then a 12-logo grid
    PlacementsMotion.tsx   its motion: the stats' green wipe, the logos' cycle and 3D flip
    placements.css      all three: tint, units, the flip, the carousel, the logo wall, the reels, the
                        showcase's header grid, blur, scrim, chips, sideways logo rows, recruiters' box
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
  unset so the lab index follows the OS. Variation pages pin light on their `<main>`
  (`data-brand="ssb" data-theme="light"`, `src/app/v2/page.tsx`), so an OS in dark mode should change
  nothing there. Always check both light and dark, to catch anything that leaks.
- **Light site.** The site is light mode. A dark hero is a dark island inside a light page.
- **Dark island:** put `data-brand="ssb" data-theme="dark"` together on one element to force dark
  tokens inside it (V2's hero). Both attributes must be on the same element.
  `data-theme="light"` does the same the other way.
- **Tokens only, and wrong names fail silently.** Tailwind's stock colours, spacing, radius, shadow
  and type scales are switched off, so an off-scale class compiles to nothing with no error:
  - Spacing has no 7, 9, 11, 14 … (`0 px 0.5 1 1.5 2 2.5 3 4 5 6 8 10 12 16 20 24 32 40`).
    `h-7` once collapsed every logo to 0×0; `h-56`/`h-64`/`h-72` once left a photo box 0 tall and a
    logo wall unbounded on phones. Taller fixed sizes go in CSS.
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
settles in with CSS. Halfway through that entrance (`WINDOW_AT`; its curve has it ~99% in place by
then), once the film can play, the campus film fades up in the shield's openings (~0.5s from
navigation) and plays there while the logo holds. Waiting for the entrance to end left the film
~0.2s in the logo. After `LOGO_HOLD` (1.25s from navigation, once fonts are ready too) the camera
eases, then rushes, straight into the shield's
centre: motion blur from GPU-upscaled layers, trailing ghosts and a lens blur, and the
shield dissolves as it goes. The footage is already travelling to its slot as the shield clears,
launching at the zoom's speed and decelerating in. Then the nav's contents, the copy and the facts
fade in together, once. Tuning lives in the constants at the top of `intro.ts`.

**The desktop scroll moment** is CSS `position: sticky` inside a tall track (`data-hero-pin`), with
GSAP only scrubbing to scroll progress. Not ScrollTrigger pinning: pinning fixes the hero's width
when it starts, so any later width change (the scrollbar returning when the intro unlocks
scrolling, a resize) left the hero misaligned with a strip beside it; and it re-parents the hero,
which restarts CSS animations like the ticker.

**The video card moves by transforms only**, in the intro and the scroll moment (`drawCard` in
`frame.ts`). It keeps its slot's layout size and is translated and scaled onto the box it should
fill, which stretches it, so: its media is a 16:9 box covering the card (`.hero-media-cover`,
container units, the card is a size container) counter-scaled to an even scale, so the film never
squashes and shows whole once framed 16:9; its overlays (`data-video-overlay`: caption, play,
YouTube film) are laid out at the scroll frame's size and scaled back to 1:1; its corners are drawn
elliptical in the card so they look round on screen. `clearCard` hands it back to CSS at rest.

**The sticky nav** (`HeroNav`) is lead-gen: logo and Apply now (its arrow after the label), always on
screen. It lives at page level because a sticky element only sticks inside its parent. On V2 it
starts dark and turns light with the page. Hovering the logo plays the package's loading mark
(`LogoLoader`: the shield traces and inks itself) over the static shield, which steps aside; the
loader is square with the 29:40 shield centred in it, so it sits `(29/40 − 1) × height / 2` left of
the lockup's shield, and is shown with `display` so the draw restarts on every hover.

**V2's scroll timing** is generic: `v2/moment.ts` sets each phase in screens of scroll (1 = one
viewport height): the copy fades over 0.1, the video frames over 0.25 (its play button and controls
arriving over the last quarter), a beat of 0.05, the white over 0.17 (the nav turns light halfway),
a hold of 0.08. The timeline runs in those units and the track's height is computed from their sum
(`TRACK_HEIGHT`: one screen under the nav plus 0.55), so the moment takes the same share of any
screen: framed by 222px and white by 417px on 1480×888, by 270px and 508px on 1920×1080. Change a
phase there; nothing else needs retuning. The scrub smooths lightly (`duration.slow`): heavier
smoothing lagged a quick flick past the end of the short track, so the hero began to scroll away
before the moment had finished (it read as a glitch). History: the next section began 2,195px down
the page at 240svh (~6 flicks); 1,377px now.

**The Faculty entrance** plays in two moments, each once, when its part is on screen: the header
(eyebrow, headline line by line, then the rest) when it is 85% of the way up, and the cards (wiped
open bottom to top, one after another) when their row is at 75%. One trigger for the whole section
fired while the cards were still below the fold. Starts use `clamp()` so they stay reachable when
the section is the last thing on the page.

**Placements is neutral at rest; green is only motion** (the team's call: green figures and green
icons read dated, "2016", as did grey-bordered cards with icons in pale tiles, a dashed logo grid,
and a bezel tray around each card). Both variations use the faculty section's header, in type and
motion: the same markup hooks (`data-enter="header|eyebrow|headline|sub|controls"`, in
`PlacementsHeader`) and `useSectionEntrance` itself (it finds no `.ssx-card` there, so it only plays
the header; don't give the cards that class, `story-card.css` styles it globally). Their own fades
use `data-fade` so the two never both animate a block.

**The stories variation** (the team's idea: logos alone are what every school shows) makes claims
about who hires, wide cards in a carousel (`min(88%, 54rem)`: 80% of the first cut, the team's
call; the next card peeks in), each with its proof beside it: those recruiters' logos, or the
career-switch card's roles (the role over its company's logo, small, as the secondary line;
only where we have the logo; kept light: a short tile, the role at the label size, the logo at
`zoom` 0.55, 0.4 for the showcase's larger logos, which shrinks the layout box too and keeps the
logos' equal weight; an h3 role over a big logo read heavy), drifting past in two columns (`Drift`: tiles drift opposite ways, CSS, each tile carrying its
own gap so one copy is exactly half the track, tracks out of the flow so a column is as tall as its
box; short lists repeat to at least 6 a column), or a photo (a still from the campus film, standing
in for the report asset). Copy sits with the kicker at the top and the claim at the bottom. The
cards on screen open as the faculty cards do. No indicator (the team's call): arrows, swipe,
trackpad and a mouse drag; it moves on every 5s (`DWELL`, both carousels), wrapping, but waits on hover, focus inside, 3s
after a swipe, wheel or drag, during the entrance (`data-hold`) and off screen. Tried: narrow
cards like the faculty row (the team kept the wide ones). Under it, the outcomes as a quiet strip
(`FigureStrip`; the team's reference: Apple's camera spec row, a big figure over a one-line
caption), supporting the claims rather than leading. **The figures roll in like counter reels: a count-up, which the
motion rules otherwise forbid; the team asked for it.** Each digit is a slot the width of its
final digit (tabular figures) over a reel of two turns of 0–9, drawn landed so no-JS and reduced
motion show the value; the reel is masked at its edges, not clipped with `overflow` (that moves an
inline-block's baseline to its bottom edge). The drawn figure is `user-select: none`, so copying it
gives the screen readers' value ("₹19L"), not every reel's digits (a copy once pasted 40 of them).

**The carousels' controls** (`carouselControls`) work in stops, not cards: where the row can rest,
one per card until the end of the scroll (a row reaches its end before its last cards reach the
margin, so it can have fewer stops than cards; at 4 cards of 24rem on 1440 it had 2, and two of
four dots could never light). Segments past the last stop are hidden; stops are measured again on
resize. A mouse drags the row: snapping off while dragging, then it settles on the next stop in the
drag's direction and snapping comes back on `scrollend`; the click that ends a drag is swallowed.

**The showcase variation** (the team's references: Apple's "Power on full display" for the order,
the App Store's Today cards, the team's slideshow card for the chips) reads top to bottom: the
header (left-aligned; a longer `lead`, held to three lines on desktop by `panel-2xl`; the report
CTA at the right, centred on the title's line, by a grid (`asideAt="title"`): the hero's secondary
CTA, large, with its download icon), the carousel, then the recruiters. Each card: a photo of the
place (Bengaluru's Vidhana Soudha, San Francisco's Golden Gate; CC0 from Wikimedia Commons,
`public/media/CREDITS.md`; 1280 and 2560px with `srcset`, so a retina desktop gets it sharp and a
phone small) in a grey frame (a coloured frame, brand green or ink, was too much), a column of
large logos (or the alumni's roles, by name: role over company, centred on tiles the logo tiles'
size, all eight; logos there read heavy and set that card apart, the team's call) floating the
card's full height on desktop; below desktop the card stacks (photo, then figure and claim, then
the logos at its foot) and they run as two rows drifting sideways one each way (the team's calls,
2026-10-05/06: two narrow columns were hard to read on a phone, and rows over the photo above the
claim crowded it; the same `Drift` markup, its tracks laid out along a row and moved by
`translateX`; tiles 10rem × 4.5rem on a tablet, 7.5rem × 3.25rem on a phone, logos at `zoom` 0.75
and 0.6; on a phone the roles show without their company, set tight so a role over two lines
fits). Every card's copy
sits at its foot (`justify-content: flex-end`), so a two-line claim ends where a three-line one
does and the spare height goes above the figure: the cards share one grid cell, so the tallest
sets the height. The report CTA is full width on a phone, as the hero's CTAs are. At its foot the
figure with the claim reading on from it as one statement, **in white** ("50+" / "startups from
Bengaluru…", the claim at medium weight, `type-h2` on a phone; no line under it; all the team's
calls). **The photo blurs progressively, not by fading to grey** (the team's call): three blurred
copies of it (10px behind the logos, 6px then 18px toward the copy), each revealed by its own
gradient, under a dark scrim (`surface-image-scrim`, starting higher on a phone) for the white
type. Copies, not `backdrop-filter`, which would re-run as the page scrolls. Every layer is scaled
up alike (1.2) so they stay aligned while each blur's transparent rim falls outside the card (CSS
blur fades an element's edges to transparent, which would show the sharp photo there), and the
layer is composited (`will-change`) so the entrance's zoom never re-blurs.

**The cards crossfade** (the team's call, 2026-10-05; `fadeControls`): stacked in one grid cell
(`pl-fade`), the new card fades in over the old, whose photo stays whole under it (two half-faded
cards let the page show through), while the old card's figure, claim and logos fade out first (or
they show through the new one); then its photo settles from a slight zoom, **its figure slides up
into its line** (`data-slide`, clipped by its line: not the counter roll, the team's call), its
claim and logos rise in. 60fps (p95 16.7ms) at 2× through a change. **Render the stack from the
server:** turning a scroller into the stack on load moved the hidden cards, a 0.53 layout shift;
now CSS stacks them from the first paint and holds cards 2 and 3 transparent (not hidden: screen
readers keep them) until the script marks `data-fade`. The cards' z-indices live inside the stack
(`isolation: isolate`), or the cards cover the chips laid over them. A sideways touch swipe goes on
or back (`touch-action: pan-y`, so vertical swipes still scroll); the cards not on show are inert.

**The chips** (after the team's slideshow card, 2026-10-05) name the cards at their top left, in
line with the copy: one row laid over the deck (`data-deck` holds both), so it stays put as the
cards change under it. They replaced the tab the cards had cut out of their frame (fewer things on
the photo, the team's call). Light glass, quiet (the team asked for less contrast than a solid
white chip on dark glass): the one on show a step brighter, the card's 5s running as a 2px line
along its foot in the brand green (green only as motion); a small `backdrop-filter`, cheap at that
size. No check mark on the active chip and no weight change, unlike the reference: either widens
it, which moves the others, a layout shift on every autoplay step. The row scrolls when it doesn't
fit (a phone), faded inside the copy's inset so at rest the first chip sits on the copy's edge; the
active chip is centred in it with the row's own `scrollTo`, never `scrollIntoView` (that scrolls
the page too). The pointer anywhere on the deck pauses the carousel (`area`); focus on a chip
doesn't, or a click would stop it. **Nothing between a chip and the photo may have a mask, filter,
clip-path or opacity below 1**: each makes that ancestor a backdrop root, so the chip's
`backdrop-filter` blurs only what is inside it (nothing). An edge-fade mask on the row once left
the chips sharp-backed glass; the row now has none and is clipped at the photo's edges. For the
same reason each chip fades in itself with the first card, not their row.

**The recruiters** (2026-10-05, in place of four figure boxes): a line over one box of twelve
cells, hairlines between them (a 1px gap over the line colour), no fill (6 × 2 on desktop, 4 × 3,
3 × 4 on a phone, logos at `zoom: 0.75` there; twelve always fill their rows). Each cell stacks its
logo from each set of twelve (31 logos, three sets; a cell with fewer wraps round); every 4s they
all crossfade in place to the next set together (`cycleBoxes`; a drift up and out was tried),
the count starting when the box comes on screen, stopped off screen, on a hidden tab and under
reduced motion. No pause under the pointer (2026-10-06): the team read it as the cycle running slow. The logos are in their own
colours (the team's call, 2026-10-06; grey until pointed at before). The line is the team's, "200+
recruiters hire SSB students on campus." (`recruitersTitle`, `Heading size="3"` at medium weight; it was an eyebrow, then size 2,
"Our recruiters"): **"200+" is a placeholder**, the deck lists 62. Seven of the 31 were added
on 2026-10-05 from English Wikipedia's article images (Aviva, CKA Birla Group, FNP, ONDC,
HealthifyMe, Landmark Group, The Times Group), trimmed and measured as before; Wikidata had only
Aviva's. Not used: Wikidata's "Muthoot FinCorp" logo is Muthoot Finance's (another company), and
"Noise (company)" on Wikipedia shows a mark that isn't the wearables brand's. The rest of the
deck's 62 have no logo on either. Grey until the pointer is on one (its own colours, as the hero's ticker). Tried that day: a
marquee row of the logos; six light-grey boxes with gaps between.

Tried on 2026-10-05: a horizontal scroller (the cards slid); the chips under the copy at the cards'
foot, frosted dark; the pill switcher over or under the cards (its dark pill a copy of the tabs
clipped to the active one); a sentence under each claim; the four figures as grey boxes, smaller
(`type-h1`) so they didn't fight the card's. On 2026-10-01: the report as a detached fourth pill
beside the switcher (the team: a CTA, not a tab); the switcher centred, under the cards, at their
top right; three figures under the lead; Apple's chip-fact layout under the cards (icon, figure and
label, hairline, sentence). Earlier: everything centred (the line-by-line headline jumped 1px at
320 when SplitText reverted, a 0.006 layout shift; left-aligned headers don't); a white panel on a
campus photo; logos on tiles over a washed-out photo; claims in near-black over a light frost.

**Why SSB** (deck slide 4, 2026-10-05) is an argument in three beats under the faculty-style header
(its entrance via `useSectionEntrance`; the title's last phrase in the brand green; the eyebrow
grey), on a faint grey band (`bg-surface-subtle`). The team asked for something creative in place
of their mock's two rows of white cards; a second take (an editorial band, then three steps beside
one photo, taking turns) wasn't it either. **The receipt:** the Kamath remark as a paused clip (the
deck asks for a still from the AMA video; a dark frame stands in), the deck's words as a white
caption, only the quoted part in quote marks, a playback bar running along its foot while it is on
screen; beside it "He isn't alone in that read." and the 60% and 62% figures (each sliding up into
its line), hairlines between. **The turn:** the deck's "Nobody is preparing you for emerging roles
like", large, its last words turning over in green through the deck's four roles (a slot as wide
as the longest, every role stacked in it, so the line never moves; screen readers get the list
once). **The answer:** three chapters (01 Build, 02 Ship, 03 Grow) that stack as the page
scrolls: each card is CSS-sticky under the nav, a step lower than the one before so their tops
show; as the next slides up over it, it settles back (scale 0.94, scrubbed), the section's grey
fading over it on a layer of its own. Fading the card itself let the card under it show through.
Not sticky under reduced motion. The mock's figure captions said "as cited in the brief", a
placeholder: these are the deck's own sentences. 60fps scrolling the stack once its photos have
loaded (an instant jump onto lazy photos stalled one frame 417ms, decoding). **The photos are
cropped from the mock's screenshot (742 × 428) until the team sends the originals.**

**"The carousel is not working" (2026-10-01)** was a page left open while its server-rendered markup
changed under a hot reload: the client motion had bound to the old nodes, so the tabs did nothing
and the pill stayed hidden. A reload fixes it; production never does this. CSS lights the first
chip until the motion has set the active one (`data-ready`), so a stale page still reads right.

**The grid variation's moment** is the stats: each cell comes up one after another (like the
faculty cards), wiped open from the bottom in the brand green (a `data-card-tint` layer, a
deep-green gradient), which clears to white as its content fades in. The panel's `overflow:
hidden` rounds the outer corners, so the wipe needs no radius. `ScrollTrigger.batch` groups the
cells by arrival, so the desktop row of four staggers and a phone's column brings each up as it is
reached. Cells are tight (icon, figure, label, one short line).

**The logo grid** (solid hairlines: a 1px gap over the line colour) holds twelve logos (6 × 2,
4 × 3, 3 × 4); every 4s all of them cross-fade to their cell's next logo together. Pointing at a
logo turns its cell over in one 3D move (rotateX to 180°, `preserve-3d`, both faces drawn, the back
hidden by `backface-visibility`) to "N students placed" on one line, while the other logos fade to
grey; a tap does it on a touch screen; under reduced motion it turns at once. The cycle waits while
the pointer is on the grid. The logos cross-fade inside the front face, never on the flipper or its
parents: opacity below 1 flattens an element's 3D children, which would show both faces mid-turn.
Earlier versions flipped random cells on a timer (busy at 1.2s; the team asked for hover only).
Logos are in their own colours (the team's call), sized to equal ink in a 128 × 36 box. Measured
(both variations): no layout shift, no horizontal overflow at 320 and 390; 60fps through the
stats' entrance (p95 16.8ms).

Tried and dropped on 2026-10-01, at the team's request: stat bars drawn to scale (each grew at one
speed to its value), edge-to-edge rows of recruiter names drifting with the scroll, per-stat SVG
drawings (coin stack, before/after bars, a ring, a dot sphere), a report callout, green figures
and icons, cards in a bezel tray, timed random flips, and a grey line beside the recruiters'
heading ("MNCs, AI companies and top startups", a hover hint). The team's
reference was a stat card with its figure big in the brand colour, a rule, then a sentence.

The grid's 24 logos came from Wikidata (P154) and, where Wikidata has none, English Wikipedia's
article images (`Special:FilePath`, on Commons or, for non-free logos, on en.wikipedia). Dropped:
Edelweiss (a tiny boxed lockup), Meesho and Rapido (app icons on solid boxes), Reckitt (Wikipedia
still has the old Reckitt Benckiser mark). Each was trimmed to its ink in headless Chrome (render,
find the ink's bounds, crop the viewBox) and its `ink` measured the same way. Myntra's SVG wraps a
raster (139 KB). **Placeholders in `placements.ts`, to replace before anything ships:** the hires
counts; the stories' and showcases' copy (only the first card's claim is the team's), the `lead`,
and the report link; "50+ startups" (the deck lists 62 recruiters, about 43 of them startups);
"10+ MNCs" (our count of the deck's list); "200+ recruiters" (the deck lists 62). The `roles` are real (the deck's "Strong Alumni Base"),
but only Emergent is an AI company: "AI titles" need the team's data. No logo on Wikidata for
Emergent, Avendus, Ninjacart or The Whole Truth, so the stories' career-switch card shows the four of
the eight whose logos we have (the showcase's roles card names all eight).
Campus photos are stills from the campus film until the team's arrive.

## Motion rules

- GSAP through `@kishanscaler/ssx-ui/motion`: `useMotion` for scoped setup and cleanup, and
  `motionTokens`, `ease()`, `entrance()`, `stagger()` for every duration, curve and distance.
- The package's `Reveal` / `TextReveal` / `CountUp` only trigger on mount or in-view, which fires
  under a splash. Sequences that must wait for something use one timeline (see `intro.ts`).
- **Plain CSS beats Tailwind's utilities whatever the specificity:** utilities sit in a cascade
  layer, a section's own `.css` doesn't. `margin: 0` on `.pl-carousel` once cancelled its `mt-24`.
  Don't set in a class what the markup sets with a utility.
- **Don't start a GSAP-scaled or -rotated element with Tailwind's `scale-*`/`rotate-*`.** v4 writes
  them as the separate `scale`/`rotate` properties, which multiply with the `transform` GSAP writes
  (a `scale-x-0` bar never fills). Set the start state inline (`transform: scaleX(0)`) instead.
- **Never tween a package `Button` directly.** Its `transition-all` corrupts GSAP's end values and
  the button stays invisible. Animate a wrapper.
- **Content enters with one gentle fade, not part by part.** No word splits, no staggered pieces,
  no count-ups on numbers: they read as the page stuttering in. (Exceptions, the team's asks: the
  stories variation's figures roll in like counter reels; the showcase's and Why SSB's figures
  slide up into their lines.)
- **Never let the DOM move under a CSS animation.** Re-inserting an element restarts its CSS
  animations (the ticker jumped back). ScrollTrigger `pin` does this; use CSS sticky instead.
- **Never lock scrolling with `overflow: hidden`.** On screens that always show a scrollbar it hides
  the scrollbar, and when it comes back the page narrows and everything jumps sideways. The intro
  blocks wheel, touch and scroll keys instead (`holdScroll` in `intro.ts`).
- **Big scale animations need `will-change: transform`**, or the browser redraws the layer at full
  resolution every frame and stalls (the zoom did, 250–770ms). Measure frame times, don't eyeball.
- **Move things with transforms, never `left`/`top`/`width`/`height`.** Layout properties make every
  frame a layout shift. The video card used to move that way: CLS (layout shift score) 1.15 on a phone
  and 0.05 + 0.03 on desktop in this lab; on the production site, desktop Lighthouse lost 7–8 points
  (CLS 0.13). With `drawCard`: 0 on desktop, 0.004 on a phone (the ticker's logos taking their width
  as they load). A size change with no change of position is not a shift (the overlay is resized only
  on refresh, while hidden).
- **Measure layout when you use it, not before.** The intro opens the shield's window before the web
  fonts arrive; when they do, the hero reflows and the slot moved 27px, so the full-screen card was
  drawn off by 27px when the zoom began. The zoom re-measures (`fullScreen`) when it starts.
- **ScrollTrigger measures on refresh only** (load, resize). If anything above a scroll moment can
  change height afterwards (a lazy image without dimensions, a font swap), the moment starts late:
  ~500px on the production site. There, they re-measure on body resize (a ResizeObserver calling
  `ScrollTrigger.refresh()`). Here only the nav sits above the hero; add the same if a section ever
  goes above it. Give every image its dimensions or aspect ratio, and build anything measured from an
  image after it loads.
- **`pointer-events` is inherited.** The overlay layer is `pointer-events-none` so the film can be
  scrolled over; the play button and the YouTube iframe inside it set `pointer-events-auto`.
- Every moving thing has a reduced-motion path that shows the final state: no splash, no pinning.

## Content

Copy in `src/content/home.ts` comes from the team's hero mock (2026-09-30). CTA hrefs are
placeholders. The campus film (`public/media/campus-film.mp4`, 15s, silent, 6.4 MB) is cut from the
team's GIF (`src/Gif.gif`, 313 MB, gitignored): frames 0–453, before the screen recorder's player
controls appear, lightly denoised, H.264 CRF 26. One `<video>` plays it from first paint: behind the
shield, in the hero, then framed on scroll, looping, never restarted. The framed video's play button
opens the full film from YouTube (`media.youtubeId`, via youtube-nocookie) in the frame and pauses
the loop; scrolling back out of the frame or the hero off screen closes it and the loop resumes.
The hero's type: title `type-hero` (48px desktop, 28px phone; one step under `type-billboard-sm`'s
56/32) and the eyebrow in pure white (`text-on-image-ink`); eyebrow at the label size, description
`Text size="lg"`; CTAs without icon wells, but each with a trailing icon (`HeroCta.icon`,
`CtaIcon`: an arrow for Apply now, a download for the brochure and the report; the team's call,
2026-10-01). A CTA anywhere on the page takes one.

### Logos

The ticker (560px wide on desktop, `panel-lg`) shows BCG, Swiggy, McKinsey, Cars24 and Bain (ISB and IIMA were dropped for now), our own
files in `public/logos`, trimmed to their edges, in their own colours. BCG, McKinsey and Bain came
with the Faculty section; Swiggy's (current icon + wordmark) and Cars24's (current violet mark) are
from English Wikipedia's article images, and Cars24's had 60 units of empty space cut from its
viewBox. A `logoUrl` that isn't ours (or a `wikidataId`) still works, at a fixed height.

- **Equal visual weight = equal ink, not equal height or box.** Coverage (the share of a logo's box
  its artwork fills) runs from 0.13 (McKinsey's thin serif) to 0.52 (BCG's slab letters): at equal
  boxes BCG weighed twice Bain. `resolveLogos` reads each file's proportions at build time (SVG
  viewBox, PNG header) and sizes it so width × height × `ink` is the same for all, capped at
  196px wide; the img gets that size as attributes, so it takes no layout shift as it loads.
  Measure `ink` for a new logo in the browser: draw the file on a canvas and average, per pixel,
  alpha × min(1, (1 − luminance) × 1.8) (its coverage in the one tone below). Set it in
  `home.ts`.
- **The one tone keeps white details.** `brightness(0) invert(1)` turns a whole logo white, so
  Swiggy's pin and Cars24's "C" vanished into solid squares. Instead: `grayscale(1) invert(1)
  brightness(1.8)`, so colour goes white and white details go black (cut-outs); the light page
  inverts it back. Tailwind's filter utilities always apply in a fixed order (brightness before
  grayscale and invert), so order-sensitive filters are written in CSS (`hero.css`).
- **Hover shows the real colours, with no tile behind** (the team's call). The dark ones (BCG's
  green, McKinsey's navy) are low-contrast on the black hero.

### The film player

The framed video is a YouTube player in two states, under one set of YouTube's controls rebuilt
(`Controls` in `FilmPlayer.tsx`, fed by a small source interface: time, duration, buffered, seek).
**The preview:** the silent loop, playing, with the 80px play button and, inside the video as on
YouTube, the scrubber over a control row of just play and the time (0:07 / 4:48): the bar spans
the full film (`media.youtubeLength`, 288s), creeps forward with the loop, shows times on hover,
and a click or drag opens the film at that point (either play button opens it from the start).
Not a bare bar along the bottom edge: the card's rounded corners clip it. Lengths are shown rounded up, as YouTube lists them:
the film runs a fraction over 287s, so 4:48, not 4:47.
**The film:** the first open loads YouTube's IFrame API and plays the full film
(`media.youtubeId`, 4:47) with the embed's controls off and the same controls on top: the progress bar (3px, 5px on hover, red-to-pink played, buffered, the red knob, a time
tooltip; drag to scrub), play/pause, mute, the time against the film's length, fullscreen; the
controls fade after 2.5s idle while playing; a click toggles play with the centre flash, a double
click goes fullscreen; YouTube's keys (k or space, m, f, j/l, arrows). The film's captions are
YouTube's own. Things learnt:

- `YT.Player` replaces the element it is given with its iframe, so give it one created outside
  React's tree (a child appended to a ref'd div), or React's unmount throws.
- A script's `element.click()` is not a user gesture: the player loads but waits. A real click
  (or CDP `Input.dispatchMouseEvent`) plays it, with sound.
- Everything that moves during playback (bars, knob, tooltip) moves by transform; the knob and
  tooltip ride full-width tracks translated by a percentage, since a translate percentage is the
  element's own width. Playback measured 0 layout shift.
- No gradient behind the controls (the team found it heavy); they rely on YouTube's text shadow.
- YouTube's auto-captions are switched off (`unloadModule('captions')` on ready and again on
  `onApiChange`, as the module can load late): the film has its subtitles burned in, and the
  auto-captions repeated them, garbled, over the bottom of the picture.
- `film-player.css` is the one place with literal colours and type: it copies YouTube's player.
  Its custom properties live on `.yt-chrome` (the controls), not the film's wrapper: the preview's
  controls sit outside that wrapper, and its red bar once drew nothing for it.

## The production site's port: what it taught us

The team building the Storyblok site rebuilt V2 as blocks on 2026-09-30 and wrote up everything they
had to build themselves, as requests for the package: `design-team-requests.md` at the repo root. Pointers, sorted:

**Fixed here after their write-up:** layout shift from the moving card (transforms only, above).

**Already fine here, keep it that way:**
- Marquee (`LogoTicker`): one set must be wider than its box or a gap opens before the copy
  arrives (theirs: a 485px row on a 1584px screen). Ours: 734px in a 640px box on desktop, 726px in
  358px on a phone, measured before the 2026-10-01 logo swap; the box is now 560px (`panel-lg`) and
  the logos sit 48px apart, so re-measure. If the ticker is widened or loses logos, repeat the set to fill. The copy is
  `aria-hidden` with empty alts (one accessible copy); it pauses on hover; under reduced motion it
  is still and scrollable.
- No flash before the script: the splash is server-rendered over everything at first paint, with a
  CSS fallback that fades it if the script never runs. The Faculty section is below the fold at load.
- Package `Button` never tweened directly; `data-brand` and `data-theme` on the same element.

**Costs to keep in mind (their measurements, gzip):** GSAP core 27.4 KB is the biggest line,
ScrollTrigger 17.7 KB. Every client component a route can reach ships on it (`GlassButton` alone
added 4.6 KB to every page of theirs until split), so keep client-only package pieces out of shared
layouts. Importing the package's `motion` barrel can pull in SplitText (via `TextReveal`); the
Faculty entrance imports SplitText itself for its line-by-line headline, which also breaks the
"one gentle fade" rule above. Undecided: switch it to one fade. For sections that only fade in, CSS
scroll-driven animations or WAAPI would avoid GSAP entirely.

**Not applicable here yet:** a responsive image framed bigger must be told its new display width
(`sizes`) or it is the small file upscaled (2.75x measured); in a shrink-to-fit column the slot
collapses to 0 wide once the card leaves the flow, so it needs its measured width and aspect ratio;
React 19 merges same-precedence `<style href>` tags, so `style[data-href="x"]` finds nothing.

**Their asks of the package** (the design team's to answer; details in their file): a motion
contract the package applies from markup (`data-ssx-reveal`) or one `<MotionScope>`, plus a no-flash
recipe (P1); a `Marquee` primitive (P1); `TopNav sticky` and a `Sticky` primitive (P1); the scroll
frame moment, or at least its traps documented (P2); a per-edge `feather` prop on a media/image
primitive, which doesn't exist yet (P2); a `Hero`/`Poster` layout, or `Grid` templates beyond equal
fractions, row/column placement and a one-screen `Section` height (P2); a `GlassPanel` and a divided
inline list (P3); each brand mark's zoom point exported next to `--brand-mark` (SSB is
(14.45, 22.5) in its 29×40 viewBox, found by a distance transform; SST is unmeasured) (P3); docs for
the traps above (P3).

**Changed here since their port, for them to mirror:** desktop video has no top or side fade, only
the bottom one into the copy; hero copy 64px lower (`md:pb-24`); eyebrow and "AI-native B-school" in
pure white (`text-on-image-ink`), the rest of the title `text-content`; the film plays inside the
shield during the logo hold (window opens halfway through the shield's entrance, footage sharp, no
focus blur); the framed video's play button opens the YouTube film (`media.youtubeId`) and closes it
on scroll back or away; the card moves by transforms only; the zoom re-measures the screen when it
starts; the Faculty section sits below the hero. Then (2026-10-01): the whole title pure white at
`type-hero`; eyebrow at the label size; description `lg`; plain CTAs; the nav logo draws itself on
hover; the ticker's logos changed (Swiggy and Cars24 for ISB and IIMA), self-hosted, sized to equal
ink, real colours on hover, 48px apart; YouTube-style controls on the film, on the framed loop
the scrubber (spanning the film's 4:48; click to open the film there), play and the time, an 80px play button; the scroll moment zippy and generic
(phases in screens of scroll in `moment.ts`, the track computed from them); no gradient under the
player's controls; YouTube's auto-captions off; then a trailing icon on every CTA (an arrow on
Apply now, in the hero and the nav; a download on the brochure).

## Checking changes visually

Check every variation at 320px, 390px and desktop, in light and dark, and with reduced motion.
Plain headless-Chrome screenshots can't scroll, can't wait for a timeline, and won't lay out narrower
than about 500px. Drive Chrome over the DevTools protocol instead
(`Emulation.setDeviceMetricsOverride` for width, `Emulation.setEmulatedMedia` for dark mode and
reduced motion, `Runtime.evaluate` to scroll), and capture frames at set times after load.

- **Time the intro from navigation, not the load event.** `load` can fire after the intro has
  finished (the film is loading); one report of "the film shows in the logo at 0.3s" was 0.3s after
  `load`, really ~1.1s. Use `DOMContentLoaded` or read `performance.now()` in the page.
- **Measure layout shift** with a `PerformanceObserver` for `layout-shift`, registered before the
  page loads (`Page.addScriptToEvaluateOnNewDocument`) and once per page, or entries double.
- **Frame times:** headless Chrome with the GPU on (`--use-angle=metal`), recording
  `requestAnimationFrame` gaps. Warm the server first: the first load after `next start` stalls
  for reasons that aren't the motion.
- **Hover and click** with `Input.dispatchMouseEvent` (`mouseMoved`; `mousePressed` +
  `mouseReleased`): CSS `:hover` needs a real pointer, and only a real click counts as a gesture.
