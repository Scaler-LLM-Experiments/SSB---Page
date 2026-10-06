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
 * Two looks for the footer itself (`variant`): `campus`, on trial (see CampusFoot), and
 * `classic`, described above.
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

/**
 * The campus footer (after IntegratedBio's, on Mobbin): a dark footer on a photo of the campus,
 * edge to edge. At the top, the school's line as a large statement with the primary action under
 * it; beside it the link groups, each behind a thin rule, and a back-to-top button at the far
 * end. At the foot, the school's name across the full width, very large, and the legal line under
 * it. The photo is shaded at the top and the foot, where the text is, and clear between, where
 * the building stands. It keeps the lift reveal: it is pinned behind the page, which lifts off
 * it. Always dark, whatever the page's theme; all in the page's own type.
 * Motion, all quiet, played once when the footer comes into view (`data-arrived` on the root, set
 * when most of it is uncovered), in its own time and not tied to the scroll: the photo settles from
 * a slight zoom and brightens, the name rises letter by letter out of its baseline, slowly and
 * evenly, then the top fades up.
 * At rest the photo drifts very slowly. Under reduced motion nothing moves.
 */
function CampusFoot({ footRef, content }: { footRef: React.Ref<HTMLElement>; content: FooterContent }) {
  const { campus, cta } = content;
  // the name on one line on desktop, broken after "School" on a phone so it can stay large
  const [first, ...rest] = content.wordmark.split(/ (?=of )/);
  return (
    <footer ref={footRef} className="sf-foot" data-variant="campus" data-brand="ssb" data-theme="dark">
      <div className="sfc-scene" aria-hidden="true">
        <img src={campus.image.src} srcSet={`${campus.image.small} 1200w, ${campus.image.src} 2400w`} sizes="100vw" alt="" loading="lazy" decoding="async" />
      </div>

      {/* the details sit just above the name and rise out of their own baseline as one block, the way
          the name's letters do (.sfc-top is the mask, .sfc-top-in the block that moves) */}
      <div className="sfc-top">
        <div className="sfc-top-in">
        <div className="sfc-lead">
          <p className="sfc-statement">{content.tagline}</p>
          {/* the page's action pair, as the hero's and the navbar's: the label, then a plain trailing
              glyph (no icon well). In the light theme's colours (the footer's dark theme mutes the green). */}
          <div className="sfc-actions" data-brand="ssb" data-theme="light">
            <Button asChild variant="primary" size="lg">
              <a href={cta.primary.href}>
                {cta.primary.label}
                <ArrowRight weight="bold" aria-hidden="true" />
              </a>
            </Button>
            <Button asChild variant="secondary" size="lg">
              <a href={cta.secondary.href}>
                {cta.secondary.label}
                <DownloadSimple weight="bold" aria-hidden="true" />
              </a>
            </Button>
          </div>
        </div>
        <nav className="sfc-links" aria-label={content.navLabel}>
          {content.columns.map((col) => (
            <div key={col.title} className="sfc-col">
              <h3 className="sfc-label">{col.title}</h3>
              <Links links={col.links} />
            </div>
          ))}
        </nav>
        <a className="sfc-up" href="#top" aria-label={content.backToTop}>
          <ArrowUp weight="bold" aria-hidden="true" />
        </a>
        </div>
      </div>

      <div className="sfc-foot">
        {/* the name, letter by letter: each letter rises out of the baseline, one after another at
            an even pace along the line, when the footer arrives */}
        <p className="sfc-wordmark" aria-hidden="true">
          {(() => {
            let n = 0;
            return [first, rest.join(' ')].map((group) => (
              <span key={group} className="sfc-wgroup">
                {group.split(' ').map((word) => (
                  <React.Fragment key={word}>
                    <span className="sfc-w">
                      {word.split('').map((ch, k) => (
                        <span key={k} className="sfc-l" style={{ '--i': n++ } as React.CSSProperties}>
                          <span>{ch}</span>
                        </span>
                      ))}
                    </span>{' '}
                  </React.Fragment>
                ))}
              </span>
            ));
          })()}
        </p>
        <div className="sfc-meta">
          <span>{content.legal}</span>
          <span>{campus.place}</span>
        </div>
      </div>
      <span className="sfc-alt">{campus.image.alt}</span>
    </footer>
  );
}

export function SsbFooter({ content = SSB_FOOTER, showCta = true, settled, variant = 'campus', children }: { content?: FooterContent; showCta?: boolean; /** `campus` (on trial): a dark footer standing on the campus photo. `classic`: the light footer with the particle wordmark. */ variant?: 'campus' | 'classic'; /** Draw the particle wordmark in place (still previews). */ settled?: boolean; /** The page above the footer: it lifts off the footer with the CTA band. */ children?: React.ReactNode }) {
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
      // arrived: the footer is in view (most of it uncovered). The campus footer plays its entrance
      // on this, in its own time; it is taken off again only once the footer is nearly covered, so
      // the entrance replays on the next visit and does not flicker at the threshold.
      if (p >= 0.5) r.setAttribute('data-arrived', '');
      else if (p <= 0.12) r.removeAttribute('data-arrived');
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
                  {cta.secondary.label}
                  <DownloadSimple weight="bold" aria-hidden="true" />
                </a>
              </Button>
            </div>
          </div>
        </section>
      ) : null}
      </div>

      {variant === 'campus' ? (
        <CampusFoot footRef={foot} content={content} />
      ) : (
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
      )}
    </div>
  );
}
