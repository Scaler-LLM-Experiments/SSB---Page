'use client';

import * as React from 'react';

/**
 * The deadline bar's countdown as the team's mock draws it: each unit's figure on a small glass tile,
 * its name after it ("01 DAY 02 HRS 46 MINS 10 SEC"), ticking every second. The figures are the bar's
 * motion (the seconds draw the eye); screen readers get the deadline once, in words (`label`), not a
 * live count. Before the page has hydrated (and on the server) it shows dashes, so the server and
 * the first client render agree.
 */
export function HeroFrameCountdown({ to, label }: { to: string; label: string }) {
  const end = React.useMemo(() => new Date(to).getTime(), [to]);
  const [now, setNow] = React.useState<number | null>(null);

  React.useEffect(() => {
    setNow(Date.now());
    const t = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(t);
  }, []);

  const left = now === null ? null : Math.max(0, end - now);
  const units: [string, number | null][] = [
    ['Day', left === null ? null : Math.floor(left / 86_400_000)],
    ['Hrs', left === null ? null : Math.floor(left / 3_600_000) % 24],
    ['Mins', left === null ? null : Math.floor(left / 60_000) % 60],
    ['Sec', left === null ? null : Math.floor(left / 1000) % 60],
  ];

  return (
    <time className="hf-count" dateTime={new Date(end).toISOString()}>
      <span className="hf-sr">{label}</span>
      <span className="hf-count-units" aria-hidden="true">
        {units.map(([name, n]) => (
          <span key={name} className="hf-count-unit">
            <span className="hf-count-n">{n === null ? '--' : String(n).padStart(2, '0')}</span>
            {/* the full name on wider screens, its first letter on a phone (D H M S) */}
            <span className="hf-count-name" data-short={name[0]}>
              <span className="hf-count-long">{name}</span>
            </span>
          </span>
        ))}
      </span>
    </time>
  );
}
