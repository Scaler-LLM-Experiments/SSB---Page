import type { CSSProperties } from 'react';
import { Container, Heading, Section, Text } from '@kishanscaler/ssx-ui';

import type { WhyContent, WhyPillar, WhyRoles } from './types';
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
 *   The answer: three chapters (01 Build, 02 Ship, 03 Grow) that stack as the
 *   page scrolls, as the AI journey's cards do: each card holds under the nav
 *   while the next slides up over it, the ones beneath shrinking back.
 *
 * The deck's title ("MBA is not dead…") and the mock's description were cut
 * (the team's call, 2026-10-06): the breaker makes that argument. All motion
 * is in WhyMotion and WhyBreaker; without it the cards still stack (CSS
 * sticky) and the line shows its first role.
 */
export function WhySection({ quote, figures, roles, pillars }: WhyContent) {
  return (
    <>
      {/* The breaker: the remark that started the argument, before the section answers it. */}
      <WhyBreaker quote={quote} figures={figures} />
      <Section density="roomy" aria-labelledby="why-roles" className="bg-surface-subtle">
        <WhyMotion>
          <Container>
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
            <span>{roles.setup}</span>
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
    </article>
  );
}
