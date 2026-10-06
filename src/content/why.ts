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
    youtubeId: 'fzTWpjAAUe0',
    // 1:43:21 to 1:43:34: "In my personal opinion, colleges are dead. If you're 25…"
    start: 6201,
    end: 6214,
  },
  // The deck's figures and sources, shortened to Apple's spec lines.
  figures: [
    {
      source: 'Forbes, 2026',
      value: '60%',
      description: 'of MBA students say their own coursework isn’t built for an AI-first workforce',
    },
    {
      source: 'PwC Global AI Jobs Barometer, 2026',
      value: '62% more',
      description: 'pay for workers with AI skills than for peers in the same role without them',
    },
  ],
  // The deck's "Nobody is preparing you for emerging roles like:", and its four roles.
  roles: {
    lead: 'Nobody is preparing you for emerging roles like',
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
