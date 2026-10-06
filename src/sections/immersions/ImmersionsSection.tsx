'use client';

import * as React from 'react';
import { StarIcon } from '@phosphor-icons/react';
import { Container, Heading, Section, Text } from '@kishanscaler/ssx-ui';

import { creators, immersions, type Creator, type Immersion } from '@/content/immersions';
import { useSectionEntrance } from '@/sections/faculty/useSectionEntrance';
import { ScrollDots } from '@/sections/shared/ScrollDots';
import './immersions.css';

/**
 * A feature, built as the Learn-by-doing video cards: a light card, the scene edge to edge across
 * its head, then the title and its line. (The image files carry a blur baked into their right
 * half, made for text to sit on: the frame shows only the clear left part.)
 */
function Feature({ item }: { item: Immersion }) {
  return (
    <article className="imm-feature">
      {/* a green ground where the real visit photo will go (feedback, 2026-10-06: the generated
          scenes read as fake; `item.image` is kept in the content for when real photos arrive) */}
      <div className="imm-feature__media" data-part="photo" aria-hidden="true" />
      <div className="imm-feature__body">
        <Heading as="h3" size="1" className="imm-feature__title" data-part="title">
          {item.title}
        </Heading>
        <p className="imm-feature__text" data-part="description">
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
  // Same entrance as Faculty: the header, then the two features, then the creators.
  useSectionEntrance(sectionRef, { decks: ['.imm-feature', '.creator-row > li > article'] });

  return (
    <Section ref={sectionRef} density="roomy" aria-labelledby="immersions-title" className="overflow-x-clip">
      <Container>
        <div data-enter="header" className="mb-10 flex max-w-(--size-measure-max) flex-col gap-3 sm:mb-12">
          <Heading as="p" size="eyebrow" className="text-content-brand" data-enter="eyebrow">
            Immersions
          </Heading>
          <Heading as="h2" size="display" id="immersions-title" data-enter="headline">
            Immersions Beyond the Classroom
          </Heading>
          <Text size="lg" tone="secondary" data-enter="sub">
            Learn where the work happens: on factory floors, inside quick-commerce operations, and at
            Reliance&apos;s creative agency.
          </Text>
        </div>

        <ul className="imm-features">
          {immersions.map((item) => (
            <li key={item.title}>
              <Feature item={item} />
            </li>
          ))}
        </ul>

        <Heading as="h3" size="3" className="mt-16 mb-6 text-center sm:mt-20" data-enter="block">
          Student success stories under our creator lab
        </Heading>
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
