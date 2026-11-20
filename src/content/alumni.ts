// Strong Alumni Base: from the deck (SSB Website vF, Sep '26). Each card reads
// "<role> at <company>" over the role they held before SSB.
//
// Marks are each company's own app/site icon. `fill` marks an icon that comes
// on its own coloured square (it fills the tile); the rest sit inside it.

import type { HeroLogo } from '@/sections/hero/types';

/** `src` absent: the card shows the name's first letter on the tile (no mark found yet). */
export type CompanyMark = { name: string; src?: string; fill?: boolean };

export type Alumnus = {
  name: string;
  /** File in /public/alumni, without the extension (WebP, 948x631, the person on
   * the left, a dark blur on the right). Absent until a photo in this style is supplied. */
  photo?: string;
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
    // (2026-11-16) the team's headshot (Figma, SSB 2026 > Assest), cut out and set on the empty-room plate
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

// The 2025 cohort (2026-11-20, the user's ask: "at least 30 cards", Stephan's review): every SSB 2025
// student with an offer in the placement portal (scaler-school-of-business.web.app, Placement & Offers,
// batch SSB 2025, read that day). One card each: the full-time offer if there is one, else the latest
// internship; four offers still "awaiting details" there (Mahnoor, Rishi, Dilip, Lakshay) are included. Devansh Parashar left out (2026-11-20, the user's call; no portrait).
// Pre SSB: the latest full-time role in their placement profile, "Fresher" with none. Names without
// middle names. Photos: the portal's studio portraits, cut out and set on the empty-room plate
// (public/internship/plate.webp), as the cut-out cards above.
// Marks: the companies' own icons (Play Store, their sites, LinkedIn); AiStudio and First Batch have
// none yet, so their tiles show the first letter.
const marks2025 = {
  blinkit: { name: 'Blinkit', src: '/logos/marks/blinkit.png', fill: true },
  emergent: { name: 'Emergent', src: '/logos/marks/emergent.png', fill: true },
  scaler: { name: 'Scaler', src: '/logos/marks/scaler.png', fill: true },
  scalerAiLabs: { name: 'Scaler AI Labs', src: '/logos/marks/scaler.png', fill: true },
  ethos: { name: 'Ethos', src: '/logos/marks/ethos.png', fill: true },
  aistudio: { name: 'AiStudio' },
  sipwise: { name: 'Sipwise', src: '/logos/marks/sipwise.png', fill: true },
  glance: { name: 'Glance', src: '/logos/marks/glance.png', fill: true },
  scapia: { name: 'Scapia', src: '/logos/marks/scapia.png', fill: true },
  incred: { name: 'InCred', src: '/logos/marks/incred.png' },
  aspora: { name: 'Aspora', src: '/logos/marks/aspora.png' },
  profound: { name: 'Profound', src: '/logos/marks/profound.png', fill: true },
  wakefit: { name: 'Wakefit', src: '/logos/marks/wakefit.png', fill: true },
  snabbit: { name: 'Snabbit', src: '/logos/marks/snabbit.png', fill: true },
  firstclub: { name: 'First Club', src: '/internship/marks/firstclub.png' },
  cekura: { name: 'Cekura', src: '/logos/marks/cekura.png' },
  blyss: { name: 'Blyss', src: '/logos/marks/blyss.png' },
  firstBatch: { name: 'First Batch' },
  dataflow: { name: 'DataFlow', src: '/logos/marks/dataflow.svg' },
  tricolite: { name: 'Tricolite', src: '/logos/marks/tricolite.png' },
  polygnan: { name: 'Polygnan', src: '/logos/marks/polygnan.png' },
} satisfies Record<string, CompanyMark>;

export const cohort2025: Alumnus[] = [
  { name: 'Pranav T R', photo: 'pranav-t-r', before: 'Sr. Growth Associate, Edmingle', role: 'Founder\u2019s Office', company: marks2025.scalerAiLabs },
  { name: 'Ajay Kumar Shetgar', photo: 'ajay-kumar-shetgar', before: 'Analyst, Deloitte', role: 'Associate Program Manager', company: marks2025.blinkit },
  { name: 'Chavda Tirthrajsinh', photo: 'chavda-tirthrajsinh', before: 'Fresher', role: 'Operations Associate', company: marks2025.ethos },
  { name: 'Vinayak Jaligidad', photo: 'vinayak-jaligidad', before: 'Anaplan Developer, AB InBev', role: 'AI Strategist', company: marks2025.aistudio },
  { name: 'Chiranjeevi Bhoyar', photo: 'chiranjeevi-bhoyar', before: 'Internal Audit Associate', role: 'Associate Program Manager', company: marks2025.blinkit },
  { name: 'Devraj Gerela', photo: 'devraj-gerela', before: 'Credit Manager, ICICI Bank', role: 'Founder\u2019s Office', company: marks2025.sipwise },
  { name: 'Akshay Sinha', photo: 'akshay-sinha', before: 'Operations, Hudl', role: 'Product Manager Intern', company: marks2025.glance },
  { name: 'Aditya Geda', photo: 'aditya-geda', before: 'Process Developer, Genpact', role: 'Category Manager Intern', company: marks2025.scapia },
  { name: 'Harsh Makwana', photo: 'harsh-makwana', before: 'Fresher', role: 'Associate Program Manager', company: marks2025.blinkit },
  { name: 'Mahnoor Mistry', photo: 'mahnoor-mistry', before: 'General Manager', role: 'Founder\u2019s Office', company: marks2025.scalerAiLabs },
  { name: 'Akshaya Nakhate', photo: 'akshaya-nakhate', before: 'Analyst, Accenture', role: 'Product Intern', company: marks2025.incred },
  { name: 'Shubham Singh', photo: 'shubham-singh', before: 'Software Engineer', role: 'Vibe Coding Intern', company: marks2025.emergent },
  { name: 'Geetika Mehta', photo: 'geetika-mehta', before: 'Presentation Specialist, McKinsey', role: 'Social Media & Content Intern', company: marks2025.aspora },
  { name: 'Rishi Sharma', photo: 'rishi-sharma', before: 'Financial Officer', role: 'Associate Program Manager', company: marks2025.blinkit },
  { name: 'Harsh Pardikar', photo: 'harsh-pardikar', before: 'Fresher', role: 'Founder\u2019s Office Intern', company: marks2025.profound },
  { name: 'Rohit Prasad', photo: 'rohit-prasad', before: 'Fresher', role: 'GTM & Growth Intern', company: marks2025.wakefit },
  { name: 'Siddharth Karampuri', photo: 'siddharth-karampuri', before: 'SEM Executive', role: 'CEO\u2019s Office Intern', company: marks2025.scaler },
  { name: 'Malika Gupta', photo: 'malika-gupta', before: 'HR & Operations Executive', role: 'Copywriter Intern', company: marks2025.snabbit },
  { name: 'Soham Chotalia', photo: 'soham-chotalia', before: 'Associate Product Manager', role: 'Product Management Intern', company: marks2025.incred },
  { name: 'Pallavi O P', photo: 'pallavi-o-p', before: 'Fresher', role: 'Influencer Marketing Intern', company: marks2025.firstclub },
  { name: 'Pratham Patel', photo: 'pratham-patel', before: 'Fresher', role: 'GTM Intern', company: marks2025.cekura },
  { name: 'Dilip B V', photo: 'dilip-b-v', before: 'Associate, KPMG', role: 'Associate Program Manager Intern', company: marks2025.blinkit },
  { name: 'Simran Vazirani', photo: 'simran-vazirani', before: 'Fresher', role: 'Vibe Coding Intern', company: marks2025.emergent },
  { name: 'Shreya Rakhra', photo: 'shreya-rakhra', before: 'Management, Lal Rakhra Agencies', role: 'CEO\u2019s Office Intern', company: marks2025.scaler },
  { name: 'Ronit Dadra', photo: 'ronit-dadra', before: 'Frontend Developer', role: 'Founder\u2019s Office Intern', company: marks2025.blyss },
  { name: 'Ishika Vikas', photo: 'ishika-vikas', before: 'Performance Marketer', role: 'Founder\u2019s Office Intern', company: marks2025.firstBatch },
  { name: 'Shravan Satish', photo: 'shravan-satish', before: 'Sales Associate, Pickyourtrail', role: 'Growth Marketing Intern', company: marks2025.dataflow },
  { name: 'Nirmay Bhavsar', photo: 'nirmay-bhavsar', before: 'Fresher', role: 'Entrepreneur in Residence', company: marks2025.scaler },
  { name: 'Aayush Prakash', photo: 'aayush-prakash', before: 'Operations Manager', role: 'Strategy & Growth Intern', company: marks2025.tricolite },
  { name: 'Sarang Nambiar', photo: 'sarang-nambiar', before: 'Fresher', role: 'Founder\u2019s Office Intern', company: marks2025.polygnan },
  { name: 'Lakshay Vashist', photo: 'lakshay-vashist', before: 'Business Development Manager', role: 'Founder\u2019s Office Intern', company: marks2025.blyss },
  { name: 'Ashutosh Bhavale', photo: 'ashutosh-bhavale', before: 'Manager, Omkar Motors', role: 'Director\u2019s Office Intern', company: marks2025.scaler },
  { name: 'Vismay Pujari', photo: 'vismay-pujari', before: 'Graduate Engineer Trainee', role: 'Communications Intern', company: marks2025.scaler },
  { name: 'Adwitiya Yadav', photo: 'adwitiya-yadav', before: 'Diamond Dealer & Grader', role: 'Social Media Intern', company: marks2025.scaler },
];

// The internship section's learner cards, moved here (2026-10-07, the team's ask: that carousel keeps
// only the video stories). From the live site's "Success stories and pivots" (scaler.com/school-of-business);
// Uttara Nambiar and Bharath Ramesh were in both and keep their cards above. No portraits in the card's
// style yet: AlumniCard draws the empty-room plate and their initials.
const internMarks = {
  tooljet: { name: 'ToolJet', src: '/internship/marks/tooljet.png', fill: true },
  pync: { name: 'Pync', src: '/internship/marks/pync.png' },
  razorpay: { name: 'Razorpay', src: '/logos/marks/razorpay.png' },
  loestro: { name: 'LoEstro', src: '/internship/marks/loestro.png' },
  limechat: { name: 'LimeChat', src: '/internship/marks/limechat.png' },
  onsurity: { name: 'Onsurity', src: '/internship/marks/onsurity.png', fill: true },
} satisfies Record<string, CompanyMark>;

export const pivotAlumni: Alumnus[] = [
  { name: 'Sanyam Maheshwari', before: 'Analyst, Deloitte', role: 'Product Strategy', company: internMarks.tooljet },
  { name: 'Akarsh Sharma', before: 'Data Analyst, Uber', role: 'Founder’s Office', company: internMarks.pync },
  { name: 'Sarosha Pais', before: 'HR, Aquarelle', role: 'Partnerships', company: internMarks.razorpay },
  { name: 'Ayush Poojary', before: 'Trainee, Mutha & Co.', role: 'Investment Banking', company: internMarks.loestro },
  { name: 'Rohan Kumar', before: 'Finance Associate, KPMG', role: 'Operations', company: internMarks.limechat },
  { name: 'Impana Reddy', before: 'Founder, Papermint', role: 'Product Management', company: internMarks.onsurity },
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
  // More from Placements' logo list (the team, 2026-10-12, "pick it up from this list"), so the
  // phone's 4 × 6 grid has logos to turn to; `ink` as there.
  { name: 'BigBasket', logoUrl: '/logos/bigbasket.svg', wordmark: 'BigBasket', ink: 0.26 },
  { name: 'Zendesk', logoUrl: '/logos/zendesk.svg', wordmark: 'Zendesk', ink: 0.27 },
  { name: 'Aviva', logoUrl: '/logos/aviva.svg', wordmark: 'Aviva', ink: 0.31 },
  { name: 'Swiggy', logoUrl: '/logos/swiggy.svg', wordmark: 'Swiggy', ink: 0.36 },
  { name: 'Flipkart', logoUrl: '/logos/flipkart.svg', wordmark: 'Flipkart', ink: 0.28 },
  { name: 'PhonePe', logoUrl: '/logos/phonepe.svg', wordmark: 'PhonePe', ink: 0.33 },
  { name: 'Samsung', logoUrl: '/logos/samsung.svg', wordmark: 'Samsung', ink: 0.51 },
  { name: 'Goldman Sachs', logoUrl: '/logos/goldman-sachs.svg', wordmark: 'Goldman Sachs', ink: 0.32 },
  { name: 'Zomato', logoUrl: '/logos/zomato.svg', wordmark: 'Zomato', ink: 0.49 },
  { name: 'Razorpay', logoUrl: '/logos/razorpay.svg', wordmark: 'Razorpay', ink: 0.27 },
  { name: 'Nomura', logoUrl: '/logos/nomura.svg', wordmark: 'Nomura', ink: 0.47 },
];
