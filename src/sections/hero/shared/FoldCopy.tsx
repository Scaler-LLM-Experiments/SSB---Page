import * as React from 'react';
import { Button, Heading, Text, cn } from '@kishanscaler/ssx-ui';

import type { ResolvedLogo } from '@/lib/logos';
import { MarkTicker, type Mark } from '@/sections/shared/MarkTicker';
import { CtaIcon } from '../CtaIcon';
import { HeroTitle } from '../HeroTitle';
import type { HeroContent } from '../types';
import { LogoTicker } from './LogoTicker';
import './hero.css';
import './fold.css';

type Block = React.HTMLAttributes<HTMLDivElement>;

/**
 * The first fold's copy, laid out the same in both variants (the split card and
 * the cinematic V2): the eyebrow, a short, large title, the line and the
 * actions (and, with `tags`, V3's, the facts as tags under them). Made for dark ground; each variant
 * styles the actions for its own (`fold-primary`, `fold-secondary`). Extra props
 * (a `data-*` hook, a class) go on its block.
 */
export function FoldCopy({
  hero,
  titleId,
  className,
  tags = false,
  tagsFirst = false,
  actionsToTags = false,
  ...props
}: {
  hero: HeroContent;
  titleId?: string;
  tags?: boolean;
  /** V6: the tags over the actions, the two one group set a step apart from the text above. */
  tagsFirst?: boolean;
  /** V7: the actions under-laid by the tags as one group, as wide as the tags' row. */
  actionsToTags?: boolean;
} & Block) {
  const { eyebrow, title, titleHighlight, description, primaryCta, secondaryCta, facts } = hero;
  const actions = (
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
  );
  return (
    <div
      className={cn('fold-copy', className)}
      data-split={tagsFirst || undefined}
      data-actions-to-tags={actionsToTags || undefined}
      {...props}
    >
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
      {tagsFirst ? (
        /* V6: the tags, then the actions, as one group */
        <div className="fold-act">
          <FoldTags facts={facts} />
          {actions}
        </div>
      ) : actionsToTags ? (
        /* V7: the actions over the tags, one group as wide as the tags' row */
        <div className="fold-act">
          {actions}
          <FoldTags facts={facts} />
        </div>
      ) : (
        <>
          {actions}
          {/* V3: the facts as tags right under the actions. */}
          {tags ? <FoldTags facts={facts} /> : null}
        </>
      )}
    </div>
  );
}

/** The facts as tags (V3 under the actions, V4 at the right), each value then its caption
 * (`short`: the short caption where there is one). */
function FoldTags({ facts, short = false }: { facts: HeroContent['facts']; short?: boolean }) {
  if (!facts?.length) return null;
  return (
    <ul className="fold-tags">
      {facts.map((f) => {
        const caption = short ? (f.shortCaption ?? f.caption) : f.caption;
        return (
          <li key={f.value}>
            <b>{f.value}</b>
            {caption ? <span>{caption}</span> : null}
          </li>
        );
      })}
    </ul>
  );
}

/**
 * The programme in brief, beside the copy, in one box, everything left-aligned: the facts'
 * caption as a slim strip along the box's top; their values side by side (short dividers
 * between); a stroke across; then "Built by alumni from" and the schools' wide logos, white.
 * With `schoolsOnly` (V3, where the facts are tags under the actions; V4, with `tags`, where they
 * are tags on top of the schools; V5, with `faculty`, the faculty's logos running past above
 * them), only the schools, with no box, their logos a size larger. Pass the schools resolved (`resolveLogos`, on the server). Two looks for the team to compare (`data-facts-style`,
 * the lab's FactsStyleToggle): `box`, in a glass box (the default), or `none`, no box.
 * Its foot is level with the actions'.
 */
