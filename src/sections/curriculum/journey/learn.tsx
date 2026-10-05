/**
 * SSB "Learn by doing": the two real-business challenges, each one a YouTube
 * video, in the curriculum's card system (8px card, inset media on the inner
 * radius, a glass label on the photo, the same type scale).
 *
 * Each card behaves like a YouTube video: a 16:9 thumbnail with the channel
 * and title across its top, YouTube's red play button in the middle and the
 * duration in the corner. Clicking plays the real video in
 * place (youtube-nocookie embed, autoplay); nothing loads from YouTube until
 * then, so the page stays fast and private.
 */
import * as React from 'react';
import { Heading, Logo, Text } from '@kishanscaler/ssx-ui';
import { CheckCircle, DotsThreeVertical, Play } from '@phosphor-icons/react';
import type { LearnByDoing, LearnChallenge } from './data';
import { c, type JourneyConfig } from './config';

const duration = (s: number) => {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const ss = String(s % 60).padStart(2, '0');
  return h ? `${h}:${String(m).padStart(2, '0')}:${ss}` : `${m}:${ss}`;
};

/** YouTube's play button: the red rounded "pill" with a white triangle. */
function YtPlay() {
  return (
    <svg className="lv-yt" viewBox="0 0 68 48" aria-hidden="true" focusable="false">
      <path className="lv-yt-bg" d="M66.52 7.74c-.78-2.93-2.49-5.41-5.42-6.19C55.79.13 34 0 34 0S12.21.13 6.9 1.55c-2.93.78-4.63 3.26-5.42 6.19C.06 13.05 0 24 0 24s.06 10.95 1.48 16.26c.78 2.93 2.49 5.41 5.42 6.19C12.21 47.87 34 48 34 48s21.79-.13 27.1-1.55c2.93-.78 4.64-3.26 5.42-6.19C67.94 34.95 68 24 68 24s-.06-10.95-1.48-16.26z" />
      <path d="M45 24 27 14v20" fill="#fff" />
    </svg>
  );
}

/** "761 views", "1.5K views": YouTube's short counts. */
const views = (n: number) => (n < 1000 ? `${n}` : n < 1e6 ? `${(n / 1000).toFixed(n < 10000 ? 1 : 0).replace(/\.0$/, '')}K` : `${(n / 1e6).toFixed(1).replace(/\.0$/, '')}M`) + ' views';
/** "10 months ago", "1 year ago": YouTube's relative dates. */
const ago = (iso: string) => {
  const days = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 864e5));
  const [n, u] = days >= 365 ? [Math.floor(days / 365), 'year'] : days >= 30 ? [Math.floor(days / 30), 'month'] : days >= 7 ? [Math.floor(days / 7), 'week'] : [days, 'day'];
  return `${n} ${u}${n === 1 ? '' : 's'} ago`;
};

/**
 * One video, in YouTube's own card format: a bare 16:9 thumbnail with only the
 * duration on it (the red play button shows on hover), then the channel avatar,
 * a two-line title, the channel with its verified tick, views and age, and the
 * ⋮ (it opens the video on YouTube). A click plays it in place.
 */
