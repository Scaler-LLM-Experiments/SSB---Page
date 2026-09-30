'use client';

import * as React from 'react';
import { Container, Heading, Section, Text } from '@kishanscaler/ssx-ui';

import { companyLogos } from '@/content/company-logos';
import { faculty } from '@/content/people';
import { HScrollerControls, HScrollerTrack, useHScroller } from './HScroller';
import { StoryCard } from './StoryCard';
import { useSectionEntrance } from './useSectionEntrance';

const members = faculty.filter((m) => m.photo);

export function FacultySection() {
  const { ref, page } = useHScroller();
  const sectionRef = React.useRef<HTMLElement>(null);
  useSectionEntrance(sectionRef);

  return (
    <Section ref={sectionRef} density="roomy" aria-labelledby="faculty-title" className="overflow-x-clip">
      <Container>
        <div data-enter="header" className="mb-10 flex flex-col gap-6 sm:mb-12 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex max-w-(--size-measure-max) flex-col gap-3">
            <Heading as="p" size="eyebrow" className="text-content-brand" data-enter="eyebrow">
              Faculty
            </Heading>
            <Heading as="h2" size="display" id="faculty-title" data-enter="headline">
              Learn From Your Future Recruiters, Not Just Faculty.
            </Heading>
            <Text size="lg" tone="secondary" data-enter="sub">
              Operators and leaders from BCG, McKinsey, Razorpay, Zomato, PayPal, Flipkart and more teach at SSB.
            </Text>
          </div>
          <div data-enter="controls">
            <HScrollerControls label="faculty" page={page} />
          </div>
        </div>
      </Container>

      <HScrollerTrack trackRef={ref} label="Faculty">
        {/* The ticker loops through two copies; the second is visual only. */}
        {[false, true].map((copy) =>
          members.map((m) => (
            <li key={`${copy}-${m.name}`} data-copy={copy || undefined} aria-hidden={copy || undefined} inert={copy || undefined}>
              <StoryCard
                image={`/faculty/${m.photo}.png`}
                title={m.name}
                description={m.role}
                logo={companyLogos[m.companies[0]]}
              />
            </li>
          )),
        )}
      </HScrollerTrack>
    </Section>
  );
}
