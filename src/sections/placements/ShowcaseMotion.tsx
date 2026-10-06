'use client';

import * as React from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ease, motionTokens, prefersReducedMotion, useMotion } from '@kishanscaler/ssx-ui/motion';

import { useSectionEntrance } from '@/sections/faculty/useSectionEntrance';
import { fadeControls, stripEntrance } from './carousel';

const { duration: d, stagger: st, offset } = motionTokens;

/** Seconds the recruiters' boxes hold a set of logos before moving on to the next. */
const CYCLE = 4;

/**
 * The recruiters' boxes (`data-logo-box`, each a stack of `data-logo`, one per
 * set): every CYCLE seconds they all move on to the next set together, each
 * crossfading in place. The count starts when the boxes come on screen (and
 * again when the tab comes back), so the first change is CYCLE seconds after
 * they are seen; it stops while they are off screen or the tab is hidden. No
 * pause under the pointer (the team's call: it read as the cycle being slow;
 * the logos are in colour already, so pointing at one needs nothing to wait
 * for). Still under reduced motion (the first set, as the CSS shows it).
 * Returns its cleanup.
 */
function cycleBoxes(root: HTMLElement, reduced: boolean) {
  const grid = root.querySelector<HTMLElement>('[data-logo-boxes]');
  const stacks = gsap.utils
    .toArray<HTMLElement>('[data-logo-box]', root)
    .map((box) => gsap.utils.toArray<HTMLElement>('[data-logo]', box));
  const sets = Math.max(0, ...stacks.map((stack) => stack.length));
  if (!grid || reduced || sets < 2) return () => {};

  let k = 0;
  let visible = false;
  stacks.forEach((stack) => stack.forEach((logo, j) => gsap.set(logo, { autoAlpha: j ? 0 : 1 })));
  const advance = () => {
    const next = (k + 1) % sets;
    stacks.forEach((stack) => {
      // A box with fewer logos than there are sets shows its last again, so wrap.
      const out = stack[k % stack.length];
      const into = stack[next % stack.length];
      if (out === into) return;
      // A plain crossfade (the team's call): the old logo out as the new comes in, in place.
      gsap.to(out, { autoAlpha: 0, duration: d.slower, ease: ease('productiveInOut'), overwrite: true });
      gsap.fromTo(
        into,
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: d.slower, ease: ease('productiveInOut'), overwrite: true },
      );
    });
    k = next;
  };
  let call: gsap.core.Tween | null = null;
  const stop = () => {
    call?.kill();
    call = null;
  };
  const start = () => {
    stop();
    if (!visible || document.hidden) return;
    call = gsap.delayedCall(CYCLE, () => {
      advance();
      start();
    });
  };
  const io = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    start();
  });
  io.observe(grid);
  document.addEventListener('visibilitychange', start);
  return () => {
    stop();
    io.disconnect();
    document.removeEventListener('visibilitychange', start);
  };
}

/**
 * The showcase variation's motion, on the server-rendered markup in
 * PlacementsShowcase, found by `data-*` hooks:
 *
 *   data-enter        the header: the faculty section's entrance (useSectionEntrance)
 *   data-deck         the cards and the chips over them: the pointer anywhere on it pauses the carousel
 *   data-carousel     the photo cards (data-story), stacked and crossfaded (fadeControls)
 *   data-switch       the chips (data-carousel-go, each with its data-carousel-fill), in data-chip-row
 *   data-slide        a card's figure, slid up into its line
 *   data-strip        the recruiters under the cards: one gentle fade
 *   data-logo-box     a recruiters' box: its logos cycle in sets (cycleBoxes)
 *
 * A card comes round by fading in over the one before it (the team's call:
 * a fade, not a slide), its photo settling from a slight zoom, its figure
 * sliding up into place, then its claim and its floating column rising in;
 * its chip lights and, if the row overflows, is scrolled into view. The
 * first card opens as the faculty cards do, the chips fading in with it.
 * Under reduced motion nothing moves by itself: cards change at once, only
 * from a chip or a swipe.
 */
