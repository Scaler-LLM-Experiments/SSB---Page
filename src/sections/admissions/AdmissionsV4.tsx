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
} from '@kishanscaler/ssx-ui';
import { ArrowRight, Plus } from '@phosphor-icons/react';

import { admissionsV4 as c } from '@/content/admissions';
import { useSectionEntrance } from '@/sections/faculty/useSectionEntrance';
import './admissions-v4.css';

/**
 * Admissions, fees and eligibility (the concept site's /v4 section, 2026-10-23; the team's pick), on
 * the light page. Left, held in view while the right scrolls: the title, eligibility, apply and talk
 * to an advisor. Right: the process (five numbered steps and the fast track) and the fee table, the
 * open intake marked and the closed ones struck (worked out from today). Then the scholarships:
 * four cards, each opening its criteria in the design system's Dialog; and the Impact Foundation's
 * backers' faces. Cards 8px, controls 4px, the page's type.
 */
/** `backers={false}`: no Impact Foundation faces under the scholarships (the deck variant, /v7, gives the foundation its own section). */
export function AdmissionsV4({ backers = true }: { backers?: boolean } = {}) {
  const ref = React.useRef<HTMLElement>(null);
  const [open, setOpen] = React.useState<number | null>(null);
  useSectionEntrance(ref, { decks: ['.ad4-card', '.ad4-sc'] });

  // today's intake: the first whose last date is still to come (before hydration, none is marked)
  const [today, setToday] = React.useState<number | null>(null);
  React.useEffect(() => setToday(Date.now()), []);
  const nowIdx = today === null ? -1 : c.intakes.findIndex((x) => new Date(`${x.by}T23:59:59+05:30`).getTime() >= today);

  const sch = open === null ? null : c.scholarships[open];

  return (
    <Section ref={ref} id="admissions" density="roomy" aria-labelledby="ad4-title" className="ad4">
      <Container>
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
            <div className="ad4-card ad4-elig" data-enter="sub">
              <h3>Eligibility</h3>
              <p>{c.eligibility}</p>
            </div>
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
              <p className="ad4-fast" data-part="description">
                <b>Fast track</b>
                {c.fastTrack}
              </p>
            </div>

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
              <p className="ad4-fine" data-part="description">
                {c.fine}
              </p>
            </div>
          </div>
        </div>

        {/* the scholarships: a tinted panel, four cards that each open their criteria, the backers */}
        <div className="ad4-sch">
          <div className="ad4-sch-head">
            <h3 className="ad4-sch-title">{c.scholarshipsTitle}</h3>
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
      </Container>

      {/* portalled to <body>, outside the page's light <main>: the panel pinned light, or an OS in dark mode turns it dark */}
      <Dialog open={open !== null} onOpenChange={(o) => !o && setOpen(null)}>
        {sch ? (
          <DialogContent data-brand="ssb" data-theme="light">
            <DialogHeader>
              <p className="ad4-dlg-k">{sch.k}</p>
              <DialogTitle>{sch.full}</DialogTitle>
              <DialogDescription>{sch.lede}</DialogDescription>
            </DialogHeader>
            <DialogBody>
              <p className="ad4-dlg-h">Who it is for</p>
              <ul className="ad4-dlg-list">
                {sch.c.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
              <p className="ad4-dlg-note">Decided after your interview. Apply early to be considered.</p>
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
