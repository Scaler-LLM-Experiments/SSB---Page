// The remaining sections of the deck (SSB Website vF, Sep '26), laid out with
// placeholders for their photos and videos: set `photo` / `media` when an asset
// arrives (files in public/). Copy is the deck's; a missing line (the deck's
// "xx") is left out and shows as "Copy to come". Eyebrows are drafts.

import type { ShowcasePerson } from '@/sections/faculty/PeopleShowcase';
import type { Session } from '@/sections/community/SessionCard';

type Story = { title: string; text?: string; media?: string; mediaLabel: string; kicker?: string; href?: string };

/** A company a student started or grew: one Beyond Placements card. */
export type Venture = {
  company: string;
  /** One or more people; one by full name, several by first names ("A, B & C"). */
  founders: string[];
  /** Their photos (square, in /public), in the same order; initials where there is none. */
  avatars?: (string | undefined)[];
  /** Under their names: the SSB cohort for students ("Cohort 1" if unset, the team's call,
   *  2026-10-07), "Founder" / "Co-founders" for the Innovation Lab's. */
  role?: string;
  /** What it is, in about three lines (115 to 125 characters fill them on desktop). */
  description: string;
  /** Its field, on a glass chip at the photo's top left. */
  sector: string;
  /** The figure over the photo's blur: "₹1Cr+" over "ARR". None: no figure, no blur. */
  stat?: { value: string; label: string };
  /** The photo at the card's left (its smaller file for phones); the dark plate until there is one. */
  image?: string;
  imageSmall?: string;
  /** object-position, to keep the subject in the crop. */
  imagePosition?: string;
  imageAlt?: string;
  /** A wide banner (a white logo on a two-colour gradient) in place of a photo: the square takes
   *  its two colours, top and bottom, and the whole banner sits across its middle, faded in. */
  banner?: { src: string; top: string; bottom: string };
  /** Its website: an arrow beside the company's name. */
  href?: string;
};

/**
 * Deck p5: "Beyond Placements", rebuilt on 2026-10-07 (the team's brief): no eyebrow, title or
 * line; a turn that carries on from the breaker before it (founders backing the students), as
 * Why SSB's turn hands over to its chapters; then one card per company. No photos for now (the
 * team's call, 2026-10-07: every card on the dark plate; the Why stories' photos of Hummusapiens
 * and GradeSense were used first). Hummusapiens is from the deck's Shark Tank slide (p7), Gredo's
 * founders from Skope Kitchens' release on their vending launch at SSB (2026; to confirm they are
 * students).
 *
 * **Figures marked PLACEHOLDER are made up** (the team's call: "fabricate for now, we will add
 * real stats later"); the rest are the deck's. So are the names of the valet app and the bridal
 * line (the deck doesn't name them).
 */
