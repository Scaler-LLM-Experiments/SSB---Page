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

/** One group's row: mounted afresh for each tab, so the carousel starts from its first card. */
function Row({ group: g }: { group: Group }) {
  const { ref, goTo } = useHScroller({ speed: 40 });
  // the ticker wraps by one set's width: a short list needs a third copy to fill a wide screen
  const copies = g.people.length < 8 ? 3 : 2;
  return (
    <div className="pt-panel" role="tabpanel" id={`people-panel-${g.id}`} aria-labelledby={`people-tab-${g.id}`}>
      {/* Phones: the card stack. */}
      <Container className="sm:hidden">
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
                <MeetCard image={m.image} name={m.name} role={m.role} logo={m.logo} align="start" priority={!copy && i < 5} />
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
}: {
  groups?: PeopleGroupId[];
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
            <Heading as="h2" size="display" id={titleId}>
              {GROUPS[active].title}
            </Heading>
            <Text size="lg" tone="secondary">
              {GROUPS[active].sub}
            </Text>
          </div>
          {/* the tabs: at the header's right; left-aligned above the cards on phones */}
          <div className="pt-tabs">
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
      <Row key={GROUPS[active].id} group={GROUPS[active]} />
    </Section>
  );
}