function VideoCard({ item, cfg }: { item: LearnChallenge; cfg: JourneyConfig }) {
  const [playing, setPlaying] = React.useState(false);
  const titleId = React.useId();
  const descId = React.useId();
  const [more, setMore] = React.useState(false);
  // "Show more" only when the line actually hides text (re-measured as the card resizes)
  const descRef = React.useRef<HTMLParagraphElement>(null);
  const [cut, setCut] = React.useState(true);
  React.useLayoutEffect(() => {
    const el = descRef.current;
    if (!el || more) return undefined;
    const check = () => setCut(el.scrollHeight > el.clientHeight + 1);
    check();
    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => ro.disconnect();
  }, [more]);
  const v = item.video;
  const src = `https://www.youtube-nocookie.com/embed/${v.id}?autoplay=1&rel=0&modestbranding=1&playsinline=1`;
  return (
    <article className="lv-card" aria-labelledby={titleId} {...c(cfg, 'learnCard')}>
      <div className="lv-media" data-playing={playing || undefined}>
        {playing ? (
          <iframe className="lv-frame" src={src} title={v.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen />
        ) : (
          <button type="button" className="lv-thumb" onClick={() => setPlaying(true)} aria-label={`Play video: ${v.title}, ${duration(v.seconds)}`}>
            <img src={item.image} alt="" loading="lazy" decoding="async" />
            <YtPlay />
            <span className="lv-time" aria-hidden="true">
              {duration(v.seconds)}
            </span>
          </button>
        )}
      </div>
      <div className="lv-details">
        <span className="lv-avatar" aria-hidden="true">
          <Logo brand="ssb" variant="monogram" size="sm" surface="light" decorative />
        </span>
        <div className="lv-meta">
          <h3 className="lv-title" id={titleId}>
            {item.title}
          </h3>
          <span className="lv-channel">
            {v.channel}
            <CheckCircle weight="fill" aria-label="Verified" />
          </span>
          <span className="lv-stats">
            <Play weight="regular" aria-hidden="true" />
            {views(v.views)}
            <span aria-hidden="true">·</span>
            {ago(v.published)}
          </span>
          {/* the challenge in a line, cut to one line until "Show more", as a YouTube description */}
          <p ref={descRef} className="lv-more-desc" id={descId} data-open={more || undefined}>
            {item.desc}
          </p>
          {cut || more ? (
            <button type="button" className="lv-toggle" aria-expanded={more} aria-controls={descId} onClick={() => setMore((m) => !m)}>
              {more ? 'Show less' : 'Show more'}
            </button>
          ) : null}
        </div>
        <a className="lv-more" href={`https://www.youtube.com/watch?v=${v.id}`} target="_blank" rel="noreferrer" aria-label={`Watch on YouTube: ${v.title}`}>
          <DotsThreeVertical weight="bold" aria-hidden="true" />
        </a>
      </div>
    </article>
  );
}

/**
 * A swipe deck (m-web: the videos; the career prep phases everywhere). The front card sits on top with the next
 * peeking behind it; drag it sideways past a third of its width (or flick it)
 * and it flies off, then tucks in at the back while the next comes forward.
 * A tap still plays the video; dots below say where you are.
 */
export type DeckItem = { key: React.Key; node: React.ReactNode; name: string };
export function SwipeDeck({ items, label, noun }: { items: DeckItem[]; /** the deck's accessible name */ label: string; /** "Video", "Step": announced as "<noun> 2 of 3: <name>" */ noun: string }) {
  const [order, setOrder] = React.useState(() => items.map((_, i) => i));
  const [dx, setDxState] = React.useState(0);
  const dxRef = React.useRef(0); // the live drag distance (state lags a render behind the pointer)
  const setDx = (v: number) => {
    dxRef.current = v;
    setDxState(v);
  };
  const [leaving, setLeaving] = React.useState<0 | 1 | -1>(0);
  const drag = React.useRef<{ x: number; y: number; id: number; t: number; moved: boolean; axis: 'x' | 'y' | null } | null>(null);
  const cardsRef = React.useRef<(HTMLDivElement | null)[]>([]);
  const [h, setH] = React.useState(0);
  const still = typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  // the deck is as tall as its tallest card (a "Show more" opening grows it)
  React.useEffect(() => {
    const size = () => setH(Math.max(0, ...cardsRef.current.map((el) => el?.offsetHeight ?? 0)));
    const ro = new ResizeObserver(size);
    cardsRef.current.forEach((el) => el && ro.observe(el));
    size();
    return () => ro.disconnect();
  }, []);
  const next = (dir: 1 | -1) => {
    if (leaving) return;
    setLeaving(dir);
    window.setTimeout(
      () => {
        setOrder((o) => [...o.slice(1), o[0]]);
        setLeaving(0);
        setDx(0);
      },
      still ? 0 : 240,
    );
  };
  const onDown = (e: React.PointerEvent) => {
    if (leaving || e.button !== 0) return;
    drag.current = { x: e.clientX, y: e.clientY, id: e.pointerId, t: performance.now(), moved: false, axis: null };
  };
  const onMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d || e.pointerId !== d.id) return;
    const mx = e.clientX - d.x;
    const my = e.clientY - d.y;
    if (!d.axis && Math.hypot(mx, my) > 8) {
      d.axis = Math.abs(mx) > Math.abs(my) ? 'x' : 'y';
      if (d.axis === 'x') (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    }
    if (d.axis === 'x') {
      d.moved = true;
      setDx(mx);
    }
  };
  const onUp = (e: React.PointerEvent) => {
    const d = drag.current;
    drag.current = null;
    if (!d || e.pointerId !== d.id || d.axis !== 'x') return;
    const w = (e.currentTarget as HTMLElement).offsetWidth || 300;
    const moved = dxRef.current;
    const v = moved / Math.max(1, performance.now() - d.t); // px per ms
    if (Math.abs(moved) > w / 3 || Math.abs(v) > 0.6) next(moved < 0 ? -1 : 1);
    else setDx(0);
    // a drag is not a tap: swallow the click it would end with
    if (d.moved) {
      const stop = (ev: Event) => {
        ev.stopPropagation();
        ev.preventDefault();
      };
      window.addEventListener('click', stop, { capture: true, once: true });
      window.setTimeout(() => window.removeEventListener('click', stop, { capture: true }), 50);
    }
  };
  // auto-advance every 3s, like the swipe; it holds while a finger is on it, while a video
  // plays, off screen or in a background tab, and never under reduced motion
  const wrapRef = React.useRef<HTMLDivElement>(null);
  const [tick, setTick] = React.useState(0); // any interaction restarts the 3s
  React.useEffect(() => {
    if (still || items.length < 2) return undefined;
    const t = window.setInterval(() => {
      const el = wrapRef.current;
      if (!el || drag.current || document.hidden || el.querySelector('iframe')) return;
      const r = el.getBoundingClientRect();
      if (r.bottom < 0 || r.top > window.innerHeight) return;
      next(-1);
    }, 3000);
    return () => window.clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tick, still, items.length]);
  const front = order[0];
  return (
    <div ref={wrapRef} className="lv-deck-wrap" onPointerDownCapture={() => setTick((n) => n + 1)}>
      <div className="lv-deck" style={{ height: h ? h + 16 : undefined }} onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp} aria-roledescription="carousel" aria-label={label}>
        {items.map((it, i) => {
          const p = order.indexOf(i); // 0 front, 1 behind, ...
          const isFront = p === 0;
          const x = isFront ? (leaving ? leaving * 108 : 0) : 0;
          // the front follows the finger, then flies out to the side still solid; once the order
          // turns it glides from there into the slot behind, while the next card eases forward
          const style: React.CSSProperties = isFront
            ? { transform: leaving ? `translateX(${x}%) rotate(${leaving * 6}deg)` : `translateX(${dx}px) rotate(${dx / 28}deg)`, zIndex: items.length, transition: drag.current ? 'none' : undefined }
            : { transform: `translateY(${Math.min(p, 2) * 12}px) scale(${1 - Math.min(p, 2) * 0.05})`, zIndex: items.length - p, opacity: p > 1 ? 0 : 1 };
          return (
            <div
              key={it.key}
              ref={(el) => {
                cardsRef.current[i] = el;
              }}
              className="lv-deck-card"
              data-front={isFront || undefined}
              aria-hidden={!isFront || undefined}
              inert={!isFront || undefined}
              style={style}
            >
              {it.node}
            </div>
          );
        })}
      </div>
      <div className="lv-deck-dots" aria-hidden="true">
        {items.map((it, i) => (
          <span key={it.key} data-on={i === front || undefined} />
        ))}
      </div>
      <span className="sj-visually-hidden" aria-live="polite">
        {`${noun} ${front + 1} of ${items.length}: ${items[front].name}`}
      </span>
    </div>
  );
}

