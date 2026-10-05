/**
 * Career prep illustrations that act out their stat on hover: the speaker
 * gestures, the listener nods, the pencil writes. One flat PNG per scene; the
 * moving parts are cut from it with feathered ellipses (the base keeps a soft
 * hole there) and rotated about a pivot, so a few degrees read as motion with
 * no visible seam. Coordinates are in the source image's pixels.
 *
 * Plays while `active`, then eases back to the still frame. Still under
 * reduced motion.
 */
import * as React from 'react';
import type { CareerIcon } from './data';

type Part = { cx: number; cy: number; rx: number; ry: number; px: number; py: number };
type Move = { rot?: number; tx?: number; ty?: number };
type Scene = {
  src: string;
  w: number;
  h: number;
  parts: Record<string, Part>;
  pose: (t: number) => Record<string, Move>;
  /** drawn over the scene each frame (source coordinates), scaled by the play amount */
  overlay?: (ctx: CanvasRenderingContext2D, t: number, amp: number, sample: (x: number, y: number) => string) => void;
};

const bump = (t: number, period: number, len: number, offset = 0) => {
  const u = (((t + offset) % period) + period) % period / len;
  return u < 1 ? Math.sin(Math.PI * u) ** 2 : 0;
};
const smooth = (x: number) => (x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x));

