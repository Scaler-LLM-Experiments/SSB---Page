import { heroFrame, type HeroFrameContent } from '@/content/home';
import { alumni } from '@/content/alumni';
import { faqs } from '@/content/admissions';
import type { Faq } from '@/content/admissions';
import type { Venture } from '@/content/community';
import { labBand, labVentures } from '@/content/innovation-lab';
import { placements } from '@/content/placements';
import type { BuiltCard, BuiltContent } from '@/sections/built/BuiltCards';
import type { PlacementsContent } from '@/sections/placements/types';
import type { WhyBreakerCopy, WhyFigure } from '@/sections/why/types';
import { why } from '@/content/why';

/*
 * The deck variant (/v7, 2026-10-28, the user's ask): the home page in the order and words of the
 * stakeholders' deck ("SSB Website vF _ Sep'26", 30 slides), each slide named beside its content.
 * Sections already built for vFinal are reused as they are, fed this copy where theirs differs.
 *
 * Photos in public/deck are from Unsplash (free licence), stand-ins until the team's own arrive:
 * the student startups, the AI products, the success stories, two lab startups and the closing band.
 * Copy marked PLACEHOLDER is the deck's own unfinished copy ("₹XCr+", "[app name]").
 */

/** Slide 2: vFinal's first fold, its eyebrow without "Full-Time" (2026-10-28, the user's ask). */
export const deckHero: HeroFrameContent = {
  ...heroFrame,
  eyebrow: 'PGP in Management & Technology',
  // without the trailing "…" (2026-10-28, the user's ask)
  logosLabel: 'Built by leaders from',
};

/** Slide 3: the five figures (the deck's order on its slide), the audited report, the recruiters. */
export const deckPlacements: PlacementsContent = {
  ...placements,
  eyebrow: 'Outcomes',
  title: 'Placement highlights.|Where our first cohorts went.',
  reportLabel: 'Download Audited Placement Report',
  // The showcase reads its first figures from the photo cards (₹25.7L, 3.2x); these follow them.
  v3Cohorts: [
    { value: '₹19L', label: 'Average CTC' },
    { value: '87%', label: 'Switched industries or roles' },
    { value: '55%+', label: 'Digital & AI-first roles' },
  ],
  recruitersTitle: 'Our recruiters: MNCs, AI companies & top startups',
};

/** Slide 4: the Kamath breaker (2026-10-28, the user's reference): "Why SSB" over the question, his
 *  words in full under it, who said them, then the two figures with their sources. */
export const deckWhy: WhyBreakerCopy = {
  // (later, 2026-10-28, the user's reference) the eyebrow, the question as the title, his words in full
  // as the line, who said them under it; no roles
  eyebrow: 'Why SSB',
  title: 'Why the traditional MBA doesn’t work',
  sub: '“If you’re 25 and going to an MBA college today, you must be some kind of idiot, if you ask me.”',
  note: 'Nikhil Kamath, Co‑founder, Zerodha',
};
/** The two figures with their sources, in full (the second's whole line, the user's reference) */
export const deckWhyFigures: WhyFigure[] = why.figures;

/** Slide 5: the eight alumni, in the deck's order, and "Your peers come from". */
export const deckAlumni = {
  eyebrow: 'Alumni',
  title: 'A strong alumni base.|Already at Blinkit, Urban Company, Razorpay and more.',
  sub: 'From software, sales and finance into strategy, growth and investing roles.',
  people: alumni,
  peersTitle: 'Your peers come from',
};

/** Slide 6: the student startups on vFinal's Built at SSB cards (2026-10-28, the user's ask), with this
 *  variant's photos. Listed as the deck's two rows interleaved: the cards fill their two rows column by
 *  column, so row 1 runs along the top and row 2 under it. Figures only where the deck gives one. */
