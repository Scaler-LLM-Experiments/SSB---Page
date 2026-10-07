import * as React from 'react';
import { Button, Heading, Text, cn } from '@kishanscaler/ssx-ui';

import { MarkTicker } from '@/sections/shared/MarkTicker';
import { CtaIcon } from '../CtaIcon';
import { HeroTitle } from '../HeroTitle';
import type { HeroContent, HeroFact, HeroLeader } from '../types';
import './fold.css';

type Block = React.HTMLAttributes<HTMLDivElement>;

/** The programme's facts on one line, a dot after each but the last (so a wrapped line never starts with one). */
function FoldFacts({ facts }: { facts: HeroFact[] }) {
  return (
    <ul className="fold-facts">
      {facts.map((f) => (
        <li key={f.value}>
          <b>{f.value}</b>
          {f.caption ? <span> {f.caption}</span> : null}
        </li>
      ))}
    </ul>
  );
}

/**
 * The first fold's copy, laid out the same in both variants (the split card and
 * the cinematic V2): the eyebrow, a short, large title, the line, the actions
 * and the facts. Made for dark ground; each variant styles the actions for its
 * own (`fold-primary`, `fold-secondary`). Extra props (a `data-*` hook, a class)
 * go on its block.
 */
export function FoldCopy({
  hero,
  titleId,
  className,
  ...props
}: { hero: HeroContent; titleId?: string } & Block) {
  const { eyebrow, title, titleHighlight, description, primaryCta, secondaryCta, facts } = hero;
  return (
    <div className={cn('fold-copy', className)} {...props}>
      <Heading as="p" size="eyebrow" className="fold-eyebrow">
        {eyebrow}
      </Heading>
      <Heading as="h1" id={titleId} className="type-billboard-sm text-on-image-ink">
        <HeroTitle title={title} highlight={titleHighlight} />
      </Heading>
      {/* Each phrase kept whole; a line breaks only after a "·", never before one. */}
      <Text size="lg" className="fold-line">
        {description.split(' · ').map((part, i, all) => (
          <span key={part} className="fold-phrase">
            {part}
            {i < all.length - 1 ? ' ·' : ''}
          </span>
        ))}
      </Text>
      <div className="fold-actions">
        <Button asChild size="lg" className="fold-primary">
          <a href={primaryCta.href}>
            {primaryCta.label}
            <CtaIcon icon={primaryCta.icon} />
          </a>
        </Button>
        {secondaryCta ? (
          <Button asChild size="lg" variant="secondary" className="fold-secondary">
            <a href={secondaryCta.href}>
              {secondaryCta.label}
              <CtaIcon icon={secondaryCta.icon} />
            </a>
          </Button>
        ) : null}
      </div>
      {facts?.length ? <FoldFacts facts={facts} /> : null}
    </div>
  );
}

/**
 * "Built by 100+ industry leaders from" over the leaders running past, each a
 * colour mark with its name; beside the copy from `md` up.
 */
export function FoldLeaders({
  line,
  leaders,
  alumniLine,
  alumniFrom,
  className,
  ...props
}: { line?: string; leaders: HeroLeader[]; alumniLine?: string; alumniFrom?: { name: string; logo?: string }[] } & Block) {
  return (
    <div className={cn('fold-leaders', className)} {...props}>
      {line ? <p className="fold-leaders-line">{line}</p> : null}
      <MarkTicker marks={leaders} label="Industry leaders behind the programme" tone="dark" />
      {alumniLine && alumniFrom?.length ? (
        <p className="fold-alumni">
          <span className="fold-alumni-line">{alumniLine}</span>
          {alumniFrom.map((a) => (
            <span key={a.name} className="fold-alumni-name">
              {a.logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img className="fold-alumni-logo" src={a.logo} alt="" />
              ) : null}
              {a.name}
            </span>
          ))}
        </p>
      ) : null}
    </div>
  );
}
