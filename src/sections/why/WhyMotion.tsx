'use client';

import * as React from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ease, motionTokens, prefersReducedMotion, useMotion } from '@kishanscaler/ssx-ui/motion';

import { useSectionEntrance } from '@/sections/faculty/useSectionEntrance';

const { duration: d, stagger: st, offset } = motionTokens;

/** Seconds each role holds before the next turns over it. */
const ROLE_HOLD = 2.2;

/** Seconds the clip's playback bar takes to run its length, then it starts again. */
const CLIP_RUN = 12;

/**
 * Why SSB's motion, on the server-rendered markup in WhySection:
 *
 *   data-enter         the header: the faculty section's entrance (useSectionEntrance)
 *   data-why-evidence  the clip and the figures: one gentle fade as they arrive, each figure
 *                      (data-slide) sliding up into its line; the clip's bar (data-clip-bar) runs
 *                      while it is on screen
 *   data-why-roles     the line's roles (data-role) turning over, one up and out as the next
 *                      comes up into the slot, while it is on screen
 *   data-why-chapter   a chapter (sticky, CSS): as the next one slides up over it, its card
 *                      (data-why-card) settles back, a little smaller, the section's grey
 *                      (data-why-dim) fading over it, scrubbed to the scroll
 *
 * Transforms and opacity only. Under reduced motion nothing moves: the first
 * role shows, the bar stands, and the chapters don't stack (CSS).
 */
export function WhyMotion({ children }: { children: React.ReactNode }) {
  const scope = React.useRef<HTMLDivElement>(null);

  useSectionEntrance(scope);

  useMotion(
    () => {
      const root = scope.current;
      if (!root || prefersReducedMotion(root)) return;
      gsap.registerPlugin(ScrollTrigger);

      const evidence = root.querySelector<HTMLElement>('[data-why-evidence]');
      if (evidence) {
        const tl = gsap.timeline({
          defaults: { ease: ease('expressiveEntrance') },
          scrollTrigger: { trigger: evidence, start: 'clamp(top 85%)', once: true },
        });
        tl.fromTo(
          evidence,
          { autoAlpha: 0, y: offset.enter },
          { autoAlpha: 1, y: 0, duration: d.slowest, clearProps: 'transform,opacity,visibility' },
        );
        tl.fromTo(
          evidence.querySelectorAll('[data-slide]'),
          { yPercent: 110 },
          { yPercent: 0, duration: d.slower, stagger: st.base * 1.5, clearProps: 'transform' },
          d.slow * 0.4,
        );
        // The playback bar runs, from where it was paused, while the clip is on screen.
        const bar = evidence.querySelector('[data-clip-bar]');
        if (bar) {
          const run = gsap.fromTo(
            bar,
            { scaleX: 0 },
            { scaleX: 1, duration: CLIP_RUN, ease: ease('linear'), repeat: -1, paused: true },
          );
          run.progress(0.38);
          ScrollTrigger.create({
            trigger: evidence,
            start: 'top bottom',
            end: 'bottom top',
            onToggle: (self) => (self.isActive ? run.play() : run.pause()),
          });
        }
      }

      // The roles turn over in their slot, each holding ROLE_HOLD seconds, while the line is on screen.
      const line = root.querySelector<HTMLElement>('[data-why-roles]');
      const roles = line ? gsap.utils.toArray<HTMLElement>('[data-role]', line) : [];
      let turn: gsap.core.Tween | null = null;
      if (line && roles.length > 1) {
        let k = 0;
        let visible = false;
        roles.forEach((role, j) => gsap.set(role, { autoAlpha: j ? 0 : 1 }));
        const next = () => {
          turn = gsap.delayedCall(ROLE_HOLD, () => {
            if (visible && !document.hidden) {
              const out = roles[k];
              k = (k + 1) % roles.length;
              gsap.to(out, {
                yPercent: -100,
                autoAlpha: 0,
                duration: d.slower,
                ease: ease('expressiveInOut'),
              });
              gsap.fromTo(
                roles[k],
                { yPercent: 100, autoAlpha: 0 },
                { yPercent: 0, autoAlpha: 1, duration: d.slower, ease: ease('expressiveInOut') },
              );
            }
            next();
          });
        };
        next();
        ScrollTrigger.create({
          trigger: line,
          start: 'top bottom',
          end: 'bottom top',
          onToggle: (self) => (visible = self.isActive),
        });
        gsap.fromTo(
          line,
          { autoAlpha: 0, y: offset.enter },
          {
            autoAlpha: 1,
            y: 0,
            duration: d.slowest,
            ease: ease('expressiveEntrance'),
            clearProps: 'transform,opacity,visibility',
            scrollTrigger: { trigger: line, start: 'clamp(top 85%)', once: true },
          },
        );
      }

      // Each chapter but the last settles back as the next slides up over it: from the next one's
      // top reaching the foot of the screen to its reaching its own sticky place.
      const chapters = gsap.utils.toArray<HTMLElement>('[data-why-chapter]', root);
      chapters.slice(0, -1).forEach((chapter, i) => {
        const card = chapter.querySelector('[data-why-card]');
        const dim = chapter.querySelector('[data-why-dim]');
        const following = chapters[i + 1];
        if (!card || !dim || !following) return;
        const settle = gsap.timeline({
          defaults: { ease: ease('linear') },
          scrollTrigger: {
            trigger: following,
            start: 'top bottom',
            end: () => `top ${parseFloat(getComputedStyle(following).top) || 0}px`,
            scrub: true,
            invalidateOnRefresh: true,
          },
        });
        settle.fromTo(card, { scale: 1 }, { scale: 0.94 }, 0);
        settle.fromTo(dim, { opacity: 0 }, { opacity: 0.6 }, 0);
      });

      return () => turn?.kill();
    },
    scope,
    [],
  );

  return <div ref={scope}>{children}</div>;
}
