/**
 * Particle text (after React Bits' "Particle Text", rebuilt on a 2D canvas, no
 * WebGL, light enough for a phone). The text is drawn off screen, sampled every
 * GAP px, and each lit sample becomes a particle with a home. Particles gather
 * home from a scatter when the block scrolls into view; a pointer (mouse or a
 * finger) pushes them away within RADIUS, and they drift back with the
 * reference's FRICTION / EASE. Colours are picked at random from `colors`.
 * Auto-fits the width, and breaks onto lines below `breakAt` px.
 * Decorative: aria-hidden (the logo beside it carries the name). Reduced
 * motion: the text is drawn once, still.
 */
import * as React from 'react';

const GAP = 3;
const SIZE = 2;
const FRICTION = 0.75;
const EASE = 0.05;
const RADIUS = 110;
const STRENGTH = 5;

type P = { hx: number; hy: number; x: number; y: number; vx: number; vy: number; c: string };

export function ParticleText({ text, lines, breakAt = 640, colors, className, settled }: { text: string; lines?: string[]; breakAt?: number; colors: string[]; className?: string; /** Start in place (no gather), for still previews. */ settled?: boolean }) {
  const wrap = React.useRef<HTMLDivElement>(null);
  const cvs = React.useRef<HTMLCanvasElement>(null);
  React.useEffect(() => {
    const box = wrap.current;
    const canvas = cvs.current;
    if (!box || !canvas) return undefined;
    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;
    const still = !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const home = still || !!settled;
    let parts: P[] = [];
    let raf = 0;
    let running = false;
    const mouse = { x: -9999, y: -9999 };
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    let W = 0;
    let H = 0;

    const build = () => {
      W = box.clientWidth;
      const rows = W < breakAt && lines?.length ? lines : [text];
      // auto-fit: the widest row fills the width
      const probe = document.createElement('canvas').getContext('2d')!;
      const font = (px: number) => `700 ${px}px 'Plus Jakarta Sans', system-ui, sans-serif`;
      probe.font = font(100);
      const widest = Math.max(...rows.map((r) => probe.measureText(r).width));
      const px = Math.max(24, Math.min(180, (W * 0.98 * 100) / widest));
      const lh = px * 1.05;
      H = Math.ceil(lh * rows.length + px * 0.2);
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      canvas.style.height = `${H}px`;
      const off = document.createElement('canvas');
      off.width = W;
      off.height = H;
      const o = off.getContext('2d')!;
      o.font = font(px);
      o.textBaseline = 'alphabetic';
      o.fillStyle = '#000';
      rows.forEach((r, i) => o.fillText(r, (W - o.measureText(r).width) / 2, px * 0.92 + i * lh));
      const data = o.getImageData(0, 0, W, H).data;
      const next: P[] = [];
      for (let y = 0; y < H; y += GAP)
        for (let x = 0; x < W; x += GAP)
          if (data[(y * W + x) * 4 + 3] > 128) {
            next.push({ hx: x, hy: y, x: home ? x : Math.random() * W, y: home ? y : Math.random() * H, vx: 0, vy: 0, c: colors[(Math.random() * colors.length) | 0] });
          }
      parts = next;
    };

    const draw = () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      for (const p of parts) {
        ctx.fillStyle = p.c;
        ctx.fillRect(p.x, p.y, SIZE, SIZE);
      }
    };

    const step = () => {
      raf = 0;
      let moving = false;
      for (const p of parts) {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < RADIUS * RADIUS) {
          const d = Math.sqrt(d2) || 1;
          const f = ((RADIUS - d) / RADIUS) * STRENGTH;
          p.vx += (dx / d) * f;
          p.vy += (dy / d) * f;
        }
        p.vx = (p.vx + (p.hx - p.x) * EASE) * FRICTION;
        p.vy = (p.vy + (p.hy - p.y) * EASE) * FRICTION;
        p.x += p.vx;
        p.y += p.vy;
        if (!moving && (Math.abs(p.vx) > 0.02 || Math.abs(p.vy) > 0.02 || Math.abs(p.hx - p.x) > 0.3)) moving = true;
      }
      draw();
      // settle: stop the loop until the pointer stirs it again
      if (moving && running) raf = requestAnimationFrame(step);
    };
    const kick = () => {
      if (!still && running && !raf) raf = requestAnimationFrame(step);
    };

    build();
    draw();
    const io = new IntersectionObserver(([e]) => {
      running = e.isIntersecting;
      if (running) kick();
    });
    io.observe(box);
    const ro = new ResizeObserver(() => {
      if (Math.abs(box.clientWidth - W) < 2) return;
      build();
      draw();
      kick();
    });
    ro.observe(box);
    const move = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
      kick();
    };
    const leave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
      kick();
    };
    if (!still) {
      canvas.addEventListener('pointermove', move);
      canvas.addEventListener('pointerdown', move);
      canvas.addEventListener('pointerleave', leave);
      canvas.addEventListener('pointerup', leave);
    }
    // the font may arrive after first paint: rebuild once it has
    document.fonts?.ready.then(() => {
      build();
      if (still) draw();
      kick();
    });
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      canvas.removeEventListener('pointermove', move);
      canvas.removeEventListener('pointerdown', move);
      canvas.removeEventListener('pointerleave', leave);
      canvas.removeEventListener('pointerup', leave);
    };
  }, [text, lines, breakAt, colors, settled]);
  return (
    <div ref={wrap} className={className} aria-hidden="true">
      <canvas ref={cvs} style={{ display: 'block', width: '100%', touchAction: 'pan-y' }} />
    </div>
  );
}
