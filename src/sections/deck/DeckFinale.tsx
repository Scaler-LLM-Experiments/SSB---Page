'use client';

import * as React from 'react';
import { Button, Container, Heading, Section, Text } from '@kishanscaler/ssx-ui';
import { ArrowRight, Plus } from '@phosphor-icons/react';

import { deckClose, deckFaqs } from '@/content/deck';
import { useSectionEntrance } from '@/sections/faculty/useSectionEntrance';
import { CtaIcon } from '@/sections/hero/CtaIcon';
import { Title } from '@/sections/shared/Title';
import './deck-finale.css';

/**
 * The page's last two sections on /v7, rebuilt (2026-10-28, the user's ask: "make them impressive,
 * minimal, in the page's theme"; after details.so: Aave's editorial FAQ, Effortel's and Kinetic's
 * closing CTAs).
 *
 * The FAQ: the header in a sticky column at the left with a quiet "still have questions?" note under
 * it; at the right the questions as numbered hairline rows, no box, a plus that turns to a cross, the
 * number in the brand green while its row is open. One open at a time, the first to start.
 */
export function DeckFaqSection() {
  const ref = React.useRef<HTMLElement>(null);
  const [open, setOpen] = React.useState(0);
  useSectionEntrance(ref, { decks: [] });
  const help = deckClose.faqHelp;

  return (
    <Section ref={ref} density="roomy" aria-labelledby="faq-title" className="dkf">
      <Container>
        <div className="dkf-grid">
          <div className="dkf-aside" data-enter="header">
            <Heading as="p" size="eyebrow" className="text-content-brand" data-enter="eyebrow">
              FAQ
            </Heading>
            <Heading as="h2" size="display" id="faq-title" data-enter="headline">
              <Title text="Questions, answered.|For candidates and parents." />
            </Heading>
            <Text size="lg" tone="secondary" data-enter="sub">
              What applicants ask most, answered.
            </Text>
            <div className="dkf-help">
              <p className="dkf-help-title">{help.title}</p>
              <p className="dkf-help-line">{help.line}</p>
              <a className="dkf-help-link" href={help.href}>
                {help.cta}
                <ArrowRight weight="bold" aria-hidden="true" />
              </a>
            </div>
          </div>

          <ol className="dkf-list" data-enter="block">
            {deckFaqs.map((f, i) => {
              const on = open === i;
              const id = `dkf-${i}`;
              return (
                <li key={f.question} className="dkf-item" data-open={on ? '' : undefined}>
                  <h3 className="dkf-q">
                    <button
                      type="button"
                      aria-expanded={on}
                      aria-controls={id}
                      onClick={() => setOpen(on ? -1 : i)}
                    >
                      <span className="dkf-num">{String(i + 1).padStart(2, '0')}</span>
                      <span className="dkf-q-text">{f.question}</span>
                      <span className="dkf-icon" aria-hidden="true">
                        <Plus weight="bold" />
                      </span>
                    </button>
                  </h3>
                  <div id={id} role="region" className="dkf-a" aria-hidden={!on}>
                    <div className="dkf-a-inner">
                      <p>
                        {f.link && f.answer.includes(f.link.label) ? (
                          <>
                            {f.answer.slice(0, f.answer.indexOf(f.link.label))}
                            <a href={f.link.href}>{f.link.label}</a>
                            {f.answer.slice(f.answer.indexOf(f.link.label) + f.link.label.length)}
                          </>
                        ) : f.link ? (
                          <>
                            {f.answer} See the <a href={f.link.href}>{f.link.label}</a> section above.
                          </>
                        ) : (
                          f.answer
                        )}
                      </p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </Container>
    </Section>
  );
}

/**
 * The closing band (rebuilt again, 2026-10-28, the user's ask: "a very good image behind, a background
 * blur, the text big enough; the design system's buttons"; then a real blur, not a green tint, under a
 * grey-black gradient): an Unsplash photo of students across the whole card; over its left a blurred
 * copy of it, masked to ease in, and a neutral charcoal gradient; on it,
 * in white, the deadline chip, the title at the hero's size, its line, the design system's two buttons
 * and the three facts. Static. Phones: the photo above, the frost rising behind the copy at the foot.
 */
export function DeckCloseSection() {
  const c = deckClose;
  return (
    <Section density="roomy" aria-labelledby="dk-close-title" className="dkc">
      <Container>
        <div className="dkc-card" data-brand="ssb" data-theme="dark">
          {/* eslint-disable-next-line @next/next/no-img-element -- fills its box */}
          <img
            className="dkc-photo"
            src={c.image}
            alt={c.imageAlt}
            loading="lazy"
            decoding="async"
          />
          {/* the blur: a blurred copy of the photo, masked to ease in under the copy (a real blur, not a
              tint), then a neutral charcoal gradient for the white type */}
          {/* eslint-disable-next-line @next/next/no-img-element -- fills its box */}
          <img className="dkc-photo dkc-photo-blur" src={c.imageSmall} alt="" aria-hidden="true" loading="lazy" decoding="async" />
          <span className="dkc-scrim" aria-hidden="true" />
          <div className="dkc-copy">
            <p className="dkc-eyebrow">
              <span className="dkc-dot" aria-hidden="true" />
              {c.eyebrow}
            </p>
            <Heading as="h2" size="display" id="dk-close-title" className="dkc-title">
              {c.title}
            </Heading>
            <Text size="lg" className="dkc-line">
              {c.line}
            </Text>
            <div className="dkc-actions">
              <Button asChild size="lg" variant="primary" className="dkc-apply">
                <a href={c.primaryCta.href}>
                  {c.primaryCta.label}
                  <CtaIcon icon="arrow" />
                </a>
              </Button>
              <Button asChild size="lg" variant="secondary" className="dkc-brochure">
                <a href={c.secondaryCta.href}>
                  {c.secondaryCta.label}
                  <CtaIcon icon="download" />
                </a>
              </Button>
            </div>
            <dl className="dkc-facts">
              {c.facts.map((f) => (
                <div key={f.value}>
                  <dt>{f.label}</dt>
                  <dd>{f.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </Container>
    </Section>
  );
}
