'use client';

import { companyLogos } from '@/content/company-logos';
import { faculty } from '@/content/people';
import { PeopleShowcase } from './PeopleShowcase';

const people = faculty
  .filter((m) => m.photo)
  .map((m) => ({
    name: m.name,
    role: m.role,
    image: `/faculty/${m.photo}.webp`,
    logo: companyLogos[m.companies[0]],
  }));

export function FacultySection() {
  return (
    <PeopleShowcase
      id="faculty"
      eyebrow="Faculty"
      title="Learn From Your Future Recruiters, Not Just Faculty."
      sub="Operators and leaders from BCG, McKinsey, Razorpay, Zomato, PayPal, Flipkart and more teach at SSB."
      people={people}
      itemName="faculty"
    />
  );
}
