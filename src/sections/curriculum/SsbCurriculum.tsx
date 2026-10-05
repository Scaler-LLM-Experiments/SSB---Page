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
  sheetTrigger: 'hover',
  aiLayout: 'stack',
} as const;

/**
 * The home page shows the curriculum in two parts, with the faculty between them:
 *   ai    the 150-hour AI curriculum, then Learn by doing (the challenge videos)
 *   main  the curriculum itself (the terms), ending with career prep
 * Every block is listed so `normalize` adds none back; only the part's own are on.
 */
const ON: Record<'ai' | 'main', BlockId[]> = { ai: ['ai', 'learn'], main: ['frame', 'journey', 'fork', 'portfolio', 'career', 'fine'] };
const ORDER: BlockId[] = ['frame', 'journey', 'fork', 'portfolio', 'career', 'fine', 'ai', 'learn'];
const cfgFor = (part: 'ai' | 'main') => normalize({ ...base, blocks: ORDER.map((id) => ({ id, on: ON[part].includes(id) })) });
const CFG = { ai: cfgFor('ai'), main: cfgFor('main') };

export default function SsbCurriculum({ part = 'main' }: { part?: 'ai' | 'main' }) {
  return (
    <div className="pv-page pv-home">
      <CurriculumJourney config={CFG[part]} />
    </div>
  );
}
