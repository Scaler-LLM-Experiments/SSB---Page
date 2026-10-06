/**
 * SST AI & B curriculum content, from sst-ai-b-curriculum-spec.md §3.
 * [SST] strings are copied from the live page (captured 2026-09-25) with only
 * the §7.1 copy fixes applied. [PROPOSED] fields are marked. Components hold
 * no copy: everything they print comes from here (spec §2.6).
 */

export type Lane = 'tech' | 'business' | 'shared';

export interface Project {
  title: string;
  desc?: string;
  flagship?: boolean;
  /** Placeholder photo key (see photos.ts) until Design supplies art. */
  image?: string;
  /** The video this challenge links to, shown as its label on a play tile. */
  video?: string;
}

/** One year (SST) or term (SSB): `year` is its number, the word comes from `labels.yearLabel`. */
export interface Year {
  year: number;
  name: string;
  description: string;
  /** [PROPOSED] what the student builds that year. */
  ship: string;
  /** Placeholder photo key for the 16:10 visual slot. [CONFIRM] §10.10 */
  visual?: string;
  outcome: string | null;
  skills: Record<Lane, string[]> | null;
  projects: Project[];
  split?: { phase: string; months: number; desc?: string }[];
  youGet?: { title: string; desc: string }[];
  journey?: { step: number; title: string; desc: string }[];
  /** Masterclasses & workshops that run alongside. */
  workshops?: string[];
  syllabus: string[] | null;
}

/** The AI journey (SSB): one capability and one product per term. */
export type AiIcon = 'wand' | 'wave' | 'cycle' | 'robot' | 'rocket';
export interface AiJourney {
  eyebrow: string;
  title: string;
  /** The part of the title set in the brand colour. */
  titleAccent: string;
  lede: string;
  terms: { term: number; name: string; desc: string; tools: string[]; outcome: string; image: string; /** a portrait version for the desktop stack's tall photo frame (7:9), so nobody is cropped */ imageTall?: string; /** object-position, to crop past marks baked into a photo */ imagePos?: string; icon: AiIcon }[];
}

/** A track that runs alongside every year or term (SSB career prep). */
/** SSB "Learn by doing": the two real-business challenges, each a YouTube video. */
export interface LearnVideo { id: string; title: string; channel: string; seconds: number; /** YouTube view count and upload date, as captured */ views: number; published: string }
export interface LearnChallenge { n: string; label: string; title: string; desc: string; image: string; video: LearnVideo }
export interface LearnByDoing { eyebrow: string; title: string; titleAccent: string; lede: string; items: LearnChallenge[] }
export type CareerIcon = 'hours' | 'interviews' | 'oneToOne' | 'domain' | 'behaviour' | 'clarity' | 'building' | 'executing';
export interface CareerPrep {
  title: string;
  /** `feature`: the one stat shown large (it is a count, the rest are hours). */
  stats: { value: string; label: string; icon?: CareerIcon; feature?: boolean }[];
  /** desc: one sentence under the phase name (else the items are joined into one) */
  phases: { name: string; items: string[]; desc?: string; icon?: CareerIcon }[];
  /** Where the track starts ("Month 1"). */
  start?: string;
}

export interface Fork {
  intro: string;
  paths: { id: 'founder' | 'placement'; title: string; desc: string; points: string[]; roles?: string[]; /** Placeholder photo key (§10.10). */ image?: string }[];
  safetyNet: string;
}

export interface Journey {
  eyebrow: string;
  title: string;
  lede: string;
  facts: string[];
  disclaimer: string;
  projectsTotal: string;
  years: Year[];
  /** What comes after the last year (SST founder / placements). Optional. */
  fork?: Fork;
  careerPrep?: CareerPrep;
  ai?: AiJourney;
  learn?: LearnByDoing;
  /** UI labels. Copy lives here, never in components (§2.6). */
  labels: Labels;
}

