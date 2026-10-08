/**
 * V2's desktop scroll moment, in screens of scroll (1 = one viewport height).
 * The scroll track's height and the moment's timeline both come from these
 * numbers: the timeline runs in the same units, and the track adds exactly
 * their sum to the hero's own screen. So the moment takes the same share of a
 * screen on any display, and changing one phase moves everything after it.
 */
export const MOMENT = {
  /** The copy fades out as scrolling starts. */
  fade: 0.1,
  /** The video travels into its frame; the play button and controls fade in over the last quarter. */
  frame: 0.25,
  /** A beat on the framed video before the page turns. */
  beat: 0.05,
  /** The black gives way to the white page; the nav turns light halfway. */
  white: 0.17,
  /** The frame rests on white, then the hero scrolls away. */
  hold: 0.08,
};

/** How much scroll the whole moment takes, in screens. */
export const MOMENT_SCREENS = MOMENT.frame + MOMENT.beat + MOMENT.white + MOMENT.hold;

/**
 * The scroll track's height: the hero's one screen under the sticky nav
 * (HeroNav is h-16), plus the moment. The pinned scroll is then exactly
 * MOMENT_SCREENS × the viewport height.
 */
export const TRACK_HEIGHT = `calc(${1 + MOMENT_SCREENS} * 100svh - var(--space-16))`;

/**
 * Below desktop, the shorter moment (`phoneMoment` in HeroV2Motion), in screens of scroll: the
 * copy rises to the top while the video comes down under it into the film's 16:9 frame, the spec
 * sheet following (the play button and controls arriving over the last quarter), then a short
 * hold. No fade to white: the hero then scrolls away as the page does.
 */
export const PHONE_MOMENT = {
  frame: 0.36,
  hold: 0.06,
};

/** The spacer after the hero below desktop: the hero sticks while exactly this scrolls past. */
export const PHONE_TRACK = `calc(${PHONE_MOMENT.frame + PHONE_MOMENT.hold} * 100svh)`;
