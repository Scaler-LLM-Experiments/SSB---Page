import * as React from 'react';
import { Button, Container, Heading, Section, Text } from '@kishanscaler/ssx-ui';

import type { internshipHero } from '@/content/internship';
import { resolveLogos } from '@/lib/logos';
import { PeersFlip } from '@/sections/alumni/PeersFlip';
import { CtaIcon } from '@/sections/hero/CtaIcon';
import '@/sections/admissions/admissions-v4.css';
import '@/sections/admission/admission.css';
import '@/sections/alumni/alumni.css';
import '@/sections/deck/deck-outcomes.css';
import './internship-page.css';

/**
 * The internship page's first fold (2026-11-12, the user's ask: logos in the hero, not the admission
 * page's photo and facts). The site's short forest-green panel (admission.css: the chip, the title, the
 * footer's two buttons) with the companies our learners intern at beside the copy, on the home page's
 * "Your peers come from" grid (PeersFlip): white tiles, one turning over to a company not on show every
 * second. Fifteen tiles on desktop (5 × 3, the user's ask), ten on a tablet, six on a phone, over
 * twenty-four logos.
 * Server-only (sizes the logo files).
 */
export async function InternshipHero({ content: c }: { content: typeof internshipHero }) {
  const logos = await resolveLogos(c.logos);
  return (
    <Section id="int-top" density="roomy" aria-labelledby="int-top-title" className="adm-top int-hero">
      <div className="adm-panel int-hero-panel" data-brand="ssb" data-theme="dark">
        <Container>
          <div className="int-hero-grid">
            <div className="adm-panel-copy">
              <p className="adm-chip">
                <span className="ad4-dot" aria-hidden="true" />
                {c.chip}
              </p>
              <Heading as="h1" size="display" id="int-top-title" className="adm-title">
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
            <div className="int-hero-logos">
              <p className="int-hero-logos-k">{c.logosLabel}</p>
              <div data-brand="ssb" data-theme="light">
                <PeersFlip logos={logos} label={c.logosLabel} cells={15} className="int-hero-flip" />
              </div>
            </div>
          </div>
        </Container>
      </div>
    </Section>
  );
}
