import * as React from 'react';
import { Button, Container, Heading, Logo, Section, Text } from '@kishanscaler/ssx-ui';
import { ArrowRight, CheckCircle, DownloadSimple, MinusCircle } from '@phosphor-icons/react/ssr';

import { programCompare as cmp, programHero as hero } from '@/content/program';
import { Title } from '@/sections/shared/Title';
import { CompareSwipe } from './CompareSwipe';
import './program.css';

/**
 * The program page's own sections (/program, 2026-11-13): the copy of scaler.com's program page in
 * the SSB pages' vocabulary, all light (the user's ask: no dark anywhere). Everything else on the
 * page is the main page's own section, unchanged. Server components; CalmEntrance fades them in.
 */

/** The page's section header: eyebrow, "Lead.|Tail." title, line. */
function Header({ id, eyebrow, title, sub }: { id: string; eyebrow: string; title: string; sub?: string }) {
  return (
    <div className="pg-head">
      <Heading as="p" size="eyebrow" className="text-content-brand">
        {eyebrow}
      </Heading>
      <Heading as="h2" size="display" id={`${id}-title`}>
        <Title text={title} />
      </Heading>
      {sub ? (
        <Text size="lg" tone="secondary">
          {sub}
        </Text>
      ) : null}
    </div>
  );
}

/* ── the first fold ─────────────────────────────────────────────────────────────────────────────── */

/**
 * The first fold, text and figures only (the user's asks: no photo, no eyebrow, the title at the main
 * hero's size): the breadcrumb; at the left the name, its line and the main page's two large buttons
 * under it; at the right the six figures as equal cards, 3 × 2. Phones: one column, the buttons full
 * width, the figures 2 × 3.
 */
export function ProgramHero() {
  return (
    <Section density="roomy" aria-labelledby="pgh-title" className="pgh">
      <div className="pgh-frame">
      <Container>
        <nav aria-label="Breadcrumb" className="pgh-crumbs">
          <ol>
            {hero.crumbs.map((c, i) => (
              <li key={c.href}>
                {i === hero.crumbs.length - 1 ? <span aria-current="page">{c.label}</span> : <a href={c.href}>{c.label}</a>}
              </li>
            ))}
          </ol>
        </nav>

        <div className="pgh-top">
          <div className="pgh-copy">
            <Heading as="h1" size="display" id="pgh-title" className="pgh-title">
              {hero.title} <span className="pgh-short">({hero.short})</span>
            </Heading>
            <Text size="lg" tone="secondary" className="pgh-line">
              {hero.line}
            </Text>
            <div className="pgh-actions" data-brand="ssb" data-theme="light">
              <Button asChild size="lg" variant="primary" className="pgh-primary">
                <a href={hero.primaryCta.href}>
                  {hero.primaryCta.label}
                  <ArrowRight weight="bold" aria-hidden="true" />
                </a>
              </Button>
              <Button asChild size="lg" variant="secondary" className="pgh-secondary">
                <a href={hero.secondaryCta.href}>
                  {hero.secondaryCta.label}
                  <DownloadSimple weight="bold" aria-hidden="true" />
                </a>
              </Button>
            </div>
          </div>

          <dl className="pgh-figs">
            {hero.figures.map((f) => (
              <div key={f.label} className="pgh-fig">
                <dd>{f.value}</dd>
                <dt>
                  {f.label}
                </dt>
              </div>
            ))}
          </dl>
        </div>
      </Container>
      </div>
    </Section>
  );
}

/* ── SSB vs traditional ─────────────────────────────────────────────────────────────────────────── */

/**
 * The comparison as two cards side by side, subtle (the user's ask: no gradient, the green one in
 * focus): SSB's white with a green edge, the Scaler School of Business logo at its head, green checks;
 * the conventional programmes' a disabled-looking grey fill, faded text and grey minus marks. The
 * rows line up across. Phones: stacked, SSB's first.
 */
export function ProgramCompare() {
  return (
    <Section id="compare" density="roomy" aria-labelledby="compare-title" className="pgc">
      <Container>
        <Header id="compare" eyebrow={cmp.eyebrow} title={cmp.title} sub={cmp.sub} />
        <div className="pgc-pair">
          <div className="pgc-card pgc-ssb">
            <div className="pgc-name">
              <Logo brand="ssb" size="md" surface="light" />
              <span className="pgc-prog">{cmp.ssbLabel}</span>
            </div>
            <ul>
              {cmp.rows.map((r) => (
                <li key={r.label}>
                  <CheckCircle weight="fill" aria-hidden="true" />
                  <div>
                    <span className="pgc-aspect">{r.label}</span>
                    <span className="pgc-text">{r.ssb}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="pgc-card pgc-trad">
            <div className="pgc-name">
              <span className="pgc-trad-name">{cmp.traditionalLabel}</span>
            </div>
            <ul>
              {cmp.rows.map((r) => (
                <li key={r.label}>
                  <MinusCircle aria-hidden="true" />
                  <div>
                    <span className="pgc-aspect">{r.label}</span>
                    <span className="pgc-text">{r.traditional}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        {/* phones: a carousel, one aspect a card */}
        <CompareSwipe />
      </Container>
    </Section>
  );
}
