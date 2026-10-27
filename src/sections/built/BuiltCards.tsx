'use client';

import * as React from 'react';
import { Container, Heading, Section } from '@kishanscaler/ssx-ui';
import { ArrowUpRight } from '@phosphor-icons/react';

import { builtAtSsb, type BuiltCompany } from '@/content/community';

import { useSectionEntrance } from '@/sections/faculty/useSectionEntrance';
import { ScrollDots } from '@/sections/shared/ScrollDots';
import { useRows } from '@/sections/shared/useRows';
import './built-cards.css';

/** What a card shows: a company of `builtAtSsb`, or the deck variant's (no hotspot or story; a figure only where there is one). */
export type BuiltCard = Pick<BuiltCompany, 'company' | 'sector' | 'by' | 'blurb' | 'image' | 'focus'> & {
  stat?: BuiltCompany['stat'];
  /** Its website: an arrow beside the company's name (the lab's startups on these cards, /v7). */
  href?: string;
};
export type BuiltContent = { eyebrow: string; title: string; titleTail: string; label: string; companies: BuiltCard[] };

/**
 * "Built at SSB" as a row of cards (2026-10-27, the user's ask: more companies at a time, as the alumni
 * cards). Each card is laid out as the alumni card (but fluid, not one design scaled down, which put
 * its smaller type under 12px): the company's photo full-bleed (the founders' faces were tried first;
 * only two had portraits), darkened on the right; over it the company, its founders, a rule, the line
 * on what was built and its figure
 * (the number and sector over them came off the same day). Two rows, card over card, from 672px (three
 * and a half columns on desktop), one row of portrait cards on a phone; scrolled by hand (the dots and
 * arrows). The one-photo
 * stage it replaces is `BuiltSection`, kept.
 *
 * `content` and `variant="deck"` (the deck variant, /v7, 2026-10-28, the user's ask): the deck's startups
 * on light cards, the photo inset with its figure (when it has one) over a shade at its foot; beside it
 * the sector over the company, the founders, then the line on what was built (without the founder's
 * name again).
 */
export function BuiltCards({
  content = builtAtSsb,
  variant,
  id = 'built',
  heading,
}: {
  content?: BuiltContent;
  variant?: 'deck';
  /** The section's id (the lab's startups take these cards too, /v7, 2026-10-28). */
  id?: string;
  /** A header of the caller's own in place of the eyebrow and title (it carries its own heading). */
  heading?: React.ReactNode;
} = {}) {
  const c = content;
  const sectionRef = React.useRef<HTMLElement>(null);
  const rowRef = React.useRef<HTMLUListElement>(null);
  // two rows from 672px, one on a phone (2026-10-27, the user's ask): a dot per column
  const rows = useRows(2);
  useSectionEntrance(sectionRef, { decks: ['.bc-row > li > article'] });

  return (
    <Section
      ref={sectionRef}
      id={id}
      density="roomy"
      aria-labelledby={heading ? `${id}-title` : 'bc-title'}
      className="overflow-x-clip"
      data-variant={variant}
    >
      <Container>
        {heading ? (
          <div data-enter="header" className="bc-head">
            {heading}
          </div>
        ) : (
          <div data-enter="header" className="bc-head">
            <Heading as="p" size="eyebrow" className="bc-eyebrow" data-enter="eyebrow">
              {c.eyebrow}
            </Heading>
            <Heading as="h2" size="display" id="bc-title" data-enter="headline" className="bc-title">
              {c.title} <span>{c.titleTail}</span>
            </Heading>
          </div>
        )}
      </Container>

      <ul ref={rowRef} className="bc-row" aria-label={c.label}>
        {c.companies.map((co, i) => (
          <li key={co.company}>
            <Card co={co} i={i} deck={variant === 'deck'} />
          </li>
        ))}
      </ul>
      <div className="bc-dots">
        <ScrollDots scroller={rowRef} count={Math.ceil(c.companies.length / rows)} itemName="companies" fill="solid" autoplay={false} />
      </div>
    </Section>
  );
}

function Card({ co, i, deck }: { co: BuiltCard; i: number; deck: boolean }) {
  // (2026-10-27, the user's ask) the companies' own photos for now, until the founders' portraits come
  const photo = (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className="bc-photo"
      src={co.image.src}
      alt=""
      width={co.image.width}
      height={co.image.height}
      loading={i < 3 ? 'eager' : 'lazy'}
      decoding="async"
      style={{ objectPosition: `${co.focus[0] * 100}% ${co.focus[1] * 100}%` }}
      data-part="photo"
    />
  );
  const met = co.stat ? (
    <div className="bc-met" data-part="description">
      <p className="bc-met-v">{co.stat.value}</p>
      <p className="bc-met-l">{co.stat.label}</p>
    </div>
  ) : null;
  return (
    <article className="bc-card">
      {/* the deck variant (2026-10-28): the photo inset, its figure over a shade at its foot */}
      {deck ? (
        <div className="bc-media" data-brand="ssb" data-theme="dark">
          {photo}
          {met ? <span className="bc-media-shade" aria-hidden="true" /> : null}
          {met}
        </div>
      ) : (
        photo
      )}
      <div className="bc-body" data-brand="ssb" data-theme={deck ? 'light' : 'dark'}>
        <div className="bc-top" data-part="title">
          {deck ? <p className="bc-k">{co.sector}</p> : null}
          <h3 className="bc-name">
            {co.href ? (
              <a href={co.href} target="_blank" rel="noreferrer" className="bc-link">
                {co.company}
                <ArrowUpRight weight="bold" aria-hidden="true" />
              </a>
            ) : (
              co.company
            )}
          </h3>
          <p className="bc-by">{co.by}</p>
        </div>
        <hr className="bc-rule" />
        <p className="bc-blurb" data-part="description">
          {co.blurb}
        </p>
        {deck ? null : met}
      </div>
    </article>
  );
}
