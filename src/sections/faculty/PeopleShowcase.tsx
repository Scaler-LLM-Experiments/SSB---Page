'use client';

import * as React from 'react';
import { Container, Heading, Section, Text } from '@kishanscaler/ssx-ui';

import { HScrollerTrack, useHScroller } from './HScroller';
import { CardStack } from '@/sections/shared/CardStack';
import { ScrollDots } from '@/sections/shared/ScrollDots';
import { MeetCard, type CardLogo } from './MeetCard';
import { useSectionEntrance } from './useSectionEntrance';
import { Title } from '@/sections/shared/Title';

export type ShowcasePerson = {
  name: string;
  role: string;
  /** Photo URL (640x800 WebP). */
  image: string;
  logo?: CardLogo;
  /** Two or more: the logo tile flips between them, each white on its brand colour (mentors, 2026-10-13). */
  logos?: CardLogo[];
};

/**
 * The Faculty layout, for any group of people: a header (eyebrow, headline,
 * subtext, arrows), then a row of MEET cards on tablet and up (a plain carousel:
 * arrows, swipe, trackpad; no ticker, no loop) and a swipeable card stack on
 * phones (stops at either end), each with progress dots. Faculty and
 * the Scaler Impact Foundation use it.
 */
export function PeopleShowcase({
  id,
  eyebrow,
  title,
  sub,
  people,
  itemName,
  after,
  company = false,
}: {
  /** Prefix for the headline's id (`<id>-title`), which labels the section. */
  id: string;
  eyebrow?: string;
  title: string;
  sub?: string;
  people: ShowcasePerson[];
  /** What one card is, for the controls' labels ("faculty", "member"). */
  itemName: string;
  /** Rendered under the row, inside the section (the investors' VC events). */
  after?: React.ReactNode;
  /** No "Meet" kicker, and each company as its mark and name (2026-10-23, as the faculty cards). */
  company?: boolean;
}) {
  // A plain carousel: no ticker, no loop (the team's call, 2026-10-06).
  const { ref, goTo } = useHScroller({ auto: false });
  const sectionRef = React.useRef<HTMLElement>(null);
  useSectionEntrance(sectionRef);


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
              <Title text={title} />
            </Heading>
            {sub ? (
              <Text size="lg" tone="secondary" data-enter="sub">
                {sub}
              </Text>
            ) : null}
          </div>
        </div>
      </Container>

      {/* Phones: card stack, text centred on the card. */}
      <Container className="sm:hidden">
        <CardStack
          items={people}
          getKey={(m) => m.name}
          label={eyebrow ?? title}
          itemName={itemName}
          announce={(m) => `${m.name}, ${m.role}`}
          dots
          loop={false}
          renderCard={(m, i) => (
            <MeetCard
              image={m.image}
              priority={i === 0 || i === 1 || i === people.length - 1}
              name={m.name}
              role={m.role}
              logo={m.logo}
              company={company}
            />
          )}
        />
      </Container>

      {/* Tablet and up: the row, same card left-aligned. */}
      <HScrollerTrack trackRef={ref} label={eyebrow ?? title}>
        {people.map((m, i) => (
          <li key={m.name}>
            <MeetCard
              image={m.image}
              name={m.name}
              role={m.role}
              logo={m.logo}
              company={company}
              align="start"
              priority={i < 5}
            />
          </li>
        ))}
      </HScrollerTrack>
      <div className="hidden sm:block">
        <ScrollDots scroller={ref} count={people.length} itemName={itemName} onSelect={goTo} fill="solid" />
      </div>
      {after}
    </Section>
  );
}
