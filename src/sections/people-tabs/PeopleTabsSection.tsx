'use client';

/**
 * Groups of people (faculty, mentors, the founding team, investors and founders) as a section
 * with tabs, in place of sections one under another. The page uses it twice: faculty and mentors
 * after Beyond Placements, the founding team and investors after Super Mentors (`groups`).
 *
 * A pill switcher (as the career prep stats': a dark pill slides to the tab on show) names the
 * groups. It stands at the header's right on wider screens, and left-aligned between the header
 * and the cards on phones. The tab on show brings its own eyebrow, headline, subtext and its row of
 * MEET cards, with the gallery dots under it (as every carousel has). The row runs by itself
 * from the moment its tab comes on; the tabs change only when chosen (they no longer move on by
 * themselves: that cut every carousel short). Phones get the swipeable carousel (CardStack).
 *
 * Content is the sections' own (content/people, content/community); nothing is rewritten.
 */
import * as React from 'react';
import { Container, Heading, Section, Text } from '@kishanscaler/ssx-ui';

import { companyLogos } from '@/content/company-logos';
import { foundingTeamSection, investors, mentorsSection } from '@/content/community';
import { faculty } from '@/content/people';
import { HScrollerTrack, useHScroller } from '@/sections/faculty/HScroller';
import { MeetCard } from '@/sections/faculty/MeetCard';
import type { ShowcasePerson } from '@/sections/faculty/PeopleShowcase';
import { useSectionEntrance } from '@/sections/faculty/useSectionEntrance';
import { FacultyCard } from './FacultyCard';
import { CardStack } from '@/sections/shared/CardStack';
import { ScrollDots } from '@/sections/shared/ScrollDots';
import './people-tabs.css';

export type PeopleGroupId = 'faculty' | 'mentors' | 'founding' | 'investors';

type Group = { id: string; tab: string; eyebrow: string; title: string; sub: string; itemName: string; people: ShowcasePerson[] };

const withPhoto = (people: readonly { image?: string }[]) => people.filter((p): p is ShowcasePerson => Boolean(p.image));

const ALL_GROUPS: (Group & { id: PeopleGroupId })[] = [
  {
    id: 'faculty',
    tab: 'Faculty',
    eyebrow: 'Faculty',
    title: 'Learn From Your Future Recruiters, Not Just Faculty.',
    sub: 'Operators and leaders from BCG, McKinsey, Razorpay, Zomato, PayPal, Flipkart and more teach at SSB.',
    itemName: 'faculty',
    people: faculty
      .filter((m) => m.photo)
      .map((m) => ({ name: m.name, role: m.role, image: `/faculty/${m.photo}.webp`, logo: companyLogos[m.companies[0]] })),
  },
  { id: 'mentors', tab: 'Mentors', ...mentorsSection, itemName: 'mentor', people: withPhoto(mentorsSection.people) },
  { id: 'founding', tab: 'Founding Team', ...foundingTeamSection, itemName: 'person', people: withPhoto(foundingTeamSection.people) },
  { id: 'investors', tab: 'Investors & Founders', ...investors, itemName: 'person', people: withPhoto(investors.people) },
];

/** PLACEHOLDER (2026-10-12): the stacked cards' line under the logo, until each person's own is written. */
const PLACEHOLDER_BIO = 'A line on what they teach at SSB and the work they have led.';

/** PLACEHOLDER (2026-10-13): the faculty cards' course titles, until each person's own is written. */
const PLACEHOLDER_COURSES = [
  'Operation Management',
  'Brand Strategy',
  'Growth Marketing',
  'Corporate Finance',
  'Product Management',
  'Sales Leadership',
  'Business Analytics',
  'Strategy & Consulting',
];

/**
 * Faculty as two rows of `FacultyCard`s drifting sideways (2026-10-13, the team's ask: the alumni
 * section's layout): both rows the same way, the second half a card behind (faculty-card.css).
 */