export function ShowcaseMotion({ children }: { children: React.ReactNode }) {
  const scope = React.useRef<HTMLDivElement>(null);

  // The header moves exactly as the faculty section's does.
  useSectionEntrance(scope);

  useMotion(
    () => {
      const root = scope.current;
      const deck = root?.querySelector<HTMLElement>('[data-deck]');
      const carousel = deck?.querySelector<HTMLElement>('[data-carousel]');
      const switcher = deck?.querySelector<HTMLElement>('[data-switch]');
      const row = deck?.querySelector<HTMLElement>('[data-chip-row]');
      if (!root || !deck || !carousel || !switcher || !row) return;
      gsap.registerPlugin(ScrollTrigger);
      const reduced = prefersReducedMotion(root);
      const slides = Array.from(carousel.children) as HTMLElement[];
      const chips = gsap.utils.toArray<HTMLElement>('[data-carousel-go]', switcher);
      const parts = (slide: HTMLElement, name: string) =>
        Array.from(slide.querySelectorAll(`[data-part="${name}"]`));
      const shown = { autoAlpha: 1, y: 0, clearProps: 'transform,opacity,visibility' };

      // A card's content arriving, on `tl` from `at`: its figure slides up into its line, then
      // its claim and its floating column rise in.
      const arrive = (slide: HTMLElement, tl: gsap.core.Timeline, at: number) => {
        tl.fromTo(
          slide.querySelectorAll('[data-slide]'),
          { yPercent: 110 },
          { yPercent: 0, duration: d.slower, ease: ease('expressiveEntrance'), clearProps: 'transform' },
          at,
        );
        tl.fromTo(
          [...parts(slide, 'title'), ...parts(slide, 'logos')],
          { autoAlpha: 0, y: offset.reveal },
          { ...shown, duration: d.slower, ease: ease('expressiveEntrance'), stagger: st.base * 1.5 },
          at + d.slow * 0.4,
        );
      };

      // The chip on show, centred in its row when the row scrolls (a phone); the row's own
      // scroll, never the page's.
      const reveal = (i: number, animate: boolean) => {
        const chip = chips[i];
        if (!chip || row.scrollWidth <= row.clientWidth) return;
        row.scrollTo({
          left: chip.offsetLeft - (row.clientWidth - chip.offsetWidth) / 2,
          behavior: animate && !reduced ? 'smooth' : 'auto',
        });
      };

      let swap: gsap.core.Timeline | null = null;
      const controls = fadeControls(
        root,
        carousel,
        reduced,
        (i, from) => {
          reveal(i, from >= 0);
          // A change while the last is still drawing finishes the last at once.
          swap?.progress(1);
          swap = null;
          if (from < 0 || reduced) {
            slides.forEach((slide, j) =>
              gsap.set(slide, { autoAlpha: j === i ? 1 : 0, zIndex: j === i ? 2 : 0 }),
            );
            return;
          }
          const next = slides[i];
          const last = slides[from];
          gsap.set(last, { zIndex: 1 });
          gsap.set(next, { zIndex: 2 });
          // The new card fades in over the old, whose photo stays whole under it (two half-faded
          // cards would let the page show through mid-fade); the old card's figure, claim and
          // logos fade out first, or they would show through the new one. Then the old is hidden.
          const leaving = [
            ...last.querySelectorAll('[data-slide]'),
            ...parts(last, 'title'),
            ...parts(last, 'logos'),
          ];
          swap = gsap.timeline({
            onComplete: () => {
              gsap.set(last, { autoAlpha: 0, zIndex: 0 });
              gsap.set(leaving, { clearProps: 'opacity,visibility' });
            },
          });
          swap.to(leaving, { autoAlpha: 0, duration: d.fast, ease: ease('productiveInOut') }, 0);
          swap.fromTo(
            next,
            { autoAlpha: 0 },
            { autoAlpha: 1, duration: d.slower, ease: ease('productiveInOut') },
            0,
          );
          swap.fromTo(
            parts(next, 'photo'),
            { scale: 1.06 },
            {
              scale: 1,
              duration: d.slowest * 1.5,
              ease: ease('expressiveEntrance'),
              clearProps: 'transform',
            },
            0,
          );
          arrive(next, swap, d.slow * 0.5);
        },
        deck,
      );
      switcher.setAttribute('data-ready', '');
      const stopBoxes = cycleBoxes(root, reduced);

      if (!reduced) {
        stripEntrance(root);
        // The first card opens as the faculty cards do: wiped open bottom to top, its photo
        // settling from a zoom, its content arriving; the carousel waits until it has.
        const first = slides[0];
        const card = first?.querySelector<HTMLElement>('[data-story]');
        if (first && card) {
          const radius = getComputedStyle(card).getPropertyValue('--story-radius').trim() || '1rem';
          carousel.setAttribute('data-hold', '');
          const tl = gsap.timeline({
            scrollTrigger: { trigger: carousel, start: 'clamp(top 75%)', once: true },
            onComplete: () => {
              carousel.removeAttribute('data-hold');
              controls.update();
            },
          });
          tl.fromTo(
            card,
            { clipPath: `inset(100% 0% 0% 0% round ${radius})` },
            {
              clipPath: `inset(0% 0% 0% 0% round ${radius})`,
              duration: d.slower * 1.25,
              ease: ease('expressiveInOut'),
              clearProps: 'clipPath',
            },
            0,
          );
          tl.fromTo(
            parts(first, 'photo'),
            { scale: 1.18 },
            { scale: 1, duration: d.slower * 1.5, ease: ease('expressiveEntrance'), clearProps: 'transform' },
            0,
          );
          arrive(first, tl, d.slower * 0.45);
          // Each chip fades itself, not their row: a parent below full opacity would cut off what
          // their frosted glass blurs.
          tl.fromTo(
            chips,
            { autoAlpha: 0, y: offset.reveal },
            { ...shown, duration: d.slower, ease: ease('expressiveEntrance') },
            d.slower * 0.6,
          );
        }
      }
      return () => {
        stopBoxes();
        swap?.kill();
        switcher.removeAttribute('data-ready');
        controls.cleanup();
        gsap.set(slides, { clearProps: 'opacity,visibility,zIndex' });
      };
    },
    scope,
    [],
  );

  return <div ref={scope}>{children}</div>;
}
