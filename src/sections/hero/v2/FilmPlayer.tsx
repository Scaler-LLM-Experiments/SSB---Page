'use client';

import * as React from 'react';
import { GlassButton } from '@kishanscaler/ssx-ui';
import { Play } from '@phosphor-icons/react';
import './film-player.css';

/**
 * The hero's framed video as a YouTube player, in two states, both under
 * YouTube's own controls rebuilt (`Controls`):
 *
 * - The preview: the silent loop already playing in the card, with the big play
 *   button and just the scrubber, spanning the full film (`length`, 4:48): it
 *   runs with the loop, shows times on hover, and a click or drag opens the film
 *   at that point. The big button opens it from the start.
 * - The film: the full film from YouTube in the frame (the embed's controls
 *   off), under the same controls: scrub, play/pause, mute, the time against
 *   the film's length, fullscreen; they fade while it plays untouched; a click
 *   toggles play with YouTube's centre flash, a double click goes fullscreen,
 *   and YouTube's keys work (k or space, m, f, j/l, arrows).
 *
 * The preview is `data-video-play`, faded in by HeroV2Motion as the video
 * frames. While the film is open the card carries `data-film-open` (hiding the
 * caption and the preview) and the loop pauses; a `film:close` event on the
 * card (scrolling out of the frame, or away) closes it and the loop carries on.
 */
export function FilmPlayer({
  youtubeId,
  length = 0,
  title = 'Scaler School of Business campus film',
}: {
  youtubeId: string;
  /** The film's length in seconds, for the preview's scrubber. */
  length?: number;
  title?: string;
}) {
  const previewRef = React.useRef<HTMLDivElement>(null);
  // Closed, or open from a point in the film (seconds).
  const [open, setOpen] = React.useState<{ start: number } | null>(null);
  const openFilm = React.useCallback((start = 0) => setOpen({ start }), []);

  React.useEffect(() => {
    const card = previewRef.current?.closest('[data-video-card]');
    if (!card) return;
    const close = () => setOpen(null);
    card.addEventListener('film:close', close);
    return () => card.removeEventListener('film:close', close);
  }, []);

  React.useEffect(() => {
    const card = previewRef.current?.closest('[data-video-card]');
    if (!open || !card) return;
    const loop = card.querySelector('video');
    card.setAttribute('data-film-open', '');
    loop?.pause();
    return () => {
      card.removeAttribute('data-film-open');
      void loop?.play();
    };
  }, [open]);

  // The preview's source: the loop's time on the film's length. Drawn only while
  // the preview shows (the motion has faded it in) and the film is closed. A
  // seek, once the pointer lets go, opens the film there.
  const preview = React.useMemo<Source>(() => {
    const loop = () => previewRef.current?.closest('[data-video-card]')?.querySelector('video') ?? null;
    return {
      active: () => {
        const wrapper = previewRef.current;
        const visibility = wrapper?.style.visibility;
        return !!visibility && visibility !== 'hidden' && !wrapper?.closest('[data-film-open]');
      },
      time: () => loop()?.currentTime ?? 0,
      duration: () => length,
      loaded: () => 0,
      seek: (seconds, final) => {
        if (final) openFilm(seconds);
      },
    };
  }, [length, openFilm]);

  return (
    <>
      {/* The wrapper fades, not the button: Button's own transition fights a tween on it. */}
      <div
        ref={previewRef}
        data-video-play
        data-surface-ink="on-image"
        className="pointer-events-none invisible absolute inset-0 grid place-items-center opacity-0"
      >
        <GlassButton
          size="icon-lg"
          aria-label="Play the campus film"
          className="pointer-events-auto size-20"
          onClick={() => openFilm()}
        >
          <Play weight="fill" className="size-8" />
        </GlassButton>
        <Controls source={preview} bare />
      </div>
      {open ? <Film youtubeId={youtubeId} start={open.start} title={title} /> : null}
    </>
  );
}

/* ---- The controls, for any source ---- */

/** What the controls read and drive: the loop, or the YouTube film. */
type Source = {
  /** Whether to draw at all this frame (default: always). */
  active?: () => boolean;
  time: () => number;
  duration: () => number;
  /** Share of the film buffered, 0–1. */
  loaded: () => number;
  /** `final`: the pointer let go (YouTube fetches ahead only then). */
  seek: (seconds: number, final: boolean) => void;
};

/** Seconds as YouTube writes them: 0:15, 4:48, 1:02:07. A length is rounded up (the film runs
 * a fraction over 287s, and YouTube lists it as 4:48); a time into the film is rounded down. */
