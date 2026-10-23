import * as React from 'react';

/**
 * A section title in the page's one pattern (2026-10-23, the team's ask: every header as the
 * Singapore immersion's): a statement, then a quieter second half in the secondary ink. Write it as
 * "Lead.|Tail." and the part after the bar is the tail. No bar: the title as it is.
 */
export function Title({ text }: { text: string }) {
  const i = text.indexOf('|');
  if (i < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, i).trim()} <span className="h-tail">{text.slice(i + 1).trim()}</span>
    </>
  );
}
