'use client';

import * as React from 'react';
import { GlassButton } from '@kishanscaler/ssx-ui';
import { Play } from '@phosphor-icons/react';
import './film-player.css';

/**
 * The campus film, played from YouTube inside the hero's framed video, under
 * YouTube's own player controls rebuilt on top (the embed's are switched off):
 * the progress bar (hover to preview a time, drag to scrub), play/pause, mute,
 * the time against the film's length, fullscreen; the controls fade while it
 * plays untouched, a click toggles play with YouTube's centre flash, a double
 * click goes fullscreen, and YouTube's keys work (k or space, m, f, j/l, arrows).
 *
 * Renders the big play button (`data-video-play`, faded in by HeroV2Motion as
 * the video frames). While the film is open the card carries `data-film-open`
 * (hiding the caption and the button) and the silent loop pauses; a `film:close`
 * event on the card (the scroll moment, scrolling away) closes it and the loop
 * carries on.
 */
export function FilmPlayer({
  youtubeId,
  title = 'Scaler School of Business campus film',
}: {
  youtubeId: string;
  title?: string;
}) {
  const playRef = React.useRef<HTMLDivElement>(null);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const card = playRef.current?.closest('[data-video-card]');
    if (!card) return;
    const close = () => setOpen(false);
    card.addEventListener('film:close', close);
    return () => card.removeEventListener('film:close', close);
  }, []);

  React.useEffect(() => {
    const card = playRef.current?.closest('[data-video-card]');
    if (!open || !card) return;
    const loop = card.querySelector('video');
    card.setAttribute('data-film-open', '');
    loop?.pause();
    return () => {
      card.removeAttribute('data-film-open');
      void loop?.play();
    };
  }, [open]);

  return (
    <>
      {/* The wrapper fades, not the button: Button's own transition fights a tween on it. */}
      <div
        ref={playRef}
        data-video-play
        data-surface-ink="on-image"
        className="pointer-events-none invisible absolute inset-0 grid place-items-center opacity-0"
      >
        <GlassButton
          size="icon-lg"
          aria-label="Play the campus film"
          className="pointer-events-auto size-20"
          onClick={() => setOpen(true)}
        >
          <Play weight="fill" className="size-8" />
        </GlassButton>
      </div>
      {open ? <Player youtubeId={youtubeId} title={title} /> : null}
    </>
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

/** Seconds as YouTube writes them: 4:58, 1:02:07. */
function clock(seconds: number): string {
  const s = Math.max(0, Math.floor(seconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const ss = String(s % 60).padStart(2, '0');
  return h ? `${h}:${String(m).padStart(2, '0')}:${ss}` : `${m}:${ss}`;
}

/** How long the controls stay up after the pointer stops, while playing (YouTube's is ~3s). */
const IDLE_AFTER = 2500;

function Player({ youtubeId, title }: { youtubeId: string; title: string }) {
  const root = React.useRef<HTMLDivElement>(null);
  const frame = React.useRef<HTMLDivElement>(null);
  const bar = React.useRef<HTMLDivElement>(null);
  const now = React.useRef<HTMLSpanElement>(null);
  const total = React.useRef<HTMLSpanElement>(null);
  const tip = React.useRef<HTMLSpanElement>(null);
  const player = React.useRef<YTPlayer | null>(null);
  const duration = React.useRef(0);
  const scrubbing = React.useRef(false);
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
  }, [youtubeId]);

  // The progress bar and the time, drawn every frame straight to the DOM, with
  // transforms (no layout, so no layout shift as it plays).
  const draw = React.useCallback((fraction: number) => {
    bar.current?.style.setProperty('--played', String(fraction));
    if (now.current) now.current.textContent = clock(fraction * duration.current);
    bar.current?.setAttribute('aria-valuenow', String(Math.round(fraction * duration.current)));
    bar.current?.setAttribute(
      'aria-valuetext',
      `${clock(fraction * duration.current)} of ${clock(duration.current)}`,
    );
  }, []);

  React.useEffect(() => {
    let raf = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      const p = player.current;
      if (!p?.getDuration) return;
      const length = p.getDuration();
      if (!length) return;
      if (length !== duration.current) {
        duration.current = length;
        if (total.current) total.current.textContent = clock(length);
        bar.current?.setAttribute('aria-valuemax', String(Math.round(length)));
      }
      bar.current?.style.setProperty('--loaded', String(p.getVideoLoadedFraction()));
      if (!scrubbing.current) draw(p.getCurrentTime() / length);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [draw]);

  React.useEffect(() => {
    const onChange = () => setFullscreen(document.fullscreenElement === root.current);
    document.addEventListener('fullscreenchange', onChange);
    return () => {
      document.removeEventListener('fullscreenchange', onChange);
      window.clearTimeout(idleTimer.current);
    };
  }, []);

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
    if (!p || !duration.current) return;
    const to = Math.min(duration.current, Math.max(0, p.getCurrentTime() + seconds));
    p.seekTo(to, true);
    draw(to / duration.current);
  };
  const wake = () => {
    setIdle(false);
    window.clearTimeout(idleTimer.current);
    idleTimer.current = window.setTimeout(() => setIdle(true), IDLE_AFTER);
  };

  // Scrubbing: the pointer's place on the bar, previewed on hover, sought on drag.
  const fractionAt = (clientX: number) => {
    const box = bar.current!.getBoundingClientRect();
    return Math.min(1, Math.max(0, (clientX - box.left) / box.width));
  };
  const hoverAt = (clientX: number) => {
    const fraction = fractionAt(clientX);
    bar.current?.style.setProperty('--hover', String(fraction));
    if (tip.current) tip.current.textContent = clock(fraction * duration.current);
    return fraction;
  };
  const onBarDown = (event: React.PointerEvent) => {
    if (!duration.current) return;
    scrubbing.current = true;
    bar.current?.setPointerCapture(event.pointerId);
    const fraction = hoverAt(event.clientX);
    draw(fraction);
    player.current?.seekTo(fraction * duration.current, false);
  };
  const onBarMove = (event: React.PointerEvent) => {
    const fraction = hoverAt(event.clientX);
    if (!scrubbing.current) return;
    draw(fraction);
    player.current?.seekTo(fraction * duration.current, false);
  };
  const onBarUp = (event: React.PointerEvent) => {
    if (!scrubbing.current) return;
    scrubbing.current = false;
    player.current?.seekTo(fractionAt(event.clientX) * duration.current, true);
  };
  const onBarKey = (event: React.KeyboardEvent) => {
    const p = player.current;
    if (!p || !duration.current) return;
    const to = { Home: 0, End: duration.current }[event.key];
    if (to === undefined) return;
    event.preventDefault();
    event.stopPropagation();
    p.seekTo(to, true);
    draw(to / duration.current);
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
    // Space and Enter on a focused button press that button instead.
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

      <div className="yt-chrome">
        <div className="yt-gradient" />
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
            onPointerDown={onBarDown}
            onPointerMove={onBarMove}
            onPointerUp={onBarUp}
            onKeyDown={onBarKey}
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

          <div className="yt-controls">
            <button
              type="button"
              className="yt-button"
              aria-label={state === ENDED ? 'Replay' : playing ? 'Pause (k)' : 'Play (k)'}
              onClick={() => toggle()}
            >
              {state === ENDED ? <ReplayIcon /> : playing ? <PauseIcon /> : <PlayIcon />}
            </button>
            <button
              type="button"
              className="yt-button"
              aria-label={muted ? 'Unmute (m)' : 'Mute (m)'}
              onClick={toggleMute}
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
            <button
              type="button"
              className="yt-button"
              aria-label={fullscreen ? 'Exit full screen (f)' : 'Full screen (f)'}
              onClick={toggleFullscreen}
            >
              {fullscreen ? <ExitFullscreenIcon /> : <FullscreenIcon />}
            </button>
          </div>
        </div>
      </div>
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
