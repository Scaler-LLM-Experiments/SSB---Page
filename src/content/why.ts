import type { WhyContent } from '@/sections/why/types';

// Section 3, "Why SSB": the title, the figures and the Kamath quote are the deck's ("SSB Website
// vF _ Sep'26", slide 4). The description, the three chapters' copy and the labels are the
// team's mock (2026-10-05). Its figure captions read "as cited in the brief", a placeholder; these
// are the deck's own sentences.
export const why: WhyContent = {
  eyebrow: 'Why SSB',
  title: 'MBA is not dead. But the ‘traditional’ MBA is outdated for the new world.',
  titleHighlight: 'outdated for the new world.',
  description:
    'Business fundamentals still matter. Here, you also learn to use AI, work with founders and show what you can make.',
  // The deck's quote card. Its words, split into a caption and its attribution; only the quoted part
  // is in quote marks, as the deck has it.
  quote: {
    source: 'Zerodha AMA',
    caption: 'Pursuing a traditional MBA at 25 today “must be some kind of an idiot.”',
    attribution:
      'Zerodha co-founder Nikhil Kamath, telling students at a company AMA. It went viral this year.',
    coda: 'He isn’t alone in that read.',
  },
  figures: [
    {
      label: 'MBA students question AI readiness',
      value: '60%',
      description:
        'A 2026 study reported by Forbes found that 60% of MBA students believe their own coursework isn’t built for an AI-first workforce.',
    },
    {
      label: 'AI skills wage premium',
      value: '62%',
      description:
        'PwC’s 2026 Global AI Jobs Barometer found that workers with AI skills now earn 62% more than peers in the same role without them.',
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
