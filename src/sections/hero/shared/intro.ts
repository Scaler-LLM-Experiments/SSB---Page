import { gsap } from 'gsap';
import { ease, motionTokens, prefersReducedMotion } from '@kishanscaler/ssx-ui/motion';

/**
 * The splash-to-hero intro shared by the cinematic variations: zoom into the
 * SSB mark and land on campus. Call it from a variation's motion component,
 * inside `useMotion`. It works on server-rendered markup found by `data-*` hooks:
 *
 *   splash, splash-lens, splash-zoom, splash-mark, splash-ghost                  the Splash
 *   video-slot, video-card, video-frame                                           the hero's video
 *   hero-nav (its contents), and every data-hero-fade block                         what fades in
 *
 * Sequence:
 *   1. The SSB shield is on screen from the first paint (it settles in with
 *      CSS). As soon as it has settled and the film can play, its openings
 *      look through to the hero's video, moved full-screen behind the splash:
 *      the footage fades up and plays inside the logo while it holds. The
 *      zoom waits for the fonts too, and for the shield to have been seen
 *      (LOGO_HOLD).
 *   2. swap   The camera starts to drift the opening it flies into to the
 *             centre of the screen.
 *   3. zoom   At once, the camera eases into the middle of the shield and
 *             builds to a fast, motion-blurred rush through it ("zoop"), the
 *             shield dissolving as it goes, until the footage fills the screen
 *             eases back to its natural size.
 *   4. land   While the mark is still leaving, the footage (seen through its
 *             window) is already travelling to its place in the hero: it
 *             launches with the zoom's speed and decelerates into the slot, on
 *             every screen size. The nav, copy and facts fade in together
 *             (`enter`). One gentle fade, no parts moving.
 *
 * Every phase overlaps the next, so motion never stops and restarts. The
 * variation adds its own tweens through `media`, at those labels. Durations
 * and curves are SSX motion tokens; the blur amounts are named below.
 */

const { duration } = motionTokens;

/** The SSB mark in its viewBox units, and the point the camera flies into: the
 * opening nearest the mark's middle, on its vertical centre line (inside the
 * cube's front face, 1.8 units clear), found by a distance transform over the
 * mark's shape. On the centre line, so the zoom goes straight in. */
const MARK = { width: 29, height: 40, opening: { x: 14.45, y: 22.5 } };

/** How far the camera flies: enough for that opening to cover any viewport. */
const ZOOM = 180;

/** The ghosts trail the zoom by these shares of its distance (in log scale). */
const GHOST_LAG = [0.1, 0.2];

/** Peak motion blur on the mark as the camera rushes through it, in px on screen. */
const LENS_BLUR = 14;

/** The shield holds on screen this long after navigation before the zoom, in
 * ms, so it registers as the brand before the camera flies into it. */
const LOGO_HOLD = 1250;

/** Longest the splash waits for the video before zooming in anyway, in ms. */
const VIDEO_WAIT = 4000;

export type Get = (hook: string) => HTMLElement | null;

/** Finds a hook inside the hero first, then on the page: the sticky nav lives at
 * page level, since a sticky bar only sticks within its parent. */
export const hooksIn =
  (root: HTMLElement): Get =>
  (hook) =>
    root.querySelector<HTMLElement>(`[data-${hook}]`) ??
    document.querySelector<HTMLElement>(`[data-${hook}]`);

type IntroOptions = {
  /** Adds the variation's own tweens to the timeline, at `swap`, `zoom`, `land` or `enter`. */
  media?: (tl: gsap.core.Timeline, get: Get) => void;
  /** Runs once the page can scroll: after the intro, or at once when there is none. */
  onDone: () => void;
};

/** Starts the intro. Returns a cleanup for `useMotion`. */
export function runIntro(root: HTMLElement, context: gsap.Context, { media, onDone }: IntroOptions) {
  const get = hooksIn(root);
  const splash = get('splash');
  let alive = true;

  // No splash, or reduced motion: a static page, nothing hidden.
  if (!splash || prefersReducedMotion(root)) {
    if (splash) gsap.set(splash, { display: 'none' });
    root.querySelectorAll('video').forEach((video) => video.pause());
    onDone();
    return () => {};
  }

  // Take the splash over from its CSS fallback and hold the page at the top.
  gsap.set(splash, { animation: 'none' });
  window.scrollTo(0, 0);
  const unlock = holdScroll();

  // The card's resting corners, read before the window squares them off.
  const card = get('video-card');
  const restRadius = card ? getComputedStyle(card).borderTopLeftRadius : '0px';

  // The film starts playing inside the logo as soon as both are ready.
  const opened = Promise.all([settled(get('splash-mark')), videoReady(root)]).then(() => {
    if (alive) context.add(() => openWindow(root, get));
  });

  Promise.all([document.fonts.ready, opened, untilTime(LOGO_HOLD)]).then(() => {
    if (!alive) return;
    context.add(() => {
      const tl = introTimeline(root, get, restRadius, () => {
        unlock();
        if (alive) context.add(onDone);
      });
      media?.(tl, get);
    });
  });

  return () => {
    alive = false;
    unlock();
  };
}

