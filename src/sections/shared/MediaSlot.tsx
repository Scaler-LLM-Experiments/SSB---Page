import { PlayIcon } from '@phosphor-icons/react';

import './media-slot.css';

/**
 * A photo or video's place in a layout: the image when there is one, otherwise a
 * marked placeholder (a light, dashed frame with the brief, e.g. "[Photo: Anupam
 * Mittal on campus]"), so sections can be laid out before their assets arrive.
 * Set `src` when the asset lands; `video` adds a play mark.
 */
export function MediaSlot({
  src,
  label,
  ratio = '4 / 3',
  video = false,
  className,
}: {
  src?: string;
  /** What goes here; shown in the placeholder, and the image's alt text. */
  label: string;
  /** CSS aspect-ratio, e.g. '16 / 9'. */
  ratio?: string;
  video?: boolean;
  className?: string;
}) {
  return (
    <div className={`ms ${className ?? ''}`} style={{ aspectRatio: ratio }} data-part="photo" data-empty={!src || undefined}>
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={label} loading="lazy" decoding="async" />
      ) : (
        <span className="ms-label">[{label}]</span>
      )}
      {video ? (
        <span className="ms-play" aria-hidden="true">
          <PlayIcon weight="fill" />
        </span>
      ) : null}
    </div>
  );
}
