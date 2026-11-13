// Design-system primitives (Plan.md §3.5) — the films' look as React components.
import { useEffect, useRef, useState, type ReactNode, type CSSProperties } from 'react';
import { useLang } from '../i18n';
import { HashLink } from './HashLink';
import type { Tone } from '../content/types';
import s from './primitives.module.css';

export const toneColor = (t?: Tone) =>
  t === 'model' ? 'var(--model)' : t === 'human' ? 'var(--human)' : t === 'danger' ? 'var(--danger)' : 'var(--accent)';

const toneClass = (map: { accent: string; model: string; human: string; danger: string }, t?: Tone) =>
  map[t ?? 'accent'];

/* ---------------- Stage + Grain (page background) ---------------- */

export const Stage = ({ dim = false }: { dim?: boolean }) => (
  <div className={`${s.stage} ${dim ? s.stageDim : ''}`} aria-hidden="true" />
);

export const Grain = () => <div className={s.grain} aria-hidden="true" />;

/* ---------------- Reveal (shared IntersectionObserver) ---------------- */

let io: IntersectionObserver | null = null;
const observe = (el: Element) => {
  if (!io) {
    io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add('is-in');
            io!.unobserve(e.target);
          }
        }
      },
      { threshold: 0.18 },
    );
  }
  io.observe(el);
};

export const Reveal = ({
  children,
  className = '',
  as: Tag = 'div',
}: {
  children: ReactNode;
  className?: string;
  as?: 'div' | 'section' | 'span';
}) => {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    if (ref.current) observe(ref.current);
  }, []);
  return (
    <Tag ref={ref as never} className={`reveal ${className}`}>
      {children}
    </Tag>
  );
};

/* ---------------- FrameBrackets ---------------- */

export const FrameBrackets = () => (
  <div className={s.brackets} aria-hidden="true">
    <i />
    <i />
    <i />
    <i />
  </div>
);

/* ---------------- Text ---------------- */

export const Kicker = ({ children }: { children: ReactNode }) => (
  <div className={s.kicker}>{children}</div>
);

export const SplitHeadline = ({
  title,
  accent,
  tone,
  as: Tag = 'h2',
  size,
}: {
  title: string;
  accent?: string;
  tone?: Tone;
  as?: 'h1' | 'h2' | 'h3' | 'div';
  size?: string;
}) => (
  <Tag className={s.headline} style={size ? { fontSize: size } : undefined}>
    {title}
    {accent && (
      <>
        {' '}
        <span
          className={toneClass(
            {
              accent: s.headlineAccent,
              model: s.headlineModel,
              human: s.headlineHuman,
              danger: s.headlineDanger,
            },
            tone,
          )}
          style={{ color: toneColor(tone) }}
        >
          {accent}
        </span>
      </>
    )}
  </Tag>
);

/* ---------------- Chips, pills, badges ---------------- */

export const Chip = ({ children, muted = false, tone }: { children: ReactNode; muted?: boolean; tone?: Tone }) => (
  <span
    className={`${s.chip} ${muted ? s.chipMuted : ''} ${
      tone === 'model' ? s.chipModel : tone === 'human' ? s.chipHuman : tone === 'danger' ? s.chipDanger : ''
    }`}
  >
    {children}
  </span>
);

export const StatusPill = ({
  children,
  tone = 'accent',
}: {
  children: ReactNode;
  tone?: 'accent' | 'human' | 'muted';
}) => <span className={`${s.pill} ${tone === 'accent' ? s.pillAccent : tone === 'human' ? s.pillHuman : s.pillMuted}`}>{children}</span>;

export const Badge = ({ status }: { status: 'live' | 'in-development' | 'planned' }) => {
  const { dict } = useLang();
  return status === 'live' ? (
    <StatusPill tone="accent">{dict.status.live}</StatusPill>
  ) : status === 'in-development' ? (
    <StatusPill tone="human">{dict.status.inDevelopment}</StatusPill>
  ) : (
    <StatusPill tone="muted">{dict.status.planned}</StatusPill>
  );
};

// AccessBadge — "Private" lock chip shown wherever an on-demand project appears.
export const AccessBadge = ({ label }: { label: string }) => (
  <span className={s.accessBadge}>
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="4" y="10.5" width="16" height="10" rx="2.2" />
      <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" />
    </svg>
    {label}
  </span>
);

export const EvidenceChip = ({ kind, children }: { kind: 'measured' | 'simulated'; children: ReactNode }) => (
  <Chip tone={kind === 'simulated' ? 'human' : undefined}>
    <span className={s.evidenceText}>{children}</span>
  </Chip>
);

/* ---------------- Stamp ---------------- */