export const SCENES: Partial<Record<CareerIcon, Scene>> = {
  // two people at a round table: he talks in phrases, she listens and nods
  behaviour: {
    src: '/career/conversation-table.webp', w: 1254, h: 1254,
    parts: {
      manHead: { cx: 330, cy: 385, rx: 165, ry: 180, px: 395, py: 535 },
      manHand: { cx: 615, cy: 705, rx: 125, ry: 85, px: 530, py: 770 },
      womanHead: { cx: 1010, cy: 405, rx: 180, ry: 140, px: 900, py: 545 },
    },
    pose: (t) => {
      const talk = smooth(0.5 + 1.3 * Math.sin((2 * Math.PI * t) / 6));
      return {
        manHand: { rot: talk * (6 * Math.sin(t * 2.6) + 3 * Math.sin(t * 4.3 + 1)) - 1.5, ty: -talk * 7 * Math.abs(Math.sin(t * 2.6)) },
        manHead: { rot: talk * (2 * Math.sin(t * 1.6) + 1 * Math.sin(t * 3.4 + 0.5)), ty: talk * 1.5 * Math.sin(t * 3) },
        womanHead: { rot: -(3 * bump(t, 3.4, 1.1, 1.2) + 1.8 * bump(t, 5.3, 0.9, 3)) + 1.2 * Math.sin(t * 0.5) },
      };
    },
  },
  // a video interview: she nods along and types, the interviewer on screen talks
  interviews: {
    src: '/career/interview-call.webp', w: 1254, h: 1254,
    parts: {
      head: { cx: 370, cy: 300, rx: 235, ry: 235, px: 440, py: 560 },
      hands: { cx: 690, cy: 935, rx: 110, ry: 70, px: 690, py: 960 },
      screen: { cx: 1030, cy: 715, rx: 95, ry: 120, px: 1030, py: 860 },
    },
    pose: (t) => ({
      head: { rot: 2.4 * bump(t, 3.1, 1, 0.6) + 0.8 * Math.sin(t * 0.9) },
      hands: { ty: -2.5 * Math.max(0, Math.sin(t * 11)) * (Math.sin(t * 1.4) > -0.2 ? 1 : 0), tx: 1.5 * Math.sin(t * 2.1) },
      screen: { rot: 2.2 * Math.sin(t * 2.4) + 1 * Math.sin(t * 3.9), ty: 1.5 * Math.sin(t * 4.3) },
    }),
  },
  // a timed study session at a desk: he writes, and on hover the desk timer rings: it rattles,
  // its display flashes and sound arcs pulse out from it
  hours: {
    src: '/career/study-desk-wide.webp', w: 1774, h: 887,
    parts: {
      head: { cx: 1131, cy: 244, rx: 165, ry: 140, px: 1121, py: 419 },
      hand: { cx: 1001, cy: 689, rx: 95, ry: 85, px: 1051, py: 759 },
      clock: { cx: 1649, cy: 766, rx: 100, ry: 64, px: 1649, py: 819 },
    },
    pose: (t) => {
      const line = (t / 2.4) % 1; // write across, then hop back
      const x = line < 0.85 ? (line / 0.85) * 8 : 8 * (1 - (line - 0.85) / 0.15);
      const ring = (t % 1.6) < 0.9 ? 1 : 0; // rings in bursts
      return {
        hand: { tx: x - 4 + 1.2 * Math.sin(t * 15), ty: 1.4 * Math.sin(t * 12 + 0.4), rot: 1.2 * Math.sin(t * 8) },
        head: { rot: 0.9 * Math.sin(t * 1.2) + 1.6 * bump(t, 1.6, 0.5, 0.2) }, // glances up at the ring
        clock: { rot: ring * 4 * Math.sin(t * 60), ty: ring * -1.5 * Math.abs(Math.sin(t * 30)) },
      };
    },
    overlay: (ctx, t, amp) => {
      if (amp < 0.05) return;
      const ring = (t % 1.6) < 0.9;
      if (!ring) return;
      // sound arcs either side of the timer, pulsing outward
      const k = (t % 0.45) / 0.45;
      ctx.save();
      ctx.lineCap = 'round';
      for (let i = 0; i < 2; i++) {
        const r = 70 + (k + i * 0.5) % 1 * 40;
        const a = amp * (1 - ((k + i * 0.5) % 1)) * 0.85;
        ctx.strokeStyle = `rgba(46, 125, 80, ${a})`;
        ctx.lineWidth = 6;
        for (const dir of [-1, 1]) {
          ctx.beginPath();
          const a0 = dir < 0 ? Math.PI * 0.8 : -Math.PI * 0.2;
          ctx.arc(1649, 739, r + 30, a0, a0 + Math.PI * 0.4);
          ctx.stroke();
        }
      }
      // the display flashes
      if (t % 0.3 < 0.15) {
        ctx.fillStyle = `rgba(160, 255, 200, ${0.35 * amp})`;
        ctx.fillRect(1579, 739, 150, 60);
      }
      ctx.restore();
    },
  },
  // charting the market: eyes move between the laptop and the paper, the pencil draws
  domain: {
    src: '/career/stock.webp', w: 1254, h: 1254,
    parts: {
      head: { cx: 760, cy: 285, rx: 205, ry: 225, px: 810, py: 520 },
      pen: { cx: 810, cy: 920, rx: 155, ry: 120, px: 900, py: 960 },
      pad: { cx: 600, cy: 780, rx: 85, ry: 62, px: 600, py: 800 },
    },
    pose: (t) => ({
      head: { rot: 2.6 * Math.sin(t * 0.9) + 0.8 * bump(t, 3.6, 0.8) },
      pen: { tx: -6 * Math.sin(t * 1.8), ty: 3 * Math.sin(t * 3.6), rot: 2 * Math.sin(t * 1.8 + 0.6) },
      pad: { tx: 2 * Math.sin(t * 1.7), ty: 2 * Math.sin(t * 2.6) },
    }),
  },
  // a block puzzle: he lowers the block onto the stack, steadies it, lifts the next
  oneToOne: {
    src: '/career/puzzle-blocks.webp', w: 1254, h: 1254,
    parts: {
      head: { cx: 420, cy: 220, rx: 205, ry: 215, px: 480, py: 440 },
      block: { cx: 680, cy: 570, rx: 145, ry: 82, px: 600, py: 600 },
      steady: { cx: 1130, cy: 840, rx: 75, ry: 95, px: 1130, py: 880 },
    },
    pose: (t) => {
      const u = (t % 2.6) / 2.6;
      return {
        block: { ty: -10 * (0.5 + 0.5 * Math.cos(2 * Math.PI * u)), rot: 1.4 * Math.sin(t * 2.4) },
        head: { rot: 1.6 * Math.sin(t * 1.1) + 1 * bump(t, 2.6, 0.7, 1.3) },
        steady: { tx: 2 * Math.sin(t * 2), rot: 1.5 * Math.sin(t * 2) },
      };
    },
  },
};

const reduce = (win: Window) => !!win.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
const toRad = (d: number) => (d * Math.PI) / 180;

