'use client';

import * as React from 'react';
import {
  ArrowRight,
  Brain,
  Calculator,
  ChartLineUp,
  ChatsCircle,
  ClipboardText,
  Database,
  FileText,
  Kanban,
  Lightbulb,
  LinkedinLogo,
  MagnifyingGlass,
  MicrosoftExcelLogo,
  OpenAiLogo,
  PaintBrushBroad,
  PresentationChart,
  TrendUp,
  Truck,
  type Icon,
} from '@phosphor-icons/react';

import { ScrollDots } from '@/sections/shared/ScrollDots';

import type { Journey } from '../data';
import { useOpenYear } from './shared';
import { StageSheet, TermCounts } from './stage-sheet';
import { MONTHS, PHOTO } from './stage';
import './row.css';

/**
 * The terms as one plain row of equal cards (2026-10-27, the user's ask: "simple scroll, not small and
 * big", premium, the page's type and spacing), in place of the /v4 stage (`StageJourney`, kept). Each
 * card: the term's photo with its months, then the term, its title, its line, its flagship project
 * under a hairline, its counts, and "See every course" (the term sheet, as the stage's). The row starts
 * on the page's content edge and runs off the right; scrolled by hand, a swipe, or the dots and arrows.
 */
/** `deck` (the final page, 2026-10-28, the user's ask): the card as the website deck has it, the term, its
 *  title and its line, then the link; no flagship or counts (not in the deck). */
export function RowJourney({ j, width, portal, deck = false }: { j: Journey; width: number; portal?: HTMLElement | null; deck?: boolean }) {
  const years = j.years;
  const rowRef = React.useRef<HTMLUListElement>(null);
  const { open, setOpen, close } = useOpenYear(null);

  return (
    <div className="tr" data-deck={deck || undefined}>
      <ul ref={rowRef} className="tr-row" aria-label="Programme terms">
        {years.map((y, i) => {
          const flagship = y.projects.find((p) => p.flagship);
          const photo = PHOTO[y.year];
          const [, short] = MONTHS[y.year] ?? ['', ''];
          return (
            <li key={y.year}>
              <article className="tr-card">
                <div className="tr-photo">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {photo ? <img src={photo.src} alt="" loading={i < 3 ? 'eager' : 'lazy'} decoding="async" draggable={false} style={{ objectPosition: photo.pos }} /> : null}
                  {short && !deck ? <span className="tr-date">{short}</span> : null}
                </div>
                <div className="tr-body">
                  <p className="tr-k">Term {String(y.year).padStart(2, '0')}</p>
                  <h3 className="tr-title">{y.name}</h3>
                  <p className="tr-sum">{deck && y.deck ? y.deck.line : (y.summary ?? y.description)}</p>
                  {deck && y.deck ? <Workshops items={y.deck.workshops} /> : null}
                  {flagship && !deck ? (
                    <div className="tr-flag">
                      <p className="tr-flag-k">Flagship project</p>
                      <p className="tr-flag-t">{flagship.video ?? flagship.title}</p>
                    </div>
                  ) : null}
                  {deck ? null : <TermCounts y={y} className="tr-counts" />}
                  <button type="button" className="tr-more" onClick={() => setOpen(y.year)}>
                    {deck ? 'See the full term' : 'See every course'}
                    <ArrowRight weight="bold" aria-hidden="true" />
                  </button>
                </div>
              </article>
            </li>
          );
        })}
      </ul>
      <div className="tr-dots">
        <ScrollDots scroller={rowRef} count={years.length} itemName="term" fill="solid" autoplay={false} />
      </div>

      {/* the term sheet behind "See every course", as the stage's (a side drawer, a bottom sheet on phones) */}
      <StageSheet
        years={years}
        open={open}
        mode={width > 0 && width < 768 ? 'sheet' : 'drawer'}
        portal={portal}
        onSelect={(n) => setOpen(n)}
        onClose={close}
        deck={deck}
      />
    </div>
  );
}

/** A masterclass's mark: the tool's own logo in its colour where it has one (Excel, LinkedIn, ChatGPT,
 *  Canva, Mixpanel), else an icon for what it teaches, in the brand green. Matched on its name. */
const MARKS: [RegExp, Icon, string?][] = [
  [/excel/i, MicrosoftExcelLogo, '#217346'],
  [/linkedin/i, LinkedinLogo, '#0a66c2'],
  [/chatbot/i, OpenAiLogo, 'currentColor'],
  [/canva/i, PaintBrushBroad, '#00a3b4'],
  [/mixpanel/i, ChartLineUp, '#7856ff'],
  [/sql/i, Database],
  [/asana|jira|notion|project management/i, Kanban],
  [/decks/i, PresentationChart],
  [/design thinking/i, Lightbulb],
  [/structured thinking/i, Brain],
  [/resume/i, FileText],
  [/assignment/i, ClipboardText],
  [/interview/i, ChatsCircle],
  [/case|guesstimate/i, Calculator],
  [/supply chain|beer game/i, Truck],
  [/trading/i, TrendUp],
  [/screener|fundamental/i, MagnifyingGlass],
];

/**
 * The term's masterclasses and workshops on its card (the final page, 2026-10-28, the user's ask: the
 * space between the line and the button), each a small chip with its mark, under a quiet label.
 */
function Workshops({ items }: { items: string[] }) {
  // a ticker, as the AI journey's tools (2026-10-28, the user's ask): two identical halves, the loop
  // moving one; a short list repeats so a half always outruns the card
  const reps = Math.max(1, Math.ceil(6 / items.length));
  const set = (hidden?: boolean, key?: number) => (
    <ul key={key} className="tr-ws-list tr-ws-set" aria-hidden={hidden || undefined}>
      {items.map((w) => {
        const [, Mark, color] = MARKS.find(([re]) => re.test(w)) ?? [null, Lightbulb];
        return (
          <li key={w}>
            <Mark weight={color ? 'fill' : 'regular'} aria-hidden="true" style={color ? { color } : undefined} />
            {w}
          </li>
        );
      })}
    </ul>
  );
  return (
    <div className="tr-ws">
      <p className="tr-ws-k">Masterclasses &amp; workshops</p>
      <div className="sj-tools-marquee tr-ws-marquee" style={{ '--sj-tools-loop': `${Math.max(20, items.length * reps * 5)}s` } as React.CSSProperties}>
        <div className="sj-tools-track">{Array.from({ length: 2 * reps }, (_, i) => set(i > 0, i))}</div>
      </div>
    </div>
  );
}