export const Stamp = ({ children, accent = false }: { children: ReactNode; accent?: boolean }) => (
  <span className={`${s.stamp} ${accent ? s.stampAccent : ''}`}>{children}</span>
);

/* ---------------- Button ---------------- */

export const Button = ({
  href,
  to,
  children,
  variant = 'primary',
  external = false,
  onClick,
}: {
  href?: string;
  to?: string; // in-page / cross-route hash target → router navigation
  children: ReactNode;
  variant?: 'primary' | 'ghost';
  external?: boolean;
  onClick?: () => void;
}) =>
  to ? (
    <HashLink
      to={to}
      onClick={onClick}
      className={`${s.btn} ${variant === 'primary' ? s.btnPrimary : s.btnGhost}`}
    >
      {children}
    </HashLink>
  ) : (
    <a
      href={href}
      onClick={onClick}
      className={`${s.btn} ${variant === 'primary' ? s.btnPrimary : s.btnGhost}`}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {children}
    </a>
  );

/* ---------------- Panels ---------------- */

export const GlassPanel = ({
  children,
  hover = false,
  className = '',
  style,
}: {
  children: ReactNode;
  hover?: boolean;
  className?: string;
  style?: CSSProperties;
}) => (
  <div className={`${s.panel} ${hover ? s.panelHover : ''} ${className}`} style={style}>
    {children}
    <div className={s.rim} aria-hidden="true" />
  </div>
);

export const SkeletonLines = ({ widths = [100, 80, 60] }: { widths?: number[] }) => (
  <div className={s.skel} aria-hidden="true">
    {widths.map((w, i) => (
      <i key={i} style={{ width: `${w}%` }} />
    ))}
  </div>
);

/* ---------------- IconTile ---------------- */

export const IconTile = ({
  icon,
  name,
  job,
  tone = 'accent',
}: {
  icon: ReactNode;
  name: string;
  job?: string;
  tone?: Tone;
}) => (
  <div className={s.tile} style={{ '--tone': toneColor(tone) } as CSSProperties}>
    <div className={s.tileIcon}>{icon}</div>
    <div>
      <div className={s.tileName}>{name}</div>
      {job && <div className={s.tileJob}>{job}</div>}
    </div>
  </div>
);

/* ---------------- ActCard ---------------- */

export const ActCard = ({ children }: { children: ReactNode }) => (
  <Reveal as="section" className={s.actCard}>
    <div className={s.actCardTitle}>{children}</div>
    <div className={s.actCardLine} aria-hidden="true" />
  </Reveal>
);

/* ---------------- LensFlare / GodRays ---------------- */

export const LensFlare = ({ style }: { style?: CSSProperties }) => (
  <div className={s.flare} style={style} aria-hidden="true" />
);

export const GodRays = () => <div className={s.rays} aria-hidden="true" />;

/* ---------------- Counter (count-up on reveal) ---------------- */

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

export const Counter = ({
  value,
  label,
  note,
}: {
  value: string;
  label: string;
  note?: string;
}) => {
  const numeric = /^~?\$?[\d.,]+/.exec(value)?.[0] ?? '';
  const prefix = numeric.replace(/[\d.,]/g, '');
  const target = parseFloat(numeric.replace(/[~$,]/g, '').replace(',', ''));
  const isCountable = Number.isFinite(target) && /^~?\$?[\d]/.test(value);
  const [display, setDisplay] = useState(isCountable ? '0' : value);
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useRef(
    typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches,
  );

  useEffect(() => {
    if (!isCountable || reduced.current) {
      setDisplay(value);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        obs.disconnect();
        const start = performance.now();
        const dur = 1400;
        const decimals = (numeric.split('.')[1] ?? '').length;
        const tick = (now: number) => {
          const p = Math.min(1, (now - start) / dur);
          const cur = target * easeOut(p);
          const formatted = decimals ? cur.toFixed(decimals) : String(Math.round(cur));
          setDisplay(value.replace(numeric, prefix + formatted));
          if (p < 1) requestAnimationFrame(tick);
          else setDisplay(value);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.5 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [value, numeric, target, isCountable]);

  const sizeClass =
    value.length > 16 ? s.valueXs : value.length > 11 ? s.valueSm : value.length > 6 ? s.valueMd : '';

  return (
    <div className={s.counter} ref={ref}>
      <div className={`${s.counterValue} ${sizeClass}`}>{display}</div>
      <div className={s.counterLabel}>{label}</div>
      {note && <div className={s.counterNote}>{note}</div>}
    </div>
  );
};

/* ---------------- EndCard ---------------- */

export const EndCard = ({ children }: { children: ReactNode }) => (
  <div className={s.endcard}>
    <FrameBrackets />
    {children}
    <div className={s.endcardUrl} aria-hidden="true">
      kaarstenanderson.com
    </div>
  </div>
);