export const beyondPlacements = {
  turn: {
    setup: 'Students at SSB didn’t just build careers.',
    lead: 'They built companies.',
    // in the logo's green, as Why SSB's roles, its full stop too (the team's calls, 2026-10-07)
    accent: 'companies.',
  },
  ventures: [
    {
      company: 'Hummusapiens',
      founders: ['Dr. Charles Chacko Porathoor'],
      description:
        'Hummus-based healthy snacks, built while studying at SSB and pitched to Shark Tank India judge Anupam Mittal on campus.',
      sector: 'Healthy snacking',
      // an offer to invest (July 2026, ANI): not "raised"
      stat: { value: '₹50L', label: 'offered by Anupam Mittal' },
    },
    {
      company: 'Gredo',
      founders: ['Mayank Kelwani', 'Sanskriti Deshmukh'],
      description:
        'A protein-food brand live on Zomato and Swiggy, with fresh-food vending machines across Bangalore, the first one at SSB.',
      sector: 'Food-tech',
      stat: { value: '₹1Cr+', label: 'ARR' },
    },
    {
      company: 'Dream Kit',
      founders: ['Aashish US'],
      avatars: ['/alumni/aashish-us.webp'],
      // "grew", as the deck has it: its web presence names another maker (to confirm)
      description:
        'A homegrown STEAM toy brand that teaches science through play, grown while he held a full-time role at The Whole Truth.',
      sector: 'STEAM toys',
      stat: { value: '12,000+', label: 'students across schools' },
    },
    {
      company: 'GradeSense',
      founders: ['Ayush Poojary'],
      description:
        'AI that evaluates descriptive and handwritten answer sheets at scale, so teachers spend less time grading and more teaching.',
      sector: 'AI · EdTech',
      stat: { value: '50,000+', label: 'answer sheets graded' }, // PLACEHOLDER
    },
    {
      company: 'Creator business',
      founders: ['Paritosh Sinha'],
      description:
        'He skipped placements to build his creator business full-time, and is now fielding publishing offers for his debut book.',
      sector: 'Creator economy',
      stat: { value: '200K', label: 'followers, up from 8K' },
    },
    {
      company: 'Tally Konnect',
      founders: ['Moh Agarwal'],
      avatars: ['/alumni/moh-agarwal.webp'],
      description:
        'Joined the family business after SSB and took it digital, launching Tally Konnect’s ERP automation platform for its clients.',
      sector: 'B2B SaaS',
      stat: { value: '₹5Cr', label: 'valuation' }, // PLACEHOLDER
    },
    {
      company: 'ParkEase', // PLACEHOLDER name: the deck has "a parking app"
      founders: ['Yash Ramchandani'],
      description:
        'A smart valet platform built from scratch, streamlining car handovers at malls, hotels and other high-footfall venues.',
      sector: 'Mobility',
      stat: { value: '10,000+', label: 'cars handed over' }, // PLACEHOLDER
    },
    {
      company: 'Zari & Co.', // PLACEHOLDER name: the deck has "an AI-assisted bridal wear brand"
      founders: ['Impanna Reddy'],
      description:
        'A premium Kanjivaram bridal line pairing AI colour analysis and bridal storytelling with certified gold-zari craftsmanship.',
      sector: 'Fashion',
      stat: { value: '₹50L', label: 'raised' }, // PLACEHOLDER
    },
  ] satisfies Venture[],
};

/** Deck p6: "Investors & Founders on Campus" (its quote is the testimonial banner). */
export const investors = {
  eyebrow: 'On campus',
  title: 'Investors and founders, on campus.|From Sequoia, Peak XV and more.',
  sub: 'Investors and founders from Sequoia, Peak XV, McKinsey, Cashfree and Lightrock meet SSB students on campus.',
  // Photos in public/people (640x800); logos in public/logos, shown white on the card.
  people: [
    { name: 'Navin Parwal', role: 'Founder, Mokobara', image: '/people/navin-parwal.webp' },
    {
      name: 'Sidhant Goyal',
      role: 'EIR, Toddle, Ex-Sequoia',
      image: '/people/sidhant-goyal.webp',
      logo: { name: 'Toddle', src: '/logos/toddle.svg' },
    },
    {
      name: 'Roel Janssen',
      role: 'Partner, Global Founders Capital, Ex-McKinsey',
      image: '/people/roel-janssen.webp',
    },
    {
      name: 'Akash Sinha',
      role: 'Founder & CEO, Cashfree',
      image: '/people/akash-sinha.webp',
      logo: { name: 'Cashfree', src: '/logos/cashfree.svg' },
    },
    {
      name: 'Vedant Trivedi',
      role: 'Investor, Peak XV, Ex-Sequoia',
      image: '/people/vedant-trivedi.webp',
      logo: { name: 'Peak XV Partners', src: '/logos/peakxv.svg' },
    },
    {
      name: 'Dhron Kanish',
      role: 'Associate Partner, McKinsey',
      image: '/people/dhron-kanish.webp',
      logo: { name: 'McKinsey & Company', src: '/logos/mckinsey.svg' },
    },
    {
      name: 'Divya Venkataraghavan',
      role: 'Principal, Lightrock / Aspada',
      image: '/people/divya-venkataraghavan.webp',
      logo: { name: 'Lightrock', src: '/logos/lightrock.svg' },
    },
    {
      name: 'Saurabh Jain',
      role: 'Co-Founder, Stable Money',
      image: '/people/saurabh-jain.webp',
      logo: { name: 'Stable Money', src: '/logos/stable-money.svg' },
    },
    {
      name: 'Sucheta Mahapatra',
      role: 'Ex-MD, Branch / Airtel / WeWork',
      image: '/people/sucheta-mahapatra.webp',
      logo: { name: 'Airtel', src: '/logos/airtel.svg' },
    },
  ] satisfies ShowcasePerson[],
};

