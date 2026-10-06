'use client';

import * as React from 'react';
import { Container, Heading, Section, Text } from '@kishanscaler/ssx-ui';

import {
  beyondPlacements,
  campusLife,
  foundingTeamSection,
  inTheNews,
  investors,
  mentorsSection,
  sharkTank,
  superMentors,
} from '@/content/community';
import { PeopleShowcase, type ShowcasePerson } from '@/sections/faculty/PeopleShowcase';
import { useSectionEntrance } from '@/sections/faculty/useSectionEntrance';
import { StoryCard } from '@/sections/shared/cards';
import { MediaSlot } from '@/sections/shared/MediaSlot';
import { RowSection } from '@/sections/shared/RowSection';
import { SessionCard } from './SessionCard';
import './community.css';

/*
 * The deck's remaining sections, laid out with placeholders for their photos and
 * videos (MediaSlot), copy from src/content/community.ts. Swap an asset in by
 * setting its `photo` / `media` there.
 */

/** Deck p5: student founders. */
export function BeyondPlacementsSection() {
  const c = beyondPlacements;
  return (
    <RowSection
      id="beyond"
      eyebrow={c.eyebrow}
      title={c.title}
      sub={c.sub}
      itemName="story"
      cardWidth="22rem"
    >
      {c.stories.map((s) => (
        <StoryCard key={s.title} {...s} />
      ))}
    </RowSection>
  );
}

/** Deck p6: investors and founders, as Faculty's cards. */
export function InvestorsSection() {
  const c = investors;
  return (
    <PeopleShowcase
      id="investors"
      eyebrow={c.eyebrow}
      title={c.title}
      sub={c.sub}
      people={c.people}
      itemName="person"
    />
  );
}

/** Deck p7: the Shark Tank judge and others on campus, as a carousel of video cards. */
export function SharkTankSection() {
  const c = sharkTank;
  return (
    <RowSection id="shark" eyebrow={c.eyebrow} title={c.title} sub={c.sub} itemName="story" cardWidth="30rem">
      {c.stories.map((s) => (
        <StoryCard key={s.title} {...s} ratio="16 / 9" video clamp={2} />
      ))}
    </RowSection>
  );
}

/** Deck p13: mentors, as Faculty's cards (those with a photo). */
export function MentorsSection() {
  const c = mentorsSection;
  const people = c.people.filter((p): p is ShowcasePerson => Boolean(p.image));
  return (
    <PeopleShowcase
      id="mentors"
      eyebrow={c.eyebrow}
      title={c.title}
      sub={c.sub}
      people={people}
      itemName="mentor"
    />
  );
}

/** Deck p13: SSB's founding team, as Faculty's cards. */
export function FoundingTeamSection() {
  const c = foundingTeamSection;
  return (
    <PeopleShowcase
      id="founding"
      eyebrow={c.eyebrow}
      title={c.title}
      sub={c.sub}
      people={c.people}
      itemName="person"
    />
  );
}

/** Deck p15: Super Mentor Sessions: video cards like the Shark Tank's, with the company logo (the video plays in the card). */
export function SuperMentorsSection() {
  const c = superMentors;
  return (
    <RowSection
      id="sessions"
      eyebrow={c.eyebrow}
      title={c.title}
      sub={c.sub}
      itemName="session"
      cardWidth="24rem"
    >
      {c.sessions.map((s) => (
        <SessionCard key={s.videoId} {...s} />
      ))}
    </RowSection>
  );
}

/** Deck p24: campus life. Copy and clubs at the left, a photo collage at the right. */
export function CampusLifeSection() {
  const ref = React.useRef<HTMLElement>(null);
  useSectionEntrance(ref, { decks: ['.cm-photos > *'] });
  const c = campusLife;
  return (
    <Section ref={ref} density="roomy" aria-labelledby="campus-title">
      <Container>
        <div className="grid gap-10 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-16">
          <div data-enter="header" className="flex flex-col gap-6 self-start md:sticky md:top-24">
            <div className="flex flex-col gap-3">
              <Heading as="p" size="eyebrow" className="text-content-brand" data-enter="eyebrow">
                {c.eyebrow}
              </Heading>
              <Heading as="h2" size="display" id="campus-title" data-enter="headline">
                {c.title}
              </Heading>
              <Text size="lg" tone="secondary" data-enter="sub">
                {c.sub}
              </Text>
            </div>
            <div className="cm-clubs" data-enter="sub">
              <Heading as="h3" size="eyebrow" className="text-content-secondary">
                Student clubs
              </Heading>
              {c.clubs.map((club) => (
                <div key={club.name} className="cm-club">
                  <b>{club.name}</b>
                  <Text size="sm" tone="secondary">
                    {club.text}
                  </Text>
                </div>
              ))}
            </div>
            <div className="cm-follow" data-enter="controls">
              <Text size="sm" tone="secondary">
                Follow campus life:
              </Text>
              {c.follow.map((f) => (
                <a key={f.handle} href={f.href} target="_blank" rel="noopener noreferrer">
                  {f.handle} <span>({f.note})</span>
                </a>
              ))}
            </div>
          </div>
          <div className="cm-photos">
            {c.photos.map((p) => (
              <MediaSlot key={p.mediaLabel} src={p.media} label={p.mediaLabel} ratio="auto" />
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}

/** Deck p25: in the news (article slots until the coverage is chosen). */
export function InTheNewsSection() {
  const c = inTheNews;
  return (
    <RowSection
      id="news"
      eyebrow={c.eyebrow}
      title={c.title}
      sub={c.sub}
      itemName="article"
      cardWidth="20rem"
    >
      {c.articles.map((a, i) => (
        <StoryCard key={i} {...a} ratio="16 / 9" />
      ))}
    </RowSection>
  );
}