/**
 * Holds the page still during the intro by swallowing wheel, touch and
 * scrolling keys. Not `overflow: hidden`: that hides a visible scrollbar, and
 * when it comes back the page narrows and everything jumps sideways. Returns
 * the release (safe to call twice).
 */
function holdScroll(): () => void {
  const scrollKeys = new Set([' ', 'PageDown', 'PageUp', 'ArrowDown', 'ArrowUp', 'Home', 'End']);
  const block = (event: Event) => event.preventDefault();
  const blockKeys = (event: KeyboardEvent) => {
    if (scrollKeys.has(event.key)) event.preventDefault();
  };
  window.addEventListener('wheel', block, { passive: false });
  window.addEventListener('touchmove', block, { passive: false });
  window.addEventListener('keydown', blockKeys);
  return () => {
    window.removeEventListener('wheel', block);
    window.removeEventListener('touchmove', block);
    window.removeEventListener('keydown', blockKeys);
  };
}

/** What fades in once the footage lands: the nav's contents, then each block of
 * copy. The nav bar itself stays solid (a half-faded dark bar over the light
 * page is grey). */
function arrivals(root: HTMLElement, get: Get): HTMLElement[] {
  const nav = get('hero-nav');
  return [
    ...(nav ? Array.from(nav.children as HTMLCollectionOf<HTMLElement>) : []),
    ...gsap.utils.toArray<HTMLElement>('[data-hero-fade]', root),
  ];
}

/**
 * Opens the shield's window: the ground gets the mark's outline cut out of it,
 * and the hero's video, moved full-screen behind the splash (a little too close,
 * so the zoom can ease it back), fades up in the mark's openings. What would
 * show through before it has faded up is hidden until it arrives.
 */
function openWindow(root: HTMLElement, get: Get) {
  const splash = get('splash')!;
  const mark = get('splash-mark')!;
  const slot = get('video-slot');
  const card = get('video-card');
  const hole = shieldOutline(splash);

  gsap.set(arrivals(root, get), { autoAlpha: 0 });
  if (hole) {
    gsap.set(splash, {
      '--shield-hole': hole,
      '--shield-height': `${mark.getBoundingClientRect().height}px`,
      attr: { 'data-open': '' },
    });
  }
  if (!card || !slot) return;

  const slotBox = slot.getBoundingClientRect();
  // Full-screen, the footage rides above the sticky nav; it drops back under
  // once it has settled.
  const above = getComputedStyle(document.documentElement).getPropertyValue('--z-overlay').trim();
  gsap.set(slot, { zIndex: above });
  gsap.set(card, {
    left: -slotBox.left,
    top: -slotBox.top,
    width: window.innerWidth,
    height: window.innerHeight,
    borderRadius: 0,
  });
  gsap.set(get('video-frame'), { scale: 1 / motionTokens.scale.enter ** 4 });
  gsap.fromTo(
    card,
    { autoAlpha: 0 },
    { autoAlpha: 1, duration: duration.slower, ease: ease('expressiveInOut') },
  );
}