/** Deck p7: the Shark Tank judge. */
export const sharkTank = {
  eyebrow: 'On campus',
  title: 'A Shark Tank India judge sat across from our students, and wrote a cheque.',
  sub: 'Founders and investors review student startups on campus, and some put money behind them.',
  stories: [
    {
      title: 'Anupam Mittal',
      text: 'On a campus visit, Shark Tank India’s Anupam Mittal reviewed student-led startups: Hummusapiens, Gredo, Grade Sense, and Dream Kit, and offered ₹50 lakh to Hummusapiens, founded by student Dr. Charles Chacko Porathoor. A one-time visit, a real term sheet.',
      mediaLabel: 'Photo / video: Anupam Mittal on campus with students',
      // SSB's video: "Anupam Mittal Offers ₹50L to this Bangalore Hummus Startup" (its thumbnail)
      media: '/on-campus/anupam-mittal.webp',
      href: 'https://www.youtube.com/watch?v=fCP4SbBrwKQ',
    },
    {
      title: 'Ankur Warikoo',
      text: 'At the founding cohort’s convocation, Ankur Warikoo handed 55 graduating students, headed to Urban Company, Blinkit, Ninjacart, Avendus, Emergent, and Whole Truth Foods, their certificates in person, and left them with one line: “Don’t get intellectually comfortable.”',
      mediaLabel: 'Photo / video: Ankur Warikoo at the founding cohort’s convocation',
      // SSB's video with him ("The Truth About Building a Career, Startup & Personal Brand"); no
      // convocation video on the channel yet
      media: '/on-campus/ankur-warikoo.webp',
      href: 'https://www.youtube.com/watch?v=ZFVqtpqSlyI',
    },
    // Dummy copy until the team's arrives (the deck has "xx").
    {
      title: 'Shantanu Deshpande',
      text: 'Dummy copy: a line about Shantanu Deshpande’s campus visit goes here, the startups reviewed and the advice shared with students, kept to the length of the other cards so the layout can be reviewed.',
      mediaLabel: 'Photo / video: Shantanu Deshpande on campus',
    },
    {
      title: 'Kiran Shah',
      text: 'Dummy copy: a line about Kiran Shah’s time on campus goes here, the session on campus and what students took away from it, kept to the length of the other cards so the layout can be reviewed.',
      mediaLabel: 'Photo / video: Kiran Shah on campus',
    },
  ] satisfies Story[],
};

/** Deck p13: the mentors and SSB's founding team, as Faculty's cards (photos in public/people).
 *  People without a photo yet are listed but not shown (`image` unset); add it to show them. */
