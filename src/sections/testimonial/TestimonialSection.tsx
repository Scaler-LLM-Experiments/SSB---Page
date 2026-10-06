'use client';

import * as React from 'react';
import { Container, Section } from '@kishanscaler/ssx-ui';

import { testimonial as t } from '@/content/testimonial';
import { useSectionEntrance } from '@/sections/faculty/useSectionEntrance';
import './testimonial.css';

/**
 * The investor's word, as a wide banner (after the team's reference): the
 * person's photo full-bleed, and at the left a frosted panel in the photo's own
 * green holding the quote in large type, then their name, and "Ex-" with the logos
 * of where they were (in white, split by a hairline). On phones the photo sits above the panel.
 * The card opens as Faculty's do (useSectionEntrance).
 */
export function TestimonialSection() {
  const sectionRef = React.useRef<HTMLElement>(null);
  useSectionEntrance(sectionRef, { decks: ['.tq-card'] });

  return (
    <Section ref={sectionRef} density="roomy" aria-label={`What ${t.name} said about SSB`}>
      <Container>
        <figure className="tq-card" data-brand="ssb" data-theme="dark">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="tq-photo"
            src={t.photo}
            alt={t.name}
            width={2243}
            height={701}
            loading="lazy"
            data-part="photo"
          />
          <div className="tq-panel">
            <blockquote className="tq-quote" data-part="title">
              <p>“{t.quote}”</p>
            </blockquote>
            <figcaption className="tq-by" data-part="description">
              <b>{t.name}</b>
              <span className="sr-only">{t.role}</span>
              {/* "Ex-" then where they were, split by a hairline: the logos say the role */}
              <span className="tq-logos" data-part="logos" aria-hidden="true">
                <span className="tq-ex">Ex-</span>
                {t.logos.map((l, i) => (
                  <React.Fragment key={l.name}>
                    {i > 0 ? <span className="tq-divider" /> : null}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={l.src}
                      alt=""
                      style={{ '--tq-logo-scale': l.scale } as React.CSSProperties}
                    />
                  </React.Fragment>
                ))}
              </span>
            </figcaption>
          </div>
        </figure>
      </Container>
    </Section>
  );
}
