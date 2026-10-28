import * as React from 'react';
import './tone.css';

/**
 * One section's tone on the tone variant (/v8, 2026-10-28, the user's ask): light sections stay on the
 * page's white; dark ones become a dark island (`data-brand` and `data-theme` on the same element, as
 * the design system needs), on the dark page ground. `data-section-tone` is what the navbar reads
 * (`SsbNavbar followTone`) to take the tone of the section passing under it.
 */
export function Tone({ dark = false, children }: { dark?: boolean; children: React.ReactNode }) {
  return dark ? (
    <div className="tn tn-dark" data-section-tone="dark" data-brand="ssb" data-theme="dark">
      {children}
    </div>
  ) : (
    <div className="tn" data-section-tone="light">
      {children}
    </div>
  );
}
