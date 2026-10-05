/**
 * A stat that races in (after React Bits' "Speeding Text", number mode): when it
 * scrolls into view it counts up from 0 over DURATION with an ease-out, and its
 * speed drives a motion smear: blur, a horizontal stretch and a forward slant,
 * all fading to nothing as it lands. Group separators fade in as the digits
 * arrive. "1,100+" style values keep their prefix / suffix. Screen readers get
 * the final value only; reduced motion shows it straight away.
 */
import * as React from 'react';

const DURATION = 2200;
const MAX_BLUR = 5; // px: small text needs far less than the 96px reference
const ease = (t: number) => 1 - Math.pow(1 - t, 4);

export function SpeedNumber({ value, className }: { value: string; className?: string }) {
  const m = value.match(/^(\D*)([\d,.]+)(\D*)$/);
  const target = m ? Number(m[2].replace(/,/g, '')) : NaN;
  const ref = React.useRef<HTMLSpanElement>(null);
  const glyphs = React.useRef<HTMLSpanElement>(null);
  const [shown, setShown] = React.useState(Number.isFinite(target) ? 0 : target);
  React.useEffect(() => {
    const el = ref.current;
    if (!el || !Number.isFinite(target)) return undefined;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches || typeof IntersectionObserver === 'undefined') {
      setShown(target);
      return undefined;
    }
    let raf = 0;
    let t0 = 0;
    let prev = 0;
    const frame = (now: number) => {
      if (!t0) t0 = now;
      const t = Math.min(1, (now - t0) / DURATION);
      const e = ease(t);
      // speed, 0–1: how fast the value is moving now relative to its fastest
      const speed = Math.min(1, Math.max(0, (e - prev) * 40));
      prev = e;
      setShown(Math.round(target * e));
      const g = glyphs.current;
      if (g) {
        g.style.filter = speed > 0.02 ? `blur(${(MAX_BLUR * speed).toFixed(2)}px)` : '';
        g.style.transform = speed > 0.02 ? `scaleX(${(1 + 0.18 * speed).toFixed(3)}) skewX(${(-12 * speed).toFixed(2)}deg)` : '';
      }
      if (t < 1) raf = requestAnimationFrame(frame);
    };
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          io.disconnect();
          raf = requestAnimationFrame(frame);
        }
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [target]);
  if (!m || !Number.isFinite(target)) return <span className={className}>{value}</span>;
  const digits = shown.toLocaleString('en-US');
  return (
    <span ref={ref} className={['sj-speed', className].filter(Boolean).join(' ')} aria-label={value} role="text">
      <span aria-hidden="true" className="sj-speed-glyphs" ref={glyphs}>
        {m[1]}
        {digits.split('').map((ch, i) => (ch === ',' ? <span key={i} className="sj-speed-sep">,</span> : ch))}
      </span>
      <span aria-hidden="true">{m[3]}</span>
    </span>
  );
}
