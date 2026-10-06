import { ClampText } from './ClampText';
import { MediaSlot } from './MediaSlot';

/** A person: their photo (or its placeholder), name and role. */
export function PersonCard({ name, role, photo }: { name: string; role: string; photo?: string }) {
  return (
    <article className="pc">
      <MediaSlot src={photo} label={`Photo: ${name}`} ratio="4 / 5" />
      <h3 className="pc-name" data-part="title">
        {name}
      </h3>
      <p className="pc-role" data-part="description">
        {role}
      </p>
    </article>
  );
}

/**
 * A story, session or article: its media (or placeholder), an optional kicker,
 * the title and a line. A missing line shows as "Copy to come".
 */
export function StoryCard({
  media,
  mediaLabel,
  ratio = '4 / 3',
  video,
  kicker,
  title,
  text,
  href,
  clamp,
}: {
  media?: string;
  mediaLabel: string;
  ratio?: string;
  video?: boolean;
  kicker?: string;
  title: string;
  text?: string;
  /** Where the media leads (a video on YouTube), opened in a new tab. */
  href?: string;
  /** Cut the line to this many lines, with "More" to expand it. */
  clamp?: number;
}) {
  const slot = <MediaSlot src={media} label={mediaLabel} ratio={ratio} video={video} />;
  return (
    <article className="sc">
      {href ? (
        <a
          className="sc-media-link"
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Watch: ${title}`}
        >
          {slot}
        </a>
      ) : (
        slot
      )}
      <div className="sc-body">
        {kicker ? (
          <p className="sc-kicker" data-part="title">
            {kicker}
          </p>
        ) : null}
        <h3 className="sc-title" data-part="title">
          {title}
        </h3>
        {text && clamp ? (
          <div data-part="description">
            <ClampText lines={clamp} className="sc-text">
              {text}
            </ClampText>
          </div>
        ) : (
          <p className={`sc-text ${text ? '' : 'sc-todo'}`} data-part="description">
            {text ?? 'Copy to come.'}
          </p>
        )}
      </div>
    </article>
  );
}