export const mentorsSection = {
  eyebrow: 'Mentors',
  title: 'Mentored by the people who built India’s startups.|Zomato, Flipkart, Paytm and CRED.',
  sub: 'Founders and investors behind some of India’s best-known companies mentor SSB students.',
  // the logos (2026-10-13): each as its brand shows it, its own colours on its own ground (Zomato,
  // Freecharge: the mark white on their red and orange; Blinkit on its yellow; Flipkart, PhonePe their
  // white marks on blue and purple; CRED on black; the multi-colour marks on white)
  people: [
    {
      name: 'Deepinder Goyal',
      role: 'Co-founder, Zomato',
      image: '/people/deepinder-goyal.webp',
      logo: { name: 'Zomato', src: '/logos/zomato.svg' },
      logos: [{ name: 'Zomato', src: '/logos/zomato.svg', bg: '#E23744' }, { name: 'Blinkit', src: '/logos/blinkit.svg', bg: '#F8CB46', native: true }],
    },
    {
      name: 'Binny Bansal',
      role: 'Co-founder, Flipkart',
      image: '/people/binny-bansal.webp',
      logo: { name: 'Flipkart', src: '/logos/flipkart.svg' },
      logos: [{ name: 'Flipkart', src: '/logos/flipkart-white.svg', bg: '#2874F0', native: true }, { name: 'PhonePe', src: '/logos/phonepe-white.svg', bg: '#5F259F', native: true }],
    },
    {
      name: 'Vijay Shekhar Sharma',
      role: 'MD, Paytm',
      image: '/people/vijay-shekhar-sharma.webp',
      logo: { name: 'Paytm', src: '/logos/paytm.svg' },
      // One97 Communications: the company he founded in 2000, Paytm's parent (its mark in its own colours, on white)
      logos: [{ name: 'Paytm', src: '/logos/paytm.svg', bg: '#FFFFFF', native: true }, { name: 'One97 Communications', src: '/logos/one97.png', bg: '#FFFFFF', native: true }],
    },
    {
      name: 'Kunal Shah',
      role: 'Founder, CRED',
      image: '/people/kunal-shah.webp',
      logo: { name: 'CRED', src: '/logos/cred.svg', scale: 1.7 },
      // Freecharge (he co-founded it): its logo (Wikimedia Commons) white on its orange
      logos: [{ name: 'CRED', src: '/logos/cred.svg', bg: '#000000', native: true }, { name: 'Freecharge', src: '/logos/freecharge.png', bg: '#E1714C' }],
    },
    {
      name: 'Rajan Anandan',
      role: 'MD, Peak XV',
      image: '/people/rajan-anandan.webp',
      logo: { name: 'Peak XV Partners', src: '/logos/peakxv.svg' },
      // Google: he was its India MD before Peak XV
      logos: [{ name: 'Peak XV Partners', src: '/logos/peakxv.svg', bg: '#FFFFFF', native: true }, { name: 'Google', src: '/logos/google.svg', bg: '#FFFFFF', native: true }],
    },
  ] as (Omit<ShowcasePerson, 'image'> & { image?: string })[],
};
export const foundingTeamSection = {
  eyebrow: 'Leadership',
  title: 'The team that built SSB.|From Meta, Uber, McKinsey and BCG.',
  sub: 'Leaders from Meta, McKinsey, BCG, Uber, Google and Bain who built SSB.',
  people: [
    {
      name: 'Anshuman Singh',
      role: 'Co-founder, Ex-Meta',
      image: '/people/anshuman-singh.webp',
      logo: { name: 'Meta', src: '/logos/meta.svg' },
    },
    { name: 'Abhimanyu Saxena', role: 'Co-founder, Ex-Fab.com', image: '/people/abhimanyu-saxena.webp' },
    {
      name: 'Bhavik Rathod',
      role: 'Founding Leader, Uber India',
      image: '/people/bhavik-rathod.webp',
      logo: { name: 'Uber', src: '/logos/uber.svg' },
    },
    {
      name: 'Vidit Jain',
      role: 'SVP, Ex-McKinsey/ISB',
      image: '/people/vidit-jain.webp',
      logo: { name: 'McKinsey & Company', src: '/logos/mckinsey.svg' },
    },
    {
      name: 'Sucheta Mahapatra',
      role: 'VP Business, SSB · Ex-Bain, Airtel',
      image: '/people/sucheta-mahapatra.webp',
      logo: { name: 'Bain & Company', src: '/logos/bain.svg' },
    },
    {
      name: 'Manish Pansari',
      role: 'Director, Business Ops, SSB · Ex-Myntra, Kearney',
      image: '/people/manish-pansari.webp',
      logo: { name: 'Kearney', src: '/logos/kearney.svg' },
    },
    {
      name: 'Adhiraj Arora',
      role: 'Program Director, Ex-BCG, ISB',
      image: '/people/adhiraj-arora.webp',
      logo: { name: 'BCG', src: '/logos/bcg.svg' },
    },
    { name: 'Rahul Karthikeyan', role: 'CMO, Scaler, Ex-upGrad', image: '/people/rahul-karthikeyan.webp' },
    {
      name: 'Ratnakar Reddy',
      role: 'Enterprise Head, Ex-Google/Microsoft',
      image: '/people/ratnakar-reddy.webp',
      logo: { name: 'Google', src: '/logos/google.svg' },
    },
    { name: 'Amar Srivastava', role: 'CEO, Scaler Online Business', image: '/people/amar-srivastava.webp' },
  ] satisfies ShowcasePerson[],
};

