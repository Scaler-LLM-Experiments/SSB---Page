'use client';

import * as React from 'react';
import {
  Button,
  Container,
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Heading,
  Section,
  Text,
} from '@kishanscaler/ssx-ui';
import { ArrowRight, Plus } from '@phosphor-icons/react';

import { admissionsV4 as defaultContent } from '@/content/admissions';
import { useSectionEntrance } from '@/sections/faculty/useSectionEntrance';
import { Title } from '@/sections/shared/Title';
import './admissions-v4.css';

/**
 * Admissions, fees and eligibility (the concept site's /v4 section, 2026-10-23; the team's pick), on
 * the light page. Left, held in view while the right scrolls: the title, eligibility, apply and talk
 * to an advisor. Right: the process (five numbered steps and the fast track) and the fee table, the
 * open intake marked and the closed ones struck (worked out from today). Then the scholarships:
 * four cards, each opening its criteria in the design system's Dialog; and the Impact Foundation's
 * backers' faces. Cards 8px, controls 4px, the page's type.
 */
/** What the section shows; the home page's is `admissionsV4`. `steps` and `fastTrack` are optional (no
 *  process card without them); `eligibility` may be a list, under `eligibilityTitle`. */
export type AdmissionsContent = Omit<typeof defaultContent, 'steps' | 'fastTrack' | 'eligibility'> & {
  steps?: string[];
  fastTrack?: string;
  eligibility: string | string[];
  eligibilityTitle?: string;
  /** a section header over the scholarships panel (the admission page); its title as "Lead.|Tail." */
  /** a section header over the scholarships panel (the admission page); its title as "Lead.|Tail."; beside
   *  the fee table (`withFees`), its notes and action sit at its foot, level with the table's */
  scholarshipsHead?: { eyebrow?: string; title: string; sub?: string; notes?: string[]; cta?: { label: string; href: string } };
};

/** `backers={false}`: no Impact Foundation faces under the scholarships (the deck variant, /v7, gives the foundation its own section). */
/** `content` and `parts` (the admission page, 2026-11-11): another page's copy, and the section in two
 *  (`top`: the header, the note card and the fee table; `scholarships`: the scholarships panel alone,
 *  as its own section, `id="scholarships"`), so a page can set other sections between them. */
/** `withFees` (the admission page, 2026-11-11): the programme fee table at the right of the scholarships'
 *  header, the scholarships panel under both. */
