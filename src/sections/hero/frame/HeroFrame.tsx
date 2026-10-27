import { Banner, Button, Heading, Text } from '@kishanscaler/ssx-ui';
import { ArrowUpRight } from '@phosphor-icons/react/ssr';

import type { HeroFrameContent } from '@/content/home';
import { HeroFrameBarHeight } from './HeroFrameBarHeight';
import { HeroFrameCountdown } from './HeroFrameCountdown';
import { HeroFrameFlipLogos } from './HeroFrameFlipLogos';
import './hero-frame.css';

/**
 * The framed first fold (the team's mocks, 2026-10-22; the light tone, their pick that day, the dark
 * tone dropped): the light page and navbar; the film fades into a blue-grey frost at its foot.
 * The film fills one rounded frame inset from the window, under the navbar (and the deadline bar over
 * it, `HeroFrameDeadline`). Over its foot, at the left: the eyebrow, the title, the line and the two
 * actions; at the right: "Learn from" over the organisations' logos on white tiles, then the facts in
 * one glass panel split by hairlines. Phones: one column, the film above the copy.
 * Entrance: CSS only; the frame settles, then the copy fades up. Reduced motion: shown at once.
 */
/** `variant="deck"` (the deck variant, /v7, 2026-10-28): the eyebrow as a brand-green chip, the title on
 *  the display line height, the logos turning over all together in a quick wave. */
export function HeroFrame({ content: c, variant }: { content: HeroFrameContent; variant?: 'deck' }) {
  const tone = 'light';
  return (
    <section
      className="hf"
      data-tone={tone}
      data-variant={variant}
      aria-labelledby="hf-title"
      data-brand="ssb"
      data-theme={tone}
    >
      {/* the frame is dark in both tones: the copy is white on the film */}
      <div className="hf-frame" data-brand="ssb" data-theme="dark">
        <video className="hf-film" src={c.video.src} poster={c.video.poster} autoPlay muted loop playsInline preload="auto" aria-hidden="true" />
        <div className="hf-fade" aria-hidden="true" />

        <div className="hf-body">
          {/* the eyebrow on a row of its own, so the title's top and the side's top line up */}
          <p className="hf-eyebrow">{c.eyebrow}</p>
          <div className="hf-copy">
            <Heading as="h1" size="display" id="hf-title" className="hf-title">
              {c.title}
            </Heading>
            <Text size="lg" className="hf-line">
              {/* every phrase leads with its dot, and the row is pulled left by a dot's width and
                  clipped: whichever phrase starts a line has its dot cut off (2026-10-28) */}
              <span className="hf-line-in">
                {c.line.map((phrase) => (
                  <span key={phrase}>
                    <span className="hf-dot" aria-hidden="true">·</span>
                    {phrase}
                  </span>
                ))}
              </span>
            </Text>
            {/* the light theme's buttons: the brand green at full strength (the dark theme mutes it);
                the secondary is drawn per tone in hero-frame.css */}
            <div className="hf-actions" data-brand="ssb" data-theme="light">
              <Button asChild size="lg" variant="primary" className="hf-primary">
                <a href={c.primaryCta.href}>
                  {c.primaryCta.label}
                  <ArrowUpRight weight="bold" aria-hidden="true" />
                </a>
              </Button>
              <Button asChild size="lg" variant="secondary" className="hf-secondary">
                <a href={c.secondaryCta.href}>{c.secondaryCta.label}</a>
              </Button>
            </div>
          </div>

          <div className="hf-side">
            <p className="hf-label">
              <span>{c.logosLabel}</span>
            </p>
            {/* the ten logos turning over on four tiles, at every width (the still list below is kept, hidden) */}
            <HeroFrameFlipLogos logos={c.flipLogos} tiles={5} wave={variant === 'deck'} />
            <ul className="hf-logos">
              {c.logos.map((l) => (
                <li key={l.name}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={l.src} alt={l.name} loading="eager" decoding="async" />
                </li>
              ))}
            </ul>
            <dl className="hf-facts">
              {c.facts.map((f) => (
                <div key={f.value}>
                  <dt>{f.value}</dt>
                  <dd>{f.caption}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * The deadline bar over the navbar: the design system's Banner, solid brand, with its `shine` (a sheen
 * sweeping across it every few seconds) and the countdown ticking each second (HeroFrameCountdown); no
 * icon (the team's call, 2026-10-22). Still under reduced motion.
 */
export function HeroFrameDeadline({ deadline: d }: { deadline: HeroFrameContent['deadline'] }) {
  return (
    <div className="hf-deadline" data-brand="ssb" data-theme="light">
      <HeroFrameBarHeight />
      <Banner
        tone="brand"
        appearance="solid"
        shine
        className="hf-banner"
        message={
          <>
            {/* the full line from 672px; the short one on a phone, so it fits on one line with the countdown */}
            <span className="hf-msg-long">{d.message}</span>
            <span className="hf-msg-short">{d.shortMessage}</span>
          </>
        }
      >
        <HeroFrameCountdown to={d.to} label={d.label} />
      </Banner>
    </div>
  );
}
