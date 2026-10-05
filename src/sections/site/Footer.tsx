/**
 * SSB footer, from the SSB concept site. Two parts:
 *   CTA band  "Your next step": a photo, the headline, and Apply now /
 *             Download brochure (photo beside the text on desktop, above it on m-web)
 *   footer    the SSB logo and tagline, the link groups, the legal line and
 *             Back to top. Link groups are columns, shown upfront on
 *             desktop and m-web alike (two across on m-web).
 * Built from SSX parts only: Logo, Heading, Text, Button, Link.
 * Lift reveal: the footer is pinned to the bottom of the screen BEHIND the page.
 * Pass the page's content as children: it and the CTA band form one sheet that
 * scrolling lifts off the footer (it rises, a soft shadow grows on its edge),
 * uncovering the footer, which rises into place as it is revealed.
 * Scroll-driven (--lift, 0–1); reduced motion keeps the reveal, drops the lift.
 * Layout switches on the footer's own width (container queries), so it drops
 * into any page. Pure CSS switch: both link layouts are in the markup and the
 * hidden one is display:none, so a screen reader meets one set only.
 */
import * as React from 'react';
import { useDocTheme } from './theme';
import { Button, Heading, Link, Logo, Text } from '@kishanscaler/ssx-ui';
import { ArrowRight, ArrowUp, DownloadSimple } from '@phosphor-icons/react';
import type { FooterContent, FooterLink } from './data';
import { SSB_FOOTER } from './data';
import { ParticleText } from './ParticleText';

// the wordmark in the brand green (#1D925B) first, softened by a lighter green
// and a few mints so it is not a solid block; weighted 5 brand : 2 light : 3 mint
const SSB_GREENS = ['#1D925B', '#1D925B', '#1D925B', '#1D925B', '#1D925B', '#2FB573', '#2FB573', '#8FCFAE', '#8FCFAE', '#BFE4D0'];
const WORDMARK_LINES = ['Scaler School', 'of Business'];
import './footer.css';

function Links({ links }: { links: FooterLink[] }) {
  return (
    <ul className="sf-links">
      {links.map((l) => (
        <li key={l.label}>
          <Link href={l.href} variant="quiet" standalone>
            {l.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function SsbFooter({ content = SSB_FOOTER, showCta = true, settled, children }: { content?: FooterContent; showCta?: boolean; /** Draw the particle wordmark in place (still previews). */ settled?: boolean; /** The page above the footer: it lifts off the footer with the CTA band. */ children?: React.ReactNode }) {
  const ctaId = React.useId();
  const { cta } = content;
  const root = React.useRef<HTMLDivElement>(null);
  const layer = React.useRef<HTMLDivElement>(null);
  const theme = useDocTheme();
  const foot = React.useRef<HTMLElement>(null);
  // --lift: how much of the footer the lifting band has uncovered (0 = hidden, 1 = all)
  React.useEffect(() => {
    const r = root.current;
    const l = layer.current;
    const f = foot.current;
    if (!r || !l || !f) return undefined;
    let raf = 0;
    const update = () => {
      raf = 0;
      const uncovered = window.innerHeight - l.getBoundingClientRect().bottom;
      const p = Math.max(0, Math.min(1, uncovered / Math.max(1, f.offsetHeight)));
      r.style.setProperty('--lift', p.toFixed(3));
    };
    const on = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', on, { passive: true });
    window.addEventListener('resize', on);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', on);
      window.removeEventListener('resize', on);
    };
  }, []);
  return (
    <div ref={root} className="sf" data-brand="ssb" data-theme={theme} data-lift="">
      {/* the sheet that lifts: the page and the CTA band, opaque, above the pinned footer */}
      <div ref={layer} className="sf-lift">
      {children}
      {showCta ? (
        <section className="sf-cta" aria-labelledby={ctaId}>
          <div className="sf-cta-media">
            <img src={cta.image.src} alt={cta.image.alt} loading="lazy" decoding="async" />
          </div>
          <div className="sf-cta-body">
            <Heading as="p" size="eyebrow">
              {cta.eyebrow}
            </Heading>
            <Heading as="h2" size="2" id={ctaId}>
              {cta.title}
            </Heading>
            <Text size="base" tone="secondary">
              {cta.body}
            </Text>
            <Text size="sm" tone="secondary" className="sf-cta-note">
              {cta.note}
            </Text>
            <div className="sf-cta-actions">
              <Button asChild variant="primary" size="lg">
                <a href={cta.primary.href}>
                  {cta.primary.label}
                  <ArrowRight weight="bold" aria-hidden="true" />
                </a>
              </Button>
              <Button asChild variant="secondary" size="lg">
                <a href={cta.secondary.href}>
                  <DownloadSimple weight="bold" aria-hidden="true" />
                  {cta.secondary.label}
                </a>
              </Button>
            </div>
          </div>
        </section>
      ) : null}
      </div>

      <footer ref={foot} className="sf-foot">
        <span className="sf-waves" aria-hidden="true">
          <i />
          <i />
        </span>
        <div className="sf-top">
          <div className="sf-brand">
            <Logo brand="ssb" size="lg" className="sf-logo" />
            <Text size="sm" tone="secondary">
              {content.tagline}
            </Text>
          </div>

          {/* link columns, upfront everywhere: side by side on desktop, two across on m-web */}
          <nav className="sf-cols" aria-label={content.navLabel}>
            {content.columns.map((col) => (
              <div key={col.title} className="sf-col">
                <Heading as="h3" size="eyebrow">
                  {col.title}
                </Heading>
                <Links links={col.links} />
              </div>
            ))}
          </nav>

        </div>

        {/* the sign-off: the school's name in particles, under everything */}
        <ParticleText className="sf-wordmark" text={content.wordmark} lines={WORDMARK_LINES} colors={SSB_GREENS} settled={settled} />

        <div className="sf-bottom">
          <Text size="sm" tone="secondary" className="sf-legal">
            {content.legal}
          </Text>
          <Link href="#top" variant="quiet" standalone className="sf-top-link">
            {content.backToTop}
            <ArrowUp weight="bold" aria-hidden="true" />
          </Link>
        </div>
      </footer>
    </div>
  );
}
