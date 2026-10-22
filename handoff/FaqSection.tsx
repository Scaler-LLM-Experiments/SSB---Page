'use client';

/**
 * SSB FAQ section — handoff copy (2026-10-13), standalone.
 *
 * What it is: a two-column section. Left: eyebrow "FAQ", the title and a line under it; it stays
 * in view (sticky) while the questions scroll on desktop. Right: the questions as the design
 * system's Accordion. Stacked in one column below 1056px.
 *
 * Interaction:
 * - Accordion (ssx-ui, flat `items` form): one answer open at a time (`type="single"`), the open one
 *   can be closed again (`collapsible`), the first open at the start. Its keyboard support (arrow
 *   keys between questions) and its open/close animation are the component's own.
 * - Entrance, played once when the section comes on screen: the eyebrow fades up, the title rises
 *   line by line out of a mask, the line under it follows; the questions fade up as one block.
 *   GSAP (ScrollTrigger, SplitText) on the ssx-ui motion tokens. Reduced motion: no entrance.
 *
 * Built from ssx-ui: Section, Container, Heading, Text, Accordion, Link.
 * Needs the ssx-ui stylesheet, `data-brand="ssb"` on <html>, and `gsap` (3.13+, SplitText is free).
 */
import * as React from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { Accordion, Container, Heading, Link, Section, Text } from '@kishanscaler/ssx-ui';
import { ease, motionTokens, prefersReducedMotion, useMotion } from '@kishanscaler/ssx-ui/motion';

export type Faq = {
  question: string;
  answer: string;
  /** When set, the answer reads "See the <label> section above." with the label as a link. */
  link?: { label: string; href: string };
};

export interface FaqContent {
  eyebrow: string;
  title: string;
  sub: string;
  faqs: Faq[];
}

export const FAQ_CONTENT: FaqContent = {
  eyebrow: 'FAQ',
  title: 'Frequently Asked Questions',
  sub: 'Answers to what applicants ask most about the degree, eligibility, the programme and the internship.',
  faqs: [
    {
      question: 'Does the lack of a degree hold back my career later?',
      answer:
        "Short answer: no. The industry cares about your skills, experience, and body of work, not the accreditation on your certificate. SSB's PGP in Management & Technology is a certificate program by design: a degree is fixed the day it's accredited; our curriculum isn't. We rebuild it every term against what industry is actually hiring for right now.",
    },
    {
      question: 'What is the eligibility criteria?',
      answer: 'See the Eligibility & Admissions section above.',
      link: { label: 'Eligibility & Admissions', href: '#admissions' },
    },
    {
      question: 'Do I need a management entrance score to apply?',
      answer: 'No mandatory entrance exam score. Profile-based evaluation.',
    },
    {
      question: 'What is the program structure and duration?',
      answer: '18 months, full-time, on-campus, including a 3–6 month internship, structured across 5 terms.',
    },
    {
      question: 'What happens during the internship?',
      answer:
        '100% of Cohort 1 completed a mandatory internship, with stipends up to ₹60K. Several converted directly into full-time offers.',
    },
  ],
};

export function FaqSection({ content = FAQ_CONTENT, id = 'faq' }: { content?: FaqContent; id?: string }) {
  const ref = React.useRef<HTMLElement>(null);
  useEntrance(ref);
  const titleId = `${id}-title`;

  return (
    <Section ref={ref} id={id} density="roomy" aria-labelledby={titleId} className="ssb-faq">
      <style href="ssb-faq" precedence="default">
        {CSS}
      </style>
      <Container>
        <div className="ssb-faq__grid">
          <div data-enter="header" className="ssb-faq__head">
            <Heading as="p" size="eyebrow" className="ssb-faq__eyebrow" data-enter="eyebrow">
              {content.eyebrow}
            </Heading>
            <Heading as="h2" size="display" id={titleId} data-enter="headline">
              {content.title}
            </Heading>
            <Text size="lg" tone="secondary" className="ssb-faq__sub" data-enter="sub">
              {content.sub}
            </Text>
          </div>

          <div data-enter="block" className="ssb-faq__list">
            <Accordion
              type="single"
              collapsible
              defaultValue="faq-0"
              items={content.faqs.map((f, i) => ({
                value: `faq-${i}`,
                title: f.question,
                content: (
                  <Text tone="secondary">
                    {f.link ? (
                      <>
                        See the <Link href={f.link.href}>{f.link.label}</Link> section above.
                      </>
                    ) : (
                      f.answer
                    )}
                  </Text>
                ),
              }))}
            />
          </div>
        </div>
      </Container>
    </Section>
  );
}

/**
 * The page's section entrance (the header, then any `data-enter="block"`), each part played once
 * as it comes on screen. Mark the header `data-enter="header"`, its parts
 * `data-enter="eyebrow|headline|sub|controls"`.
 */
function useEntrance(scope: React.RefObject<HTMLElement | null>) {
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

      const headline = q('[data-enter="headline"]')[0];
      const split = headline ? SplitText.create(headline, { type: 'lines', mask: 'lines', aria: 'auto' }) : null;
      // clamp() keeps the start reachable when the section ends the page
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
      q('[data-enter="block"]').forEach((block) => {
        gsap.fromTo(
          block,
          { autoAlpha: 0, y: offset.reveal },
          { ...shown, duration: long, ease: enter, scrollTrigger: { trigger: block, start: 'clamp(top 85%)', once: true } },
        );
      });
      return () => split?.revert();
    },
    scope,
    [],
  );
}

const CSS = `
/* the page's settings for SSB sections: 48px above and below (96px from 672px), section titles at
   medium weight, brand text in the logo's green (#1D925B) */
.ssb-faq { --type-display-weight: var(--font-weight-medium); --content-brand: var(--color-ssb-light-9); padding-block: var(--space-12); }
@media (min-width: 672px) { .ssb-faq { padding-block: var(--space-24); } }
.ssb-faq__eyebrow { color: var(--content-brand); }

/* one column, then the header (5) beside the questions (7) from 1056px, the header sticky */
.ssb-faq__grid { display: grid; gap: var(--space-10); }
/* the section header, as every header on the page: eyebrow, 8px, title, 8px, the sub-line at the
   body size (16px, not the large 18px), 1.6 leading, grey, about 70 characters a line at most */
.ssb-faq__head { display: flex; flex-direction: column; gap: var(--space-2); align-self: start; }
.ssb-faq__sub { max-width: 40rem; font-size: var(--type-body-size); line-height: 1.6; color: var(--content-secondary); text-wrap: pretty; }
.ssb-faq__list { min-width: 0; }
@media (min-width: 1056px) {
  .ssb-faq__grid { grid-template-columns: minmax(0, 5fr) minmax(0, 7fr); gap: var(--space-16); }
  .ssb-faq__head { position: sticky; top: var(--space-24); }
}
`;
