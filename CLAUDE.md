# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## What this is

The Scaler School of Business (SSB) site pages, built on the Scaler Design System package
`@kishanscaler/ssx-ui`: the home page at `/`, the admission page at `/admission` and the internship
page at `/internship`. More SSB (and later SST) pages are meant to follow, built from the home page's
sections. It is the design build the team reviews on Vercel (upstream deploy:
https://ssb-main-page.vercel.app); the scaler.com SSB page is built separately in Storyblok. No
Storyblok SDK here: keep section copy in flat, typed content objects so it maps onto bloks later.

This repo is a fork of `bivekdeb-cmyk/ssb-main-page` (Bivek Deb). It is **public**: never commit
internal material. The stakeholder deck the copy comes from lives in `/ssb-website/`, gitignored.

## Branches and deploys

- Remotes: `origin` is the fork (`Sudhanva5/ssb-pages`), `upstream` is Bivek's repo. Work goes on a
  branch in the fork, one per page (`/admission` is on `admissions`; `/internship` on `internships`,
  branched from `admissions` because it reuses that page's first fold); rebase onto `upstream/main`
  before pushing.
- Only `upstream/main` deploys: Vercel's GitHub integration builds every push to it at
  https://ssb-main-page.vercel.app. The fork has no write access upstream and no deploy of its own, so
  a change reaches the review site through a pull request to `bivekdeb-cmyk/ssb-main-page`. Don't
  link the fork to a personal Vercel account.
- Commit messages are one plain sentence saying what changed, by section ("Faculty: three rows on
  phones"); no type prefixes.

## Commands

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # production build (Turbopack)
npm start            # serve the build; use it for frame-time and layout-shift checks
npx next typegen     # once on a fresh clone, before typecheck (see below)
npm run typecheck    # tsc --noEmit
npx prettier --write <files>   # prettier isn't a dependency; .prettierrc = single quotes, 110 wide
```

- `npm run typecheck` on a fresh clone fails with `Cannot find name 'LayoutProps'` until route types
  exist. `next typegen`, `next dev` or `next build` writes them to `.next/types` and `next-env.d.ts`
  (both gitignored).
- There are no tests and no linter. Check a change with typecheck/build, then in the browser.
- Format only the files you touch. Many files keep long hand-wrapped lines and comments; a repo-wide
  prettier run makes a noisy diff.
- `reactStrictMode` is off on purpose (`next.config.ts`): the curriculum's scroll and animation
  effects expect a single mount.

## Read the comments with this in mind

The code was extracted from a design lab that had many variant routes (`/v2`, `/v3`, `/v6`, `/v7`
"the deck variant", `/v8` "the tone variant", "vFinal", and the concept site's `/v4`). **`/` here is
the old `/v8`**: `/v7`'s sections in the deck's order, each wrapped in a light or dark `Tone`.

- Doc comments cite those routes, dates and "the team's call" / "the user's ask". The rationale is
  still useful; the routes don't exist here.
- The extraction pruned unused files, not unused branches. Many components take props that pick a
  lab variant (`variant="deck"`, `termsVersion={4}`, `aiCarousel`, `builtCards`, `reels="framed"`,
  `backers={false}` ...). Each route's `page.tsx` is the source of truth for what renders.
- Imported but not rendered: `FooterShell` / `SsbFooter` (the page uses `DeckFooter`) and
  `HomeNav`'s dark `heroNav` branch.
- Two `DeckCloseSection`s: the one in `DeckFinale.tsx` (takes `content` and `id`) is the one both
  pages import; the prop-less one still exported from `DeckSections.tsx` is the lab's older band.
- `src/app/v6.css` (imported by `page.tsx`, and the v6 branch in `useSectionEntrance`) targets
  `main[data-page='v6']`, which nothing renders: dead rules. The pages' styles hang off
  `main[data-page="v7"]` (`deck.css`, `deck-outcomes.css`, `bottom-nav.css`), so every page keeps that
  attribute, new ones included.
- The previous CLAUDE.md is the lab's full design log (decisions, rejected variants, measurements,
  asset processing): `git show 10df7ee:CLAUDE.md`. Most components it describes are not in this repo.

## Page architecture

- `src/app/layout.tsx`: `<html data-brand="ssb">` with no `data-theme`; fonts by `next/font`
  (Plus Jakarta Sans, a separate non-preloaded 600 italic face, JetBrains Mono), wired to the
  design system's font tokens in `globals.css`; imports the global stylesheets.
- `src/app/page.tsx`: the whole page. `<main data-page="v7" data-entrance="calm" data-brand="ssb"
  data-theme="light">` holds the page-level client pieces (`ScrollRefresh`, `CalmEntrance`,
  `HeroFrameDeadline`, `HomeNav light followTone pinned`, `BottomNav instant`), then every section in
  a `<Tone>` or `<Tone dark>`. `DeckFooter` sits after `main`.
- Order: hero (`HeroFrame`) > outcomes (`DeckOutcomes`) > why (`DeckWhySection`) > alumni >
  student startups (`BuiltCards`, dark) > investors (`PeopleTabsSection`) > `DeckFounders` (Anupam
  Mittal, Shantanu Deshpande, Kiran Shah, Ankur Warikoo, Ashneer Grover, a sideways row three to a
  screen; it replaced the testimonial band) > "How you
  learn", four USPs in `CurriculumRail` > curriculum terms > career prep (dark) > AI curriculum >
  Innovation Lab (dark) > faculty > mentors > super mentors > internship > campus life > press
  (dark) > founding team + Impact Foundation > admissions (dark) > FAQ + closing band > footer. The
  curriculum, career prep and AI blocks moved up under the USPs on 2026-11-11; the comments in
  `page.tsx` record each move.
- `sections/tone/Tone.tsx`: a dark tone is a dark island (`data-brand` + `data-theme="dark"` on one
  element) and carries `data-section-tone`, which the navbar reads (`followTone`) to switch with the
  section under it. Dark-section fixes go in `tone.css`, scoped to `.tn-dark`.
- `BottomNav` items target ids already on the page (`placements-showcase-title`, `bc-title`,
  `dk-usp-title`, `people`, `admissions`). Renaming a section or heading id breaks them silently.
  Each page passes its own `items`; a target resolves to its closest `<section>`, so two items need
  two sections (why `AdmissionsV4` can render its scholarships as a section of their own).
- **`/admission`** (`src/app/admission/page.tsx`, copy in `content/admission.ts`, sections in
  `sections/admission/`): the live scaler.com admission page rebuilt from the home page's pieces. The
  early bird's countdown is the top strip (`HeroFrameDeadline`) > `AdmissionTop`: a short first fold on
  the footer's forest green, the campus photo running out to the panel's edge and melting into the
  green (the closing band's blurred copy and scrim), the dates and fees in one white box split by
  rules, each with an icon > `AdmissionTimeline`: the four steps as one timeline (after SST's admission
  page), header and step list held at the left (`cr-item`), the line filling as you scroll, each title
  carrying its timing in green ("Lead|tail"), every card in one order (title, points, a box if
  needed, the action); step 1's three groups under icons with rules between; steps 2 to 4 with a CSS
  illustration on the home page's AI product panel (`dk-product-art`): the application, the interview
  invite, the SSB student ID > `AdmissionVideo`: the video in a green band of its own (after the old SSB
  page) > scholarships (`AdmissionsV4 parts="scholarships" backers={false} withFees` with `scholarshipsHead`, the header at the left (title, three short fee notes, Apply Now on tablet and desktop only) and the home page's programme fee table at the right, the scholarships panel under both,
  dark) > `AdmissionFinancing` (header and pointers at the left, the four bank logos large, 2 × 2, at the right) > the
  request-a-callback band (`DeckCloseSection`, no chip, the team's students photo, the four facts
  again) > `DeckFooter`. Icons: `sections/admission/icons.ts`. `BottomNav hero="#adm-top"` waits for
  this page's first fold.
- **`/internship`** (`src/app/internship/page.tsx`, copy in `content/internship.ts`, its own sections
  in `sections/internship-page/`; `sections/internship/` is the home page's section): the live
  scaler.com internship page, short and light, on the home page's pieces. The early bird's strip
  (`admissionDeadline`, shared with `/admission`) > `InternshipHero`: the site's green panel
  (`admission.css` classes) with the companies beside the copy on the home page's "Your peers come
  from" grid (`PeersFlip cells={15}`, 5 × 3, flipping through 24 logos) > the outcomes on
  `AlumniSection` (after the user's reference, 2026-11-12): its header, `lead` = `InternshipStats` (three
  figure boxes), `people` = the live site's internship pivots (`pivotAlumni`, plus Uttara and Bharath
  with portraits), `peers` = `InternshipCloser` ("A closer look": 01 the role donut, 02 the ₹10L+ and
  IIM-C facts, 03 the companies on a second `PeersFlip`, 12 tiles over the 24, resolved in the page) > `InternshipReels` (the home page's `StoryReels` row with
  the five students' own MP4s, 40-50 MB each; it plays only the one most on screen) > the callback band
  (`DeckCloseSection id="callback"`, which picks up `admission.css`'s `#callback` rules) > `DeckFooter`.
  `BottomNav hero="#int-top"`. Earlier takes on the figures (the placement highlights bento, the
  at-a-glance card with the stipend scale) are in git history (`b84deb4`, `840d995`).
- **Building another page:** reuse the home page's sections and give them the page's copy through
  optional props that default to the home page's (`content`, `id`, `parts`, `children`), as
  `DeckUspHead`, `DeckCloseSection`, `AlumniSection`, `PeersFlip` and `AdmissionsV4` do; don't fork a
  section.
  Pass a fresh `id` wherever a section appears twice (its heading id is derived from it). Shared
  nav, footer and phone-tab links to home-page anchors are written `/#anchor`, so they work from
  every route.
- **Curriculum** (`sections/curriculum/`): `SsbCurriculum` renders the curriculum lab's config-driven
  `journey/` code in parts (`terms`, `ai`, `learn`, `main`, `career`), set by `journey/config.ts`
  (`DEFAULT_CONFIG`) + `lab-settings.ts` + its own overrides. It supports `brand: 'sst'` too. It is
  client-only (`Curriculum` in `sections/home/client.tsx`, `dynamic(..., { ssr: false })`), so it
  arrives after first layout and pushes everything below it down by thousands of pixels.
  `ScrollRefresh` calls `ScrollTrigger.refresh()` whenever the body's height changes; keep it on any
  page with a client-only section. SSB's term content is `journey/ssb.ts`.
- `CurriculumRail`: a sticky side list over a set of `RailSection` nodes (a floating pill below
  desktop). The page uses it for the four USPs.
- **Entrances: `CalmEntrance` owns them.** Under `main[data-entrance="calm"]` the sections' own
  entrances stand down (`useSectionEntrance`, `WhyBreaker`, Innovation Lab, `PlacementsMotion` each
  check `closest('[data-entrance="calm"]')`). `CalmEntrance` finds "cards" by heuristic (radius of
  6px or more, a fill or border, at least 120 x 80, under 92% of the section's width) and rises/fades each
  as it arrives; a section with no cards fades up 16px. Anything on screen at load is left alone, and
  nothing is hidden under reduced motion. A new card-like box gets this automatically; don't add
  per-section entrance animations.

## Content

- Copy lives in `src/content/*.ts`, mostly from the deck "SSB Website vF _ Sep'26" (each file names
  its slides). `deck.ts` is the page's copy layer: slide-numbered exports that spread and override
  the older per-section files (`home.ts`, `placements.ts`, `why.ts`, `alumni.ts`, `community.ts` ...).
  If an export exists in `deck.ts`, change it there.
- Some sections take content as props from `page.tsx` (`HeroFrame`, `AlumniSection`, `BuiltCards`,
  `InternshipSection` stats, and on `/admission` the extended sections above); others import it
  themselves (`PeopleTabsSection`, `CommunitySections`, `PressSection`, `DeckSections`). Live projects and internship keep some copy inline.
  Navbar: `sections/site/navdata.ts`; footer: `sections/site/data.ts`; bottom nav:
  `content/bottom-nav.ts`.
- Section titles go through `Title` with `"Lead.|Tail."`: the tail renders as `.h-tail` in the
  secondary ink and is hidden below 672px.
- **`PLACEHOLDER` marks made-up or unfinished copy**; grep for it before anything ships. Among them:
  the hero's countdown deadline (`home.ts`), CTA hrefs, startup names and figures (`community.ts`,
  `deck.ts`; Valzy is the valet app's name to confirm), placement figures and the report link
  (`placements.ts`), the immersions' lines and photos (`immersions.ts`, Britannia and Akshayakalpa,
  to confirm with Guru), the student and lab startups' images (the brands' own, until the team's photos
  of students with their products), the AI mentors' photos (`deck.ts`), Kiran Shah's card copy and
  Ashneer Grover's card (`DeckFounders.tsx`), the faculty cards' courses and bios
  (`PeopleTabsSection.tsx`).
- **The team's review, 2026-11-16** (Chetna's list via Bivek; branch `main-page-feedback`): the
  placement report card is no longer a Times of India clipping (it was a stand-in) and nothing says
  "audited" (the report isn't audited yet); the figures run avg hike > top 25% > C2 CTC > C1 CTC >
  top 10% > hiring partners; the startup fund reads ₹2Cr for now. Don't bring those back. Interim
  image sources are in `public/media/CREDITS.md`.
- Two admissions files, easy to mix up: `content/admissions.ts` is the home page's admissions section
  (the deck's slides 27-28); `content/admission.ts` is the `/admission` page, built on top of it.
- `/internship`'s figures are the live page's as read on 2026-11-12 (70% full-time internships 2
  months early, ₹60,000 highest and ₹40,000 median monthly stipend, offers within 10 months; roles:
  Marketing 38%, Product 21%, Strategy 15%, Founder's Office 15%, Operations 6%, Finance 5%). They
  conflict with the home page's internship section (100% internship placement, stipends up to ₹1
  lakh, 52%+ in Product and Founder's Office, `deckInternshipStats`); confirm before shipping.
- `/admission`'s dates and fees are the live page's as read on 2026-11-11 (2027 cohort: early bird
  closes 15 Nov 2026, ₹1,500 application fee, ₹23,00,000 course fee, batch from August 2027). They
  conflict with the home page's (Intake 2 closes 27 Dec 2026, ₹16,00,000); confirm before shipping.
- Facts already checked, don't regress them: Anupam Mittal's ₹50L to Hummusapiens was an *offer* to
  invest (never "raised"); Nikhil Kamath's quote is verbatim from the video (`why.ts` cites it).
- Assets are in `public/<section>/`, mostly WebP. Credits and licences: `public/media/CREDITS.md`.
  `public/deck/` photos are Unsplash stand-ins. The source GIFs in `src/*.gif` are gitignored (over
  GitHub's size limit); the page uses MP4 cuts in `public/media/`.

## Styling

The cascade, in load order:

1. `src/app/globals.css`: Tailwind v4 + `@kishanscaler/ssx-ui/styles.css`, then page-wide overrides
   (section padding rhythm, radius normalisation, one header pattern, a 16px gap in every sideways
   row, smaller headers on phones).
2. `type-standard.css`, `card-standard.css`, `color-standard.css`: page-wide standards written as
   `html body :is(...) { ... !important }` so they beat section sheets. Overriding one needs the same
   weight; prefer adding your selector to the standard's list.
3. `sections/deck/tokens.css`: the `--pg-*` colours the deck and tone styles read. Use these, not
   literals.
4. Each section's own `.css`, imported by its component, with a class prefix per section (`hf-`
   hero, `dk-` deck, `dko-` outcomes, `dkft-` footer, `sj-` curriculum, `cr-` rail, `pt-` people tabs,
   `tn-` tone ...).
5. `tone.css` for dark sections.
6. `typography.css` then `corners.css`, imported last in `layout.tsx` (2026-11-11). `typography.css`
   is the one type scale: seven roles (section title, closing statement, section intro, item title,
   reading text, card text, meta), each one size per breakpoint, as `--tp-*` variables. It wins by
   doubling class selectors (`.x.x`), not `!important`. Put new text on one of those roles rather than
   a new size. `corners.css` gives photos inset in a card `--radius-inset` (4px).

`sections/deck/tokens.css` is imported by each page, not by the layout: import it in a new page too.

Design system and Tailwind traps (these fail silently):

- `globals.css` has `@source not` for `src/sections/curriculum` and `src/sections/site`. Those folders
  are plain CSS; a Tailwind utility added there is never generated unless used elsewhere.
- Stock Tailwind colours, spacing multiplier, radii and shadows are switched off, so an off-scale
  class compiles to nothing. Spacing: `0 px 0.5 1 1.5 2 2.5 3 4 5 6 8 10 12 16 20 24 32 40 gutter`
  (no 7, 9, 14 ...). Colour utilities are named after `--color-*` in the package's `theme.css`:
  `bg-page`, `text-content`, `text-content-secondary`; `bg-surface-page` doesn't exist. After adding
  classes, check the built CSS contains them.
- Breakpoints are the package's, not Tailwind's: `xs` 320, `sm` 672, `md` 1056, `lg` 1312, `xl` 1584.
  Plain CSS uses the same numbers (`(width < 672px)`).
- Section CSS is unlayered and Tailwind utilities sit in a cascade layer, so plain CSS wins whatever
  the specificity. Don't set in a class what the markup sets with a utility.
- Theme islands need `data-brand="ssb"` and `data-theme` on the same element. `data-brand` alone
  re-declares light tokens and cuts off a dark ancestor.
- Type by role: `Heading` (`as` is required) and `Text`, or `type-*` utilities; 12px is the floor.
  Section titles are medium weight (`--type-display-weight`); brand text is the logo green
  `--color-ssb-light-9` (#1D925B), both set in `globals.css`.
- Radii: cards, panels and photos 8px (`--radius-lg`); a photo inset from its card's edge 4px
  (`--radius-inset`, `corners.css`); chips, tags and controls 4px (`--radius-md`); avatars and dots
  round.
- Icons are Phosphor; server components import from `@phosphor-icons/react/ssr`. Links styled as
  buttons: `<Button asChild><a href="...">...</a></Button>`. Merge classes with `cn` from the package.
- Package docs: `node_modules/@kishanscaler/ssx-ui/README.md` (its Status section is out of date);
  the `.d.ts` files are the reliable source for props.

## Motion

- GSAP through `@kishanscaler/ssx-ui/motion` (`useMotion`, `motionTokens`, `ease()`), ScrollTrigger
  from `gsap/ScrollTrigger`. For `y` offsets use `offsetPx` from `src/lib/motion-offset.ts`: the
  tokens are rem strings, and GSAP forces a layout per element to convert them (it stalled phones).
- Move things with transforms and opacity, never `top`/`left`/`width`/`height`. Give large scale
  animations `will-change: transform`.
- Pin with CSS `position: sticky`, not ScrollTrigger `pin` (it re-parents the element, restarting
  CSS animations, and fixes its width). Never lock scrolling with `overflow: hidden`.
- Don't start a GSAP-transformed element with Tailwind `scale-*` / `rotate-*` (v4 writes separate
  `scale` / `rotate` properties that multiply with GSAP's `transform`). Never tween an ssx-ui
  `Button` directly; animate a wrapper.
- Never play two videos stacked in one band (it dropped to 30fps); bake the layers into one file.
- Give every image its dimensions or aspect ratio: ScrollTrigger measures only on refresh.
- Every moving thing needs a reduced-motion path that shows the final state.

## Checking changes visually

- Check 320px, 390px and desktop (~1440), with reduced motion, and with the OS in dark mode (it should
  change nothing: `main` and the footer pin their themes).
- Scroll the whole page: entrance positions depend on the curriculum mounting, and the navbar should
  switch tone over each dark section.
- Measure rather than eyeball: layout shift with a `PerformanceObserver` for `layout-shift`
  registered before load; frame times from `requestAnimationFrame` gaps against `npm start`, not dev.
