'use client';

import * as React from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion, useMotion } from '@kishanscaler/ssx-ui/motion';

import { useSectionEntrance } from '@/sections/faculty/useSectionEntrance';
import { cardEntrance, carouselControls, stripEntrance } from './carousel';

/**
 * The stories variation's motion, on the server-rendered markup in
 * PlacementsStories, found by `data-*` hooks:
 *
 *   data-enter           the header: the faculty section's entrance (useSectionEntrance)
 *   data-carousel        the scroller; its cards are data-story, with data-part="title|description|logos|photo"
 *   data-carousel-step   an arrow (-1 or 1); data-carousel-go: a progress segment, with data-carousel-fill
 *   data-strip           the strip of figures: data-strip-item, each a RollingFigure
 *
 * Under reduced motion nothing moves by itself: the cards are shown, the
 * carousel waits for the arrows or a swipe, and the figures show their values.
 */
export function StoriesMotion({ children }: { children: React.ReactNode }) {
  const scope = React.useRef<HTMLDivElement>(null);

  // The header moves exactly as the faculty section's does.
  useSectionEntrance(scope);

  useMotion(
    () => {
      const root = scope.current;
      const carousel = root?.querySelector<HTMLElement>('[data-carousel]');
      if (!root || !carousel) return;
      gsap.registerPlugin(ScrollTrigger);
      const reduced = prefersReducedMotion(root);

      const controls = carouselControls(root, carousel, reduced);
      if (!reduced) {
        cardEntrance(carousel, controls.update);
        stripEntrance(root);
      }
      return controls.cleanup;
    },
    scope,
    [],
  );

  return <div ref={scope}>{children}</div>;
}
