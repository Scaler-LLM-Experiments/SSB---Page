'use client';

import * as React from 'react';
import { Container, Heading, Section, Text } from '@kishanscaler/ssx-ui';

import { deckCareerPrep } from '@/content/deck';
import { useSectionEntrance } from '@/sections/faculty/useSectionEntrance';
import { Title } from '@/sections/shared/Title';
import './deck-career.css';

/**
 * Career prep (the final page, 2026-10-28, the user's ask: back, crisp, no photos), above the 150-hour
 * AI curriculum: the header at the left (eyebrow, title, the three phases as its line), the four figures
 * 2 × 2 at the right, each in a card of the page's; one column on a phone.
 */
export function DeckCareerPrep() {
  const ref = React.useRef<HTMLElement>(null);
  useSectionEntrance(ref, { decks: ['.dcp-grid > *'] });
  const c = deckCareerPrep;
  return (
    <Section ref={ref} density="roomy" aria-labelledby="dcp-title" className="dcp">
      <Container>
        <div className="dcp-wrap">
          <div data-enter="header" className="dcp-head">
            <Heading as="p" size="eyebrow" className="text-content-brand" data-enter="eyebrow">
              {c.eyebrow}
            </Heading>
            <Heading as="h2" size="display" id="dcp-title" data-enter="headline">
              <Title text={c.title} />
            </Heading>
            <Text size="lg" tone="secondary" data-enter="sub">
              {c.sub}
            </Text>
          </div>
          <dl className="dcp-grid">
            {c.stats.map((s) => (
              <div key={s.label} className="dcp-stat">
                <dd>{s.value}</dd>
                <dt>{s.label}</dt>
              </div>
            ))}
          </dl>
        </div>
      </Container>
    </Section>
  );
}