function introTimeline(root: HTMLElement, get: Get, restRadius: string, onComplete: () => void) {
  const splash = get('splash')!;
  const zoomLayer = get('splash-zoom')!;
  const ghosts = gsap.utils.toArray<HTMLElement>('[data-splash-ghost]', root);
  const mark = get('splash-mark')!;
  const slot = get('video-slot');
  const card = get('video-card');
  const frame = get('video-frame');
  const smooth = ease('expressiveInOut');
  const zoom = duration.slowest * 1.1;
  const settle = duration.slowest * 1.25;
  // The landing starts as the mark begins to leave, so the footage is already
  // moving when the mark is gone: no pause between the two.
  const overlap = duration.slow;

  const tl = gsap.timeline({ onComplete });

  // swap: the camera lines up on the opening it flies into.
  const box = mark.getBoundingClientRect();
  const unit = box.height / MARK.height;
  const opening = {
    x: box.left + (box.width - MARK.width * unit) / 2 + MARK.opening.x * unit,
    y: box.top + MARK.opening.y * unit,
  };
  // The opening sits a few px below the mark's middle; the camera drifts it to
  // the exact centre of the screen, so the zoom converges on the middle.
  const drift = { x: window.innerWidth / 2 - opening.x, y: window.innerHeight / 2 - opening.y };
  const layers = [zoomLayer, ...ghosts];

  tl.addLabel('swap')
    .set(layers, { transformOrigin: `${opening.x}px ${opening.y}px` }, 'swap')
    .to(layers, { ...drift, duration: zoom * 0.6, ease: smooth }, 'swap');

  // The footage behind the window (opened while the shield held) eases back
  // from a little too close the whole way in.
  if (frame) tl.to(frame, { scale: 1, duration: zoom + settle, ease: smooth }, 'swap');

  // zoom: straight into the mark. The camera eases in and builds to a rush;
  // scale grows exponentially so speed reads as forward motion. Two ghosts
  // trail a step behind and the lens blurs as speed builds: motion blur.
  const accelerate = gsap.parseEase(ease('productiveExit'));
  const flyTo = (scale: number) => ({
    scale,
    duration: zoom,
    ease: (p: number) => (scale ** accelerate(p) - 1) / (scale - 1),
  });
  tl.addLabel('zoom', 'swap').to(zoomLayer, flyTo(ZOOM), 'zoom');
  ghosts.forEach((ghost, i) => {
    tl.to(ghost, flyTo(ZOOM ** (1 - GHOST_LAG[i])), 'zoom').fromTo(
      ghost,
      { autoAlpha: 0 },
      { autoAlpha: 0.35 - i * 0.15, duration: zoom * 0.5, ease: ease('productiveExit') },
      `zoom+=${zoom * 0.3}`,
    );
  });
  tl.fromTo(
    get('splash-lens'),
    { filter: 'blur(0px)' },
    { filter: `blur(${LENS_BLUR}px)`, duration: zoom * 0.8, ease: ease('productiveExit') },
    `zoom+=${zoom * 0.2}`,
  )
    // The shield dissolves as it flies past, melting into the footage rather
    // than cutting away. It is gone by 60% of the zoom: the rush happens in
    // the footage, not in a fading logo.
    .to(splash, { autoAlpha: 0, duration: zoom * 0.5, ease: ease('productiveInOut') }, `zoom+=${zoom * 0.1}`)
    .addLabel('through', `zoom+=${zoom}`)
    .set(splash, { display: 'none' }, 'through')
    .addLabel('land', `through-=${overlap}`);

  // land: the footage travels into its place in the hero, launching at the
  // zoom's speed and decelerating into the slot. On a phone the slot sits low,
  // under the copy, and the footage glides down into it.
  if (card && slot) {
    tl.to(
      card,
      {
        left: 0,
        top: 0,
        width: () => slot.offsetWidth,
        height: () => slot.offsetHeight,
        borderRadius: restRadius,
        duration: settle,
        ease: ease('expressiveEntrance'),
      },
      'land',
    )
      .set(card, { clearProps: 'left,top,width,height,borderRadius,opacity,visibility' }, `land+=${settle}`)
      .set(slot, { clearProps: 'zIndex' }, `land+=${settle}`);
  }

  // enter: the nav's contents, then each block of copy, fade in following the
  // page's structure (reading order). Opacity only: nothing moves, so it reads
  // as one gentle arrival rather than parts assembling.
  tl.addLabel('enter', 'land').fromTo(
    arrivals(root, get),
    { autoAlpha: 0 },
    {
      autoAlpha: 1,
      duration: duration.slowest * 1.5,
      ease: ease('productiveInOut'),
      stagger: duration.fast,
    },
    'enter',
  );

  return tl;
}

/** Resolves when the hero's video can play (or there is none), or after VIDEO_WAIT. */
function videoReady(root: HTMLElement): Promise<void> {
  const video = root.querySelector('video');
  if (!video || video.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) return Promise.resolve();
  return new Promise((resolve) => {
    video.addEventListener('canplay', () => resolve(), { once: true });
    setTimeout(resolve, VIDEO_WAIT);
  });
}

/** Resolves when the element's CSS animations (the shield's entrance) have finished. */
function settled(el: HTMLElement | null): Promise<void> {
  if (!el) return Promise.resolve();
  // A cancelled animation rejects `finished`; that counts as settled too.
  return Promise.all(el.getAnimations().map((a) => a.finished.catch(() => undefined))).then(() => undefined);
}

/** Resolves at `ms` after navigation start (at once if that has passed). */
function untilTime(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, Math.max(0, ms - performance.now())));
}

/**
 * The mark's outer outline as a mask image: the shape of the window. Read from
 * the package's own `--brand-mark`, so it follows the artwork. Its first
 * subpath is the outline; the rest are the openings.
 */
function shieldOutline(el: HTMLElement): string | null {
  const source = getComputedStyle(el).getPropertyValue('--brand-mark');
  const encoded = /data:image\/svg\+xml,([^"]+)/.exec(source)?.[1];
  if (!encoded) return null;
  const svg = decodeURIComponent(encoded);
  const outline = /\bd='([^']+)'/.exec(svg)?.[1].split(/(?=M)/)[0];
  const viewBox = /viewBox='([^']+)'/.exec(svg)?.[1];
  if (!outline || !viewBox) return null;
  const shape = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='${viewBox}'><path d='${outline}'/></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(shape)}")`;
}
