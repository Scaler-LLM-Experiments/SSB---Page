'use client';

import * as React from 'react';
import { Container, Heading, Section, Text } from '@kishanscaler/ssx-ui';

import { alumni } from '@/content/alumni';
import { HScrollerControls } from '@/sections/faculty/HScroller';
import { useSectionEntrance } from '@/sections/faculty/useSectionEntrance';
import { ScrollDots } from '@/sections/shared/ScrollDots';
import { AlumniCard } from './AlumniCard';
import './alumni.css';

/** `peers` is the logo ticker under the cards (a server component, so it comes in from the page). */
export function AlumniSection({ peers }: { peers?: React.ReactNode }) {
  const sectionRef = React.useRef<HTMLElement>(null);
  const rowRef = React.useRef<HTMLUListElement>(null);
  // Same entrance as Faculty: the header, then the cards on screen wiped open.
  useSectionEntrance(sectionRef, { decks: ['.alumni-row > li > article'] });

  // The same header arrows as Faculty: one card per press.
  const page = (dir: 1 | -1) => {
    const el = rowRef.current;
    const card = el?.firstElementChild as HTMLElement | null;
    if (!el || !card) return;
    el.scrollBy({
      left: dir * (card.offsetWidth + parseFloat(getComputedStyle(el).columnGap || '0')),
      behavior: 'smooth',
    });
  };

  return (
    <Section ref={sectionRef} density="roomy" aria-labelledby="alumni-title" className="overflow-x-clip">
      <Container>
        <div
          data-enter="header"
          className="mb-10 flex flex-col gap-6 sm:mb-12 sm:flex-row sm:items-end sm:justify-between"
        >
          <div className="flex max-w-(--size-measure-max) flex-col gap-3">
            <Heading as="p" size="eyebrow" className="text-content-brand" data-enter="eyebrow">
              Alumni
            </Heading>
            <Heading as="h2" size="display" id="alumni-title" data-enter="headline">
              Strong Alumni Base
            </Heading>
            <Text size="lg" tone="secondary" data-enter="sub">
              From engineers and analysts to strategy, growth and investment roles at Blinkit, Urban Company,
              Razorpay and more.
            </Text>
          </div>
          <div data-enter="controls" className="hidden sm:block">
            <HScrollerControls label="alumni" page={page} />
          </div>
        </div>
      </Container>

      <ul ref={rowRef} className="alumni-row" aria-label="Alumni">
        {alumni.map((a, i) => (
          <li key={a.name}>
            <AlumniCard alumnus={a} priority={i < 3} />
          </li>
        ))}
      </ul>
      <ScrollDots scroller={rowRef} count={alumni.length} itemName="alumni" fill="solid" />

      {peers ? <Container className="mt-16 sm:mt-20">{peers}</Container> : null}
    </Section>
  );
}
