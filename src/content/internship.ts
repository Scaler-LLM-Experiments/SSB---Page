import type { BottomNavItem } from '@/content/bottom-nav';
import { bottomNav } from '@/content/bottom-nav';
import { deckClose } from '@/content/deck';
import { alumni, pivotAlumni, type Alumnus } from '@/content/alumni';
import type { CloseContent } from '@/sections/deck/DeckFinale';
import type { HeroLogo } from '@/sections/hero/types';
import type { Reel } from '@/sections/internship/StoryReels';

/*
 * The internship page (/internship, 2026-11-12), rebuilt from the live page
 * (scaler.com/school-of-business/internship/, read that day) in the home page's components: the
 * companies in the first fold, on the home page's flipping logo grid; the outcomes after the user's
 * reference (three figures, the learners on the home page's alumni cards, a closer look at the role
 * split, the two facts and the companies); the students' videos on the home page's reel row; the
 * request-a-callback band. The copy is
 * the live page's, set in the components' patterns (sentence case, no exclamation marks); nothing is
 * added that the live page doesn't say.
 *
 * TO CONFIRM before this ships: the live page's figures are its "pre-placement season" (70% with
 * full-time internships 2 months early, ₹60,000 highest and ₹40,000 median monthly stipend, offers
 * within 10 months). The home page's internship section says otherwise (100% internship placement,
 * stipends up to ₹1 lakh, 52%+ in Product and Founder's Office; content/deck.ts
 * `deckInternshipStats`), and the live page's role split puts Product and Founder's Office at 36%.
 */

const APPLY = 'https://www.scaler.com/school-of-business/application';
const BROCHURE =
  'https://d2beiqkhq929f0.cloudfront.net/public_assets/assets/000/164/923/original/brochure-nov-compressed.pdf?1763005202';

/** Where our learners intern: the live internship page's twelve first, in its order, then the rest of
 *  the live home page's "Our learners are now creating impact at" (the home page's files,
 *  public/internship/logos). The first fold shows twelve at a time and flips through all of them. */
const COMPANIES = [
  'Razorpay',
  'MPL',
  'Chai Point',
  'Aeos Labs',
  'SpotDraft',
  'WNS Vuram',
  'Vaani',
  'Emergent',
  'Neosapien',
  'Clientell',
  'BharatPe',
  'Onsurity',
  'BCCI',
  'The Whole Truth',
  'apna',
  'LoEstro',
  'Airtribe',
  'Slikk',
  'Ninjacart',
  'BorderPlus',
  'ToolJet',
  'FirstClub',
  'LimeChat',
  'Reckitt',
];

/** The first fold: the title and the live page's line, the actions, and the companies. */
export const internshipHero = {
  chip: 'Pre-placement season',
  title: 'Internship outcomes',
  // the live page's line ("Just halfway through the program, great impact already, and a lot more
  // to come.") with its first figure ("70% secured full-time internships 2 months early")
  sub: 'Halfway through the programme, 70% have secured full-time internships, two months early.',
  primaryCta: { label: 'Apply Now', href: APPLY },
  secondaryCta: { label: 'Download Brochure', href: BROCHURE },
  logosLabel: 'Our learners intern at',
  logos: COMPANIES.map((name): HeroLogo => ({
    name,
    wordmark: name,
    logoUrl: `/internship/logos/${name.toLowerCase().replace(/ /g, '-')}.png`,
  })),
};

/** The role split (the live page's "Land High Impact Roles" poster, read 2026-11-12), largest first. */
const ROLES = [
  { name: 'Marketing', share: 38 },
  { name: 'Product', share: 21 },
  { name: 'Strategy', share: 15 },
  { name: 'Founder’s Office', share: 15 },
  { name: 'Operations', share: 6 },
  { name: 'Finance', share: 5 },
];

/** The outcomes, after the user's reference (2026-11-12: his earlier cohort section, broken up, not
 *  one card): the header and the live page's line, three figures, the learners' profiles on the home
 *  page's alumni cards, then a closer look (the role split, the two "Did you know?" facts, the
 *  companies). */