const img = (src: string, alt: string, height = 800) => ({ src: `/deck/${src}.jpg`, alt, width: 1200, height });
const startupsRow1: BuiltCard[] = [
  {
    company: 'Dream Kit',
    sector: 'STEAM toys',
    by: 'Aashish US',
    blurb: 'A homegrown STEAM toy brand used across schools, built while holding a full-time role at The Whole Truth.',
    stat: { value: '₹2Cr', label: '12,000+ students reached' },
    image: img('toy', 'A small robot car built from a STEAM kit'),
    focus: [0.5, 0.5],
  },
  {
    company: 'Gredo',
    sector: 'Protein food',
    by: 'Sanskriti Deshmukh',
    blurb: 'A protein-food brand live on Zomato and Swiggy, with vending machines across Bangalore.',
    stat: { value: '₹1Cr+', label: 'ARR' },
    image: img('protein', 'Protein bars stacked on a table'),
    focus: [0.5, 0.5],
  },
  {
    company: 'Chaubaraa',
    sector: 'Fragrance',
    by: 'Chavda Tirthrajsinh, Geetika Mehta & Malika Gupta',
    blurb: 'Solid and liquid perfumes inspired by familiar memories, emotions and characters.',
    stat: { value: '₹30L+', label: 'ARR' },
    image: img('perfume', 'A glass perfume bottle on a stone table', 1200),
    focus: [0.5, 0.45],
  },
  {
    company: 'Personal brand',
    sector: 'Creator economy',
    by: 'Paritosh Sinha',
    blurb: 'Skipped placements to build his creator business full-time; now fielding publishing offers for his debut book.',
    stat: { value: '200K', label: 'Followers, up from 8K' },
    image: img('creator', 'A creator’s desk with a laptop, camera and editing console'),
    focus: [0.5, 0.5],
  },
];
const startupsRow2: BuiltCard[] = [
  {
    company: 'Onlyfeet',
    sector: 'Fashion',
    by: 'Mahnoor Z Mistry',
    blurb: 'Premium novelty socks in collectible cans, with quirky designs for Gen Z and millennials.',
    stat: { value: '₹28L+', label: 'ARR' },
    image: img('socks', 'Colourful patterned socks drying on a line'),
    focus: [0.5, 0.5],
  },
  {
    company: 'Gradesense',
    sector: 'AI · EdTech',
    by: 'Ayush Poojary',
    blurb: 'An AI platform that evaluates descriptive and handwritten assessments at scale.',
    image: img('exam', 'A hand marking an answer sheet'),
    focus: [0.5, 0.5],
  },
  {
    company: 'Tally Konnect',
    sector: 'Family business',
    by: 'Moh Agarwal',
    blurb: 'Joined the family business after SSB and launched its ERP automation platform.',
    image: img('erp', 'A warehouse stacked with boxed inventory'),
    focus: [0.5, 0.5],
  },
  {
    // PLACEHOLDER name: the deck has "[app name]"
    company: 'Smart valet app',
    sector: 'Mobility',
    by: 'Yash Ramchandani',
    blurb: 'A smart valet platform, built from scratch, that streamlines car handovers at high-footfall venues.',
    image: img('parking', 'A car park seen from above'),
    focus: [0.5, 0.5],
  },
];

export const deckStartups: BuiltContent = {
  eyebrow: 'Beyond placements',
  title: 'Startups by our students.',
  titleTail: 'Some didn’t just find careers. They built companies.',
  label: 'Startups built by SSB students',
  companies: startupsRow1.flatMap((v, i) => [v, startupsRow2[i]]),
};

/** Slide 7: the quote under the investors' row, and the VC events (the deck's note). */
export const deckOnCampus = {
  quote:
    'The energy at SSB & SST was intentional. The ideas students shared were grounded in reality, and with the kind of support and ecosystem they have here, they’re definitely on the right track to building things that matter.',
  name: 'Sidhant Goyal',
  role: 'Ex-Sequoia, McKinsey & Company',
  photo: '/people/sidhant-goyal.webp',
  events: {
    value: '20+',
    label: 'VCs on campus',
    text: 'At Navera and SAIS’26, the Scaler Innovation Lab’s own events, students pitch to and network with the investors.',
  },
};

/** Slides 9–12: the four USPs, in vFinal's words ("Five ways SSB teaches business", its rail's labels
 *  and lines), in the deck's order (2026-10-28, the user's ask). */