/** Deck p15: Super Mentor Sessions. */
export const superMentors = {
  eyebrow: 'Sessions',
  title: 'Super Mentor Sessions.|Leaders from Google, Blinkit, PhonePe and OpenAI.',
  sub: 'Mentored by India’s top business leaders.',
  // The deck's copy (name, role, line); the thumbnails and logos of Scaler School of Technology's
  // "Access To Industry Leaders" (scaler.com/school-of-technology); videos on YouTube.
  sessions: [
    {
      name: 'Rajan Anandan',
      role: 'Ex-MD SEA, Google',
      text: 'He spoke about striving for excellence, learning from failure, and staying hungry for success.',
      videoId: 'M7H1SHc1f2Q',
      thumb: '/sessions/rajan-anandan.webp',
      logo: { name: 'Google', src: '/sessions/rajan-anandan-logo.png' },
    },
    {
      name: 'Jacob Singh',
      role: 'Ex-CTO, Blinkit, India’s Largest Q-Commerce',
      text: 'He shared deep insights on tech leadership and product thinking with the students.',
      videoId: 'QMjFvjBwuE4',
      thumb: '/sessions/jacob-singh.webp',
      logo: { name: 'Blinkit', src: '/sessions/jacob-singh-logo.png' },
    },
    {
      name: 'Rahul Chari',
      role: 'Co-Founder, PhonePe (India’s largest UPI app)',
      text: 'Rejected by Google, built a leading UPI platform. A journey of grit and innovation.',
      videoId: 'fN43OAasN5w',
      thumb: '/sessions/rahul-chari.webp',
      logo: { name: 'PhonePe', src: '/sessions/rahul-chari-logo.png' },
    },
    {
      name: 'Yash Kumar',
      role: 'Lead Engineer, OpenAI (ChatGPT Agents)',
      text: 'The creator of OpenAI’s first agent, addressed students on Commencement Day.',
      videoId: '5R95YlIdeBg',
      thumb: '/sessions/yash-kumar.webp',
      logo: { name: 'OpenAI', src: '/sessions/yash-kumar-logo.png' },
    },
  ] satisfies Session[],
};

/** A photo in Life Beyond the Classroom's mosaic; no `media`: a placeholder naming the photo (`alt`). */
export type CampusPhoto = { media?: string; alt: string; caption?: string; position?: string };

