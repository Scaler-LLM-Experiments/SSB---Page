/**
 * L2 molecules: atoms put together. Each reads only its props.
 */
import * as React from 'react';
import { Badge, Button, Card, CardBody, CardDescription, CardMedia, CardTitle, ClickableCard, Heading, IconButton, Stepper, Text } from '@kishanscaler/ssx-ui';
import { Buildings, CaretLeft, CaretRight, CurrencyInr, Flask, Handshake, Pause, Play, UsersThree, Star } from '@phosphor-icons/react';

/** How long the project carousel rests on each card when it plays on its own. */
const AUTO_MS = 3000;
import type { Lane, Labels, Project, Year } from './data';
import { fmt } from './data';
import { c, type JourneyConfig } from './config';
import { FactBadge, LaneLabel, SkillBadge, Visual } from './atoms';
import { PHOTOS, photoSet, photoSrc } from './photos';

import { useLabels } from './labels';
export { LabelsContext, useLabels } from './labels';

const LANES: Lane[] = ['tech', 'business', 'shared'];

/** Outcome strip: directly under the header, once per open year (§4.2, §5.2). */
export function OutcomeStrip({ outcome, cfg }: { outcome: string | null; cfg: JourneyConfig }) {
  const L = useLabels();
  if (!outcome) return null;
  const text = cfg.fixPersonas ? outcome.replace('defined users personas', 'defined user personas') : outcome;
  return (
    <div className="sj-outcome" data-style={cfg.outcomeStyle} {...c(cfg, 'outcome')}>
      <p className="sj-eyebrow" style={{ color: 'inherit' }}>
        {L.outcome}
      </p>
      <p className="sj-outcome-text">{text}</p>
    </div>
  );
}

