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
  /** Who said it: his name, in the footnote under the words. */
  attribution: string;
  /** His designation, e.g. "Co-founder, Zerodha"; the footnote names its last part (the company). */
  role?: string;
  /** The clip: a silent loop (an MP4 in public/media, played like a GIF) and its first frame. */
  video?: string;
  poster?: string;
};

/** The deck's turn from the evidence to SSB: a line ending in a role that keeps changing. */
export type WhyRoles = {
  /** A line on its own before the lead, e.g. "He’s right about the old MBA." */
  setup?: string;
  /** e.g. "But ours prepares you for roles like". */
  lead: string;
  roles: string[];
};

/** A figure that backs the argument, set as Apple's spec figures: a line, the figure, a line of text, its source. */
export type WhyFigure = {
  /** As shown, e.g. "60%" or "62% more". Slides up into its line as it arrives. */
  value: string;
  /** Under the figure, reading on from it: "of MBA students say their coursework…". */
  description: string;
  /** Who found it: the logo's alt text, e.g. "Forbes". */
  source: string;
  /** The source's logo, a file in public/logos, and its height in px (sized so the logos weigh alike). */
  sourceLogo?: string;
  sourceLogoHeight?: number;
  /** Beside the logo, e.g. "2026" or "Global AI Jobs Barometer, 2026". */
  sourceNote?: string;
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
