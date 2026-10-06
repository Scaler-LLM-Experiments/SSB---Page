import { Button, Heading, Text } from '@kishanscaler/ssx-ui';

import { MarkTicker, type Mark } from '@/sections/shared/MarkTicker';
import { CtaIcon } from '../CtaIcon';
import type { HeroContent } from '../types';
import './hero-card.css';

type Leader = Mark;

/**
 * The "split" first fold, a variant of the hero (?hero=split), after the team's
 * references: a light page under a light, frosted nav; the campus film full-bleed
 * in one large rounded card, under an SSB-green wash at the left and a dark fade.
 * At its bottom left: the eyebrow, a short, large title, the line, the actions
 * and the facts. At its bottom right, right-aligned: "Built by 100+ industry
 * leaders from" over the leaders running past, each a colour mark with its name
 * (as the AI curriculum's tools). One gentle entrance (CSS): the card settles in,
 * then the copy fades up.
 */
export function HeroCard({
  eyebrow,
  title,
  description,
  primaryCta,
  secondaryCta,
  facts,
  media,
  leadersLine,
  leaders,
}: HeroContent & { leadersLine: string; leaders: Leader[] }) {
  return (
    <section className="hc" aria-labelledby="hc-title">
      <div className="hc-card" data-brand="ssb" data-theme="dark">
        {media?.videoSrc ? (
          <video
            className="hc-media"
            src={media.videoSrc}
            poster={media.poster}
            autoPlay
            muted
            loop
            playsInline
            aria-hidden="true"
          />
        ) : null}
        <div className="hc-wash" aria-hidden="true" />

        <div className="hc-body">
          <div className="hc-copy">
            <Heading as="p" size="eyebrow" className="hc-eyebrow">
              {eyebrow}
            </Heading>
            <Heading as="h1" id="hc-title" className="type-billboard-sm text-on-image-ink">
              {title}
            </Heading>
            {/* Each phrase kept whole; a line breaks only after a "·", never before one. */}
            <Text size="lg" className="hc-line">
              {description.split(' · ').map((part, i, all) => (
                <span key={part} className="hc-phrase">
                  {part}
                  {i < all.length - 1 ? ' ·' : ''}
                </span>
              ))}
            </Text>
            <div className="hc-actions">
              <Button asChild size="lg" className="hc-primary">
                <a href={primaryCta.href}>
                  {primaryCta.label}
                  <CtaIcon icon={primaryCta.icon} />
                </a>
              </Button>
              {secondaryCta ? (
                <Button asChild size="lg" variant="secondary" className="hc-secondary">
                  <a href={secondaryCta.href}>
                    {secondaryCta.label}
                    <CtaIcon icon={secondaryCta.icon} />
                  </a>
                </Button>
              ) : null}
            </div>
            {facts?.length ? (
              <ul className="hc-facts">
                {facts.map((f) => (
                  <li key={f.value}>
                    <b>{f.value}</b>
                    {f.caption ? <span> {f.caption}</span> : null}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          <div className="hc-leaders">
            <p className="hc-leaders-line">{leadersLine}</p>
            <MarkTicker marks={leaders} label="Industry leaders behind the programme" tone="dark" />
          </div>
        </div>
      </div>
    </section>
  );
}
