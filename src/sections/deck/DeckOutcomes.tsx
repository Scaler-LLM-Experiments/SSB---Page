import * as React from 'react';
import { Button, Container, Heading, Section } from '@kishanscaler/ssx-ui';

import { deckOutcomes } from '@/content/deck';
import { placements } from '@/content/placements';
import { PeersTicker } from '@/sections/alumni/PeersTicker';
import { CtaIcon } from '@/sections/hero/CtaIcon';
import { Title } from '@/sections/shared/Title';
import './deck-outcomes.css';

/**
 * Slide 3, placement highlights, rebuilt for /v7 (2026-10-28, the user's figures and brief, after many
 * cuts turned down: a dark bento, a centred Stripe-like row, a newspaper front page). The rule: left
 * aligned, the whole of it in one screen, desktop and phone. A bento of two tiles of one height (after
 * a details.so bento: tinted panels with a white card set in them): at the left the six figures in
 * hairline cells, in the brand green; at the right the press card, as vFinal's article card (the
 * paper and date, headline, byline, a large photo beside the opening lines, the CTA in its foot).
 * Then the recruiters' flip grid.
 */
export function DeckOutcomes({
  glass = false,
  strip = false,
  recruiters = true,
}: { glass?: boolean; strip?: boolean; recruiters?: boolean } = {}) {
  const c = deckOutcomes;
  const press = c.press;
  const figs = (
    <dl className="dko-figs">
      {c.figures.map((f, i) => (
        <div key={f.value} className="dko-fig" data-lead={i === 0 ? '' : undefined}>
          <dd>{f.value}</dd>
          <dt>
            <span className="dko-long">{f.label}</span>
            <span className="dko-short">{f.short}</span>
            <small>{f.note}</small>
          </dt>
        </div>
      ))}
    </dl>
  );
  const pressCard = (
    <>
      {/* the press card, as vFinal's article card (2026-10-28, the user's reference): the paper and
        the date, the headline, the byline, a rule, then a large photo beside the opening lines,
        the report's CTA in the card's foot */}
      <article className="dko-press">
        <div className="dko-press-top">
          {/* eslint-disable-next-line @next/next/no-img-element -- a wordmark */}
          <img className="dko-clip-logo" {...press.logo} alt={press.logo.alt} />
          <span className="dko-press-date">{press.date}</span>
        </div>
        <h3 className="dko-clip-title">{press.title}</h3>
        <p className="dko-press-by">{press.byline}</p>
        <div className="dko-press-story">
          {/* eslint-disable-next-line @next/next/no-img-element -- fills its box */}
          <img
            className="dko-clip-photo"
            src="/media/cohort-group-800.webp"
            srcSet="/media/cohort-group-800.webp 800w, /media/cohort-group.webp 1600w"
            sizes="(min-width: 1056px) 280px, 100vw"
            alt="The founding cohort on campus"
            loading="lazy"
            decoding="async"
          />
          <p className="dko-clip-sub">{press.sub}</p>
        </div>
        <div className="dko-press-foot">
          <Button asChild size="md" className="dko-cta">
            <a href={placements.reportHref}>
              {press.cta}
              <CtaIcon icon="download" />
            </a>
          </Button>
        </div>
      </article>
    </>
  );
  return (
    <Section density="roomy" aria-labelledby="placements-showcase-title" className="dko">
      <Container>
        <div className="dko-head">
          <Heading as="p" size="eyebrow" className="text-content-brand">
            {c.eyebrow}
          </Heading>
          <Heading as="h2" size="display" id="placements-showcase-title">
            <Title text={c.title} />
          </Heading>
        </div>

        {strip ? (
          <StripCard press={pressCard} />
        ) : (
          <div className="dko-bento">
            {/* /v8 (2026-10-28, the user's ask: "like v3"): the figures on one glass plate over the cohort's photo */}
            {glass ? (
              <div className="dko-glass">
                {/* eslint-disable-next-line @next/next/no-img-element -- fills its box */}
                <img
                  className="dko-glass-bg"
                  src="/media/cohort-group.webp"
                  srcSet="/media/cohort-group-800.webp 800w, /media/cohort-group.webp 1600w"
                  sizes="(min-width: 1056px) 720px, 100vw"
                  alt=""
                  loading="lazy"
                  decoding="async"
                />
                {figs}
              </div>
            ) : (
              figs
            )}

            {pressCard}
          </div>
        )}

        {recruiters ? <Recruiters /> : null}
      </Container>
    </Section>
  );
}

function Recruiters() {
  const c = deckOutcomes;
  return (
    <div className="dko-recruiters">
      <PeersTicker
        companies={placements.logos.map(({ name, logoUrl, ink }) => ({
          name,
          logoUrl,
          ink,
          wordmark: name,
        }))}
        title={c.recruitersTitle}
        sub={null}
        label="Companies that have visited SSB"
      />
    </div>
  );
}

/**
 * /v8 (2026-10-28, the user's ask): the recruiters on their own, a light section after the dark first
 * two folds, under the glow divider (`DeckGlow`).
 */
export function DeckRecruiters() {
  return (
    <Section density="roomy" aria-label="Companies that have visited SSB" className="dko dko-solo">
      <Container>
        <Recruiters />
      </Container>
    </Section>
  );
}

/**
 * The divider between the dark folds and the light page (/v8, 2026-10-28, the user's reference): the
 * dark ground running into a band of brand-green light, which fades into the page's white.
 */
export function DeckGlow() {
  return <div className="dko-glow" aria-hidden />;
}

/**
 * /v8 (2026-10-28, the user's reference: SST's placements card): one card, a "Placement highlights"
 * strip running across its top, then the six figures at the left (3 × 2 in one bordered panel split by
 * hairlines, the user's ask) and the press card at the right.
 */
function StripCard({ press }: { press: React.ReactNode }) {
  const figures = deckOutcomes.figures;
  return (
    <div className="dks">
      <div className="dks-strip" aria-hidden>
        <div className="dks-track">
          {Array.from({ length: 12 }, (_, i) => (
            <span key={i}>Placement highlights</span>
          ))}
        </div>
      </div>
      <div className="dks-body">
        <div className="dks-stats">
          <p className="dks-k">The founding cohort</p>
          <dl className="dks-row">
            {figures.map((f) => (
              <div key={f.value} className="dks-fig">
                <dd>{f.value}</dd>
                <dt>
                  {f.label}
                  <small>{f.note}</small>
                </dt>
              </div>
            ))}
          </dl>
        </div>
        {press}
      </div>
    </div>
  );
}
