'use client';

import * as React from 'react';
import { Container } from '@kishanscaler/ssx-ui';

import { testimonial as t } from '@/content/testimonial';
import { useSectionEntrance } from '@/sections/faculty/useSectionEntrance';
import './testimonial.css';

/**
 * The investor's word, in the Why SSB breaker's form: a band the full width of the page, the
 * person's photo filling it (the person at the left, the photo's own soft green at the right),
 * and over that right side an eyebrow, the quote in large type, "— name, role", then a hairline
 * and "Ex-" with the logos of where they were (in white). No panel, no card: the text stands on
 * the photo. On phones the photo sits above the text, on the photo's dark green.
 * It opens as Faculty's cards do (useSectionEntrance).
 *
 * The team's photo has the person at the right; it is mirrored here so the copy reads at the
 * right, as the breaker's does.
 */
export function TestimonialSection() {
  const sectionRef = React.useRef<HTMLElement>(null);
  useSectionEntrance(sectionRef, { decks: ['.tq-card'] });

  return (
    <section ref={sectionRef} className="tq-band" aria-label={`What ${t.name} said about SSB`}>
      <figure className="tq-card" data-brand="ssb" data-theme="dark">
        <div className="tq-media">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="tq-photo" src={t.photo} alt={t.name} width={2243} height={701} loading="lazy" data-part="photo" />
        </div>
        <Container className="tq-inner">
          <div className="tq-copy">
            <p className="tq-eyebrow" data-part="title">
              {t.eyebrow}
            </p>
            <blockquote className="tq-quote" data-part="title">
              <p>“{t.quote}”</p>
            </blockquote>
            <figcaption className="tq-by" data-part="description">
              <span className="tq-name">
                — {t.name}
                <span className="sr-only">, {t.role}</span>
              </span>
              {/* "Ex-" then where they were, split by a hairline: the logos say the role */}
              <span className="tq-logos" data-part="logos" aria-hidden="true">
                <span className="tq-ex">Ex-</span>
                {t.logos.map((l, i) => (
                  <React.Fragment key={l.name}>
                    {i > 0 ? <span className="tq-divider" /> : null}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={l.src} alt="" style={{ '--tq-logo-scale': l.scale } as React.CSSProperties} />
                  </React.Fragment>
                ))}
              </span>
            </figcaption>
          </div>
        </Container>
      </figure>
    </section>
  );
}
