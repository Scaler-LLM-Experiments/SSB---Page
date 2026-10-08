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

export default function SsbCurriculum({ part = 'main', termsStack = false }: { part?: Part; /** the terms as stacking cards at every width (/v2-stack) */ termsStack?: boolean }) {
  // /v2-stack: the terms stack, and the AI journey runs as a carousel of cards instead (2026-10-08)
  // /v2-stack's two versions of In class: columns (v1) or an accordion (v2), switched with ?inclass=accordion
  const [accordion, setAccordion] = React.useState(false);
  React.useEffect(() => {
    if (termsStack) setAccordion(new URLSearchParams(window.location.search).get('inclass') === 'accordion');
  }, [termsStack]);
  const pick = (on: boolean) => {
    setAccordion(on);
    const u = new URL(window.location.href);
    if (on) u.searchParams.set('inclass', 'accordion');
    else u.searchParams.delete('inclass');
    window.history.replaceState(null, '', u);
  };
  const config = React.useMemo(
    () => (termsStack ? { ...CFG[part], termsStack: true, aiLayout: 'carousel' as const, inClassAccordion: accordion } : CFG[part]),
    [part, termsStack, accordion],
  );
  return (
    <div className="pv-page pv-home" data-terms-stack={termsStack || undefined}>
      {termsStack && part === 'terms' ? (
        <div className="cs-variant" role="group" aria-label="In class layout">
          <span>In class</span>
          <button type="button" aria-pressed={!accordion} onClick={() => pick(false)}>
            v1 · Columns
          </button>
          <button type="button" aria-pressed={accordion} onClick={() => pick(true)}>
            v2 · Accordion
          </button>
        </div>
      ) : null}
      <CurriculumJourney config={config} />
    </div>
  );
}