/** Deck p24: Life Beyond the Classroom. Photos: the team's campus shoot (2026-10-07), public/campus. */
export const campusLife = {
  eyebrow: 'Campus life',
  title: 'Life beyond the classroom.|A fully residential campus in Bengaluru.',
  sub: 'Shared with SST · Backed by Peak XV, Lightrock and Tiger Global.', // shortened (2026-10-23); the residential campus is in the title
  /** The mosaic's middle photo: on desktop it arrives full-bleed and pulls back into its tile. */
  feature: { media: '/campus/cohort.webp', alt: 'An SSB cohort together on campus', position: '50% 62%' },
  /** The student clubs, as the Innovation Lab's startups (a row of cards, each with a photo). The
      deck's line for each, then a clause of ours on what the club is for, to fill the card's three
      lines as the startups' do (the team's ask, 2026-10-07; no new facts: for the team to confirm). */
  clubsTurn: { text: 'Student clubs, by SSB students.', accent: 'Student clubs' },
  clubs: [
    {
      name: 'Marketing Club',
      tag: 'Marketing',
      text: 'Branding sessions and case competitions with founders like Meolaa’s Ishita Sawant: learn to build and pitch a brand.',
      media: '/campus/flags.webp',
      alt: 'SSB banners in the campus grounds',
      position: '50% 70%',
    },
    {
      name: 'Consulting Club',
      tag: 'Consulting',
      text: 'SSB’s own Case Book and sessions with Ex-McKinsey and BCG consultants: learn to structure and present a case.',
      media: '/campus/classroom.webp',
      alt: 'Students in an SSB lecture hall',
      position: '62% 50%',
    },
  ],
  /** The campus around it, in the mosaic's order (left tall, left short, right short, right tall). */
  photos: [
    { media: '/campus/arch.webp', alt: 'The Scaler School of Business arch on Commencement Day', position: '50% 50%' },
    { media: '/campus/gym.webp', alt: 'The campus gym', position: '45% 60%' },
    { media: '/campus/building.webp', alt: 'The SSB building in Bengaluru', position: '50% 55%' },
    { media: '/campus/classroom.webp', alt: 'Students in an SSB lecture hall', position: '50% 40%' },
  ],
  /** The mosaic's other tabs (2026-10-23, the team's ask): the same five tiles, each tab its own photos
   *  and a caption on each. A tile with no `media` is a marked placeholder naming the photo to come. */
  galleries: [
    // (review call, 21 Oct 2026) the tabs the team named: classrooms, sports and gym, clubs, fests,
    // cultural. Our photos where we have them; each placeholder names the shot to come
    {
      id: 'classrooms',
      label: 'Classrooms',
      feature: { media: '/campus/classroom.webp', alt: 'Students in an SSB lecture hall', caption: 'A lecture hall at SSB', position: '50% 40%' },
      photos: [
        { alt: 'Photo: a case discussion in class' },
        { alt: 'Photo: a workshop in the Innovation Lab' },
        { alt: 'Photo: a guest lecture' },
        { alt: 'Photo: students presenting to a panel' },
      ],
    },
    {
      id: 'sports',
      label: 'Sports & gym',
      feature: { media: '/campus/gym.webp', alt: 'The campus gym', caption: 'The campus gym', position: '45% 60%' },
      photos: [
        { alt: 'Photo: cricket or football on campus' },
        { alt: 'Photo: sports day' },
        { alt: 'Photo: a morning run or yoga' },
        { alt: 'Photo: the indoor games room' },
      ],
    },
    {
      id: 'clubs',
      label: 'Clubs',
      feature: { media: '/campus/flags.webp', alt: 'SSB banners in the campus grounds', caption: 'The student clubs', position: '50% 70%' },
      photos: [
        { alt: 'Photo: the Marketing Club at work' },
        { alt: 'Photo: the Consulting Club’s case session' },
        { alt: 'Photo: a club meet-up' },
        { alt: 'Photo: a club’s guest session' },
      ],
    },
    {
      id: 'fests',
      label: 'Fests & events',
      feature: { media: '/on-campus/anupam-mittal.webp', alt: 'Anupam Mittal on campus with SSB students', caption: 'Anupam Mittal on campus', position: '50% 40%' },
      photos: [
        { media: '/on-campus/ankur-warikoo.webp', alt: 'Ankur Warikoo at the SSB convocation', caption: 'Ankur Warikoo at convocation', position: '50% 40%' },
        { media: '/campus/arch.webp', alt: 'The SSB arch on Commencement Day', caption: 'Commencement Day', position: '50% 50%' },
        { alt: 'Photo: the annual fest, on stage' },
        { alt: 'Photo: a hackathon or case competition' },
      ],
    },
    {
      id: 'cultural',
      label: 'Cultural',
      // PLACEHOLDER: no cultural photos yet; each tile names the shot to come
      feature: { alt: 'Photo: a cultural night, on stage' },
      photos: [
        { alt: 'Photo: Diwali or Holi on campus' },
        { alt: 'Photo: a music or open-mic night' },
        { alt: 'Photo: a dance performance' },
        { alt: 'Photo: a festival dinner' },
      ],
    },
  ] as { id: string; label: string; feature: CampusPhoto; photos: CampusPhoto[] }[],
  follow: [
    {
      handle: '@scalerschool_of_business',
      note: 'official',
      href: 'https://www.instagram.com/scalerschool_of_business/',
    },
    { handle: '@life_at_ssb', note: 'student-run', href: 'https://www.instagram.com/life_at_ssb/' },
  ],
};

/** Deck p25: "Scaler In the news." (the deck has only the title: four article slots). */
export const inTheNews = {
  eyebrow: 'Press',
  title: 'Scaler in the News.',
  sub: 'What the press has written about Scaler and SSB.',
  articles: [1, 2, 3, 4].map((n) => ({
    kicker: `Publication ${n}`,
    title: 'Headline to come',
    mediaLabel: 'Publication logo / article image',
  })) satisfies Story[],
};

/** One company in "Built at SSB" (BuiltSection, from the concept site's /v4, 2026-10-23). */
export type BuiltCompany = {
  company: string;
  sector: string;
  /** Founders as shown ("Mayank & Sanskriti"), their initials on the chip, and an optional photo. */
  by: string;
  initials: string;
  avatar?: string;
  role: string;
  /** The line under the company, in place of the founders' chip (2026-10-27, the user's copy). */
  blurb: string;
  story: string;
  stat: { value: string; label: string };
  image: { src: string; alt: string; width: number; height: number };
  /** The photo's focal point (0–1), for object-position and the hotspots' placement. */
  focus: [number, number];
  /** How dark the top gradient runs (0–1): lighter photos need more under the white type. */
  topShade: number;
  /** A note on the photo, opened from a dot at (x, y), as fractions of the photo. */
  hotspot: { x: number; y: number; label: string; text: string };
};

