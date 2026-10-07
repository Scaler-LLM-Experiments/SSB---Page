// Scaler Innovation Lab section, from "SSB Website vF _ Sep'26", slide 12.

import type { Venture } from '@/content/community';

export type LabStat = {
  /** Number the counter lands on. */
  value: number;
  /** How the figure is written, e.g. 10 -> "₹10Cr+". */
  format: (n: number) => string;
  label: string;
};

export const labStats: LabStat[] = [
  { value: 10, format: (n) => `₹${Math.round(n)}Cr+`, label: 'Revenue in Live Businesses' },
  { value: 1, format: (n) => `$${Math.round(n)}B+`, label: 'Combined Valuations' },
  { value: 100, format: (n) => `${Math.round(n)}+`, label: 'Team Members' },
  { value: 2, format: (n) => `$${Math.round(n)}M+`, label: 'Funding Raised' },
];

// The incubated startups, as listed on Scaler's AI-B page
// (scaler.com/school-of-technology/ai-b, "industry-led startups" carousel), 2026-10-01.
// Banners are the team's files (assets/startups img), saved to /public/startups as 1133x542 WebP.

/**
 * Heads the startups panel like a stat card: the deck's "10+" startups, then
 * the line that followed the count on Scaler's AI-B page.
 */
export const labStartupsIntro = {
  value: 10,
  format: (n: number) => `${Math.round(n)}+`,
  subtext: 'industry-led startups incubated in Innovation lab, founded by leaders from Big Tech.',
};
export type LabStartup = {
  name: string;
  description: string;
  founders: string;
  /** The startup's website ("Know more"). */
  url: string;
  /** Banner in /public/startups. */
  image: string;
};

export const labStartups: LabStartup[] = [
  {
    name: 'Gahan AI',
    description:
      'Full Stack 360 RADAR - The DRWIG radar platform delivers automotive-grade mmWave perception for automotive ADAS, smart infrastructure, and industrial automation - engineered for Indian roads, weather, and scale',
    founders: 'By Sohini Hazra & Pallab Maji',
    url: 'https://gahanai.com/',
    image: 'gahan-ai.webp',
  },
  {
    name: 'Maximem',
    description:
      'Maximem builds the memory layer that keeps your data encrypted, even from us — so the agents you build and the AI you use can finally remember.',
    founders: 'By Gaurav Dadhich',
    url: 'https://www.maximem.ai/',
    image: 'maximem.webp',
  },
  {
    name: 'xSpecies AI',
    description:
      'xspecies is building embodied intelligence (Humanoid Robots) designed to operate safely and reliably in human-centric environments, from homes and retail spaces to healthcare and logistics.',
    founders: 'By Srikanth V',
    url: 'https://www.xspecies.ai/',
    image: 'xspecies-ai.webp',
  },
  {
    name: 'Handa Uncle',
    description:
      "India's AI Powered Personal Finance Platform - Revolutionizing financial guidance in India with unbiased, AI-powered guidance that puts users first, not commissions.",
    founders: 'By Ravi Handa, Vikas bansal & Madhuker Priyesh',
    url: 'https://www.handauncle.com/',
    image: 'handa-uncle.webp',
  },
  {
    name: 'Lemnisca Bio Tech',
    description:
      'The AI predicts the scalability of small formulations in bio reactors and suggests if this will be stable at large production.',
    founders: 'By Dr Pushkar & Dr Shilpa',
    url: 'https://www.lemnisca.bio/',
    image: 'lemnisca-bio-tech.webp',
  },
  {
    name: 'Antimattr',
    description:
      'Antimattr.one - MattrPods is an AI-powered audio wearable with modular camera that provides hands-free ambient computing',
    founders: 'By Sridipto Ghosh & Sirsho Chakraborty',
    url: 'https://www.antimattr.one/',
    image: 'antimattr.webp',
  },
];

export type LabPhoto = {
  /** The large file, in /public/media. */
  src: string;
  /** Every width of it, for `srcset`. */
  srcSet: string;
  alt: string;
  /** `object-position`: keeps the subject in frame as a tile crops the photo. */
  position?: string;
};

/**
 * The Innovation Lab's head (2026-10-07): the name large, its line, three figures (the team's
 * "top 3" of the four above; team members left out), then the lab in photos: the first is the one
 * the scroll moment opens on, full-bleed; the rest are the mosaic it pulls back into, in order
 * (left tall, left short, right short, right tall). Photos from Scaler's own Innovation Lab page
 * (scaler.com/innovation-lab), 2026-10-07; public/media/CREDITS.md.
 */