export function AdmissionsV4({
  backers = true,
  content: c = defaultContent,
  parts = 'all',
  withFees = false,
}: { backers?: boolean; content?: AdmissionsContent; parts?: 'all' | 'top' | 'scholarships'; withFees?: boolean } = {}) {
  const ref = React.useRef<HTMLElement>(null);
  const [open, setOpen] = React.useState<number | null>(null);
  useSectionEntrance(ref, { decks: ['.ad4-card', '.ad4-sc'] });
  const top = parts !== 'scholarships';
  const sch = parts !== 'top';

  // today's intake: the first whose last date is still to come (before hydration, none is marked)
  const [today, setToday] = React.useState<number | null>(null);
  React.useEffect(() => setToday(Date.now()), []);
  const nowIdx = today === null ? -1 : c.intakes.findIndex((x) => new Date(`${x.by}T23:59:59+05:30`).getTime() >= today);

  const picked = open === null ? null : c.scholarships[open];
  // the note card (eligibility on the home page): at the left under the header, or, with no process
  // card to fill the right column, at the right under the fee table
  const noteRight = !c.steps?.length;
  const note = (
    <div className="ad4-card ad4-elig" data-enter="sub">
      <h3>{c.eligibilityTitle ?? 'Eligibility'}</h3>
      {Array.isArray(c.eligibility) ? (
        <ul className="ad4-dlg-list ad4-elig-list">
          {c.eligibility.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ul>
      ) : (
        <p>{c.eligibility}</p>
      )}
    </div>
  );

  // the scholarships' own header (the admission page)
  const schIntro = c.scholarshipsHead ? (
    <div className="ad4-sch-intro" data-enter="header">
      {c.scholarshipsHead.eyebrow ? (
        <Heading as="p" size="eyebrow" className="text-content-brand" data-enter="eyebrow">
          {c.scholarshipsHead.eyebrow}
        </Heading>
      ) : null}
      <Heading as="h2" size="display" id="ad4-sch-title" data-enter="headline">
        <Title text={c.scholarshipsHead.title} />
      </Heading>
      {c.scholarshipsHead.sub ? (
        <Text size="lg" tone="secondary" data-enter="sub">
          {c.scholarshipsHead.sub}
        </Text>
      ) : null}
      {withFees && (c.scholarshipsHead.notes?.length || c.scholarshipsHead.cta) ? (
        <div className="ad4-sch-foot" data-enter="sub">
          {c.scholarshipsHead.notes?.length ? (
            <ul className="ad4-sch-notes">
              {c.scholarshipsHead.notes.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
          ) : null}
          {c.scholarshipsHead.cta ? (
            <Button asChild size="lg" className="ad4-sch-cta">
              <a href={c.scholarshipsHead.cta.href}>
                {c.scholarshipsHead.cta.label}
                <ArrowRight weight="bold" aria-hidden="true" />
              </a>
            </Button>
          ) : null}
        </div>
      ) : null}
    </div>
  ) : null;

  // the programme fee table: at the right of the top part, or beside the scholarships' header (`withFees`)
  const feeCard = (
    <div className="ad4-card ad4-fees">
      <div className="ad4-card-h" data-part="title">
        <h3>Programme fee</h3>
        {nowIdx >= 0 ? (
          <span className="ad4-live">
            <span className="ad4-dot" aria-hidden="true" />
            {c.intakes[nowIdx].name} open
          </span>
        ) : null}
      </div>
      <div className="ad4-table" role="table" aria-label="Intakes and fees" data-part="description">
        <div className="ad4-tr ad4-th" role="row">
          <span role="columnheader">Intake</span>
          <span role="columnheader">Apply by</span>
          <span role="columnheader">Course fee</span>
        </div>
        {c.intakes.map((x, i) => {
          const past = nowIdx >= 0 && i < nowIdx;
          return (
            <div key={x.name} className="ad4-tr" role="row" data-past={past || undefined} data-now={i === nowIdx || undefined}>
              <span role="cell">{x.name}</span>
              <span role="cell">
                <time dateTime={x.by}>{x.byLabel}</time>
              </span>
              <span role="cell">
                <span className="ad4-fee">{x.fee}</span>
                {past ? <small>Closed</small> : null}
              </span>
            </div>
          );
        })}
      </div>
      {c.fine ? (
        <p className="ad4-fine" data-part="description">
          {c.fine}
        </p>
      ) : null}
    </div>
  );

  return (
    <Section
      ref={ref}
      id={top ? 'admissions' : 'scholarships'}
      density="roomy"
      aria-labelledby={top ? 'ad4-title' : 'ad4-sch-title'}
      className="ad4"
      data-parts={parts === 'all' ? undefined : parts}
    >
      <Container>
        {top ? (
        <div className="ad4-top">
          <div className="ad4-left" data-enter="header">
            <Heading as="p" size="eyebrow" className="text-content-brand" data-enter="eyebrow">
              {c.eyebrow}
            </Heading>
            <Heading as="h2" size="display" id="ad4-title" data-enter="headline" className="ad4-title">
              {c.title} <span>{c.titleTail}</span>
            </Heading>
            <p className="ad4-lede" data-enter="sub">
              {c.lede}
            </p>
            {noteRight ? null : note}
            <div className="ad4-ctas" data-enter="controls">
              <Button asChild size="lg">
                <a href={c.apply.href}>
                  {c.apply.label}
                  <ArrowRight weight="bold" aria-hidden="true" />
                </a>
              </Button>
              <a className="ad4-link" href={c.advisor.href}>
                {c.advisor.label}
                <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>

          <div className="ad4-right">
            {c.steps?.length ? (
            <div className="ad4-card ad4-proc">
              <h3 data-part="title">Admissions process</h3>
              <ol className="ad4-steps" data-part="description">
                {c.steps.map((s, i) => (
                  <li key={s}>
                    <span>{String(i + 1).padStart(2, '0')}</span>
                    {s}
                  </li>
                ))}
              </ol>
              {c.fastTrack ? (
                <p className="ad4-fast" data-part="description">
                  <b>Fast track</b>
                  {c.fastTrack}
                </p>
              ) : null}
            </div>
            ) : null}

            {feeCard}
            {noteRight ? note : null}
          </div>
        </div>
        ) : null}

        {/* the header; with `withFees`, the header at the left and the fee table at the right, the
            scholarships under them */}
        {sch && c.scholarshipsHead ? (
          withFees ? (
            <div className="ad4-sch-top">
              {schIntro}
              <div className="ad4-sch-fees">{feeCard}</div>
            </div>
          ) : (
            schIntro
          )
        ) : null}
        {/* the scholarships: a tinted panel, four cards that each open their criteria, the backers */}
        {sch ? (
        <div className="ad4-sch">
          <div className="ad4-sch-head">
            {top || c.scholarshipsHead ? (
              <h3 className="ad4-sch-title">{c.scholarshipsTitle}</h3>
            ) : (
              <h2 className="ad4-sch-title" id="ad4-sch-title">
                {c.scholarshipsTitle}
              </h2>
            )}
            <p>{c.scholarshipsText}</p>
          </div>
          <div className="ad4-sch-grid">
            {c.scholarships.map((s, i) => (
              <button key={s.t} type="button" className="ad4-sc" onClick={() => setOpen(i)} aria-haspopup="dialog">
                <span className="ad4-sc-k" data-part="title">{s.k}</span>
                <span className="ad4-sc-t" data-part="title">{s.t}</span>
                <span className="ad4-sc-p" aria-hidden="true">
                  <Plus weight="bold" />
                </span>
              </button>
            ))}
          </div>
          {backers ? (
          <div className="ad4-backers">
            <p className="ad4-backers-k">{c.backersLabel}</p>
            <ul className="ad4-faces">
              {c.backers.map((b) => (
                <li key={b.name}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={b.image} alt="" width={640} height={800} loading="lazy" decoding="async" />
                  <span>
                    <b>{b.name}</b>
                    {b.role}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          ) : null}
        </div>
        ) : null}
      </Container>

      {/* portalled to <body>, outside the page's light <main>: the panel pinned light, or an OS in dark mode turns it dark */}
      <Dialog open={open !== null} onOpenChange={(o) => !o && setOpen(null)}>
        {picked ? (
          <DialogContent data-brand="ssb" data-theme="light">
            <DialogHeader>
              <p className="ad4-dlg-k">{picked.k}</p>
              <DialogTitle>{picked.full}</DialogTitle>
              <DialogDescription>{picked.lede}</DialogDescription>
            </DialogHeader>
            <DialogBody>
              <p className="ad4-dlg-h">Eligibility Criteria</p>
              <ul className="ad4-dlg-list">
                {picked.c.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
              <p className="ad4-dlg-note">Applying early significantly enhances the chances of receiving a scholarship.</p>
            </DialogBody>
            <DialogFooter>
              <Button variant="secondary" onClick={() => setOpen(null)}>
                Close
              </Button>
              <Button asChild>
                <a href={c.apply.href}>
                  {c.apply.label}
                  <ArrowRight weight="bold" aria-hidden="true" />
                </a>
              </Button>
            </DialogFooter>
          </DialogContent>
        ) : null}
      </Dialog>
    </Section>
  );
}
