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
  // V2's title (the team, 2026-10-12): the faculty's line moved up into it, their logos under it,
  // above the CTAs. `title` stays for the split fold.
  titleLead: 'Learn business hands-on',
  leadersTitle: 'from 100+ industry leaders & faculty',
  // (2026-10-13) the title's last word, moved down to start the logos' row
  leadersFrom: 'from',
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

/** The framed first fold (the team's mocks, 2026-10-22): one film in a rounded frame, in a dark and a
 *  light version (`HeroFrame`, /v3?hero=dark | ?hero=light). Flat props, as the other folds'. */
export type HeroFrameContent = {
  /** The bar over the navbar: a deadline counting down. */
  /** `shortMessage`: the phones' line, so it fits on one line with the countdown. */
  deadline: { message: string; shortMessage: string; to: string; label: string };
  eyebrow: string;
  title: string;
  /** Phrases, set on one line with a dot between them (broken between phrases if it must wrap). */
  line: string[];
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  /** "Learn from", over the organisations' logos on white tiles. */
  logosLabel: string;
  logos: { name: string; src: string }[];
  /** Phones: the logos that turn over on the four tiles in turn (the team's files, 2026-10-22, one height). */
  flipLogos: { name: string; src: string }[];
  facts: { value: string; caption: string }[];
  video: { src: string; poster?: string };
};

export const heroFrame: HeroFrameContent = {
  // PLACEHOLDER date: the mock's countdown (1 day 2 hours out); the real Phase 1 deadline to come
  deadline: {
    // (review call, 21 Oct 2026) Intake 2 closes 27 Dec, as the fee table
    message: 'Intake 2 applications close 27 Dec',
    shortMessage: 'Intake 2 closes 27 Dec',
    to: '2026-12-27T23:59:00+05:30',
    label: '27 Dec, 11:59 PM IST',
  },
  // (review call, 21 Oct 2026) the programme's name; one subline, the "build startups" line dropped
  eyebrow: 'Full-Time PGP in Management & Technology',
  title: 'Learn Business hands-on from 100+ Industry Leaders & Faculty',
  // (2026-10-27, the user's ask) three pointers, at every width; was "18 months, full-time, on campus
  // in Bengaluru · No tech background required"
  line: ['Learn by Doing', 'Build startups & AI products', 'No tech background required'],
  // placeholder hrefs, as the other folds'
  primaryCta: { label: 'Apply Now', href: '#apply' },
  // (review call) placement report → brochure (2026-10-23) → placement report again (2026-10-27, the user's ask). PLACEHOLDER href
  secondaryCta: { label: 'Download Placement Report', href: '#placement-report' },
  // (the team, 2026-10-22: "Learn from Uber" read oddly) the title's own words, leading into the logos;
  // "Built by leaders from…" (2026-10-27, the user's ask; was "Faculty & leaders from")
  logosLabel: 'Built by leaders from…',
  logos: [
    { name: 'Uber', src: '/logos/uber.svg' },
    { name: 'Colgate', src: '/logos/colgate.svg' },
    { name: 'McKinsey & Company', src: '/logos/mckinsey.svg' },
    { name: 'IIM Ahmedabad', src: '/logos/iima.svg' },
  ],
  flipLogos: [
    { name: 'BCG', src: '/logos/fold/bcg.png' },
    { name: 'ISB', src: '/logos/fold/isb.png' },
    { name: 'IIM Ahmedabad', src: '/logos/fold/iima.png' },
    { name: 'McKinsey & Company', src: '/logos/fold/mckinsey.png' },
    { name: 'Bain & Company', src: '/logos/fold/bain.png' },
    { name: 'Google', src: '/logos/fold/google.png' },
    { name: 'Colgate', src: '/logos/fold/colgate.png' },
    { name: 'Airtel', src: '/logos/fold/airtel.png' },
    { name: 'OpenAI', src: '/logos/fold/openai.png' },
    { name: 'Meta', src: '/logos/fold/meta.png' },
  ],
  facts: [
    { value: '18 months', caption: 'incl. internship' },
    { value: 'Bangalore', caption: 'On-campus' },
    { value: '150', caption: 'Seats' },
  ],
  // the team's film (Webite Vid v3, 2026-10-22): 1920 × 1080, 20s, H.264
  video: { src: '/media/hero-film.mp4' },
};