export const deckUsps = {
  eyebrow: 'How you learn',
  title: 'Four ways SSB teaches business.|All of them by doing it.',
  sub: 'Every term ends in a build. Some became companies.',
  items: [
    { id: 'usp-business', num: '01', label: 'Build real businesses', line: 'Build two real businesses with real money, then pitch one to VCs.', icon: 'learn' },
    { id: 'usp-ai', num: '02', label: 'Learn AI fluency', line: 'Ship an AI product every term. No coding background needed.', icon: 'ai' },
    { id: 'usp-immersions', num: '03', label: 'Go on industry immersions', line: 'Learn where the work happens: factory floors, quick-commerce ops and a creative agency.', icon: 'immersions' },
    { id: 'usp-projects', num: '04', label: 'Work on live projects', line: 'Work real briefs from real companies, then defend your plan to their founders.', icon: 'projects' },
  ] as const,
};

/** Slide 9: the two businesses, in the deck's words, as vertical cards (2026-10-28, the user's ask): the
 *  video on top, the programme, a line under it, three figures in a highlighted strip, and its proof. */
export const deckBusinesses = {
  title: 'Build 2 real businesses. Pitch to VCs.|Graduate with founder experience.',
  cards: [
    {
      label: 'The D2C Startup Challenge',
      // the deck's own wording (2026-10-28, the user's ask: the figures in the line, not a strip)
      sub: 'Build a live D2C brand. Target ₹5L+ revenue within 6 weeks. ₹25,000 in startup funding. End-to-end execution: sourcing, branding, packaging & pricing.',
      stats: [
        { value: '₹25K', label: 'Startup funding' },
        { value: '₹5L+', label: 'Revenue target' },
        { value: '6 weeks', label: 'To get there' },
      ],
      proof: { tag: 'Year 1 result', text: 'Our first cohort generated ₹15L+ revenue in 1 month.' },
      image: '/learn/d2c.jpg',
      video: { id: 's0KKS3FxNUU', title: 'D2C Startup Challenge - Scaler School of Business' },
    },
    {
      label: 'The Hustle Program',
      sub: 'Go from MVP to revenue to raising VC capital. ₹50,000 in funding to start, a ₹25L funding pathway and a VC Demo Day pitch. Backed by Lightrock, Peak XV & Sidhant Goyal.',
      stats: [
        { value: '₹50K', label: 'Funding to start' },
        { value: '₹25L', label: 'Funding pathway' },
        { value: 'VC', label: 'Demo Day pitch' },
      ],
      proof: { tag: 'Year 1 teams', text: 'From a fintech to “an Apple Watch for pet dogs.”' },
      image: '/learn/hustle.jpg',
      video: { id: '6V9RgMnFFaU', title: 'Next $Billion Dollar Idea? Business School Students Pitch to VCs' },
    },
  ],
};

/** Slide 9: under the two businesses, the four ways they are backed. */
export const deckBusinessFacts = {
  title: 'Backed at every step.',
  items: [
    // PLACEHOLDER figure: the deck's "₹XCr+"
    { title: '₹XCr+ startup fund', text: 'Committed to student ventures, from the D2C Startup Challenge to the Hustle Program.', image: '/deck/fund.jpg' },
    { title: 'VC Demo Days', text: 'Pitch to Peak XV, Tiger Global, Y Combinator, Entrepreneur First, Campus Fund and Mela Ventures.', image: '/deck/demoday.jpg' },
    // the lab's own photo (public/media), not a stock one
    { title: 'Shared Innovation Lab', text: '10+ startups incubated, ₹10Cr+ in revenue and $1B+ in valuations, on campus.', image: '/media/lab-space-800.webp' },
    { title: '1:1 mentorship', text: 'From leaders at BCG, McKinsey, Paytm, Blinkit, Google, Zomato, Flipkart and Bain.', image: '/deck/mentor.jpg' },
  ],
}

