'use client';

import * as React from 'react';
import { Container, Heading, Section } from '@kishanscaler/ssx-ui';
import { ArrowUpRight } from '@phosphor-icons/react';

import { press } from '@/content/community';
import { Title } from '@/sections/shared/Title';
import { useSectionEntrance } from '@/sections/faculty/useSectionEntrance';
import './press.css';

/**
 * "In the press" (the concept site's /v4 section, 2026-10-23; the team's pick, in place of In the
 * News), on the light page: the header, then four cards, a publication to each: its logo, the date,
 * the headline, a line, and "Read on <outlet>" at the foot, the whole card the link (a new tab).
 * Four across on desktop, two on a tablet, a sideways row on a phone. Hover lifts the card.
 */
export function PressSection() {
  const ref = React.useRef<HTMLElement>(null);
  useSectionEntrance(ref, { decks: ['.pr-card'] });
  return (
    <Section ref={ref} id="press" density="roomy" aria-labelledby="pr-title" className="pr-sec">
      <Container>
        <div data-enter="header" className="pr-head">
          <Heading as="p" size="eyebrow" className="text-content-brand" data-enter="eyebrow">
            {press.eyebrow}
          </Heading>
          <Heading as="h2" size="display" id="pr-title" data-enter="headline">
            <Title text={press.title} />
          </Heading>
        </div>
      </Container>
      <ul className="pr-grid">
        {press.articles.map((a) => (
          <li key={a.href}>
            <a className="pr-card" href={a.href} target="_blank" rel="noopener noreferrer">
              <span className="pr-lg" data-part="title">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={a.logo.src} alt={a.outlet} height={a.logo.h} style={{ height: a.logo.h }} loading="lazy" />
              </span>
              <time dateTime={a.date} data-part="description">{a.dateLabel}</time>
              <h3 data-part="description">{a.title}</h3>
              <p data-part="description">{a.text}</p>
              <span className="pr-go" data-part="action">
                Read on {a.short}
                <ArrowUpRight weight="bold" aria-hidden="true" />
              </span>
            </a>
          </li>
        ))}
      </ul>
    </Section>
  );
}