export function SceneCanvas({ scene, active }: { scene: Scene; active: boolean }) {
  const ref = React.useRef<HTMLCanvasElement>(null);
  const activeRef = React.useRef(active);
  const wake = React.useRef<() => void>(() => undefined);
  activeRef.current = active;

  React.useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;
    const { w: W, h: H, parts } = scene;
    const win = canvas.ownerDocument.defaultView ?? window; // the Lab renders into an iframe
    let base: HTMLCanvasElement | null = null;
    let pieces: Record<string, HTMLCanvasElement> = {};
    let pixels: ImageData | null = null;
    let k = 1; // natural px per source px
    let raf = 0;
    let amp = 0;
    let t = 0;
    let last = 0;
    let gone = false;

    const sample = (x: number, y: number) => {
      if (!pixels) return 'transparent';
      const i = (Math.round(y * k) * pixels.width + Math.round(x * k)) * 4;
      const d = pixels.data;
      return `rgba(${d[i]},${d[i + 1]},${d[i + 2]},${d[i + 3] / 255})`;
    };

    const draw = () => {
      if (!base) return;
      const s = canvas.width / W;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.setTransform(s, 0, 0, s, 0, 0);
      ctx.drawImage(base, 0, 0, W, H);
      const pose = scene.pose(t);
      // the pieces add back into the base's feathered holes: summed, not laid over, so the still frame
      // is the whole picture again (laid over, the feather leaves a see-through ring, plain on a dark card)
      ctx.globalCompositeOperation = 'lighter';
      for (const [name, p] of Object.entries(parts)) {
        const m = pose[name] ?? {};
        ctx.save();
        ctx.translate(p.px + (m.tx ?? 0) * amp, p.py + (m.ty ?? 0) * amp);
        ctx.rotate(toRad((m.rot ?? 0) * amp));
        ctx.translate(-p.px, -p.py);
        ctx.drawImage(pieces[name], 0, 0, W, H);
        ctx.restore();
      }
      ctx.globalCompositeOperation = 'source-over';
      scene.overlay?.(ctx, t, amp, sample);
    };

    const loop = (now: number) => {
      raf = 0;
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 0;
      last = now;
      const target = activeRef.current ? 1 : 0;
      amp += (target - amp) * Math.min(1, dt * 5); // ease in and out over ~0.5s
      if (!target && amp < 0.002) amp = 0;
      t += dt;
      draw();
      if (amp > 0 || target) raf = win.requestAnimationFrame(loop);
      else last = 0;
    };
    wake.current = () => {
      if (!raf && !reduce(win) && base) raf = win.requestAnimationFrame(loop);
    };

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      const dpr = Math.min(2, win.devicePixelRatio || 1);
      canvas.width = Math.max(1, Math.round(r.width * dpr));
      canvas.height = Math.max(1, Math.round(r.height * dpr));
      draw();
    };
    const ro = new ResizeObserver(resize);

    const img = new Image();
    img.decoding = 'async';
    img.onload = () => {
      if (gone) return;
      k = img.naturalWidth / W;
      const mk = () => {
        const c = document.createElement('canvas');
        c.width = img.naturalWidth;
        c.height = img.naturalHeight;
        return c;
      };
      const mask = (p: Part) => {
        const m = mk();
        const g = m.getContext('2d')!;
        g.scale(k, k);
        g.translate(p.cx, p.cy);
        g.scale(1, p.ry / p.rx);
        const grad = g.createRadialGradient(0, 0, 0, 0, 0, p.rx);
        grad.addColorStop(0, '#000');
        grad.addColorStop(0.62, '#000');
        grad.addColorStop(1, 'rgba(0,0,0,0)');
        g.fillStyle = grad;
        g.beginPath();
        g.arc(0, 0, p.rx, 0, Math.PI * 2);
        g.fill();
        return m;
      };
      // the base keeps a feathered hole where each part sits; each piece is just its part
      base = mk();
      const b = base.getContext('2d')!;
      b.drawImage(img, 0, 0);
      if (scene.overlay) pixels = b.getImageData(0, 0, base.width, base.height);
      b.globalCompositeOperation = 'destination-out';
      pieces = {};
      for (const [name, p] of Object.entries(parts)) {
        const m = mask(p);
        b.drawImage(m, 0, 0);
        const pc = mk();
        const g = pc.getContext('2d')!;
        g.drawImage(img, 0, 0);
        g.globalCompositeOperation = 'destination-in';
        g.drawImage(m, 0, 0);
        pieces[name] = pc;
      }
      ro.observe(canvas);
      resize();
      if (activeRef.current) wake.current();
    };
    img.src = scene.src;

    return () => {
      gone = true;
      win.cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [scene]);

  React.useEffect(() => {
    if (active) wake.current();
  }, [active]);

  return <canvas ref={ref} className="sj-pb-canvas" style={{ aspectRatio: `${scene.w} / ${scene.h}` }} aria-hidden="true" />;
}
