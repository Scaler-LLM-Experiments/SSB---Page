/**
 * Content contract shared by every hero variation.
 *
 * Flat fields and plain strings on purpose: each field maps one-to-one onto a
 * future Storyblok blok field (`facts` and `leaders` become nested blok lists),
 * so a variation can change layout without changing what editors fill in.
 */

/** A CTA's trailing icon: `arrow` to go somewhere, `download` for a file (CtaIcon). */
export type CtaIconName = 'arrow' | 'download';

export type HeroCta = {
  label: string;
  href: string;
  icon?: CtaIconName;
};

export type HeroFact = {
  /** The fact as shown, e.g. "18 months". A leading number may be animated. */
  value: string;
  /** An optional supporting line, e.g. "Includes a 3-6 month internship". */
  caption?: string;
};

export type HeroLogo = {
  /** The organisation's full name. Used as the image's alt text. */
  name: string;
  /** Wikidata item id. The logo image is looked up from it at build time. */
  wikidataId?: string;
  /** A logo image URL. Wins over `wikidataId` (a Storyblok asset later). A file in `public/`
   * (`/logos/…`, trimmed to its edges, in its own colours) is sized from its proportions. */
  logoUrl?: string;
  /** Short name set as text when no logo image is found, e.g. "ISB". */
  wordmark: string;
  /** The share of the logo's box its artwork fills, 0–1 (default 0.4), so every logo is drawn
   * with the same amount of ink. Measured once per file: see CLAUDE.md, "Logos". */
  ink?: number;
};

/** An organisation the programme's industry leaders come from: its colour mark and its name. */
export type HeroLeader = {
  name: string;
  /** A square image of its own colour mark (its site or app icon), e.g. `/logos/marks/lead-bcg.png`. */
  mark: string;
};

export type HeroMedia = {
  /** A muted, looping video file. Unset: a placeholder frame is shown. */
  videoSrc?: string;
  /** Still frame shown before the video plays. */
  poster?: string;
  /** A line shown with the video once it is fully revealed. */
  caption?: string;
  /** The full film's YouTube video id, played in the frame from its play button. Unset: no play button. */
  youtubeId?: string;
  /** The full film's length in seconds (288 = 4:48): the preview's scrubber spans it before the film loads. */
  youtubeLength?: number;
};

export type HeroContent = {
  eyebrow: string;
  title: string;
  /** A phrase inside `title` to set in the brand colour. Must appear in `title` verbatim. */
  titleHighlight?: string;
  description: string;
  primaryCta: HeroCta;
  secondaryCta?: HeroCta;
  facts?: HeroFact[];
  /** The line over the leaders' marks: "Built by 100+ industry leaders from". */
  leadersLine?: string;
  /** Where the programme's industry leaders come from, running past under `leadersLine`. */
  leaders?: HeroLeader[];
  media?: HeroMedia;
};
