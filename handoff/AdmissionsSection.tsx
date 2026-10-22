'use client';

/**
 * SSB Admissions section — handoff copy (2026-10-13), standalone.
 *
 * What it is: a two-column section. Left (sticky while the right scrolls, on desktop): eyebrow
 * "Admissions", the title, a line, an Eligibility card and two buttons. Right, three cards in order:
 * 1. Admissions process: the scholarship artwork filling the card, a dark frosted panel at its left
 *    with the numbered steps and the fast-track route (phones: the artwork on top, the panel under it).
 * 2. Programme fee: the design system's Table on tablet and up; on phones a list (intake, deadline,
 *    course fee) with the application fee said once below it.
 * 3. Scholarships: the artwork filling the card, a frosted green bar at its foot with "Up to 100%"
 *    large beside the line.
 * Stacked in one column below 1056px.
 *
 * Interaction:
 * - Entrance, played once: the header (eyebrow fades up, the title rises line by line out of a mask,
 *   the rest follows), then the three cards wipe open bottom to top one after another, each photo
 *   settling from a slight zoom while its text rises in. GSAP (ScrollTrigger, SplitText) on the
 *   ssx-ui motion tokens. Reduced motion: no entrance.
 * - No other interaction: the buttons are links (hrefs are placeholders).
 *
 * Built from ssx-ui: Section, Container, Heading, Text, Card, CardBody, Button, Table (+ parts).
 * Asset: /admissions/scholarships.webp (1671 × 941), used by the process and scholarships cards.
 * Needs the ssx-ui stylesheet, `data-brand="ssb"` on <html>, and `gsap` (3.13+, SplitText is free).
 */
import * as React from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import {
  Button,
  Card,
  CardBody,
  Container,
  Heading,
  Section,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Text,
} from '@kishanscaler/ssx-ui';
import { ease, motionTokens, prefersReducedMotion, useMotion } from '@kishanscaler/ssx-ui/motion';

export type FeeRow = { intake: string; deadline: string; application: string; course: string };

export interface AdmissionsContent {
  eyebrow: string;
  title: string;
  sub: string;
  eligibility: { title: string; body: string };
  ctas: { primary: { label: string; href: string }; secondary: { label: string; href: string } };
  process: { title: string; steps: string[]; fastTrackLabel: string; fastTrack: string };
  fees: { title: string; columns: [string, string, string, string]; rows: FeeRow[] };
  scholarships: { title: string; figureLead: string; figure: string; body: string };
  /** The artwork behind the process and scholarships cards. */
  image: { src: string; width: number; height: number };
}

export const ADMISSIONS_CONTENT: AdmissionsContent = {
  eyebrow: 'Admissions',
  title: 'Admission Process, Fees and Eligibility',
  sub: 'Who can apply, how selection works, what the programme costs, and the scholarships on offer.',
  eligibility: {
    title: 'Eligibility',
    body: "Class 12th, then graduation: a bachelor's degree from an accredited institution. Ideal for professionals with work experience, and for freshers who bring a strong track record of initiative: internships, projects, clubs or similar engagements.",
  },
  // placeholder hrefs, until real destinations are agreed
  ctas: {
    primary: { label: 'Start application', href: '#apply' },
    secondary: { label: 'Talk to advisor', href: '#advisor' },
  },
  process: {
    title: 'Admissions process',
    steps: ['Apply', 'Pay application fee', 'Submit application', 'Interview', 'Receive verdict'],
    fastTrackLabel: 'Fast-track',
    fastTrack: 'If 90 percentile & above in CAT/XAT/NMAT/SNAP, or a 640+ score in GMAT.',
  },
  fees: {
    title: 'Programme fee',
    columns: ['Intake', 'Deadline', 'Application fee', 'Course fee'],
    rows: [
      { intake: 'Early bird', deadline: 'Oct 4, 2026', application: '₹1,000', course: '₹15,50,000' },
      { intake: 'Intake 2', deadline: 'Dec 27, 2026', application: '₹1,000', course: '₹16,00,000' },
      { intake: 'Intake 3', deadline: 'Feb 27, 2027', application: '₹1,000', course: '₹16,00,000' },
      { intake: 'Intake 4', deadline: 'May 2, 2027', application: '₹1,000', course: '₹16,00,000' },
      { intake: 'Final deadline: last intake', deadline: 'Jul 31, 2027', application: '₹1,000', course: '₹16,00,000' },
    ],
  },
  scholarships: {
    title: 'Scholarships',
    figureLead: 'Up to',
    figure: '100%',
    body: 'Up to 100% merit-based scholarships for high-achieving profiles, evaluated after your interview.',
  },
  image: { src: '/admissions/scholarships.webp', width: 1671, height: 941 },
};

