'use client';

import * as React from 'react';
import { ArrowRight } from '@phosphor-icons/react';

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
export function RowJourney({ j, width, portal }: { j: Journey; width: number; portal?: HTMLElement | null }) {
  const years = j.years;
  const rowRef = React.useRef<HTMLUListElement>(null);
  const { open, setOpen, close } = useOpenYear(null);

  return (
    <div className="tr">
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
                  {short ? <span className="tr-date">{short}</span> : null}
                </div>
                <div className="tr-body">
                  <p className="tr-k">Term {String(y.year).padStart(2, '0')}</p>
                  <h3 className="tr-title">{y.name}</h3>
                  <p className="tr-sum">{y.summary ?? y.description}</p>
                  {flagship ? (
                    <div className="tr-flag">
                      <p className="tr-flag-k">Flagship project</p>
                      <p className="tr-flag-t">{flagship.video ?? flagship.title}</p>
                    </div>
                  ) : null}
                  <TermCounts y={y} className="tr-counts" />
                  <button type="button" className="tr-more" onClick={() => setOpen(y.year)}>
                    See every course
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
      />
    </div>
  );
}
