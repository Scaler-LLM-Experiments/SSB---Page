'use client';

import * as React from 'react';
import { Container, Heading, Section } from '@kishanscaler/ssx-ui';

import { builtAtSsb, type BuiltCompany } from '@/content/community';
import { useSectionEntrance } from '@/sections/faculty/useSectionEntrance';
import { ScrollDots } from '@/sections/shared/ScrollDots';
import { useRows } from '@/sections/shared/useRows';
import './built-cards.css';

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
 */
export function BuiltCards() {
  const c = builtAtSsb;
  const sectionRef = React.useRef<HTMLElement>(null);
  const rowRef = React.useRef<HTMLUListElement>(null);
  // two rows from 672px, one on a phone (2026-10-27, the user's ask): a dot per column
  const rows = useRows(2);
  useSectionEntrance(sectionRef, { decks: ['.bc-row > li > article'] });

  return (
    <Section ref={sectionRef} id="built" density="roomy" aria-labelledby="bc-title" className="overflow-x-clip">
      <Container>
        <div data-enter="header" className="bc-head">
          <Heading as="p" size="eyebrow" className="bc-eyebrow" data-enter="eyebrow">
            {c.eyebrow}
          </Heading>
          <Heading as="h2" size="display" id="bc-title" data-enter="headline" className="bc-title">
            {c.title} <span>{c.titleTail}</span>
          </Heading>
        </div>
      </Container>

      <ul ref={rowRef} className="bc-row" aria-label={c.label}>
        {c.companies.map((co, i) => (
          <li key={co.company}>
            <BuiltCard co={co} i={i} />
          </li>
        ))}
      </ul>
      <div className="bc-dots">
        <ScrollDots scroller={rowRef} count={Math.ceil(c.companies.length / rows)} itemName="companies" fill="solid" autoplay={false} />
      </div>
    </Section>
  );
}

function BuiltCard({ co, i }: { co: BuiltCompany; i: number }) {
  return (
    <article className="bc-card">
      {/* (2026-10-27, the user's ask) the companies' own photos for now, until the founders' portraits come */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
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
      <div className="bc-body" data-brand="ssb" data-theme="dark">
        <div className="bc-top" data-part="title">
          <h3 className="bc-name">{co.company}</h3>
          <p className="bc-by">{co.by}</p>
        </div>
        <hr className="bc-rule" />
        <p className="bc-blurb" data-part="description">
          {co.blurb}
        </p>
        <div className="bc-met" data-part="description">
          <p className="bc-met-v">{co.stat.value}</p>
          <p className="bc-met-l">{co.stat.label}</p>
        </div>
      </div>
    </article>
  );
}
