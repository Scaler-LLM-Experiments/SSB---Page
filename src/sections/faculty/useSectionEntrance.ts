'use client';

import * as React from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { ease, motionTokens, prefersReducedMotion, useMotion } from '@kishanscaler/ssx-ui/motion';

const { duration: d, stagger: st, offset } = motionTokens;

/**
 * The premium entrance for a section with a header and a row of story cards,
 * in two moments, each played once when its part is on screen: the header as
 * it comes up, the cards once their row is a quarter of the way up the screen
 * (triggered by the section as a whole, the cards wiped open below the fold).
 * Built from the SSX motion tokens (durations, curves, offsets) so it moves
 * like the rest of the system.
 *
 *   1. Eyebrow fades up.
 *   2. Headline rises line by line out of a mask.
 *   3. Subtext and controls follow.
 *   4. Cards wipe open bottom-to-top one after another while each photo
 *      settles from a slight zoom, then its name, role and logos rise in.
 *
 * Mark the header block with data-enter="header", its parts with
 * data-enter="eyebrow|headline|sub|controls", and give
 * cards data-part="photo|title|description|logos" (StoryCard does).
 * Under reduced motion everything is simply shown.
 */
export function useSectionEntrance(scope: React.RefObject<HTMLElement | null>) {
  useMotion(
    () => {
      const root = scope.current;
      if (!root || prefersReducedMotion(root)) return;
      gsap.registerPlugin(ScrollTrigger, SplitText);

      const q = gsap.utils.selector(root);
      const cards = q('.ssx-card');
      const headline = q('[data-enter="headline"]')[0];
      const split = headline ? SplitText.create(headline, { type: 'lines', mask: 'lines', aria: 'auto' }) : null;

      const enter = ease('expressiveEntrance');
      const long = d.slower; // 0.5s
      const radius = getComputedStyle(cards[0] ?? root).getPropertyValue('--card-radius').trim() || '0.5rem';
      const closed = `inset(100% 0% 0% 0% round ${radius})`;
      const open = `inset(0% 0% 0% 0% round ${radius})`;

      // clamp() keeps each start reachable when the section ends the page.
      const tl = gsap.timeline({
        defaults: { ease: enter },
        scrollTrigger: { trigger: q('[data-enter="header"]')[0] ?? root, start: 'clamp(top 85%)', once: true },
      });
      // Only the cards on screen play; the rest of the row (and its looping copy)
      // is open long before the ticker brings it round. The row holds still until
      // they land (HScroller waits on data-hold), so they open on the page margin.
      const row = cards[0]?.closest('ul');
      const onScreen = cards.filter((card) => card.getBoundingClientRect().left < window.innerWidth);
      row?.setAttribute('data-hold', '');
      const deck = gsap.timeline({
        defaults: { ease: enter },
        scrollTrigger: { trigger: row ?? root, start: 'clamp(top 75%)', once: true },
        onComplete: () => row?.removeAttribute('data-hold'),
      });

      // fromTo, never from(): an explicit end state survives React re-running
      // the effect (Strict Mode), where from() would read a half-hidden value.
      const shown = { autoAlpha: 1, y: 0, clearProps: 'transform,opacity,visibility' };
      tl.fromTo(q('[data-enter="eyebrow"]'), { autoAlpha: 0, y: offset.enter }, { ...shown, duration: d.slow });
      if (split) {
        // A line mask is exactly one line tall, which clips descenders (the
        // "y" in "Faculty"). Give each mask room below the baseline without
        // moving the layout, and drop the split once the lines have landed.
        gsap.set(split.masks, { paddingBottom: '0.15em', marginBottom: '-0.15em' });
        tl.fromTo(
          split.lines,
          { yPercent: 110 },
          { yPercent: 0, duration: long, stagger: st.base * 2, onComplete: () => split.revert() },
          '<0.05',
        );
      }
      tl.fromTo(
        q('[data-enter="sub"], [data-enter="controls"]'),
        { autoAlpha: 0, y: offset.reveal },
        { ...shown, duration: long, stagger: st.base },
        '<0.15',
      );

      // Cards one stagger apart (absolute times).
      const gap = st.base * 1.5;
      onScreen.forEach((card, i) => {
        const t = i * gap;
        const part = (name: string) => Array.from(card.querySelectorAll(`[data-part="${name}"]`));
        deck.fromTo(
          card,
          { clipPath: closed },
          { clipPath: open, duration: long * 1.25, ease: ease('expressiveInOut'), clearProps: 'clipPath' },
          t,
        );
        deck.fromTo(part('photo'), { scale: 1.18 }, { scale: 1, duration: long * 1.5, clearProps: 'transform' }, t);
        deck.fromTo(
          [...part('title'), ...part('description'), ...part('logos')],
          { autoAlpha: 0, y: offset.reveal },
          { ...shown, duration: long, stagger: st.base * 1.5 },
          t + long * 0.45,
        );
      });

      return () => {
        split?.revert();
        row?.removeAttribute('data-hold');
      };
    },
    scope,
    [],
  );
}
