'use client';

import * as React from 'react';
import { ArrowLeft, ArrowRight, BookOpenText, Briefcase, ChalkboardTeacher, Play } from '@phosphor-icons/react';
import {
  BottomSheet,
  BottomSheetBody,
  BottomSheetContent,
  BottomSheetDescription,
  BottomSheetHeader,
  BottomSheetTitle,
  SideDrawer,
  SideDrawerBody,
  SideDrawerContent,
  SideDrawerDescription,
  SideDrawerHeader,
  SideDrawerTitle,
} from '@kishanscaler/ssx-ui';

import type { Lane, Year } from '../data';
import { countSkills, fmt } from '../data';
import { useLabels } from '../parts';
import { photoSrc } from '../photos';
import './stage-sheet.css';

/**
 * A term's counts (courses, live projects, masterclasses), each with a quiet icon beside its name,
 * in three even columns split by hairlines (2026-10-23, the team's ask: spaced out, subtle icons).
 * The stage's open card and the term sheet share it.
 */
export function TermCounts({ y, className }: { y: Year; className?: string }) {
  const counts = [
    { n: countSkills(y), one: 'course', many: 'courses', Icon: BookOpenText },
    { n: y.projects.length, one: 'live project', many: 'live projects', Icon: Briefcase },
    { n: y.workshops?.length ?? 0, one: 'masterclass', many: 'masterclasses', Icon: ChalkboardTeacher },
  ].filter((c) => c.n);
  return (
    <dl className={['tc', className].filter(Boolean).join(' ')}>
      {counts.map(({ n, one, many, Icon }) => (
        <div key={one} className="tc-item">
          <dt className="tc-name">
            <Icon aria-hidden="true" className="tc-icon" />
            {n === 1 ? one : many}
          </dt>
          <dd className="tc-n">{n}</dd>
        </div>
      ))}
    </dl>
  );
}

const LANES: Lane[] = ['tech', 'business', 'shared'];

/**
 * The term sheet behind "See every course" (2026-10-23, the team's ask: the concept site's term sheet,
 * kept a side drawer on desktop and a bottom sheet on phones). Top to bottom: "In class" as plain
 * numbered lists under a hairline
 * per group (the courses by lane, then the masterclasses); "Out of class" as rows, a thumbnail and the
 * challenge, split by hairlines; the previous and next terms as quiet text links at the foot.
 */
export function StageSheet({
  years,
  open,
  mode,
  portal,
  onSelect,
  onClose,
}: {
  years: Year[];
  open: number | null;
  mode: 'sheet' | 'drawer';
  portal?: HTMLElement | null;
  onSelect: (year: number) => void;
  onClose: () => void;
}) {
  const L = useLabels();
  const i = years.findIndex((y) => y.year === open);
  const y = i >= 0 ? years[i] : null;
  const label = y ? fmt(L.yearLabel, y.year) : '';
  const bodyRef = React.useRef<HTMLDivElement>(null);
  // a new term from the pager starts at its top
  React.useEffect(() => {
    bodyRef.current?.closest('[data-slot$="body"], .overflow-y-auto')?.scrollTo({ top: 0 });
  }, [open]);

  const body = y ? <SheetBody ref={bodyRef} y={y} prev={years[i - 1]} next={years[i + 1]} onSelect={onSelect} /> : null;

  if (mode === 'sheet')
    return (
      <BottomSheet open={!!y} onOpenChange={(o) => !o && onClose()}>
        {y ? (
          <BottomSheetContent className="ss-panel" container={portal ?? undefined}>
            <BottomSheetHeader eyebrow={label} closeLabel={fmt(L.close, label)}>
              <BottomSheetTitle>{y.name}</BottomSheetTitle>
              <BottomSheetDescription>{y.ship}</BottomSheetDescription>
            </BottomSheetHeader>
            <BottomSheetBody>{body}</BottomSheetBody>
          </BottomSheetContent>
        ) : null}
      </BottomSheet>
    );
  return (
    <SideDrawer open={!!y} onOpenChange={(o) => !o && onClose()}>
      {y ? (
        <SideDrawerContent size="wide" className="ss-panel" container={portal ?? undefined}>
          <SideDrawerHeader eyebrow={label} closeLabel={fmt(L.close, label)}>
            <SideDrawerTitle>{y.name}</SideDrawerTitle>
            <SideDrawerDescription>{y.ship}</SideDrawerDescription>
          </SideDrawerHeader>
          <SideDrawerBody>{body}</SideDrawerBody>
        </SideDrawerContent>
      ) : null}
    </SideDrawer>
  );
}

const SheetBody = React.forwardRef<
  HTMLDivElement,
  {
    y: Year;
    prev?: Year;
    next?: Year;
    onSelect: (year: number) => void;
  }
>(function SheetBody({ y, prev, next, onSelect }, ref) {
  const L = useLabels();
  const laneName: Record<Lane, string> = { tech: L.laneTech ?? 'Data, Tech & AI', business: L.laneBusiness ?? 'Business', shared: L.laneShared ?? 'Across both' };
  const groups = [
    ...LANES.filter((l) => y.skills?.[l].length).map((l) => ({ name: laneName[l], items: y.skills![l] })),
    ...(y.workshops?.length ? [{ name: L.workshops ?? 'Masterclasses & workshops', items: y.workshops }] : []),
  ];
  return (
    <div ref={ref} className="ss">
      {/* the photo, counts, line and outcome came off (2026-10-23, the team's call: the card already shows them) */}
      {groups.length ? (
        <section aria-label={`${L.learn} · ${fmt(L.yearLabel, y.year)}`}>
          <h4 className="ss-h">{L.learn}</h4>
          <div className="ss-cols">
            {groups.map((g) => (
              <div key={g.name} className="ss-col">
                <p className="ss-col-name">
                  {g.name} <span>{g.items.length}</span>
                </p>
                <ol>
                  {g.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {y.projects.length ? (
        <section aria-label={`${L.build} · ${fmt(L.yearLabel, y.year)}`}>
          <h4 className="ss-h">{L.build}</h4>
          <ul className="ss-outs">
            {y.projects.map((p) => (
              <li key={p.title} className="ss-out">
                <span className="ss-thumb">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {p.image ? <img src={photoSrc(p.image, 320, 200)} alt="" loading="lazy" /> : null}
                  {p.video ? (
                    <span className="ss-play" aria-hidden="true">
                      <Play weight="fill" />
                    </span>
                  ) : null}
                </span>
                <div>
                  {p.flagship ? <span className="ss-flag">Flagship</span> : null}
                  <h5>
                    {p.video ? <span className="sj-visually-hidden">{L.watch}: </span> : null}
                    {p.video ?? p.title}
                  </h5>
                  {p.desc ? <p>{p.desc}</p> : null}
                </div>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {prev || next ? (
        <nav className="ss-pager" aria-label="Other terms">
          {prev ? (
            <button type="button" onClick={() => onSelect(prev.year)}>
              <small>
                <ArrowLeft aria-hidden="true" /> {fmt(L.yearLabel, prev.year)}
              </small>
              {prev.name}
            </button>
          ) : (
            <span />
          )}
          {next ? (
            <button type="button" className="ss-next" onClick={() => onSelect(next.year)}>
              <small>
                {fmt(L.yearLabel, next.year)} <ArrowRight aria-hidden="true" />
              </small>
              {next.name}
            </button>
          ) : null}
        </nav>
      ) : null}
    </div>
  );
});
