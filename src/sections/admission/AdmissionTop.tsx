import * as React from 'react';
import { Button, Container, Heading, Section, Text } from '@kishanscaler/ssx-ui';

import type { admissionTop } from '@/content/admission';
import { CtaIcon } from '@/sections/hero/CtaIcon';
import { ADMISSION_ICONS } from './icons';
import '@/sections/admissions/admissions-v4.css';
import '@/sections/hero/frame/hero-frame.css';
import './admission.css';

/**
 * The admission page's first fold (2026-11-11, the user's asks: the dates and fees right on top; a
 * hero plainly not the home page's; short, not bland; no breadcrumb; the photo extended with a blur).
 * A panel inset from the page's edges, as the home page's first fold and footer are, on the footer's
 * forest green. SSB's campus photo runs out to the panel's right edge and melts into the green under
 * the copy (the closing band's technique: a blurred copy of the photo, masked, under a scrim); on it
 * the status chip (the admissions section's pulsing dot), the title, one line and the footer's two
 * buttons. Under them the four facts in one white box split by rules (2026-11-11, the user's asks),
 * each its icon on a tint, its label, the figure in ink, a note. The deadline counts down in the
 * page's top strip (HeroFrameDeadline). Phones: no photo, the facts two by two.
 */
export function AdmissionTop({ content: c }: { content: typeof admissionTop }) {
  return (
    <Section id="adm-top" density="roomy" aria-labelledby="adm-title" className="adm-top">
      <div className="adm-panel" data-brand="ssb" data-theme="dark">
        {/* eslint-disable-next-line @next/next/no-img-element -- fills the panel */}
        <img
          className="adm-panel-bg"
          src={c.photo.src}
          alt={c.photo.alt}
          width={1600}
          height={1067}
          decoding="async"
        />
        {/* eslint-disable-next-line @next/next/no-img-element -- the blur under the copy */}
        <img
          className="adm-panel-bg adm-panel-blur"
          src={c.photo.src}
          alt=""
          aria-hidden="true"
          decoding="async"
        />
        <span className="adm-panel-scrim" aria-hidden="true" />
        <Container>
          <div className="adm-panel-copy">
            <p className="adm-chip">
              <span className="ad4-dot" aria-hidden="true" />
              {c.chip}
            </p>
            <Heading as="h1" size="display" id="adm-title" className="adm-title">
              {c.title}
            </Heading>
            <Text size="md" className="adm-sub">
              {c.sub}
            </Text>
            <div className="adm-actions">
              <Button asChild size="lg" variant="primary" className="adm-apply">
                <a href={c.primaryCta.href}>
                  {c.primaryCta.label}
                  <CtaIcon icon="arrow" />
                </a>
              </Button>
              <Button asChild size="lg" variant="secondary" className="adm-brochure">
                <a href={c.secondaryCta.href}>
                  {c.secondaryCta.label}
                  <CtaIcon icon="download" />
                </a>
              </Button>
            </div>
          </div>

          <dl className="adm-facts" data-brand="ssb" data-theme="light">
            {c.facts.map((f) => {
              const Icon = ADMISSION_ICONS[f.icon];
              return (
                <div key={f.label} className="adm-fact">
                  <dt>
                    <span className="adm-fact-icon" aria-hidden="true">
                      <Icon weight="duotone" />
                    </span>
                    {f.label}
                  </dt>
                  <dd>
                    <span className="adm-fact-value">{f.value}</span>
                    {f.note ? <span className="adm-fact-note">{f.note}</span> : null}
                  </dd>
                </div>
              );
            })}
          </dl>
        </Container>
      </div>
    </Section>
  );
}