/** One lane: its label, count and skills. */
export function SkillGroup({ lane, skills, cfg }: { lane: Lane; skills: string[]; cfg: JourneyConfig }) {
  if (!skills.length) return null;
  return (
    <div className="sj-skillgroup" {...c(cfg, 'skillGroup')}>
      <h4>
        <LaneLabel lane={lane} cfg={cfg} count={skills.length} />
      </h4>
      <ul aria-label={`${lane} skills`}>
        {skills.map((s) => (
          <li key={s}>
            <SkillBadge lane={lane} cfg={cfg}>
              {s}
            </SkillBadge>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** What you learn: Tech / Business / Shared, with counts. Empty lanes are hidden. */
export function SkillGroups({ skills, cfg }: { skills: Year['skills']; cfg: JourneyConfig }) {
  if (!skills) return null;
  const lanes = LANES.filter((l) => skills[l].length);
  if (!lanes.length) return null;
  return (
    <div className="sj-skills" data-lanes={lanes.length} {...c(cfg, 'skills')}>
      {lanes.map((lane) => (
        <SkillGroup key={lane} lane={lane} skills={skills[lane]} cfg={cfg} />
      ))}
    </div>
  );
}

/** A challenge's video reference: a play glyph and the video it points to. `tile` sits on its photo. */
export function VideoRef({ video, tile }: { video: string; tile?: boolean }) {
  const L = useLabels();
  return (
    <span className="sj-video" data-tile={tile || undefined}>
      <span className="sj-video-play" aria-hidden="true">
        <Play weight="fill" />
      </span>
      <span>
        {L.watch ? <span className="sj-visually-hidden">{L.watch}: </span> : null}
        {video}
      </span>
    </span>
  );
}

/** Masterclasses & workshops that run alongside a year or term. */
export function WorkshopList({ items, cfg }: { items: string[]; cfg: JourneyConfig }) {
  const L = useLabels();
  if (!items.length) return null;
  return (
    <div className="sj-workshops" {...c(cfg, 'workshops')}>
      <h4 className="sj-eyebrow">{L.workshops ?? 'Workshops'}</h4>
      <ul aria-label={L.workshops ?? 'Workshops'}>
        {items.map((w) => (
          <li key={w}>
            <Badge tone="default" size="sm">
              {w}
            </Badge>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** The flagship project: one per year, large (§4.2). `overlay` puts the text on the photo. */
export function FlagshipCard({ project, cfg }: { project: Project; cfg: JourneyConfig }) {
  const L = useLabels();
  const style = cfg.flagshipStyle;
  const onImage = style === 'overlay' && !!project.image;
  const ink = style === 'inverted' || onImage;
  return (
    <article className="sj-flagship" data-style={style} data-surface-ink={onImage ? 'on-image' : undefined} {...c(cfg, 'flagship')}>
      {style === 'media' || style === 'overlay' ? (
        <div className="sj-flagship-media" data-video={project.video ? '' : undefined}>
          <Visual photo={project.image} cfg={cfg} ratio={[960, 600]} />
          {project.video && style === 'media' ? <VideoRef video={project.video} tile /> : null}
        </div>
      ) : null}
      <div className="sj-flagship-body">
        <p className="sj-eyebrow" style={{ color: 'inherit', opacity: 0.8 }}>
          {L.flagship}
        </p>
        <Heading as="h5" size="2" style={{ color: 'inherit' }}>
          {project.title}
        </Heading>
        {project.desc ? (
          <Text size="base" tone={ink ? undefined : 'secondary'} style={ink ? { color: 'inherit', opacity: 0.88 } : undefined}>
            {project.desc}
          </Text>
        ) : null}
        {project.video && style !== 'media' ? <VideoRef video={project.video} /> : null}
      </div>
    </article>
  );
}

const MEDIA_RATIO: Record<JourneyConfig['mediaRatio'], [number, number]> = { '4:3': [640, 480], '16:9': [640, 360], '3:2': [640, 427], '1:1': [560, 560] };

/**
 * A project as a media card: SSX Card + CardMedia + CardBody, the standard
 * anatomy. Image on top at a fixed ratio (cropped, never stretched), year chip
 * and flagship badge on the image, then title (wraps, never truncated, SSX
 * rule) and a 2-line description. With `onOpen` it is a ClickableCard: the
 * whole card is ONE button and nothing inside it is interactive.
 * `feature` = the bento flagship (spans 2 × 2). Below 600px of container it
 * becomes a row: thumbnail left, text right.
 */
export function ProjectMediaCard({
  project,
  year,
  cfg,
  onOpen,
  feature,
  showYear,
  eager,
}: {
  project: Project;
  year?: Year;
  cfg: JourneyConfig;
  onOpen?: () => void;
  feature?: boolean;
  showYear?: boolean;
  /** Load the photo now (a moving carousel must not slide blank cards in). */
  eager?: boolean;
}) {
  const L = useLabels();
  const photo = project.image && PHOTOS[project.image] ? project.image : undefined;
  const [w, h] = MEDIA_RATIO[cfg.mediaRatio] ?? MEDIA_RATIO['4:3'];
  const yearText = year ? (cfg.eyebrowMono ? `${fmt(L.yearLabel, '').trim()} ${String(year.year).padStart(2, '0')}` : fmt(L.yearLabel, year.year)) : '';
  const chips =
    (showYear && year) || project.flagship ? (
      <>
        {showYear && year ? (
          <Badge tone="default" size="sm" className="sj-mcard-year" data-mono={cfg.eyebrowMono || undefined}>
            {yearText}
          </Badge>
        ) : null}
        {project.flagship ? (
          // the same dark chip with a gold star as the desktop sheet's playlist
          <span className="cm-tag cm-flag">
            <Star weight="fill" aria-hidden="true" />
            {L.flagship.replace(/ challenge$/i, '')}
          </span>
        ) : null}
      </>
    ) : null;
  const inner = (
    <>
      <CardMedia ratio={cfg.mediaRatio} className="sj-mcard-media">
        {photo ? (
          <img src={photoSrc(photo, w, h)} srcSet={photoSet(photo, w, h)} sizes={feature ? '(max-width: 767px) 100vw, 640px' : '(max-width: 767px) 80vw, 320px'} /* m-web carousels show one card ~80% wide */ alt="" loading={eager ? 'eager' : 'lazy'} decoding="async" width={w} height={h} />
        ) : null}
        {chips ? <span className="sj-mcard-chips">{chips}</span> : null}
        {project.video ? <VideoRef video={project.video} tile /> : null}
      </CardMedia>
      <CardBody className="sj-mcard-body">
        {chips ? <span className="sj-mcard-meta">{chips}</span> : null}
        <CardTitle as="h5">{project.title}</CardTitle>
        {project.desc ? <CardDescription className="sj-mcard-desc">{project.desc}</CardDescription> : null}
      </CardBody>
    </>
  );
  const common = {
    className: 'sj-mcard',
    'data-feature': feature || undefined,
    'data-photo': photo ? '' : undefined,
    'data-video': project.video ? '' : undefined,
    'data-year': year?.year,
    ...c(cfg, 'mcard'),
  };
  return onOpen ? (
    <ClickableCard {...common} onClick={onOpen} aria-haspopup="dialog">
      {inner}
    </ClickableCard>
  ) : (
    <Card as="article" {...common}>
      {inner}
    </Card>
  );
}

/** One of the other projects: a media card (default), an SSX Card, or a numbered list row. */
export function ProjectCard({ project, cfg, index }: { project: Project; cfg: JourneyConfig; index?: number }) {
  if (cfg.projectStyle === 'media')
    return (
      <li className="sj-project-m">
        <ProjectMediaCard project={project} cfg={cfg} />
      </li>
    );
  if (cfg.projectStyle === 'list')
    return (
      <li className="sj-project-row" {...c(cfg, 'project')}>
        <span className="sj-project-n">{String((index ?? 0) + 1).padStart(2, '0')}</span>
        <div>
          <Text as="span" size="base" style={{ fontWeight: 600, display: 'block' }}>
            {project.title}
          </Text>
          {project.desc ? (
            <Text size="sm" tone="secondary">
              {project.desc}
            </Text>
          ) : null}
          {project.video ? <VideoRef video={project.video} /> : null}
        </div>
      </li>
    );
  return <Card as="li" className="sj-project" title={project.title} titleAs="h5" description={project.desc} {...c(cfg, 'project')} />;
}

/**
 * What you build: flagship, then a visible grid (no carousels, §4.2), then
 * "Show all m projects" when there are more than `projectLimit`.
 */
/**
 * The other projects as a carousel (the Stack concept's open card only): a snapping
 * row of media cards, every project in it (no "Show all"), Prev / Next that
 * page by the visible width and disable at the ends. The row itself scrolls
 * too (trackpad, shift + wheel, keyboard once focused).
 */
export function ProjectCarousel({ projects, cfg, label, auto, bare }: { projects: Project[]; cfg: JourneyConfig; label: string; auto?: boolean; /** No button row: a swipe-only row (never autoplays, it would have no Pause). */ bare?: boolean }) {
  const L = useLabels();
  const track = React.useRef<HTMLUListElement>(null);
  const [edge, setEdge] = React.useState({ start: true, end: false });
  // autoplay: one card every AUTO_MS, back to the start after the last. The
  // Pause button stops it (WCAG 2.2.2); it holds while keyboard focus is in
  // the row (not on a mouse click, so a click never leaves it stuck), skips a
  // hidden tab, and never starts under reduced motion. Prev / Next restart the
  // count instead of stopping it.
  const still = typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const [playing, setPlaying] = React.useState(true);
  const [kick, setKick] = React.useState(0);
  const held = React.useRef(false);
  const running = !!auto && !bare && playing && !still;
  React.useEffect(() => {
    if (!running) return undefined;
    const id = window.setInterval(() => {
      const t = track.current;
      if (!t || held.current || document.hidden) return;
      const first = t.children[0] as HTMLElement | undefined;
      const step = first ? first.getBoundingClientRect().width + parseFloat(getComputedStyle(t).columnGap || '16') : t.clientWidth;
      if (t.scrollLeft + t.clientWidth >= t.scrollWidth - 4) t.scrollTo({ left: 0, behavior: 'smooth' });
      else t.scrollBy({ left: step, behavior: 'smooth' });
    }, AUTO_MS);
    return () => window.clearInterval(id);
  }, [running, kick]);
  const onFocus = (e: React.FocusEvent) => {
    held.current = (e.target as HTMLElement).matches?.(':focus-visible') ?? false;
  };
  const onBlur = (e: React.FocusEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) held.current = false;
  };
  React.useEffect(() => {
    const t = track.current;
    if (!t) return undefined;
    const update = () => setEdge({ start: t.scrollLeft < 4, end: t.scrollLeft + t.clientWidth >= t.scrollWidth - 4 });
    update();
    t.addEventListener('scroll', update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(t);
    return () => {
      t.removeEventListener('scroll', update);
      ro.disconnect();
    };
  }, [projects]);
  const page = (dir: 1 | -1) => {
    const t = track.current;
    if (!t) return;
    const still = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    t.scrollBy({ left: dir * t.clientWidth * 0.92, behavior: still ? 'auto' : 'smooth' });
    setKick((k) => k + 1);
  };
  if (!projects.length) return null;
  const single = edge.start && edge.end;
  return (
    <div
      className="sj-carousel"
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      onFocus={onFocus}
      onBlur={onBlur}
      {...c(cfg, 'projects')}
    >
      {single || bare ? null : (
        <div className="sj-carousel-ctrl">
          {auto && !still ? (
            <button type="button" className="sj-carousel-play" aria-pressed={!playing} onClick={() => setPlaying((p) => !p)}>
              {playing ? <Pause weight="fill" aria-hidden="true" /> : <Play weight="fill" aria-hidden="true" />}
              {playing ? L.pauseProjects : L.playProjects}
            </button>
          ) : null}
          <IconButton variant="secondary" size="sm" aria-label={L.prevProjects ?? 'Previous projects'} disabled={edge.start} onClick={() => page(-1)}>
            <CaretLeft weight="bold" />
          </IconButton>
          <IconButton variant="secondary" size="sm" aria-label={L.nextProjects ?? 'Next projects'} disabled={edge.end} onClick={() => page(1)}>
            <CaretRight weight="bold" />
          </IconButton>
        </div>
      )}
      <ul ref={track} className="sj-carousel-track" data-start={edge.start || undefined} data-end={edge.end || undefined} tabIndex={0}>
        {projects.map((p) => (
          <li key={p.title}>
            <ProjectMediaCard project={p} cfg={cfg} />
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * m-web, Spotify-style: a term's projects as a playlist. Each row is a square
 * cover, the title (flagship gets the dark star chip), the brief and the
 * video it links to behind "Show more".
 */
export function ProjectPlaylist({ projects, cfg, label }: { projects: Project[]; cfg: JourneyConfig; label: string }) {
  if (!projects.length) return null;
  return (
    <ol className="pp" aria-label={label} {...c(cfg, 'projects')}>
      {projects.map((p) => (
        <PlaylistRow key={p.title} project={p} />
      ))}
    </ol>
  );
}

/** One playlist row: the brief cut to two lines; the video holds the rest. */
function PlaylistRow({ project: p }: { project: Project }) {
  const L = useLabels();
  const photo = p.image && PHOTOS[p.image] ? p.image : undefined;
  return (
    <li className="pp-row">
      <span className="pp-cover" data-video={p.video ? '' : undefined} aria-hidden="true">
        {photo ? <img src={photoSrc(photo, 160, 160)} alt="" loading="lazy" decoding="async" width={160} height={160} /> : null}
        {p.video ? (
          // the same small frosted play as the desktop sheet's playlist
          <span className="pp-cover-play">
            <Play weight="fill" />
          </span>
        ) : null}
      </span>
      <span className="pp-text">
        {p.flagship ? (
          <span className="cm-tag cm-flag pp-flag">
            <Star weight="fill" aria-hidden="true" />
            {L.flagship.replace(/ challenge$/i, '')}
          </span>
        ) : null}
        <span className="pp-title">{p.title}</span>
        {p.desc ? <span className="pp-desc">{p.desc}</span> : null}
      </span>
    </li>
  );
}

export function ProjectGrid({ projects, cfg, yearLabel, skipFlagship }: { projects: Project[]; cfg: JourneyConfig; yearLabel: string; skipFlagship?: boolean }) {
  const L = useLabels();
  const [all, setAll] = React.useState(false);
  const id = React.useId();
  if (!projects.length) return null;
  const flagship = projects.find((p) => p.flagship);
  const rest = projects.filter((p) => p !== flagship);
  const shown = all ? rest : rest.slice(0, cfg.projectLimit);
  return (
    <div className="sj-build" {...c(cfg, 'projects')}>
      {flagship && !skipFlagship ? <FlagshipCard project={flagship} cfg={cfg} /> : null}
      <ul className="sj-projects" data-style={cfg.projectStyle} id={id} aria-label={`${yearLabel} projects`}>
        {shown.map((p, i) => (
          <ProjectCard key={p.title} project={p} cfg={cfg} index={i} />
        ))}
      </ul>
      {rest.length > cfg.projectLimit ? (
        <div>
          <Button variant="secondary" size="sm" aria-expanded={all} aria-controls={id} onClick={() => setAll((v) => !v)}>
            {all ? L.showFewer : fmt(L.showAll, projects.length)}
          </Button>
        </div>
      ) : null}
    </div>
  );
}

const PERK_ICON = [CurrencyInr, UsersThree, Buildings, Handshake, Flask];

/** One `you_get` item: an SSX Card with an icon tile. */
export function PerkCard({ perk, index, cfg, target, id }: { perk: { title: string; desc: string }; index: number; cfg: JourneyConfig; target?: boolean; id?: string }) {
  const Icon = PERK_ICON[index % PERK_ICON.length];
  const body = (
    <>
      <span className="sj-perk-icon" aria-hidden="true">
        <Icon weight="regular" />
      </span>
      <CardTitle as="h5">{perk.title}</CardTitle>
      <CardDescription>{perk.desc}</CardDescription>
    </>
  );
  return (
    <li id={id} className="sj-perk" data-style={cfg.perkStyle} data-target={target || undefined} {...c(cfg, 'perk')}>
      {cfg.perkStyle === 'plain' ? (
        <div className="sj-perk-plain">{body}</div>
      ) : (
        <Card as="div" style={{ height: '100%' }}>
          <CardBody>{body}</CardBody>
        </Card>
      )}
    </li>
  );
}

/** What SST gives you (Year 4's skills slot): 2-up on mobile, 5 across on desktop (§5). */
export function PerkGrid({ perks, highlight, idPrefix = 'perk', cfg }: { perks: NonNullable<Year['youGet']>; highlight?: number; idPrefix?: string; cfg: JourneyConfig }) {
  const L = useLabels();
  return (
    <ul className="sj-perks" aria-label={L.youGet} {...c(cfg, 'perks')}>
      {perks.map((p, i) => (
        <PerkCard key={p.title} perk={p} index={i} cfg={cfg} target={highlight === i} id={`${idPrefix}-${i}`} />
      ))}
    </ul>
  );
}

/** Startup 6 mo → Industry 6 mo band (§4.4). When industry is not compulsory the fork replaces that half. */
export function SplitBand({ split, cfg }: { split: NonNullable<Year['split']>; cfg: JourneyConfig }) {
  const L = useLabels();
  return (
    <div className="sj-split" role="group" aria-label="How Year 4 is split" {...c(cfg, 'split')}>
      {split.map((s) => {
        const industry = s.phase === 'Industry';
        const replaced = industry && !cfg.industryCompulsory;
        return (
          <div key={s.phase} data-industry={industry && !replaced ? '' : undefined} data-replaced={replaced ? '' : undefined}>
            <b>
              {s.phase} · {s.months} months
            </b>
            <span>{replaced ? L.founderInstead : s.desc || (industry ? '' : L.startupFallback)}</span>
          </div>
        );
      })}
    </div>
  );
}

/**
 * Year 4 tracker: SSX Stepper, horizontal when there is room, vertical below.
 * No durations: SST publishes none (§5.4).
 */
export function JourneyTracker({ journey, vertical, onFunding, cfg }: { journey: NonNullable<Year['journey']>; vertical: boolean; onFunding?: () => void; cfg: JourneyConfig }) {
  const L = useLabels();
  return (
    <Stepper
      aria-label={L.journey}
      orientation={vertical ? 'vertical' : 'horizontal'}
      currentStep={0}
      {...c(cfg, 'tracker')}
      steps={journey.map((s) => ({
        label: s.title,
        description: s.desc,
        meta:
          s.title === 'Funding' && onFunding ? (
            <Button variant="tertiary" size="sm" onClick={onFunding}>
              {L.seeCapital}
            </Button>
          ) : undefined,
      }))}
    />
  );
}

/** Programme highlights row in the frame. */
export function FactList({ facts, cfg }: { facts: string[]; cfg: JourneyConfig }) {
  const L = useLabels();
  return (
    <ul className="sj-facts" aria-label={L.highlights} {...c(cfg, 'facts')}>
      {facts.map((f) => (
        <li key={f} style={{ display: 'contents' }}>
          <FactBadge cfg={cfg}>{f}</FactBadge>
        </li>
      ))}
    </ul>
  );
}

/** One portfolio tile (badge_grid, status "earned"): opens its project. */
export function PortfolioTile({ project, year, cfg }: { project: Project; year: Year; cfg: JourneyConfig }) {
  const L = useLabels();
  return (
    <div className="sj-tile" data-static="" data-flagship={project.flagship || undefined} data-year={year.year} {...c(cfg, 'tile')}>
      <span className="sj-eyebrow" data-mono={cfg.eyebrowMono || undefined}>
        {cfg.eyebrowMono ? `${fmt(L.yearLabel, '').trim()} ${String(year.year).padStart(2, '0')}` : fmt(L.yearLabel, year.year)}
      </span>
      {project.title}
    </div>
  );
}

/** "10 skills · 6 projects" / "5-step startup journey": derived, never typed (§8). */
export function summaryParts(y: Year, L: Labels): string[] {
  const out: string[] = [];
  // the startup year counts its journey steps instead of skills and projects
  if (y.journey?.length || !y.skills) {
    if (y.journey?.length) out.push(fmt(L.journeySteps, y.journey.length));
    return out;
  }
  const s = y.skills.tech.length + y.skills.business.length + y.skills.shared.length;
  if (s) out.push(fmt(L.skills, s));
  if (y.projects.length) out.push(fmt(L.projects, y.projects.length));
  return out;
}

