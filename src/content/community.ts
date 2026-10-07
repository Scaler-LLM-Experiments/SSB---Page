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
  title: 'Investors & Founders on Campus',
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
  title: 'Mentored by the Builders of Zomato, Flipkart, Paytm and CRED',
  sub: 'Founders and investors behind some of India’s best-known companies mentor SSB students.',
  people: [
    {
      name: 'Deepinder Goyal',
      role: 'Co-founder, Zomato',
      image: '/people/deepinder-goyal.webp',
      logo: { name: 'Zomato', src: '/logos/zomato.svg' },
    },
    {
      name: 'Binny Bansal',
      role: 'Co-founder, Flipkart',
      image: '/people/binny-bansal.webp',
      logo: { name: 'Flipkart', src: '/logos/flipkart.svg' },
    },
    {
      name: 'Vijay Shekhar Sharma',
      role: 'MD, Paytm',
      image: '/people/vijay-shekhar-sharma.webp',
      logo: { name: 'Paytm', src: '/logos/paytm.svg' },
    },
    {
      name: 'Kunal Shah',
      role: 'Founder, CRED',
      image: '/people/kunal-shah.webp',
      logo: { name: 'CRED', src: '/logos/cred.svg', scale: 1.7 },
    },
    {
      name: 'Rajan Anandan',
      role: 'MD, Peak XV',
      image: '/people/rajan-anandan.webp',
      logo: { name: 'Peak XV Partners', src: '/logos/peakxv.svg' },
    },
  ] as (Omit<ShowcasePerson, 'image'> & { image?: string })[],
};
export const foundingTeamSection = {
  eyebrow: 'Leadership',
  title: 'SSB’s Founding Team',
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
  title: 'Super Mentor Sessions',
  sub: 'Supported & Mentored by India’s Top Business Leaders.',
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

/** Deck p24: Life Beyond the Classroom. */
export const campusLife = {
  eyebrow: 'Campus life',
  title: 'Life Beyond the Classroom.',
  sub: 'Fully residential campus in Bengaluru · Shared Innovation Lab and campus with SST · Backed by Peak XV, Lightrock, Tiger Global.',
  clubs: [
    {
      name: 'Marketing Club',
      text: 'Branding sessions, case competitions with founders including Meolaa’s Ishita Sawant.',
    },
    { name: 'Consulting Club', text: 'SSB’s own Case Book, sessions with Ex-McKinsey and BCG consultants.' },
  ],
  follow: [
    {
      handle: '@scalerschool_of_business',
      note: 'official',
      href: 'https://www.instagram.com/scalerschool_of_business/',
    },
    { handle: '@life_at_ssb', note: 'student-run', href: 'https://www.instagram.com/life_at_ssb/' },
  ],
  photos: [
    { mediaLabel: 'Photo: campus building exterior' },
    { mediaLabel: 'Photo: classroom' },
    { mediaLabel: 'Photo: turf / common area' },
  ] as { mediaLabel: string; media?: string }[],
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
