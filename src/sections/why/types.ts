/**
 * Content contract for the Why SSB section (deck slide 4). Flat on purpose,
 * like `HeroContent`: each field maps onto a future Storyblok blok field
 * (`figures`, `roles.roles` and `pillars` become nested blok lists).
 */

/**
 * The remark that started the argument: the breaker that opens the section
 * (after Apple's product blocks): an eyebrow, the words as the title, who said
 * it in a line, the figures, then the clip of it.
 */
export type WhyQuote = {
  /** Over the title, e.g. "Why the traditional MBA doesn't work". */
  eyebrow: string;
  /** The words, verbatim (no quote marks: the breaker sets them). */
  caption: string;
  /** Who said it, under the words: just the name (the team's call). */
  attribution: string;
  /** The clip: a YouTube video id, and the seconds it starts and ends at. Unset: no clip. */
  youtubeId?: string;
  start?: number;
  end?: number;
};

/** The deck's turn from the evidence to SSB: a line ending in a role that keeps changing. */
export type WhyRoles = {
  /** e.g. "Nobody is preparing you for emerging roles like". */
  lead: string;
  roles: string[];
};

/** A figure that backs the argument, set as Apple's spec figures: its source over it, a line under it. */
export type WhyFigure = {
  /** Who found it, small over the figure, e.g. "Forbes, 2026". */
  source: string;
  /** As shown, e.g. "60%" or "62% more". Slides up into its line as it arrives. */
  value: string;
  /** Under the figure, reading on from it: "of MBA students say their coursework…". */
  description: string;
};

/** One of the three chapters (what SSB does differently), each with its photo. */
export type WhyPillar = {
  /** One word, shown numbered over the title: "Build" reads "01 / Build". */
  kicker: string;
  title: string;
  description: string;
  /** A photo, drawn at 742 × 428's proportions. */
  imageUrl: string;
  imageAlt: string;
};

export type WhyContent = {
  quote: WhyQuote;
  figures: WhyFigure[];
  roles: WhyRoles;
  pillars: WhyPillar[];
};
