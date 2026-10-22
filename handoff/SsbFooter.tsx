'use client';

/**
 * SSB footer — handoff copy (2026-10-13), standalone.
 *
 * What it is: a green card inset from the window's edges (the brand green at its top fading to
 * the page at its foot, with a fine white grain). At the top: the SSB logo, the tagline and two
 * actions at the left; two link groups at the right. Below: "Scaler School of Business" across the
 * card's width with a sheen sweeping across it, and the campus building standing in front of it.
 * The legal line sits under the card.
 *
 * Interaction:
 * - Lift reveal: the footer is pinned to the bottom of the window BEHIND the page. Pass the page as
 *   `children`; scrolling lifts it off the footer like a sheet, uncovering it. `--lift` (0 → 1, set
 *   here on scroll) is how much of the footer is uncovered.
 * - Parallax on the lift: the name rises from behind the building (it starts hidden by it); the
 *   building moves only 16px.
 * - The name shimmers: a bright band sweeps across it every 4.5s.
 * - Nav links are the design system's quiet `Link` (no underline at rest, underlined on hover).
 * - Reduced motion: no shimmer, no parallax; everything in its final place.
 *
 * Built from ssx-ui: Logo, Text, Heading (eyebrow), Button (on-image look via
 * `data-surface-ink="on-image"`), Link. Icons from @phosphor-icons/react.
 * Assets: /footer/building.webp (1536 × 1024, transparent above the roofline) and
 * /footer/building-800.webp.
 * Needs the ssx-ui stylesheet and `data-brand="ssb"` on <html> (the tokens used here: surfaces,
 * on-image ink, radii, type sizes, font weights).
 *
 * Usage:
 *   <SsbFooter>
 *     <main>…the page…</main>
 *   </SsbFooter>
 */
import * as React from 'react';
import { Button, Heading, Link, Logo, Text } from '@kishanscaler/ssx-ui';
import { ArrowUpRight } from '@phosphor-icons/react';

export interface FooterLink {
  label: string;
  href: string;
}

export interface SsbFooterContent {
  tagline: string;
  primary: FooterLink;
  secondary: FooterLink;
  columns: { title: string; links: FooterLink[] }[];
  /** Accessible name of the link groups' <nav>. */
  navLabel: string;
  /** Decorative; drawn large across the card (the logo names the school for screen readers). */
  wordmark: string;
  legal: string;
  building: { src: string; small: string; alt: string };
}

export const SSB_FOOTER_CONTENT: SsbFooterContent = {
  tagline: 'For people who build.',
  primary: { label: 'Apply now', href: 'https://www.scaler.com/school-of-business/admission/' },
  secondary: { label: 'Download Brochure', href: 'https://www.scaler.com/school-of-business/' },
  columns: [
    {
      title: 'Explore',
      links: [
        { label: 'Why SSB', href: '#why-ssb' },
        { label: 'Outcomes', href: '#outcomes' },
        { label: 'Curriculum', href: '#curriculum' },
      ],
    },
    {
      title: 'Next steps',
      links: [
        { label: 'Program Details', href: '#curriculum' },
        { label: 'Admission Process', href: '#admissions' },
        { label: 'FAQs', href: '#faq' },
      ],
    },
  ],
  navLabel: 'Footer',
  wordmark: 'Scaler School of Business',
  legal: '© 2026 InterviewBit Technologies Pvt. Ltd. The PGP awards a certificate, not a degree.',
  building: {
    src: '/footer/building.webp',
    small: '/footer/building-800.webp',
    alt: 'The Scaler School of Business building in Bengaluru',
  },
};

