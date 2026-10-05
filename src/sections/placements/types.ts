import type { CtaIconName } from '@/sections/hero/types';

/**
 * Content contract for the placements section, shared by its three
 * variations (the stories carousel, the logo grid, the showcase), so they compare layouts
 * on identical copy. Flat on purpose, like `HeroContent`: each field maps onto
 * a future Storyblok blok field (`stats`, `stories`, `showcases` and `logos` become nested
 * blok lists).
 */

/** The icon on a stat card (a Phosphor icon, mapped in PlacementsSection). */
export type PlacementIcon = 'currency' | 'trend' | 'switch' | 'sparkle';

export type PlacementStat = {
  /** The figure as shown, e.g. "₹19L". The stories strip rolls its digits in; the grid's cards are static. */
  value: string;
  /** What it measures, e.g. "Average CTC". */
  label: string;
  /** A short line under the label (the grid's cards only). */
  description: string;
  icon: PlacementIcon;
};

export type RecruiterLogo = {
  name: string;
  /** A file in `public/logos`, trimmed to its edges, in its own colours. */
  logoUrl: string;
  /** The share of the logo's box its artwork fills, 0–1 (CLAUDE.md, "Logos"). */
  ink?: number;
  /** Students of the cohort placed there: the logo's grid cell flips to this on hover. Unset: no flip. */
  placed?: number;
};

/** A role an alumnus moved into (the deck's "Strong Alumni Base"), e.g. Growth Marketing at Emergent. */
export type PlacementRole = { role: string; company: string };

/** One card of the stories carousel: a claim, with its proof under it (drifting logos or roles, or a photo). */
export type PlacementStory = {
  /** A short label over the title, e.g. "Startups". */
  kicker: string;
  title: string;
  description: string;
  /** Names from `logos`, drifting past in two columns. */
  logos?: string[];
  /** Drift the alumni roles (`PlacementsContent.roles`) instead. */
  roles?: boolean;
  /** A photo instead. */
  imageUrl?: string;
  imageAlt?: string;
  ctaLabel?: string;
  ctaHref?: string;
  ctaIcon?: CtaIconName;
};

/** The icon beside a showcase's name in its switcher (a Phosphor icon, mapped in PlacementsShowcase). */
export type ShowcaseIcon = 'rocket' | 'globe' | 'sparkle';

/**
 * One card of the showcase variation, after the App Store's Today cards: a
 * photo of a place, framed and fading into the card's grey, a tab cut out of
 * the frame naming it, the claim, its figure, and a column of logos (or the
 * alumni roles) floating over the photo.
 */
export type PlacementShowcase = {
  /** Short: the cut-out tab and its tab in the switcher, e.g. "Indian startups". */
  label: string;
  icon: ShowcaseIcon;
  /** The figure, e.g. "50+", rolled in each time the card comes round; the title reads on from it. */
  statValue: string;
  /** The claim, continuing the figure ("50+" "startups from Bengaluru…"), in near-black. */
  title: string;
  description: string;
  /** Names from `logos`, floating over the photo. */
  logos?: string[];
  /** Float the alumni roles (`PlacementsContent.roles`) instead. */
  roles?: boolean;
  imageUrl: string;
  /** The photo at more widths (`srcset`), so a desktop screen gets it sharp and a phone small. */
  imageSrcSet?: string;
  imageAlt: string;
  /** Where the photo is anchored as it is cropped (CSS `object-position`), e.g. "center 70%". */
  imagePosition?: string;
};

export type PlacementsContent = {
  eyebrow: string;
  title: string;
  description: string;
  /** A longer description, for a layout that opens like a product page (the showcase). */
  lead: string;
  /** Four: a strip under the carousels (stories, showcase), a panel over the logo grid. */
  stats: PlacementStat[];
  /** The carousel's cards (the stories variation). */
  stories: PlacementStory[];
  /** The audited placement report: a CTA level with the showcase variation's title (deck slide 3). */
  reportLabel: string;
  reportHref: string;
  /** The photo cards (the showcase variation). */
  showcases: PlacementShowcase[];
  /** Over the logo grid, set as an eyebrow (the grid variation). */
  recruitersTitle: string;
  /** Roles alumni moved into, from the deck: what the roles cards float. */
  roles: PlacementRole[];
  /** Every logo we have a file for: the grid flips through them, the stories pick theirs by name. */
  logos: RecruiterLogo[];
  /** Every recruiter named in the deck: what screen readers get instead of the moving logos. */
  recruiters: string[];
};
