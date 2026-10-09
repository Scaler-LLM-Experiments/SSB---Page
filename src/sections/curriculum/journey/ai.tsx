/**
 * The AI journey (SSB): one new capability and one product outcome per term.
 * Content and images from the SSB concept site (ssb-school-concept.vercel.app).
 *   desktop  a carousel of image-led cards (arrows, snap scrolling): a tall
 *            photo with the term and icon on it, then the name and one short
 *            line; the product outcome and the tools fold away, as on m-web
 *            (cfg.aiLayout = 'carousel'); by default desktop splits instead:
 *            the heading pinned in the left third, the m-web scroll stack in
 *            the right two thirds, cards pinning under the navbar as they stack
 *   m-web    the same scroll stack as the years: photo header, the capability,
 *            then the product outcome and the tools, all shown (it is short)
 */
import * as React from 'react';
import { Badge, Heading, IconButton, Text } from '@kishanscaler/ssx-ui';
import { ArrowsClockwise, CaretLeft, CaretRight, MagicWand, RocketLaunch, Robot, Waveform } from '@phosphor-icons/react';
import type { AiIcon, AiJourney } from './data';
import { c, type JourneyConfig } from './config';
import { CardStack, type StackItem } from './concepts/stack';
import { TOOL_LOGOS } from './tool-logos';

const ICON: Record<AiIcon, React.ComponentType<{ weight?: 'bold' | 'regular'; 'aria-hidden'?: boolean }>> = {
  wand: MagicWand,
  wave: Waveform,
  cycle: ArrowsClockwise,
  robot: Robot,
  rocket: RocketLaunch,
};
const termLabel = (n: number) => `Term ${String(n).padStart(2, '0')}`;

/** A tool's logo, single colour; a letter monogram when the tool has no published mark. */
function ToolLogo({ name }: { name: string }) {
  const l = TOOL_LOGOS[name];
  if (!l)
    return (
      <span className="sj-tool-mono" aria-hidden="true">
        {name.charAt(0)}
      </span>
    );
  // brand hex for one-colour marks; full-colour marks carry their own fills; black marks follow the tag ink
  return <svg className="sj-tool-logo" viewBox={l.vb} fill={l.color ?? 'currentColor'} data-ink={l.ink || undefined} fillRule={l.evenodd ? 'evenodd' : undefined} aria-hidden="true" focusable="false" dangerouslySetInnerHTML={{ __html: l.svg }} />;
}

/**
 * The tools as a quiet, endless strip: two copies of the list in one track,
 * sliding left and looping; it pauses on hover or focus, fades at both edges,
 * and lies still (wrapping) under reduced motion. Only the first copy is read.
 */
function Tools({ tools }: { tools: string[] }) {
  const reps = Math.max(1, Math.ceil(10 / tools.length)); // at least ten tags per half, so even short names outrun the card
  const set = (hidden?: boolean) => (
    <ul className="sj-tools-set" aria-label={hidden ? undefined : 'Tools'} aria-hidden={hidden || undefined}>
      {tools.map((t) => (
        <li key={t}>
          <Badge tone="default" size="md" className="sj-tool">
            <ToolLogo name={t} />
            {t}
          </Badge>
        </li>
      ))}
    </ul>
  );
  return (
    <div className="sj-ai-tools sj-tools-marquee" style={{ '--sj-tools-loop': `${Math.max(14, tools.length * reps * 3.2)}s` } as React.CSSProperties}>
      {/* two identical halves (the loop moves one half); a short list repeats so a half always outruns the card */}
      <div className="sj-tools-track">
        {Array.from({ length: 2 * reps }, (_, i) => (
          <React.Fragment key={i}>{set(i > 0)}</React.Fragment>
        ))}
      </div>
    </div>
  );
}

/** The product outcome, given weight: a light-green panel, its label, the line in larger ink. */
function Outcome({ text, label = true }: { text: string; label?: boolean }) {
  // the product number is dropped: the line alone says what gets built
  const [, ...rest] = text.split(': ');
  const line = rest.length ? rest.join(': ') : text;
  return (
    <div className="sj-ai-outcome">
      <span className="sj-ai-outcome-top">
        {label ? <span className="sj-eyebrow">Outcome</span> : null}
      </span>
      <p>{line.charAt(0).toUpperCase() + line.slice(1)}</p>
    </div>
  );
}

