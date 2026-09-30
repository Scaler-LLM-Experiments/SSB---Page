import type { HeroContent } from '@/sections/hero/types';

/*
 * Copy from the team's hero mock (2026-09-30). CTA hrefs are placeholders until
 * real destinations are agreed. The campus film is a 15s silent cut of the team's
 * screen recording (campus walk-through, then the programme director), looping.
 */
export const hero: HeroContent = {
  eyebrow: 'PGP in Management & Technology',
  title: 'India’s first AI-native B-school built by 100+ industry leaders from',
  titleHighlight: 'AI-native B-school',
  description:
    'Learn by doing: build startups and AI products, solve live company challenges, and work with practitioners. No technology background required.',
  primaryCta: { label: 'Apply now', href: '#apply' },
  secondaryCta: { label: 'Download brochure', href: '#brochure' },
  facts: [{ value: '18 months' }, { value: 'Bengaluru campus' }, { value: '150 seats' }],
  logos: [
    {
      name: 'Boston Consulting Group',
      wikidataId: 'Q135635',
      // Wikidata's BCG logo is a filled square; this Commons file is the plain wordmark.
      logoUrl:
        'https://commons.wikimedia.org/wiki/Special:FilePath/Boston%20Consulting%20Group%202020%20logo.svg',
      wordmark: 'BCG',
    },
    { name: 'Indian School of Business', wikidataId: 'Q3273896', wordmark: 'ISB' },
    { name: 'McKinsey & Company', wikidataId: 'Q310207', wordmark: 'McKinsey' },
    { name: 'IIM Ahmedabad', wikidataId: 'Q46027', wordmark: 'IIMA' },
    { name: 'Bain & Company', wikidataId: 'Q764850', wordmark: 'Bain' },
  ],
  media: {
    videoSrc: '/media/campus-film.mp4',
    poster: '/media/campus-film-poster.jpg',
    youtubeId: 'yBYXT419bFw',
    caption: 'Learn by doing. Build alongside the people shaping what comes next.',
  },
};