export function SsbFooter({
  content = SSB_FOOTER_CONTENT,
  children,
}: {
  content?: SsbFooterContent;
  /** The page above the footer: it lifts off the footer as one sheet. */
  children?: React.ReactNode;
}) {
  const root = React.useRef<HTMLDivElement>(null);
  const sheet = React.useRef<HTMLDivElement>(null);
  const foot = React.useRef<HTMLElement>(null);

  // --lift: how much of the footer the lifting sheet has uncovered (0 = hidden, 1 = all of it)
  React.useEffect(() => {
    const r = root.current;
    const s = sheet.current;
    const f = foot.current;
    if (!r || !s || !f) return undefined;
    let raf = 0;
    const update = () => {
      raf = 0;
      const uncovered = window.innerHeight - s.getBoundingClientRect().bottom;
      r.style.setProperty('--lift', Math.max(0, Math.min(1, uncovered / Math.max(1, f.offsetHeight))).toFixed(3));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  // the name breaks before "of" on phones (two lines, so it can stay large)
  const [first, ...rest] = content.wordmark.split(/ (?=of )/);

  return (
    // light whatever the OS theme: the site is light
    <div ref={root} className="ssb-footer" data-brand="ssb" data-theme="light">
      <style href="ssb-footer" precedence="default">
        {CSS}
      </style>

      {/* the sheet that lifts: the page, opaque, above the pinned footer */}
      <div ref={sheet} className="ssb-footer__sheet">
        {children}
      </div>

      <footer ref={foot} className="ssb-footer__foot">
        <div className="sfb-card">
          {/* the top is a dark island, so the logo, links and buttons take their on-colour looks */}
          <div className="sfb-top" data-brand="ssb" data-theme="dark">
            <div className="sfb-lead">
              <Logo brand="ssb" size="lg" surface="dark" />
              <Text size="lg" className="sfb-tagline">
                {content.tagline}
              </Text>
              {/* the design system's buttons in their on-image look (white), so neither melts into the green */}
              <div className="sfb-actions" data-surface-ink="on-image">
                <Button asChild variant="primary" size="md">
                  <a href={content.primary.href}>
                    {content.primary.label}
                    <ArrowUpRight weight="bold" aria-hidden="true" />
                  </a>
                </Button>
                <Button asChild variant="secondary" size="md">
                  <a href={content.secondary.href}>
                    {content.secondary.label}
                    <ArrowUpRight weight="bold" aria-hidden="true" />
                  </a>
                </Button>
              </div>
            </div>
            <nav className="sfb-links" aria-label={content.navLabel}>
              {content.columns.map((col) => (
                <div key={col.title} className="sfb-col">
                  <Heading as="h3" size="eyebrow" className="sfb-label">
                    {col.title}
                  </Heading>
                  <ul className="sfb-list">
                    {col.links.map((l) => (
                      <li key={l.label}>
                        <Link href={l.href} variant="quiet" standalone>
                          {l.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>
          </div>

          <div className="sfb-stage">
            <p className="sfb-wordmark" aria-hidden="true">
              <span className="sfb-wm">
                <span>{first}</span> <span>{rest.join(' ')}</span>
              </span>
            </p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="sfb-building"
              src={content.building.src}
              srcSet={`${content.building.small} 800w, ${content.building.src} 1536w`}
              sizes="100vw"
              alt={content.building.alt}
              width={1536}
              height={1024}
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
        <Text size="sm" tone="secondary" className="sfb-legal">
          {content.legal}
        </Text>
      </footer>
    </div>
  );
}

const CSS = `
/* the root: one column the page's width; the footer owns its gutters (24px, 16px on phones) */
.ssb-footer { --lift: 0; --sf-gutter: 24px; display: grid; grid-template-columns: minmax(0, 1fr); background: #fff; color: var(--content-primary); }
@media (max-width: 640px) { .ssb-footer { --sf-gutter: 16px; } }

/* the lift reveal: the page is a sheet above the footer, which is pinned to the window's foot behind it */
.ssb-footer__sheet { position: relative; z-index: 2; top: calc(var(--lift) * -8px); background: var(--surface-page); border-radius: 0 0 var(--radius-lg) var(--radius-lg); }
.ssb-footer__foot { position: sticky; bottom: 0; z-index: 1; isolation: isolate; overflow: hidden; padding: 16px 16px 0; background: var(--surface-page); }

/* the green card: the brand green at its top, fading to the page by its foot; clips the building */
.sfb-card { position: relative; overflow: hidden; padding: 40px 48px 0; border-radius: var(--radius-lg);
  background: linear-gradient(to bottom, color-mix(in srgb, var(--surface-brand-solid), black 14%) 0%, var(--surface-brand-solid) 22%, color-mix(in srgb, var(--surface-brand-solid) 62%, var(--surface-page)) 50%, var(--surface-page) 96%); }
/* white grain over the green, fading out over the card's pale foot */
.sfb-card::before { content: ''; position: absolute; inset: 0; z-index: 0; pointer-events: none; opacity: 0.22;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 2.2 -1.15'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E");
  background-size: 180px 180px;
  -webkit-mask-image: linear-gradient(to bottom, #000 40%, transparent 85%); mask-image: linear-gradient(to bottom, #000 40%, transparent 85%); }

/* the top: logo, tagline, actions | the link groups */
.sfb-top { position: relative; z-index: 3; display: flex; justify-content: space-between; align-items: flex-start; gap: 40px; width: 100%; max-width: 1232px; margin: 0 auto; box-sizing: border-box; }
.sfb-lead { display: grid; justify-items: start; gap: 12px; }
.sfb-tagline { margin: 0; color: var(--content-on-image); font-weight: var(--font-weight-semibold, 600); }
.sfb-actions { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 8px; }
.sfb-links { display: flex; gap: 72px; }
.sfb-col { display: grid; gap: 12px; align-content: start; min-width: 9rem; }
.sfb-label { color: var(--content-on-image) !important; opacity: 0.85; }
.sfb-list { display: grid; gap: 8px; margin: 0; padding: 0; list-style: none; }
/* the design system's quiet Link, in white on the green */
.sfb-list a { display: inline-flex; align-items: center; gap: 6px; color: var(--content-on-image) !important; font-size: var(--type-body-sm-size, 0.875rem); }

/* the stage: the name across the card's inner width (1232px at most), the building in front of it */
.sfb-stage { --wm: calc(100cqi / 11.45); --bw: calc(100vw - 32px); position: relative; z-index: 1; container-type: inline-size; max-width: 1232px; margin: 32px auto 0; }
.sfb-wordmark { position: relative; z-index: 1; top: 20px; margin: 0; text-align: center; white-space: nowrap;
  font-size: var(--wm); line-height: 1.05; letter-spacing: -0.035em; font-weight: var(--font-weight-semibold, 600);
  color: var(--content-on-image); -webkit-text-fill-color: currentColor; }
.sfb-wm > span { display: inline; }
/* the shimmer: soft white letters with a bright band sweeping across them, glowing as it passes */
.sfb-wm { -webkit-text-fill-color: transparent;
  background: linear-gradient(105deg,
      color-mix(in srgb, var(--content-on-image) 42%, transparent) 0%,
      color-mix(in srgb, var(--content-on-image) 42%, transparent) 36%,
      color-mix(in srgb, var(--content-on-image) 80%, transparent) 44%,
      var(--content-on-image) 50%,
      color-mix(in srgb, var(--content-on-image) 80%, transparent) 56%,
      color-mix(in srgb, var(--content-on-image) 42%, transparent) 64%,
      color-mix(in srgb, var(--content-on-image) 42%, transparent) 100%) 0 0 / 250% 100% no-repeat;
  -webkit-background-clip: text; background-clip: text;
  filter: drop-shadow(0 0 10px color-mix(in srgb, var(--content-on-image) 45%, transparent)) brightness(1.08);
  animation: sfb-shimmer 4.5s ease-in-out infinite; }
@keyframes sfb-shimmer { 0% { background-position: 100% 0; } 100% { background-position: 0% 0; } }
/* the building: 1100px at most, centred, its dome just under the name (the image is transparent
   above its roofline, its top 17% of its width); shown down to its entrance, fading out below it
   and into the card at its sides */
.sfb-building { --bw2: min(var(--bw), 1100px); position: relative; z-index: 2; display: block; width: var(--bw2); max-width: none; height: auto;
  margin: calc(var(--bw2) * -0.17 - var(--wm) * 0.16) auto calc(var(--bw2) * -0.187) calc(50% - var(--bw2) / 2);
  -webkit-mask-image: linear-gradient(to bottom, #000 56%, transparent 71%), linear-gradient(to right, transparent, #000 10%, #000 90%, transparent);
  -webkit-mask-composite: source-in;
  mask-image: linear-gradient(to bottom, #000 56%, transparent 71%), linear-gradient(to right, transparent, #000 10%, #000 90%, transparent);
  mask-composite: intersect; }
.sfb-legal { position: relative; z-index: 3; margin: 0 !important; padding: 16px var(--sf-gutter) 20px; text-align: center; }

/* parallax on the lift: the name rises from behind the building, the building moves a little */
.sfb-wordmark { transform: translateY(calc((1 - var(--lift)) * var(--wm) * 1.3)); }
.sfb-building { transform: translateY(calc((1 - var(--lift)) * 16px)); }

/* phones and small tablets: one column, the actions full width, the links two across, the name on two lines */
@media (max-width: 760px) {
  .ssb-footer__foot { padding: 8px 8px 0; }
  .sfb-card { padding: 28px 24px 0; }
  .sfb-top { display: grid; grid-template-columns: minmax(0, 1fr); gap: 28px; }
  .sfb-actions { display: grid; width: 100%; gap: 10px; }
  .sfb-actions > * { width: 100%; justify-content: center; }
  .sfb-links { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 20px; }
  .sfb-col { min-width: 0; gap: 12px; }
  .sfb-stage { --wm: calc(100cqi / 6.3); --bw: calc(100cqi + 48px); margin-top: 40px; }
  .sfb-wordmark { white-space: normal; line-height: 1; }
  .sfb-wm > span { display: block; }
  /* edge to edge across the card, no side fade */
  .sfb-building { --bw2: var(--bw); margin-left: -24px; margin-bottom: calc(var(--bw2) * -0.187);
    -webkit-mask-image: linear-gradient(to bottom, #000 56%, transparent 71%); mask-image: linear-gradient(to bottom, #000 56%, transparent 71%);
    -webkit-mask-composite: source-over; mask-composite: add; }
  .sfb-legal { padding: 12px 16px 16px; }
}

@media (prefers-reduced-motion: reduce) {
  .sfb-wm { animation: none; }
  .sfb-wordmark, .sfb-building { transform: none; }
}
`;
