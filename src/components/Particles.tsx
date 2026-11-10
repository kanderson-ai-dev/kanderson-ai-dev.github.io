// Particles — rising, twinkling accent dots (Plan.md §3.3).
// One canvas, deterministic seeded positions, DPR<=2, <=40 dots,
// paused off-screen and in background tabs, lazy-started after LCP,
// static frame under prefers-reduced-motion.
import { useEffect, useRef } from 'react';

const mulberry32 = (seed: number) => () => {
  seed |= 0;
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

export const Particles = ({ count = 32, seed = 7 }: { count?: number; seed?: number }) => {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const rnd = mulberry32(seed);
    const dots = Array.from({ length: Math.min(count, 40) }, () => ({
      x: rnd(),
      y: rnd(),
      r: 0.6 + rnd() * 1.8,
      vy: 0.00018 + rnd() * 0.0005,
      ph: rnd() * Math.PI * 2,
      a: 0.25 + rnd() * 0.55,
    }));

    let w = 0;
    let h = 0;
    let raf = 0;
    let running = false;
    let visible = true;

    const resize = () => {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      const box = canvas.getBoundingClientRect();
      w = box.width;
      h = box.height;
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      for (const d of dots) {
        const y = ((d.y - t * d.vy) % 1 + 1) % 1;
        const tw = reduced ? 1 : 0.55 + 0.45 * Math.sin(t * 0.0016 + d.ph);
        ctx.beginPath();
        ctx.arc(d.x * w, y * h, d.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,245,212,${(d.a * tw).toFixed(3)})`;
        ctx.shadowColor = 'rgba(0,245,212,0.7)';
        ctx.shadowBlur = 6;
        ctx.fill();
      }
    };

    const loop = (t: number) => {
      if (!running) return;
      draw(t * 0.001);
      raf = requestAnimationFrame(loop);
    };

    const start = () => {
      if (running || !visible) return;
      running = true;
      if (reduced) {
        draw(0);
        running = false;
        return;
      }
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const inView = new IntersectionObserver(
      (e) => {
        visible = e[0].isIntersecting;
        if (visible) start();
        else stop();
      },
      { threshold: 0 },
    );
    inView.observe(canvas);

    const onVis = () => (document.hidden ? stop() : start());
    document.addEventListener('visibilitychange', onVis);

    // lazy start after LCP
    if (document.readyState === 'complete') start();
    else addEventListener('load', start, { once: true });

    return () => {
      stop();
      ro.disconnect();
      inView.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      removeEventListener('load', start);
    };
  }, [count, seed]);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
    />
  );
};
