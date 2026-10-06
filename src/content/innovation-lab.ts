// Scaler Innovation Lab section, from "SSB Website vF _ Sep'26", slide 12.

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
};export type LabStartup = {
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