export const internshipOutcomes = {
  eyebrow: 'Outcomes',
  title: 'Pre-placement outcomes.|Great impact already, and more to come.',
  // the live page's line under its figures
  sub: 'Our students got full-time internship offers within 10 months, and the number keeps growing.',
  stats: [
    { value: '70%', label: 'Full-time internships, 2 months early' },
    { value: '₹60,000', label: 'Highest monthly stipend' },
    { value: '₹40,000', label: 'Median monthly stipend' },
  ],
  // the live site's "Success stories and pivots" (the home page's internship learners): Uttara Nambiar
  // and Bharath Ramesh on their alumni cards (they have portraits), then the rest, who don't yet
  people: [
    alumni.find((a) => a.name === 'Uttara Nambiar'),
    alumni.find((a) => a.name === 'Bharath Ramesh'),
    ...pivotAlumni,
  ].filter((a): a is Alumnus => Boolean(a)),
};

/** "A closer look" (his reference's "Take a look at cohort distribution"): 01 the role split as a donut,
 *  02 the live page's two "Did you know?" facts, 03 the companies, flipping. */
export const internshipCloser = {
  title: 'A closer look',
  roles: { num: '01', title: 'Internship roles by function', items: ROLES },
  facts: {
    num: '02',
    title: 'Beyond internships',
    items: [
      { icon: 'revenue', value: '₹10L+', label: 'Revenue from real sales at our students’ startups' },
      { icon: 'trophy', value: 'IIM-C', label: 'Winners: a team from our cohort won the competition' },
    ] as { icon: 'revenue' | 'trophy'; value: string; label: string }[],
  },
  // the companies flip through the first fold's twenty-four (resolved and passed in by the page)
  companies: { num: '03', title: 'Companies our learners intern at' },
};

const CDN = 'https://d2beiqkhq929f0.cloudfront.net/public_assets/assets/000';

/** "What our students are saying", on the home page's reel row: the five students' videos from the
 *  live page (vertical, 9:16, 40–50 MB each; the row plays only the one most on screen), each with
 *  the line the home page's reels give it (its cover's headline). `start`: past the first, blank
 *  frame. */
export const internshipStories: { eyebrow: string; title: string; reels: Reel[] } = {
  eyebrow: 'Student stories',
  title: 'What our students are saying.|In their own words.',
  reels: [
    {
      name: 'Akarsh',
      line: 'Created a GTM strategy for BSLR Technologies',
      clip: `${CDN}/138/535/original/akarsh.mp4?1752238085`,
      start: 0.1,
    },
    {
      name: 'Yukthi',
      line: 'Career pivot from operations to strategy',
      clip: `${CDN}/138/859/original/yukhti_compressed.mp4?1752568638`,
      start: 0.1,
    },
    {
      name: 'Moh',
      line: 'Building a Shark Tank funded startup',
      clip: `${CDN}/138/217/original/Script_6_Moh_2_9-16_%281%29.mp4?1752057825`,
      start: 0.1,
    },
    {
      name: 'Ayush',
      line: 'From CA to private equity',
      clip: `${CDN}/138/536/original/ayush.mp4?1752238172`,
      start: 0.1,
    },
    {
      name: 'Yash',
      line: 'From fintech intern to Founder’s Office',
      clip: `${CDN}/138/537/original/yash.mp4?1752238269`,
      start: 0.1,
    },
  ],
};

/** The request-a-callback band, last before the footer (the admission page's), the key figures again. */
export const internshipCallback: CloseContent = {
  ...deckClose,
  eyebrow: undefined,
  title: 'Questions about the internship?',
  line: 'Talk to an admissions counsellor, one to one, about internships, roles and stipends.',
  // PLACEHOLDER href: the home page's call-back placeholder, until a real destination is agreed
  primaryCta: { label: bottomNav.callback.label, href: bottomNav.callback.href, icon: 'arrow' },
  secondaryCta: { label: 'Download Brochure', href: BROCHURE, icon: 'download' },
  facts: [
    { value: '70%', label: 'Full-time internships' },
    { value: '₹60,000', label: 'Highest stipend' },
    { value: '₹40,000', label: 'Median stipend' },
    { value: '10 months', label: 'Offers within' },
  ],
  // SSB's own photo: students in a lecture hall (the live page's first fold is a classroom too)
  image: '/campus/classroom.webp',
  imageSmall: '/campus/classroom.webp',
  imageAlt: 'SSB students in a lecture hall',
};

/** The bottom navigation: this page's sections. Each target is a section's heading id (or the first
 *  fold's own); a target resolves to its closest section. */
export const internshipNav: BottomNavItem[] = [
  { label: 'Companies', target: 'int-top' },
  { label: 'Outcomes', target: 'alumni-title' },
  { label: 'Placements', target: 'placements-showcase-title' },
  { label: 'Stories', target: 'stories-title' },
];
