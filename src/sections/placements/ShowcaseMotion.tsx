'use client';

import * as React from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ease, motionTokens, prefersReducedMotion, useMotion } from '@kishanscaler/ssx-ui/motion';

import { useSectionEntrance } from '@/sections/faculty/useSectionEntrance';
import { cardEntrance, carouselControls, rollIn, stripEntrance } from './carousel';

const { duration: d, offset } = motionTokens;

/**
 * The showcase variation's motion, on the server-rendered markup in
 * PlacementsShowcase, found by `data-*` hooks:
 *
 *   data-enter        the header: the faculty section's entrance (useSectionEntrance)
 *   data-switch       the switcher over the cards: data-carousel-go tabs, and data-switch-pill, the
 *                     dark pill (a copy of the tabs clipped to the active one, with each tab's
 *                     data-carousel-fill)
 *   data-carousel     the scroller of photo cards (data-story), opened as the faculty cards are
 *   data-strip        the strip of figures under the cards: one fade, the figures rolling in
 *
 * As a card comes round, the pill slides to its tab, the card's floating
 * column rises in and its figure rolls in again. Under reduced motion nothing moves by itself: the pill
 * jumps, the carousel waits for the switcher or a swipe, and every figure
 * shows its value.
 */
export function ShowcaseMotion({ children }: { children: React.ReactNode }) {
  const scope = React.useRef<HTMLDivElement>(null);

  // The header moves exactly as the faculty section's does.
  useSectionEntrance(scope);

  useMotion(
    () => {
      const root = scope.current;
      const carousel = root?.querySelector<HTMLElement>('[data-carousel]');
      const pill = root?.querySelector<HTMLElement>('[data-switch-pill]');
      if (!root || !carousel || !pill) return;
      gsap.registerPlugin(ScrollTrigger);
      const reduced = prefersReducedMotion(root);
      const tabs = gsap.utils.toArray<HTMLElement>('[data-carousel-go]', root);
      const cards = gsap.utils.toArray<HTMLElement>('[data-story]', carousel);

      // The pill's clip, onto tab i: its box inside the switcher (the tabs' offsetParent).
      const place = (i: number, animate: boolean) => {
        const tab = tabs[i];
        const box = tab?.offsetParent as HTMLElement | null;
        if (!tab || !box) return;
        const top = tab.offsetTop;
        const left = tab.offsetLeft;
        const right = box.offsetWidth - left - tab.offsetWidth;
        const bottom = box.offsetHeight - top - tab.offsetHeight;
        const clipPath = `inset(${top}px ${right}px ${bottom}px ${left}px round 9999px)`;
        if (animate && !reduced) {
          gsap.to(pill, { clipPath, duration: d.slower, ease: ease('expressiveInOut'), overwrite: true });
        } else {
          gsap.set(pill, { clipPath });
        }
      };

      const controls = carouselControls(root, carousel, reduced, (i, first) => {
        place(i, !first);
        if (first || reduced || !cards[i]) return;
        gsap.fromTo(
          cards[i].querySelectorAll('[data-part="logos"]'),
          { autoAlpha: 0, y: offset.reveal },
          {
            autoAlpha: 1,
            y: 0,
            duration: d.slowest,
            ease: ease('expressiveEntrance'),
            clearProps: 'transform,opacity,visibility',
            overwrite: true,
          },
        );
        rollIn(cards[i], gsap.timeline());
      });
      // Whenever the switcher's size changes (web fonts arriving, a resize, new styles), the
      // pill is placed again, so it can never be left on a stale box.
      const onResize = () => place(Math.max(0, controls.active()), false);
      const switcher = pill.parentElement;
      const ro = new ResizeObserver(onResize);
      if (switcher) ro.observe(switcher);
      switcher?.setAttribute('data-ready', '');

      if (!reduced) {
        stripEntrance(root);
        cardEntrance(carousel, controls.update);
      }
      return () => {
        ro.disconnect();
        switcher?.removeAttribute('data-ready');
        gsap.killTweensOf(pill);
        controls.cleanup();
      };
    },
    scope,
    [],
  );

  return <div ref={scope}>{children}</div>;
}
