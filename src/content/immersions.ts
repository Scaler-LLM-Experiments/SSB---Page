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

// (2026-11-16, the team's review: "copy is placeholder, add Britannia and Akshayakalpa, check with Guru")
// the two companies the team named, in place of the placeholder three (ArcelorMittal, Zepto and Myntra's
// logos over made-up students). PLACEHOLDER until Guru confirms: the lines are ours, from what each
// company does, and the photos the companies' own (Akshayakalpa's farm-visit banner) or the press's
// (Moneycontrol's, a Britannia biscuit line), not the trips'; the third immersion is to come.
export const domesticImmersions: DomesticImmersion[] = [
  {
    place: 'Manufacturing floor',
    name: 'Inside a biscuit factory',
    logo: { src: '/logos/britannia.webp', alt: 'Britannia' },
    description: 'Walk Britannia’s production lines and see how one of India’s largest food brands plans, makes and ships at scale.',
    // the team's photo (Drive, "Britannia + SSB outing", 2026-11-19): the cohort at Britannia Industries' gate
    image: { src: '/immersions/britannia.webp', width: 1200, height: 675, position: '50% 55%' },
  },
  {
    place: 'Organic dairy farm',
    name: 'On an organic dairy farm',
    logo: { src: '/logos/akshayakalpa.webp', alt: 'Akshayakalpa' },
    description: 'Follow Akshayakalpa’s milk from its farmers’ cows to Bengaluru doorsteps: the testing, the processing and the supply chain.',
    image: { src: '/immersions/akshayakalpa.webp', width: 1200, height: 600, position: '35% 50%' },
  },
  // (2026-11-19) the third, from the team's Drive ("Domestic immersion" in #ssb-assets: "Organic Mandya"):
  // students on an organic farm near Mandya (coconut and areca groves, the farm's cattle). PLACEHOLDER until
  // Guru confirms: the line is ours, and whether this trip is the one the review called Akshayakalpa's.
  // The logo is Organic Mandya's own (organicmandya.com).
  {
    place: 'Organic farm',
    name: 'On an organic farm',
    logo: { src: '/logos/organic-mandya.webp', alt: 'Organic Mandya' },
    description: 'Walk the fields with Organic Mandya’s farmers and see how organic produce gets from Mandya’s farms to city shelves.',
    image: { src: '/immersions/organic-mandya.webp', width: 1200, height: 600, position: '50% 50%' },
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
