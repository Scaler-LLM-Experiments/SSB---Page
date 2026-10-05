/**
 * L5 layout: the `curriculum_journey` section (spec §4.3 order):
 *   frame → journey (by year) or threads (by discipline) → fork → portfolio → fine print.
 * The order and visibility of those blocks is `cfg.blocks` (freeplay), the
 * gap between them is the shell's `--block-gap`, like a vertical auto layout.
 * It owns the config → data step (open decisions, empty-data states) and the
 * root tokens; everything below renders what it is handed.
 */
import * as React from 'react';
import type { Journey, Year } from './data';
import { Y1_ALT_PROJECT } from './data';
import { journeyFor } from './ssb';
import { DEFAULT_CONFIG, c, normalize, rootStyle, type JourneyConfig } from './config';
import { FinePrint } from './atoms';
import { LabelsContext } from './parts';
import { AiJourneyBlock } from './ai';
import { LearnByDoingBlock } from './learn';
import { CareerPrepBlock, ForkBlock, PortfolioGrid, SectionFrame, ThreadsTable, YearSpine, useWidth } from './blocks';
import { BuildJourney } from './concepts/build';
import { StackJourney } from './concepts/stack';
import './journey.css';
import './concepts/concepts.css';

/** Apply the preview-able [CONFIRM] answers and empty-data states to the content. */
export function resolveJourney(base: Journey, cfg: JourneyConfig): Journey {
  const years: Year[] = base.years.map((y) => {
    let out: Year = { ...y };
    if (y.year === 1 && cfg.y1Alt) out.projects = y.projects.map((p) => (p.title === 'Design a database schema' ? Y1_ALT_PROJECT : p));
    if (cfg.empty === 'no-skills') out = { ...out, skills: null };
    if (cfg.empty === 'no-outcomes') out = { ...out, outcome: null };
    if (cfg.empty === 'no-visuals') out = { ...out, visual: undefined, projects: out.projects.map((p) => ({ ...p, image: undefined })) };
    if (cfg.empty === 'no-projects') out = { ...out, projects: [] };
    return out;
  });
  return { ...base, years };
}

/**
 * The section root without the section: brand, mode, L0 tokens, container,
 * copy and the overlay layer. The Lab renders single components inside it.
 */
export function JourneyScope({
  cfg,
  journey = journeyFor(cfg.brand),
  as: Tag = 'div',
  children,
  id,
  labelledBy,
  className,
  sectionRef,
}: {
  cfg: JourneyConfig;
  journey?: Journey;
  as?: 'div' | 'section';
  children: (ctx: { width: number; portal: HTMLElement | null }) => React.ReactNode;
  id?: string;
  labelledBy?: string;
  className?: string;
  sectionRef?: React.Ref<HTMLElement>;
}) {
  const [ref, width] = useWidth<HTMLElement>();
  // Sheets and drawers portal INTO the root, so they inherit its tokens,
  // theme and brand (a portal to <body> would lose all three).
  const [layer, setLayer] = React.useState<HTMLDivElement | null>(null);
  const setRef = (el: HTMLElement | null) => {
    ref.current = el;
    if (typeof sectionRef === 'function') sectionRef(el);
    else if (sectionRef) (sectionRef as React.MutableRefObject<HTMLElement | null>).current = el;
  };
  return (
    <LabelsContext.Provider value={journey.labels}>
      <Tag
        ref={setRef as never}
        id={id}
        className={['sj', className].filter(Boolean).join(' ')}
        data-brand={cfg.brand}
        data-theme={cfg.theme}
        aria-labelledby={labelledBy}
        style={rootStyle(cfg)}
      >
        <div className="sj-box">{children({ width, portal: layer })}</div>
        <div className="sj-layer" ref={setLayer} />
      </Tag>
    </LabelsContext.Provider>
  );
}

export interface CurriculumJourneyProps {
  config?: Partial<JourneyConfig>;
  journey?: Journey;
  /** Override where sheets and drawers portal to (default: a layer inside the section). */
  portal?: HTMLElement | null;
  /** Open a year on mount (Storybook variants only; the page starts collapsed). */
  initialOpen?: number | null;
  className?: string;
}

export function CurriculumJourney({ config, journey: given, portal, initialOpen = null, className }: CurriculumJourneyProps) {
  const cfg = normalize({ ...DEFAULT_CONFIG, ...config });
  // no content handed in: the brand picks it (SST: 4 years, SSB: 5 terms)
  const journey = given ?? journeyFor(cfg.brand);
  // v1 is by year only (decided 2026-09-28): no By discipline view, no toggle
  const view: JourneyConfig['view'] = 'by-year';
  const j = resolveJourney(journey, cfg);
  const headingId = React.useId();

  return (
    <JourneyScope cfg={cfg} journey={journey} as="section" id="curriculum" labelledBy={headingId} className={className}>
      {({ width, portal: layer }) => {
        const host = portal ?? layer;
        const block = (id: string) => {
          switch (id) {
            case 'frame':
              return <SectionFrame key={id} j={j} cfg={cfg} view={view} headingId={headingId} />;
            case 'journey':
              if (view === 'by-year') {
                const props = { j, cfg, width, portal: host, initialOpen };
                if (cfg.concept === 'build') return <BuildJourney key={id} {...props} />;
                if (cfg.concept === 'stack') return <StackJourney key={id} {...props} />;
              }
              return view === 'by-year' ? (
                <YearSpine key={id} years={j.years} cfg={cfg} width={width} portal={host} initialOpen={initialOpen} />
              ) : (
                <ThreadsTable key={id} years={j.years} cfg={cfg} />
              );
            case 'fork':
              // the fork branches out of Year 4, so it lives in the by-year story only (§4.4)
              return view === 'by-year' && j.fork ? <ForkBlock key={id} fork={j.fork} cfg={cfg} width={width} /> : null;
            case 'ai':
              return j.ai ? <AiJourneyBlock key={id} ai={j.ai} cfg={cfg} width={width} /> : null;
            case 'learn':
              return j.learn ? <LearnByDoingBlock key={id} learn={j.learn} cfg={cfg} /> : null;
            case 'career':
              return j.careerPrep ? <CareerPrepBlock key={id} prep={j.careerPrep} cfg={cfg} /> : null;
            case 'portfolio':
              // not on Stack: its open cards' carousels show every year's projects
              if (cfg.concept === 'stack') return null;
              return <PortfolioGrid key={id} j={j} cfg={cfg} width={width} portal={host} />;
            case 'fine':
              // not on the Stack concept's page (asked 2026-09-28); the legal line stays everywhere else
              if (!j.disclaimer || cfg.concept === 'stack') return null;
              return (
                <FinePrint key={id} cfg={cfg}>
                  {j.disclaimer}
                </FinePrint>
              );
            default:
              return null;
          }
        };
        return <div className="sj-shell" {...c(cfg, 'shell')}>{cfg.blocks.filter((b) => b.on).map((b) => block(b.id))}</div>;
      }}
    </JourneyScope>
  );
}

export default CurriculumJourney;
