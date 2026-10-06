// The remaining sections of the deck (SSB Website vF, Sep '26), laid out with
// placeholders for their photos and videos: set `photo` / `media` when an asset
// arrives (files in public/). Copy is the deck's; a missing line (the deck's
// "xx") is left out and shows as "Copy to come". Eyebrows are drafts.

import type { ShowcasePerson } from '@/sections/faculty/PeopleShowcase';
import type { Session } from '@/sections/community/SessionCard';

type Story = { title: string; text?: string; media?: string; mediaLabel: string; kicker?: string; href?: string };

/** Deck p5: "Beyond Placements". */
export const beyondPlacements = {
  eyebrow: 'Student founders',
  title: 'Beyond Placements',
  sub: "Some students didn't just find careers at SSB. They built companies.",
  stories: [
    {
      kicker: 'Paritosh Sinha',
      title: 'Grew a Personal Brand from 8K to 200K',
      text: 'Paritosh Sinha skipped placements to build his creator business full-time, now fielding publishing offers for his debut book.',
      mediaLabel: 'Photo / video: Paritosh Sinha',
    },
    {
      kicker: 'Moh Agarwal',
      title: 'Scaling a Family Business Through Tech',
      text: 'Moh Agarwal joined Tally Konnect post-SSB, launching its ERP automation platform.',
      mediaLabel: 'Photo / video: Moh Agarwal',
    },
    {
      kicker: 'Aashish US',
      title: 'Built a ₹2Cr Startup with 12,000+ Students Across Schools',
      text: 'Aashish US grew Dream Kit, a homegrown STEAM toy brand, while holding a role at Whole Truth.',
      mediaLabel: 'Photo / video: Aashish US',
    },
    {
      kicker: 'Gredo',
      title: 'Protein-Food Brand with ₹1Cr+ ARR',
      text: 'Gredo, a protein food brand, is live on Zomato and Swiggy, with vending machines across Bangalore.',
      mediaLabel: 'Photo / video: Gredo',
    },
    {
      kicker: 'Yash Ramchandani',
      title: 'A Parking App Built From Scratch',
      text: "Yash Ramchandani's smart valet platform streamlines car handovers at high-footfall venues.",
      mediaLabel: 'Photo / video: parking app screenshot',
    },
    {
      kicker: 'Impanna Reddy',
      title: 'An AI-Assisted Bridal Wear Brand',
      text: 'Impanna Reddy combines bridal storytelling, colour analysis, and certified gold-zari craftsmanship in a premium Kanjivaram line.',
      mediaLabel: 'Photo / video: bridal wear line',
    },
    {
      kicker: 'Ayush Poojary',
      title: 'AI-Powered Grading, Built by a Student',
      text: "Ayush Poojary's Gradesense evaluates descriptive and handwritten assessments at scale.",
      mediaLabel: 'Photo / video: Gradesense screenshot',
    },
  ] satisfies Story[],
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
