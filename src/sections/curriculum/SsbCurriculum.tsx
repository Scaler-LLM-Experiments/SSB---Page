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
type Part = 'learn' | 'ai' | 'main';
const ON: Record<Part, BlockId[]> = { learn: ['learn'], ai: ['ai'], main: ['frame', 'journey', 'fork', 'portfolio', 'career', 'fine'] };
const ORDER: BlockId[] = ['frame', 'journey', 'fork', 'portfolio', 'career', 'fine', 'ai', 'learn'];
const cfgFor = (part: Part) => normalize({ ...base, blocks: ORDER.map((id) => ({ id, on: ON[part].includes(id) })) });
const CFG = { learn: cfgFor('learn'), ai: cfgFor('ai'), main: cfgFor('main') };

export default function SsbCurriculum({ part = 'main' }: { part?: Part }) {
  return (
    <div className="pv-page pv-home">
      <CurriculumJourney config={CFG[part]} />
    </div>
  );
}
