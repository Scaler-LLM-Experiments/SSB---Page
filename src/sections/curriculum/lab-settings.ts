/**
 * The curriculum settings the page is shown with: the curriculum lab's saved state
 * (2026-09-30). SsbCurriculum still overrides radius, open style, sheet trigger and AI layout.
 */
import type { JourneyConfig } from './journey/config';

export const LAB_SETTINGS: Partial<JourneyConfig> = {
  brand: 'ssb', theme: 'light', radius: 0.25, density: 1.15, businessTone: 'yellowSubtle', badgeSize: 'md',
  eyebrowMono: true, laneIcons: true, expandGlyph: 'plus', visualRatio: '16:10', outcomeStyle: 'tint',
  flagshipStyle: 'media', projectStyle: 'media', mediaRatio: '4:3', showYearChip: true, perkStyle: 'card',
  showVisual: true, showSummary: true, invertOpen: false, rowLayout: 'stacked', pathStyle: 'card',
  forkStyle: 'transform', forkScrim: 0.65, spine: 'row', openDesktop: 'inline', openMobile: 'sheet',
  projectLimit: 6, threadsLimit: 2, showFacts: false, portfolioStyle: 'carousel', carouselSpeed: 5,
  portfolioLimit: 8, concept: 'stack', artifactStyle: 'filled', explode: 1, stackFan: 4, view: 'by-year',
  blockGap: 48, maxWidth: 1280, industryCompulsory: true, y1Alt: false, fixPersonas: false, empty: 'none',
  braidLine: 'smooth', braidKnots: 'flagship', braidGap: 22,
} as Partial<JourneyConfig>;
