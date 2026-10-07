'use client';

import * as React from 'react';
import { Container, Heading, Section, Text } from '@kishanscaler/ssx-ui';

import { alumni as allAlumni } from '@/content/alumni';
import { useSectionEntrance } from '@/sections/faculty/useSectionEntrance';
import { ScrollDots } from '@/sections/shared/ScrollDots';
import { AlumniCard } from './AlumniCard';
import './alumni.css';

// Only those with a photo in the card's landscape style.
const alumni = allAlumni.filter((a) => a.photo);

/** `peers` is the logo ticker under the cards (a server component, so it comes in from the page). */
export function AlumniSection({ peers }: { peers?: React.ReactNode }) {
  const sectionRef = React.useRef<HTMLElement>(null);
  const rowRef = React.useRef<HTMLUListElement>(null);
  // Same entrance as Faculty: the header, then the cards on screen wiped open.
  useSectionEntrance(sectionRef, { decks: ['.alumni-row > li > article'] });


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
              They went beyond placements: engineers and analysts moved into program, growth and marketing
              roles at Blinkit, Emergent, BharatPe and more, and some built companies of their own.
            </Text>
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
