'use client';

import * as React from 'react';
import { StarIcon } from '@phosphor-icons/react';
import { Container, Heading, Section, Text } from '@kishanscaler/ssx-ui';

import { creators, domesticImmersions, immersions, type Creator, type DomesticImmersion, type Immersion } from '@/content/immersions';
import { useSectionEntrance } from '@/sections/faculty/useSectionEntrance';
import { ScrollDots } from '@/sections/shared/ScrollDots';
import './immersions.css';

// (The two feature cards, `Feature`, were replaced by the trips and the track on 2026-10-27; in git history.)

/**
 * A domestic immersion (2026-10-27, the user's ask): the page's card (a light card, a hairline edge,
 * the photo across its head with no type over it), then the company's logo in place of a heading,
 * and its line. (Masters' Union's take, the place large over the photo, came off the same day.)
 */
function TripCard({ item }: { item: DomesticImmersion }) {
  return (
    <article className="imm-trip">
      <div className="imm-trip__media" data-part="photo">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="imm-trip__photo"
          data-left-half={item.image.leftHalf || undefined}
          src={item.image.src}
          alt=""
          width={item.image.width}
          height={item.image.height}
          loading="lazy"
          decoding="async"
          style={item.image.position ? { objectPosition: item.image.position } : undefined}
        />
      </div>
      <div className="imm-trip__body">
        {/* the company's logo over a rule; its industry as the wordmark until it is named (PLACEHOLDER) */}
        <h4 className="imm-trip__name" data-part="title">
          {item.logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img className="imm-trip__logo" src={item.logo.src} alt={item.logo.alt} style={{ height: item.logo.height ?? 28 }} loading="lazy" decoding="async" />
          ) : (
            <span className="imm-trip__mark">{item.name}</span>
          )}
        </h4>
        <p className="imm-trip__text" data-part="description">
          {item.description}
        </p>
      </div>
    </article>
  );
}

/** A creator: badge, name and niche over the top; achievements across the foot. */
function CreatorCard({ creator: c }: { creator: Creator }) {
  return (
    <article className="creator-card">
      <img
        className="creator-card__photo"
        src={`/immersions/${c.photo}.webp`}
        alt=""
        width={702}
        height={750}
        loading="lazy"
        data-part="photo"
      />
      <div className="creator-card__head" data-part="title">
        <span className="creator-card__badge">
          <StarIcon weight="fill" aria-hidden="true" />
          Creator
        </span>
        <h4 className="creator-card__name">{c.name}</h4>
        <p className="creator-card__niche">{c.niche}</p>
      </div>
      <div className="creator-card__foot" data-part="description">
        <p className="creator-card__rule">
          <span>Achievements</span>
        </p>
        <dl className="creator-card__stats">
          {c.stats.map((s) => (
            <div key={s.label}>
              <dt>{s.label}</dt>
              <dd>{s.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </article>
  );
}

export function ImmersionsSection() {
  const sectionRef = React.useRef<HTMLElement>(null);
  const rowRef = React.useRef<HTMLUListElement>(null);
  // phones: the immersions as a swipe row, the next card peeking in (2026-10-23, the team's ask)
  const tripRef = React.useRef<HTMLUListElement>(null);
  const [domestic, creatorTrack] = immersions;
  // Same entrance as Faculty: the header, then the trips, the track, then the creators.
  useSectionEntrance(sectionRef, { decks: ['.imm-trip', '.creator-row > li > article'] });

  return (
    <Section ref={sectionRef} density="roomy" aria-labelledby="immersions-title" className="overflow-x-clip">
      <Container>
        <div data-enter="header" className="mb-10 flex max-w-(--size-measure-max) flex-col gap-3 sm:mb-12">
          <Heading as="p" size="eyebrow" className="text-content-brand" data-enter="eyebrow">
            Immersions
          </Heading>
          <Heading as="h2" size="display" id="immersions-title" data-enter="headline">
            Learning beyond the classroom. <span className="h-tail">Trips, tracks and immersions.</span>
          </Heading>
          <Text size="lg" tone="secondary" data-enter="sub">
            On factory floors, in quick commerce and at Reliance&apos;s creative agency.
          </Text>
        </div>

        {/* (2026-10-27, the user's ask) the three domestic immersions, a card each, after Masters'
            Union's; then the creator-preneur track as its own feature over the creators. The two
            feature cards side by side before (the domestic one's photo is now the quick-commerce card's). */}
        <div className="imm-sub">
          <Heading as="h3" size="2" className="imm-sub__title">
            {domestic.title}
          </Heading>
          <Text size="md" tone="secondary">
            {domestic.description}
          </Text>
        </div>
        <ul ref={tripRef} className="imm-trips">
          {domesticImmersions.map((item) => (
            <li key={item.name}>
              <TripCard item={item} />
            </li>
          ))}
        </ul>
        <div className="imm-trips-dots">
          <ScrollDots scroller={tripRef} count={domesticImmersions.length} itemName="immersion" fill="solid" autoplay={false} />
        </div>


        {/* the creator-preneur track (2026-10-27, the user's ask): its heading and line only, over the
            creators' cards (its photo card came off; "Student success stories under our creator lab",
            the eyebrow here before, folded into the line) */}
        <div className="imm-sub imm-sub--track">
          <Heading as="h3" size="2" className="imm-sub__title">
            {creatorTrack.title}
          </Heading>
          <Text size="md" tone="secondary">
            {creatorTrack.description} Student success stories from our creator lab:
          </Text>
        </div>
      </Container>

      {/* Phones: a row to swipe; tablet and up: three across. */}
      <Container className="creator-wrap">
        <ul ref={rowRef} className="creator-row" aria-label="Creator lab success stories">
          {creators.map((c) => (
            <li key={c.name}>
              <CreatorCard creator={c} />
            </li>
          ))}
        </ul>
      </Container>
      <div className="creator-dots">
        <ScrollDots scroller={rowRef} count={creators.length} itemName="creator" fill="solid" />
      </div>
    </Section>
  );
}
