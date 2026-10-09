'use client';

import * as React from 'react';
import { Container, Heading, Section, Text } from '@kishanscaler/ssx-ui';

import { alumni as allAlumni, pivotAlumni } from '@/content/alumni';
import { useSectionEntrance } from '@/sections/faculty/useSectionEntrance';
import { ScrollDots } from '@/sections/shared/ScrollDots';
import { AlumniCard } from './AlumniCard';
import './alumni.css';

// Those with a photo in the card's landscape style, then the internship section's learners (2026-10-07),
// who have no portrait yet (the card's empty-room plate with their initials).
const alumni = [...allAlumni.filter((a) => a.photo), ...pivotAlumni];

/** `peers` is the logo ticker under the cards (a server component, so it comes in from the page). */
export function AlumniSection({ peers }: { peers?: React.ReactNode }) {
  const sectionRef = React.useRef<HTMLElement>(null);
  const rowRef = React.useRef<HTMLUListElement>(null);
  // Same entrance as Faculty: the header, then the cards on screen wiped open.
  useSectionEntrance(sectionRef, { decks: ['.alumni-row > li > article'] });
  // From the tablet up the cards run in two rows (2026-10-09), so the dots count columns, not cards.
  const [rows, setRows] = React.useState(1);
  React.useEffect(() => {
    const mq = window.matchMedia('(min-width: 672px)');
    const set = () => setRows(mq.matches ? 2 : 1);
    set();
    mq.addEventListener('change', set);
    return () => mq.removeEventListener('change', set);
  }, []);


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
            {/* Picks up Why SSB's "roles like…" (2026-10-07): our earlier cohorts, already there. */}
            <Heading as="h2" size="display" id="alumni-title" data-enter="headline">
              Our earlier cohorts are already in roles like these.
            </Heading>
            <Text size="lg" tone="secondary" data-enter="sub">
              Now in growth, strategy and brand roles at Blinkit, Emergent and more.
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
      <ScrollDots scroller={rowRef} count={Math.ceil(alumni.length / rows)} itemName="alumni" fill="solid" />

      {peers ? <Container className="mt-16 sm:mt-20">{peers}</Container> : null}
    </Section>
  );
}
