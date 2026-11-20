'use client';

import * as React from 'react';
import { Container, Heading, Section, Text } from '@kishanscaler/ssx-ui';

import { programWeek as w } from '@/content/program';
import { Title } from '@/sections/shared/Title';
import './program.css';

/**
 * A week in the life of an SSB student: the program page's timetable, redrawn in the SSB palette
 * (it was a neon picture). Desktop: one grid, the times down the left and the days across, each
 * block placed by its day and time rows (spanning where it runs on), coloured by kind with the
 * legend above. Phones: the week is too wide, so a row of day pills picks one day, shown as a list
 * of its times and blocks.
 */
export function ProgramWeek() {
  const [day, setDay] = React.useState(0);
  const dayBlocks = w.times
    .map((time, r) => ({
      time,
      block: w.blocks.find((b) => r >= b.r && r < b.r + (b.rs ?? 1) && day >= b.d && day < b.d + (b.ds ?? 1)),
      r,
    }))
    // a block spanning rows shows once, at its first row, with its whole time range
    .filter((x) => x.block && x.block.r === x.r)
    .map((x) => {
      const last = x.r + (x.block!.rs ?? 1) - 1;
      const time = last === x.r ? x.time : `${x.time.split('–')[0].trim()} – ${w.times[last].split('–')[1].trim()}`;
      return { time, block: x.block! };
    });

  return (
    <Section id="week" density="roomy" aria-labelledby="week-title" className="pgk">
      <Container>
        <div className="pg-head">
          <Heading as="p" size="eyebrow" className="text-content-brand">
            {w.eyebrow}
          </Heading>
          <Heading as="h2" size="display" id="week-title">
            <Title text={w.title} />
          </Heading>
          <Text size="lg" tone="secondary">
            {w.sub}
          </Text>
        </div>

        <ul className="pgk-legend" aria-label="Key">
          {w.legend.map((l) => (
            <li key={l.kind} data-kind={l.kind}>
              <span aria-hidden="true" />
              {l.label}
            </li>
          ))}
        </ul>

        {/* desktop and tablet: the whole week */}
        <div className="pgk-grid" role="table" aria-label="A typical week at SSB">
          <div className="pgk-corner" style={{ gridColumn: 1, gridRow: 1 }} role="columnheader">
            Time
          </div>
          {w.dayNames.map((d, i) => (
            <div key={d} className="pgk-day" style={{ gridColumn: i + 2, gridRow: 1 }} role="columnheader">
              {d}
            </div>
          ))}
          {w.times.map((t, r) => (
            <div key={t} className="pgk-time" style={{ gridColumn: 1, gridRow: r + 2 }} role="rowheader">
              {t}
            </div>
          ))}
          {w.blocks.map((b) => (
            <div
              key={`${b.d}-${b.r}`}
              className="pgk-block"
              data-kind={b.kind}
              role="cell"
              style={{
                gridColumn: `${b.d + 2} / span ${b.ds ?? 1}`,
                gridRow: `${b.r + 2} / span ${b.rs ?? 1}`,
              }}
            >
              {b.label}
            </div>
          ))}
        </div>

        {/* phones: one day at a time */}
        <div className="pgk-phone">
          <div className="pgk-pills" role="tablist" aria-label="Day">
            {w.days.map((d, i) => (
              <button key={d} type="button" role="tab" aria-selected={day === i} onClick={() => setDay(i)}>
                {d}
              </button>
            ))}
          </div>
          <ol className="pgk-list" role="tabpanel" aria-label={w.dayNames[day]}>
            {dayBlocks.map(({ time, block }) => (
              <li key={time} data-kind={block.kind}>
                <span className="pgk-list-time">{time}</span>
                <span className="pgk-list-label">{block.label}</span>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </Section>
  );
}
