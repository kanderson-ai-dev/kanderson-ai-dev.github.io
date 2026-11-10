// AmbientLoop — silent muted looping clip cut from a film (Plan.md §5.1, §6).
// Poster first (LCP), video loads after load/idle, never on Save-Data or
// reduced motion (poster only), visible pause button (WCAG 2.2.2).
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import type { Img } from '../content/types';

export const AmbientLoop = ({
  loop,
  className = '',
  style,
  label = 'Pause ambient animation',
  playLabel = 'Play ambient animation',
}: {
  loop: { webm: string; mp4: string; poster: Img };
  className?: string;
  style?: CSSProperties;
  label?: string;
  playLabel?: string;
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [loadVideo, setLoadVideo] = useState(false);
  const [paused, setPaused] = useState(false);
  const noMotion = useRef(
    typeof matchMedia !== 'undefined' &&
      (matchMedia('(prefers-reduced-motion: reduce)').matches ||
        (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData === true),
  );

  useEffect(() => {
    if (noMotion.current) return;
    const start = () => setLoadVideo(true);
    if (document.readyState === 'complete') {
      const id = setTimeout(start, 400);
      return () => clearTimeout(id);
    }
    addEventListener('load', () => setTimeout(start, 400), { once: true });
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v || !loadVideo) return;
    const io = new IntersectionObserver(
      (e) => {
        if (paused) return;
        if (e[0].isIntersecting) void v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.15 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, [loadVideo, paused]);

  const toggle = () => {
    const v = videoRef.current;
    if (!v) return;
    if (paused) {
      void v.play().catch(() => {});
      setPaused(false);
    } else {
      v.pause();
      setPaused(true);
    }
  };

  return (
    <div className={className} style={{ position: 'relative', overflow: 'hidden', ...style }}>
      <img
        src={loop.poster.src}
        alt={loop.poster.alt}
        width={loop.poster.width}
        height={loop.poster.height}
        loading="eager"
        fetchPriority="high"
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
      {loadVideo && (
        <video
          ref={videoRef}
          muted
          loop
          playsInline
          autoPlay
          aria-hidden="true"
          poster={loop.poster.src}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: paused ? 0 : 1,
            transition: 'opacity 0.4s',
          }}
        >
          <source src={loop.webm} type="video/webm" />
          <source src={loop.mp4} type="video/mp4" />
        </video>
      )}
      {loadVideo && (
        <button
          type="button"
          onClick={toggle}
          aria-label={paused ? playLabel : label}
          aria-pressed={paused}
          style={{
            position: 'absolute',
            right: 12,
            bottom: 12,
            zIndex: 2,
            fontFamily: 'var(--font-mono)',
            fontSize: 12,
            letterSpacing: '0.08em',
            color: 'var(--accent)',
            background: 'rgba(5,7,9,0.75)',
            border: '1px solid rgba(0,245,212,0.4)',
            borderRadius: 8,
            padding: '0.4em 0.9em',
            backdropFilter: 'blur(6px)',
          }}
        >
          {paused ? '▶' : '⏸'}
        </button>
      )}
    </div>
  );
};