/** Slide 10: three steps, then the kinds of products students build. */
export const deckAiProducts = {
  eyebrow: 'AI products',
  title: 'Build 5+ AI products & 10x efficiency.|With no coding background.',
  // (2026-10-28, the user's ask) each step's points as one line, under a visual that proves it
  steps: [
    {
      title: 'Learn the tools.',
      line: 'AI foundations and no-code business tools from Week 1: 25+ tools, 150+ hours of hands-on practice.',
      tools: ['n8n', 'Zapier', 'Notion', 'Microsoft Copilot', 'ChatGPT', 'Claude', 'Gemini', 'Airtable'],
      badges: ['25+ AI tools', '150+ hours'],
    },
    {
      title: 'Build with mentors, not manuals.',
      // the mentors are named in the panel above, so the line doesn't repeat them (2026-10-28)
      line: '10+ AI workshops and a Scaler AI Labs partnership: frontier AI companies, RL environments and curated datasets.',
      // photos where the project has one; initials until the team's arrive
      mentors: [
        { name: 'Arvind N', org: 'GPT-3 / GPT-4', logo: '/logos/marks/lead-openai.png' },
        { name: 'Varun Mohan', org: 'Google DeepMind', logo: '/logos/marks/lead-google.png' },
        { name: 'Yash Kumar', org: 'OpenAI', photo: '/sessions/yash-kumar.webp', logo: '/logos/marks/lead-openai.png' },
      ],
      badges: ['10+ AI workshops'],
    },
    {
      title: 'Ship something real.',
      line: 'Five real AI products built and launched per student before graduation, across 3 hackathons and buildathons.',
      figures: [
        { value: '5', label: 'AI products launched' },
        { value: '3', label: 'Hackathons & buildathons' },
      ],
    },
  ],
  productsTitle: 'Types of products you’ll build',
  products: [
    { title: 'Splitwise clone', text: 'Split expenses between friends', image: '/deck/expense.jpg' },
    { title: 'Language learning assistant', text: 'A voice tutor that listens and corrects', image: '/deck/language.jpg' },
    { title: 'Negotiation training AI coach', text: 'Practise a deal against an AI counterpart', image: '/deck/negotiation.jpg' },
    { title: 'Case interview practice tool', text: 'Rehearse cases and guesstimates on demand', image: '/deck/interview.jpg' },
    { title: 'Party icebreaker AI game', text: 'A game that gets a room talking', image: '/deck/party.jpg' },
  ],
};

/** Slide 11: the immersions in the deck's words (2026-10-28, the user's ask: the page's cards, the Jio
 *  Creative Labs photo with its line, then the SSB creators). Trips and creators are vFinal's. */
export const deckImmersions = {
  title: 'Immersions beyond the classroom.|Factory floors, quick commerce and a creative agency.',
  // (2026-10-28, the user's ask) a feature card of its own, as the Jio Creative Labs one: an Unsplash
  // photo of a factory floor (stand-in), the three companies listed inside it
  trips: {
    label: 'Domestic immersions',
    title: '3 domestic immersions',
    line: 'Across industries: manufacturing floors, quick-commerce backend ops, a fashion brand headquarters.',
    image: '/deck/immersion.jpg',
  },
  // PLACEHOLDER names and stories (2026-10-28, the user's ask: "random student names and what they
  // did there, in two lines"), until the team's real ones; keyed by the logo's company
  stories: {
    ArcelorMittal: { name: 'Riya Sharma', did: 'Costed every unit on the line and pitched a quality-check fix to the plant head.' },
    Zepto: { name: 'Arjun Mehta', did: 'Ran a dark-store shift and cut picking time with a new inventory layout.' },
    Myntra: { name: 'Sneha Iyer', did: 'Sat in on a season’s merchandising and pitched a campaign to the brand team.' },
  } as Record<string, { name: string; did: string }>,
  track: {
    label: 'Creator-preneur track',
    title: '6 months inside Jio Creative Labs',
    line: 'Embedded inside Reliance’s in-house creative agency, working on campaigns like Jio Dhan Dhana Dhan and its IPL-tied cricket-season push.',
    image: '/immersions/creator-preneur-track.webp',
    creatorsTitle: 'Creators from SSB’s creator lab',
  },
};

/** Slide 12: the live projects (2026-10-28, the user's ask: the page's cards, the companies' own logos,
 *  taken from their sites; Quenzy's site didn't load, so it shows its name). Briefs and photos are
 *  vFinal's. */
