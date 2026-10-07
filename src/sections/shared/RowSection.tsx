'use client';

import * as React from 'react';
import { Container, Heading, Section, Text } from '@kishanscaler/ssx-ui';

import { useSectionEntrance } from '@/sections/faculty/useSectionEntrance';
import { ScrollDots } from './ScrollDots';
import './row-section.css';

/**
 * A section with the site's header (eyebrow, title, line, arrows at the right)
 * over a row of cards that starts on the content edge and runs off the window's
 * right edge, with progress dots: the Alumni layout, for any cards. Each child
 * becomes one card of the row; `cardWidth` sets its width (phones: 82vw at most).
 * `after` renders under the row, inside the section. Cards open as Faculty's do.
 */
export function RowSection({
  id,
  eyebrow,
  title,
  sub,
  itemName,
  cardWidth = '20rem',
  after,
  children,
}: {
  id: string;
  eyebrow?: string;
  title: string;
  sub?: string;
  /** What one card is, for the controls' labels. */
  itemName: string;
  cardWidth?: string;
  after?: React.ReactNode;
  children: React.ReactNode;
}) {
  const sectionRef = React.useRef<HTMLElement>(null);
  const rowRef = React.useRef<HTMLUListElement>(null);
  useSectionEntrance(sectionRef, { decks: ['.rs-row > li > article'] });


  const items = React.Children.toArray(children);

  return (
    <Section ref={sectionRef} density="roomy" aria-labelledby={`${id}-title`} className="overflow-x-clip">
      <Container>
        <div
          data-enter="header"
          className="mb-10 flex flex-col gap-6 sm:mb-12 sm:flex-row sm:items-end sm:justify-between"
        >
          <div className="flex max-w-(--size-measure-max) flex-col gap-3">
            {eyebrow ? (
              <Heading as="p" size="eyebrow" className="text-content-brand" data-enter="eyebrow">
                {eyebrow}
              </Heading>
            ) : null}
            <Heading as="h2" size="display" id={`${id}-title`} data-enter="headline">
              {title}
            </Heading>
            {sub ? (
              <Text size="lg" tone="secondary" data-enter="sub">
                {sub}
              </Text>
            ) : null}
          </div>
        </div>
      </Container>

      <ul
        ref={rowRef}
        className="rs-row"
        aria-label={title}
        style={{ '--rs-card': cardWidth } as React.CSSProperties}
      >
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
      <ScrollDots scroller={rowRef} count={items.length} itemName={itemName} fill="solid" />

      {after}
    </Section>
  );
}
