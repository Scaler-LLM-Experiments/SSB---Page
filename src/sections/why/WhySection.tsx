import type { CSSProperties } from 'react';
import { Container, Heading, Section, Text } from '@kishanscaler/ssx-ui';
import { Play } from '@phosphor-icons/react/ssr';

import type { WhyContent, WhyFigure, WhyPillar, WhyQuote, WhyRoles } from './types';
import { WhyMotion } from './WhyMotion';
import './why.css';

/**
 * Why SSB (deck slide 4): the case for a new kind of MBA, told as an
 * argument in three beats under the faculty-style header (its title's last
 * phrase in the brand green).
 *
 *   The receipt: the remark that started it, set as a paused clip (the deck
 *   asks for a still from the video): Kamath's words as a caption on a dark
 *   frame, a playback bar running along its foot; beside it, the two figures
 *   that say he isn't alone.
 *   The turn: the deck's "Nobody is preparing you for emerging roles like",
 *   large, its last words turning over through the four roles, in green.
 *   The answer: three chapters (01 Build, 02 Ship, 03 Grow) that stack as the
 *   page scrolls: each card holds under the nav while the next slides up over
 *   it, the one beneath settling back.
 *
 * The team asked for something creative in place of their mock's two rows of
 * cards (2026-10-05). All motion is in WhyMotion; without it the cards still
 * stack (CSS sticky) and the line shows its first role.
 */
export function WhySection({
  eyebrow,
  title,
  titleHighlight,
  description,
  quote,
  figures,
  roles,
  pillars,
}: WhyContent) {
  return (
    <Section density="roomy" aria-labelledby="why-title" className="bg-surface-subtle">
      <WhyMotion>
        <Container>
          <div data-enter="header" className="mb-12 flex max-w-(--size-measure-max) flex-col gap-3 sm:mb-16">
            <Heading as="p" size="eyebrow" className="text-content-secondary" data-enter="eyebrow">
              {eyebrow}
            </Heading>
            <Heading as="h2" size="display" id="why-title" data-enter="headline">
              <Marked text={title} mark={titleHighlight} className="text-content-brand" />
            </Heading>
            <Text size="lg" tone="secondary" data-enter="sub">
              {description}
            </Text>
          </div>

          <div data-why-evidence className="why-evidence">
            <Clip quote={quote} />
            <div className="why-figures">
              {quote.coda ? <p className="type-h3 text-content">{quote.coda}</p> : null}
              {figures.map((figure) => (
                <Figure key={figure.label} figure={figure} />
              ))}
            </div>
          </div>

          <Roles roles={roles} />

          <ol className="why-chapters">
            {pillars.map((pillar, i) => (
              <li
                key={pillar.kicker}
                data-why-chapter
                className="why-chapter"
                style={{ '--i': i } as CSSProperties}
              >
                <Chapter pillar={pillar} index={i} />
              </li>
            ))}
          </ol>
        </Container>
      </WhyMotion>
    </Section>
  );
}

/** `text` with `mark`, where it appears in it, set apart by `className`. */
function Marked({ text, mark, className }: { text: string; mark?: string; className: string }) {
  const at = mark ? text.indexOf(mark) : -1;
  if (!mark || at < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, at)}
      <span className={className}>{mark}</span>
      {text.slice(at + mark.length)}
    </>
  );
}

/** The remark as a paused clip: a chip naming where it was said, the caption, who said it, a playback bar. */
function Clip({ quote }: { quote: WhyQuote }) {
  return (
    <figure data-why-clip className="why-clip">
      <p className="why-clip-chip type-label">
        <Play weight="fill" aria-hidden />
        {quote.source}
      </p>
      <div>
        <blockquote className="why-clip-caption">{quote.caption}</blockquote>
        <figcaption className="why-clip-who mt-4 type-body-sm">{quote.attribution}</figcaption>
      </div>
      <span aria-hidden className="why-clip-bar">
        <span data-clip-bar className="why-clip-played" />
      </span>
    </figure>
  );
}

function Figure({ figure }: { figure: WhyFigure }) {
  return (
    <div className="why-figure">
      {/* The figure slides up into its line as the band arrives (WhyMotion). */}
      <p className="why-slide type-billboard-sm text-content">
        <span data-slide>{figure.value}</span>
      </p>
      <div>
        <Heading as="h3" size="eyebrow" className="text-content-secondary">
          {figure.label}
        </Heading>
        <Text size="sm" tone="secondary" className="mt-2">
          {figure.description}
        </Text>
      </div>
    </div>
  );
}

/**
 * The turn: the lead, then a slot as wide as the longest role, every role
 * stacked in it and one showing (WhyMotion turns them over). Screen readers
 * get the whole list once.
 */
function Roles({ roles }: { roles: WhyRoles }) {
  return (
    <div data-why-roles className="why-roles">
      <p className="type-display text-content">
        <span>{roles.lead} </span>
        <span className="sr-only">{roles.roles.join(', ')}.</span>
        <span aria-hidden className="why-roll">
          {roles.roles.map((role) => (
            <span key={role} data-role className="why-role">
              {role}
            </span>
          ))}
        </span>
      </p>
    </div>
  );
}

/** One chapter: its number and word, the title and line, beside its photo. */
function Chapter({ pillar, index }: { pillar: WhyPillar; index: number }) {
  return (
    <article data-why-card className="why-card">
      <div className="why-card-copy">
        <p className="why-card-num" aria-hidden>
          {String(index + 1).padStart(2, '0')}
        </p>
        <div>
          <Heading as="p" size="eyebrow" className="text-content-secondary">
            {pillar.kicker}
          </Heading>
          <Heading as="h3" size="display" className="mt-3">
            {pillar.title}
          </Heading>
          <Text size="lg" tone="secondary" className="mt-3">
            {pillar.description}
          </Text>
        </div>
      </div>
      <div className="why-card-photo">
        {/* eslint-disable-next-line @next/next/no-img-element -- fills a box of its own proportions */}
        <img
          src={pillar.imageUrl}
          alt={pillar.imageAlt}
          width={742}
          height={428}
          loading="lazy"
          decoding="async"
        />
      </div>
      {/* The section's grey, faded in over the card as the next one covers it (WhyMotion). */}
      <span data-why-dim aria-hidden className="why-card-dim" />
    </article>
  );
}