/**
 * m-web, Spotify-style: the videos as a playlist. A header on a soft brand
 * gradient (cover, "Playlist", the title, channel · count · total time), the
 * big round play button, then the tracks: a square thumbnail, the title, the
 * channel and views, the duration. A track (or the big play) opens the player
 * above the list; the playing track turns green with moving bars.
 */
function PlaylistMobile({ learn, cfg }: { learn: LearnByDoing; cfg: JourneyConfig }) {
  const [now, setNow] = React.useState<number | null>(null);
  const items = learn.items;
  const total = items.reduce((t, it) => t + it.video.seconds, 0);
  const mins = Math.round(total / 60);
  const play = (i: number) => setNow(i);
  const v = now !== null ? items[now].video : null;
  return (
    <div className="sp" {...c(cfg, 'learnPlaylist')}>
      <div className="sp-head">
        <span className="sp-cover" aria-hidden="true">
          <img src={items[0].image} alt="" loading="lazy" decoding="async" />
        </span>
        <div className="sp-head-text">
          <span className="sp-kind">Playlist</span>
          <span className="sp-title">{learn.eyebrow}</span>
          <span className="sp-meta">
            <span className="sp-by">
              <Logo brand="ssb" variant="monogram" size="sm" surface="light" decorative />
            </span>
            {items[0].video.channel}
          </span>
          <span className="sp-count">
            {items.length} videos · {mins} min
          </span>
        </div>
      </div>
      <div className="sp-controls">
        <span className="sp-hint">{now === null ? 'Tap a video to play it here' : `Playing ${now + 1} of ${items.length}`}</span>
        <button type="button" className="sp-play" aria-label={now === null ? 'Play the playlist' : 'Play the next video'} onClick={() => play(now === null ? 0 : (now + 1) % items.length)}>
          <Play weight="fill" aria-hidden="true" />
        </button>
      </div>
      {v ? (
        <div className="sp-player">
          <iframe key={v.id} src={`https://www.youtube-nocookie.com/embed/${v.id}?autoplay=1&rel=0&modestbranding=1&playsinline=1`} title={v.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen />
        </div>
      ) : null}
      <ol className="sp-list" aria-label={learn.eyebrow}>
        {items.map((it, i) => (
          <li key={it.n}>
            <button type="button" className="sp-track" data-now={now === i || undefined} aria-current={now === i || undefined} onClick={() => play(i)}>
              <span className="sp-thumb" aria-hidden="true">
                <img src={it.image} alt="" loading="lazy" decoding="async" />
                {now === i ? (
                  <span className="sp-eq">
                    <i />
                    <i />
                    <i />
                  </span>
                ) : null}
              </span>
              <span className="sp-track-text">
                <span className="sp-track-title">{it.title}</span>
                <span className="sp-track-sub">
                  {it.video.channel} · {views(it.video.views)}
                </span>
              </span>
              <span className="sp-time">{duration(it.video.seconds)}</span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}

export function LearnByDoingBlock({ learn, cfg }: { learn: LearnByDoing; cfg: JourneyConfig }) {
  const id = React.useId();
  // a small cascade as the section scrolls in: the heading lines, then each card, one beat apart
  // (the same on desktop and m-web; everything shows at once under reduced motion)
  const ref = React.useRef<HTMLElement>(null);
  const [shown, setShown] = React.useState(false);
  // m-web (the section narrower than 768px) swaps the two-up grid for the swipe deck
  const [narrow, setNarrow] = React.useState(false);
  const mobileStyle = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('learn') === 'playlist' ? 'playlist' : 'deck';
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const ro = new ResizeObserver(() => setNarrow(el.clientWidth < 760));
    ro.observe(el);
    setNarrow(el.clientWidth < 760);
    return () => ro.disconnect();
  }, []);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    // an observer, backed by a plain scroll check (observers pause in background tabs), so it can never stay hidden
    const done = () => {
      setShown(true);
      io?.disconnect();
      window.removeEventListener('scroll', check);
    };
    const check = () => {
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight * 0.88 && r.bottom > 0) done();
    };
    const io = typeof IntersectionObserver !== 'undefined' ? new IntersectionObserver((es) => es.some((e) => e.isIntersecting) && done(), { rootMargin: '0px 0px -12% 0px', threshold: 0.15 }) : null;
    io?.observe(el);
    window.addEventListener('scroll', check, { passive: true });
    check();
    return () => {
      io?.disconnect();
      window.removeEventListener('scroll', check);
    };
  }, []);
  return (
    <section ref={ref} className="sj-learn" data-cascade={shown ? 'in' : 'wait'} aria-labelledby={id} {...c(cfg, 'learn')}>
      <header className="sj-learn-head">
        <Heading as="p" size="eyebrow">
          {learn.eyebrow}
        </Heading>
        <Heading as="h2" size="1" id={id}>
          {learn.title} <span className="sj-ai-accent">{learn.titleAccent}</span>
        </Heading>
        <Text size="lg" className="sj-lede">
          {learn.lede}
        </Text>
      </header>
      {narrow ? (
        // m-web: the swipe deck, one card behind another (?learn=playlist tries the playlist look)
        <div className="lv-cascade" style={{ '--i': 3 } as React.CSSProperties}>
          {mobileStyle === 'deck' ? <SwipeDeck items={learn.items.map((it) => ({ key: it.n, name: it.title, node: <VideoCard item={it} cfg={cfg} /> }))} label="Challenge videos" noun="Video" /> : <PlaylistMobile learn={learn} cfg={cfg} />}
        </div>
      ) : (
        <div className="sj-learn-grid">
          {learn.items.map((it, i) => (
            <div key={it.n} className="lv-cascade" style={{ '--i': i + 3 } as React.CSSProperties}>
              <VideoCard item={it} cfg={cfg} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
