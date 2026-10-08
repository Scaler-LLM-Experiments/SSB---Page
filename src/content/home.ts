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
    'Build startups & AI products · No tech background required',
  primaryCta: { label: 'Apply now', href: '#apply', icon: 'arrow' },
  secondaryCta: { label: 'Download brochure', href: '#brochure', icon: 'download' },
  // A quiet line under the actions (FoldCopy): each value, then its caption.
  facts: [
    // Values in one row; the caption a small line under it, starting under its value.
    // V4 shows the short caption (its tags sit in the narrower right column).
    { value: '18 months', caption: 'incl. internships & immersions', shortCaption: 'incl. internships' },
    { value: 'Bengaluru' },
    { value: '150 seats' },
  ],
  media: {
    videoSrc: '/media/campus-film.mp4',
    poster: '/media/campus-film-poster.jpg',
    youtubeId: 'yBYXT419bFw',
    youtubeLength: 288,
    caption: 'Learn by doing. Build alongside the people shaping what comes next.',
  },
  // Was "Learn business hands-on from 100+ industry-leading faculty from": the line under the
  // title already says "Learn by doing".
  leadersLine: '100+ industry-leading faculty from',
  // Feedback, 2026-10-06. TO CONFIRM: which Oxford reference to use (Oxford / Saïd Business School);
  // Before the schools' logos in the facts box, on one line (about the values' row's width).
  alumniLead: 'Built by alumni from',
  // Their wide logos (the team, 2026-10-08: "wide logos instead of short, then words"): Oxford's
  // from Wikimedia Commons, public domain ("University of Oxford.svg", Wikidata's P154); HBS's
  // lockup (shield and stacked name) the team's own file (src/HBS.svg, copied). Shown white on
  // the glass, or in their own colours on a white plate (the lab's toggle, ?logos=plate). Were
  // the Oxford circlet and the HBS shield, each beside its name.
  alumniFrom: [
    { name: 'University of Oxford', logoUrl: '/logos/oxford-wide.svg', wordmark: 'Oxford', ink: 0.15 },
    { name: 'Harvard Business School', logoUrl: '/logos/hbs-lockup.svg', wordmark: 'Harvard Business School', ink: 0.26 },
  ],
  // V5's ticker: the same list as each organisation's own colour icon (its site or app icon,
  // public/logos/marks, 96px) with its name beside it.
  leaderMarks: [
    { name: 'BCG', mark: '/logos/marks/lead-bcg.png', wordmark: true },
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
  // The deck's list, in its order, as logos only (the team, 2026-10-08: "instead of names, just
  // show logos, full width"): our wordmark files in public/logos, in one grey tone in the hero
  // (LogoTicker). `ink` measured in the browser as CLAUDE.md, "Logos" says (BCG, McKinsey and
  // Bain gave their stored values again). Was each organisation's app icon beside its name.
  leaders: [
    { name: 'BCG', logoUrl: '/logos/bcg.svg', wordmark: 'BCG', ink: 0.52 },
    { name: 'ISB', logoUrl: '/logos/isb.png', wordmark: 'ISB', ink: 0.28 },
    { name: 'McKinsey & Company', logoUrl: '/logos/mckinsey.svg', wordmark: 'McKinsey', ink: 0.13 },
    { name: 'IIM Ahmedabad', logoUrl: '/logos/iima.svg', wordmark: 'IIMA', ink: 0.24 },
    { name: 'Bain & Company', logoUrl: '/logos/bain.svg', wordmark: 'Bain', ink: 0.17 },
    // The wordmark alone: kearney.svg is the centenary lockup, "KEARNEY 100" (viewBox cropped).
    { name: 'Kearney', logoUrl: '/logos/kearney-wordmark.svg', wordmark: 'Kearney', ink: 0.28 },
    { name: 'Google', logoUrl: '/logos/google.svg', wordmark: 'Google', ink: 0.27 },
    { name: 'Colgate-Palmolive', logoUrl: '/logos/colgate.svg', wordmark: 'Colgate', ink: 0.38 },
    { name: 'Airtel', logoUrl: '/logos/airtel.svg', wordmark: 'Airtel', ink: 0.28 },
    { name: 'OpenAI', logoUrl: '/logos/openai.svg', wordmark: 'OpenAI', ink: 0.35 },
    { name: 'Meta', logoUrl: '/logos/meta.svg', wordmark: 'Meta', ink: 0.39 },
  ],
};
