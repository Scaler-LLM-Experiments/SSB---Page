'use client';

import { impactPeople } from '@/content/impact';
import { PeopleShowcase } from '@/sections/faculty/PeopleShowcase';

export function ImpactSection() {
  return (
    <PeopleShowcase
      id="impact"
      eyebrow="Scaler Impact Foundation"
      title="The people behind the Scaler Impact Foundation.|Founders, operators and creators."
      sub="Founders, operators and creators from Paytm, Rippling, Zeta, WebVeda and Soch by Mohak."
      people={impactPeople}
      itemName="member"
      // no "Meet", the company as its mark and name (2026-10-23, the team's ask)
      company
    />
  );
}
