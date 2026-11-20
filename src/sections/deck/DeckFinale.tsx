'use client';

import * as React from 'react';
import { Button, Container, Heading, Section, Text } from '@kishanscaler/ssx-ui';
import { ArrowRight } from '@phosphor-icons/react';

import { deckClose, deckFaqs } from '@/content/deck';
import { useSectionEntrance } from '@/sections/faculty/useSectionEntrance';
import { CtaIcon } from '@/sections/hero/CtaIcon';
import type { CtaIconName } from '@/sections/hero/types';
import type { Faq } from '@/content/admissions';
import { Title } from '@/sections/shared/Title';
import './deck-finale.css';

/**
 * The page's last two sections on /v7, rebuilt (2026-10-28, the user's ask: "make them impressive,
 * minimal, in the page's theme"; after details.so: Aave's editorial FAQ, Effortel's and Kinetic's
 * closing CTAs).
 *
 * The FAQ, as the team's concept has it (ssb-school-concept /v4, 2026-10-28, the user's ask): the header
 * in a sticky column at the left, its button under it (the page's primary CTA); at the right
 * the questions as hairline rows, a square plus that turns to a minus on a green tile, the answer
 * opening by its height and fading up. One open at a time, the first to start.
 */
/** `items`, `title` and `sub` default to the home page's; another page (the admission page) passes its own. */
export function DeckFaqSection({
  items = deckFaqs,
  title = 'Questions, answered.|For candidates and parents.',
  sub = 'What applicants ask most, answered.',
}: { items?: Faq[]; title?: string; sub?: string } = {}) {
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
              <Title text={title} />
            </Heading>
            <Text size="lg" tone="secondary" data-enter="sub">
              {sub}
            </Text>
            {/* the page's own CTA (2026-10-28, the user's ask: "as the other CTAs"): the design system's
                primary button with the shared arrow, as the closing card's Apply Now */}
            <Button asChild size="lg" variant="primary" className="dkf-cta">
              <a href={help.href}>
                {help.cta}
                <CtaIcon icon="arrow" />
              </a>
            </Button>
          </div>

          <ol className="dkf-list" data-enter="block">
            {items.map((f, i) => {
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
                      <span className="dkf-q-text">{f.question}</span>
                      <span className="dkf-icon" aria-hidden="true" />
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
export type CloseContent = Pick<typeof deckClose, 'title' | 'line' | 'image' | 'imageSmall' | 'imageAlt'> & {
  /** optional: a band with no chip over its title */
  eyebrow?: string;
  /** optional: a band with no facts ends at its actions */
  facts?: typeof deckClose.facts;
  primaryCta: { label: string; href: string; icon?: CtaIconName };
  secondaryCta: { label: string; href: string; icon?: CtaIconName };
};

/** `content`, `id` (the admission page, 2026-11-11: its request-a-callback band); each CTA may name its
 *  icon (by default an arrow on the primary, a download on the secondary). */
export function DeckCloseSection({ content: c = deckClose, id = 'dk-close' }: { content?: CloseContent; id?: string } = {}) {
  return (
    <Section id={id === 'dk-close' ? undefined : id} density="roomy" aria-labelledby={`${id}-title`} className="dkc">
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
            {c.eyebrow ? (
              <p className="dkc-eyebrow">
                <span className="dkc-dot" aria-hidden="true" />
                {c.eyebrow}
              </p>
            ) : null}
            <Heading as="h2" size="display" id={`${id}-title`} className="dkc-title">
              {c.title}
            </Heading>
            <Text size="lg" className="dkc-line">
              {c.line}
            </Text>
            <div className="dkc-actions">
              <Button asChild size="lg" variant="primary" className="dkc-apply">
                <a href={c.primaryCta.href}>
                  {c.primaryCta.label}
                  <CtaIcon icon={c.primaryCta.icon ?? 'arrow'} />
                </a>
              </Button>
              <Button asChild size="lg" variant="secondary" className="dkc-brochure">
                <a href={c.secondaryCta.href}>
                  {c.secondaryCta.label}
                  <CtaIcon icon={c.secondaryCta.icon ?? 'download'} />
                </a>
              </Button>
            </div>
            {c.facts?.length ? (
              <dl className="dkc-facts">
                {c.facts.map((f) => (
                  <div key={f.value}>
                    <dt>{f.label}</dt>
                    <dd>{f.value}</dd>
                  </div>
                ))}
              </dl>
            ) : null}
          </div>
        </div>
      </Container>
    </Section>
  );
}
