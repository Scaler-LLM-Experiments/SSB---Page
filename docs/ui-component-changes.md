# UI component changes (Nov 2026)

What changed in the shared UI and the rules that came with it, for any agent touching these sections.
Dates in code comments are when each change landed. Content (copy, figures, dates) lives in `src/content/`;
change it there, not in components.

## Rules that now apply page-wide

- **Play buttons are black.** One rule in `src/app/card-standard.css`: over a photo, a white disc with a
  black triangle; on the page, a black disc with a white triangle; the YouTube-style button
  (`YouTubePlay`) black, also on hover (no red). A new play button: add its selector to that list
  rather than styling it in the section's sheet.
- **Profile cards are one size.** Alumni (`.alumni-row`) and instructor, mentor, investor and team
  cards (`.fc-grid`) share one slot from 672px up: `22rem` (352px), capped by window height so two
  rows fit. Phones keep their own sizes. Same file.
- **Crops are checked in both shapes.** A photo that's tall on desktop can be a wide strip on a phone
  (the term cards are 318 x 127 at 390px). Set `object-position` focal points so faces survive both;
  if no focal point works, pick another photo instead of a tighter crop.
- **Vertical video is never cropped into a 16:9 box.** Show a landscape thumbnail and open the clip in
  `ReelBox` (below).
- **Every new image or video is credited** in `public/media/CREDITS.md` (source, date, what it shows).
  Captions say only what the photo shows.

## Components

| Component | File | What changed |
|-|-|-|
| `ReelBox` | `src/sections/internship/StoryReels.tsx` (exported) | Overlay for a 9:16 clip: portal to `body`, as tall as the window fits, autoplay with sound and controls; Esc, the close button or a click outside closes it. Styles: `.in-reel-box` in `internship.css` (imported by `DeckSections` and `InternshipSection`). |
| `StoryReels` | same file, `internship.css` | A reel with `cover` shows the live page's cover (card shape 780 x 1020), never autoplays, and opens `ReelBox` on tap. Testimonial videos stream from Scaler's CloudFront; they aren't in the repo. |
| `DeckKamath` (Why SSB card) | `src/sections/deck/DeckKamath.tsx`, `deck-kamath.css` | No YouTube embed. Thumbnail `/media/kamath-thumb.webp` (16:9, "Why MBA?" baked in at top-left), tap opens SSB's reel `/media/kamath-reel.mp4` (1:26) in `ReelBox`. Play disc `.dkk-disc` sits bottom-left under the headline; length chip `.dkk-chip--end` bottom-right. If the thumbnail changes, recheck the disc against its text. `YouTubePlay` stays exported for `DeckFounders`. |
| `DeckFounders` | `src/sections/deck/DeckFounders.tsx` | Ashneer Grover's card removed; four cards. |
| Term cards | `src/sections/curriculum/journey/concepts/stage.tsx` | `PHOTO` maps each term to `{ src, pos }`; `pos` is tuned for both the desktop card and the phone strip. Photos in `public/media/terms/`. |
| Innovation Lab mosaic | `src/sections/innovation-lab/InnovationLabSection.tsx`, `innovation-lab.css` | The centre photo ends as a plain cover crop of its tile (scale from tile vs stage size), not a zoomed slice. In the gallery tabs (`[data-gallery]`) the centre photo is an ordinary tile. |
| Hero | `src/sections/hero/frame/hero-frame.css` | Phones: the three pills stay on one line (12 to 14px type via `clamp`, wrap only under 360px); the intake line sits under Download Placement Report. |
| Scholarships banner | `src/sections/deck/deck.css` | SSB's own convocation photo. |
| Fee table, deadline bar | `AdmissionsV4.tsx`, `AdmissionFees.tsx`; content in `admissions.ts`, `admission.ts`, `home.ts` | Components pick the open intake from today using `intakes[].by`; the countdown reads `heroFrame.deadline` / `admissionDeadline`. As of 19 Nov 2026: early bird 20 Dec 2026, Intakes 1 to 5 to 15 Aug 2027, ₹23,00,000 every intake, ₹1,500 application fee. |

## Don't mix these up

- **Innovation Lab startups** (incubated companies) are logo banners. **Startups by our students**
  (Beyond Placements, `BuiltCards`, `deck.ts` `built`) use founder or product photos. Separate sections.
- Organic Mandya is its own immersion card ("From field to shelf"); Akshayakalpa is a different card.

## Open

- Alumni: the team wants about 30 cards in grouped rows (Mesa style, before/after, batch) and the
  Razorpay, Urban Company and Avendus cards changed. Waiting on the alumni list.
- Instructors under "Learn from your future recruiters": Shan is checking for more.
