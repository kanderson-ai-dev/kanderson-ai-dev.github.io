// LiteYouTube — poster + click-to-load iframe on youtube-nocookie.com (§7).
import { useState } from 'react';
import type { Img } from '../content/types';
import { FrameBrackets } from './primitives';

export const LiteYouTube = ({
  youtubeId,
  poster,
  title,
  comingSoonText,
}: {
  youtubeId: string | null;
  poster: Omit<Img, 'alt'> & { alt: string }; // alt arrives already localized
  title: string;
  comingSoonText: string;
}) => {
  const [active, setActive] = useState(false);

  return (
    <div
      style={{
        position: 'relative',
        aspectRatio: '16 / 9',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        border: '1px solid var(--line)',
        boxShadow: '0 30px 80px rgba(0,0,0,0.6), 0 0 50px rgba(0,245,212,0.08)',
      }}
    >
      {active && youtubeId ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }}
        />
      ) : (
        <>
          <img
            src={poster.src}
            alt={poster.alt}
            width={poster.width}
            height={poster.height}
            loading="lazy"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(180deg, rgba(5,7,9,0.15), rgba(5,7,9,0.45))',
            }}
          />
          {youtubeId ? (
            <button
              type="button"
              onClick={() => setActive(true)}
              aria-label={title}
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                width: 92,
                height: 92,
                borderRadius: '50%',
                background: 'rgba(0,245,212,0.14)',
                border: '2px solid var(--accent)',
                boxShadow: '0 0 44px rgba(0,245,212,0.5), inset 0 0 30px rgba(0,245,212,0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'transform 0.25s var(--ease), box-shadow 0.25s var(--ease)',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'translate(-50%,-50%) scale(1.08)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'translate(-50%,-50%) scale(1)')}
            >
              <svg width="34" height="34" viewBox="0 0 24 24" fill="var(--accent)" aria-hidden="true">
                <path d="M8 5.5v13l11-6.5z" />
              </svg>
            </button>
          ) : (
            <div
              style={{
                position: 'absolute',
                left: '50%',
                bottom: '10%',
                transform: 'translateX(-50%)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8rem',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: 'var(--accent)',
                border: '1px solid rgba(0,245,212,0.4)',
                borderRadius: 999,
                padding: '0.6em 1.4em',
                background: 'rgba(5,7,9,0.75)',
                backdropFilter: 'blur(6px)',
                whiteSpace: 'nowrap',
              }}
            >
              {comingSoonText}
            </div>
          )}
        </>
      )}
      <FrameBrackets />
    </div>
  );
};
