/**
 * Motion shared by the placements variations with a carousel (stories,
 * showcase): the cards' entrance, the strip of rolling figures, and the
 * carousel's controls. Plain functions on server-rendered markup, called from
 * inside a `useMotion` setup.
 */
import { gsap } from 'gsap';
import { ease, motionTokens } from '@kishanscaler/ssx-ui/motion';

const { duration: d, stagger: st, offset } = motionTokens;

/** Seconds a card stays before the carousel moves on by itself. */
const DWELL = 5;

/** How long a digit's reel spins before it lands, and how far apart the strip's figures start. */
const ROLL = d.slowest * 2;
const FIGURE_GAP = st.base * 2;

/** After a swipe or a wheel scroll, the carousel waits this long before moving on again. */
const TOUCH_HOLD = 3;

/**
 * The cards on screen open as the faculty cards do: wiped open bottom to top
 * one after another, the photo settling from a slight zoom, then the copy and
 * the logo wall rising in, and any rolling figure in them rolling in. The
 * carousel holds still (`data-hold`) until they land, so they open on the
 * page margin.
 */
export function cardEntrance(carousel: HTMLElement, onDone: () => void) {
  const list = gsap.utils.toArray<HTMLElement>('[data-story]', carousel);
  const onScreen = list.filter((card) => card.getBoundingClientRect().left < window.innerWidth);
  if (!onScreen.length) return;

  const long = d.slower;
  const radius = getComputedStyle(onScreen[0]).getPropertyValue('--story-radius').trim() || '1rem';
  const closed = `inset(100% 0% 0% 0% round ${radius})`;
  const open = `inset(0% 0% 0% 0% round ${radius})`;
  const shown = { autoAlpha: 1, y: 0, clearProps: 'transform,opacity,visibility' };

  carousel.setAttribute('data-hold', '');
  const deck = gsap.timeline({
    defaults: { ease: ease('expressiveEntrance') },
    scrollTrigger: { trigger: carousel, start: 'clamp(top 75%)', once: true },
    onComplete: () => {
      carousel.removeAttribute('data-hold');
      onDone();
    },
  });

  // fromTo, never from(): an explicit end state survives React re-running the effect (Strict Mode).
  onScreen.forEach((card, i) => {
    const t = i * st.base * 1.5;
    const part = (name: string) => Array.from(card.querySelectorAll(`[data-part="${name}"]`));
    deck.fromTo(
      card,
      { clipPath: closed },
      { clipPath: open, duration: long * 1.25, ease: ease('expressiveInOut'), clearProps: 'clipPath' },
      t,
    );
    deck.fromTo(
      part('photo'),
      { scale: 1.18 },
      { scale: 1, duration: long * 1.5, clearProps: 'transform' },
      t,
    );
    deck.fromTo(
      [...part('title'), ...part('description'), ...part('logos')],
      { autoAlpha: 0, y: offset.reveal },
      { ...shown, duration: long, stagger: st.base * 1.5 },
      t + long * 0.45,
    );
    rollIn(card, deck, t + long * 0.6);
  });
}

/**
 * The strip comes up with one gentle fade as its figures roll in: each digit's
 * reel spins through a turn of 0–9 and lands on its digit, the figures one
 * after another. Transforms only, once.
 */
export function stripEntrance(root: HTMLElement) {
  const block = root.querySelector<HTMLElement>('[data-strip]');
  if (!block) return;
  const tl = gsap.timeline({ scrollTrigger: { trigger: block, start: 'clamp(top 85%)', once: true } });
  tl.fromTo(
    block,
    { autoAlpha: 0, y: offset.enter },
    {
      autoAlpha: 1,
      y: 0,
      duration: d.slowest,
      ease: ease('expressiveEntrance'),
      clearProps: 'transform,opacity,visibility',
    },
    0,
  );
  gsap.utils
    .toArray<HTMLElement>('[data-strip-item]', block)
    .forEach((item, i) => rollIn(item, tl, i * FIGURE_GAP));
}

/**
 * Rolls in every RollingFigure inside `target`, on `tl` from `at`: each
 * digit's reel spins through a turn of 0–9 and lands, a beat after the one
 * before it. Transforms only.
 */
