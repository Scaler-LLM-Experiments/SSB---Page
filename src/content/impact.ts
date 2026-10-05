import type { ShowcasePerson } from '@/sections/faculty/PeopleShowcase';

// Scaler Impact Foundation: from the deck (SSB Website vF, Sep '26, slide 26).
// The deck gives only the title and the people; the headline and subtext in
// ImpactSection are drafts. Logos are white on the card, so only their shape
// shows; each is trimmed to its edges in public/logos.
export const impactPeople: ShowcasePerson[] = [
  {
    name: 'Vijay Shekhar Sharma',
    role: 'Chairman, MD & CEO, Paytm',
    image: '/impact/vijay-shekhar-sharma.webp',
    // The deck shows the Paytm Foundation lockup; this is Paytm's own wordmark.
    logo: { name: 'Paytm', src: '/logos/paytm.svg' },
  },
  {
    name: 'Prasanna Sankar',
    role: 'Co-Founder & CTO, Rippling',
    image: '/impact/prasanna-sankar.webp',
    logo: { name: 'Rippling', src: '/logos/rippling.svg' },
  },
  {
    name: 'Bhavin Turakhia',
    role: 'Founder, Titan, Zeta & Radix',
    image: '/impact/bhavin-turakhia.webp',
    // One logo per card; the deck shows three.
    logo: { name: 'Zeta', src: '/logos/zeta.svg' },
  },
  {
    name: 'Mohak Mangal',
    role: 'YouTuber & Founder, Soch by Mohak',
    image: '/impact/mohak-mangal.webp',
  },
  {
    name: 'Ankur Warikoo',
    role: 'Content Creator & Founder, WebVeda',
    image: '/impact/ankur-warikoo.webp',
    logo: { name: 'WebVeda', src: '/logos/webveda.svg' },
  },
];
