'use client';

import * as React from 'react';
import { Button, Container, Section } from '@kishanscaler/ssx-ui';
import { DownloadSimple } from '@phosphor-icons/react';

import type { admissionFees } from '@/content/admission';
import { admissionsV4 } from '@/content/admissions';
import { Header } from '@/sections/deck/DeckSections';
import '@/sections/admissions/admissions-v4.css';
import './admission.css';

/**
 * "Important dates and fees" (2026-11-13, the user's asks: the main page's table, every intake, light
 * only). The page's section header at the left; at the right the main page's "Programme fee" card
 * (AdmissionsV4's fee table: the same intakes, markup and classes, admissions-v4.css), in its light
 * colours: the open intake on the brand tint with its bar and an "Open now" pill, the closed ones struck,
 * worked out from today after hydration as on the main page. Under it a small line with the brochure as
 * a tertiary link. Phones: the header over the table.
 */
export function AdmissionFees({ content: c }: { content: typeof admissionFees }) {
  const intakes = admissionsV4.intakes;
  // today's intake: the first whose last date is still to come (before hydration, none is marked)
  const [today, setToday] = React.useState<number | null>(null);
  React.useEffect(() => setToday(Date.now()), []);
  const nowIdx =
    today === null ? -1 : intakes.findIndex((x) => new Date(`${x.by}T23:59:59+05:30`).getTime() >= today);

  return (
    <Section id="fees" density="roomy" aria-labelledby="fees-title" className="adm-fees">
      <Container>
        <div className="adm-fees-grid">
          <Header id="fees" eyebrow={c.eyebrow} title={c.title} sub={c.sub} />
          <div className="adm-fees-col">
            <div className="ad4-card ad4-fees adm-fees-card">
              <div className="ad4-card-h">
                <h3>Programme fee</h3>
                {nowIdx >= 0 ? (
                  <span className="ad4-live">
                    <span className="ad4-dot" aria-hidden="true" />
                    {intakes[nowIdx].name} open
                  </span>
                ) : null}
              </div>
              <div className="ad4-table" role="table" aria-label="Intakes and fees">
                <div className="ad4-tr ad4-th" role="row">
                  <span role="columnheader">Intake</span>
                  <span role="columnheader">Apply by</span>
                  <span role="columnheader">Course fee</span>
                </div>
                {intakes.map((x, i) => {
                  const past = nowIdx >= 0 && i < nowIdx;
                  const now = i === nowIdx;
                  return (
                    <div key={x.name} className="ad4-tr" role="row" data-past={past || undefined} data-now={now || undefined}>
                      <span role="cell">
                        {x.name}
                        {now ? <em className="adm-fees-pill">Open now</em> : null}
                      </span>
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
              <p className="ad4-fine">{admissionsV4.fine}</p>
            </div>
            {/* the detailed fee structure: a small line under the table, the brochure as a tertiary link */}
            <p className="adm-fees-more">
              {c.brochure.lead}{' '}
              <Button asChild size="sm" variant="tertiary" className="adm-fees-link">
                <a href={c.brochure.cta.href}>
                  {c.brochure.cta.label}
                  <DownloadSimple weight="bold" aria-hidden="true" />
                </a>
              </Button>
            </p>
          </div>
        </div>
      </Container>
    </Section>
  );
}