export const labBand = {
  // SSB's own heading and line for the lab (the live site's section, the team's ask): before,
  // "Scaler Innovation Lab" / "Network with founders, land internships, and work on real startup
  // projects, 10 steps from your classroom."
  title: 'Scaler’s Innovation Lab for non-technical leaders',
  line: 'Enter without code. Exit with the capability to build real world products as a Mini CEO.',
  stats: [
    { value: '$1B+', label: 'Combined valuations' },
    // shortened from the deck's "Revenue in Live Businesses" (the team's call), to sit on one line
    { value: '₹10Cr+', label: 'Revenue generated' },
    { value: '$2M+', label: 'Funding raised' },
  ],
  photos: [
    {
      src: '/media/lab-build-1890.webp',
      srcSet: '/media/lab-build-960.webp 960w, /media/lab-build-1890.webp 1890w',
      alt: 'Five students building a drone together at a workbench in the lab',
      position: '55% 50%',
    },
    {
      src: '/media/lab-hand-1400.webp',
      srcSet: '/media/lab-hand-800.webp 800w, /media/lab-hand-1400.webp 1400w',
      alt: 'A student testing a robotic hand in the robotics lab',
      position: '38% 50%',
    },
    {
      src: '/media/lab-space-1400.webp',
      srcSet: '/media/lab-space-800.webp 800w, /media/lab-space-1400.webp 1400w',
      alt: 'The lab’s glass-walled rooms, Lab 04 among them',
    },
    {
      src: '/media/lab-drone-1400.webp',
      srcSet: '/media/lab-drone-800.webp 800w, /media/lab-drone-1400.webp 1400w',
      alt: 'A student flying a drone outside the lab',
      position: '60% 50%',
    },
    {
      src: '/media/lab-mentor-1400.webp',
      srcSet: '/media/lab-mentor-800.webp 800w, /media/lab-mentor-1400.webp 1400w',
      alt: 'A mentor trying out a student’s project while the team looks on',
      position: '72% 50%',
    },
  ] satisfies LabPhoto[],
};

/** Under the band, the startups' row: its heading, "10+ startups" in the logo's green. */
export const labTurn = {
  setup: '10+ startups incubated here,',
  lead: 'founded by leaders from Big Tech.',
  accent: '10+ startups',
};

/**
 * The startups as Beyond Placements' cards (the team: "similar to student startups"). Their
 * banners are wide, so each card's square takes the banner's two colours (sampled from its top
 * and bottom rows) with the banner across its middle. Descriptions shortened from the AI-B page's
 * to about three lines; sectors are ours. No figures yet: none per startup.
 */
const tint: Record<string, [string, string]> = {
  'gahan-ai.webp': ['#981619', '#AF4446'],
  'maximem.webp': ['#0354FE', '#6093FF'],
  'xspecies-ai.webp': ['#189A4D', '#3AB068'],
  'handa-uncle.webp': ['#4D62FE', '#7A89FE'],
  'lemnisca-bio-tech.webp': ['#3495D3', '#5DB6F1'],
  'antimattr.webp': ['#E02803', '#EA674D'],
};
const about: Record<string, { sector: string; description: string }> = {
  'Gahan AI': {
    sector: 'Deep tech',
    description:
      'Automotive-grade mmWave radar for ADAS, smart infrastructure and industrial automation, built for Indian roads.',
  },
  Maximem: {
    sector: 'AI infrastructure',
    description:
      'The memory layer for AI: your data stays encrypted, even from Maximem, so the agents you build can finally remember.',
  },
  'xSpecies AI': {
    sector: 'Robotics',
    description:
      'Humanoid robots built to work safely and reliably in human spaces, from homes and retail to healthcare and logistics.',
  },
  'Handa Uncle': {
    sector: 'Fintech',
    description:
      'India’s AI-powered personal finance platform: unbiased money guidance that puts users first, not commissions.',
  },
  'Lemnisca Bio Tech': {
    sector: 'Biotech',
    description:
      'AI that predicts whether a small bioreactor formulation will stay stable at production scale, before the scale-up.',
  },
  Antimattr: {
    sector: 'AI wearables',
    description:
      'MattrPods: an AI-powered audio wearable with a modular camera, for hands-free ambient computing through the day.',
  },
};

export const labVentures: Venture[] = labStartups.map((s) => {
  const founders = s.founders
    .replace(/^By\s+/, '')
    .split(/\s*(?:,|&)\s*/)
    .map((n) => n.replace(/\bbansal\b/, 'Bansal'));
  const [top, bottom] = tint[s.image];
  return {
    company: s.name,
    founders,
    role: founders.length > 1 ? 'Co-founders' : 'Founder',
    sector: about[s.name].sector,
    description: about[s.name].description,
    banner: { src: `/startups/${s.image}`, top, bottom },
    href: s.url,
  };
});
