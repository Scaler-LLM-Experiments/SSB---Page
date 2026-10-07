/**
 * SSB (Scaler School of Business) curriculum content: five terms.
 *
 * Sources, captured 2026-09-28:
 *   [DOC]   the curriculum doc + overview slide shared by the team (Term 1 in
 *           full; the one-line summaries of all five terms; career prep).
 *   [SSB]   the live page, scaler.com/school-of-business, "Future-proof
 *           curriculum" tabs (Terms 2–5: in-class, workshops, out-class videos).
 *   [PROPOSED] / [CONFIRM] as in data.ts.
 *
 * Subjects sit in the same two lanes as SST so every concept works unchanged:
 * `business` = management, strategy, finance, marketing, operations;
 * `tech` = data, tech, product and AI. The lane names come from `labels`.
 * An out-class challenge is a project; `video` is the reference it links to.
 */
import type { Journey, Labels } from './data';
import { JOURNEY } from './data';
import type { Brand } from './config';

const labels: Labels = {
  ...JOURNEY.labels,
  byYear: 'By term',
  years: 'The five terms',
  chooseYear: 'Choose a term',
  outcome: 'By the end of the term',
  learn: 'In class',
  build: 'Out of class',
  flagship: 'Flagship challenge',
  highlights: 'Programme highlights',
  portfolioTitle: 'Everything you build across five terms.', // [PROPOSED]
  skills: '{n} course{s}',
  projects: '{n} live project{s}',
  yearLabel: 'Term {n}',
  fullYear: 'See the full term',
  lessOfYear: 'Hide the full term',
  prevYear: 'Previous term',
  nextYear: 'Next term',
  pickYear: 'Pick a term',
  filterProjects: 'Filter challenges by term',
  laneTech: 'Data, Tech & AI',
  laneBusiness: 'Business',
  laneShared: 'Across both',
  workshops: 'Masterclasses & workshops',
  watch: 'Watch',
};

