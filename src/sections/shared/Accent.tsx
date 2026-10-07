import * as React from 'react';

/**
 * `text` with `word` in the logo's green (#1D925B, `ssb-light-9`), as Why SSB's roles turn over in:
 * brighter than `content-brand`, which reads near black at the display size; it clears 3:1 on
 * white there. Beyond Placements' "companies.", the Innovation Lab's "10+ startups".
 */
export function Accent({ text, word }: { text: string; word?: string }) {
  const at = word ? text.indexOf(word) : -1;
  if (!word || at < 0) return text;
  return (
    <>
      {text.slice(0, at)}
      <span style={{ color: 'var(--color-ssb-light-9)' }}>{word}</span>
      {text.slice(at + word.length)}
    </>
  );
}
