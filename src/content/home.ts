import type { HeroContent } from '@/sections/hero/types';

/*
 * The first fold's copy, the same in both variants (the cinematic V2 and the split
 * card, ?hero=split): the deck's (SSB Website vF, Sep '26, slide 1). CTA hrefs are
 * placeholders until real destinations are agreed. The campus film is a 15s silent
 * cut of the team's screen recording (campus walk-through, then the programme
 * director), looping; in V2 its play button opens the full film from YouTube.
 *
 * "B‑school" uses a non-breaking hyphen (U+2011), so the title never breaks inside it.
 */
export const hero: HeroContent = {
  eyebrow: 'PGP in Management & Technology (PGP-MT)',
  title: 'India’s first AI-native B‑school',
  description:
    'Learn by doing · Build startups & AI products · No tech background required · Any bachelor’s degree',
  primaryCta: { label: 'Apply now', href: '#apply', icon: 'arrow' },
  secondaryCta: { label: 'Download brochure', href: '#brochure', icon: 'download' },
  facts: [
    { value: '18 months', caption: 'incl. internship & immersions' },
    { value: 'Bengaluru', caption: 'on-campus' },
    { value: '150 seats' },
  ],
  media: {
    videoSrc: '/media/campus-film.mp4',
    poster: '/media/campus-film-poster.jpg',
    youtubeId: 'yBYXT419bFw',
    youtubeLength: 288,
    caption: 'Learn by doing. Build alongside the people shaping what comes next.',
  },
  leadersLine: 'Built by 100+ industry leaders from',
  // The deck's list, in its order: each organisation's own colour mark (its site or app icon,
  // public/logos/marks/lead-*.png, 96px) with its name beside it, as the AI curriculum's tools.
  leaders: [
    { name: 'BCG', mark: '/logos/marks/lead-bcg.png' },
    { name: 'ISB', mark: '/logos/marks/lead-isb.png' },
    { name: 'McKinsey', mark: '/logos/marks/lead-mckinsey.png' },
    { name: 'IIMA', mark: '/logos/marks/lead-iima.png' },
    { name: 'Bain', mark: '/logos/marks/lead-bain.png' },
    { name: 'Kearney', mark: '/logos/marks/lead-kearney.png' },
    { name: 'Google', mark: '/logos/marks/lead-google.png' },
    { name: 'Colgate', mark: '/logos/marks/lead-colgate.png' },
    { name: 'Airtel', mark: '/logos/marks/lead-airtel.png' },
    { name: 'OpenAI', mark: '/logos/marks/lead-openai.png' },
    { name: 'Meta', mark: '/logos/marks/lead-meta.png' },
  ],
};
