import './story-card.css';

export type StoryLogo = { name: string; src: string };

export function StoryCard({
  image,
  title,
  description,
  logo,
  titleAs: Title = 'h3',
}: {
  image: string;
  title: string;
  description: string;
  logo?: StoryLogo;
  titleAs?: 'h3' | 'h4';
}) {
  return (
    <article className="ssx-card" data-variant="overlay">
      <div className="ssx-card__media">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={image} alt="" loading="lazy" data-part="photo" />
      </div>
      <div className="ssx-card__content">
        <div className="ssx-card__body">
          <Title className="ssx-card__title" data-part="title">
            {title}
          </Title>
          <p className="ssx-card__description" data-part="description">
            {description}
          </p>
        </div>
        {logo ? (
          <div className="ssx-logos" data-part="logos">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="ssx-logo" src={logo.src} alt={logo.name} loading="lazy" />
          </div>
        ) : null}
      </div>
    </article>
  );
}
