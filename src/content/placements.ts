import type { PlacementsContent } from '@/sections/placements/types';

// Section 2 content, from "SSB Website vF _ Sep'26", slide 3. The description is ours
// (2026-10-01), for the team to replace. Recruiter names are the deck's, shortened
// to the brand people know ("Edelweiss Financial Services" → "Edelweiss").

export const placements: PlacementsContent = {
  eyebrow: 'Outcomes',
  title: 'Placement Highlights.',
  description: 'Reported outcomes for SSB’s founding PGP cohort.',
  // Ours (2026-10-01), from the deck's figures (87% switched, a 3.2× average hike), for the team to replace.
  lead: 'Reported outcomes for SSB’s founding PGP cohort. They joined Indian startups, global MNCs and digital-first companies, most of them in a new industry or role, earning on average 3.2 times what they did before SSB.',
  // Labels are the deck's. Descriptions are ours (2026-10-01), restating the deck's figures; for the
  // team to replace.
  stats: [
    { value: '₹19L', label: 'Average CTC', description: 'Top quartile: ₹25.7L.', icon: 'currency' },
    {
      value: '3.2×',
      label: 'Average hike vs. pre-SSB',
      description: 'On what students earned before SSB.',
      icon: 'trend',
    },
    {
      value: '87%',
      label: 'Switched industries or roles',
      description: 'A new industry, a new role, or both.',
      icon: 'switch',
    },
    {
      value: '55%+',
      label: 'In digital & AI-first roles',
      description: 'More than half the founding cohort.',
      icon: 'sparkle',
    },
  ],
  // The first card's copy is the team's sketch (2026-10-01); the rest is ours. PLACEHOLDER claims,
  // to check before this goes anywhere near production: the deck lists 62 recruiters, about 43 of
  // them startups, so "50+" needs a source (or "40+"); the cities are the team's.
  stories: [
    {
      kicker: 'Startups',
      title: 'Top 50+ startups are hiring from SSB.',
      description: 'Startups from Bengaluru, Hyderabad and beyond are picking candidates from SSB.',
      logos: [
        'Swiggy',
        'Razorpay',
        'Zomato',
        'Zepto',
        'Blinkit',
        'PhonePe',
        'Groww',
        'Urban Company',
        'Lenskart',
        'BharatPe',
        'Pine Labs',
        'BigBasket',
        'Myntra',
        'Flipkart',
        'OYO',
        'Vedantu',
      ],
    },
    {
      kicker: 'Global firms',
      title: 'MNCs recruit from SSB, too.',
      description: 'Amazon, Goldman Sachs, EY, Nomura and Samsung hired from the founding cohort.',
      logos: ['Amazon', 'Goldman Sachs', 'EY', 'Nomura', 'Samsung', 'Uber', 'ArcelorMittal', 'Zendesk'],
    },
    {
      kicker: 'Career switch',
      title: '87% switched industries or roles.',
      description: 'Engineers, analysts and founders moved into growth, strategy and partnerships roles.',
      roles: true,
    },
    {
      kicker: 'Placement report',
      title: 'Every number, audited.',
      description: 'The founding PGP cohort’s placements, company by company, in one audited report.',
      // A still from the campus film, until the team's asset arrives.
      imageUrl: '/media/campus-students.webp',
      imageAlt: 'Students walking on the SSB campus in Bengaluru',
      ctaLabel: 'Download the report',
      ctaIcon: 'download',
      // PLACEHOLDER: the report's link.
      ctaHref: '#',
    },
  ],
  reportLabel: 'Download placement report',
  // PLACEHOLDER: the report's link.
  reportHref: '#',
  // The cards' copy is ours (2026-10-01), from the team's sketch ("Top 50+ startups are hiring from
  // us", "startups from Bengaluru, Hyderabad are picking candidates from us"); photos are stills from
  // the campus film until the team's arrive. PLACEHOLDER figures, to check before this goes anywhere
  // near production: the deck lists 62 recruiters, about 43 of them startups, so "50+" needs a source
  // (or "40+"); "10+" MNCs is our count of the deck's list. 55%+ is the deck's.
  // After the App Store's Today cards: a city, fading into the card's grey. Photos are CC0, from
  // Wikimedia Commons (public/media/CREDITS.md); the entrance is a still from the campus film.
  showcases: [
    {
      label: 'Indian startups',
      icon: 'rocket',
      // The title reads on from the figure: "50+ startups from Bengaluru…".
      statValue: '50+',
      title: 'startups from Bengaluru, Hyderabad and beyond are picking SSB candidates.',
      logos: ['Swiggy', 'Zomato', 'Zepto', 'Blinkit', 'Razorpay', 'PhonePe', 'Urban Company', 'Lenskart'],
      imageUrl: '/media/bengaluru-vidhana-soudha-1280.webp',
      imageSrcSet:
        '/media/bengaluru-vidhana-soudha-1280.webp 1280w, /media/bengaluru-vidhana-soudha-2560.webp 2560w',
      imageAlt: 'Vidhana Soudha, Bengaluru',
      imagePosition: 'center 75%',
    },
    {
      label: 'Global MNCs',
      icon: 'globe',
      statValue: '10+',
      title: 'global MNCs hire from SSB’s founding cohort, too.',
      logos: ['Amazon', 'Goldman Sachs', 'EY', 'Nomura', 'Samsung', 'Uber', 'Zendesk', 'ArcelorMittal'],
      imageUrl: '/media/san-francisco-golden-gate-1280.webp',
      imageSrcSet:
        '/media/san-francisco-golden-gate-1280.webp 1280w, /media/san-francisco-golden-gate-2560.webp 2560w',
      imageAlt: 'The Golden Gate Bridge, San Francisco',
      imagePosition: 'center 40%',
    },
    {
      label: 'AI-first roles',
      icon: 'sparkle',
      statValue: '55%+',
      title: 'of the founding cohort went into digital and AI-first roles.',
      roles: true,
      imageUrl: '/media/campus-entrance-1280.webp',
      imageSrcSet: '/media/campus-entrance-1280.webp 1280w, /media/campus-entrance-1920.webp 1920w',
      imageAlt: 'The entrance of Scaler School of Business',
      imagePosition: 'center 30%',
    },
  ],
  // From the deck's "Strong Alumni Base" (page 5): where six alumni moved, plus two from "Beyond
  // Placements". Real, but only Emergent is an AI company: for "AI titles", the team has to supply them.
  roles: [
    { role: 'Growth Marketing', company: 'Emergent' },
    { role: 'Sr. Strategy Manager', company: 'Urban Company' },
    { role: 'Asst. Program Manager', company: 'Blinkit' },
    { role: 'Partnerships', company: 'Razorpay' },
    { role: 'Investment Advisor', company: 'Avendus' },
    { role: 'Growth Manager', company: 'Ninjacart' },
    { role: 'Brand Marketing', company: 'The Whole Truth' },
    { role: 'Growth Marketing', company: 'BharatPe' },
  ],
  // The team's line (2026-10-06). PLACEHOLDER figure: the deck lists 62 recruiters; "200+" needs a
  // source before this goes anywhere near production.
  // Feedback, 2026-10-06: the highlights split by cohort. TO CONFIRM: Cohort 2's final figure
  // (the note said ₹23-24 LPA).
  cohorts: [
    { cohort: 'Cohort 1', value: '₹19 LPA', label: 'Average CTC' },
    { cohort: 'Cohort 2', value: '₹23–24 LPA', label: 'Average CTC' },
  ],
  // One merged list, framed as visits (feedback, 2026-10-06).
  recruitersTitle: 'Companies that have visited Scaler School of Business',
  // The grid's logos, best known first (the first twelve are what the grid opens on). Files trimmed
  // to their edges, from Wikidata (P154) and English Wikipedia's article images; `ink` measured
  // as CLAUDE.md, "Logos" says.
  // PLACEHOLDER `placed` counts, to show the flip: not real numbers. Replace with the placement
  // team's per-company counts before this goes anywhere near production.
  logos: [
    { name: 'Amazon', logoUrl: '/logos/amazon.svg', ink: 0.36, placed: 4 },
    { name: 'Goldman Sachs', logoUrl: '/logos/goldman-sachs.svg', ink: 0.32, placed: 2 },
    { name: 'EY', logoUrl: '/logos/ey.svg', ink: 0.28, placed: 3 },
    { name: 'Nomura', logoUrl: '/logos/nomura.svg', ink: 0.47, placed: 2 },
    { name: 'Samsung', logoUrl: '/logos/samsung.svg', ink: 0.51, placed: 3 },
    { name: 'Uber', logoUrl: '/logos/uber.svg', ink: 0.37, placed: 2 },
    { name: 'Razorpay', logoUrl: '/logos/razorpay.svg', ink: 0.27, placed: 5 },
    { name: 'Swiggy', logoUrl: '/logos/swiggy.svg', ink: 0.36, placed: 4 },
    { name: 'Zomato', logoUrl: '/logos/zomato.svg', ink: 0.49, placed: 3 },
    { name: 'Flipkart', logoUrl: '/logos/flipkart.svg', ink: 0.28, placed: 4 },
    { name: 'Blinkit', logoUrl: '/logos/blinkit.svg', ink: 0.57, placed: 3 },
    { name: 'PhonePe', logoUrl: '/logos/phonepe.svg', ink: 0.33, placed: 2 },
    { name: 'Myntra', logoUrl: '/logos/myntra.svg', ink: 0.32, placed: 2 },
    { name: 'Urban Company', logoUrl: '/logos/urban-company.svg', ink: 0.34, placed: 3 },
    { name: 'Groww', logoUrl: '/logos/groww.png', ink: 0.28, placed: 2 },
    { name: 'BharatPe', logoUrl: '/logos/bharatpe.png', ink: 0.39, placed: 3 },
    { name: 'Lenskart', logoUrl: '/logos/lenskart.svg', ink: 0.36, placed: 2 },
    { name: 'Zepto', logoUrl: '/logos/zepto.svg', ink: 0.31, placed: 3 },
    { name: 'ArcelorMittal', logoUrl: '/logos/arcelormittal.svg', ink: 0.16, placed: 1 },
    { name: 'Pine Labs', logoUrl: '/logos/pine-labs.svg', ink: 0.32, placed: 2 },
    { name: 'BigBasket', logoUrl: '/logos/bigbasket.svg', ink: 0.26, placed: 2 },
    { name: 'OYO', logoUrl: '/logos/oyo.png', ink: 0.66, placed: 1 },
    { name: 'Zendesk', logoUrl: '/logos/zendesk.svg', ink: 0.27, placed: 1 },
    { name: 'Vedantu', logoUrl: '/logos/vedantu.png', ink: 0.25, placed: 2 },
    // Added 2026-10-05 for the recruiters' box (no hires counts: the grid variation isn't shown).
    // From English Wikipedia's article images, trimmed and measured as above.
    { name: 'Aviva', logoUrl: '/logos/aviva.svg', ink: 0.31 },
    { name: 'CK Birla Group', logoUrl: '/logos/ck-birla-group.svg', ink: 0.27 },
    { name: 'FNP', logoUrl: '/logos/fnp.svg', ink: 0.2 },
    { name: 'ONDC', logoUrl: '/logos/ondc.svg', ink: 0.27 },
    { name: 'HealthifyMe', logoUrl: '/logos/healthify.png', ink: 0.23 },
    { name: 'Landmark Group', logoUrl: '/logos/landmark-group.png', ink: 0.15 },
    { name: 'The Times Group', logoUrl: '/logos/the-times-group.png', ink: 0.36 },
  ],
  recruiters: [
    'Amazon',
    'Goldman Sachs',
    'EY',
    'Nomura',
    'Edelweiss',
    'CK Birla Group',
    'Muthoot FinCorp',
    'Blinkit',
    'Urban Company',
    'Emergent',
    'Samsung',
    'Razorpay',
    'The Whole Truth',
    'BharatPe',
    'Avendus',
    'ArcelorMittal',
    'Peak XV Partners',
    'Think School',
    'TMRW',
    'Swiggy',
    'Zomato',
    'Flipkart',
    'Myntra',
    'Meesho',
    'PhonePe',
    'Uber',
    'Zepto',
    'Rapido',
    'Groww',
    'BigBasket',
    'upGrad',
    'Vedantu',
    'OYO',
    'Lenskart',
    'Wakefit',
    'ClearTax',
    'Pine Labs',
    'Practo',
    'Curefit',
    'CashKaro',
    'Noise',
    'mCaffeine',
    'Pilgrim',
    'Neeman’s',
    'Snitch',
    'FNP',
    'Traya Health',
    'The Times Group',
    'Aviva Life Insurance',
    'Zendesk',
    'Landmark Group',
    'ONDC',
    'Pocket FM',
    'Healthify',
    'Ninjacart',
    'Reckitt',
    'Scapia',
    'Airtribe',
    'Vaani Research',
    'gnani.ai',
    'AEOS',
    'AM/NS India',
  ],
};
