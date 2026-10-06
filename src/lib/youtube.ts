/**
 * The YouTube IFrame API, only what the lab uses: loaded once, on first use,
 * from youtube.com (the players themselves use youtube-nocookie). Shared by
 * the hero's film (FilmPlayer) and Why SSB's breaker.
 */

export type YTPlayer = {
  playVideo(): void;
  pauseVideo(): void;
  seekTo(seconds: number, allowSeekAhead: boolean): void;
  getCurrentTime(): number;
  getDuration(): number;
  getVideoLoadedFraction(): number;
  unloadModule?(name: string): void;
  mute(): void;
  unMute(): void;
  isMuted(): boolean;
  destroy(): void;
};
export type YTEvent = { target: YTPlayer; data: number };
export type YTNamespace = {
  Player: new (
    element: HTMLElement,
    options: {
      host?: string;
      videoId: string;
      width?: string;
      height?: string;
      playerVars?: Record<string, number>;
      events?: {
        onReady?: (event: YTEvent) => void;
        onStateChange?: (event: YTEvent) => void;
        onApiChange?: (event: YTEvent) => void;
      };
    },
  ) => YTPlayer;
};

declare global {
  interface Window {
    YT?: YTNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
}

export const ENDED = 0;
export const PLAYING = 1;
export const BUFFERING = 3;

let youTube: Promise<YTNamespace> | undefined;

/** Loads the IFrame API once, on the first use. */
export function loadYouTube(): Promise<YTNamespace> {
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