export function AiJourneyBlock({ ai, cfg, width }: { ai: AiJourney; cfg: JourneyConfig; width: number }) {
  const id = React.useId();
  const narrow = width > 0 && width < 768;
  const head = (
    <header className="sj-ai-head">
      <Heading as="p" size="eyebrow">
        {ai.eyebrow}
      </Heading>
      <Heading as="h2" size="1" id={id}>
        {ai.title} <span className="sj-ai-accent">{ai.titleAccent}</span>
      </Heading>
      <Text size="lg" className="sj-lede">
        {ai.lede}
      </Text>
    </header>
  );
  // desktop carousel: arrows step one card; they grey out at either end
  const track = React.useRef<HTMLOListElement>(null);
  const [edge, setEdge] = React.useState({ back: false, fwd: true });
  const sync = React.useCallback(() => {
    const el = track.current;
    if (!el) return;
    setEdge({ back: el.scrollLeft > 4, fwd: el.scrollLeft + el.clientWidth < el.scrollWidth - 4 });
  }, []);
  React.useEffect(sync, [sync, width]);
  const step = (dir: number) => {
    const el = track.current;
    const card = el?.firstElementChild as HTMLElement | null;
    if (!el || !card) return;
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    el.scrollBy({ left: dir * (card.offsetWidth + 16), behavior: reduce ? 'auto' : 'smooth' });
  };
  const stackDesktop = !narrow && cfg.aiLayout === 'stack';
  // the carousel layout is used on phones too (2026-10-09, the team's ask); 'stack' keeps the phone stack
  if ((narrow && cfg.aiLayout !== 'carousel') || stackDesktop) {
    const items: StackItem[] = ai.terms.map((t) => {
      return {
        key: t.term,
        eyebrow: (
          <span className="sj-ai-eyebrow">
            <span className="sj-eyebrow" style={{ color: 'inherit' }}>
              {termLabel(t.term)}
            </span>
          </span>
        ),
        title: t.name,
        sub: t.desc,
        // the landscape photo everywhere: on desktop it runs across the head of the card
        photo: <img className="sj-ai-photo" src={t.image} alt="" loading="lazy" decoding="async" style={t.imagePos ? { objectPosition: t.imagePos } : undefined} />,
        counter: termLabel(t.term),
        // short enough to show whole: the outcome, then the tools, no collapse
        body: () => (
          <div className="ss-body">
            <Outcome text={t.outcome} />
            <div className="sj-ai-toolset">
              <span className="sj-eyebrow">Tools</span>
              <Tools tools={t.tools} />
            </div>
          </div>
        ),
      };
    });
    // desktop: the heading pinned in the left third, the same stack as m-web in the right two
    if (stackDesktop)
      return (
        <section className="sj-ai" data-layout="split" aria-labelledby={id} {...c(cfg, 'ai')}>
          <div className="sj-ai-aside">{head}</div>
          <div className="sj-ai-stack">
            <CardStack items={items} cfg={cfg} label={ai.eyebrow} cKey="aiCard" topOffset={88} soften={false} peek={16} dim={0} meter={false} />
          </div>
        </section>
      );
    // phones: the desktop card's layout too (2026-10-07: m-web's structure should match desktop), the
    // heading over the stack; only the stacking on scroll is the phone's own
    return (
      <section className="sj-ai" data-layout="split" data-narrow="" aria-labelledby={id} {...c(cfg, 'ai')}>
        <div className="sj-ai-aside">{head}</div>
        <div className="sj-ai-stack">
          <CardStack items={items} cfg={cfg} label={ai.eyebrow} cKey="aiCard" soften={false} peek={12} dim={0} meter={false} />
        </div>
      </section>
    );
  }
  return (
    <section className="sj-ai" aria-labelledby={id} {...c(cfg, 'ai')}>
      <div className="sj-ai-headrow">
        {head}
        <div className="sj-ai-nav">
          <IconButton variant="secondary" size="md" aria-label="Previous term" disabled={!edge.back} onClick={() => step(-1)}>
            <CaretLeft weight="bold" />
          </IconButton>
          <IconButton variant="secondary" size="md" aria-label="Next term" disabled={!edge.fwd} onClick={() => step(1)}>
            <CaretRight weight="bold" />
          </IconButton>
        </div>
      </div>
      <ol ref={track} className="sj-ai-track" aria-label={ai.eyebrow} onScroll={sync}>
        {ai.terms.map((t) => {
          return (
            <li key={t.term} className="sj-ai-card" {...c(cfg, 'aiCard')}>
              <div className="sj-ai-media">
                <img className="sj-ai-photo" src={t.image} alt="" loading="lazy" decoding="async" style={t.imagePos ? { objectPosition: t.imagePos } : undefined} />
                <span className="sj-ai-tag">
                  <span>{termLabel(t.term)}</span>
                </span>
              </div>
              <div className="sj-ai-text">
                <Heading as="h3" size="3">
                  {t.name}
                </Heading>
                <Text size="sm" tone="secondary" className="sj-ai-desc">
                  {t.desc}
                </Text>
              </div>
              {/* all up front, no folds (2026-10-08, the team's ask): the outcome, then the tools */}
              <div className="sj-ai-open">
                <Outcome text={t.outcome} />
                <div className="sj-ai-toolset">
                  <span className="sj-eyebrow">Tools</span>
                  <Tools tools={t.tools} />
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
