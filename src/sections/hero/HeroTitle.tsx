import * as React from 'react';

/**
 * A hero title with an optional highlighted phrase, in pure white (the ink for
 * text over footage) against the title's softer white on the dark hero.
 * Hyphenated words are kept on one line, so "B-school" never breaks after the
 * hyphen.
 */
export function HeroTitle({ title, highlight }: { title: string; highlight?: string }) {
  const at = highlight ? title.indexOf(highlight) : -1;
  if (!highlight || at < 0) return <>{keepHyphenated(title)}</>;

  return (
    <>
      {keepHyphenated(title.slice(0, at))}
      <span className="text-on-image-ink">{keepHyphenated(highlight)}</span>
      {keepHyphenated(title.slice(at + highlight.length))}
    </>
  );
}

function keepHyphenated(text: string): React.ReactNode[] {
  return text.split(/(\S+-\S+)/).map((part, i) =>
    i % 2 === 1 ? (
      <span key={i} className="whitespace-nowrap">
        {part}
      </span>
    ) : (
      part
    ),
  );
}
