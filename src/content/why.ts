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
    // Italic, struck through as the line arrives (the team's ask, 2026-10-06).
    struck: 'old MBA',
    lead: 'But ours prepares you for roles like',
    roles: ['Founder’s Office', 'AI Product Manager', 'Growth Manager', 'Category Manager'],
  },
  // The three chapters, each proved by one story (2026-10-06). The lines are the team's mock's
  // (2026-10-05), each title folded into its line. The stories are the deck's ("Beyond Placements",
  // slide 5; the Shark Tank and convocation slide, 7; the AI slide's "5 real AI products", 9),
  // checked against the press where there is any. Photos and their sources: public/media/CREDITS.md.
  pillars: [
    {
      icon: 'hammer',
      title: 'Build',
      description:
        'Make the idea real. Launch a business, meet customers and learn from the market, not a hypothetical case.',
      // ANI, 29 July 2026 (via LatestLY): Mittal reviewed Hummusapiens, Gredo, Grade Sense and Dream
      // Kit on campus, and offered to invest ₹50 lakh in Hummusapiens. An offer: don't say "raised".
      story: {
        tag: 'Highlight',
        label: 'Hummusapiens · July 2026',
        headline: 'A student’s snack brand, offered ₹50 lakh by Shark Tank’s Anupam Mittal.',
        imageUrl: '/media/why-story-mittal.webp',
        imageUrlSmall: '/media/why-story-mittal-800.webp',
        imageAlt: 'Anupam Mittal in conversation on stage at Scaler School of Business',
        imagePosition: '66% 50%',
      },
    },
    {
      icon: 'rocket',
      title: 'Ship',
      description:
        'Use AI as a working tool. Start without code, then ship products, automations and agents for real use cases: five before you graduate.',
      // The deck's "AI-Powered Grading, Built by a Student"; what it does from its Product Hunt
      // listing (multi-language OCR, rubrics, teacher override, 500+ papers a batch).
      story: {
        tag: 'Highlight',
        label: 'GradeSense · Ayush Poojary',
        headline: 'A student’s AI that marks handwritten exams in minutes.',
        imageUrl: '/media/why-story-gradesense.webp',
        imageUrlSmall: '/media/why-story-gradesense-800.webp',
        imageAlt: 'GradeSense grading a handwritten answer sheet, its AI feedback beside it',
        imagePosition: '80% 0%',
      },
    },
    {
      icon: 'trend-up',
      title: 'Grow',
      description:
        'Prepare for emerging roles. Explore Founder’s Office, AI Product, Growth and Category roles with people who hire and lead in them.',
      // The deck's convocation card (May 2026). PLACEHOLDER photo: a campus photo from SSB's own
      // site, not the convocation, until the team sends one.
      story: {
        tag: 'Highlight',
        label: 'The founding cohort · May 2026',
        headline: '55 graduates, headed to Blinkit, Urban Company and Emergent.',
        imageUrl: '/media/why-story-cohort.webp',
        imageUrlSmall: '/media/why-story-cohort-800.webp',
        imageAlt: 'SSB students in a discussion round a table',
        imagePosition: '40% 50%',
      },
    },
  ],
};
