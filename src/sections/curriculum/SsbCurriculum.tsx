'use client';
/**
 * The curriculum as sections of the home page: five terms, career prep, the AI
 * journey and learn by doing. The same settings as the curriculum page
 * built in the curriculum lab, without a navbar and footer: the home page has its own.
 */
import * as React from 'react';
import { CurriculumJourney } from './journey/CurriculumJourney';
import { DEFAULT_CONFIG, normalize, type BlockId } from './journey/config';
import { LAB_SETTINGS } from './lab-settings';
import './curriculum-page.css';

const base = {
  ...DEFAULT_CONFIG,
  ...LAB_SETTINGS,
  concept: 'stack',
  brand: 'ssb',
  theme: 'light',
  radius: 1,
  stackOpen: 'sheet',
  sheetTrigger: 'click',
  aiLayout: 'stack',
} as const;

/**
 * The home page shows the curriculum in three parts, with other sections between them:
 *   learn  Learn by doing (the challenge videos)
 *   ai     the 150-hour AI curriculum
 *   main   the curriculum itself (the terms), ending with career prep and its stats
 * Every block is listed so `normalize` adds none back; only the part's own are on.
 */
// (`terms` and `career` are `main` in two: the home page sets career prep in the curriculum rail)
type Part = 'learn' | 'ai' | 'main' | 'terms' | 'career';
const ON: Record<Part, BlockId[]> = {
  learn: ['learn'],
  ai: ['ai'],
  main: ['frame', 'journey', 'fork', 'portfolio', 'career', 'fine'],
  terms: ['frame', 'journey', 'fork', 'portfolio', 'fine'],
  career: ['career'],
};
const ORDER: BlockId[] = ['frame', 'journey', 'fork', 'portfolio', 'career', 'fine', 'ai', 'learn'];
const cfgFor = (part: Part) => normalize({ ...base, blocks: ORDER.map((id) => ({ id, on: ON[part].includes(id) })) });
const CFG = { learn: cfgFor('learn'), ai: cfgFor('ai'), main: cfgFor('main'), terms: cfgFor('terms'), career: cfgFor('career') };

export default function SsbCurriculum({ part = 'main', termsStack = false, termsVersion, aiCarousel = false }: { part?: Part; /** the terms as stacking cards at every width (/v2-stack) */ termsStack?: boolean; /** a fixed version, no switch (/v2 uses v3, the team's pick of 2026-10-09) */ termsVersion?: 1 | 2 | 3; /** the AI journey as the experiment's carousel of cards (/v2 since 2026-10-09) */ aiCarousel?: boolean }) {
  // /v2-stack: the terms stack, and the AI journey runs as a carousel of cards instead (2026-10-08)
  // /v2-stack's versions: v1 In class in columns, v2 as an accordion, v3 a short card with In class and
  // Out of class in a no-scroll sheet (?v=2, ?v=3; ?inclass=accordion is v2 too)
  const [version, setVersion] = React.useState<1 | 2 | 3>(termsVersion ?? 1);
  React.useEffect(() => {
    if (!termsStack || termsVersion) return;
    const q = new URLSearchParams(window.location.search);
    const v = q.get('v');
    setVersion(v === '3' ? 3 : v === '2' || q.get('inclass') === 'accordion' ? 2 : 1);
  }, [termsStack, termsVersion]);
  const pick = (v: 1 | 2 | 3) => {
    setVersion(v);
    const u = new URL(window.location.href);
    u.searchParams.delete('inclass');
    if (v === 1) u.searchParams.delete('v');
    else u.searchParams.set('v', String(v));
    window.history.replaceState(null, '', u);
  };
  const config = React.useMemo(
    () =>
      aiCarousel && !termsStack
        ? { ...CFG[part], termsStack: true, aiLayout: 'carousel' as const }
        : termsStack
        ? { ...CFG[part], termsStack: true, ...(termsVersion ? {} : { aiLayout: 'carousel' as const }), inClassAccordion: version === 2, termsSheet: version === 3 }
        : CFG[part],
    [part, termsStack, version, aiCarousel],
  );
  return (
    <div className="pv-page pv-home" data-terms-stack={termsStack || undefined}>
      {termsStack && part === 'terms' && !termsVersion ? (
        <div className="cs-variant" role="group" aria-label="Term card version">
          <span>Terms</span>
          <button type="button" aria-pressed={version === 1} onClick={() => pick(1)}>
            v1 · Columns
          </button>
          <button type="button" aria-pressed={version === 2} onClick={() => pick(2)}>
            v2 · Accordion
          </button>
          <button type="button" aria-pressed={version === 3} onClick={() => pick(3)}>
            v3 · Card + sheet
          </button>
        </div>
      ) : null}
      <CurriculumJourney config={config} />
    </div>
  );
}
