import { motionTokens } from '@kishanscaler/ssx-ui/motion';

/**
 * The motion offsets in px (the tokens are rem strings: "0.75rem", "1.5rem", "0.125rem"). GSAP turns a
 * rem `y` into px by inserting a probe element and reading its size, a forced layout for every element
 * it animates; on this long page that stalled phones as each section's entrance began (2026-10-23,
 * profiled: most of the scroll's script time). Numbers skip it. The root font size is 16px.
 */
const px = (rem: string) => parseFloat(rem) * 16;
export const offsetPx = {
  enter: px(motionTokens.offset.enter),
  reveal: px(motionTokens.offset.reveal),
  lift: px(motionTokens.offset.lift),
} as const;
