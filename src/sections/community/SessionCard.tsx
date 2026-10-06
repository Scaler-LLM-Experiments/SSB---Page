'use client';

import * as React from 'react';
import { PlayIcon } from '@phosphor-icons/react';

export type Session = {
  name: string;
  role: string;
  text: string;
  /** YouTube video id; the thumbnail opens it in place. */
  videoId: string;
  thumb: string;
  logo: { name: string; src: string };
};

/**
 * A session card: the same card and type as the section's other video cards
 * (StoryCard: the frame, the name as its title, the line), with the role under
 * the name and the company's logo at its foot. The thumbnail plays the talk in
 * the card (youtube-nocookie), as Scaler School of Technology's do.
 */
export function SessionCard({ name, role, text, videoId, thumb, logo }: Session) {
  const [playing, setPlaying] = React.useState(false);
  return (
    <article className="sc">
      <div className="tk-media" data-part="photo">
        {playing ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
            title={`${name}, ${role}`}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
          />
        ) : (
          <button type="button" className="tk-play" onClick={() => setPlaying(true)} aria-label={`Play: ${name}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={thumb} alt="" width={1280} height={720} loading="lazy" decoding="async" />
            <span className="tk-play-mark" aria-hidden="true">
              <PlayIcon weight="fill" />
            </span>
          </button>
        )}
      </div>
      <div className="sc-body tk-body">
        <h3 className="sc-title" data-part="title">
          {name}
        </h3>
        <p className="tk-role" data-part="description">
          {role}
        </p>
        <p className="sc-text" data-part="description">
          {text}
        </p>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="tk-logo" src={logo.src} alt={logo.name} loading="lazy" data-part="logos" />
      </div>
    </article>
  );
}