/** "Built at SSB": the concept site's /v4 section (the team's pick, 2026-10-23), in place of
 *  Beyond Placements' card rows. Copy, photos and figures as there; story links to come. */
export const builtAtSsb = {
  eyebrow: 'Built at SSB',
  title: 'Students didn’t just build careers.',
  titleTail: 'They built companies.',
  label: 'Companies built by Cohort 1 students',
  companies: [
    { company: 'Hummusapiens', sector: 'Healthy snacking', by: 'Dr. Charles Chacko Porathoor', initials: 'CP', role: 'Founder · Cohort 1', blurb: 'Dr. Charles Chacko Porathoor built Hummusapiens, a healthy-snacking brand Shark Tank India’s Anupam Mittal offered ₹50 lakh to back.', story: '#', stat: { value: '₹50L', label: 'Offered by Anupam Mittal' }, image: { src: '/media/built/hummus.webp', alt: 'A bowl of hummus with chickpeas and olive oil on dark slate', width: 1600, height: 1090 }, focus: [0.5, 0.5], topShade: 0.55, hotspot: { x: 0.44, y: 0.42, label: 'On campus', text: 'Pitched to Shark Tank India judge Anupam Mittal at SSB.' } },
    { company: 'Gredo', sector: 'Food-tech', by: 'Mayank & Sanskriti', initials: 'MS', role: 'Founders · Cohort 1', blurb: 'Sanskriti Deshmukh built Gredo, a protein-food brand live on Zomato and Swiggy, with vending machines across Bangalore.', story: '#', stat: { value: '₹1Cr+', label: 'ARR' }, image: { src: '/media/built/gredo.webp', alt: 'Three glass meal-prep boxes of grains, vegetables and lentils', width: 1600, height: 1280 }, focus: [0.5, 0.45], topShade: 0.66, hotspot: { x: 0.25, y: 0.48, label: 'Where to find it', text: 'Live on Zomato and Swiggy.' } },
    { company: 'Dream Kit', sector: 'STEAM toys', by: 'Aashish US', initials: 'AU', avatar: '/alumni/aashish-us.webp', role: 'Founder · Cohort 1', blurb: 'Aashish US built Dream Kit, a homegrown STEAM toy brand used across schools, while holding a full-time role at The Whole Truth.', story: '#', stat: { value: '12,000+', label: 'Students across schools' }, image: { src: '/media/built/dreamkit.webp', alt: 'A child building a robot from colourful snap-together blocks', width: 1600, height: 1066 }, focus: [0.58, 0.5], topShade: 0.6, hotspot: { x: 0.535, y: 0.36, label: 'The product', text: 'A homegrown STEAM toy brand that teaches science through play.' } },
    { company: 'GradeSense', sector: 'AI · EdTech', by: 'Ayush Poojary', initials: 'AP', role: 'Founder · Cohort 1', blurb: 'Ayush Poojary built Gradesense, which evaluates descriptive and handwritten assessments at scale.', story: '#', stat: { value: '50,000+', label: 'Answer sheets graded' }, image: { src: '/media/built/gradesense.webp', alt: 'A fountain pen writing by hand on lined paper', width: 1600, height: 1202 }, focus: [0.45, 0.55], topShade: 0.6, hotspot: { x: 0.37, y: 0.62, label: 'The product', text: 'AI that evaluates descriptive and handwritten answer sheets at scale.' } },
    { company: 'Creator business', sector: 'Creator economy', by: 'Paritosh Sinha', initials: 'PS', role: 'Founder · Cohort 1', blurb: 'Paritosh Sinha skipped placements to build his creator business full-time and is now fielding publishing offers for his debut book.', story: '#', stat: { value: '200K', label: 'Followers, up from 8K' }, image: { src: '/media/built/creator.webp', alt: 'A studio microphone with a pop filter in a dark recording room', width: 1600, height: 1066 }, focus: [0.62, 0.5], topShade: 0.5, hotspot: { x: 0.66, y: 0.44, label: 'The bet', text: 'Skipped placements to build his creator business full-time.' } },
    { company: 'Tally Konnect', sector: 'B2B SaaS', by: 'Moh Agarwal', initials: 'MA', avatar: '/alumni/moh-agarwal.webp', role: 'Founder · Cohort 1', blurb: 'Moh Agarwal joined Tally Konnect after SSB and launched its ERP automation platform.', story: '#', stat: { value: '₹5Cr', label: 'Valuation' }, image: { src: '/media/built/tally.webp', alt: 'Tall warehouse racks stacked with cartons under strip lights', width: 1600, height: 1065 }, focus: [0.6, 0.5], topShade: 0.55, hotspot: { x: 0.72, y: 0.5, label: 'The product', text: 'An ERP automation platform that took the family business digital.' } },
    { company: 'ParkEase', sector: 'Mobility', by: 'Yash Ramchandani', initials: 'YR', role: 'Founder · Cohort 1', blurb: 'Yash Ramchandani built ParkEase, a smart valet platform that streamlines car handovers at high-footfall venues.', story: '#', stat: { value: '10,000+', label: 'Cars handed over' }, image: { src: '/media/built/parkease.webp', alt: 'A long, dimly lit parking garage lined with cars', width: 1600, height: 1200 }, focus: [0.5, 0.6], topShade: 0.5, hotspot: { x: 0.5, y: 0.6, label: 'The product', text: 'A smart valet platform for malls, hotels and high-footfall venues.' } },
    { company: 'Zari & Co.', sector: 'Fashion', by: 'Impanna Reddy', initials: 'IR', role: 'Founder · Cohort 1', blurb: 'Impanna Reddy built Zari & Co., a premium Kanjivaram bridal line.', story: '#', stat: { value: '₹50L', label: 'Raised' }, image: { src: '/media/built/zari.webp', alt: 'Red silk saree with gold zari motifs and a string of pearls', width: 1600, height: 1200 }, focus: [0.45, 0.5], topShade: 0.55, hotspot: { x: 0.3, y: 0.52, label: 'The line', text: 'A premium Kanjivaram bridal line.' } },
  ] as BuiltCompany[],
};

