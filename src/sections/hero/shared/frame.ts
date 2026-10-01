import type { Get } from './intro';

export type Box = { left: number; top: number; width: number; height: number };

/**
 * The biggest 16:9 frame that fits the viewport below the sticky nav, centred
 * there, as a box relative to the `video-slot` the video starts in. For the
 * scroll moment, where the hero is pinned just under the nav.
 *
 * `within`: `viewport` lets the frame run to the page gutter; `content` keeps it
 * inside the page's content column, aligned with the copy's margins.
 *
 * Hooks: `hero` (the pinned section), `hero-body` (a Container: the gutter and
 * the content column), `video-slot`, and `hero-nav` if there is one.
 */
export function centredFrame(get: Get, within: 'viewport' | 'content' = 'viewport'): Box {
  const section = get('hero')!;
  const slot = get('video-slot')!;
  const body = get('hero-body')!;
  const padding = getComputedStyle(body);
  const gutter = parseFloat(padding.paddingLeft);
  const sectionBox = section.getBoundingClientRect();
  const bodyBox = body.getBoundingClientRect();
  const slotBox = slot.getBoundingClientRect();

  // The horizontal band the frame may use, in section coordinates.
  const band =
    within === 'content'
      ? {
          left: bodyBox.left - sectionBox.left + gutter,
          width: body.clientWidth - gutter - parseFloat(padding.paddingRight),
        }
      : { left: gutter, width: section.clientWidth - gutter * 2 };

  // The height the pinned section shows: the viewport less the sticky nav.
  const visible = window.innerHeight - navHeight(get);
  const width = Math.min(band.width, (visible - gutter * 2) * (16 / 9));
  const height = width * (9 / 16);
  return {
    left: band.left + (band.width - width) / 2 - (slotBox.left - sectionBox.left),
    top: (visible - height) / 2 - (slotBox.top - sectionBox.top),
    width,
    height,
  };
}

/** Where the video card is drawn, relative to its slot, and how it is dressed:
 * corner radius on screen, in px, and `zoom`, an extra even scale on the media
 * (the intro starts it a little too close and eases it back). */
export type CardView = Box & { radius: number; zoom: number };

/**
 * Draws the video card at `view` with transforms only, so moving it is never a
 * layout shift. (Moving it with left/top/width/height was: CLS 1.15 on a
 * phone, 0.05 on desktop.) The card keeps its slot's layout size and is
 * translated and scaled onto the box, which stretches it; what is inside is put
 * right:
 *
 * - the media (`video-frame`, a 16:9 box covering the card: hero.css
 *   `.hero-media-cover`) is counter-scaled to an even scale that covers the box,
 *   so the film never squashes, and shows whole once the box is 16:9;
 * - the overlays (`video-overlay`) are scaled back to 1:1;
 * - the corners are drawn elliptical inside the card, so they look round.
 */
export function drawCard(get: Get, view: CardView) {
  const card = get('video-card');
  if (!card) return;
  const sx = view.width / card.offsetWidth;
  const sy = view.height / card.offsetHeight;
  card.style.transformOrigin = '0 0';
  card.style.transform = `translate(${view.left}px, ${view.top}px) scale(${sx}, ${sy})`;
  card.style.borderRadius = `${view.radius / sx}px / ${view.radius / sy}px`;

  const media = get('video-frame');
  if (media) {
    const cover = Math.max(view.width / media.offsetWidth, view.height / media.offsetHeight) * view.zoom;
    media.style.transform = `scale(${cover / sx}, ${cover / sy})`;
  }
  const overlay = get('video-overlay');
  if (overlay) {
    overlay.style.transformOrigin = '0 0';
    overlay.style.transform = `scale(${1 / sx}, ${1 / sy})`;
  }
}

/** Puts the card back to its CSS: resting in its slot, overlays the card's size. */
export function clearCard(get: Get) {
  for (const hook of ['video-card', 'video-frame', 'video-overlay']) {
    const el = get(hook);
    if (!el) continue;
    for (const prop of ['transform', 'transform-origin', 'border-radius', 'width', 'height']) {
      el.style.removeProperty(prop);
    }
  }
}

/** The sticky nav's height, or 0 without one: the hero pins just under it. */
export function navHeight(get: Get): number {
  return get('hero-nav')?.offsetHeight ?? 0;
}

/** A length token (`--radius-2xl: 1rem`) in px, for tweening. */
export function tokenPx(name: string): number {
  const root = document.documentElement;
  const value = getComputedStyle(root).getPropertyValue(name).trim();
  const rem = parseFloat(getComputedStyle(root).fontSize);
  return value.endsWith('rem') ? parseFloat(value) * rem : parseFloat(value);
}
