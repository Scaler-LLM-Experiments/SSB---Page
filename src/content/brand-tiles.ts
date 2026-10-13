/**
 * How each company shows its logo (2026-10-13, the team's ask: "the colour branding as per the
 * internet"): the tile's ground in the brand's colour and the mark white on it where that is how
 * the brand presents itself (Zomato on red, Decathlon on blue, McKinsey on navy…), or the mark in
 * its own colours on white where the logo is a multi-colour or dark mark (Google, Amazon, PayPal…).
 * Keyed by the logo file's name; a logo not listed sits on white in its own colours.
 */
export type BrandTile = {
  /** The tile's ground. */
  bg: string;
  /** Draw the mark white (a one-colour mark on its brand colour). */
  white?: boolean;
  /** A file already coloured for the ground (white marks with their accents kept). */
  src?: string;
};

export const brandTiles: Record<string, BrandTile> = {
  zomato: { bg: '#E23744', white: true },
  blinkit: { bg: '#F8CB46' },
  flipkart: { bg: '#2874F0', src: '/logos/flipkart-white.svg' },
  phonepe: { bg: '#5F259F', src: '/logos/phonepe-white.svg' },
  cred: { bg: '#000000' },
  freecharge: { bg: '#E1714C', white: true },
  colgate: { bg: '#D2010D', white: true },
  decathlon: { bg: '#3643BA', white: true },
  bain: { bg: '#CC0000', white: true },
  mckinsey: { bg: '#051C2C', white: true },
  bcg: { bg: '#197A56', white: true },
  uber: { bg: '#000000', white: true },
  airtel: { bg: '#E40000', white: true },
  deutschebank: { bg: '#0018A8', white: true },
  mars: { bg: '#0000A0', white: true },
};

const WHITE: BrandTile = { bg: '#FFFFFF' };

/** The tile for a logo file ('/logos/zomato.svg' → Zomato's red, the mark white). */
export function brandTile(src: string): BrandTile & { src: string } {
  // a file already made for its ground ('flipkart-white.svg') is still that brand's
  const key = src.split('/').pop()!.replace(/\.(svg|png|jpg|webp)$/, '').replace(/-white$/, '');
  const t = brandTiles[key] ?? WHITE;
  return { ...t, src: t.src ?? src };
}
