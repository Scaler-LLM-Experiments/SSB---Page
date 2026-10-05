/**
 * L3 cards: the collapsed year (L1 of the spec), the open year (L2) and a
 * fork path. Year 4 goes through the SAME template: ship → ship slot,
 * `youGet` → skills slot, tracker → projects slot, outcome hidden while null.
 */
import * as React from 'react';
import { Heading, IconButton, Text } from '@kishanscaler/ssx-ui';
import { X } from '@phosphor-icons/react';
import type { Fork, Year } from './data';
import { fmt } from './data';
import { c, type JourneyConfig } from './config';
import { CheckPoint, ExpandGlyph, GroupLabel, RoleBadge, SummaryBadge, Visual, YearEyebrow } from './atoms';
import { JourneyTracker, OutcomeStrip, PerkGrid, ProjectGrid, SkillGroups, SplitBand, WorkshopList, summaryParts, useLabels } from './parts';

/**
 * Collapsed year: the whole row is one disclosure button (§5.1, §9).
 * A visitor who never clicks still reads year → name → what ships.
 * Layouts: `stacked` (visual under the text), `side` (visual beside it),
 * `cover` (visual behind the text, with the visual's overlay as the scrim).
 */
export const YearRow = React.forwardRef<
  HTMLButtonElement,
  { y: Year; cfg: JourneyConfig; open: boolean; controls: string; onToggle: () => void; compact?: boolean }
>(function YearRow({ y, cfg, open, controls, onToggle, compact }, ref) {
  const L = useLabels();
  const showVisual = cfg.showVisual && !compact && !!y.visual;
  const layout = showVisual ? cfg.rowLayout : 'stacked';
  const cover = layout === 'cover';
  return (
    <button
      ref={ref}
      type="button"
      className="sj-row"
      aria-expanded={open}
      aria-controls={controls}
      data-inverted={cfg.invertOpen || undefined}
      data-layout={layout}
      data-surface-ink={cover ? 'on-image' : undefined}
      onClick={onToggle}
      data-year={y.year}
      {...c(cfg, 'yearRow')}
    >
      <span className="sj-row-text">
        <YearEyebrow year={y.year} cfg={cfg} as="span" />
        <Heading as="h3" size="3" style={{ color: 'inherit' }}>
          {y.name}
        </Heading>
        <span className="sj-ship">{y.ship}</span>
        {cfg.showSummary ? (
          <span>
            <SummaryBadge parts={summaryParts(y, L)} cfg={cfg} />
          </span>
        ) : null}
      </span>
      <ExpandGlyph cfg={cfg} />
      {showVisual ? <Visual photo={y.visual} alt="" cfg={cfg} /> : null}
    </button>
  );
});

/** Open year, top to bottom as in §5.2. */
export function YearDetail({
  y,
  cfg,
  id,
  narrow,
  onClose,
  headless,
  omit = [],
}: {
  y: Year;
  cfg: JourneyConfig;
  id: string;
  narrow: boolean;
  onClose?: () => void;
  /** The sheet/drawer draws its own header. */
  headless?: boolean;
  /** Slots a concept already shows in its own open state (build-up, stack). */
  omit?: Array<'outcome' | 'description' | 'skills' | 'flagship' | 'journey' | 'perks' | 'workshops'>;
}) {
  const L = useLabels();
  const [perk, setPerk] = React.useState<number | undefined>();
  const label = fmt(L.yearLabel, y.year);
  return (
    <div className="sj-detail" id={id} {...c(cfg, 'yearDetail')}>
      {headless ? null : (
        <header>
          <div>
            <YearEyebrow year={y.year} cfg={cfg} />
            <Heading as="h3" size="2">
              {y.name}
            </Heading>
            <Text size="sm" tone="secondary">
              {y.ship}
            </Text>
          </div>
          {onClose ? (
            <IconButton variant="tertiary" size="md" aria-label={fmt(L.close, label)} onClick={onClose}>
              <X weight="bold" />
            </IconButton>
          ) : null}
        </header>
      )}

      {omit.includes('outcome') ? null : <OutcomeStrip outcome={y.outcome} cfg={cfg} />}

      {omit.includes('description') ? null : (
        <Text size="base" className="sj-desc">
          {y.description}
        </Text>
      )}

      {y.split ? <SplitBand split={y.split} cfg={cfg} /> : null}

      {y.skills && !omit.includes('skills') ? (
        <section aria-label={`${L.learn} · ${label}`}>
          <GroupLabel cfg={cfg}>{L.learn}</GroupLabel>
          <SkillGroups skills={y.skills} cfg={cfg} />
        </section>
      ) : null}

      {y.workshops?.length && !omit.includes('workshops') ? <WorkshopList items={y.workshops} cfg={cfg} /> : null}

      {y.youGet?.length && !omit.includes('perks') ? (
        <section aria-label={L.youGet}>
          <GroupLabel cfg={cfg}>{L.youGet}</GroupLabel>
          <PerkGrid perks={y.youGet} highlight={perk} idPrefix={`${id}-perk`} cfg={cfg} />
        </section>
      ) : null}

      {y.projects.filter((p) => !(omit.includes('flagship') && p.flagship)).length ? (
        <section aria-label={`${L.build} · ${label}`}>
          <GroupLabel cfg={cfg}>{L.build}</GroupLabel>
          <ProjectGrid projects={y.projects} cfg={cfg} yearLabel={label} skipFlagship={omit.includes('flagship')} />
        </section>
      ) : null}

      {y.journey?.length && !omit.includes('journey') ? (
        <section aria-label={L.journey}>
          <GroupLabel cfg={cfg}>{L.journey}</GroupLabel>
          <JourneyTracker
            journey={y.journey}
            vertical={narrow}
            cfg={cfg}
            onFunding={() => {
              setPerk(0);
              document.getElementById(`${id}-perk-0`)?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
            }}
          />
        </section>
      ) : null}
      {/* L3 syllabus link appears only once SST publishes subject lists (§4.2). */}
    </div>
  );
}

/** One branch of the fork: founder or placement. */
export function PathCard({ path, cfg }: { path: Fork['paths'][number]; cfg: JourneyConfig }) {
  return (
    <article className="sj-path" data-style={cfg.pathStyle} data-path={path.id} {...c(cfg, 'path')}>
      <Heading as="h3" size="3">
        {path.title}
      </Heading>
      <Text size="sm" tone="secondary">
        {path.desc}
      </Text>
      {path.roles ? (
        <ul className="sj-roles" aria-label="Roles">
          {path.roles.map((r) => (
            <li key={r} style={{ display: 'contents' }}>
              <RoleBadge cfg={cfg}>{r}</RoleBadge>
            </li>
          ))}
        </ul>
      ) : null}
      <ul className="sj-points">
        {path.points.map((pt) => (
          <CheckPoint key={pt} cfg={cfg}>
            {pt}
          </CheckPoint>
        ))}
      </ul>
    </article>
  );
}