/** Interface copy. `{n}` is replaced with a derived count. */
export interface Labels {
  byYear: string;
  byDiscipline: string;
  viewToggle: string;
  years: string;
  chooseYear: string;
  outcome: string;
  learn: string;
  build: string;
  youGet: string;
  journey: string;
  flagship: string;
  showAll: string;
  showFewer: string;
  seeCapital: string;
  startupFallback: string;
  founderInstead: string;
  rowBuild: string;
  rowIndustry: string;
  industryY4: string;
  highlights: string;
  portfolioTitle: string;
  skills: string;
  projects: string;
  journeySteps: string;
  close: string;
  yearLabel: string;
  takeApart: string;
  putBack: string;
  fullYear: string;
  lessOfYear: string;
  prevYear: string;
  nextYear: string;
  pickYear: string;
  cardBack: string;
  flipCard: string;
  shared: string;
  filterProjects: string;
  filterAll: string;
  pauseProjects: string;
  playProjects: string;
  seePaths: string;
  joinPaths: string;
  pathsOr: string;
  /** Lane names (default Tech / Business / Shared). */
  laneTech?: string;
  laneBusiness?: string;
  laneShared?: string;
  workshops?: string;
  watch?: string;
  prevProjects?: string;
  nextProjects?: string;
  /** Counts on the m-web "In class" row. */
  workshopsCount?: string;
  perksCount?: string;
  /** The one card that passes through the fork before it splits: short, it is read in motion. */
  choosePath?: string;
}