function clock(seconds: number, length = false): string {
  const s = Math.max(0, length ? Math.ceil(seconds) : Math.floor(seconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const ss = String(s % 60).padStart(2, '0');
  return h ? `${h}:${String(m).padStart(2, '0')}:${ss}` : `${m}:${ss}`;
}

/**
 * YouTube's controls: the progress bar (3px, 5px under the pointer; played,
 * buffered, the knob, a time tooltip; drag to scrub), then play/pause, mute,
 * the time, fullscreen. `bare`: the bar alone, along the bottom edge (YouTube's
 * preview). The bar and the time are drawn every frame straight to the DOM, by
 * transform: no layout, so no layout shift as the film plays.
 */
function Controls({
  source,
  bare = false,
  playing = false,
  muted = false,
  ended = false,
  fullscreen,
  onToggle,
  onMute,
  onFullscreen,
}: {
  source: Source;
  bare?: boolean;
  playing?: boolean;
  muted?: boolean;
  ended?: boolean;
  fullscreen?: boolean;
  onToggle?: () => void;
  onMute?: () => void;
  onFullscreen?: () => void;
}) {
  const bar = React.useRef<HTMLDivElement>(null);
  const now = React.useRef<HTMLSpanElement>(null);
  const total = React.useRef<HTMLSpanElement>(null);
  const tip = React.useRef<HTMLSpanElement>(null);
  const length = React.useRef(0);
  const scrubbing = React.useRef(false);

  const draw = React.useCallback((fraction: number) => {
    const el = bar.current;
    if (!el) return;
    el.style.setProperty('--played', String(fraction));
    if (now.current) now.current.textContent = clock(fraction * length.current);
    el.setAttribute('aria-valuenow', String(Math.round(fraction * length.current)));
    el.setAttribute(
      'aria-valuetext',
      `${clock(fraction * length.current)} of ${clock(length.current, true)}`,
    );
  }, []);

  React.useEffect(() => {
    let raf = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (source.active && !source.active()) return;
      const duration = source.duration();
      if (!duration) return;
      if (duration !== length.current) {
        length.current = duration;
        if (total.current) total.current.textContent = clock(duration, true);
        bar.current?.setAttribute('aria-valuemax', String(Math.round(duration)));
      }
      bar.current?.style.setProperty('--loaded', String(source.loaded()));
      if (!scrubbing.current) draw(source.time() / duration);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [source, draw]);

  // Scrubbing: the pointer's place on the bar, previewed on hover, sought on drag.
  const fractionAt = (clientX: number) => {
    const box = bar.current!.getBoundingClientRect();
    return Math.min(1, Math.max(0, (clientX - box.left) / box.width));
  };
  const hoverAt = (clientX: number) => {
    const fraction = fractionAt(clientX);
    bar.current?.style.setProperty('--hover', String(fraction));
    if (tip.current) tip.current.textContent = clock(fraction * length.current);
    return fraction;
  };
  const onDown = (event: React.PointerEvent) => {
    if (!length.current) return;
    scrubbing.current = true;
    bar.current?.setPointerCapture(event.pointerId);
    const fraction = hoverAt(event.clientX);
    draw(fraction);
    source.seek(fraction * length.current, false);
  };
  const onMove = (event: React.PointerEvent) => {
    const fraction = hoverAt(event.clientX);
    if (!scrubbing.current) return;
    draw(fraction);
    source.seek(fraction * length.current, false);
  };
  const onUp = (event: React.PointerEvent) => {
    if (!scrubbing.current) return;
    scrubbing.current = false;
    source.seek(fractionAt(event.clientX) * length.current, true);
  };
  const onKey = (event: React.KeyboardEvent) => {
    if (!length.current) return;
    const step = { ArrowLeft: -5, ArrowRight: 5 }[event.key];
    const to =
      step !== undefined
        ? Math.min(length.current, Math.max(0, source.time() + step))
        : { Home: 0, End: length.current }[event.key];
    if (to === undefined) return;
    event.preventDefault();
    event.stopPropagation();
    source.seek(to, true);
    draw(to / length.current);
  };

  return (
    <div className="yt-chrome" data-bare={bare || undefined}>
      {bare ? null : <div className="yt-gradient" />}
      <div className="yt-bottom">
        <div
          ref={bar}
          className="yt-progress"
          role="slider"
          tabIndex={0}
          aria-label="Seek"
          aria-valuemin={0}
          aria-valuemax={0}
          aria-valuenow={0}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onKeyDown={onKey}
        >
          <div className="yt-progress-list">
            <div className="yt-progress-loaded" />
            <div className="yt-progress-hover" />
            <div className="yt-progress-played" />
          </div>
          <div className="yt-knob-track">
            <div className="yt-knob" />
          </div>
          <div className="yt-tooltip-track">
            <span ref={tip} className="yt-tooltip" />
          </div>
        </div>

        {bare ? null : (
          <div className="yt-controls">
            <button
              type="button"
              className="yt-button"
              aria-label={ended ? 'Replay' : playing ? 'Pause (k)' : 'Play (k)'}
              onClick={onToggle}
            >
              {ended ? <ReplayIcon /> : playing ? <PauseIcon /> : <PlayIcon />}
            </button>
            <button
              type="button"
              className="yt-button"
              aria-label={muted ? 'Unmute (m)' : 'Mute (m)'}
              onClick={onMute}
            >
              {muted ? <VolumeOffIcon /> : <VolumeIcon />}
            </button>
            <div className="yt-time">
              <span ref={now}>0:00</span>
              <span className="yt-time-separator"> / </span>
              <span ref={total} className="yt-time-duration">
                0:00
              </span>
            </div>
            <span className="yt-spacer" />
            {onFullscreen ? (
              <button
                type="button"
                className="yt-button"
                aria-label={fullscreen ? 'Exit full screen (f)' : 'Full screen (f)'}
                onClick={onFullscreen}
              >
                {fullscreen ? <ExitFullscreenIcon /> : <FullscreenIcon />}
              </button>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}

/* ---- The YouTube IFrame API (only what is used) ---- */

type YTPlayer = {
  playVideo(): void;
  pauseVideo(): void;
  seekTo(seconds: number, allowSeekAhead: boolean): void;
  getCurrentTime(): number;
  getDuration(): number;
  getVideoLoadedFraction(): number;
  mute(): void;
  unMute(): void;
  isMuted(): boolean;
  destroy(): void;
};
type YTEvent = { target: YTPlayer; data: number };
type YTNamespace = {
  Player: new (
    element: HTMLElement,
    options: {
      host?: string;
      videoId: string;
      width?: string;
      height?: string;
      playerVars?: Record<string, number>;
      events?: { onReady?: (event: YTEvent) => void; onStateChange?: (event: YTEvent) => void };
    },
  ) => YTPlayer;
};

declare global {
  interface Window {
    YT?: YTNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
}

const ENDED = 0;
const PLAYING = 1;
const BUFFERING = 3;

let youTube: Promise<YTNamespace> | undefined;

/** Loads the IFrame API once, on the first play. */
function loadYouTube(): Promise<YTNamespace> {
  youTube ??= new Promise((resolve) => {
    if (window.YT?.Player) return resolve(window.YT);
    const previous = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previous?.();
      resolve(window.YT!);
    };
    const script = document.createElement('script');
    script.src = 'https://www.youtube.com/iframe_api';
    document.head.append(script);
  });
  return youTube;
}

/** How long the controls stay up after the pointer stops, while playing (YouTube's is ~3s). */
const IDLE_AFTER = 2500;

/* ---- The film ---- */

function Film({ youtubeId, start, title }: { youtubeId: string; start: number; title: string }) {
  const root = React.useRef<HTMLDivElement>(null);
  const frame = React.useRef<HTMLDivElement>(null);
  const player = React.useRef<YTPlayer | null>(null);
  const [state, setState] = React.useState(-1);
  const [muted, setMuted] = React.useState(false);
  const [fullscreen, setFullscreen] = React.useState(false);
  const [idle, setIdle] = React.useState(false);
  const [bezel, setBezel] = React.useState<{ icon: 'play' | 'pause'; key: number } | null>(null);
  const idleTimer = React.useRef(0);

  const playing = state === PLAYING || state === BUFFERING;

  // The player: YouTube replaces an element with its iframe, so it gets one of
  // its own, outside React's tree.
  React.useEffect(() => {
    const host = frame.current!;
    const element = document.createElement('div');
    host.append(element);
    let alive = true;
    loadYouTube().then((YT) => {
      if (!alive) return;
      player.current = new YT.Player(element, {
        host: 'https://www.youtube-nocookie.com',
        videoId: youtubeId,
        width: '100%',
        height: '100%',
        playerVars: {
          autoplay: 1,
          controls: 0,
          disablekb: 1,
          fs: 0,
          iv_load_policy: 3,
          playsinline: 1,
          rel: 0,
        },
        events: {
          onReady: (event) => {
            if (start) event.target.seekTo(start, true);
            event.target.playVideo();
            setMuted(event.target.isMuted());
          },
          onStateChange: (event) => setState(event.data),
        },
      });
    });
    root.current?.focus({ preventScroll: true });
    return () => {
      alive = false;
      player.current?.destroy();
      player.current = null;
      host.replaceChildren();
    };
    // The player is made once per open; `start` is read only then.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [youtubeId]);

  React.useEffect(() => {
    const onChange = () => setFullscreen(document.fullscreenElement === root.current);
    document.addEventListener('fullscreenchange', onChange);
    return () => {
      document.removeEventListener('fullscreenchange', onChange);
      window.clearTimeout(idleTimer.current);
    };
  }, []);

  // The player's methods arrive once it is ready; until then everything reads 0.
  const source = React.useMemo<Source>(
    () => ({
      time: () => player.current?.getCurrentTime?.() ?? 0,
      duration: () => player.current?.getDuration?.() ?? 0,
      loaded: () => player.current?.getVideoLoadedFraction?.() ?? 0,
      seek: (seconds, final) => player.current?.seekTo?.(seconds, final),
    }),
    [],
  );

  const toggle = (flash = false) => {
    const p = player.current;
    if (!p) return;
    if (state === ENDED) {
      p.seekTo(0, true);
      p.playVideo();
    } else if (playing) {
      p.pauseVideo();
    } else {
      p.playVideo();
    }
    if (flash) setBezel({ icon: playing ? 'pause' : 'play', key: Date.now() });
  };
  const toggleMute = () => {
    const p = player.current;
    if (!p) return;
    if (p.isMuted()) p.unMute();
    else p.mute();
    setMuted(!muted);
  };
  const toggleFullscreen = () => {
    if (document.fullscreenElement) void document.exitFullscreen();
    else void root.current?.requestFullscreen();
  };
  const seekBy = (seconds: number) => {
    const p = player.current;
    const length = p?.getDuration?.();
    if (!p || !length) return;
    p.seekTo(Math.min(length, Math.max(0, p.getCurrentTime() + seconds)), true);
  };
  const wake = () => {
    setIdle(false);
    window.clearTimeout(idleTimer.current);
    idleTimer.current = window.setTimeout(() => setIdle(true), IDLE_AFTER);
  };

  // YouTube's keys, while focus is in the player.
  const onKey = (event: React.KeyboardEvent) => {
    const key = event.key.toLowerCase();
    const actions: Record<string, () => void> = {
      k: () => toggle(true),
      ' ': () => toggle(true),
      m: toggleMute,
      f: toggleFullscreen,
      j: () => seekBy(-10),
      l: () => seekBy(10),
      arrowleft: () => seekBy(-5),
      arrowright: () => seekBy(5),
    };
    const action = actions[key];
    if (!action || event.metaKey || event.ctrlKey || event.altKey) return;
    // Space on a focused button presses that button instead.
    if (key === ' ' && (event.target as HTMLElement).tagName === 'BUTTON') return;
    event.preventDefault();
    action();
    wake();
  };

  return (
    <div
      ref={root}
      className="yt-player pointer-events-auto"
      role="region"
      aria-label={title}
      tabIndex={-1}
      data-idle={idle && playing ? '' : undefined}
      onPointerMove={wake}
      onPointerLeave={() => playing && setIdle(true)}
      onKeyDown={onKey}
    >
      <div ref={frame} className="yt-frame" />
      <div className="yt-click" onClick={() => toggle(true)} onDoubleClick={toggleFullscreen} />
      {bezel ? (
        <div key={bezel.key} className="yt-bezel" aria-hidden="true">
          {bezel.icon === 'play' ? <PlayIcon /> : <PauseIcon />}
        </div>
      ) : null}
      <Controls
        source={source}
        playing={playing}
        muted={muted}
        ended={state === ENDED}
        fullscreen={fullscreen}
        onToggle={() => toggle()}
        onMute={toggleMute}
        onFullscreen={toggleFullscreen}
      />
    </div>
  );
}

/* ---- Icons: Material's, as YouTube's player draws them (a 24px glyph in a 36px box) ---- */

function Icon({ d }: { d: string }) {
  return (
    <svg viewBox="-6 -6 36 36" aria-hidden="true">
      <path d={d} fill="currentColor" />
    </svg>
  );
}
const PlayIcon = () => <Icon d="M8 5v14l11-7z" />;
const PauseIcon = () => <Icon d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />;
const ReplayIcon = () => (
  <Icon d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z" />
);
const VolumeIcon = () => (
  <Icon d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
);
const VolumeOffIcon = () => (
  <Icon d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
);
const FullscreenIcon = () => (
  <Icon d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
);
const ExitFullscreenIcon = () => (
  <Icon d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z" />
);
