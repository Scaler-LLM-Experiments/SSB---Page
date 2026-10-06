import type { WhyContent } from '@/sections/why/types';

// Section 3, "Why SSB": the figures, the Kamath quote and the roles are the deck's ("SSB Website
// vF _ Sep'26", slide 4); the three chapters' copy is the team's mock (2026-10-05). The deck's
// title ("MBA is not dead…") and the mock's description were cut (2026-10-06): the breaker makes
// that argument.
export const why: WhyContent = {
  // The deck's quote card, checked against the video (Zerodha's 15th-anniversary AMA, uploaded
  // 24 October 2025, youtube.com/watch?v=fzTWpjAAUe0, at 1:43:21): his words, verbatim but for "a"
  // MBA, as the auto-captions have it. The deck's "went viral this year" and "telling students"
  // don't hold (2025; an AMA), so they are not used.
  quote: {
    // The team's lines (2026-10-06).
    eyebrow: 'Why the traditional MBA doesn’t work',
    caption: 'If you’re 25 and going to an MBA college today, you must be some kind of idiot, if you ask me.',
    attribution: 'Nikhil Kamath',
    role: 'Co-founder, Zerodha',
    // The team's cut of the remark (2026-10-06), used with Zerodha's permission: their GIF
    // (src/Nikhil Gif.gif, 57 MB, gitignored) cropped of the screen recorder's cursor and edge
    // mark, as H.264 at full quality for now (CRF 12, 36 MB; the team's call: 1.3 MB looked soft).
    video: '/media/kamath-clip.mp4',
    poster: '/media/kamath-clip.webp',
  },
  // The deck's figures and sources, shortened to Apple's spec lines. Source logos from Wikidata
  // (P154), trimmed to their ink; heights set so the two weigh alike (Forbes ink 0.38, PwC 0.27).
  figures: [
    {
      value: '60%',
      description: 'of MBA students say their own coursework isn’t built for an AI-first workforce',
      source: 'Forbes',
      sourceLogo: '/logos/forbes.svg',
      sourceLogoHeight: 16,
      sourceNote: '2026',
    },
    {
      value: '62% more',
      description: 'pay for workers with AI skills than for peers in the same role without them',
      source: 'PwC',
      sourceLogo: '/logos/pwc.svg',
      sourceLogoHeight: 24,
      sourceNote: 'Global AI Jobs Barometer, 2026',
    },
  ],
  // The deck's four roles. Its lead ("Nobody is preparing you for emerging roles like:") rewritten
  // to answer the breaker's Kamath quote (the team's call, 2026-10-06).
  roles: {
    setup: 'He’s right about the old MBA.',
    lead: 'But ours prepares you for roles like',
    roles: ['Founder’s Office', 'AI Product Manager', 'Growth Manager', 'Category Manager'],
  },
  // PLACEHOLDER photos: cropped from the team's mock until the originals arrive (public/media/CREDITS.md).
  pillars: [
    {
      kicker: 'Build',
      title: 'Make the idea real.',
      description:
        'Launch a business, meet customers and learn from the market rather than a hypothetical case alone.',
      imageUrl: '/media/why-build.webp',
      imageAlt: 'SSB students working through a task on their phones',
    },
    {
      kicker: 'Ship',
      title: 'Use AI as a working tool.',
      description: 'Start without code, then build products, automations and agents for real use cases.',
      imageUrl: '/media/why-ship.webp',
      imageAlt: 'SSB students celebrating in the lab',
    },
    {
      kicker: 'Grow',
      title: 'Prepare for emerging roles.',
      description:
        'Explore Founder’s Office, AI Product, Growth and Category roles with people who hire and lead in them.',
      imageUrl: '/media/why-grow.webp',
      imageAlt: 'A speaker addressing a full SSB classroom',
    },
  ],
};