export const deckLiveProjects = {
  title: 'Live consulting projects.|With actual companies.',
  sub: 'Several students in this cohort were hired directly because of the quality of their live project work.',
  projects: [
    { company: 'Mokobara', logo: '/logos/live/mokobara.svg', title: 'International expansion', desc: 'Design the APAC strategy for a ₹200Cr business and pitch to its founders.', image: '/live-projects/mokobara.jpg' },
    { company: 'AJIO', logo: '/logos/live/ajio.svg', title: 'Product teardown', desc: 'Map conversion friction from discovery and search to product page and checkout.', image: '/live-projects/ajio.jpg' },
    { company: 'Practo', logo: '/logos/live/practo.svg', title: 'Healthcare growth', desc: 'Grow healthcare GMV across primary, secondary and tertiary care.', image: '/live-projects/practo.jpg' },
    { company: 'Meolaa', logo: '/logos/live/meolaa.png', title: 'Launch strategy', desc: 'Build onboarding flows, brand campaigns and an app-launch roadmap.', image: '/live-projects/meolaa.jpg' },
    { company: 'Quenzy', title: 'Product-market fit', desc: 'Build a PMF and go-to-market strategy across culture, distribution and positioning.', image: '/live-projects/quenzy.jpg' },
    { company: 'StockGro', logo: '/logos/live/stockgro.webp', title: 'Stockathon', desc: 'Trade in a live mock-market simulation under real market conditions.', image: '/live-projects/stockgro.jpg' },
  ] as { company: string; logo?: string; title: string; desc: string; image: string }[],
};

/** Slide 12: each live project's company logo (their own sites, 2026-10-28), shown white on vFinal's
 *  cards in place of the name; Quenzy's site didn't load, so its card keeps the name. */
export const deckLiveLogos: Record<string, string> = {
  Mokobara: '/logos/live/mokobara.svg',
  AJIO: '/logos/live/ajio.svg',
  Practo: '/logos/live/practo.svg',
  Meolaa: '/logos/live/meolaa.png',
  StockGro: '/logos/live/stockgro.webp',
};

/** Slide 13: the lab's heading, its five figures and the four startups the deck names. */
const labByName = new Map(labVentures.map((v) => [v.company, v]));
export const deckLab = {
  band: {
    ...labBand,
    eyebrow: 'Startup ecosystem',
    title: 'Join the heart of the startup ecosystem.|Scaler Innovation Lab.',
    line: 'Network with founders, land internships, and work on real startup projects, 10 steps from your classroom.',
    stats: [
      { value: '10+', label: 'Startups incubated' },
      { value: '₹10Cr+', label: 'Revenue in live businesses' },
      { value: '$1B+', label: 'Combined valuations' },
      { value: '100+', label: 'Team members' },
      { value: '$2M+', label: 'Funding raised' },
    ],
  },
  // vFinal's turn, its green words the deck's (2026-10-28)
  turn: { setup: 'Startups incubated', lead: 'in the Scaler Innovation Lab.', accent: 'incubated' },
  ventures: [
    {
      ...labByName.get('Gahan AI')!,
      founders: ['Pallab Maji', 'Uddalok Majumder'],
      role: 'Co-founders, Ex-OLA',
    },
    {
      company: 'Task Harmony',
      founders: ['Divyam Goel', 'Vaibhav Sawalani'],
      role: 'Co-founders, Ex-Google',
      sector: 'Productivity AI',
      description: 'An AI workspace that plans, assigns and tracks a team’s work, founded by two ex-Google engineers.',
      // PLACEHOLDER banner (its name as a wordmark), in the lab's banner style, until its logo comes
      banner: { src: '/startups/task-harmony.svg', top: '#0E6F78', bottom: '#3A9FA8' },
    },
    {
      ...labByName.get('xSpecies AI')!,
      company: 'xSpecies',
      founders: ['Srikanth Vidapanakal'],
      role: 'Founder, Ex-OLA',
      description: 'Building India’s first humanoid robot, made to work safely in homes, retail, healthcare and logistics.',
    },
    {
      company: 'Neosapiens',
      founders: ['Dhananjay Yadav', 'Aryan'],
      role: 'Co-founders',
      sector: 'AI wearables',
      description: 'An AI-native wearable, built to work with you through the day. Funded.',
      // PLACEHOLDER banner, as Task Harmony's
      banner: { src: '/startups/neosapiens.svg', top: '#4F2AC4', bottom: '#7E5BE3' },
    },
  ] satisfies Venture[],
};

/** Slide 15: the students' own stories (the internship section's shorts, moved to their own section). */
export const deckStories = {
  eyebrow: 'Student testimonials',
  title: 'Success stories.|In our students’ own words.',
  sub: 'Career pivots, funded startups and new industries, from the people who made them.',
};

