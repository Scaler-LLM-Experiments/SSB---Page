'use client';

import { impactPeople } from '@/content/impact';
import { PeopleShowcase } from '@/sections/faculty/PeopleShowcase';

export function ImpactSection() {
  return (
    <PeopleShowcase
      id="impact"
      eyebrow="Scaler Impact Foundation"
      title="Meet the Leaders Behind the Scaler Impact Foundation."
      sub="Founders, operators and creators from Paytm, Rippling, Zeta, WebVeda and Soch by Mohak."
      people={impactPeople}
      itemName="member"
    />
  );
}
