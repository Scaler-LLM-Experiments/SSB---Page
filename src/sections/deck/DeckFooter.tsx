import * as React from 'react';
import { Button, Container, Logo } from '@kishanscaler/ssx-ui';
import { ArrowUp, MapPin } from '@phosphor-icons/react/ssr';

import { SSB_FOOTER } from '@/sections/site/data';
import { CtaIcon } from '@/sections/hero/CtaIcon';
import './deck-footer.css';

/**
 * The /v7 footer, its own (2026-10-28, the user's asks: premium, minimal, larger; no dot matrix, no
 * photos; then "the links on top, the statement at the foot", the statement the site's own tagline).
 * Static, generous room; since 2026-10-28 (the user's ask, "as the first fold") framed as the first fold
 * is, a rounded panel inset from the page's edges, on a lit mesh of the brand's greens, the type white.
 *
 * At the top the working part: the logo with the cohort's line and the two actions, then the site's
 * two link columns and the campus. Then the site's tagline, "For people who build.", at the page's
 * largest size, its last word in the brand green, running the container's full width; and at the very
 * foot the legal line with "Back to top". Content is the site footer's own (site/data.ts).
 */
export function DeckFooter() {
  const c = SSB_FOOTER;
  // the tagline's last word in the brand green
  const words = c.tagline.replace(/\.$/, '').split(' ');
  const last = words.pop();
  return (
    // the wrap holds the page's ground on all four sides of the frame (the frame's margin once showed the
    // document's own background, dark under a dark OS)
    <footer className="dkft-wrap bg-page" data-brand="ssb" data-theme="light" aria-label={c.navLabel}>
      <div className="dkft" data-brand="ssb" data-theme="dark">
        <Container>
          <div className="dkft-grid">
            <div className="dkft-brand">
              <Logo brand="ssb" size="lg" />
              <p className="dkft-brand-line">
                PGP in Management &amp; Technology. Applications are open for the next cohort.
              </p>
              {/* (2026-10-28, the user's ask) Apply now white, the brochure an outline with no fill */}
              <div className="dkft-actions">
                <Button asChild size="md" variant="primary" className="dkft-apply">
                  <a href={c.cta.primary.href}>
                    {c.cta.primary.label}
                    <CtaIcon icon="arrow" />
                  </a>
                </Button>
                <Button asChild size="md" variant="secondary" className="dkft-brochure">
                  <a href={c.cta.secondary.href}>
                    {c.cta.secondary.label}
                    <CtaIcon icon="download" />
                  </a>
                </Button>
              </div>
            </div>
            {c.columns.map((col) => (
              <nav key={col.title} className="dkft-col" aria-label={col.title}>
                <p className="dkft-col-title">{col.title}</p>
                <ul>
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <a href={l.href}>{l.label}</a>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
            <div className="dkft-col">
              <p className="dkft-col-title">Campus</p>
              <p className="dkft-place">
                <MapPin weight="regular" aria-hidden="true" />
                {c.campus.place.replace(/^Campus:\s*/, '')}, India
              </p>
              {/* the campus's full address (2026-10-28, the user's ask). TO CONFIRM: from a college
                  directory (searchmycolleges.com); Scaler's own pages name only Electronic City, Bengaluru */}
              <address className="dkft-address">
                Scaler School of Business
                <br />
                14, 3rd Cross, Parappana Agrahara,
                <br />
                Electronic City Phase 1, Bengaluru,
                <br />
                Karnataka 560100
              </address>
            </div>
          </div>

          {/* the tagline at the foot, the page's largest type */}
          <p className="dkft-statement">
            {words.join(' ')} <span>{last}.</span>
          </p>

          {/* the legal line at the footer's very foot (2026-10-28, the user's ask) */}
          <div className="dkft-legal">
            <p>{c.legal}</p>
            <a href="#top" className="dkft-top">
              {c.backToTop}
              <ArrowUp weight="bold" aria-hidden="true" />
            </a>
          </div>
        </Container>
      </div>
    </footer>
  );
}