/** Slide 24: the stipend in place of the duration. */
export const deckInternshipStats = [
  { eyebrow: 'Internship placement', figure: ['', '100', '%'], label: 'Internship placement', caption: 'Across cohorts 1 and 2' },
  { eyebrow: 'Stipends', figure: ['₹', '1', ' lakh'], label: 'Stipends up to', caption: 'Stipends up to' },
  { eyebrow: 'Top roles', figure: ['', '52', '%+'], label: 'Product & Founder’s Office roles', caption: 'Product & Founder’s Office roles' },
];

/** Slide 29: the deck's six questions (the sixth, the Outcomes Report, with its link to come). */
export const deckFaqs: Faq[] = [
  ...faqs,
  {
    question: 'Where can I see the full Outcomes Report?',
    answer: 'Download the audited Outcomes Report.',
    link: { label: 'Outcomes Report', href: '#placement-report' },
  },
];

/** Slide 30: the closing band. */
export const deckClose = {
  // (2026-10-28, the user's ask: the last two sections rebuilt) the band's eyebrow and facts, from the
  // page's own deadline bar and first fold
  eyebrow: 'Intake 2 · Applications close 27 Dec',
  facts: [
    { value: '11 months', label: 'incl. internship' },
    { value: 'Bangalore', label: 'On campus' },
    { value: '150', label: 'Seats' },
  ],
  title: 'Build the future. Don’t just study it.',
  line: 'Applications are open for the next cohort.',
  primaryCta: { label: 'Apply Now', href: '#apply' },
  secondaryCta: { label: 'Download Brochure', href: '#brochure' },
  faqHelp: { title: 'Still have questions?', line: 'Talk to an admissions counsellor, one to one.', cta: 'Request a callback', href: '#callback' },
  // (2026-10-28, the user's pick) SSB's own photo of its students in the lecture hall
  // (public/campus/classroom.webp), at the card's full width
  image: '/campus/classroom.webp',
  imageSmall: '/campus/classroom.webp',
  imageAlt: 'SSB students in the lecture hall',
};

/** Slide 3 rebuilt (2026-10-28, the user's figures and brief; after Stripe's "backbone of global
 *  commerce" on details.so): a centred title, the six figures in one row between hairlines, then the
 *  founding cohort's photo beside a press card (a newspaper's logo, a title, a line, the report). C1 is
 *  the founding cohort, C2 the second (placements ongoing). */
export const deckOutcomes = {
  eyebrow: 'Placements',
  title: 'Placement highlights.|Our founding cohort tripled its pay.',
  figures: [
    { value: '3.2x', label: 'Average salary hike', note: 'Cohort 1', short: 'Avg hike · C1' },
    { value: '₹19L', label: 'Average CTC', note: 'Cohort 1', short: 'Avg CTC · C1' },
    { value: '₹21L', label: 'Average CTC', note: 'Cohort 2 · ongoing', short: 'Avg CTC · C2' },
    { value: '₹26L', label: 'Top 25% avg. CTC', note: 'Cohorts 1 & 2', short: 'Top 25% CTC' },
    { value: '₹30.7L', label: 'Top 10% avg. CTC', note: 'Cohorts 1 & 2', short: 'Top 10% CTC' },
    { value: '500+', label: 'Hiring companies', note: 'Cohorts 1 & 2', short: 'Companies hiring' },
  ],
  // PLACEHOLDER press card: The Times of India's wordmark (Wikimedia Commons, "The times of india.svg"),
  // the user's pick (2026-10-28), over words that stand in until the real coverage is chosen
  press: {
    logo: { src: '/press/toi.svg', alt: 'The Times of India', width: 323, height: 23 },
    date: '12 Oct 2026',
    title: 'SSB’s founding cohort triples its pay',
    byline: 'By Staff Reporter · 4 min read',
    sub: 'A 3.2x average hike for the founding cohort, and 500+ companies hiring across two cohorts.',
    cta: 'Download the audited report',
  },
  photo: { caption: 'The founding cohort, Bengaluru' },
  recruitersTitle: 'Our recruiters: MNCs, AI companies & top startups',
};
