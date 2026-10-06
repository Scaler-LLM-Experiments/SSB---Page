// The investor's word, from the deck (SSB Website vF, Sep '26, slide 7, under
// "Investors & Founders on Campus"). The photo is the team's (public/testimonials,
// 2243x701 WebP: the person at the right, a green blur at the left).

export const testimonial = {
  quote:
    'The energy at SSB & SST was intentional. The ideas students shared were grounded in reality, and with the kind of support and ecosystem they have here, they’re definitely on the right track to building things that matter.',
  name: 'Sidhant Goyal',
  role: 'Ex-Sequoia, Ex-McKinsey & Company',
  photo: '/testimonials/sidhant-goyal.webp',
  // Where the role comes from: "Ex-" then these, in white under the name (they say the role, so
  // `role` itself is for screen readers only). `scale`: McKinsey's thin serif reads small
  // beside Sequoia's heavy capitals at one height, so it is drawn larger.
  logos: [
    { name: 'Sequoia Capital', src: '/logos/sequoia.svg', scale: 1 },
    { name: 'McKinsey & Company', src: '/logos/mckinsey.svg', scale: 1.7 },
  ],
};
