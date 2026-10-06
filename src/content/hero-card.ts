import type { HeroContent } from '@/sections/hero/types';

/*
 * The "split" first fold (a variant of the hero, toggled with ?hero=split): the
 * deck's first-fold copy (SSB Website vF, Sep '26, slide 1), in the layout of the
 * team's references (a rounded film card under a light nav; a short title, the
 * line, the actions and the facts at the left; the leaders right-aligned at the
 * right). CTA hrefs are placeholders, as in home.ts.
 *
 * "B‑school" uses a non-breaking hyphen (U+2011), so the title never breaks inside it.
 */
export const heroSplit: HeroContent & { leadersLine: string; leaders: { name: string; mark: string }[] } = {
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
