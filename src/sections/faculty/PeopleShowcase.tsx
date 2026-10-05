'use client';

import * as React from 'react';
import { Container, Heading, Section, Text } from '@kishanscaler/ssx-ui';

import { HScrollerControls, HScrollerTrack, useHScroller } from './HScroller';
import { CardStack } from '@/sections/shared/CardStack';
import { ScrollDots } from '@/sections/shared/ScrollDots';
import { MeetCard, type CardLogo } from './MeetCard';
import { useSectionEntrance } from './useSectionEntrance';

export type ShowcasePerson = {
  name: string;
  role: string;
  /** Photo URL (640x800 WebP). */
  image: string;
  logo?: CardLogo;
};

/**
 * The Faculty layout, for any group of people: a header (eyebrow, headline,
 * subtext, arrows), then a looping ticker row of MEET cards on tablet and up
 * and a swipeable card stack on phones, each with progress dots. Faculty and
 * the Scaler Impact Foundation use it.
 */
export function PeopleShowcase({
  id,
  eyebrow,
  title,
  sub,
  people,
  itemName,
}: {
  /** Prefix for the headline's id (`<id>-title`), which labels the section. */
  id: string;
  eyebrow: string;
  title: string;
  sub: string;
  people: ShowcasePerson[];
  /** What one card is, for the controls' labels ("faculty", "member"). */
  itemName: string;
}) {
  const { ref, page, goTo } = useHScroller();
  const sectionRef = React.useRef<HTMLElement>(null);
  useSectionEntrance(sectionRef);

  // The ticker needs more than a screen's width of cards beyond the first set
  // to wrap seamlessly; a short list (5 people) gets a third copy.
  const copies = people.length < 8 ? 3 : 2;

  return (
    <Section ref={sectionRef} density="roomy" aria-labelledby={`${id}-title`} className="overflow-x-clip">
      <Container>
        <div
          data-enter="header"
          className="mb-10 flex flex-col gap-6 sm:mb-12 sm:flex-row sm:items-end sm:justify-between"
        >
          <div className="flex max-w-(--size-measure-max) flex-col gap-3">
            <Heading as="p" size="eyebrow" className="text-content-brand" data-enter="eyebrow">
              {eyebrow}
            </Heading>
            <Heading as="h2" size="display" id={`${id}-title`} data-enter="headline">
              {title}
            </Heading>
            <Text size="lg" tone="secondary" data-enter="sub">
              {sub}
            </Text>
          </div>
          <div data-enter="controls" className="hidden sm:block">
            <HScrollerControls label={itemName} page={page} />
          </div>
        </div>
      </Container>

      {/* Phones: card stack, text centred on the card. */}
      <Container className="sm:hidden">
        <CardStack
          items={people}
          getKey={(m) => m.name}
          label={eyebrow}
          itemName={itemName}
          announce={(m) => `${m.name}, ${m.role}`}
          dots
          renderCard={(m, i) => (
            <MeetCard
              image={m.image}
              priority={i === 0 || i === 1 || i === people.length - 1}
              name={m.name}
              role={m.role}
              logo={m.logo}
            />
          )}
        />
      </Container>

      {/* Tablet and up: the looping ticker row, same card left-aligned. */}
      <HScrollerTrack trackRef={ref} label={eyebrow}>
        {/* The ticker loops through copies of the list; only the first is real. */}
        {Array.from({ length: copies }, (_, c) =>
          people.map((m, i) => {
            const copy = c > 0;
            return (
              <li
                key={`${c}-${m.name}`}
                data-copy={copy || undefined}
                aria-hidden={copy || undefined}
                inert={copy || undefined}
              >
                <MeetCard
                  image={m.image}
                  name={m.name}
                  role={m.role}
                  logo={m.logo}
                  align="start"
                  priority={!copy && i < 5}
                />
              </li>
            );
          }),
        )}
      </HScrollerTrack>
      <div className="hidden sm:block">
        <ScrollDots scroller={ref} count={people.length} itemName={itemName} onSelect={goTo} />
      </div>
    </Section>
  );
}
