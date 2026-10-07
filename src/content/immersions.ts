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
