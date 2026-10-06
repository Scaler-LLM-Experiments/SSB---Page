'use client';

import * as React from 'react';

/**
 * Text cut to `lines` lines with "more" after it, which expands it in place
 * ("less" folds it back). The link only shows when the text is longer than that.
 */
export function ClampText({
  children,
  lines = 2,
  className,
}: {
  children: React.ReactNode;
  lines?: number;
  className?: string;
}) {
  const ref = React.useRef<HTMLParagraphElement>(null);
  const [open, setOpen] = React.useState(false);
  const [long, setLong] = React.useState(false);

  React.useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      if (!open) setLong(el.scrollHeight > el.clientHeight + 1);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [open]);

  return (
    <div className="ct">
      <p
        ref={ref}
        className={className}
        data-open={open || undefined}
        style={open ? undefined : ({ '--ct-lines': lines } as React.CSSProperties)}
      >
        {children}
      </p>
      {long || open ? (
        <button type="button" className="ct-toggle" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
          {open ? 'Less' : 'More'}
        </button>
      ) : null}
    </div>
  );
}