export function FoldFacts({
  hero,
  schools = [],
  schoolsOnly = false,
  tags = false,
  faculty,
  className,
  ...props
}: {
  hero: HeroContent;
  schools?: ResolvedLogo[];
  schoolsOnly?: boolean;
  /** V4: the facts as tags on top of the schools. */
  tags?: boolean;
  /** V5: the faculty's line and their marks with names running past, above the schools (no
   * foot row then); or their logos (`logos`). */
  faculty?: { line?: string; logos?: ResolvedLogo[]; marks?: Mark[] };
} & Block) {
  const { alumniLead } = hero;
  const facts = schoolsOnly ? undefined : hero.facts;
  return (
    <div
      className={cn('fold-panel', className)}
      // V3's schools never sit in a box (the team's call), so the box/no-box toggle leaves them be.
      data-facts-style={schoolsOnly ? undefined : 'box'}
      data-schools-only={schoolsOnly || undefined}
      {...props}
    >
      {/* The captions, as a slim strip along the top of the box (one today: the duration's,
          "incl. internships & immersions"). */}
      {facts?.some((f) => f.caption) ? (
        <p className="fold-panel-strip">
          {facts
            .filter((f) => f.caption)
            .map((f) => f.caption)
            .join(' · ')}
        </p>
      ) : null}
      {tags ? <FoldTags facts={hero.facts} short /> : null}
      {facts?.length ? (
        /* The values and, between them, their dividers as items of their own. */
        <div className="fold-figures" role="list">
          {facts.map((f, i) => (
            <React.Fragment key={f.value}>
              {i ? <span className="fold-figures-rule" aria-hidden="true" /> : null}
              <span role="listitem">{f.value}</span>
            </React.Fragment>
          ))}
        </div>
      ) : null}
      {faculty?.marks?.length || faculty?.logos?.length ? (
        <div className="fold-panel-faculty">
          {faculty.line ? <span className="fold-panel-label">{faculty.line}</span> : null}
          {faculty.marks?.length ? (
            <MarkTicker marks={faculty.marks} label="Industry leaders behind the programme" tone="dark" />
          ) : (
            <LogoTicker logos={faculty.logos ?? []} label="Industry leaders behind the programme" />
          )}
        </div>
      ) : null}
      {schools.length ? (
        /* The schools, behind a stroke across the box (split into a box of their own and
           brought back, 2026-10-08). */
        <div className="fold-panel-alumni">
          {alumniLead ? <span className="fold-panel-label">{alumniLead}</span> : null}
          {schools.map((a) =>
            a.src ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={a.name} src={a.src} alt={a.name} width={a.width} height={a.height} decoding="async" />
            ) : (
              <b key={a.name}>{a.wordmark}</b>
            ),
          )}
        </div>
      ) : null}
    </div>
  );
}

/**
 * Who teaches, along the hero's foot behind one hairline: "100+ industry-leading faculty from"
 * as plain text at the left, then the leaders' logos running past to the hairline's end, faded
 * at both ends (`LogoTicker`: one grey tone, one visual weight, each its own colours under the
 * pointer); below desktop, the line over the logos. Pass the logos resolved
 * (`resolveLogos`, on the server). Also tried that day: the line as a centred eyebrow over the
 * logos, no hairline (the team brought both back); the logos running past the page margin
 * to the screen's edge (cut off there, unfaded: "right side no fade"). Tried (2026-10-08, the team's verdicts):
 * the facts and logos as rows of a table ("didn't like"); in glass panels, borderless ("too
 * subtle"), ringed ("too bright"), darker ("still looks bad": glass over plain black is a grey
 * card; it needs footage behind it); the label at the row's left behind a hairline, the app
 * icons in their own colours with names ("too busy"), then grey ("just show logos").
 */
export function FoldCredits({
  line,
  logos,
  className,
  ...props
}: { line?: string; logos: ResolvedLogo[] } & Block) {
  if (!logos.length) return null;
  return (
    <div className={cn('fold-credits', className)} {...props}>
      {line ? <p className="fold-credits-label">{line}</p> : null}
      <LogoTicker logos={logos} label="Industry leaders behind the programme" />
    </div>
  );
}
