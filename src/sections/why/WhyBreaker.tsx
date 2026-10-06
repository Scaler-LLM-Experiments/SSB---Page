'use client';

import * as React from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Container, Heading } from '@kishanscaler/ssx-ui';
import { ease, motionTokens, prefersReducedMotion, useMotion } from '@kishanscaler/ssx-ui/motion';

import type { WhyFigure, WhyQuote } from './types';
import './why.css';

const { duration: d, stagger: st, offset } = motionTokens;

/**
 * The breaker that opens Why SSB, after Apple's product blocks: the clip of
 * the remark full bleed, Nikhil Kamath on its left looking right, and the
 * words on the right where he is looking, in white (a dark island), over a
 * progressive blur (a dark frost that strengthens toward the right). The
 * section's eyebrow, the words as the title, then the two figures that say he
 * isn't alone, as Apple sets its spec figures: a line over each, the figure, a
 * line of text, the source's logo. Who said it is a footnote under the words.
 * The clip fades out (its opacity, eased) into the page's colour under them. The
 * copy fades up as it arrives, part by part (eyebrow, words, footnote), then
 * the figures one after the other: each one's line and figure (sliding up into
 * its line), then its text and source.
 *
 * On a phone: the clip at the top, sharp, and under it a blurred copy of it
 * running to the breaker's foot; the words and the figures over its
 * lower part on a dark frost, all in white; then it fades out into the page.
 *
 * The clip is the team's cut (a silent loop, like a GIF; Zerodha's footage,
 * used with their permission), playing only while on screen. Under reduced
 * motion it holds on its first frame (the poster).
 */
export function WhyBreaker({ quote, figures }: { quote: WhyQuote; figures: WhyFigure[] }) {
  const scope = React.useRef<HTMLElement>(null);
  const { video, poster } = quote;

  // Both copies (the sharp clip, the blurred one under it on a phone) play only while on screen;
  // the blurred one only where it is shown.
  React.useEffect(() => {
    const root = scope.current;
    if (!video || !root) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const clips = Array.from(root.querySelectorAll<HTMLVideoElement>('[data-breaker-clip]'));
    const onScreen = new IntersectionObserver(([entry]) => {
      for (const clip of clips) {
        const shown = getComputedStyle(clip).display !== 'none';
        if (entry.isIntersecting && shown && !reduce) clip.play().catch(() => {});
        else clip.pause();
      }
    });
    onScreen.observe(root);
    return () => onScreen.disconnect();
  }, [video]);

  useMotion(
    () => {
      const root = scope.current;
      if (!root || prefersReducedMotion(root)) return;
      gsap.registerPlugin(ScrollTrigger);
      const q = gsap.utils.selector(root);
      const enter = ease('expressiveEntrance');
      // The words come up one after another (eyebrow, words, footnote), a gentle fade each.
      gsap.fromTo(
        q('[data-breaker-part]'),
        { autoAlpha: 0, y: offset.reveal },
        {
          autoAlpha: 1,
          y: 0,
          duration: d.slower,
          stagger: st.base * 2,
          ease: enter,
          clearProps: 'transform,opacity,visibility',
          scrollTrigger: { trigger: root, start: 'clamp(top 70%)', once: true },
        },
      );
      // Then the figures as their row arrives, one after the other: each one's line and figure
      // (sliding up into its line), then its text and source fading up behind it.
      const row = q('[data-breaker-stats]')[0];
      const figures = gsap.timeline({
        scrollTrigger: { trigger: row, start: 'clamp(top 90%)', once: true },
      });
      q('[data-breaker-stat]').forEach((stat, i) => {
        const at = i * st.base * 3;
        figures
          .fromTo(
            stat,
            { autoAlpha: 0 },
            { autoAlpha: 1, duration: d.slow, ease: enter, clearProps: 'opacity,visibility' },
            at,
          )
          .fromTo(
            stat.querySelector('[data-slide]'),
            { yPercent: 110 },
            { yPercent: 0, duration: d.slower, ease: enter, clearProps: 'transform' },
            at,
          )
          .fromTo(
            stat.querySelectorAll('[data-stat-part]'),
            { autoAlpha: 0, y: offset.reveal },
            {
              autoAlpha: 1,
              y: 0,
              duration: d.slower,
              stagger: st.base * 2,
              ease: enter,
              clearProps: 'transform,opacity,visibility',
            },
            at + st.base * 2,
          );
      });
      // The clip settles from a slight zoom as the breaker crosses the screen.
      gsap.fromTo(
        q('[data-breaker-stage]'),
        { scale: 1.08 },
        {
          scale: 1,
          ease: ease('linear'),
          scrollTrigger: { trigger: root, start: 'top bottom', end: 'center center', scrub: true },
        },
      );
    },
    scope,
    [],
  );

  return (
    <section ref={scope} aria-labelledby="why-breaker-title" className="why-breaker">
      <div className="why-breaker-media" aria-hidden>
        <div data-breaker-stage className="why-breaker-stage">
          {video ? (
            <>
              {/* Phone: a blurred copy under the sharp clip, carrying it to the breaker's foot. */}
              <video
                data-breaker-clip
                className="why-breaker-haze"
                src={video}
                poster={poster}
                muted
                loop
                playsInline
                preload="metadata"
              />
              <video
                data-breaker-clip
                className="why-breaker-clip"
                src={video}
                poster={poster}
                muted
                loop
                playsInline
                preload="metadata"
              />
            </>
          ) : null}
        </div>
        <span className="why-breaker-blur" />
      </div>

      {/* The page's width (the nav's edges): his name at its left edge, the copy at its right. */}
      <Container className="why-breaker-inner">
        <div className="why-breaker-copy">
          <div className="why-breaker-top">
            {/* The words: a dark island, white over the clip (the team's call). */}
            <div className="why-breaker-lead" data-brand="ssb" data-theme="dark">
              {/* White, like the words (the team's call), not the brand green other sections use. */}
              <Heading as="p" size="eyebrow" className="text-on-image-ink" data-breaker-part>
                {quote.eyebrow}
              </Heading>
              <h2 id="why-breaker-title" data-breaker-part className="why-breaker-words">
                “{quote.caption}”
              </h2>
              {/* Who said it, a small footnote (the team's call). */}
              <p data-breaker-part className="why-breaker-credit type-body">
                — {[quote.attribution, quote.role?.split(', ').pop()].filter(Boolean).join(', ')}
              </p>
            </div>
          </div>

          {/* The figures, white over the clip. */}
          <div className="why-breaker-foot">
            <ul data-breaker-stats className="why-breaker-stats">
              {figures.map((figure) => (
                <li key={figure.value} data-breaker-stat className="why-breaker-stat">
                  <p className="why-slide type-display why-breaker-ink">
                    <span data-slide>{figure.value}</span>
                  </p>
                  <p data-stat-part className="mt-3 type-body-sm why-breaker-ink">
                    {figure.description}
                  </p>
                  <p data-stat-part className="why-breaker-source">
                    {figure.sourceLogo ? (
                      // eslint-disable-next-line @next/next/no-img-element -- a small static logo, sized by its height
                      <img
                        src={figure.sourceLogo}
                        alt={figure.source}
                        height={figure.sourceLogoHeight ?? 18}
                        style={{ height: figure.sourceLogoHeight ?? 18 }}
                        loading="lazy"
                        decoding="async"
                      />
                    ) : (
                      <span className="type-label why-breaker-ink">{figure.source}</span>
                    )}
                    {figure.sourceNote ? (
                      <span className="type-caption why-breaker-note">{figure.sourceNote}</span>
                    ) : null}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}
