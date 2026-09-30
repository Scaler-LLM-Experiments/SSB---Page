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
