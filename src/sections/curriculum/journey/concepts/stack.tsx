/**
 * Concept: stacked year cards. The four years are physical cards.
 *
 *   desktop, collapsed   a row of equal cards side by side, all readable; focus or hover lifts one
 *   open (expand)        the card is pulled out and expands:
 *                        it slides into place first, then its body unfolds
 *                        under the front: the outcome, the skills and the
 *                        flagship; the others pile up on the left, still
 *                        clickable. "See the full year" shows the rest below.
 *   m-web                a scroll stack (after React Bits' "Scroll Stack"): every
 *                        year is a card, open by default (photo, outcome,
 *                        skills, workshops, projects). Each pins as its bottom
 *                        reaches the screen's and the next slides over it;
 *                        covered cards shrink (no dimming, no blur). A counter and
 *                        rail stay pinned under the stack.
 *   open (modal)         the card lifts off the deck and morphs into a centred
 *                        modal over a dimmed page (cfg.stackOpen = 'modal');
 *                        closing morphs it back into its slot.
 *   open (sheet)         the same content rises as a bottom sheet from the
 *                        screen's edge (cfg.stackOpen = 'sheet'); drag its
 *                        handle down, press Esc or X to send it back down.
 */
import * as React from 'react';
import { createPortal } from 'react-dom';
import { Heading, IconButton, Text } from '@kishanscaler/ssx-ui';
import { ArrowCounterClockwise, ArrowUpRight, BookOpenText, CaretDown, ChalkboardTeacher, Path, Play, RocketLaunch, Star, X } from '@phosphor-icons/react';
import type { Journey, Lane, Year } from '../data';
import { countSkills, fmt } from '../data';
import { c, type JourneyConfig } from '../config';
import { GroupLabel, LaneLabel, SummaryBadge, Visual, YearEyebrow } from '../atoms';
import { JourneyTracker, OutcomeStrip, PerkGrid, ProjectCarousel, ProjectPlaylist, SkillGroups, WorkshopList, summaryParts, useLabels } from '../parts';
import { prefersReducedMotion, useOpenYear, useSize } from './shared';
import { ScrollDots } from '@/sections/shared/ScrollDots';

/** One small line glyph per part of a card's summary line, in summaryParts' order. */
function metaGlyphs(y: Year) {
  if (y.journey?.length || !y.skills) return y.journey?.length ? [Path] : [];
  const out = [];
  if (y.skills.tech.length + y.skills.business.length + y.skills.shared.length) out.push(BookOpenText);
  if (y.projects.length) out.push(RocketLaunch);
  return out;
}

/**
 * The back of a card (unfolded under the front, or the modal body): the whole
 * open year, no "see more" step. Outcome, skills, workshops, perks, then the
 * projects as one auto-playing carousel, the flagship first with its badge
 * (or the startup journey for a year with no project list). One row of
 * photos, not a big flagship block on top of another row. `bare` drops the title,
 * which the front already shows; `active` = the card is open, so its carousel
 * may play (folded cards stay still).
 */
export function CardBack({ y, cfg, onClose, bare, headless, active = true }: { y: Year; cfg: JourneyConfig; onClose: () => void; bare?: boolean; headless?: boolean; active?: boolean }) {
  const L = useLabels();
  const flagship = y.projects.find((p) => p.flagship);
  const projects = flagship ? [flagship, ...y.projects.filter((p) => p !== flagship)] : y.projects;
  return (
    <div className="cs-backbody" {...c(cfg, 'cardBack')}>
      {headless ? null : <header>
        {bare ? null : (
          <div>
            <YearEyebrow year={y.year} cfg={cfg} />
            <Heading as="h3" size="2">
              {y.name}
            </Heading>
          </div>
        )}
        <IconButton variant="tertiary" size="md" aria-label={L.cardBack} onClick={onClose}>
          <ArrowCounterClockwise weight="bold" />
        </IconButton>
      </header>}
      <OutcomeStrip outcome={y.outcome} cfg={cfg} />
      {y.skills ? <SkillGroups skills={y.skills} cfg={cfg} /> : null}
      {y.workshops?.length ? <WorkshopList items={y.workshops} cfg={cfg} /> : null}
      {y.youGet?.length ? <PerkGrid perks={y.youGet} cfg={cfg} idPrefix={`back-${y.year}`} /> : null}
      {projects.length ? (
        <section className="cs-projects" aria-label={`${L.build} · ${fmt(L.yearLabel, y.year)}`}>
          <GroupLabel cfg={cfg}>{L.build}</GroupLabel>
          <ProjectCarousel projects={projects} cfg={cfg} label={`${fmt(L.yearLabel, y.year)} projects`} auto={active} />
        </section>
      ) : y.journey?.length ? (
        <section aria-label={L.journey}>
          <GroupLabel cfg={cfg}>{L.journey}</GroupLabel>
          <JourneyTracker journey={y.journey} vertical={false} cfg={cfg} />
        </section>
      ) : null}
    </div>
  );
}

/**
 * The modal's body, written to be scanned: content first, colour and photos
 * kept quiet. The term's overview leads; a hairline strip gives the counts at a glance; then In class (each
 * lane as a plain list of courses, the masterclasses beside them) and Out of
 * class as calm rows with a small thumbnail, not a carousel of big photos.
 */
const MODAL_LANES: Lane[] = ['tech', 'business', 'shared'];
const countWord = (label: string, n: number) => fmt(label, n).replace(/^\s*\d+\s*/, '');

/**
 * In class as an accordion (the /v2-stack experiment's second version, 2026-10-08): one row per lane
 * and one for the masterclasses, each a header with its count that opens its list; the first open.
 */
