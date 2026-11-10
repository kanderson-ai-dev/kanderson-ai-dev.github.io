import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, monoFont, titleFont } from "./utheme";

export const Stage: React.FC<{ dim?: number; children?: React.ReactNode; brackets?: boolean }> = ({ dim = 1, children, brackets = true }) => {
  const f = useCurrentFrame();
  const o = (f * 0.15) % 64;
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      <AbsoluteFill
        style={{
          opacity: 0.14 * dim,
          backgroundImage: `linear-gradient(${C.accent} 1px, transparent 1px), linear-gradient(90deg, ${C.accent} 1px, transparent 1px)`,
          backgroundSize: "64px 64px",
          backgroundPosition: `${o}px ${o}px`,
        }}
      />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, transparent 45%, #000000cc 100%)" }} />
      {children}
      {brackets && <FrameBrackets />}
    </AbsoluteFill>
  );
};

const seeded = (i: number, k: number) => {
  const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453;
  return x - Math.floor(x);
};

export const Particles: React.FC<{ count?: number; color?: string }> = ({ count = 26, color = C.accent }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {Array.from({ length: count }, (_, i) => {
        const bx = seeded(i, 1) * 1920;
        const speed = 0.12 + seeded(i, 2) * 0.45;
        const size = 2 + seeded(i, 3) * 4;
        const y = 1120 - ((seeded(i, 4) * 1120 + f * speed) % 1180);
        const x = bx + Math.sin((f / 60) * (0.3 + seeded(i, 5)) + seeded(i, 6) * 6.28) * 18;
        const tw = 0.2 + 0.3 * (0.5 + 0.5 * Math.sin(f * 0.06 + i * 1.7));
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: size,
              height: size,
              borderRadius: size,
              background: color,
              opacity: tw,
              boxShadow: `0 0 ${size * 2}px ${color}`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

export const Grain: React.FC<{ opacity?: number }> = ({ opacity = 0.05 }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ opacity, mixBlendMode: "overlay", pointerEvents: "none" }}>
      <svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 480 270">
        <filter id="upgrade-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={f % 8} stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="480" height="270" filter="url(#upgrade-grain)" />
      </svg>
    </AbsoluteFill>
  );
};

export const FrameBrackets: React.FC<{ inset?: number; size?: number; color?: string }> = ({ inset = 44, size = 40, color = C.accent }) => {
  const s = (pos: React.CSSProperties): React.CSSProperties => ({ position: "absolute", width: size, height: size, border: `3px solid ${color}`, opacity: 0.7, ...pos });
  return (
    <>
      <div style={s({ top: inset, left: inset, borderRight: 0, borderBottom: 0 })} />
      <div style={s({ top: inset, right: inset, borderLeft: 0, borderBottom: 0 })} />
      <div style={s({ bottom: inset, left: inset, borderRight: 0, borderTop: 0 })} />
      <div style={s({ bottom: inset, right: inset, borderLeft: 0, borderTop: 0 })} />
    </>
  );
};

export const Chip: React.FC<{ text: string; color?: string; size?: number; filled?: boolean }> = ({ text, color = C.accent, size = 26, filled }) => (
  <span
    style={{
      fontFamily: monoFont,
      fontWeight: 600,
      fontSize: size,
      color: filled ? "#04211d" : color,
      background: filled ? color : `${color}1a`,
      border: `2px solid ${color}`,
      borderRadius: 10,
      padding: "6px 16px",
      whiteSpace: "nowrap",
      flexShrink: 0,
    }}
  >
    {text}
  </span>
);

export const StatusPill: React.FC<{ text: string; color: string; size?: number }> = ({ text, color, size = 24 }) => (
  <span
    style={{
      fontFamily: titleFont,
      fontWeight: 700,
      fontSize: size,
      letterSpacing: 1.5,
      textTransform: "uppercase",
      color: "#04211d",
      background: color,
      borderRadius: 999,
      padding: "8px 20px",
      boxShadow: `0 0 24px ${color}66`,
      whiteSpace: "nowrap",
    }}
  >
    {text}
  </span>
);

export const Check: React.FC<{ ok?: boolean; size?: number; color?: string }> = ({ ok = true, size = 34, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    {ok ? (
      <path d="M4 12.5l5.5 5.5L20 6.5" stroke={color ?? C.accent} strokeWidth={3.4} strokeLinecap="round" strokeLinejoin="round" />
    ) : (
      <path d="M5 5l14 14M19 5L5 19" stroke={color ?? C.danger} strokeWidth={3.4} strokeLinecap="round" />
    )}
  </svg>
);

export const LegendDot: React.FC<{ color: string; label: string; size?: number }> = ({ color, label, size = 30 }) => (
  <span style={{ display: "inline-flex", alignItems: "center", gap: 12 }}>
    <span style={{ width: 18, height: 18, borderRadius: 5, background: color, boxShadow: `0 0 14px ${color}` }} />
    <span style={{ fontFamily: titleFont, fontWeight: 700, fontSize: size, color: C.text, letterSpacing: 2, textTransform: "uppercase" }}>{label}</span>
  </span>
);
