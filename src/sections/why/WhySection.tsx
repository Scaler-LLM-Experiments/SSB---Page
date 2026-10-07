import type { CSSProperties, ReactElement } from 'react';
import { Container, Heading, Icon, Section, Text, cn } from '@kishanscaler/ssx-ui';
import { Hammer, RocketLaunch, TrendUp } from '@phosphor-icons/react/ssr';

import type { WhyContent, WhyIcon, WhyPillar, WhyRoles } from './types';
import { WhyBreaker } from './WhyBreaker';
import { WhyMotion } from './WhyMotion';
import './why.css';

/**
 * Why SSB (deck slide 4): the case for a new kind of MBA. It opens with the
 * breaker (WhyBreaker): Nikhil Kamath's remark, the clip of it, and the two
 * figures that say he isn't alone. Then the section answers it.
 *
 *   The turn: "He's right about the old MBA. Ours prepares you for roles
 *   like" (answering the breaker; the deck had "Nobody is preparing you…"),
 *   large, its last words turning over through the four roles, in green.
 *   The answer: three chapters (Build, Ship, Grow) that stack as the page
 *   scrolls, as the AI journey's cards do: each card holds under the nav
 *   while the next slides up over it, the ones beneath shrinking back. Each
 *   is its icon, word and line, beside one story that proves it (a Shark
 *   Tank judge's offer, a student's AI product, the founding cohort's roles)
 *   in white over its photo, blurred progressively under the words.
 *
 * The deck's title ("MBA is not dead…") and the mock's description were cut
 * (the team's call, 2026-10-06): the breaker makes that argument. All motion
 * is in WhyMotion and WhyBreaker; without it the cards still stack (CSS
 * sticky) and the line shows its first role.
 */
export function WhySection({
  quote,
  figures,
  roles,
  pillars,
  answer = true,
}: WhyContent & {
  /** false: the breaker only, without the turn and the three chapters under it (the home page, 2026-10-06). */
  answer?: boolean;
}) {
  return (
    <>
      {/* The breaker: the remark that started the argument, before the section answers it. */}
      <WhyBreaker quote={quote} figures={figures} />
      {answer ? (
        <Section density="roomy" aria-labelledby="why-roles" className="bg-surface-subtle">
          <WhyMotion>
            <Container>
              <Roles roles={roles} />

              <ol className="why-chapters">
                {pillars.map((pillar, i) => (
                  <li
                    key={pillar.title}
                    data-why-chapter
                    className="why-chapter"
                    style={{ '--i': i } as CSSProperties}
                  >
                    <Chapter pillar={pillar} />
                  </li>
                ))}
              </ol>
            </Container>
          </WhyMotion>
        </Section>
      ) : null}
    </>
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
      <h2 id="why-roles" className="type-display text-content">
        {roles.setup ? (
          <>
            <Setup text={roles.setup} struck={roles.struck} />
            <br />
          </>
        ) : null}
        <span>{roles.lead} </span>
        <span className="sr-only">{roles.roles.join(', ')}.</span>
        <span aria-hidden className="why-roll">
          {roles.roles.map((role) => (
            <span key={role} data-role className="why-role">
              {role}
            </span>
          ))}
        </span>
      </h2>
    </div>
  );
}

/**
 * The setup line, its struck words (e.g. "old MBA") in italic with a line
 * drawn through them: struck in the markup, so no-JS and reduced motion show
 * it struck; WhyMotion draws the line as the line arrives.
 */
function Setup({ text, struck }: { text: string; struck?: string }) {
  const at = struck ? text.indexOf(struck) : -1;
  if (!struck || at < 0) return <span>{text}</span>;
  return (
    <span>
      {text.slice(0, at)}
      <s className="why-strike">
        <em>{struck}</em>
        {/* a straight line through the words (the squiggle was tried, 2026-10-07); pathLength 1 so it draws by dashoffset */}
        <svg aria-hidden className="why-strike-line" viewBox="0 0 100 14" preserveAspectRatio="none">
          <path data-why-strike pathLength={1} d="M0 7H100" />
        </svg>
      </s>
      {text.slice(at + struck.length)}
    </span>
  );
}

const ICONS: Record<WhyIcon, ReactElement> = {
  hammer: <Hammer weight="light" />,
  rocket: <RocketLaunch weight="light" />,
  'trend-up': <TrendUp weight="light" />,
};

/** The sharp photo, then two blurred copies (`why-story-blur-*`), softly then deeply toward the words. */
const PHOTO_LAYERS = ['', 'soft', 'deep'] as const;

/**
 * One chapter: its icon, word and line; beside them, the story that proves it,
 * its words at the foot of its photo. The photo blurs progressively under them
 * (as the Placements showcase's cards do): two blurred copies, each revealed by
 * its own gradient, under a dark scrim, so the words read in white.
 */
function Chapter({ pillar }: { pillar: WhyPillar }) {
  const { story } = pillar;
  return (
    <article data-why-card className="why-card">
      <div className="why-card-copy">
        {/* 40px: between the scale's 2xl (48, the team: a touch big) and xl (32) */}
        <Icon size="2xl" className="size-10 min-w-10 text-content">
          {ICONS[pillar.icon]}
        </Icon>
        <div>
          <Heading as="h3" size="display">
            {pillar.title}
          </Heading>
          <Text size="lg" tone="secondary" className="mt-3">
            {pillar.description}
          </Text>
        </div>
      </div>
      <figure className="why-story">
        <div className="why-story-media">
          {PHOTO_LAYERS.map((layer) => (
            // eslint-disable-next-line @next/next/no-img-element -- fills its box, so its size can't shift layout
            <img
              key={layer}
              src={story.imageUrl}
              srcSet={
                story.imageUrlSmall ? `${story.imageUrlSmall} 800w, ${story.imageUrl} 1400w` : undefined
              }
              // the photo is 7/12 of the page's content box (1232px at most) on desktop, full width below
              sizes="(min-width: 1056px) 720px, 100vw"
              alt={layer ? '' : story.imageAlt}
              aria-hidden={layer ? true : undefined}
              loading="lazy"
              decoding="async"
              className={cn('why-story-photo', layer && `why-story-blur why-story-blur-${layer}`)}
              style={story.imagePosition ? { objectPosition: story.imagePosition } : undefined}
            />
          ))}
          <span aria-hidden className="why-story-scrim" />
        </div>
        <span className="why-story-tag type-label">{story.tag}</span>
        <figcaption className="why-story-copy">
          <p className="type-label text-on-image-ink-secondary">{story.label}</p>
          <Heading as="p" size="2" className="mt-2 font-medium text-on-image-ink">
            {story.headline}
          </Heading>
        </figcaption>
      </figure>
    </article>
  );
}
