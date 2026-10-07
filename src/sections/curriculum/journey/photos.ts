/**
 * Placeholder photography from Unsplash (Unsplash License). Photos with people
 * show Indian students and professionals (asked 2026-09-28). for the year
 * visual slot and flagship cards, until Design supplies art ([CONFIRM] §10.10).
 * Each id was opened and checked. The year visuals get busier year by year:
 * one laptop → a team shipping → a data system → a startup floor (§5.1).
 */
export const PHOTOS: Record<string, { id?: string; src?: string; alt: string }> = {
  // SSB term cards: real Scaler School of Business photos (students, campus), taken from the SSB
  // concept site's campus gallery (ssb-school-concept.vercel.app) and cropped to 4:3 (2026-10-05);
  // files in versions/v1/assets/ssb-terms, served from /ssb-terms
  // the team's illustration (2026-10-07): frosted green building blocks, in place of the selling-challenge photo (term1.webp)
  ssbT1: { src: '/ssb-terms/term1-blocks.webp', alt: 'Frosted green building blocks stacked on a soft green ground' },
  // the team's illustration (2026-10-07): a frosted blue tile with a path to a spark, in place of the campus photo (term2.webp)
  ssbT2: { src: '/ssb-terms/term2-path.webp', alt: 'A frosted blue tile marked with a path of dots leading to a spark' },
  // the team's illustration (2026-10-07): a frosted violet briefcase with a check, in place of the campus photo (term3.webp)
  ssbT3: { src: '/ssb-terms/term3-briefcase.webp', alt: 'A frosted violet briefcase marked with a check' },
  // the team's illustration (2026-10-07): a frosted green magnifier over a spark, in place of the campus photo (term4.webp)
  ssbT4: { src: '/ssb-terms/term4-search.webp', alt: 'A frosted green magnifying glass over a spark' },
  // the team's illustration (2026-10-07): frosted blue bars rising under an arrow, in place of the cohort photo (term5.webp)
  ssbT5: { src: '/ssb-terms/term5-growth.webp', alt: 'Frosted blue bars rising under an upward arrow' },
  ssbMentor: { src: 'https://ssb-school-concept.vercel.app/assets/curriculum.webp', alt: 'A mentor working through a problem with students at their laptops' },
  y1: { id: '1517694712202-14dd9538aa97', alt: 'A laptop showing code on a white desk' },
  y2: { id: '1733826544839-2282050204e6', alt: 'Indian students working together on a laptop' },
  y3: { id: '1551288049-bebda4e38f71', alt: 'An analytics dashboard with charts on a laptop screen' },
  y4: { id: '1734519232240-340da8531f3e', alt: 'An Indian startup team working together in their office' },
  y1Flagship: { id: '1659356874404-934e567df530', alt: 'Two Indian students celebrating a win on a laptop' },
  y2Flagship: { id: '1738168913046-7b8a9577ed64', alt: 'Indian students at a startup event' },
  y3Flagship: { id: '1686624386665-4cd01b96d0f6', alt: 'Two Indian engineers working through a problem together' },
  // the fork after Year 4 (§3.3)
  fFounder: { id: '1551731409-43eb3e517a1a', alt: 'A young Indian founder presenting to a room' },
  fPlacement: { id: '1762504381997-3ddd51f135b8', alt: 'Two Indian professionals meeting in an office' },
  // one per listed project (portfolio + What you build). Each id was loaded and checked.
  pGame: { id: '1493711662062-fa541adb3fc8', alt: 'Two hands holding game controllers in front of a screen' },
  pCreator: { id: '1558618666-fcd25c85cd64', alt: 'A person filming with a camera' },
  pEditor: { id: '1558655146-9f40138edfeb', alt: 'A designer working on a tablet with a stylus' },
  pPortfolio: { id: '1580894894513-541e068a3e2b', alt: 'An overhead view of a desk with a monitor and laptop' },
  pSchema: { id: '1558494949-ef010cbdcc31', alt: 'Rows of servers in a data centre' },
  pFitness: { id: '1551650975-87deedd944c3', alt: 'A hand holding a phone showing an app with charts' },
  pHackathon: { id: '1758270705290-62b6294dd044', alt: 'Students gathered around a laptop at a hackathon' },
  pIpl: { id: '1540747913346-19e32dc3e97e', alt: 'A floodlit cricket stadium at night' },
  pSplit: { id: '1554224155-6726b3ff858f', alt: 'Receipts and a calculator on a table' },
  pCargo: { id: '1494412574643-ff11b0a5c1c3', alt: 'A container port with stacked shipping containers' },
  pSocial: { id: '1586953208448-b95a79798f07', alt: 'A phone showing a feed of photos' },
  pRouting: { id: '1524661135-423995f22d0b', alt: 'A paper map of the world' },
  pBuilder: { id: '1633356122544-f134324a6cee', alt: 'Code open in an editor on a screen' },
  pGtm: { id: '1761957375235-46acb4862151', alt: 'An Indian team discussing a plan together' },
  pAnswer: { id: '1677442136019-21780ecad995', alt: 'The letters AI in blue on a dark surface' },
  pAssistant: { id: '1485827404703-89b55fcc595e', alt: 'A small white humanoid robot' },
  pSupport: { id: '1637589308599-3478cc55510d', alt: 'An Indian man working on a laptop' },
  pAgents: { id: '1581091226825-a6a2a5aee158', alt: 'An engineer working with automated machinery in a lab' },
  pNews: { id: '1495020689067-958852a7765e', alt: 'A person reading a newspaper' },
  pLanguage: { id: '1456513080510-7bf3a84b82f8', alt: 'Open books on a table' },
  pRecs: { id: '1545235617-9465d2a55698', alt: 'A phone and a laptop showing rows of image cards' },
  pSummary: { id: '1504711434969-e33886168f5c', alt: 'A stack of folded newspapers' },
};

export function photoSrc(key: string, w: number, h: number) {
  const p = PHOTOS[key];
  if (!p) return '';
  // a direct image (the SSB site's own): one file, cropped by the frame (object-fit)
  if (p.src) return p.src;
  return `https://images.unsplash.com/photo-${p.id}?auto=format&fit=crop&w=${w}&h=${h}&q=72`;
}
export function photoSet(key: string, w: number, h: number) {
  if (PHOTOS[key]?.src) return undefined;
  return [0.5, 1, 2].map((k) => `${photoSrc(key, Math.round(w * k), Math.round(h * k))} ${Math.round(w * k)}w`).join(', ');
}
