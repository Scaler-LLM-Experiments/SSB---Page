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
 * Anything else in the section marked data-enter="block" (Alumni's logo
 * ticker) fades up on its own once it is on screen.
 *
 * Mark the header block with data-enter="header", its parts with
 * data-enter="eyebrow|headline|sub|controls", and give card parts
 * data-part="photo|title|description|logos|action" (MeetCard does; a package
 * CardMedia's image counts as the photo). Pass `decks` for more than one group.
 * Under reduced motion everything is simply shown.
 */
export function useSectionEntrance(
  scope: React.RefObject<HTMLElement | null>,
  {
    decks = ['.ssx-card'],
  }: {
    /**
     * One selector per group of cards that wipe open together. Each group plays
     * when its row (the cards' `ul`, or the first card) is a quarter of the way
     * up the screen. Faculty has one; the Innovation Lab has its stat cards,
     * the startups panel, and the startup cards inside it.
     */
    decks?: string[];
  } = {},
) {
  useMotion(
    () => {
      const root = scope.current;
      if (!root || prefersReducedMotion(root)) return;
      gsap.registerPlugin(ScrollTrigger, SplitText);

      const q = gsap.utils.selector(root);
      const headline = q('[data-enter="headline"]')[0];
      const split = headline
        ? SplitText.create(headline, { type: 'lines', mask: 'lines', aria: 'auto' })
        : null;

      const enter = ease('expressiveEntrance');
      const long = d.slower; // 0.5s

      // clamp() keeps each start reachable when the section ends the page.
      const tl = gsap.timeline({
        defaults: { ease: enter },
        scrollTrigger: {
          trigger: q('[data-enter="header"]')[0] ?? root,
          start: 'clamp(top 85%)',
          once: true,
        },
      });

      // fromTo, never from(): an explicit end state survives React re-running
      // the effect (Strict Mode), where from() would read a half-hidden value.
      const shown = { autoAlpha: 1, y: 0, clearProps: 'transform,opacity,visibility' };
      tl.fromTo(
        q('[data-enter="eyebrow"]'),
        { autoAlpha: 0, y: offset.enter },
        { ...shown, duration: d.slow },
      );
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

      // Blocks below the cards: each fades up as it comes on screen.
      q('[data-enter="block"]').forEach((block) => {
        gsap.fromTo(
          block,
          { autoAlpha: 0, y: offset.reveal },
          {
            ...shown,
            duration: long,
            ease: enter,
            scrollTrigger: { trigger: block, start: 'clamp(top 85%)', once: true },
          },
        );
      });

      // The decks: each card wipes open bottom to top, one stagger apart, its
      // photo settling from a slight zoom while its text rises in.
      const held: Element[] = [];
      const gap = st.base * 1.5;
      // A deck card can sit inside another (the Innovation Lab's startup cards
      // inside its panel). Tag every deck card so each one animates only the
      // parts whose nearest deck card is itself.
      decks.forEach((selector) => q(selector).forEach((card) => card.setAttribute('data-deck-card', '')));
      decks.forEach((selector) => {
        // Only cards actually on the page at this width: the phone stack and the
        // desktop row are both in the DOM, one of them display:none. Animating
        // the hidden ones first made the visible cards start late.
        const cards = q(selector).filter((c) => (c as HTMLElement).offsetParent !== null);
        if (!cards.length) return;
        // Only the cards on screen play; the rest of a row (and a looping copy)
        // is open long before it scrolls round. A ticker row holds still until
        // they land (HScroller waits on data-hold), so they open on the margin.
        const onScreen = cards.filter((card) => card.getBoundingClientRect().left < window.innerWidth);
        const row = cards[0].closest('ul');
        if (row) {
          row.setAttribute('data-hold', '');
          held.push(row);
        }
        const deck = gsap.timeline({
          defaults: { ease: enter },
          scrollTrigger: { trigger: row ?? cards[0], start: 'clamp(top 75%)', once: true },
          onComplete: () => row?.removeAttribute('data-hold'),
        });
        onScreen.forEach((card, i) => {
          const t = i * gap;
          const radius = getComputedStyle(card).borderTopLeftRadius || '0px';
          const part = (sel: string) =>
            Array.from(card.querySelectorAll(sel)).filter((el) => el.closest('[data-deck-card]') === card);
          deck.fromTo(
            card,
            { clipPath: `inset(100% 0% 0% 0% round ${radius})` },
            {
              clipPath: `inset(0% 0% 0% 0% round ${radius})`,
              duration: long * 1.25,
              ease: ease('expressiveInOut'),
              clearProps: 'clipPath',
            },
            t,
          );
          deck.fromTo(
            part('[data-part="photo"], [data-slot="card-media"] img'),
            { scale: 1.18 },
            { scale: 1, duration: long * 1.5, clearProps: 'transform' },
            t,
          );
          deck.fromTo(
            part('[data-part="title"], [data-part="description"], [data-part="logos"], [data-part="action"]'),
            { autoAlpha: 0, y: offset.reveal },
            { ...shown, duration: long, stagger: st.base * 1.5 },
            t + long * 0.45,
          );
        });
      });

      return () => {
        split?.revert();
        held.forEach((row) => row.removeAttribute('data-hold'));
        decks.forEach((selector) => q(selector).forEach((card) => card.removeAttribute('data-deck-card')));
      };
    },
    scope,
    [],
  );
}