function FacultyDrift({ group: g }: { group: Group }) {
  const gridRef = React.useRef<HTMLUListElement>(null);
  const driftRef = React.useRef<HTMLDivElement>(null);
  useSwipeDrift(driftRef);
  // mentors on the web: the looping scroller (not the CSS drift), so the dots can follow and step it
  const { ref: tickerRef, goTo } = useHScroller({ speed: 40 });
  // mentors: their earlier photo card (MeetCard), smaller, in this layout (2026-10-13, the team's ask)
  const meet = g.id === 'mentors';
  const card = (p: ShowcasePerson, i: number, priority: boolean) =>
    meet ? (
      <MeetCard image={p.image} name={p.name} role={p.role} logo={p.logo} logos={p.logos} align="start" priority={priority} />
    ) : (
      <FacultyCard person={p} course={PLACEHOLDER_COURSES[i % PLACEHOLDER_COURSES.length]} credentials={p.role} priority={priority} />
    );
  const kind = meet ? 'meet' : undefined;
  const n = g.people.length;
  const all = g.people.map((p, i) => ({ p, i }));
  // A long list splits between the rows; a short one (mentors: five) runs whole in each row, the
  // second started halfway along, and repeats until a set is wider than the screen (no gap in the loop).
  const rowsOf = (r: number) => {
    const mine = n >= 12 ? all.filter(({ i }) => i % 2 === r) : [...all.slice(r * Math.ceil(n / 2)), ...all.slice(0, r * Math.ceil(n / 2))];
    return Array.from({ length: Math.ceil(6 / mine.length) }, () => mine).flat().map((x, k) => ({ ...x, k }));
  };
  return (
    <div className="pt-panel" role="tabpanel" id={`people-panel-${g.id}`} aria-labelledby={`people-tab-${g.id}`}>
      {meet ? (
        <div className="fc-meet-web">
          <HScrollerTrack trackRef={tickerRef} label={g.eyebrow}>
            {[0, 1, 2].map((c) =>
              g.people.map((p, i) => (
                <li key={`${c}-${p.name}`} data-copy={c > 0 || undefined} aria-hidden={c > 0 || undefined} inert={c > 0 || undefined}>
                  {card(p, i, c === 0 && i < 4)}
                </li>
              )),
            )}
          </HScrollerTrack>
          <ScrollDots scroller={tickerRef} count={g.people.length} itemName={g.itemName} onSelect={goTo} />
        </div>
      ) : null}
      <div
        ref={driftRef}
        className="fc-drift"
        hidden={meet}
        data-kind={kind}
        // mentors: one row of bigger cards on desktop (2026-10-13, the team's ask)
        data-single={g.id === 'mentors' || undefined}
      >
      {[0, 1].map((r) => {
        const mine = rowsOf(r);
        return (
          // the lane: on phones a row the reader can swipe, the drift carried on by its scroll (useSwipeDrift)
          <div key={r} className="fc-drift-lane">
          <div className="fc-drift-row" data-dir={r ? 'back' : undefined} style={{ '--n': mine.length } as React.CSSProperties}>
            {[0, 1].map((copy) => (
              <ul key={copy} className="fc-drift-set" aria-label={copy ? undefined : g.eyebrow} aria-hidden={copy ? true : undefined}>
                {mine.map(({ p, i, k }) => (
                  <li key={k}>
                    {card(p, i, !copy && k < 3)}
                  </li>
                ))}
              </ul>
            ))}
          </div>
          </div>
        );
      })}
      </div>
      {/* m-web (2026-10-13, the team's ask): no drifting; two rows, card over card, swiped a column
          at a time, with the dots under them */}
      <ul ref={gridRef} className="fc-grid" data-kind={kind} aria-label={g.eyebrow}>
        {g.people.map((p, i) => (
          <li key={p.name}>
            {card(p, i, i < 2)}
          </li>
        ))}
      </ul>
      <div className="fc-grid-dots">
        <ScrollDots scroller={gridRef} count={Math.ceil(g.people.length / 2)} itemName={g.itemName} fill="solid" autoplay={false} />
      </div>
    </div>
  );
}

/**
 * Phones (2026-10-13, the team's ask: the swipe back, the drift kept): each lane scrolls sideways, and
 * its scroll moves on by itself at the desktop drift's pace (40px a second), wrapping by one set's
 * width (the row is its cards twice over). A touch hands it to the reader; it carries on a moment
 * after they let go. The second lane starts half a card along. Reduced motion: swipe only.
 */
