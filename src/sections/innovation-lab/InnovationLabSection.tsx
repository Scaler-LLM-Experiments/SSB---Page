'use client';

import * as React from 'react';
import { Card, CardBody, Container, Heading, Section, Text } from '@kishanscaler/ssx-ui';
import { CountUp } from '@kishanscaler/ssx-ui/motion';

import { labStartups, labStartupsIntro, labStats } from '@/content/innovation-lab';
import './innovation-lab.css';
import { useSectionEntrance } from '@/sections/faculty/useSectionEntrance';
import { ScrollDots } from '@/sections/shared/ScrollDots';
import { StartupCard } from './StartupCard';

export function InnovationLabSection() {
  const sectionRef = React.useRef<HTMLElement>(null);
  const rowRef = React.useRef<HTMLUListElement>(null);
  // Same entrance as Faculty: the header, then three decks wiped open in turn
  // as each comes up the screen — the stat cards, the startups panel, the startup cards.
  useSectionEntrance(sectionRef, {
    decks: ['.sil-stats > li', '.sil-panel', '.sil-row > li > article'],
  });

  return (
    <Section ref={sectionRef} density="roomy" aria-labelledby="sil-title">
      <Container>
        <div className="grid gap-10 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-16">
          {/* Left: the pitch. Stays in view while the right column scrolls. */}
          <div data-enter="header" className="flex flex-col gap-3 self-start md:sticky md:top-24">
            <Heading as="p" size="eyebrow" className="text-content-brand" data-enter="eyebrow">
              Scaler Innovation Lab
            </Heading>
            <Heading as="h2" size="display" id="sil-title" data-enter="headline">
              Join the Heart of the Startup Ecosystem
            </Heading>
            <Text size="lg" tone="secondary" data-enter="sub">
              Network with founders, land internships, and work on real startup projects, 10 steps from your
              classroom.
            </Text>
          </div>

          {/* Right: the numbers, then the startups. */}
          <div className="flex min-w-0 flex-col gap-4">
            <ul className="sil-stats grid list-none grid-cols-2 gap-4 p-0">
              {labStats.map((s) => (
                <Card as="li" key={s.label}>
                  <CardBody className="gap-1 p-5 sm:p-6">
                    <CountUp
                      data-part="title"
                      value={s.value}
                      format={s.format}
                      trigger="in-view"
                      className="type-display block font-semibold text-content-brand"
                    />
                    <Text size="sm" tone="secondary" data-part="description">
                      {s.label}
                    </Text>
                  </CardBody>
                </Card>
              ))}
            </ul>

            {/* The startups, framed like the stat cards above. */}
            <Card as="div" role="group" aria-labelledby="sil-startups-title" className="sil-panel min-w-0">
              <CardBody className="grid-cols-1 gap-6 p-4 sm:p-6">
                {/* Led like a stat card: the figure, then its line at the labels' size. */}
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between gap-4">
                    <CountUp
                      data-part="title"
                      value={labStartupsIntro.value}
                      format={labStartupsIntro.format}
                      trigger="in-view"
                      className="type-display block font-semibold text-content-brand"
                    />
                  </div>
                  <Text size="sm" tone="secondary" id="sil-startups-title" data-part="description">
                    {labStartupsIntro.subtext}
                  </Text>
                </div>

                {/* The row: the next card peeks in, so it reads as scrollable. */}
                <div className="min-w-0">
                  <ul ref={rowRef} className="sil-row" aria-label="Startups incubated in the Innovation Lab">
                    {labStartups.map((s) => (
                      <li key={s.name}>
                        <StartupCard startup={s} />
                      </li>
                    ))}
                  </ul>
                  <ScrollDots scroller={rowRef} count={labStartups.length} itemName="startup" fill="solid" />
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </Container>
    </Section>
  );
}
