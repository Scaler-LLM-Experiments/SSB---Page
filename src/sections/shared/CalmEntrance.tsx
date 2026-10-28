'use client';

import * as React from 'react';

/**
 * One appear animation for the deck pages (2026-10-28, the user's asks: "remove every appear
 * animation; a minimal, subtle one, the same for all", then "the cards' appear refined, the same for
 * every card"). On `main[data-entrance="calm"]` the sections' own entrances stand down
 * (useSectionEntrance, the breakers, the lab's, the placements'), and:
 *
 * - every card comes in on its own as it reaches the screen: a 24px rise and fade over 1.1s on a soft
 *   ease-out; cards arriving together come in left to right, 80ms apart (a row reads as one sweep);
 *   cards off to the side (a carousel's, a drifting row's) are simply shown;
 * - a section with no cards fades up 16px over 700ms as it comes on screen; a section with cards
 *   doesn't fade as a whole, so the cards' motion is the only one.
 *
 * Anything on screen at load is left alone; nothing is hidden under reduced motion (deck.css).
 */

/** Cards: rounded boxes with a fill or an edge, card-sized, not inside another card. */
function cardsIn(block: HTMLElement) {
  const sw = block.getBoundingClientRect().width;
  const cards: HTMLElement[] = [];
  block.querySelectorAll<HTMLElement>('*').forEach((el) => {
    if (el.matches('img, video, canvas, svg, picture, button')) return;
    if (cards.some((c) => c.contains(el))) return;
    const st = getComputedStyle(el);
    if (parseFloat(st.borderTopLeftRadius) < 6 || st.position === 'fixed') return;
    const filled = st.backgroundColor !== 'rgba(0, 0, 0, 0)' || st.backgroundImage !== 'none';
    const edged = parseFloat(st.borderTopWidth) > 0 && st.borderTopColor !== 'rgba(0, 0, 0, 0)';
    if (!filled && !edged) return;
    const r = el.getBoundingClientRect();
    if (r.width < 120 || r.height < 80 || r.width > sw * 0.92) return;
    cards.push(el);
  });
  return cards;
}

export function CalmEntrance() {
  React.useEffect(() => {
    const main = document.querySelector<HTMLElement>('main[data-entrance="calm"]');
    if (!main || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const sections = new Set<HTMLElement>();
    const cards = new Set<HTMLElement>();
    const line = () => window.innerHeight * 0.92;

    // run straight from the scroll event (a few dozen reads), not a frame callback: frames don't come in
    // a page that isn't being painted, and nothing may stay hidden for want of one
    const check = () => {
      const y = line();
      const vw = window.innerWidth;
      sections.forEach((s) => {
        if (s.getBoundingClientRect().top < y) {
          s.setAttribute('data-calm', 'in');
          sections.delete(s);
        }
      });
      const arriving: { el: HTMLElement; left: number }[] = [];
      cards.forEach((c) => {
        const r = c.getBoundingClientRect();
        if (r.top >= y) return;
        cards.delete(c);
        if (r.left > vw || r.right < 0) {
          // off to the side: shown, no motion
          c.removeAttribute('data-calm-card');
          return;
        }
        arriving.push({ el: c, left: r.left });
      });
      arriving
        .sort((a, b) => a.left - b.left)
        .forEach(({ el }, i) => {
          el.style.setProperty('--calm-d', `${Math.min(i, 5) * 80}ms`);
          el.setAttribute('data-calm-card', 'in');
        });
    };

    const seen = new WeakSet<Element>();
    // the blocks (the innermost substantial sections), scanned again as sections arrive (the
    // curriculum renders in the browser, after load)
    const scan = () => {
      const blocks = [...main.querySelectorAll<HTMLElement>('section')].filter(
        (s) => ![...s.querySelectorAll<HTMLElement>('section')].some((c) => c.offsetHeight > 300),
      );
      blocks.forEach((b) => {
        if (seen.has(b)) return;
        seen.add(b);
        const found = cardsIn(b).filter((c) => c.getBoundingClientRect().top >= line());
        if (found.length) {
          found.forEach((c) => {
            c.setAttribute('data-calm-card', 'out');
            cards.add(c);
          });
          return;
        }
        if (b.getBoundingClientRect().top < line()) return;
        b.setAttribute('data-calm', 'out');
        sections.add(b);
      });
    };

    // anything left waiting by an earlier pass (React runs effects twice in development) is let go
    main.querySelectorAll('[data-calm="out"]').forEach((el) => el.removeAttribute('data-calm'));
    main.querySelectorAll('[data-calm-card]').forEach((el) => el.removeAttribute('data-calm-card'));
    scan();
    check();
    window.addEventListener('scroll', check, { passive: true });
    window.addEventListener('resize', check);
    let t = 0;
    const mo = new MutationObserver(() => {
      window.clearTimeout(t);
      t = window.setTimeout(() => {
        scan();
        check();
      }, 150);
    });
    mo.observe(main, { childList: true, subtree: true });
    return () => {
      window.removeEventListener('scroll', check);
      window.removeEventListener('resize', check);
      mo.disconnect();
      window.clearTimeout(t);
    };
  }, []);
  return null;
}