export const JOURNEY: Journey = {
  eyebrow: 'Blueprint of Next-Gen Builders',
  title: 'Interdisciplinary Curriculum',
  lede: 'A rigorous, 4-year residential program broken down into four distinct phases',
  facts: [
    '4 Year UGP in AI & Business',
    'Learn CS fundamentals + business skills from day one.',
    'Learn by Building Startups',
    '50+ projects across 4 years',
    'Only 200 students accepted',
    "Fully residential Urban Campus in India's Silicon Valley",
  ],
  disclaimer:
    'Scaler School of Technology offers a certificate-based program. It is not a university/college and does not confer degrees.',
  projectsTotal: '50+ projects across 4 years',
  labels: {
    byYear: 'By year',
    byDiscipline: 'By discipline',
    viewToggle: 'Curriculum view',
    years: 'The four years',
    chooseYear: 'Choose a year',
    outcome: 'By the end of the year',
    learn: 'What you learn',
    build: 'What you build',
    youGet: 'What SST gives you', // §4.2
    journey: 'The first 6 month journey', // [SST]
    flagship: 'Flagship project',
    showAll: 'Show all {n} projects', // §5.2
    showFewer: 'Show fewer projects',
    seeCapital: 'See the capital', // §5.4 step 3 → capital card
    startupFallback: 'building a real tech startup', // from the Y4 description [SST]
    founderInstead: 'Or the founder path (below)',
    rowBuild: 'Build', // §5.3
    rowIndustry: 'Industry',
    industryY4: '6 months in industry', // §5.3
    highlights: 'Programme highlights',
    portfolioTitle: 'Your portfolio by graduation.', // §5.5
    skills: '{n} skill{s}',
    projects: '{n} project{s}',
    journeySteps: '{n}-step startup journey',
    close: 'Close {x}',
    yearLabel: 'Year {n}',
    takeApart: 'See what it is made of',
    putBack: 'Put it back together',
    fullYear: 'See the full year',
    lessOfYear: 'Hide the full year',
    prevYear: 'Previous year',
    nextYear: 'Next year',
    pickYear: 'Pick a year',
    cardBack: 'Put the card back',
    flipCard: 'Turn over {x}',
    shared: 'Shared',
    filterProjects: 'Filter projects by year',
    filterAll: 'All',
    pauseProjects: 'Pause',
    playProjects: 'Play',
    seePaths: 'See both paths',
    joinPaths: 'Back',
    pathsOr: 'or',
    choosePath: 'Choose your path', // [PROPOSED]
    workshopsCount: '{n} workshops',
    perksCount: '{n} benefits', // [PROPOSED]
  },
  years: [
    {
      year: 1,
      name: 'Think & Build',
      description: 'Start by building strong foundations across both technology and business',
      ship: 'Your first working products',
      visual: 'y1',
      skills: {
        tech: ['Programming Fundamentals', 'Data Structures & Algorithms', 'Web App Development', 'Linear Algebra Foundations', 'Probability & Statistical Reasoning'],
        business: ['Business Fundamentals', 'Startup Ideation & Opportunity Discovery'],
        shared: ['First-Principles Thinking', 'Structured Problem Solving', 'Technical & Business Communication'],
      },
      projects: [
        { title: 'E-commerce Challenge', desc: 'Build and scale a tech-enabled e-commerce business', flagship: true, image: 'y1Flagship' },
        { title: 'Build an interactive game using AI', desc: 'Create a fun game like Tic-Tac-Toe.', image: 'pGame' },
        { title: 'Content Creator challenge', desc: 'Turn content into a scalable, tech-powered business', image: 'pCreator' },
        { title: 'Create your own image editor', desc: 'Design and build a tool like mini Canva.', image: 'pEditor' },
        { title: 'Develop your portfolio website', desc: 'Keep updating with real projects.', image: 'pPortfolio' },
        { title: 'Design a database schema', desc: 'For apps like Instagram, Amazon, or MakeMyTrip.', image: 'pSchema' },
      ],
      outcome: 'You can build simple AI-powered products and clearly explain what they do, how they work, and why they matter.',
      syllabus: null,
    },
    {
      year: 2,
      name: 'Build Products That Scale',
      description: 'Move beyond basics to building more complex AI products with customers, pricing, and go-to-market strategy',
      ship: 'Products with real users and a business model',
      visual: 'y2',
      skills: {
        tech: ['Gen AI Engineering', 'Full-Stack Development (MERN)', 'Advanced Algorithms', 'Classical Machine Learning', 'Database Design & Management', 'Functional Programming Concepts'],
        business: ['Product & Marketing Strategy', 'Economics & Business Strategy'],
        shared: ['Data Analytics & Insights'],
      },
      projects: [
        { title: 'Startup Weekend Challenge', desc: 'Build and ship a working product in 48 hours', flagship: true, image: 'y2Flagship' },
        { title: 'Participate in AI hackathons', desc: 'Build AI products using tools like Replit, n8n, Zapier', image: 'pHackathon' },
        { title: 'IPL performance prediction', desc: 'Use statistical methods to predict player performance', image: 'pIpl' },
        { title: 'Splitwise clone', desc: 'Build an app for expense management.', image: 'pSplit' },
        { title: 'Cargo logistics optimization', desc: 'Solve for companies like FedEx using dynamic programming', image: 'pCargo' },
        { title: 'Build a social media or video streaming app', desc: 'Full-stack web development', image: 'pSocial' },
        { title: 'Create routing system', desc: 'Create a city navigation optimization system for Swiggy/Zomato.', image: 'pRouting' },
      ],
      outcome:
        'You can build advanced tech products with a clear business model, defined users personas, and a realistic path to distribution and revenue.',
      syllabus: null,
    },
    {
      year: 3,
      name: 'Solve Problems That Matter',
      description: 'Design advanced tech systems and learn how they scale in real markets.',
      ship: 'AI systems for real company problems',
      visual: 'y3',
      skills: {
        tech: ['Advanced ML Systems', 'Low-Level Design', 'Operating Systems & Concurrency', 'Neural Networks & Computer Vision', 'Natural Language Processing', 'ML Systems & LLMOps'],
        business: ['Business Modelling', 'Venture Capital & Fundraising', 'Deep Tech Commercialization', 'Product & Growth Analytics'],
        shared: [],
      },
      projects: [
        { title: 'Emergent-Style AI App Builder', desc: 'That lets users vibecode apps', image: 'pBuilder' },
        { title: 'GTM Strategy Challenge', desc: 'Launch a real tech product and take it to market', image: 'pGtm' },
        { title: 'Build Perplexity-Style Answer Engine', desc: 'Deliver direct answers, not links', image: 'pAnswer' },
        { title: 'Real world Industry Projects', desc: 'Solve real business problems of companies using AI', flagship: true, image: 'y3Flagship' },
        { title: 'Personal AI Assistant', desc: 'Create an AI tool that reads & summarizes information', image: 'pAssistant' },
        { title: 'AI Customer Support System', desc: 'Resolve queries across chat and voice', image: 'pSupport' },
        { title: 'Multi-Agent Workflow Automation', desc: 'Automate complex workflows', image: 'pAgents' },
        { title: 'Fake News Detection', desc: 'Develop an AI model to identify and filter fake news', image: 'pNews' },
        { title: 'Duolingo-like Language Teacher', desc: 'AI-powered language learning platform', image: 'pLanguage' },
        { title: 'Recommendation Engine', desc: 'Build a recommendation system for mobile apps like YouTube', image: 'pRecs' },
        { title: 'Text Summarisation', desc: 'Build an NLP-powered tool for summarising large texts', image: 'pSummary' },
      ],
      outcome:
        'Understand how technology creates real business value by solving real-world business problems for industry-sourced projects or startups',
      syllabus: null,
    },
    {
      year: 4,
      name: 'Launch & Lead',
      description: '6 months building a real tech startup. 6 months in industry- internships, projects, real companies.',
      ship: 'Your own company',
      visual: 'y4',
      skills: null,
      projects: [],
      split: [
        { phase: 'Startup', months: 6 },
        { phase: 'Industry', months: 6, desc: 'internships, projects, real companies' },
      ],
      youGet: [
        { title: 'Pre-seed capital from ₹2Cr+ fund', // §7.6: "₹2Cr+" everywhere
           desc: 'Built-in funding runway for your first startup' },
        { title: 'Mentorship', desc: 'Mentorship from 55+ founders (Meta, Google, OpenAI)' },
        { title: 'Access to Industry', desc: 'Internships, industry projects and placement support to 1200+ companies' },
        { title: 'Teamwork', desc: 'Team up with 3–5 students to bring your idea to life' },
        { title: 'Access Innovation Lab', desc: 'Get access to Innovation Lab & Workspace' },
      ],
      journey: [
        { step: 1, title: 'Idea', desc: 'Spot a real-world problem and validate it with users' },
        { step: 2, title: 'MVP', desc: 'Build a working prototype using tech & AI that solves the problem' },
        { step: 3, title: 'Funding', desc: 'Receive pre-seed capital from SST and mentorship from 55+ founders and CXOs' },
        { step: 4, title: 'Launch', desc: 'Go live, acquire users, and test real market traction' },
        { step: 5, title: 'Revenue', desc: 'Turn users into paying customers and build a real business' },
      ],
      outcome: null,
      syllabus: null,
    },
  ],
  fork: {
    intro: 'After 6 months of mandatory startup building, you choose',
    paths: [
      {
        id: 'founder',
        title: 'Continue as founder',
        desc: 'Scale your startup with VC access and mentors',
        image: 'fFounder',
        points: ['Demo days with Peak XV, Tiger Global', 'Access to YC, EF, Campus Fund', 'Innovation Lab support'],
      },
      {
        id: 'placement',
        title: 'Switch to placements',
        desc: 'Step into high-impact AI and business roles with 1200+ placement partners',
        image: 'fPlacement',
        roles: ['Forward Deployed Engineer', 'Product Engineer', 'AI Product Manager', 'Growth Engineer', 'AI Consultant', 'Tech Founder'],
        points: ['Upto 6-month Internships'],
      },
    ],
    safetyNet:
      'Changed your mind after going all-in as a founder? Get one full year of deferred placement support. So you can take bold bets, knowing your career path remains open.',
  },
};

/** Alternate Year 1 project seen on one variant of the live page. [CONFIRM] §10.5 */
export const Y1_ALT_PROJECT: Project = { title: 'Design a fitness tracking app', desc: 'Track user activities and goals.', image: 'pFitness' };

/** Derived counts (spec §3.4 / §8: authors never type counts). */
export const countSkills = (y: Year) => (y.skills ? y.skills.tech.length + y.skills.business.length + y.skills.shared.length : 0);
export const listedProjects = (j: Journey) => j.years.reduce((n, y) => n + y.projects.length, 0);

/** Fill a label's `{n}` / `{x}` slot. */
/** Fills {n}/{x} with the value; {s} becomes "s" unless the value is 1 ("1 project", "2 projects"). */
export const fmt = (label: string, v: string | number) => label.replace(/\{[nx]\}/g, String(v)).replace(/\{s\}/g, String(v) === '1' ? '' : 's');
