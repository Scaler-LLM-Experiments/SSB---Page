/**
 * Each company's logo mark alone (its app icon or symbol), for the faculty cards' company line: the
 * mark in a square box, the company's name beside it (2026-10-23, the team's ask). Keyed by the
 * wordmark file's name, as brand-tiles.ts. `bg` fills the box behind a mark that is not its own
 * full square (an SVG cut from the wordmark file); the app icons fill their box themselves.
 * Sources: each company's own site icon; Flipkart's bag and IIM Bangalore's crest cut from our
 * wordmark files; McKinsey's mark as the hero's.
 */
export type BrandMark = { src: string; bg?: string };

export const brandMarks: Record<string, BrandMark> = {
  bcg: { src: '/logos/marks/fc-bcg.png' },
  blinkit: { src: '/logos/marks/fc-blinkit.png' },
  cashfree: { src: '/logos/marks/fc-cashfree.png', bg: '#FFFFFF' },
  deutschebank: { src: '/logos/marks/fc-deutschebank.png', bg: '#FFFFFF' },
  epigamia: { src: '/logos/marks/fc-epigamia.png', bg: '#FFFFFF' },
  flipkart: { src: '/logos/marks/flipkart-mark.svg', bg: '#2874F0' },
  iimb: { src: '/logos/marks/iimb-mark.svg', bg: '#FFFFFF' },
  mars: { src: '/logos/marks/fc-mars.png', bg: '#FFFFFF' },
  mckinsey: { src: '/logos/marks/lead-mckinsey.png', bg: '#FFFFFF' },
  paypal: { src: '/logos/marks/fc-paypal.png', bg: '#FFFFFF' },
  razorpay: { src: '/logos/marks/fc-razorpay.png', bg: '#FFFFFF' },
  'stable-money': { src: '/logos/marks/fc-stable-money.png', bg: '#000000' },
  toddle: { src: '/logos/marks/fc-toddle.png', bg: '#FFFFFF' },
  zomato: { src: '/logos/marks/fc-zomato.png' },
  // the mentors' companies (2026-10-23)
  paytm: { src: '/logos/marks/fc-paytm.png' },
  cred: { src: '/logos/marks/fc-cred.png', bg: '#FFFFFF' },
  peakxv: { src: '/logos/marks/fc-peakxv.png', bg: '#FFFFFF' },
  // the founding team's and investors' companies (2026-10-23; the hero's marks where it has them)
  meta: { src: '/logos/marks/lead-meta.png', bg: '#FFFFFF' },
  uber: { src: '/logos/marks/fc-uber.png', bg: '#FFFFFF' },
  bain: { src: '/logos/marks/lead-bain.png', bg: '#FFFFFF' },
  kearney: { src: '/logos/marks/lead-kearney.png', bg: '#FFFFFF' },
  google: { src: '/logos/marks/lead-google.png', bg: '#FFFFFF' },
  airtel: { src: '/logos/marks/lead-airtel.png', bg: '#FFFFFF' },
  lightrock: { src: '/logos/marks/fc-lightrock.png', bg: '#FFFFFF' },
  // (2026-10-28) the investors' row on /v7: Mokobara's and Global Founders Capital's own site icons (Mokobara's inverted to black on white, as the others' white boxes)
  mokobara: { src: '/logos/marks/fc-mokobara.png', bg: '#FFFFFF' },
  'global-founders-capital': { src: '/logos/marks/fc-global-founders-capital.png', bg: '#FFFFFF' },
  // the Impact Foundation's (2026-10-23)
  rippling: { src: '/logos/marks/fc-rippling.png' },
  zeta: { src: '/logos/marks/fc-zeta.png', bg: '#FFFFFF' },
  webveda: { src: '/logos/marks/fc-webveda.png' },
};

/** The mark for a wordmark file ('/logos/flipkart.svg' → Flipkart's bag on blue), or null. */
export function brandMark(src: string): BrandMark | null {
  const key = src.split('/').pop()!.replace(/\.(svg|png|jpg|webp)$/, '').replace(/-white$/, '');
  return brandMarks[key] ?? null;
}