export function AdmissionsSection({ content: c = ADMISSIONS_CONTENT, id = 'admissions' }: { content?: AdmissionsContent; id?: string }) {
  const ref = React.useRef<HTMLElement>(null);
  // the header, then the three cards wiped open in turn
  useEntrance(ref, '.adm-card');
  const titleId = `${id}-title`;

  return (
    <Section ref={ref} id={id} density="roomy" aria-labelledby={titleId} className="ssb-adm">
      <style href="ssb-admissions" precedence="default">
        {CSS}
      </style>
      <Container>
        <div className="adm-grid">
          {/* left: the title, eligibility and the two CTAs; stays in view while the cards scroll */}
          <div data-enter="header" className="adm-head">
            <Heading as="p" size="eyebrow" className="adm-eyebrow" data-enter="eyebrow">
              {c.eyebrow}
            </Heading>
            <Heading as="h2" size="display" id={titleId} data-enter="headline">
              {c.title}
            </Heading>
            <Text size="lg" tone="secondary" className="adm-sub" data-enter="sub">
              {c.sub}
            </Text>
            <Card as="div" className="adm-eligibility" data-enter="sub">
              <CardBody className="adm-body adm-body--eligibility">
                <Heading as="h3" size="3">
                  {c.eligibility.title}
                </Heading>
                <Text tone="secondary">{c.eligibility.body}</Text>
              </CardBody>
            </Card>
            <div data-enter="controls" className="adm-ctas">
              <Button asChild>
                <a href={c.ctas.primary.href}>{c.ctas.primary.label}</a>
              </Button>
              <Button asChild variant="secondary">
                <a href={c.ctas.secondary.href}>{c.ctas.secondary.label}</a>
              </Button>
            </div>
          </div>

          {/* right: the process, the fees and the scholarships */}
          <ol className="adm-cards">
            {/* the process: the artwork fills the card; a dark frosted panel at its left */}
            <li className="adm-card adm-frame">
              <div className="adm-ground adm-process">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={c.image.src} alt="" width={c.image.width} height={c.image.height} loading="lazy" decoding="async" data-part="photo" />
                <div className="adm-process__panel">
                  <Heading as="h3" size="3" data-part="title">
                    {c.process.title}
                  </Heading>
                  <ol className="adm-process__steps" data-part="description">
                    {c.process.steps.map((step, i) => (
                      <li key={step}>
                        <span aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                        {step}
                      </li>
                    ))}
                  </ol>
                  <div className="adm-process__fast" data-part="description">
                    <span className="adm-label">{c.process.fastTrackLabel}</span>
                    <Text size="sm">{c.process.fastTrack}</Text>
                  </div>
                </div>
              </div>
            </li>

            {/* the fee: a table from 672px; a list on phones (the four columns don't fit) */}
            <Card as="li" className="adm-card">
              <CardBody className="adm-body">
                <div data-part="title">
                  <Heading as="h3" size="3">
                    {c.fees.title}
                  </Heading>
                </div>
                <div data-part="description">
                  <div className="adm-table">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          {c.fees.columns.map((col) => (
                            <TableHead key={col}>{col}</TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {c.fees.rows.map((r) => (
                          <TableRow key={r.intake}>
                            <TableCell>{r.intake}</TableCell>
                            <TableCell className="adm-nowrap">{r.deadline}</TableCell>
                            <TableCell className="adm-nowrap">{r.application}</TableCell>
                            <TableCell className="adm-nowrap">{r.course}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  {/* phones: one row per intake, the course fee alongside; the application fee is the
                      same for every intake, so it's said once */}
                  <ul className="adm-intakes">
                    {c.fees.rows.map((r) => (
                      <li key={r.intake}>
                        <div>
                          <Text as="span" className="adm-intake">
                            {r.intake}
                          </Text>
                          <Text as="span" size="sm" tone="secondary">
                            Deadline {r.deadline}
                          </Text>
                        </div>
                        <Text as="span" className="adm-course">
                          {r.course}
                        </Text>
                      </li>
                    ))}
                  </ul>
                  <Text size="sm" tone="secondary" className="adm-intakes-note">
                    Application fee: {c.fees.rows[0]?.application} for every intake.
                  </Text>
                </div>
              </CardBody>
            </Card>

            {/* scholarships: the artwork fills the card; on a frosted green bar at its foot the figure
                large beside what it is, in white */}
            <li className="adm-card adm-frame">
              <div className="adm-ground adm-scholar">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={c.image.src} alt="" width={c.image.width} height={c.image.height} loading="lazy" decoding="async" data-part="photo" />
                <div className="adm-scholar__bar adm-glass">
                  <p className="adm-scholar__figure" data-part="title">
                    <span>{c.scholarships.figureLead}</span>
                    {c.scholarships.figure}
                  </p>
                  <div className="adm-scholar__copy" data-part="description">
                    <Heading as="h3" size="3">
                      {c.scholarships.title}
                    </Heading>
                    <Text size="sm">{c.scholarships.body}</Text>
                  </div>
                </div>
              </div>
            </li>
          </ol>
        </div>
      </Container>
    </Section>
  );
}

/**
 * The page's section entrance: the header as it comes up, then the cards (`deck`) wiped open bottom
 * to top one after another once their list is a quarter of the way up the screen, each card's
 * `data-part="photo"` settling from a slight zoom while its `title`/`description` parts rise in.
 */
function useEntrance(scope: React.RefObject<HTMLElement | null>, deck: string) {
  useMotion(
    () => {
      const root = scope.current;
      if (!root || prefersReducedMotion(root)) return;
      gsap.registerPlugin(ScrollTrigger, SplitText);
      const { duration: d, stagger: st, offset } = motionTokens;
      const q = gsap.utils.selector(root);
      const enter = ease('expressiveEntrance');
      const long = d.slower;
      // fromTo with an explicit end state, so it survives React re-running the effect
      const shown = { autoAlpha: 1, y: 0, clearProps: 'transform,opacity,visibility' };

      // 1. the header
      const headline = q('[data-enter="headline"]')[0];
      const split = headline ? SplitText.create(headline, { type: 'lines', mask: 'lines', aria: 'auto' }) : null;
      const tl = gsap.timeline({
        defaults: { ease: enter },
        scrollTrigger: { trigger: q('[data-enter="header"]')[0] ?? root, start: 'clamp(top 85%)', once: true },
      });
      tl.fromTo(q('[data-enter="eyebrow"]'), { autoAlpha: 0, y: offset.enter }, { ...shown, duration: d.slow });
      if (split) {
        // room below each line's mask for descenders, without moving the layout
        gsap.set(split.masks, { paddingBottom: '0.15em', marginBottom: '-0.15em' });
        tl.fromTo(
          split.lines,
          { yPercent: 110 },
          { yPercent: 0, duration: long, stagger: st.base * 2, onComplete: () => split.revert() },
          '<0.05',
        );
      }
      tl.fromTo(
        q('[data-enter="sub"], [data-enter="controls"]'),
        { autoAlpha: 0, y: offset.reveal },
        { ...shown, duration: long, stagger: st.base },
        '<0.15',
      );

      // 2. the cards
      const cards = q(deck).filter((el) => (el as HTMLElement).offsetParent !== null);
      if (cards.length) {
        const list = cards[0].closest('ol, ul') ?? cards[0];
        const cardsTl = gsap.timeline({
          defaults: { ease: enter },
          scrollTrigger: { trigger: list, start: 'clamp(top 75%)', once: true },
        });
        cards.forEach((card, i) => {
          const t = i * st.base * 1.5;
          const radius = getComputedStyle(card).borderTopLeftRadius || '0px';
          cardsTl.fromTo(
            card,
            { clipPath: `inset(100% 0% 0% 0% round ${radius})` },
            { clipPath: `inset(0% 0% 0% 0% round ${radius})`, duration: long * 1.25, ease: ease('expressiveInOut'), clearProps: 'clipPath' },
            t,
          );
          cardsTl.fromTo(card.querySelectorAll('[data-part="photo"]'), { scale: 1.18 }, { scale: 1, duration: long * 1.5, clearProps: 'transform' }, t);
          cardsTl.fromTo(
            card.querySelectorAll('[data-part="title"], [data-part="description"]'),
            { autoAlpha: 0, y: offset.reveal },
            { ...shown, duration: long, stagger: st.base * 1.5 },
            t + long * 0.45,
          );
        });
      }
      return () => split?.revert();
    },
    scope,
    [],
  );
}

const CSS = `
/* the page's settings for SSB sections: 48px above and below (96px from 672px), section titles at
   medium weight, brand text in the logo's green (#1D925B) */
.ssb-adm { --type-display-weight: var(--font-weight-medium); --content-brand: var(--color-ssb-light-9); padding-block: var(--space-12); }
@media (min-width: 672px) { .ssb-adm { padding-block: var(--space-24); } }
.adm-eyebrow { color: var(--content-brand); }

/* layout: one column, then the header (5) beside the cards (7) from 1056px, the header sticky */
.adm-grid { display: grid; gap: var(--space-10); }
/* the section header, as every header on the page: eyebrow, 8px, title, 8px, the sub-line at the
   body size (16px, not the large 18px), 1.6 leading, grey, about 70 characters a line at most */
.adm-head { display: flex; flex-direction: column; gap: var(--space-2); align-self: start; }
.adm-sub { max-width: 40rem; font-size: var(--type-body-size); line-height: 1.6; color: var(--content-secondary); text-wrap: pretty; }
@media (min-width: 1056px) {
  .adm-grid { grid-template-columns: minmax(0, 5fr) minmax(0, 7fr); gap: var(--space-16); }
  .adm-head { position: sticky; top: var(--space-24); }
}
.adm-eligibility { margin-top: var(--space-5); }
.adm-ctas { display: flex; flex-direction: column; gap: var(--space-3); margin-top: var(--space-2); }
@media (min-width: 672px) { .adm-ctas { flex-direction: row; } }
.adm-cards { display: flex; flex-direction: column; gap: var(--space-4); min-width: 0; margin: 0; padding: 0; list-style: none; }
.adm-body { gap: var(--space-4); padding: var(--space-5); }
/* the cards' text 20px in at every width (the page's card standard); the eligibility card, outside
   that standard, 24px from 672px */
.adm-body--eligibility { gap: var(--space-3); }
@media (min-width: 672px) { .adm-body--eligibility { padding: var(--space-6); } }

/* the fee: a table on tablet and up; on phones a list (the table's four columns don't fit) */
.adm-nowrap { white-space: nowrap; }
.adm-table { display: none; }
.adm-intakes { display: flex; flex-direction: column; margin: 0; padding: 0; list-style: none; }
.adm-intakes > li { display: flex; align-items: center; justify-content: space-between; gap: var(--space-4); padding-block: var(--space-3); border-bottom: var(--border-hair) solid var(--border-subtle); }
.adm-intakes > li:first-child { padding-top: 0; }
.adm-intake { display: block; font-weight: var(--font-weight-medium); }
.adm-course { font-weight: var(--font-weight-semibold); white-space: nowrap; }
.adm-intakes-note { margin-top: var(--space-3); }
@media (min-width: 672px) {
  .adm-table { display: block; }
  .adm-intakes, .adm-intakes-note { display: none; }
}

/* the process and scholarships cards: the card's edge (a hairline, radius-lg), the artwork on a
   green ground filling it, a frosted panel or bar for the words in white */
.adm-frame { overflow: hidden; border: var(--border-hair) solid var(--border-decorative); border-radius: var(--radius-lg); }
.adm-ground { position: relative; overflow: hidden; height: 100%; padding: var(--space-4);
  background:
    radial-gradient(90% 120% at 0% 0%, color-mix(in srgb, var(--surface-brand-solid) 30%, transparent), transparent 60%),
    radial-gradient(80% 110% at 100% 100%, color-mix(in srgb, var(--surface-brand-solid) 22%, transparent), transparent 60%),
    var(--surface-brand-subtle); }
/* plates on a photo: one fixed dark ink, #171717 at 55%, the same in light and dark themes (so white
   reads on the pale artwork; a theme token would flip to light grey in the dark theme), the system's
   glass blur, a white edge at 20%, 8px corners */
.ssb-adm { --plate-on-photo: rgb(23 23 23 / 0.55); }
.adm-glass { border: 1px solid rgb(255 255 255 / 0.2); border-radius: var(--radius-lg); background: var(--plate-on-photo);
  -webkit-backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-saturate)); backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-saturate)); color: var(--content-on-image); }
.adm-glass p { color: inherit; opacity: 0.88; }

/* the process: a dark frosted panel down the left (the student in the artwork stands right of it);
   each step its number, then the step, a hairline between; fast-track at its foot */
.adm-process { display: flex; min-height: 26rem; }
.adm-process > img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: 0% 55%; }
.adm-process__panel { position: relative; display: flex; flex-direction: column; gap: var(--space-4); width: min(100%, 46%); padding: var(--space-6); border-radius: var(--radius-lg);
  background: var(--plate-on-photo); -webkit-backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-saturate)); backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-saturate)); color: var(--content-on-image); }
.adm-process__panel h3 { color: inherit; }
.adm-process__steps { display: flex; flex-direction: column; margin: 0; padding: 0; list-style: none; }
.adm-process__steps > li { display: flex; align-items: baseline; gap: var(--space-3); padding: var(--space-2) 0; border-top: 1px solid var(--glass-on-image-surface); font-weight: var(--font-weight-medium); }
.adm-process__steps > li:last-child { border-bottom: 1px solid var(--glass-on-image-surface); }
.adm-process__steps > li > span { flex: none; width: 1.75rem; font-size: var(--type-caption-size); font-weight: var(--font-weight-bold, 700); letter-spacing: 0.08em; opacity: 0.7; }
.adm-process__fast { display: flex; flex-direction: column; gap: var(--space-1); margin-top: auto; }
.adm-process__fast p { color: inherit; opacity: 0.85; }

/* scholarships: the artwork 16:9 (4:5 on phones), the glass bar at its foot */
.adm-scholar { display: flex; align-items: flex-end; aspect-ratio: 16 / 9; background: var(--surface-brand-subtle); }
.adm-scholar > img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: 50% 30%; }
.adm-scholar__bar { position: relative; display: flex; align-items: center; gap: var(--space-6); width: 100%; padding: var(--space-4) var(--space-5); }
.adm-scholar__figure { display: flex; flex: none; flex-direction: column; margin: 0; font-size: 2.5rem; line-height: 1; font-weight: var(--font-weight-semibold); letter-spacing: -0.04em; white-space: nowrap; }
.adm-scholar__figure > span { margin-bottom: var(--space-1); font-size: var(--type-caption-size); font-weight: var(--font-weight-medium); letter-spacing: 0.08em; text-transform: uppercase; opacity: 0.88; }
.adm-scholar__copy { display: flex; flex-direction: column; gap: var(--space-1); min-width: 0; }
.adm-scholar__copy > * { color: inherit; }

/* phones: the process's artwork on top, the panel full width under it; scholarships stacked */
@media (max-width: 671px) {
  .adm-ground { padding: var(--space-3); }
  .adm-process { flex-direction: column; justify-content: flex-end; min-height: 0; padding-top: 12rem; }
  .adm-process > img { height: 16rem; object-position: 80% 40%; }
  .adm-process__panel { width: 100%; padding: var(--space-5); }
  .adm-scholar { aspect-ratio: 4 / 5; }
  .adm-scholar__bar { flex-direction: column; align-items: flex-start; gap: var(--space-3); }
  .adm-scholar__figure { font-size: var(--type-billboard-sm-size); }
}
`;
