/**
 * International Immersion: a week in Singapore (the team's brief, 2026-10-23). Singapore leads; the
 * partner campus (SP Jain) is named once, quietly. The days are the team's indicative plan ("can be
 * customised"). Photos: Wikimedia Commons (public/media/CREDITS.md), each credited on the stage.
 */
export type ImmersionSlot = { kind: 'Class' | 'Visit' | 'Culture' | 'Pitch' | 'Travel'; text: string };
export type ImmersionDay = {
  label: string;
  title: string;
  place: string;
  slots: ImmersionSlot[];
  image: { src: string; alt: string; position?: string; credit: string };
};

export const immersion = {
  eyebrow: 'International immersion',
  title: 'A week in Singapore.',
  titleTail: 'Asia’s most developed economy, as your classroom.',
  sub: 'Seven days of entrepreneurship, AI, industry and culture, with global faculty, ending in a live pitch to an industry jury.',
  note: 'Indicative plan, customised for each cohort. Classes with faculty from SP Jain’s Singapore campus.',
  pillars: [
    { icon: 'faculty', title: 'Global faculty', text: 'Entrepreneurship and AI, taught in Singapore.' },
    { icon: 'visit', title: 'Industry visits', text: 'Inside Asia’s most developed economy.' },
    { icon: 'jury', title: 'Capstone to a jury', text: 'A live pitch to industry judges.' },
    { icon: 'culture', title: 'Iconic Singapore', text: 'Chinatown, the Supertrees, a dragon boat.' },
  ],
  days: [
    { label: 'Arrive', title: 'Touch down in Singapore', place: 'Marina Bay', slots: [{ kind: 'Travel', text: 'Arrival and check-in' }],
      image: { src: '/media/singapore/marina-dusk.webp', alt: 'Marina Bay, Singapore, at dusk', position: '60% 50%', credit: 'Benh Lieu Song, CC BY-SA 4.0' } },
    { label: 'Ecosystem', title: 'How Singapore builds startups', place: 'Chinatown', slots: [
        { kind: 'Class', text: 'Singapore’s startup ecosystem: an overview' },
        { kind: 'Culture', text: 'City tour: Marina Barrage, Arab Street, Chinatown' }],
      image: { src: '/media/singapore/chinatown.webp', alt: 'Pagoda Street in Chinatown, Singapore', position: '50% 55%', credit: 'kallerna, CC BY-SA 4.0' } },
    { label: 'Build', title: 'Startup thinking, and the money behind it', place: 'Central Business District', slots: [
        { kind: 'Class', text: 'Building startup thinking and financial literacy' },
        { kind: 'Visit', text: 'Industry visit: Urban Redevelopment Authority' }],
      image: { src: '/media/singapore/cbd-sunset.webp', alt: 'Singapore’s Central Business District at sunset', position: '50% 60%', credit: 'Basile Morin, CC BY-SA 4.0' } },
    { label: 'AI', title: 'Technology and AI as an opportunity', place: 'Gardens by the Bay', slots: [
        { kind: 'Class', text: 'Leveraging technology and AI for transformation' },
        { kind: 'Culture', text: 'Gardens by the Bay tour' }],
      image: { src: '/media/singapore/supertrees.webp', alt: 'The Supertree Grove at Gardens by the Bay', position: '50% 45%', credit: 'Mustang Joe, CC0' } },
    { label: 'Pitch', title: 'The capstone, to an industry jury', place: 'Downtown Singapore', slots: [
        { kind: 'Pitch', text: 'Case study challenge: pitch to an industry jury' },
        { kind: 'Visit', text: 'Industry visit' }],
      image: { src: '/media/singapore/cbd-bridge.webp', alt: 'Singapore’s skyline and the Esplanade Bridge at night', position: '50% 50%', credit: 'Basile Morin, CC BY-SA 4.0' } },
    { label: 'Culture', title: 'On the water, then into one-north', place: 'Kallang River', slots: [
        { kind: 'Culture', text: 'Dragon boat' },
        { kind: 'Visit', text: 'Vidacity at one-north, Singapore’s startup hub' }],
      image: { src: '/media/singapore/dragon-boat.webp', alt: 'A dragon boat race in Singapore', position: '50% 50%', credit: 'Walk around the Red Dot, CC0' } },
    { label: 'Depart', title: 'Back home, with a network in Asia', place: 'Marina Bay Sands', slots: [{ kind: 'Travel', text: 'Check-out and departure' }],
      image: { src: '/media/singapore/gardens-dusk.webp', alt: 'Gardens by the Bay and Marina Bay Sands at dusk', position: '50% 55%', credit: 'Nicolas Lannuzel, CC BY-SA 2.0' } },
  ] as ImmersionDay[],
};