export const SSB_JOURNEY: Journey = {
  eyebrow: 'Future-proof curriculum', // [SSB]
  title: 'Curriculum: Learn by Building, Not Theory', // [DOC]
  lede: 'Build industry-preferred skills through practical learning', // [SSB]
  facts: [
    // [SSB] programme overview
    '150+ hours of AI learning across 25+ tools',
    '10+ AI workshops spanning industries',
    '2 real business builds',
    '10+ company-sourced projects',
    '3–6 month mandatory internship',
  ],
  disclaimer: '',
  projectsTotal: '2 real business builds, 10+ company-sourced projects', // [SSB]
  labels,
  years: [
    {
      year: 1,
      name: 'Foundations & First Build', // [DOC]
      description:
        'Learn core business principles like economics, accounting and marketing, and use them straight away by selling on the street and launching your first D2C brand.', // [DOC]
      ship: 'Your first revenue, pitch and P&L, from the D2C brand you launch', // [PROPOSED] from the outcome
      visual: 'ssbT1',
      outcome: 'First revenue, first pitch, first P&L.', // [DOC]
      skills: {
        // [DOC] Management & Strategy, Finance, Marketing | Data, Tech & Product, AI
        business: ['Managerial Economics', 'Business Communications', 'Financial Reporting & Analysis 1', 'Marketing Strategies'],
        tech: ['Business Statistics', 'AI Foundations & No-Code Business Tools'],
        shared: [],
      },
      workshops: ['MS Excel Fundamentals', 'Structured Thinking', 'Build Your Own AI Chatbot'], // [DOC]
      projects: [
        // [DOC] out class (videos)
        { title: 'D2C Startup Challenge', desc: 'Launch a live D2C brand with ₹25K funding and a ₹5L+ revenue target in 6 weeks.', flagship: true, image: 'y1Flagship', video: 'Year 1 cohort generated ₹15L+ revenue in 1 month' },
        { title: 'Street-Selling Challenge', desc: 'Sell a product to strangers in a day to learn persuasion and customer empathy.', image: 'pCreator', video: 'Caffeine Clash (C1), Go Zero Ice-cream Challenge (C3)' },
        { title: 'Idea Pitch Tank', desc: 'Pitch a startup idea to a panel in Week 1.', image: 'pGtm', video: 'Scaler Spark Tank' },
      ],
      syllabus: null,
    },
    {
      year: 2,
      name: 'Strategy, Product & AI Fluency', // [DOC]
      description:
        'Master strategy, consumer behaviour and product basics, pitch real expansion plans to founders and ship your first AI product with zero code.', // [DOC]
      ship: 'Your first AI product with zero code, and a pitch to real founders', // [PROPOSED] from the summary
      visual: 'ssbT2',
      outcome: null, // [CONFIRM] not on the live page
      skills: {
        // [SSB] term 2
        business: ['Global Macroeconomics', 'Intro to Business Strategy', 'Financial Reporting & Analysis 2', 'Consumer Behaviour'],
        tech: ['Introduction to Product Management', 'Building Voice, Visual & Workflow AI Experiences'],
        shared: [],
      },
      workshops: ['The Art of Business Decks', 'Design Thinking'], // [SSB]
      projects: [
        // [SSB] term 2 videos
        { title: 'Founder Expansion Pitch', desc: 'Pitch a ₹200cr expansion plan to the founders of Mokobara.', flagship: true, image: 'y2Flagship', video: 'MBA Students Pitch ₹200cr Expansion Plan to Mokobara Founders' },
        { title: 'No-Code AI Build', desc: 'Build an AI product with zero coding knowledge.', image: 'pAgents', video: 'n8n AI Workshop' },
      ],
      syllabus: null,
    },
    {
      year: 3,
      name: 'Build & Get Career Ready', // [DOC]
      description: "Learn to sell, raise capital and research markets while building your startup's MVP and a placement-ready resume.", // [DOC]
      ship: 'A working MVP for your startup and a placement-ready resume', // [DOC]
      visual: 'ssbT3',
      outcome: null, // [CONFIRM]
      skills: {
        // [SSB] term 3
        business: ['The Science of Selling', 'Corporate Finance 1', 'Corporate Finance 2', 'Market Research'],
        tech: ['Product Strategy & Execution', 'Optimization & Decision Making', 'Automation & Product Integrations for Ops and Growth'],
        shared: [],
      },
      workshops: ['Resumes 101', 'Hiring Assignments 101'], // [SSB]
      projects: [
        // [SSB] term 3 videos
        { title: 'Company-Sourced GTM Project', desc: 'Build a ₹50cr go-to-market plan for a prebiotic soda brand and present it to its founder.', flagship: true, image: 'y3Flagship', video: 'MBA students’ bold ₹50cr GTM plan shocks prebiotic soda founder' },
        { title: 'Hustle Ideation', desc: 'Work on the next billion-dollar idea and pitch it to VCs.', image: 'pBuilder', video: 'Hustle Ideation with Siddhant: students pitch to VCs' },
      ],
      syllabus: null,
    },
    {
      year: 4,
      name: 'Advanced Domain Specialisation', // [DOC]
      description:
        'Choose your electives across Strategy, Finance, Marketing, Product and Operations, take your startup to market and build business AI agents.', // [DOC]
      ship: 'Your startup live in the market, and business AI agents you built', // [PROPOSED] from the summary
      visual: 'ssbT4',
      outcome: null, // [CONFIRM]
      skills: {
        // [SSB] term 4 (electives)
        business: ['Corporate Strategy for Startups', 'Valuation', 'Branding', 'Digital Marketing', 'Supply Chain Management'],
        tech: ['Product Metrics & Analytics', 'Intro to SQL', 'Open-Source AI & Model Customization', 'Designing & Deploying Business AI Agents'],
        shared: [],
      },
      workshops: ['Personal Interview', 'Case Solving & Guesstimates, Part 1'], // [SSB]
      projects: [
        // [SSB] term 4 shows the D2C challenge video again; its second video has no title of its own [CONFIRM]
        { title: 'Take Your Startup to Market', desc: 'Launch and grow the startup you built in Term 3.', flagship: true, image: 'fFounder', video: 'D2C Startup Challenge: can these B-school students build a ₹50 lakh dropshipping business?' },
      ],
      syllabus: null,
    },
    {
      year: 5,
      name: 'Pitch to VCs. Get Placed', // [DOC]
      description: 'Learn deal-making and investing, pitch your startup to VCs on Demo Day and walk into placements with founder-level proof of work.', // [DOC]
      ship: 'A Demo Day pitch to VCs, and founder-level proof of work', // [DOC]
      visual: 'ssbT5',
      outcome: null, // [CONFIRM]
      skills: {
        // [SSB] term 5. The live page repeats Term 4's two AI courses here [CONFIRM]
        business: ['Negotiations', 'Intro to PE & VC', 'Investment Analysis & Portfolio Management', 'Pricing', 'Retail Management', 'Business of Online Marketplaces'],
        tech: ['Python for Data Analysis', 'Open-Source AI & Model Customization', 'Designing & Deploying Business AI Agents'],
        shared: [],
      },
      workshops: ['Personal Interview', 'Case Solving & Guesstimates, Part 2'], // [SSB]
      projects: [
        { title: 'Demo Day', desc: 'Pitch your startup to VCs.', flagship: true, image: 'pHackathon' }, // [DOC] summary
        { title: 'D2C Start-Up Challenge', desc: 'Build a D2C brand with a student of Scaler School of Business.', image: 'pSocial', video: 'D2C Start-Up Challenge with a student of Scaler School of Business' }, // [SSB] [CONFIRM]
      ],
      syllabus: null,
    },
  ],
  // [SSB concept] ssb-school-concept.vercel.app, "The AI journey"; images are that site's assets
  // [SSB] "Learn by doing", from the SSB concept site; videos from the school's YouTube channel
  // (views and upload dates captured from YouTube, 2026-09-30)
  learn: {
    eyebrow: 'Learn by doing',
    title: 'Build 2 Real Businesses. Pitch to VCs.',
    titleAccent: 'Graduate with Founder experience.',
    lede: 'Real markets and real feedback turn business concepts into hard-earned experience.',
    items: [
      {
        n: '01',
        label: 'D2C Startup Challenge',
        title: 'Take a brand from zero to its first customers.',
        desc: 'Sourcing, branding, packaging, pricing and selling in a six-week challenge. Teams receive ₹25,000 in startup funding and target ₹5L+ revenue.',
        image: '/learn/d2c.jpg', // the video's own YouTube thumbnail (assets/learn)
        video: { id: 's0KKS3FxNUU', title: 'D2C Startup Challenge - Scaler School of Business', channel: 'Scaler School of Business', seconds: 61, views: 761, published: '2025-11-20' },
      },
      {
        n: '02',
        label: 'The Hustle Program',
        title: 'Take an MVP to a founder-ready pitch.',
        desc: 'Build, earn revenue and pitch a startup with ₹50,000 in initial funding and a pathway to funding up to ₹25L, backed by Lightrock, Peak XV and Sidhant Goyal.',
        image: '/learn/hustle.jpg', // the video's own YouTube thumbnail
        video: { id: '6V9RgMnFFaU', title: 'Next $Billion Dollar Idea? Business School Students Pitch to VCs', channel: 'Scaler School of Business', seconds: 951, views: 1582, published: '2025-04-19' },
      },
    ],
  },
  ai: {
    eyebrow: 'The AI journey',
    title: '150-Hour AI Curriculum:',
    titleAccent: 'From No-Code to AI Agents',
    lede: '25+ AI tools · 5 AI products · 3 hackathons · No coding background required', // the team's curriculum doc (2026-10-07); before, the main landing page's line
    terms: [
      // Titles, descriptions and outcomes from the team's curriculum doc (2026-10-07), verbatim. An outcome
      // has no "Product #n: " prefix now, so the card shows it whole.
      // AI journey images (2026-10-07, the team's call): the Scaler Innovation Lab, from the live pages
      // (scaler.com/school-of-business: the lab space, 1; scaler.com/school-of-technology, ~2000px: the
      // Ninad AI voice demo, 2; Maximem's founder in Lab 03, 3; a robotic hand, 4; the NeoSapiens founders, 5),
      // in public/ai-terms/real. The SST photos carry a name bar at their foot: imagePos keeps the 3:1 strip
      // above it. Tried the same day and dropped: generated photos, the live page's green AI slides, campus
      // photos, and startups' product screenshots.
      { term: 1, name: 'Work Smarter with AI', desc: 'Use AI to research, write, analyse and present faster, then build your first app just by describing it.', tools: ['ChatGPT', 'Claude', 'Gemini', 'Perplexity', 'NotebookLM', 'Lovable'], outcome: 'AI Product #1 from the Vibe Coding Hackathon, e.g. a Splitwise-style expense splitter', image: '/ai-terms/real/term1-lab.webp', imagePos: '50% 60%', imageTall: '/ai-terms/term1-tall.jpg?v=3', icon: 'wand' },
      { term: 2, name: 'Create with AI', desc: 'Go beyond text and build AI that can speak, see, listen and generate images and video. Use it for anything from a customer-support voice bot and training videos to product demos and visual reports.', tools: ['ElevenLabs', 'Vapi', 'Midjourney', 'HeyGen', 'Gemini', 'ChatGPT'], outcome: 'AI Product #2 from the AI Agent Hackathon, e.g. a language-learning voice assistant', image: '/ai-terms/real/term2-lab-voice.webp', imagePos: '50% 30%', imageTall: '/ai-terms/term2-tall.jpg?v=3', icon: 'wave' },
      { term: 3, name: 'Automate with AI', desc: 'Connect everyday tools so that repetitive work in sales, marketing and operations runs on its own.', tools: ['Zapier', 'n8n', 'Make', 'Airtable', 'Notion'], outcome: 'AI Product #3, an automation that runs a real business process, e.g. a case-interview practice tool', image: '/ai-terms/real/term3-lab-maximem.webp', imagePos: '50% 15%', imageTall: '/ai-terms/term3-tall.jpg?v=3', icon: 'cycle' },
      { term: 4, name: 'Build AI Agents', desc: 'Build AI agents that research, decide and complete tasks on their own, like a digital teammate.', tools: ['Relevance AI', 'CrewAI', 'Hugging Face', 'Ollama'], outcome: 'AI Product #4 from the 48-Hour AI Hackathon, e.g. a negotiation-training AI coach', image: '/ai-terms/real/term4-lab-robotics.webp', imagePos: '50% 35%', imageTall: '/ai-terms/term4-tall.jpg?v=3', icon: 'robot' },
      { term: 5, name: 'Scale AI products', desc: 'Learn where AI creates real value in a business, how to price it and build its ROI case, and take your product to market.', tools: ['Julius AI', 'Microsoft Copilot', 'Cursor'], outcome: 'AI Product #5, a capstone launched to real users with a go-to-market plan, e.g. a party icebreaker AI game', image: '/ai-terms/real/term5-lab-neosapiens.webp', imagePos: '50% 15%', imageTall: '/ai-terms/term5-tall.jpg?v=3', icon: 'rocket' },
    ],
  },
  careerPrep: {
    // [DOC]
    title: 'Career prep that starts in Month 1',
    // ours (2026-10-07), from the phases below, for the team to confirm: every curriculum section has a subtext
    lede: 'From 1:1 counselling in Month 1 to mock interviews and salary negotiation, in three phases: clarity, building and executing.',
    start: 'Month 1',
    stats: [
      { value: '1,100+', label: 'Mock Interviews', icon: 'interviews', feature: true },
      { value: '150+', label: 'Hours of Career Prep', icon: 'hours' },
      { value: '300+', label: 'Hours of 1:1 Problem-Solving', icon: 'oneToOne' },
      { value: '200+', label: 'Hours of Domain Prep', icon: 'domain' },
      { value: '400+', label: 'Hours of Behavioural Sessions', icon: 'behaviour' },
    ],
    // [COPY] the descs are the items rewritten as one sentence: confirm the wording
    phases: [
      { name: 'Clarity', items: ['1:1 counselling', 'resume reviews', 'mentor allocation'], desc: '1:1 counselling and resume reviews, with a mentor assigned to you.', icon: 'clarity' },
      { name: 'Building', items: ['role-specific practicums', 'portfolio building', 'communication workshops'], desc: 'Role-specific practicums, portfolio building and communication workshops.', icon: 'building' },
      { name: 'Executing', items: ['employer outreach', 'mock interviews', 'salary negotiation'], desc: 'Employer outreach, mock interviews and salary negotiation.', icon: 'executing' },
    ],
  },
};

/** The content a brand shows: SST AI & B (4 years) or SSB (5 terms). */
export const journeyFor = (brand: Brand): Journey => (brand === 'ssb' ? SSB_JOURNEY : JOURNEY);