function InClassAccordion({ y, cfg }: { y: Year; cfg: JourneyConfig }) {
  const L = useLabels();
  const lanes = y.skills ? MODAL_LANES.filter((l) => y.skills![l].length) : [];
  const workshops = y.workshops ?? [];
  const groups = [
    ...lanes.map((lane) => ({ id: lane as string, head: <LaneLabel lane={lane} cfg={cfg} />, items: y.skills![lane] })),
    ...(workshops.length
      ? [{ id: 'workshops', head: (
          <span className="sj-lane" data-lane="shared">
            <ChalkboardTeacher aria-hidden="true" />
            <span className="sj-eyebrow" style={{ color: 'inherit' }}>{L.workshops ?? 'Workshops'}</span>
          </span>
        ), items: workshops }]
      : []),
  ];
  const [open, setOpen] = React.useState<string | null>(groups[0]?.id ?? null);
  return (
    <div className="cm-acc">
      {groups.map((g) => {
        const on = open === g.id;
        return (
          <div key={g.id} className="cm-acc-row" data-open={on || undefined}>
            <button type="button" className="cm-acc-head" aria-expanded={on} onClick={() => setOpen(on ? null : g.id)}>
              {g.head}
              <span className="cm-acc-count">{g.items.length}</span>
              <CaretDown weight="bold" className="cm-acc-caret" aria-hidden="true" />
            </button>
            <div className="cm-acc-body" hidden={!on}>
              <ul className="cm-list">
                {g.items.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/** In class, as the sheet shows it: one column per lane (green header, plain rows) plus the masterclasses. Shared by the desktop sheet and the m-web cards. */
function InClassColumns({ y, cfg }: { y: Year; cfg: JourneyConfig }) {
  const L = useLabels();
  const lanes = y.skills ? MODAL_LANES.filter((l) => y.skills![l].length) : [];
  const workshops = y.workshops ?? [];
  return (
    <div className="cm-learn" style={{ '--cm-cols': lanes.length + (workshops.length ? 1 : 0) } as React.CSSProperties}>
      {lanes.map((lane) => (
        <div key={lane} className="cm-col">
          <h5>
            <LaneLabel lane={lane} cfg={cfg} />
          </h5>
          <ul className="cm-list">
            {y.skills![lane].map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </div>
      ))}
      {workshops.length ? (
        <div className="cm-col">
          <h5>
            {/* the same header as the lanes: glyph and name */}
            <span className="sj-lane" data-lane="shared">
              <ChalkboardTeacher aria-hidden="true" />
              <span className="sj-eyebrow" style={{ color: 'inherit' }}>
                {L.workshops ?? 'Workshops'}
              </span>
            </span>
          </h5>
          <ul className="cm-list">
            {workshops.map((w) => (
              <li key={w}>{w}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

/** Out of class, as a playlist: number, a video still with its play button, the challenge tag, the video title and the line. Shared by the desktop sheet and the m-web cards. */
function Playlist({ projects, cfg }: { projects: Year['projects']; cfg: JourneyConfig }) {
  const L = useLabels();
  return (
    <ol className="cm-playlist">
      {projects.map((p) => (
        <li key={p.title} className="cm-track" data-flagship={p.flagship || undefined}>
          <span className="cm-still" data-video={p.video ? '' : undefined} aria-hidden="true">
            <Visual photo={p.image} alt="" cfg={cfg} ratio={[320, 180]} />
            {p.video ? (
              <span className="cm-still-play">
                <Play weight="fill" />
              </span>
            ) : null}
          </span>
          <span className="cm-track-main">
            {/* the challenge and its flag are tags; the video leads as the title */}
            <span className="cm-tags">
              <span className="cm-tag">{p.title}</span>
              {p.flagship ? (
                <span className="cm-tag cm-flag">
                  <Star weight="fill" aria-hidden="true" />
                  {L.flagship.replace(/ challenge$/i, '')}
                </span>
              ) : null}
            </span>
            <span className="cm-track-title">
              {p.video ? (
                <>
                  {L.watch ? <span className="sj-visually-hidden">{L.watch}: </span> : null}
                  {p.video}
                </>
              ) : (
                p.title
              )}
            </span>
            <span className="cm-track-desc">{p.desc}</span>
          </span>
        </li>
      ))}
    </ol>
  );
}

function ModalBody({ y, cfg, only, noGlance, noIntro }: { y: Year; cfg: JourneyConfig; /** /v2-stack splits the body across two columns: 'main' (intro, In class) or 'build' (Out of class) */ only?: 'main' | 'build'; /** the figures sit on the picture instead (MediaGlance) */ noGlance?: boolean; /** v3's sheet: In class and Out of class only */ noIntro?: boolean }) {
  const L = useLabels();
  const flagship = y.projects.find((p) => p.flagship);
  const projects = flagship ? [flagship, ...y.projects.filter((p) => p !== flagship)] : y.projects;
  const lanes = y.skills ? MODAL_LANES.filter((l) => y.skills![l].length) : [];
  const courses = y.skills ? countSkills(y) : 0;
  const workshops = y.workshops ?? [];
  const glance = [
    courses ? { n: courses, what: countWord(L.skills, courses), icon: <BookOpenText /> } : null,
    projects.length ? { n: projects.length, what: countWord(L.projects, projects.length), icon: <RocketLaunch /> } : null,
    workshops.length ? { n: workshops.length, what: (L.workshops ?? 'Workshops').split(' & ')[0].toLowerCase(), icon: <ChalkboardTeacher /> } : null,
  ].filter(Boolean) as { n: number; what: string; icon: React.ReactNode }[];

  return (
    <div className="cm" {...c(cfg, 'cardBack')}>
      {only === 'build' || noIntro ? null : (
      <div className="cm-intro">
        {y.description ? <p className="cm-lede">{y.description}</p> : null}
        {glance.length && !noGlance ? (
          <dl className="cm-glance">
            {glance.map((g) => (
              <div key={g.what}>
                <span className="cm-glance-icon" aria-hidden="true">
                  {g.icon}
                </span>
                <dd>{g.n}</dd>
                <dt>{g.what}</dt>
              </div>
            ))}
          </dl>
        ) : null}
      </div>
      )}

      {only !== 'build' && (lanes.length || workshops.length) ? (
        <section className="cm-section" aria-label={L.learn}>
          <h4 className="cm-h">{L.learn}</h4>
          {cfg.inClassAccordion ? <InClassAccordion y={y} cfg={cfg} /> : <InClassColumns y={y} cfg={cfg} />}
        </section>
      ) : null}

      {only !== 'build' && y.youGet?.length ? <PerkGrid perks={y.youGet} cfg={cfg} idPrefix={`modal-${y.year}`} /> : null}

      {only === 'main' ? null : projects.length ? (
        <section className="cm-section" aria-label={L.build}>
          <h4 className="cm-h">{L.build}</h4>
          {/* a playlist: number, a video still with its play button, then one
              column of text read top to bottom (title, line, what the video shows) */}
          <Playlist projects={projects} cfg={cfg} />
        </section>
      ) : y.journey?.length ? (
        <section className="cm-section" aria-label={L.journey}>
          <h4 className="cm-h">{L.journey}</h4>
          <JourneyTracker journey={y.journey} vertical={false} cfg={cfg} />
        </section>
      ) : null}
    </div>
  );
}

/**
 * The term's details at a glance, under the card (the /v2-stack experiment, 2026-10-08): In class
 * (its courses, then its workshops, as chips) and Out of class (its challenges, the flagship first).
 */
function StackDetails({ y }: { y: Year }) {
  const L = useLabels();
  const courses = y.skills ? MODAL_LANES.flatMap((l) => y.skills![l]) : [];
  const workshops = y.workshops ?? [];
  const flagship = y.projects.find((p) => p.flagship);
  const projects = flagship ? [flagship, ...y.projects.filter((p) => p !== flagship)] : y.projects;
  if (!courses.length && !projects.length) return null;
  return (
    <div className="cs-sdetail">
      {courses.length || workshops.length ? (
        <section className="cs-sdetail-col" aria-label={L.learn}>
          <h4 className="cs-sdetail-h">{L.learn}</h4>
          <ul className="cs-sdetail-chips">
            {courses.map((c) => (
              <li key={c}>{c}</li>
            ))}
            {workshops.map((w) => (
              <li key={w} data-workshop="">
                {w}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
      {projects.length ? (
        <section className="cs-sdetail-col" aria-label={L.build}>
          <h4 className="cs-sdetail-h">{L.build}</h4>
          <ul className="cs-sdetail-list">
            {projects.map((p) => (
              <li key={p.title}>
                <b>
                  {p.title}
                  {p.flagship ? <span className="cs-sdetail-flag">Flagship</span> : null}
                </b>
                <span>{p.desc}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}

/** Each term's three months, on its picture's tag (2026-10-08, the team's example "Jan - Mar 27").
 *  [CONFIRM] the cohort's dates: Term 1 set to Jan–Mar 2027, each term three months after. */
const TERM_MONTHS: Record<number, string> = { 1: 'Jan – Mar ’27', 2: 'Apr – Jun ’27', 3: 'Jul – Sep ’27', 4: 'Oct – Dec ’27', 5: 'Jan – Mar ’28' };

/** The term's figures on its picture, over a frosted layer (2026-10-08): courses, live projects, masterclasses. */
function MediaGlance({ y }: { y: Year }) {
  const L = useLabels();
  const courses = y.skills ? countSkills(y) : 0;
  const projects = y.projects.length;
  const workshops = (y.workshops ?? []).length;
  const items = [
    courses ? { n: courses, what: countWord(L.skills, courses), icon: <BookOpenText /> } : null,
    projects ? { n: projects, what: countWord(L.projects, projects), icon: <RocketLaunch /> } : null,
    workshops ? { n: workshops, what: (L.workshops ?? 'Workshops').split(' & ')[0].toLowerCase(), icon: <ChalkboardTeacher /> } : null,
  ].filter(Boolean) as { n: number; what: string; icon: React.ReactNode }[];
  if (!items.length) return null;
  return (
    <dl className="cs-media-glance">
      {items.map((g) => (
        <div key={g.what}>
          <span className="cs-media-glance-icon" aria-hidden="true">
            {g.icon}
          </span>
          <dd>{g.n}</dd>
          <dt>{g.what}</dt>
        </div>
      ))}
    </dl>
  );
}

/**
 * A whole term as its sheet, set on the card (/v2-stack, 2026-10-08, the team's pick): the picture a
 * tall panel at the left; at the right, scrolling inside the card, the term, title and line, then
 * the sheet's body (description, figures, In class by lane, Out of class), with its "Scroll for more".
 */
function StackSheet({ y, cfg, onMore }: { y: Year; cfg: JourneyConfig; onMore?: () => void }) {
  const main = React.useRef<HTMLDivElement>(null);
  return (
    <div
      className="cs-ss"
      data-term={y.year}
      data-short={cfg.termsSheet || undefined}
      // v3: the whole card opens the term's sheet (View more stays, as the visible cue)
      {...(cfg.termsSheet && onMore
        ? {
            role: 'button',
            tabIndex: 0,
            'aria-label': `${y.name}: view more`,
            onClick: onMore,
            onKeyDown: (e: React.KeyboardEvent) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onMore();
              }
            },
          }
        : {})}
    >
      <div className="cs-sheet-media cs-ss-media">
        {cfg.showVisual && y.visual ? <Visual photo={y.visual} alt="" cfg={cfg} ratio={[800, 900]} /> : null}
        {/* the term as a tag on the picture (2026-10-08) */}
        <span className="cs-media-tag" aria-label={`Term ${y.year}, ${TERM_MONTHS[y.year] ?? ''}`}>
          {TERM_MONTHS[y.year] ?? <YearEyebrow year={y.year} cfg={cfg} as="span" />}
        </span>
        {cfg.termsSheet ? null : <MediaGlance y={y} />}
      </div>
      <div ref={main} className="cs-sheet-main cs-ss-main">
        <header className="cs-sheet-head">
          {/* v3: the months over the title, in the card (no tags on the picture) */}
          <Heading as="h3" size="2">
            {y.name}
          </Heading>
        </header>
        {cfg.termsSheet ? (
          // v3: the card says what the term is; In class and Out of class open in the sheet
          <div className="cs-ss-short">
            <p className="cm-lede">{y.description || y.ship}</p>
            {/* the figures and View more on one row */}
            {/* the term cards' foot (/v2's): a rule, the counts inline, View more as the secondary link */}
            <div className="cs-ss-foot">
              <span className="cs-meta" data-glyphs="">
                {(() => {
                  const courses = y.skills ? countSkills(y) : 0;
                  const projects = y.projects.length;
                  const workshops = (y.workshops ?? []).length;
                  return (
                    <>
                      {courses ? (
                        <span>
                          <BookOpenText weight="regular" aria-hidden="true" />
                          {courses} courses
                        </span>
                      ) : null}
                      {projects ? (
                        <span>
                          <RocketLaunch weight="regular" aria-hidden="true" />
                          {projects} live project{projects === 1 ? '' : 's'}
                        </span>
                      ) : null}
                      {workshops ? (
                        <span>
                          <ChalkboardTeacher weight="regular" aria-hidden="true" />
                          {workshops} masterclass{workshops === 1 ? '' : 'es'}
                        </span>
                      ) : null}
                    </>
                  );
                })()}
              </span>
              <button
                type="button"
                className="cs-cover-cta cs-ss-link"
                tabIndex={-1}
                onClick={(e) => {
                  e.stopPropagation();
                  onMore?.();
                }}
              >
                View more
                <ArrowUpRight weight="bold" aria-hidden="true" />
              </button>
            </div>
          </div>
        ) : (
          <div className="cs-modal-body cs-sheet-body">
            <ModalBody y={y} cfg={cfg} noGlance />
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * A whole term, compact (/v2-stack, 2026-10-08: "too big, compress the information"): a short top row
 * (a small picture beside the title, the line, and the counts in one row), then three tight columns
 * (In class by lane, masterclasses and workshops, Out of class as one-line challenges), and "View
 * more" opening the full sheet.
 */
function StackCompact({ y, cfg, onMore }: { y: Year; cfg: JourneyConfig; onMore: () => void }) {
  const L = useLabels();
  const laneName: Record<Lane, string> = { tech: L.laneTech ?? 'Tech', business: L.laneBusiness ?? 'Business', shared: L.laneShared ?? 'Both' };
  const lanes = y.skills ? MODAL_LANES.filter((l) => y.skills![l].length) : [];
  const workshops = y.workshops ?? [];
  const flagship = y.projects.find((p) => p.flagship);
  const projects = flagship ? [flagship, ...y.projects.filter((p) => p !== flagship)] : y.projects;
  const courses = y.skills ? countSkills(y) : 0;
  return (
    <div className="cs-sc">
      <div className="cs-sc-top">
        <div className="cs-sc-media">{cfg.showVisual && y.visual ? <Visual photo={y.visual} alt="" cfg={cfg} ratio={[800, 450]} /> : null}</div>
        <div className="cs-sc-head">
          <YearEyebrow year={y.year} cfg={cfg} as="span" />
          <Heading as="h3" size="3">
            {y.name}
          </Heading>
          <p className="cs-sc-desc">{y.description || y.ship}</p>
          <p className="cs-sc-counts">
            {courses ? (
              <span>
                <BookOpenText aria-hidden="true" />
                {courses} courses
              </span>
            ) : null}
            {projects.length ? (
              <span>
                <RocketLaunch aria-hidden="true" />
                {projects.length} live project{projects.length === 1 ? '' : 's'}
              </span>
            ) : null}
            {workshops.length ? (
              <span>
                <ChalkboardTeacher aria-hidden="true" />
                {workshops.length} masterclass{workshops.length === 1 ? '' : 'es'}
              </span>
            ) : null}
            <button type="button" className="cs-sc-more" onClick={onMore}>
              View more
              <ArrowUpRight weight="bold" aria-hidden="true" />
            </button>
          </p>
        </div>
      </div>
      <div className="cs-sc-cols">
        {lanes.length ? (
          <section className="cs-sc-col" aria-label={L.learn}>
            <h4 className="cs-sc-h">{L.learn}</h4>
            <div className="cs-sc-lanes">
            {lanes.map((l) => (
              <div key={l} className="cs-sc-lane">
                <span className="cs-sc-lane-name">{laneName[l]}</span>
                <ul>
                  {y.skills![l].map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
              </div>
            ))}
            </div>
          </section>
        ) : null}
        {workshops.length ? (
          <section className="cs-sc-col" aria-label={L.workshops ?? 'Masterclasses & workshops'}>
            <h4 className="cs-sc-h">{L.workshops ?? 'Masterclasses & workshops'}</h4>
            <ul>
              {workshops.map((w) => (
                <li key={w}>{w}</li>
              ))}
            </ul>
          </section>
        ) : null}
        {projects.length ? (
          <section className="cs-sc-col" aria-label={L.build}>
            <h4 className="cs-sc-h">{L.build}</h4>
            <ul className="cs-sc-proj">
              {projects.map((p) => (
                <li key={p.title}>
                  <b>
                    {p.title}
                    {p.flagship ? <span className="cs-sc-flag">Flagship</span> : null}
                  </b>
                  <span>{p.desc}</span>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </div>
    </div>
  );
}

/** The front of a card: the collapsed year (§5.1 anatomy). */
/** A title split into two balanced lines at a word break, so every card's title is two lines. */
function twoLines(title: string): [string, string] {
  const w = title.split(' ');
  if (w.length < 2) return [title, ''];
  let best = 1;
  let diff = Infinity;
  for (let i = 1; i < w.length; i++) {
    const d = Math.abs(w.slice(0, i).join(' ').length - w.slice(i).join(' ').length);
    if (d < diff) {
      diff = d;
      best = i;
    }
  }
  return [w.slice(0, best).join(' '), w.slice(best).join(' ')];
}

function CardFront({ y, cfg }: { y: Year; cfg: JourneyConfig }) {
  const L = useLabels();
  // desktop row, editorial: the photo leads with the term on it as a glass
  // label; the title and what you leave with sit under it; a hairline, then
  // the counts and the open control share the card's foot
  if (cfg.showVisual && y.visual)
    return (
      <>
        <span className="cs-hero">
          <span className="cs-cover" aria-hidden="true">
            <Visual photo={y.visual} alt="" cfg={cfg} ratio={[600, 450]} />
          </span>
        </span>
        <span className="cs-cover-text">
          {/* the term, as a plain eyebrow over the title (it used to be a tag on the photo) */}
          <span className="cs-cover-term">
            <YearEyebrow year={y.year} cfg={cfg} as="span" />
          </span>
          <Heading as="h3" size="3" style={{ color: 'inherit' }}>
            {twoLines(y.name).map((line, i) => (
              <React.Fragment key={i}>
                {i ? ' ' : null}
                <span className="cs-title-line">{line}</span>
              </React.Fragment>
            ))}
          </Heading>
          {/* what the term covers, in full (the short "what you leave with" line is the fallback) */}
          <span className="cj-ship">{y.description || y.ship}</span>
        </span>
        <span className="cs-cover-foot">
          {cfg.showSummary ? (
            <span className="cs-meta" data-glyphs="">
              {summaryParts(y, L).map((p, i) => {
                const Glyph = metaGlyphs(y)[i];
                return (
                  <span key={p}>
                    {Glyph ? <Glyph weight="regular" aria-hidden="true" /> : null}
                    {p}
                  </span>
                );
              })}
            </span>
          ) : (
            <span />
          )}
          {/* the open cue, spelt out (2026-10-07, the team: a bare arrow didn't read as clickable); the
              whole card is still the button, so this is a label, not a second control */}
          <span className="cs-cover-cta" aria-hidden="true">
            View more
            <ArrowUpRight weight="bold" />
          </span>
        </span>
      </>
    );
  return (
    <>
      <YearEyebrow year={y.year} cfg={cfg} as="span" />
      <Heading as="h3" size="3" style={{ color: 'inherit' }}>
        {y.name}
      </Heading>
      <span className="cs-extra">
        <span>
          <span className="cj-ship">{y.ship}</span>
          {cfg.showSummary ? (
            <span>
              <SummaryBadge parts={summaryParts(y, L)} cfg={cfg} />
            </span>
          ) : null}
          {cfg.showVisual ? <Visual photo={y.visual} alt="" cfg={cfg} /> : null}
        </span>
      </span>
    </>
  );
}

/** The back stays mounted so it can fold shut, not just vanish. */
function Fold({ on, children }: { on: boolean; children: React.ReactNode }) {
  return (
    <div className="cs-fold" data-on={on || undefined} inert={!on || undefined}>
      <div className="cs-face cs-back">{children}</div>
    </div>
  );
}

/* ── modal: the card morphs into a centred dialog ──────────────────────────── */

// the same critically damped spring as the CSS (--cs-spring): glides to rest, no overshoot
const SPRING = 'linear(0, 0.034, 0.113, 0.212, 0.317, 0.418, 0.511, 0.594, 0.666, 0.727, 0.778, 0.821, 0.856, 0.885, 0.908, 0.927, 0.942, 0.954, 0.964, 0.972, 0.978, 0.983, 0.986, 0.989, 0.992, 0.994, 0.995, 0.996, 1)';
const MORPH = 720;
const LEAVE = 600;
/** When, into the close, the card starts showing through (matches the [data-landing] delay in CSS). */
const HANDOFF = 300;

/** Where the modal sits in this viewport. */
function modalFrame() {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  // desktop: a large reading surface (up to 1120); m-web: near full width
  const w = vw < 768 ? vw - 24 : Math.min(1120, vw - 96);
  const top = vw < 768 ? 12 : Math.max(24, Math.round(vh * 0.06));
  return { left: Math.round((vw - w) / 2), top, w, maxH: vh - top * 2 };
}
/** Where the bottom sheet sits (desktop only; m-web opens nothing, it scrolls a stack): edge to edge, 85% of the screen tall. */
function sheetFrame() {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const h = Math.round(vh * 0.85);
  return { left: 0, top: vh - h, w: vw, maxH: h };
}
const SHEET_IN = 560;
const SHEET_OUT = 340;
const rectFrames = (r: DOMRect | { left: number; top: number; width: number; height: number }) => ({ left: `${r.left}px`, top: `${r.top}px`, width: `${r.width}px`, height: `${r.height}px` });

/**
 * The open year as a modal. It animates its real box (top, left, width,
 * height) from the card to the centre, so nothing stretches: the hero photo
 * re-crops as it grows and the title stays pinned to its corner. The body is
 * laid out at the final width from the start and fades in once the shape has
 * mostly arrived. `leaving` plays it all back into the card, then `onGone`.
 */
function StackModal({ y, cfg, from, leaving, onClose, onGone, portal, sheet }: { y: Year; cfg: JourneyConfig; from: () => HTMLElement | null | undefined; leaving: boolean; onClose: () => void; onGone: () => void; portal?: HTMLElement | null; sheet?: boolean }) {
  const L = useLabels();
  const place = sheet ? sheetFrame : modalFrame;
  const [frame, setFrame] = React.useState(place);
  const boxRef = React.useRef<HTMLDivElement>(null);
  const backRef = React.useRef<HTMLDivElement>(null);
  const bodyRef = React.useRef<HTMLDivElement>(null);
  const closeRef = React.useRef<HTMLButtonElement>(null);
  // what scrolls: the whole box for the modal, the text column for the sheet
  const mainRef = React.useRef<HTMLDivElement>(null);
  const scroller = () => (sheet ? mainRef.current : boxRef.current);
  const titleId = React.useId();
  const yl = fmt(L.yearLabel, y.year);

  React.useEffect(() => {
    const onResize = () => setFrame(place());
    window.addEventListener('resize', onResize);
    const root = document.documentElement;
    const prev = root.style.overflow;
    const prevBody = document.body.style.overflow;
    root.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    // the modal holds the scroll: a wheel or swipe over the backdrop does nothing,
    // and inside the box it scrolls the box and never chains out to the page
    // (overflow:hidden alone does not stop every wheel, trackpad or iOS swipe)
    const layer = boxRef.current?.parentElement;
    let lastY = 0;
    const hold = (e: WheelEvent | TouchEvent) => {
      const box = scroller();
      if (!box) return;
      if (!box.contains(e.target as Node)) {
        e.preventDefault();
        return;
      }
      const dy = 'deltaY' in e ? e.deltaY : lastY - (e.touches[0]?.clientY ?? lastY);
      const atTop = box.scrollTop <= 0;
      const atEnd = box.scrollTop + box.clientHeight >= box.scrollHeight - 1;
      if ((dy < 0 && atTop) || (dy > 0 && atEnd)) e.preventDefault();
      if ('touches' in e) lastY = e.touches[0]?.clientY ?? lastY;
    };
    const touchStart = (e: TouchEvent) => {
      lastY = e.touches[0]?.clientY ?? 0;
    };
    layer?.addEventListener('wheel', hold, { passive: false });
    layer?.addEventListener('touchmove', hold, { passive: false });
    layer?.addEventListener('touchstart', touchStart, { passive: true });
    return () => {
      window.removeEventListener('resize', onResize);
      root.style.overflow = prev;
      document.body.style.overflow = prevBody;
      layer?.removeEventListener('wheel', hold);
      layer?.removeEventListener('touchmove', hold);
      layer?.removeEventListener('touchstart', touchStart);
    };
  }, []);

  // enter: from the card's box to the modal's
  React.useLayoutEffect(() => {
    const box = boxRef.current;
    const src = from()?.getBoundingClientRect();
    if (!box) return;
    const to = box.getBoundingClientRect();
    const quiet = prefersReducedMotion() || !src;
    if (sheet) {
      // the sheet rises from the bottom edge; the page dims behind it
      backRef.current?.animate([{ opacity: 0 }, { opacity: 1 }], { duration: quiet ? 150 : 360, easing: 'ease-out' });
      if (quiet) box.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 150 });
      else box.animate([{ transform: 'translateY(100%)' }, { transform: 'none' }], { duration: SHEET_IN, easing: SPRING });
      // focus goes to the sheet itself, not the close: no focus ring on open; Tab reaches the close
      boxRef.current?.focus({ preventScroll: true });
      return;
    }
    backRef.current?.animate([{ opacity: 0 }, { opacity: 1 }], { duration: quiet ? 150 : 420, easing: 'ease-out' });
    bodyRef.current?.animate([{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }], { duration: quiet ? 150 : 520, delay: quiet ? 0 : 300, easing: quiet ? 'ease-out' : SPRING, fill: 'backwards' });
    if (quiet) {
      box.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 150 });
    } else {
      box.style.overflow = 'hidden';
      box.animate([{ opacity: 0 }, { opacity: 1, offset: 0.22 }, { opacity: 1 }], { duration: MORPH });
      box.animate([rectFrames(src), rectFrames(to)], { duration: MORPH, easing: SPRING }).finished.then(
        () => (box.style.overflow = ''),
        () => undefined,
      );
    }
    boxRef.current?.focus({ preventScroll: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // leave: back into the card, then unmount
  React.useEffect(() => {
    if (!leaving) return;
    const box = boxRef.current;
    const src = from()?.getBoundingClientRect();
    if (!box) return onGone();
    const quiet = prefersReducedMotion() || !src;
    if (sheet) {
      // slides back down from wherever it is (a drag may have moved it part way)
      const dur = prefersReducedMotion() ? 150 : SHEET_OUT;
      const at = box.style.transform || 'none';
      box.style.transform = '';
      backRef.current?.animate([{ opacity: 1 }, { opacity: 0 }], { duration: dur, easing: 'ease-in', fill: 'forwards' });
      const a = prefersReducedMotion()
        ? box.animate([{ opacity: 1 }, { opacity: 0 }], { duration: dur, fill: 'forwards' })
        : box.animate([{ transform: at }, { transform: 'translateY(100%)' }], { duration: dur, easing: 'cubic-bezier(0.4, 0, 0.8, 0.4)', fill: 'forwards' });
      let done = false;
      const gone = () => {
        if (done) return;
        done = true;
        onGone();
      };
      a.finished.then(gone, gone);
      const t = window.setTimeout(gone, dur + 250);
      return () => window.clearTimeout(t);
    }
    const dur = quiet ? 150 : LEAVE;
    backRef.current?.animate([{ opacity: 1 }, { opacity: 0 }], { duration: dur, easing: 'ease-in-out', fill: 'forwards' });
    bodyRef.current?.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 140, fill: 'forwards' });
    box.style.overflow = 'hidden';
    const from0 = box.getBoundingClientRect();
    let anim: Animation;
    if (quiet) {
      anim = box.animate([{ opacity: 1 }, { opacity: 0 }], { duration: dur, fill: 'forwards' });
    } else {
      // the box flies back on the spring; its fade runs on the clock, so it stays
      // solid until it is over the slot, then hands over to the card (CSS
      // [data-landing]) fading in underneath: one continuous object, no gap
      box.animate([rectFrames(from0), rectFrames(src)], { duration: dur, easing: SPRING, fill: 'forwards' });
      anim = box.animate([{ opacity: 1 }, { opacity: 1, offset: HANDOFF / dur }, { opacity: 0 }], { duration: dur, easing: 'linear', fill: 'forwards' });
    }
    // animations pause in a hidden tab: the timer makes sure the dialog still goes
    let done = false;
    const gone = () => {
      if (done) return;
      done = true;
      onGone();
    };
    anim.finished.then(gone, gone);
    const t = window.setTimeout(gone, dur + 250);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leaving]);

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.stopPropagation();
      onClose();
    }
    if (e.key !== 'Tab' || !boxRef.current) return;
    // keep focus inside the dialog
    const f = Array.from(boxRef.current.querySelectorAll<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')).filter((el) => !el.hasAttribute('disabled'));
    if (!f.length) return;
    const first = f[0];
    const last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  // sheet: drag the handle (or the header, when scrolled to the top) down to dismiss
  const drag = React.useRef<{ y0: number; dy: number; id: number } | null>(null);
  const onGripDown = (e: React.PointerEvent) => {
    const box = boxRef.current;
    if (!sheet || !box || (scroller()?.scrollTop ?? 0) > 0 || e.button !== 0) return;
    if ((e.target as HTMLElement).closest('button')) return;
    drag.current = { y0: e.clientY, dy: 0, id: e.pointerId };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    box.style.transition = 'none';
  };
  const onGripMove = (e: React.PointerEvent) => {
    const d = drag.current;
    const box = boxRef.current;
    if (!d || !box || e.pointerId !== d.id) return;
    d.dy = Math.max(0, e.clientY - d.y0);
    box.style.transform = d.dy ? `translateY(${d.dy}px)` : '';
  };
  const onGripUp = (e: React.PointerEvent) => {
    const d = drag.current;
    const box = boxRef.current;
    drag.current = null;
    if (!d || !box || e.pointerId !== d.id) return;
    if (d.dy > Math.min(140, box.clientHeight * 0.2)) return onClose();
    // not far enough: spring back
    const at = box.style.transform || 'none';
    box.style.transform = '';
    box.style.transition = '';
    if (d.dy) box.animate([{ transform: at }, { transform: 'none' }], { duration: 320, easing: SPRING });
  };
  const grip = sheet ? { onPointerDown: onGripDown, onPointerMove: onGripMove, onPointerUp: onGripUp, onPointerCancel: onGripUp } : {};

  const photo = cfg.showVisual ? y.visual : undefined;
  // desktop sheet: three columns, the photo in the first, the title and the
  // content across the other two, scrolling on their own under a pinned photo
  if (sheet) {
    const sheetNode = (
      <div className="cs-modal" data-sheet="" data-leaving={leaving || undefined} onKeyDown={onKey}>
        <div ref={backRef} className="cs-modal-back" onClick={onClose} />
        <div ref={boxRef} tabIndex={-1} className="cs-modal-box cs-sheet" data-term={y.year} data-compact={cfg.termsSheet || undefined} role="dialog" aria-modal="true" aria-labelledby={titleId} data-sheet="" style={{ left: frame.left, bottom: 0, width: frame.w, height: frame.maxH }}>
          <div className="cs-sheet-grip" aria-hidden="true" {...grip}>
            <span />
          </div>
          {/* the design system's secondary IconButton, like the term arrows */}
          <IconButton ref={closeRef} variant="secondary" size="md" className="cs-close cs-sheet-close" aria-label={fmt(L.close, yl)} onClick={onClose}>
            <X weight="bold" />
          </IconButton>
          <div className="cs-sheet-media" {...grip}>
            {photo ? <Visual photo={photo} alt="" cfg={cfg} ratio={[800, 900]} eager /> : null}
            <span className="cs-media-tag" aria-label={`Term ${y.year}, ${TERM_MONTHS[y.year] ?? ''}`}>
              {TERM_MONTHS[y.year] ?? <YearEyebrow year={y.year} cfg={cfg} as="span" />}
            </span>
            <MediaGlance y={y} />
          </div>
          <div ref={mainRef} className="cs-sheet-main">
            <header className="cs-sheet-head" {...grip}>
              <Heading as="h3" size="2" id={titleId}>
                {y.name}
              </Heading>
            </header>
            <div ref={bodyRef} className="cs-modal-body cs-sheet-body">
              <ModalBody y={y} cfg={cfg} noGlance noIntro={cfg.termsSheet} />
            </div>
            <ScrollCue box={mainRef} />
          </div>
        </div>
      </div>
    );
    return createPortal(sheetNode, portal ?? document.body);
  }
  const node = (
    <div className="cs-modal" data-leaving={leaving || undefined} onKeyDown={onKey}>
      <div ref={backRef} className="cs-modal-back" onClick={onClose} />
      <div
        ref={boxRef}
        tabIndex={-1}
        className="cs-modal-box"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        style={{ left: frame.left, top: frame.top, width: frame.w, maxHeight: frame.maxH }}
      >
        {/* pinned to the top of the dialog, so it stays while the dialog scrolls */}
        <div className="cs-modal-closebar">
          <IconButton ref={closeRef} variant="secondary" size="md" className="cs-close" aria-label={fmt(L.close, yl)} onClick={onClose}>
            <X weight="bold" />
          </IconButton>
        </div>
        <div className="cs-modal-hero" data-photo={photo ? '' : undefined}>
          {photo ? <Visual photo={photo} alt="" cfg={cfg} ratio={[1520, 652]} eager /> : null}
          {photo ? <span className="cs-modal-blur" aria-hidden="true" /> : null}
          <div className="cs-modal-title">
            <YearEyebrow year={y.year} cfg={cfg} as="span" />
            <Heading as="h3" size="2" id={titleId} style={{ color: 'inherit' }}>
              {y.name}
            </Heading>
            </div>
        </div>
        <div ref={bodyRef} className="cs-modal-body" style={{ width: frame.w }}>
          <ModalBody y={y} cfg={cfg} />
        </div>
        <ScrollCue box={boxRef} />
      </div>
    </div>
  );
  return createPortal(node, portal ?? document.body);
}

/**
 * "Scroll for more" (2026-10-07, the team: an open term didn't say it went on below the fold). Sits at
 * the foot of the scrolling box, sticky, over a fade; it hides once the box is scrolled to its end or
 * when everything already fits. A click scrolls on by most of a screen.
 */
function ScrollCue({ box }: { box: React.RefObject<HTMLElement | null> }) {
  const [more, setMore] = React.useState(false);
  React.useEffect(() => {
    const el = box.current;
    if (!el) return undefined;
    const check = () => setMore(el.scrollHeight - el.clientHeight - el.scrollTop > 24);
    check();
    el.addEventListener('scroll', check, { passive: true });
    const ro = new ResizeObserver(check);
    ro.observe(el);
    Array.from(el.children).forEach((c) => ro.observe(c));
    return () => {
      el.removeEventListener('scroll', check);
      ro.disconnect();
    };
  }, [box]);
  const go = () => {
    const el = box.current;
    if (!el) return;
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    el.scrollBy({ top: el.clientHeight * 0.8, behavior: reduce ? 'auto' : 'smooth' });
  };
  return (
    <div className="cs-scrollcue" data-on={more || undefined} aria-hidden={!more}>
      <button type="button" className="cs-scrollcue-btn" onClick={go} tabIndex={more ? 0 : -1}>
        Scroll for more
        <CaretDown weight="bold" aria-hidden="true" />
      </button>
    </div>
  );
}

/* ── m-web: scroll stack, every year open ─────────────────────────────────── */

/**
 * An open year on m-web, without the overload: the outcome stays in view,
 * everything else sits behind two rows that open one at a time.
 *   learn (In class)     skill tags, workshops, what SST gives you
 *   build (Out of class)  the projects / videos carousel, or the startup journey
 * Nothing is dropped: every item is one tap away, and the rows say how much
 * each holds. The projects row is swipe-only (the next card peeks).
 */
/** Tap-to-open rows under a lead, one open at a time (the m-web card body). */
export type FoldRow = { id: string; title: string; count: string; body: React.ReactNode };
export function Folds({ lead, rows, onOpenChange, openOnCardTap = false }: { lead?: React.ReactNode; rows: FoldRow[]; onOpenChange?: (open: boolean) => void; /** a tap anywhere else on the card (its photo, title, outcome) opens the first row */ openOnCardTap?: boolean }) {
  const [openRow, setOpenRow] = React.useState<string | null>(null);
  React.useEffect(() => onOpenChange?.(openRow !== null), [openRow, onOpenChange]);
  const base = React.useId();
  const root = React.useRef<HTMLDivElement>(null);
  const first = rows[0]?.id ?? null;
  // native listener on the card: the Lab renders into an iframe, where React's own handlers on
  // an outer element would not hear it. Taps on a row, a link or a button keep their own meaning.
  React.useEffect(() => {
    const card = openOnCardTap ? root.current?.closest('li') : null;
    if (!card || !first) return undefined;
    const on = (e: Event) => {
      if ((e.target as HTMLElement).closest('.ss-fold, a, button')) return;
      setOpenRow((o) => o ?? first);
    };
    card.addEventListener('click', on);
    return () => card.removeEventListener('click', on);
  }, [openOnCardTap, first]);
  return (
    <div ref={root} className="ss-body">
      {lead}
      <div className="ss-folds">
        {rows.map((r) => {
          const on = openRow === r.id;
          return (
            <div key={r.id} className="ss-fold" data-open={on || undefined}>
              <button type="button" className="ss-fold-head" aria-expanded={on} aria-controls={`${base}-${r.id}`} onClick={() => setOpenRow(on ? null : r.id)}>
                <span className="ss-fold-title">{r.title}</span>
                <span className="ss-fold-count">{r.count}</span>
                <CaretDown className="ss-fold-caret" weight="bold" aria-hidden="true" />
              </button>
              <div className="ss-fold-panel" id={`${base}-${r.id}`} inert={!on || undefined}>
                <div className="ss-fold-inner">{r.body}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function YearFolds({ y, cfg, onOpenChange }: { y: Year; cfg: JourneyConfig; onOpenChange?: (open: boolean) => void }) {
  const L = useLabels();
  const flagship = y.projects.find((p) => p.flagship);
  const projects = flagship ? [flagship, ...y.projects.filter((p) => p !== flagship)] : y.projects;
  const skills = countSkills(y);
  const learnParts = [
    skills ? fmt(L.skills, skills) : '',
    y.workshops?.length ? fmt(L.workshopsCount ?? '{n} workshops', y.workshops.length) : '',
    y.youGet?.length ? fmt(L.perksCount ?? '{n} benefits', y.youGet.length) : '',
  ].filter(Boolean);
  const buildParts = [projects.length ? fmt(L.projects, projects.length) : y.journey?.length ? fmt(L.journeySteps, y.journey.length) : ''].filter(Boolean);
  const rows: FoldRow[] = [];
  if (learnParts.length)
    rows.push({
      id: 'learn',
      title: L.learn,
      count: learnParts.join(' · '),
      body: (
        <>
          {/* the same columns and colours as the desktop sheet */}
          <InClassColumns y={y} cfg={cfg} />
          {y.youGet?.length ? <PerkGrid perks={y.youGet} cfg={cfg} idPrefix={`ss-${y.year}`} /> : null}
        </>
      ),
    });
  if (buildParts.length)
    rows.push({
      id: 'build',
      title: L.build,
      count: buildParts.join(' · '),
      body: projects.length ? (
        // m-web: the projects as a Spotify-style playlist
        <ProjectPlaylist projects={projects} cfg={cfg} label={`${fmt(L.yearLabel, y.year)} projects`} />
      ) : y.journey?.length ? (
        <JourneyTracker journey={y.journey} vertical cfg={cfg} />
      ) : null,
    });
  // a term card: tapping it anywhere opens In class
  return <Folds lead={<OutcomeStrip outcome={y.outcome} cfg={cfg} />} rows={rows} onOpenChange={onOpenChange} openOnCardTap />;
}

const SS_TOP = 12; // px: where a short card pins
const SS_PEEK = 10; // px: each later short card pins this much lower
const SS_DOCK = 76; // px kept clear at the bottom for the counter pill: a tall card's last row is read above it
const SS_SCALE = 0.05; // shrink per card stacked over it
const SS_BLUR = 2; // px, once covered (only when a stack opts in with `soften`)

/**
 * The years as a scroll stack. Cards are open: they carry the whole year, so
 * they are often taller than the screen. Each one therefore scrolls normally
 * until its BOTTOM reaches the screen's bottom, and only then pins (its sticky
 * top is min(peek offset, screen - card)); the next year slides up over it.
 * How far each later card has arrived drives the covered card's depth:
 * scale, dim and a soft blur. The front card's projects carousel is the only
 * one that plays. Reduced motion: no depth effects (still stacks).
 */
/** One card of a CardStack: a photo header, then a body that reports when a row opens. */
export type StackItem = { key: string | number; eyebrow: React.ReactNode; title: string; sub?: string; photo?: React.ReactNode; counter: string; body: (onOpenChange: (open: boolean) => void) => React.ReactNode };

/**
 * The m-web scroll stack, for any list of open cards (the years; the AI journey).
 * Each card pins at the top; the next slides over it (covered cards shrink,
 * dim, soften). A card with a row open is being read: it and the ones before
 * it scroll like the page instead, so nothing covers what is being read.
 */
export function CardStack({ items: list, cfg, label, cKey = 'scrollStack', topOffset = 0, soften = false, peek = SS_PEEK, dim = 0, meter = false }: { items: StackItem[]; cfg: JourneyConfig; label: string; cKey?: string; /** px added to every pin (desktop: clear the sticky navbar) */ topOffset?: number; /** blur covered cards (off everywhere: it hurt reading) */ soften?: boolean; /** px each later card pins below the one before */ peek?: number; /** how much a covered card darkens, 0–1 (0: covered cards stay white) */ dim?: number; /** the counter pill and rail that ride along at the bottom (off: the AI terms) */ meter?: boolean }) {
  const years = list;
  const dock = meter ? SS_DOCK : SS_TOP; // nothing rides along at the bottom without the pill
  const n = years.length;
  const items = React.useRef<(HTMLLIElement | null)[]>([]);
  const inners = React.useRef<(HTMLDivElement | null)[]>([]);
  const [tops, setTops] = React.useState<number[]>([]);
  const [front, setFront] = React.useState(0);
  // cards with a row open are being read: they scroll like the page, never pin, never get covered
  const [reading, setReading] = React.useState<Record<number, boolean>>({});
  // ...and the cards before it stop pinning too, or they would show again behind it as it scrolls away
  const lastReading = Math.max(-1, ...Object.keys(reading).filter((k) => reading[+k]).map(Number));
  const unpinned = (i: number) => i <= lastReading;
  const readingRef = React.useRef(unpinned);
  readingRef.current = unpinned;
  const onOpen = React.useMemo(() => years.map((_, i) => (o: boolean) => setReading((r) => (!!r[i] === o ? r : { ...r, [i]: o }))), [years]);
  const still = typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  // sticky tops from the cards' CURRENT heights. A card pins only once all of
  // it has been on screen: a tall (opened) card keeps scrolling until its
  // bottom clears the counter dock (SS_DOCK), then pins there. Re-measured on
  // every size change, including a row opening or closing mid-read, and
  // written straight to the style so it never lags a render behind.
  const measure = React.useCallback(() => {
    const vh = window.innerHeight;
    // pin below a sticky page header (the SSB navbar), never under it: a small gap stays between them
    const header = document.querySelector<HTMLElement>('header.sn');
    const navBottom = header && getComputedStyle(header).position === 'sticky' ? Math.max(0, header.getBoundingClientRect().bottom) : 0;
    const off = Math.max(topOffset, navBottom);
    const next = items.current.map((el, i) => (el ? Math.min(off + SS_TOP + i * peek, vh - el.offsetHeight - dock) : off + SS_TOP));
    items.current.forEach((el, i) => {
      if (!el) return;
      el.style.top = `${next[i]}px`;
      // the finished stack leaves as one piece: a sticky card is pushed out when the list's end
      // reaches the foot of its margin box, so each card's foot margin is the peek of every card
      // after it. The cards then keep their steps (and their depth) as they scroll away together,
      // instead of the earlier ones sliding down behind the last.
      el.style.marginBottom = `${(items.current.length - 1 - i) * peek}px`;
    });
    setTops((prev) => (prev.length === next.length && prev.every((v, i) => v === next[i]) ? prev : next));
  }, [topOffset, peek, dock]);
  React.useLayoutEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    items.current.forEach((el) => el && ro.observe(el));
    window.addEventListener('resize', measure);
    // a row's open / close animation ends: measure the settled height too
    const list = items.current[0]?.parentElement;
    list?.addEventListener('transitionend', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
      list?.removeEventListener('transitionend', measure);
    };
  }, [n, measure]);

  // depth: how far each later card has come up over this one
  React.useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      measure();
      const vh = window.innerHeight;
      const arrived = items.current.map((el, i) => {
        if (!el) return 0;
        const pin = tops[i] ?? SS_TOP;
        const t = el.getBoundingClientRect().top;
        return Math.max(0, Math.min(1, (vh - t) / Math.max(1, vh - pin)));
      });
      let f = 0;
      arrived.forEach((a, i) => {
        if (a >= 0.55) f = i;
      });
      setFront(f);
      if (still) return;
      inners.current.forEach((inner, i) => {
        if (!inner) return;
        // an open card is not stacked, so it is never shrunk or dimmed
        const d = readingRef.current(i) ? 0 : arrived.slice(i + 1).reduce((sum, a) => sum + a, 0);
        const cover = Math.min(1, d);
        inner.style.transform = d ? `scale(${Math.max(0.8, 1 - SS_SCALE * d)})` : '';
        inner.style.filter = cover && (dim || soften) ? `brightness(${1 - dim * cover})${soften ? ` blur(${(SS_BLUR * cover).toFixed(2)}px)` : ''}` : '';
      });
      // a covered card never shows below the cards stacked over it: a taller earlier card is
      // trimmed to the bottom edge of the card over it (cards differ in height)
      const rects = inners.current.map((el) => el?.getBoundingClientRect());
      inners.current.forEach((inner, i) => {
        if (!inner) return;
        const r = rects[i];
        // trimmed to the card directly over it (the one after): anything lower would show
        // through the gap under that card before the next one arrives
        const rn = rects[i + 1];
        const over = rn && arrived[i + 1] > 0 && rn.top < (r?.bottom ?? 0) ? rn.bottom : -Infinity;
        const cut = r && over > -Infinity && !readingRef.current(i) ? r.bottom - over : 0;
        if (cut > 1) {
          const k = r!.height / inner.offsetHeight || 1; // the card is scaled: clip in its own units
          inner.style.clipPath = `inset(0 0 ${(cut / k).toFixed(1)}px 0 round var(--sj-card-r))`;
        } else inner.style.clipPath = '';
      });
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [tops, still, measure]);

  return (
    <div className="ss-wrap" {...c(cfg, 'stack')}>
      <ol className="ss" aria-label={label}>
        {years.map((y, i) => {
          const photo = y.photo;
          return (
            <li
              key={y.key}
              ref={(el) => {
                items.current[i] = el;
              }}
              className="ss-card"
              data-front={front === i || undefined}
              data-reading={unpinned(i) || undefined}
              style={{ zIndex: i + 1 }}
              {...c(cfg, cKey)}
            >
              <div
                ref={(el) => {
                  inners.current[i] = el;
                }}
                className="ss-inner"
              >
                <header className="ss-hero" data-photo={photo ? '' : undefined}>
                  {photo ?? null}
                  <div className="ss-title">
                    {y.eyebrow}
                    <Heading as="h3" size="2" style={{ color: 'inherit' }}>
                      {y.title}
                    </Heading>
                    {y.sub ? <span className="ss-ship">{y.sub}</span> : null}
                  </div>
                </header>
                {y.body(onOpen[i])}
              </div>
            </li>
          );
        })}
      </ol>
      {meter ? (
        <div className="ss-meter" aria-hidden="true">
          <span className="ss-count">
            {years[front]?.counter} <i>/ {String(n).padStart(2, '0')}</i>
          </span>
          <span className="ss-rail">
            <span style={{ transform: `scaleX(${(front + 1) / n})` }} />
          </span>
        </div>
      ) : null}
    </div>
  );
}

function ScrollStack({ j, cfg }: { j: Journey; cfg: JourneyConfig }) {
  const L = useLabels();
  const items: StackItem[] = j.years.map((y) => ({
    key: y.year,
    eyebrow: <YearEyebrow year={y.year} cfg={cfg} as="span" />,
    title: y.name,
    sub: y.description || y.ship,
    photo: cfg.showVisual && y.visual ? <Visual photo={y.visual} alt="" cfg={cfg} ratio={[750, 560]} /> : null,
    counter: fmt(L.yearLabel, cfg.eyebrowMono ? String(y.year).padStart(2, '0') : y.year),
    body: (onOpenChange) => <YearFolds y={y} cfg={cfg} onOpenChange={onOpenChange} />,
  }));
  return <CardStack items={items} cfg={cfg} label={L.years} />;
}

/**
 * The peek (desktop sheet, trigger = peek): resting on a card slides the top of
 * the sheet up from the bottom edge: the term, its title and an open cue.
 * Moving to another card swaps it; leaving the cards lets it go; a click on
 * the card or the strip opens the whole sheet.
 */
function SheetPeek({ y, on, cfg, onOpen, onEnter, onLeave, portal }: { y: Year | null; on: boolean; cfg: JourneyConfig; onOpen: () => void; onEnter: () => void; onLeave: () => void; portal?: HTMLElement | null }) {
  const L = useLabels();
  if (!y) return null;
  return createPortal(
    <button type="button" className="cs-peek" data-on={on || undefined} tabIndex={-1} aria-hidden={!on || undefined} onClick={onOpen} onPointerEnter={onEnter} onPointerLeave={onLeave}>
      <span className="cs-peek-grip" aria-hidden="true" />
      <span className="cs-peek-thumb" aria-hidden="true">
        {cfg.showVisual && y.visual ? <Visual photo={y.visual} alt="" cfg={cfg} ratio={[160, 160]} /> : null}
      </span>
      <span className="cs-peek-text">
        <YearEyebrow year={y.year} cfg={cfg} as="span" />
        <span className="cs-peek-title">{y.name}</span>
      </span>
      <span className="cs-peek-ship">{y.ship}</span>
      <span className="cs-peek-cue">
        {L.fullYear}
        <ArrowUpRight weight="bold" aria-hidden="true" />
      </span>
    </button>,
    portal ?? document.body,
  );
}

/** The last kind of input, so a focus we move ourselves can tell keyboard use from pointer use. */
let lastInput: 'key' | 'pointer' = 'pointer';
if (typeof window !== 'undefined') {
  window.addEventListener('keydown', () => (lastInput = 'key'), true);
  window.addEventListener('pointerdown', () => (lastInput = 'pointer'), true);
}

export function StackJourney({ j, cfg, width, portal, initialOpen = null }: { j: Journey; cfg: JourneyConfig; width: number; portal?: HTMLElement | null; initialOpen?: number | null }) {
  const L = useLabels();
  const { open, setOpen, close, opener } = useOpenYear(initialOpen);
  // phones, or every width when the page asks for the stack (cfg.termsStack, the /v2-stack experiment)
  const narrow = (width > 0 && width < 768) || !!cfg.termsStack;
  const years = j.years;
  const n = years.length;
  const [deckRef, deck] = useSize<HTMLDivElement>();
  const [liveRef, live] = useSize<HTMLDivElement>();
  const openYear = years.find((y) => y.year === open) ?? null;

  // modal: the dialog outlives `open` long enough to morph back into its card
  const modal = cfg.stackOpen === 'modal' || cfg.stackOpen === 'sheet';
  const sheet = cfg.stackOpen === 'sheet';
  // how the desktop sheet opens: click (default), peek on hover then click, or hover (it then stays until closed)
  const fine = typeof window !== 'undefined' && !!window.matchMedia?.('(hover: hover) and (pointer: fine)').matches;
  const trigger = sheet && fine ? cfg.sheetTrigger : 'click';
  const [peekYear, setPeekYear] = React.useState<number | null>(null);
  const [peekOn, setPeekOn] = React.useState(false);
  const enterT = React.useRef<number | undefined>(undefined);
  const goneT = React.useRef<number | undefined>(undefined);
  // after a hover-opened sheet closes, the card under the pointer waits for a fresh entry
  const disarmed = React.useRef<number | null>(null);
  React.useEffect(() => () => { window.clearTimeout(enterT.current); window.clearTimeout(goneT.current); }, []);
  const hidePeekSoon = () => {
    window.clearTimeout(goneT.current);
    goneT.current = window.setTimeout(() => setPeekOn(false), 220);
  };
  const keepPeek = () => window.clearTimeout(goneT.current);
  const cardEnter = (n: number) => (e: React.PointerEvent) => {
    if (trigger === 'click' || e.pointerType !== 'mouse' || disarmed.current === n) return;
    window.clearTimeout(enterT.current);
    keepPeek();
    if (trigger === 'peek' && peekOn) {
      setPeekYear(n); // already peeking: swap straight away
      return;
    }
    enterT.current = window.setTimeout(() => {
      if (trigger === 'peek') {
        setPeekYear(n);
        setPeekOn(true);
      } else setOpen(n);
    }, trigger === 'peek' ? 300 : 380);
  };
  const cardLeave = (n: number) => () => {
    window.clearTimeout(enterT.current);
    if (disarmed.current === n) disarmed.current = null;
    if (trigger === 'peek') hidePeekSoon();
  };
  React.useEffect(() => {
    if (open) setPeekOn(false);
  }, [open]);
  const [shown, setShown] = React.useState<number | null>(null);
  React.useEffect(() => {
    if (modal && open) setShown(open);
  }, [modal, open]);
  const cards = React.useRef<Record<number, HTMLElement | null>>({});
  const fronts = React.useRef<Record<number, HTMLElement | null>>({});
  const frontRef = (n: number) => (el: HTMLElement | null) => {
    opener(n)(el);
    fronts.current[n] = el;
  };
  const shownYear = modal ? years.find((y) => y.year === shown) ?? null : null;
  const dialog = shownYear ? (
    <StackModal
      key={shownYear.year}
      y={shownYear}
      cfg={cfg}
      portal={portal}
      sheet={sheet}
      from={() => cards.current[shownYear.year]}
      leaving={open !== shownYear.year}
      onClose={() => {
        // hover opened it: the card under the pointer waits for a fresh entry, so closing never reopens it
        if (trigger === 'hover') disarmed.current = shownYear.year;
        setOpen(null);
      }}
      onGone={() => {
        const n = shownYear.year;
        setShown(null);
        // focus goes back to the card; the ring shows only if the close came from the keyboard
        const f = fronts.current[n];
        if (f) {
          if (lastInput !== 'key') {
            f.dataset.quietFocus = '';
            f.addEventListener('blur', () => delete f.dataset.quietFocus, { once: true });
          }
          f.focus({ preventScroll: true });
        }
      }}
    />
  ) : null;

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape' && open && !modal) {
      e.stopPropagation();
      close();
    }
  };

  /* ── m-web: the scroll stack ───────────────────────────────────────────── */
  // desktop carousel: its row (the dots under it step it, shared/ScrollDots)
  const scroller = React.useRef<HTMLDivElement>(null);
  // the stacked cards: each sticks a step under the one before, or lower if it is taller than the
  // room under the nav, so all of it is read before the next comes up over it
  const mstackRef = React.useRef<HTMLOListElement>(null);
  React.useEffect(() => {
    const ol = mstackRef.current;
    if (!ol) return undefined;
    const place = () => {
      const nav = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--sn-h')) || 64;
      Array.from(ol.children).forEach((li, i) => {
        const el = li as HTMLElement;
        const base = nav + 16 + i * 14;
        el.style.top = `${Math.min(base, window.innerHeight - el.offsetHeight - 16)}px`;
      });
    };
    place();
    const ro = new ResizeObserver(place);
    Array.from(ol.children).forEach((c) => ro.observe(c));
    window.addEventListener('resize', place);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', place);
    };
  }, [narrow, years.length]);
  // the section head's slot (SectionFrame): with the head on the page, the hint under the cards is left out
  const [navSlot, setNavSlot] = React.useState<HTMLElement | null>(null);
  React.useEffect(() => {
    setNavSlot(scroller.current?.closest('.sj')?.querySelector<HTMLElement>('[data-frame-controls]') ?? null);
  }, [narrow]);
  // phones: the desktop card (2026-10-07, the team: m-web's structure should match desktop) in the
  // phone's own interaction, the scroll stack: each card sticks under the nav a step lower than the
  // one before, so the next slides up over it; a tap opens the term's sheet, as on desktop.
  // (ScrollStack, the earlier m-web cards with folds, is kept but unused here.)
  if (narrow)
    return (
      <div className="cs-wrap" onKeyDown={onKey} {...c(cfg, 'stack')}>
        <ol ref={mstackRef} className="cs-deck cs-mstack" aria-label={L.years}>
          {years.map((y, i) => (
            <li key={y.year} className="cs-mcard" style={{ '--i': i } as React.CSSProperties}>
              <div
                className="cs-inner"
                ref={(el) => {
                  cards.current[y.year] = el;
                }}
              >
                {cfg.termsStack ? (
                  <StackSheet y={y} cfg={cfg} onMore={() => setOpen(y.year)} />
                ) : (
                  <button
                    ref={frontRef(y.year)}
                    type="button"
                    className="cs-face cs-front"
                    data-cover={(cfg.showVisual && y.visual) || undefined}
                    aria-expanded={open === y.year}
                    aria-haspopup="dialog"
                    onClick={() => setOpen(y.year)}
                  >
                    <CardFront y={y} cfg={cfg} />
                  </button>
                )}
              </div>
            </li>
          ))}
        </ol>
        {dialog}
      </div>
    );

  /* ── desktop: the fan ───────────────────────────────────────────────────── */
  const W = deck.w || width || 1200;
  const cw = Math.min(380, W * 0.3);
  // collapsed: a plain row of equal cards, side by side (no fan, no overlap)
  // (wide gaps: the cards have no frame, so the space between them is what sets them apart)
  const ROW_GAP = 44; // 64, then 32 (2026-10-07: too wide, then a little tight)
  // modal / sheet: a carousel showing three whole cards and a slice of the fourth (it says "more this way")
  const carousel = modal && n > 3;
  const rowW = carousel ? (W - ROW_GAP * 3) / 3.2 : (W - ROW_GAP * (n - 1)) / n;
  // + a little end room so the last card's border and shadow are never clipped
  const trackW = n * rowW + ROW_GAP * (n - 1) + 8;
  const pileStep = 64; // each piled card shows its eyebrow + name, like a file tab
  const pileW = cw * 0.9 + 10 * (n - 2);
  const openX = pileW + 40;
  // in modal mode the fan never rearranges: the card lifts out of it instead
  const pulled = modal ? null : open;
  const inHead = carousel && !!navSlot;
  const others = years.filter((y) => y.year !== pulled);

  return (
    <div className="cs-wrap" onKeyDown={onKey} {...c(cfg, 'stack')}>
      <div ref={deckRef} className="cs-scroller" data-carousel={carousel || undefined}>
        <div ref={scroller} className="cs-scroll">
      <div className="cs-deck" data-open={pulled || undefined} style={{ width: carousel ? trackW : undefined, height: pulled ? Math.max(live.h, 420) + 16 : (live.h || 400) + (carousel ? 8 : 40) }}>
        {years.map((y, i) => {
          const isOpen = y.year === pulled;
          const pi = others.indexOf(y);
          const pos = pulled
            ? isOpen
              ? { '--x': `${openX}px`, '--y': '0px', '--r': '0deg', '--s': 1, width: W - openX, zIndex: 10 }
              : { '--x': `${pi * 10}px`, '--y': `${pi * pileStep}px`, '--r': '0deg', '--s': 0.9, width: cw, zIndex: 5 + pi }
            : { '--x': `${i * (rowW + ROW_GAP)}px`, '--y': '0px', '--r': '0deg', '--s': 1, width: rowW, zIndex: i + 1 };
          // --cw: the row width, so the front's photo keeps its size while the card widens
          const style = { ...pos, '--cw': `${pulled ? cw : rowW}px` };
          return (
            <div
              key={y.year}
              ref={isOpen || (!pulled && i === 0) ? liveRef : undefined}
              className="cs-card"
              data-open={isOpen || undefined}
              data-piled={(pulled && !isOpen) || undefined}
              style={style as React.CSSProperties}
              onPointerEnter={cardEnter(y.year)}
              onPointerLeave={cardLeave(y.year)}
              {...c(cfg, 'stackCard')}
            >
              <div
                className="cs-inner"
                ref={(el) => {
                  cards.current[y.year] = el;
                }}
                data-lifted={(modal && !sheet && shown === y.year && open === y.year) || undefined}
                data-landing={(modal && !sheet && shown === y.year && open !== y.year) || undefined}
              >
                <button
                  ref={frontRef(y.year)}
                  type="button"
                  className="cs-face cs-front"
                  data-cover={(cfg.showVisual && y.visual) || undefined}
                  aria-expanded={modal ? open === y.year : isOpen}
                  aria-haspopup={modal ? 'dialog' : undefined}
                  onClick={() => setOpen(modal ? y.year : isOpen ? null : y.year)}
                >
                  <CardFront y={y} cfg={cfg} />
                </button>
                {modal ? null : (
                  <Fold on={isOpen}>
                    <CardBack y={y} cfg={cfg} onClose={close} bare active={isOpen} />
                  </Fold>
                )}
              </div>
            </div>
          );
        })}
      </div>
        </div>
      </div>
      {/* the gallery dots every carousel has (shared/ScrollDots), under the cards: a dot per term
          (no autoplay here: the terms move only when asked); they replace the arrows in the section head */}
      {carousel && !pulled ? <ScrollDots scroller={scroller} count={n} itemName="term" fill="solid" cardStep={rowW + ROW_GAP} autoplay={false} /> : null}
      {/* without a section head: the hint under the cards */}
      {!pulled && !inHead ? (
        <div className="cs-foot-row" data-carousel={carousel || undefined}>
          <Text as="p" size="sm" tone="secondary" className="cs-hint">
            {L.pickYear}
          </Text>
        </div>
      ) : null}
      {dialog}
      {trigger === 'peek' ? (
        <SheetPeek
          y={years.find((y) => y.year === peekYear) ?? null}
          on={peekOn && !open}
          cfg={cfg}
          portal={portal}
          onOpen={() => peekYear && setOpen(peekYear)}
          onEnter={keepPeek}
          onLeave={hidePeekSoon}
        />
      ) : null}
    </div>
  );
}
