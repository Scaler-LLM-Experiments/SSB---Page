// Immersions beyond the classroom: from the deck (SSB Website vF, Sep '26,
// slide 10). The two features, then "Student success stories under our
// creator lab": three creators with the stats the deck shows (its cards also
// note "90-day programme complete").

export type Immersion = {
  title: string;
  description: string;
  /** File in /public/immersions (WebP, 948x544: the scene on the left, a blur on the right). */
  image: string;
};

export const immersions: Immersion[] = [
  {
    title: '3 domestic immersions',
    description:
      'Across industries: manufacturing floors, quick-commerce backend ops, a fashion brand headquarters.',
    image: 'domestic-immersions',
  },
  {
    title: 'Creator-preneur track',
    // shortened to the left card's length, two lines (2026-10-07, the team's ask); the deck's: "6 months
    // embedded inside Jio Creative Labs, Reliance's in-house creative agency, working on campaigns like
    // Jio Dhan Dhana Dhan and its IPL-tied cricket-season push."
    description: "6 months inside Reliance's Jio Creative Labs, on campaigns like Jio Dhan Dhana Dhan.",
    image: 'creator-preneur-track',
  },
];

/** The three domestic immersions as cards of their own (2026-10-27, the user's ask, after Masters'
 *  Union's "1 Day Immersions": the place over the photo, then its name, a rule and a line).
 *  PLACEHOLDER: the deck names only the industries ("manufacturing floors, quick-commerce backend
 *  ops, a fashion brand headquarters"), so the lines are ours and the photos stand-ins from the page
 *  until the companies, their words and the trips' own photos come. */
export type DomesticImmersion = {
  /** Over the photo: "At a" then the place, large. */
  place: string;
  name: string;
  /** The company's logo (Masters' Union's format, 2026-10-27): under the photo, over a rule and the
   *  line. PLACEHOLDER: none yet, the company isn't named; until then the card shows `place`. */
  logo?: { src: string; alt: string; height?: number };
  description: string;
  /** `leftHalf`: the file's scene is its left half (the immersions' files carry a baked blur on the right). */
  image: { src: string; width: number; height: number; position?: string; leftHalf?: boolean };
};

export const domesticImmersions: DomesticImmersion[] = [
  {
    place: 'Manufacturing floor',
    name: 'Manufacturing',
    // PLACEHOLDER logo (2026-10-27, the user's ask: "random companies' logos" until the real ones come)
    logo: { src: '/logos/arcelormittal.svg', alt: 'ArcelorMittal' },
    description: 'See how a product is made at scale: planning the line, quality checks and the cost of every unit.',
    image: { src: '/media/built/tally.webp', width: 1600, height: 1065, position: '60% 50%' },
  },
  {
    place: 'Quick-commerce backend',
    name: 'Quick commerce',
    logo: { src: '/logos/zepto.svg', alt: 'Zepto' }, // PLACEHOLDER logo
    description: 'Go behind the 10-minute delivery: dark-store operations, inventory and the last mile.',
    // the scene is the file's left half (its right half is a baked blur)
    image: { src: '/immersions/domestic-immersions.webp', width: 948, height: 544, position: '0% 50%', leftHalf: true },
  },
  {
    place: 'Fashion brand’s HQ',
    name: 'Fashion brand',
    logo: { src: '/logos/myntra.svg', alt: 'Myntra' }, // PLACEHOLDER logo
    description: 'Sit in with the teams who design, merchandise and market a fashion label.',
    image: { src: '/live-projects/ajio.jpg', width: 900, height: 1200, position: '50% 45%' },
  },
];

export type Creator = {
  name: string;
  /** The first of the topics the deck lists for them. */
  niche: string;
  /** File in /public/immersions (WebP, 702x750). */
  photo: string;
  stats: { value: string; label: string }[];
};

export const creators: Creator[] = [
  {
    name: 'Tanisha Singhal',
    niche: 'Tech events & resources',
    photo: 'tanisha-singhal',
    stats: [
      { value: '12.6M', label: 'Views' },
      { value: '90', label: 'Posts' },
      { value: '13', label: 'Deals' },
    ],
  },
  {
    name: 'Pallavi O P',
    niche: 'PCOS & weight loss',
    photo: 'pallavi-op',
    stats: [
      { value: '7.8M', label: 'Views' },
      { value: '88', label: 'Posts' },
      { value: '0', label: 'Deals' },
    ],
  },
  {
    name: 'Shubham Singh',
    niche: 'Bollywood x Business',
    photo: 'shubham-singh',
    stats: [
      { value: '11.2M', label: 'Views' },
      { value: '75', label: 'Posts' },
      { value: '0', label: 'Deals' },
    ],
  },
];
