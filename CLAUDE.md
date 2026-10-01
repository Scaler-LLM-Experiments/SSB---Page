@AGENTS.md

# SSB home page lab

Next.js app for exploring design variations of the **Scaler School of Business (SSB)** home page,
built on the Scaler Design System package `@kishanscaler/ssx-ui`. The bar the team has set is
**premium**: one deliberate, orchestrated moment per variation, everything around it quiet.

## Where this is going

1. **Now:** the home page, section by section. The hero is V2; the Faculty section below it was
   ported from a teammate's build. Section copy comes from the content deck
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
npx prettier --write <files>   # .prettierrc: single quotes, 110 wide (the code's style)
```

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
    company-logos.ts    company wordmarks for the faculty cards (files in public/logos)
  lib/
    logos.ts            the ticker's logos: our own files sized to equal ink, or Wikidata (P154) lookups
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
      FilmPlayer.tsx      the big play button, and the YouTube film with YouTube's controls rebuilt
      film-player.css     those controls, in YouTube's own values (not the design system)
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

**The sticky nav** (`HeroNav`) is lead-gen: logo and Apply now (a plain button, no icon), always on
screen. It lives at page level because a sticky element only sticks inside its parent. On V2 it
starts dark and turns light with the page. Hovering the logo plays the package's loading mark
(`LogoLoader`: the shield traces and inks itself) over the static shield, which steps aside; the
loader is square with the 29:40 shield centred in it, so it sits `(29/40 − 1) × height / 2` left of
the lockup's shield, and is shown with `display` so the draw restarts on every hover.

**V2's scroll timing** (`videoMoment`): a 220svh track; the card reaches the frame by 0.35 of the
timeline (~450px of scroll on a 1480×888 screen), the play button and caption fade in from 0.26,
the white from 0.45 (fully white by ~850px), the nav turns light at 0.55.

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
`Text size="lg"`; plain CTAs (no icon wells).

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
**The preview:** the silent loop, playing, with the 80px play button and just the scrubber along
the bottom edge (no buttons, no time), spanning the full film (`media.youtubeLength`, 288s = 4:48):
it creeps forward with the loop, shows times on hover, and a click or drag opens the film at that
point (the big button opens it from the start). Lengths are shown rounded up, as YouTube lists them:
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
- `film-player.css` is the one place with literal colours and type: it copies YouTube's player.
  Its custom properties live on `.yt-chrome` (the controls), not the film's wrapper: the preview's
  controls sit outside that wrapper, and its red bar once drew nothing for it.

## The production site's port: what it taught us

The team building the Storyblok site rebuilt V2 as blocks on 2026-09-30 and wrote up everything they
had to build themselves, as requests for the package: `design-team-requests.md` at the repo root
(kept local, not committed). Pointers, sorted:

**Fixed here after their write-up:** layout shift from the moving card (transforms only, above).

**Already fine here, keep it that way:**
- Marquee (`LogoTicker`): one set must be wider than its box or a gap opens before the copy
  arrives (theirs: a 485px row on a 1584px screen). Ours: 734px in a 640px box on desktop, 726px in
  358px on a phone. If the ticker is widened or loses logos, repeat the set to fill. The copy is
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
ink, real colours on hover, 48px apart; YouTube-style controls on the film, a bare scrubber over
the framed loop spanning the film's 4:48 (click to open the film there), an 80px play button; the scroll moment quicker (220svh track,
white from 0.45).

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