function useSwipeDrift(root: React.RefObject<HTMLDivElement | null>) {
  React.useEffect(() => {
    const el = root.current;
    if (!el) return;
    const phone = window.matchMedia('(width < 672px)');
    const still = window.matchMedia('(prefers-reduced-motion: reduce)');
    let raf = 0;
    let stop = () => {};
    const start = () => {
      stop();
      if (!phone.matches) return;
      const lanes = [...el.querySelectorAll<HTMLElement>('.fc-drift-lane')].map((lane, i) => {
        const set = lane.querySelector<HTMLElement>('.fc-drift-set');
        const card = set?.firstElementChild as HTMLElement | null;
        const st = { lane, set, pos: i ? (card?.offsetWidth ?? 0) / 2 + 6 : 0, last: -1, held: false, idle: 0 };
        lane.scrollLeft = st.pos;
        st.last = lane.scrollLeft;
        return st;
      });
      const offs: Array<() => void> = [];
      lanes.forEach((st) => {
        const hold = () => { st.held = true; };
        const free = () => { st.held = false; st.idle = performance.now() + 1200; };
        const onScroll = () => {
          // a scroll we did not make (a swipe, its glide): take the reader's place, wait for it to settle
          if (Math.abs(st.lane.scrollLeft - st.last) > 1.5) { st.pos = st.lane.scrollLeft; st.last = st.pos; st.idle = performance.now() + 900; }
        };
        st.lane.addEventListener('touchstart', hold, { passive: true });
        st.lane.addEventListener('touchend', free, { passive: true });
        st.lane.addEventListener('touchcancel', free, { passive: true });
        st.lane.addEventListener('scroll', onScroll, { passive: true });
        offs.push(() => {
          st.lane.removeEventListener('touchstart', hold);
          st.lane.removeEventListener('touchend', free);
          st.lane.removeEventListener('touchcancel', free);
          st.lane.removeEventListener('scroll', onScroll);
        });
      });
      let t0 = performance.now();
      const tick = (t: number) => {
        const dt = Math.min(0.05, (t - t0) / 1000);
        t0 = t;
        if (!still.matches) {
          for (const st of lanes) {
            if (st.held || t < st.idle || !st.set) continue;
            const w = st.set.offsetWidth;
            st.pos += 40 * dt;
            if (st.pos >= w) st.pos -= w;
            st.lane.scrollLeft = st.pos;
            st.last = st.lane.scrollLeft;
          }
        }
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
      stop = () => { cancelAnimationFrame(raf); offs.forEach((f) => f()); };
    };
    start();
    phone.addEventListener('change', start);
    return () => { stop(); phone.removeEventListener('change', start); };
  }, [root]);
}

/** One group's row: mounted afresh for each tab, so the carousel starts from its first card. */
function Row({ group: g, stacked = false, compact = false }: { group: Group; stacked?: boolean; compact?: boolean }) {
  const row = stacked || compact;
  const { ref, goTo } = useHScroller({ speed: 40 });
  // the ticker wraps by one set's width: a short list needs a third copy to fill a wide screen
  const copies = g.people.length < 8 ? 3 : 2;
  return (
    <div className="pt-panel" role="tabpanel" data-compact={compact || undefined} id={`people-panel-${g.id}`} aria-labelledby={`people-tab-${g.id}`}>
      {/* Phones, stacked (2026-10-12, the team's layout): a row to swipe, two cards in view and the
          edges of the next and the last. */}
      {row ? (
        <ul className="pt-stack-row" data-compact={compact || undefined} aria-label={g.eyebrow}>
          {g.people.map((m, i) => (
            <li key={m.name}>
              <MeetCard
                image={m.image}
                name={m.name}
                role={m.role}
                logo={m.logo}
                align={stacked ? 'start' : 'center'}
                stacked={stacked}
                bio={PLACEHOLDER_BIO}
                priority={i < 3}
              />
            </li>
          ))}
        </ul>
      ) : null}
      {/* Phones: the card stack. */}
      <Container className={row ? 'hidden' : 'sm:hidden'}>
        <CardStack
          items={g.people}
          getKey={(m) => m.name}
          label={g.eyebrow}
          itemName={g.itemName}
          announce={(m) => `${m.name}, ${m.role}`}
          dots
          loop={false}
          renderCard={(m, i) => (
            <MeetCard image={m.image} priority={i === 0 || i === 1 || i === g.people.length - 1} name={m.name} role={m.role} logo={m.logo} />
          )}
        />
      </Container>

      {/* Tablet and up: the looping row (copies of the list; only the first is real). */}
      <HScrollerTrack trackRef={ref} label={g.eyebrow}>
        {Array.from({ length: copies }, (_, c) =>
          g.people.map((m, i) => {
            const copy = c > 0;
            return (
              <li key={`${c}-${m.name}`} data-copy={copy || undefined} aria-hidden={copy || undefined} inert={copy || undefined}>
                <MeetCard
                  image={m.image}
                  name={m.name}
                  role={m.role}
                  logo={m.logo}
                  align="start"
                  stacked={stacked}
                  bio={PLACEHOLDER_BIO}
                  priority={!copy && i < 5}
                />
              </li>
            );
          }),
        )}
      </HScrollerTrack>
      <div className="hidden sm:block">
        <ScrollDots scroller={ref} count={g.people.length} itemName={g.itemName} onSelect={goTo} />
      </div>
    </div>
  );
}

export function PeopleTabsSection({
  groups: ids = ['faculty', 'mentors'],
  id = 'people',
  label = 'The people at SSB',
  stacked = false,
  compact = false,
  drift = false,
}: {
  groups?: PeopleGroupId[];
  /** Faculty cards in two drifting rows, as Alumni's (2026-10-13). */
  drift?: boolean;
  /** The cards with the photo on top and the text under it (2026-10-12). */
  stacked?: boolean;
  /** Smaller cards, unchanged otherwise: four in view on desktop, two and a peek on a phone (2026-10-12, mentors). */
  compact?: boolean;
  id?: string;
  label?: string;
}) {
  const GROUPS = React.useMemo(() => ALL_GROUPS.filter((g) => ids.includes(g.id)), [ids.join()]); // eslint-disable-line react-hooks/exhaustive-deps
  const titleId = `${id}-title`;
  const [active, setActive] = React.useState(0);
  const sectionRef = React.useRef<HTMLElement>(null);
  const tabs = React.useRef<(HTMLButtonElement | null)[]>([]);
  const [pill, setPill] = React.useState<{ x: number; w: number } | null>(null);
  useSectionEntrance(sectionRef);

  // the pill sits under the active tab: measured, and again when the row changes size
  React.useLayoutEffect(() => {
    const measure = () => {
      const t = tabs.current[active];
      if (t) setPill({ x: t.offsetLeft, w: t.offsetWidth });
    };
    measure();
    const row = tabs.current[0]?.parentElement;
    if (!row || typeof ResizeObserver === 'undefined') return undefined;
    const ro = new ResizeObserver(measure);
    ro.observe(row);
    return () => ro.disconnect();
  }, [active]);

  const select = (i: number) => {
    setActive(i);
    // on a phone the row of tabs scrolls: keep the chosen one in view (the row only, never the page)
    const t = tabs.current[i];
    const row = t?.parentElement;
    if (t && row) row.scrollTo({ left: t.offsetLeft - (row.clientWidth - t.offsetWidth) / 2, behavior: 'smooth' });
  };
  // arrow keys move between tabs, as a tab list does
  const onKey = (e: React.KeyboardEvent) => {
    const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (!d) return;
    e.preventDefault();
    const next = (active + d + GROUPS.length) % GROUPS.length;
    select(next);
    tabs.current[next]?.focus();
  };

  return (
    <Section ref={sectionRef} id={id} density="roomy" aria-labelledby={titleId} className="overflow-x-clip pt-section">
      <Container>
        <div className="mb-8 flex flex-col gap-6 sm:mb-12 sm:flex-row sm:items-end sm:justify-between">
          {/* keyed: the header comes on afresh with its tab */}
          <div key={GROUPS[active].id} className="pt-panel flex max-w-(--size-measure-max) flex-col gap-3">
            <Heading as="p" size="eyebrow" className="text-content-brand">
              {GROUPS[active].eyebrow}
            </Heading>
            {/* the titles stacked the same way (the active one the h2), so a longer title doesn't jump it */}
            <div className="pt-subs">
              {GROUPS.map((g, i) =>
                i === active ? (
                  <Heading key={g.id} as="h2" size="display" id={titleId} data-on>
                    {g.title}
                  </Heading>
                ) : (
                  <Heading key={g.id} as="p" size="display" aria-hidden>
                    {g.title}
                  </Heading>
                ),
              )}
            </div>
            {/* every tab's sub-line laid in one cell, only the active one shown, so the cell is as tall
                as the longest at any width and the header doesn't jump between tabs (2026-10-13) */}
            <div className="pt-subs">
              {GROUPS.map((g, i) => (
                <Text key={g.id} size="lg" tone="secondary" aria-hidden={i !== active || undefined} data-on={i === active || undefined}>
                  {g.sub}
                </Text>
              ))}
            </div>
          </div>
          {/* the tabs: at the header's right; left-aligned above the cards on phones */}
          {/* one group (faculty and mentors as sections of their own, 2026-10-12): no tabs */}
          <div className="pt-tabs" hidden={GROUPS.length < 2}>
            <div className="pt-switch-wrap">
              <div className="pt-switch" role="tablist" aria-label={label} onKeyDown={onKey}>
                {pill ? (
                  <span className="pt-pill" style={{ transform: `translateX(${pill.x}px)`, width: pill.w }} aria-hidden="true" />
                ) : null}
                {GROUPS.map((g, i) => (
                  <button
                    key={g.id}
                    type="button"
                    role="tab"
                    id={`people-tab-${g.id}`}
                    aria-selected={i === active}
                    aria-controls={`people-panel-${g.id}`}
                    tabIndex={i === active ? 0 : -1}
                    ref={(el) => {
                      tabs.current[i] = el;
                    }}
                    className="pt-tab"
                    onClick={() => select(i)}
                  >
                    {g.tab}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
      {/* keyed: each tab mounts its own row, so its carousel starts from the first card */}
      {drift ? (
        <FacultyDrift key={GROUPS[active].id} group={GROUPS[active]} />
      ) : (
        <Row key={GROUPS[active].id} group={GROUPS[active]} stacked={stacked} compact={compact} />
      )}
    </Section>
  );
}
