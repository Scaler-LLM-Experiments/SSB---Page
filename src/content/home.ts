import type { HeroContent } from '@/sections/hero/types';

/*
 * Copy from the team's hero mock (2026-09-30). CTA hrefs are placeholders until
 * real destinations are agreed. The campus film is a 15s silent cut of the team's
 * screen recording (campus walk-through, then the programme director), looping.
 */
export const hero: HeroContent = {
  eyebrow: 'PGP in Management & Technology',
  title: 'India’s first AI-native B-school built by 100+ industry leaders from',
  description:
    'Learn by doing: build startups and AI products, solve live company challenges, and work with practitioners. No technology background required.',
  primaryCta: { label: 'Apply now', href: '#apply' },
  secondaryCta: { label: 'Download brochure', href: '#brochure' },
  facts: [{ value: '18 months' }, { value: 'Bengaluru campus' }, { value: '150 seats' }],
  // Our own files, in their own colours, trimmed to their edges (public/logos). `ink` as measured
  // in one tone (CLAUDE.md, "Logos").
  logos: [
    { name: 'Boston Consulting Group', logoUrl: '/logos/bcg.svg', wordmark: 'BCG', ink: 0.52 },
    { name: 'Swiggy', logoUrl: '/logos/swiggy.svg', wordmark: 'Swiggy', ink: 0.37 },
    { name: 'McKinsey & Company', logoUrl: '/logos/mckinsey.svg', wordmark: 'McKinsey', ink: 0.13 },
    { name: 'Cars24', logoUrl: '/logos/cars24.svg', wordmark: 'Cars24', ink: 0.42 },
    { name: 'Bain & Company', logoUrl: '/logos/bain.svg', wordmark: 'Bain', ink: 0.17 },
  ],
  media: {
    videoSrc: '/media/campus-film.mp4',
    poster: '/media/campus-film-poster.jpg',
    youtubeId: 'yBYXT419bFw',
    youtubeLength: 288,
    caption: 'Learn by doing. Build alongside the people shaping what comes next.',
  },
};
