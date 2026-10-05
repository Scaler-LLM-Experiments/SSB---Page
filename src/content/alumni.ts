// Strong Alumni Base: from the deck (SSB Website vF, Sep '26). Each card reads
// "<role> at <company>" over the role they held before SSB.
//
// Marks are each company's own app/site icon. `fill` marks an icon that comes
// on its own coloured square (it fills the tile); the rest sit inside it.

import type { HeroLogo } from '@/sections/hero/types';

export type CompanyMark = { name: string; src: string; fill?: boolean };

export type Alumnus = {
  name: string;
  /** File in /public/alumni, without the extension (WebP, 480x600). */
  photo: string;
  /** Role before SSB. */
  before: string;
  /** Role after SSB, and where. */
  role: string;
  company: CompanyMark;
};

const marks = {
  blinkit: { name: 'Blinkit', src: '/logos/marks/blinkit.png', fill: true },
  urbancompany: { name: 'Urban Company', src: '/logos/marks/urbancompany.png', fill: true },
  razorpay: { name: 'Razorpay', src: '/logos/marks/razorpay.png' },
  avendus: { name: 'Avendus', src: '/logos/marks/avendus.png' },
  emergent: { name: 'Emergent', src: '/logos/marks/emergent.png', fill: true },
  wholetruth: { name: 'The Whole Truth', src: '/logos/marks/wholetruth.svg' },
  bharatpe: { name: 'BharatPe', src: '/logos/marks/bharatpe.svg' },
  ninjacart: { name: 'Ninjacart', src: '/logos/marks/ninjacart.png' },
} satisfies Record<string, CompanyMark>;

export const alumni: Alumnus[] = [
  {
    name: 'Uttara Nambiar',
    photo: 'uttara-nambiar',
    before: 'Software Developer',
    role: 'Asst. Program Manager',
    company: marks.blinkit,
  },
  {
    name: 'Sagnik Banerjee',
    photo: 'sagnik-banerjee',
    before: 'Project Lead',
    role: 'Sr. Strategy Manager',
    company: marks.urbancompany,
  },
  {
    name: 'Suhaas Sastry',
    photo: 'suhaas-sastry',
    before: 'Sales Engineer',
    role: 'Partnerships',
    company: marks.razorpay,
  },
  {
    name: 'Pranav Bagla',
    photo: 'pranav-bagla',
    before: 'Investment Analyst',
    role: 'Investment Advisor',
    company: marks.avendus,
  },
  {
    name: 'Kritika Bhatia',
    photo: 'kritika-bhatia',
    before: 'Financial Analyst',
    role: 'Growth Marketing',
    company: marks.emergent,
  },
  {
    // The deck spells it "Ashish US" here and "Aashish US" in Beyond Placements.
    name: 'Aashish US',
    photo: 'aashish-us',
    before: 'Founder',
    role: 'Brand Marketing',
    company: marks.wholetruth,
  },
  {
    name: 'Moh Agarwal',
    photo: 'moh-agarwal',
    before: 'Fresher',
    role: 'Growth Marketing',
    company: marks.bharatpe,
  },
  {
    name: 'Bharath Ramesh',
    photo: 'bharath-ramesh',
    before: 'Executive',
    role: 'Growth Manager',
    company: marks.ninjacart,
  },
];

// Your peers come from: the deck's list, in its order. Our own files in
// public/logos, trimmed to their edges; `ink` measured in one tone (CLAUDE.md, "Logos").
export const peerCompanies: HeroLogo[] = [
  { name: 'Amazon', logoUrl: '/logos/amazon.svg', wordmark: 'Amazon', ink: 0.34 },
  { name: 'McKinsey & Company', logoUrl: '/logos/mckinsey.svg', wordmark: 'McKinsey', ink: 0.13 },
  { name: 'Uber', logoUrl: '/logos/uber.svg', wordmark: 'Uber', ink: 0.38 },
  { name: 'Deloitte', logoUrl: '/logos/deloitte.svg', wordmark: 'Deloitte', ink: 0.52 },
  { name: 'KPMG', logoUrl: '/logos/kpmg.svg', wordmark: 'KPMG', ink: 0.35 },
  { name: 'PwC', logoUrl: '/logos/pwc.svg', wordmark: 'PwC', ink: 0.26 },
  { name: 'Accenture', logoUrl: '/logos/accenture.svg', wordmark: 'Accenture', ink: 0.25 },
  { name: 'EY', logoUrl: '/logos/ey.svg', wordmark: 'EY', ink: 0.28 },
  { name: 'Jio', logoUrl: '/logos/jio.svg', wordmark: 'Jio', ink: 0.63 },
  { name: 'Apollo Hospitals', logoUrl: '/logos/apollo.svg', wordmark: 'Apollo', ink: 0.25 },
  { name: 'Deutsche Bank', logoUrl: '/logos/deutschebank.svg', wordmark: 'Deutsche Bank', ink: 0.18 },
  { name: 'Axis Bank', logoUrl: '/logos/axisbank.svg', wordmark: 'Axis Bank', ink: 0.2 },
  { name: 'IIFL Finance', logoUrl: '/logos/iifl.svg', wordmark: 'IIFL', ink: 0.32 },
  { name: 'S&P Global', logoUrl: '/logos/spglobal.svg', wordmark: 'S&P Global', ink: 0.4 },
  { name: 'DMart', logoUrl: '/logos/dmart.svg', wordmark: 'DMart', ink: 0.34 },
  { name: 'Tata Consultancy Services', logoUrl: '/logos/tcs.svg', wordmark: 'TCS', ink: 0.12 },
  { name: 'Lufthansa', logoUrl: '/logos/lufthansa.svg', wordmark: 'Lufthansa', ink: 0.26 },
  { name: 'ZS Associates', logoUrl: '/logos/zs.svg', wordmark: 'ZS', ink: 0.2 },
  { name: 'Freshworks', logoUrl: '/logos/freshworks.svg', wordmark: 'Freshworks', ink: 0.24 },
];
