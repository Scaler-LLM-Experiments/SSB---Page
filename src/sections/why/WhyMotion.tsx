'use client';

import * as React from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ease, motionTokens, prefersReducedMotion, useMotion } from '@kishanscaler/ssx-ui/motion';

import { useSectionEntrance } from '@/sections/faculty/useSectionEntrance';

const { duration: d, stagger: st, offset } = motionTokens;

/** Seconds each role holds before the next turns over it. */
const ROLE_HOLD = 2.2;

/** The AI journey's stack (concepts/stack.tsx): a card shrinks this much for every card over it, */
const SHRINK = 0.05;
/** ...never below this. */
const MIN_SCALE = 0.8;
/** px kept clear under a card taller than the screen when it holds. */
const FOOT = 12;

/**
 * Why SSB's motion, on the server-rendered markup in WhySection:
 *
 *   data-enter         the header: the faculty section's entrance (useSectionEntrance)
 *   data-why-roles     the line's roles (data-role) turning over, one up and out as the next
 *                      comes up into the slot, while it is on screen
 *   data-why-chapter   a chapter (sticky, CSS), stacking as the AI journey's cards do
 *                      (curriculum/journey/concepts/stack.tsx): every card that comes up over
 *                      it shrinks its card (data-why-card) a little more, scrubbed to the
 *                      scroll, and it is trimmed to the foot of the card over it; nothing
 *                      dims. A card taller than the screen holds lower, once all of it is seen
 *
 * Transforms and opacity only. Under reduced motion nothing moves: the first
 * role shows, and the chapters don't stack (CSS). The breaker above the
 * section moves itself (WhyBreaker).
 */
export function WhyMotion({ children }: { children: React.ReactNode }) {
  const scope = React.useRef<HTMLDivElement>(null);

  useSectionEntrance(scope);

  useMotion(
    () => {
      const root = scope.current;
      if (!root || prefersReducedMotion(root)) return;
      gsap.registerPlugin(ScrollTrigger);

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

      // The chapters stack as the AI journey's cards do. Each one's arrival runs 0 to 1, from its
      // top reaching the foot of the screen to its reaching its sticky place; a card shrinks by
      // SHRINK for every card come up over it, and is trimmed to the foot of the one directly over
      // it, so a taller card never shows below a shorter one.
      const chapters = gsap.utils.toArray<HTMLElement>('[data-why-chapter]', root);
      const cards = chapters.map((chapter) => chapter.querySelector<HTMLElement>('[data-why-card]'));
      const arrived = chapters.map(() => 0);
      const stack = () => {
        cards.forEach((card, i) => {
          const covered = arrived.slice(i + 1).reduce((sum, a) => sum + a, 0);
          if (card) gsap.set(card, { scale: Math.max(MIN_SCALE, 1 - SHRINK * covered) });
        });
        const boxes = cards.map((card) => card?.getBoundingClientRect());
        cards.forEach((card, i) => {
          const box = boxes[i];
          const over = boxes[i + 1];
          if (!card || !box) return;
          const cut = over && arrived[i + 1] > 0 && over.top < box.bottom ? box.bottom - over.bottom : 0;
          // the card is scaled: the inset is in its own units
          card.style.clipPath =
            cut > 1
              ? `inset(0 0 ${(cut / (box.height / card.offsetHeight)).toFixed(1)}px 0 round var(--radius-2xl))`
              : '';
        });
      };

      // A card taller than the room under the nav holds lower, once its foot is on screen (the
      // AI journey's rule), so all of it is read before the next covers it.
      const holds = () =>
        chapters.forEach((chapter, i) => {
          chapter.style.top = '';
          const room = window.innerHeight - parseFloat(getComputedStyle(chapter).top) - FOOT;
          const height = cards[i]?.offsetHeight ?? 0;
          if (height > room) chapter.style.top = `${window.innerHeight - height - FOOT}px`;
        });
      holds();
      ScrollTrigger.addEventListener('refreshInit', holds);

      chapters.slice(1).forEach((chapter, k) => {
        ScrollTrigger.create({
          trigger: chapter,
          start: 'top bottom',
          end: () => `top ${parseFloat(getComputedStyle(chapter).top) || 0}px`,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            arrived[k + 1] = self.progress;
            stack();
          },
        });
      });

      return () => {
        turn?.kill();
        ScrollTrigger.removeEventListener('refreshInit', holds);
        chapters.forEach((chapter) => (chapter.style.top = ''));
        cards.forEach((card) => card && (card.style.clipPath = ''));
      };
    },
    scope,
    [],
  );

  return <div ref={scope}>{children}</div>;
}