export function rollIn(target: Element, tl: gsap.core.Timeline, at = 0) {
  gsap.utils.toArray<HTMLElement>('.pl-roll', target).forEach((slot, j) => {
    tl.fromTo(
      slot.querySelector('.pl-roll-reel'),
      { yPercent: 0, y: 0 },
      { yPercent: -(10 + Number(slot.dataset.digit)) * 5, duration: ROLL, ease: ease('expressiveEntrance') },
      at + j * st.base,
    );
  });
}

/**
 * The carousel's controls. The active stop is whichever the scroller rests
 * nearest, so swiping, a trackpad, a mouse drag, the arrows and the segments
 * all agree. The active segment fills over DWELL
 * seconds and the carousel moves on when it is full, wrapping round at the
 * end; it waits while the pointer is on the cards, focus is inside them, just
 * after a swipe, during the entrance (`data-hold`), and while it is off
 * screen or the tab is hidden. The segments are `data-carousel-go` buttons;
 * the fills (`data-carousel-fill`) are found in the same order, wherever they
 * are drawn.
 */
export function carouselControls(
  root: HTMLElement,
  el: HTMLElement,
  reduced: boolean,
  /** Called as a card becomes the active one (`first`: on setup, before anything is on screen). */
  onActivate?: (i: number, first: boolean) => void,
) {
  const slides = Array.from(el.children) as HTMLElement[];
  const segments = gsap.utils.toArray<HTMLElement>('[data-carousel-go]', root);
  const fills = gsap.utils.toArray<HTMLElement>('[data-carousel-fill]', root);
  const off: (() => void)[] = [];
  const listen = (
    target: EventTarget,
    type: string,
    fn: EventListener,
    options?: AddEventListenerOptions,
  ) => {
    target.addEventListener(type, fn, options);
    off.push(() => target.removeEventListener(type, fn));
  };

  let active = -1;
  let progress: gsap.core.Tween | null = null;
  let hovered = false;
  let visible = false;
  let holdUntil = 0;
  let touched: gsap.core.Tween | null = null;

  // The stops: where the row can rest, one per card until the end of the scroll
  // (a row of narrow cards on a wide screen reaches its end before its last
  // cards reach the margin, so it has fewer stops than cards). Segments past
  // the last stop are hidden. Measured again whenever the row changes size.
  let stops: number[] = [0];
  const measure = () => {
    const max = el.scrollWidth - el.clientWidth;
    const first = slides[0]?.offsetLeft ?? 0;
    stops = [];
    slides.forEach((slide) => {
      const at = Math.min(slide.offsetLeft - first, max);
      if (!stops.length || at - stops[stops.length - 1] > 2) stops.push(at);
    });
    if (!stops.length) stops = [0];
    segments.forEach((segment, i) => (segment.hidden = i >= stops.length));
  };
  const nearest = () => {
    let best = 0;
    stops.forEach((at, i) => {
      if (Math.abs(at - el.scrollLeft) < Math.abs(stops[best] - el.scrollLeft)) best = i;
    });
    return best;
  };
  const go = (i: number) => {
    const n = stops.length;
    el.scrollTo({ left: stops[((i % n) + n) % n], behavior: reduced ? 'auto' : 'smooth' });
  };

  const update = () => {
    if (!progress) return;
    const busy =
      hovered ||
      el.contains(document.activeElement) ||
      performance.now() < holdUntil ||
      el.hasAttribute('data-hold') ||
      !visible ||
      document.hidden;
    if (busy) progress.pause();
    else progress.play();
  };

  const setActive = (i: number) => {
    if (i === active) return;
    const first = active < 0;
    active = i;
    onActivate?.(i, first);
    segments.forEach((s, j) => s.setAttribute('aria-current', String(j === i)));
    progress?.kill();
    progress = null;
    fills.forEach((fill, j) => j !== i && gsap.set(fill, { scaleX: 0 }));
    if (reduced) {
      if (fills[i]) gsap.set(fills[i], { scaleX: 1 });
      return;
    }
    // With no fill drawn for it (no indicator), the dwell is timed on a stand-in.
    progress = gsap.fromTo(
      fills[i] ?? { scaleX: 0 },
      { scaleX: 0 },
      { scaleX: 1, duration: DWELL, ease: ease('linear'), paused: true, onComplete: () => go(active + 1) },
    );
    update();
  };

  let frame = 0;
  listen(
    el,
    'scroll',
    () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setActive(nearest()));
    },
    { passive: true },
  );
  listen(el, 'pointerenter', (e) => {
    if ((e as PointerEvent).pointerType !== 'mouse') return;
    hovered = true;
    update();
  });
  listen(el, 'pointerleave', () => {
    hovered = false;
    update();
  });
  const hold = () => {
    holdUntil = performance.now() + TOUCH_HOLD * 1000;
    touched?.kill();
    touched = gsap.delayedCall(TOUCH_HOLD + 0.05, update);
    update();
  };
  listen(el, 'pointerdown', hold);
  listen(el, 'touchmove', hold, { passive: true });
  listen(el, 'wheel', hold, { passive: true });

  // A mouse drags the row (touch and trackpads scroll it natively). Snapping is
  // off while dragging, so the row follows the pointer; on release it settles
  // on the next card in the drag's direction, and snapping comes back once it
  // has. The click that ends a drag is swallowed, so a drag over a link doesn't
  // follow it.
  let drag: { x: number; left: number; from: number; moved: boolean } | null = null;
  let swallowClick = false;
  listen(el, 'pointerdown', (e) => {
    const p = e as PointerEvent;
    swallowClick = false;
    if (p.pointerType !== 'mouse' || p.button !== 0) return;
    drag = { x: p.clientX, left: el.scrollLeft, from: Math.max(0, active), moved: false };
  });
  listen(window, 'pointermove', (e) => {
    if (!drag) return;
    const dx = (e as PointerEvent).clientX - drag.x;
    if (!drag.moved) {
      if (Math.abs(dx) < 4) return;
      drag.moved = true;
      el.style.scrollSnapType = 'none';
      el.setAttribute('data-dragging', '');
    }
    el.scrollLeft = drag.left - dx;
  });
  listen(window, 'pointerup', () => {
    if (!drag) return;
    const { moved, left, from } = drag;
    drag = null;
    if (!moved) return;
    swallowClick = true;
    el.removeAttribute('data-dragging');
    const travelled = el.scrollLeft - left;
    let target = nearest();
    if (target === from && Math.abs(travelled) > 40) target = from + Math.sign(travelled);
    target = Math.min(stops.length - 1, Math.max(0, target));
    const snapBack = () => (el.style.scrollSnapType = '');
    el.addEventListener('scrollend', snapBack, { once: true });
    gsap.delayedCall(1, snapBack);
    el.scrollTo({ left: stops[target], behavior: reduced ? 'auto' : 'smooth' });
    hold();
  });
  listen(
    el,
    'click',
    (e) => {
      if (!swallowClick) return;
      swallowClick = false;
      e.preventDefault();
      e.stopPropagation();
    },
    { capture: true },
  );
  listen(el, 'dragstart', (e) => e.preventDefault());
  listen(el, 'focusin', update);
  listen(el, 'focusout', () => requestAnimationFrame(update));
  listen(document, 'visibilitychange', update);

  root.querySelectorAll<HTMLElement>('[data-carousel-step]').forEach((button) => {
    listen(button, 'click', () => go(active + Number(button.dataset.carouselStep)));
  });
  segments.forEach((segment, i) => listen(segment, 'click', () => go(i)));

  const ro = new ResizeObserver(() => {
    measure();
    setActive(nearest());
  });
  ro.observe(el);
  measure();

  const io = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    update();
  });
  io.observe(el);
  setActive(nearest());

  return {
    update,
    active: () => active,
    cleanup: () => {
      cancelAnimationFrame(frame);
      io.disconnect();
      ro.disconnect();
      segments.forEach((segment) => (segment.hidden = false));
      off.forEach((fn) => fn());
      progress?.kill();
      touched?.kill();
      el.removeAttribute('data-hold');
    },
  };
}