/** "In the press": the concept site's /v4 section (2026-10-23, the team's pick, in place of In the
 *  News), copy and links as there; the publications' logos in public/media/press. */
export const press = {
  eyebrow: 'In the press',
  title: 'In the press.|What has been written about SSB.',
  articles: [
    { outlet: 'The Hindu BusinessLine', short: 'BusinessLine', logo: { src: '/media/press/businessline.svg', h: 20 }, date: '2026-04-22', dateLabel: '22 Apr 2026', title: 'Scaler School of Business adopts practice-led MBA model', text: 'Student teams generated over ₹15 lakh in six weeks through D2C businesses.', href: 'https://www.thehindubusinessline.com/news/education/scaler-school-of-business-adopts-practice-led-mba-model/article70893572.ece' },
    { outlet: 'The Tribune', short: 'The Tribune', logo: { src: '/media/press/tribune.png', h: 24 }, date: '2026-07-29', dateLabel: '29 Jul 2026', title: 'Anupam Mittal asks “50 lakh mein kitna equity dega?” after meeting SSB student startups', text: 'He reviewed Hummusapiens, Gredo, GradeSense and Dream Kit on campus.', href: 'https://www.tribuneindia.com/news/business/anupam-mittal-says-50-lakh-mein-kitna-equity-dega-after-meeting-startups-built-by-scaler-school-of-business-students' },
    { outlet: 'Inshorts', short: 'Inshorts', logo: { src: '/media/press/inshorts.png', h: 22 }, date: '2026-05-11', dateLabel: '11 May 2026', title: 'Scaler School of Business founding cohort achieves ₹18 LPA average CTC', text: 'A 3.2x average hike, with hiring partners including Blinkit, Urban Company and Scapia.', href: 'https://inshorts.com/en/news/scaler-school-of-business-founding-cohort-achieves--18-lpa-average-ctc-1778474412054' },
    { outlet: 'Outlook Business', short: 'Outlook Business', logo: { src: '/media/press/outlookbusiness.png', h: 30 }, date: '2024-05-01', dateLabel: '1 May 2024', title: 'Scaler diversifies its educational offering, launches Scaler School of Business', text: 'The launch of the full-time PGP in Management and Technology in Bengaluru.', href: 'https://www.outlookbusiness.com/corporate/scaler-diversifies-its-educational-offering-launches-scaler-school-of-business' },
  ],
};
