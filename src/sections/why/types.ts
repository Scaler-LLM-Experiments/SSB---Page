/**
 * Content contract for the Why SSB section (deck slide 4). Flat on purpose,
 * like `HeroContent`: each field maps onto a future Storyblok blok field
 * (`figures`, `roles.roles` and `pillars` become nested blok lists).
 */

/**
 * The remark that started the argument, set as a paused clip (the deck asks for
 * a still from the video): a caption over a dark frame.
 */
export type WhyQuote = {
  /** Where it was said, on the frame's chip, e.g. "Zerodha AMA". */
  source: string;
  /** The caption: the deck's words, its quoted part in quote marks. */
  caption: string;
  /** Who said it and when, under the caption. */
  attribution: string;
  /** A short line leading into the figures, e.g. "He isn't alone in that read." */
  coda?: string;
};

/** The deck's turn from the evidence to SSB: a line ending in a role that keeps changing. */
export type WhyRoles = {
  /** e.g. "Nobody is preparing you for emerging roles like". */
  lead: string;
  roles: string[];
};

/** A figure that backs the argument, with its source in its sentence. */
export type WhyFigure = {
  label: string;
  /** As shown, e.g. "60%". Slides up into its line as the section arrives. */
  value: string;
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
  eyebrow: string;
  title: string;
  /** A phrase inside `title` set in the brand colour. Must appear in `title` verbatim. */
  titleHighlight?: string;
  description: string;
  quote: WhyQuote;
  figures: WhyFigure[];
  roles: WhyRoles;
  pillars: WhyPillar[];
};
