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
import { AREAS, useLabMotion } from '@/sections/innovation-lab/InnovationLabSection';
import { StoryCard } from '@/sections/shared/cards';
import { RowSection } from '@/sections/shared/RowSection';
import { SessionCard } from './SessionCard';
import { Accent } from '@/sections/shared/Accent';
import { VentureCard } from './VentureCard';
import './community.css';

/*
 * The deck's remaining sections, laid out with placeholders for their photos and
 * videos (MediaSlot), copy from src/content/community.ts. Swap an asset in by
 * setting its `photo` / `media` there.
 */

/**
 * Deck p5: student founders. No eyebrow, title or line (2026-10-07, the team's brief): a turn
 * carries on from the breaker before it, as Why SSB's does into its chapters, at the display size
 * in ink (the setup was grey, the team: black); then a row of cards, one per company.
 */
export function BeyondPlacementsSection() {
  const c = beyondPlacements;
  return (
    <RowSection
      id="beyond"
      title="Companies built by SSB students"
      heading={
        <Heading as="h2" size="display" id="beyond-title" data-enter="headline" className="bp-turn">
          <span className="block">{c.turn.setup}</span>
          <span className="block">
            <Accent text={c.turn.lead} word={c.turn.accent} />
          </span>
        </Heading>
      }
      itemName="company"
      cardWidth="38rem"
    >
      {c.ventures.map((v) => (
        <VentureCard key={v.company} {...v} />
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
/** Instagram's glyph in its own gradient (yellow through orange and magenta to purple), as the
    brand shows it; the paths are Simple Icons' (CC0). */
function InstagramGlyph() {
  const id = React.useId();
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="cm-ig">
      <defs>
        <radialGradient id={id} cx="0.25" cy="1.05" r="1.25">
          <stop offset="0" stopColor="#ffd776" />
          <stop offset="0.25" stopColor="#f3a554" />
          <stop offset="0.5" stopColor="#f15245" />
          <stop offset="0.75" stopColor="#d92e7f" />
          <stop offset="1" stopColor="#7638fa" />
        </radialGradient>
      </defs>
      <path
        fill={`url(#${id})`}
        d="M7.03.084c-1.277.06-2.149.264-2.911.563-.789.308-1.458.72-2.123 1.388-.665.668-1.075 1.337-1.38 2.127-.295.764-.496 1.637-.552 2.914C.008 8.353-.005 8.764.002 12.023c.006 3.258.02 3.667.082 4.947.061 1.277.264 2.148.564 2.911.308.789.72 1.457 1.388 2.123.668.665 1.336 1.074 2.128 1.38.763.295 1.636.496 2.914.552 1.277.056 1.688.069 4.946.063 3.258-.006 3.668-.021 4.948-.081 1.28-.061 2.147-.266 2.91-.564.789-.308 1.458-.72 2.123-1.388.665-.668 1.074-1.338 1.38-2.128.295-.763.496-1.636.551-2.913.056-1.28.07-1.69.063-4.948-.006-3.258-.021-3.667-.082-4.946-.06-1.28-.264-2.149-.563-2.912-.308-.789-.72-1.457-1.388-2.123C21.298 1.33 20.628.921 19.838.617 19.074.321 18.202.12 16.924.065 15.647.009 15.236-.005 11.977.001 8.718.008 8.31.022 7.03.084m.14 21.693c-1.17-.051-1.805-.245-2.229-.408-.56-.216-.96-.477-1.382-.895-.422-.418-.681-.819-.9-1.378-.164-.423-.362-1.058-.417-2.228-.06-1.265-.072-1.644-.079-4.848-.007-3.204.005-3.583.061-4.848.05-1.169.245-1.805.408-2.228.216-.561.476-.96.895-1.382.419-.421.818-.681 1.378-.9.423-.165 1.058-.361 2.227-.417 1.266-.06 1.645-.072 4.848-.079 3.203-.007 3.584.005 4.85.061 1.169.051 1.805.244 2.227.408.561.216.96.475 1.382.895.422.419.682.818.9 1.379.166.421.362 1.056.417 2.226.06 1.266.074 1.645.08 4.848.006 3.203-.006 3.584-.061 4.848-.051 1.17-.245 1.806-.408 2.23-.216.56-.476.96-.895 1.381-.419.422-.818.681-1.378.9-.423.165-1.058.362-2.226.417-1.266.06-1.645.072-4.85.079-3.204.007-3.582-.006-4.848-.061M16.953 5.586a1.44 1.44 0 1 0 1.437-1.442 1.44 1.44 0 0 0-1.437 1.442M5.839 12.012a6.162 6.162 0 1 0 12.323-.024 6.162 6.162 0 0 0-12.323.024M8 12.008a4 4 0 1 1 4.008 3.992A4 4 0 0 1 8 12.008"
      />
    </svg>
  );
}

/** A student club in the Innovation Lab startups' card (VentureCard's markup and styles): its photo
    in the square at the left with its field on a glass chip, its name, its line at the foot. No
    founders row: the deck names none. */
function ClubCard({ club }: { club: (typeof campusLife.clubs)[number] }) {
  return (
    <article className="vc">
      <div className="vc-media">
        <div className="vc-layers" data-part="photo">
          {/* eslint-disable-next-line @next/next/no-img-element -- fills its box */}
          <img
            className="vc-photo"
            src={club.media}
            alt={club.alt}
            sizes="(min-width: 672px) 256px, 90vw"
            loading="lazy"
            decoding="async"
            style={{ objectPosition: club.position }}
          />
        </div>
        <span className="vc-tag type-label">{club.tag}</span>
      </div>
      <div className="vc-body">
        <div className="vc-head">
          <div className="vc-title">
            <Heading as="h3" size="2" data-part="title">
              {club.name}
            </Heading>
          </div>
        </div>
        <Text size="sm" tone="secondary" className="vc-text" data-part="description">
          {club.text}
        </Text>
      </div>
    </article>
  );
}

export function CampusLifeSection() {
  const ref = React.useRef<HTMLElement>(null);
  // The Innovation Lab's moment (the team's ask, 2026-10-07): on desktop the cohort arrives
  // full-bleed and pulls back into the middle of a mosaic of the campus; elsewhere the tiles wipe
  // open. The follow buttons float on the cohort in glass, coming up with the heading.
  useLabMotion(ref);
  const c = campusLife;
  return (
    <>
      <Section ref={ref} density="roomy" aria-labelledby="campus-title" className="lab cm">
        <div data-lab-track className="lab-track">
          <div data-lab-stage className="lab-stage">
            <Container className="lab-frame">
              <div data-lab-head className="lab-head">
                <div className="lab-copy flex flex-col gap-3">
                  <Heading as="p" size="eyebrow" className="text-content-brand">
                    {c.eyebrow}
                  </Heading>
                  <Heading as="h2" size="display" id="campus-title">
                    {c.title}
                  </Heading>
                  <Text size="lg" tone="secondary">
                    {c.sub}
                  </Text>
                </div>
              </div>

              <div data-lab-mosaic className="lab-mosaic">
                <div data-lab-slot className="lab-slot cm-slot">
                  <figure data-lab-hero className="lab-tile lab-hero">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={c.feature.media}
                      alt={c.feature.alt}
                      width={1600}
                      height={1067}
                      loading="lazy"
                      decoding="async"
                      style={{ objectPosition: c.feature.position }}
                    />
                  </figure>
                  {/* follow campus life: the two accounts as glass buttons on the photo */}
                  <div data-lab-overlay className="cm-social" role="group" aria-label="Follow campus life on Instagram">
                    {c.follow.map((f) => (
                      <a key={f.handle} className="cm-glass" href={f.href} target="_blank" rel="noopener noreferrer">
                        <InstagramGlyph />
                        <span>{f.handle}</span>
                        <span className="cm-glass__note">{f.note}</span>
                      </a>
                    ))}
                  </div>
                </div>
                {c.photos.map((photo, i) => (
                  <figure key={photo.media} data-lab-tile data-area={AREAS[i]} className="lab-tile">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={photo.media}
                      alt={photo.alt}
                      width={1600}
                      height={1067}
                      loading="lazy"
                      decoding="async"
                      style={{ objectPosition: photo.position }}
                    />
                  </figure>
                ))}
              </div>
            </Container>
          </div>
        </div>
      </Section>

      {/* The student clubs, as the Innovation Lab's startups: a subheading, then the row (the lab's
          CSS runs it on from the section above, `section.lab + section`). */}
      <RowSection
        id="clubs"
        title={c.clubsTurn.text}
        heading={
          // a subheading within campus life, as the lab's startups (h3, a step smaller)
          <Heading
            as="h3"
            size="1"
            id="clubs-title"
            data-enter="headline"
            className="lab-sub max-w-(--size-measure-max) [text-wrap:balance]"
          >
            <Accent text={c.clubsTurn.text} word={c.clubsTurn.accent} />
          </Heading>
        }
        itemName="club"
        cardWidth="38rem"
      >
        {c.clubs.map((club) => (
          <ClubCard key={club.name} club={club} />
        ))}
      </RowSection>
    </>
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
