/**
 * fx — "epic" finishing primitives for the orchestrator flagship rebuild.
 * All deterministic, driven by 0→1 progress values. Reusable by other films.
 */
import React from "react";
import { C, monoFont, titleFont } from "../upgrade/utheme";

export const ease = (t: number) => 1 - Math.pow(1 - Math.min(1, Math.max(0, t)), 3);
export const seg = (t: number, a: number, b: number) => ease((t - a) / (b - a));
export const glow = (c: string, r: number) => `0 0 ${r}px ${c}66`;
export const seeded = (i: number, k: number) => {
  const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453;
  return x - Math.floor(x);
};

/* ------------------------------ Letterbox ------------------------------- */
/* 2.39:1 bars. open=0 → bars closed (cinematic), open=1 → fully open.      */

export const BAR_H = 138;

export const Letterbox: React.FC<{ open: number; color?: string }> = ({ open, color = "#000" }) => {
  const h = BAR_H * (1 - open);
  if (h <= 0.5) return null;
  return (
    <>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: h, background: color, zIndex: 40 }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: h, background: color, zIndex: 40 }} />
    </>
  );
};

/* ------------------------------- ActCard -------------------------------- */
/* Trailer title card: tracked-in type on near-black.                        */

export const ActCard: React.FC<{ t: number; kicker?: string; title: React.ReactNode }> = ({ t, kicker, title }) => {
  const len = typeof title === "string" ? title.length : 18;
  const size = len > 18 ? Math.max(64, Math.floor(118 * 18 / len)) : 118;
  return (
  <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#020304" }}>
    {kicker && (
      <div style={{ fontFamily: monoFont, fontWeight: 600, fontSize: 30, letterSpacing: 14, color: C.muted, marginBottom: 26, opacity: seg(t, 0, 0.2) }}>
        {kicker}
      </div>
    )}
    <div
      style={{
        fontFamily: titleFont, fontWeight: 700, fontSize: size, color: C.text,
        letterSpacing: `${18 - seg(t, 0, 0.55) * 12}px`,
        textShadow: `0 0 60px ${C.accent}33`,
        opacity: seg(t, 0, 0.3),
        transform: `scale(${1.06 - seg(t, 0, 0.55) * 0.06})`,
        whiteSpace: "nowrap",
      }}
    >
      {title}
    </div>
    {/* light sweep under the title */}
    <div
      style={{
        marginTop: 34, width: 620 * seg(t, 0.25, 0.8), height: 3,
        background: `linear-gradient(90deg, transparent, ${C.accent}, transparent)`,
        boxShadow: glow(C.accent, 18),
      }}
    />
  </div>
  );
};

/* ------------------------------ Shockwave ------------------------------- */
/* Expanding ring + radial dust at an impact point.                          */

export const Shockwave: React.FC<{ p: number; x: number; y: number; color?: string; count?: number; r?: number }> = ({
  p, x, y, color = C.accent, count = 10, r = 190,
}) => {
  if (p <= 0 || p >= 1) return null;
  const rad = 30 + p * r;
  return (
    <>
      <div
        style={{
          position: "absolute", left: x - rad, top: y - rad, width: rad * 2, height: rad * 2,
          borderRadius: rad, border: `${6 * (1 - p) + 1}px solid ${color}`,
          opacity: (1 - p) * 0.85, filter: `drop-shadow(0 0 14px ${color})`, pointerEvents: "none",
        }}
      />
      {Array.from({ length: count }, (_, i) => {
        const a = (i / count) * Math.PI * 2 + seeded(i, 9);
        const d = p * (60 + seeded(i, 8) * r);
        const s = 3 + seeded(i, 7) * 5;
        return (
          <div
            key={i}
            style={{
              position: "absolute", left: x + Math.cos(a) * d, top: y + Math.sin(a) * d,
              width: s, height: s, borderRadius: s, background: color,
              opacity: (1 - p) * 0.9, boxShadow: `0 0 ${s * 2}px ${color}`,
            }}
          />
        );
      })}
    </>
  );
};

/* ------------------------------- GodRays -------------------------------- */
/* Volumetric light behind a hero object.                                    */

export const GodRays: React.FC<{ x?: number; y?: number; color?: string; opacity?: number }> = ({
  x = 50, y = 50, color = C.accent, opacity = 1,
}) => (
  <div
    style={{
      position: "absolute", inset: 0, pointerEvents: "none", opacity,
      background: `radial-gradient(ellipse 52% 42% at ${x}% ${y}%, ${color}26, transparent 70%)`,
    }}
  />
);

/* ------------------------------ LensFlare ------------------------------- */
/* Procedural anamorphic flare: one horizontal streak + small ghosts.        */

export const LensFlare: React.FC<{ x: number; y: number; p: number; color?: string }> = ({ x, y, p, color = C.accent }) => {
  if (p <= 0) return null;
  return (
    <>
      <div
        style={{
          position: "absolute", left: 0, right: 0, top: y - 2, height: 4,
          background: `linear-gradient(90deg, transparent, ${color} 50%, transparent)`,
          opacity: p * 0.9, filter: "blur(1px)", boxShadow: `0 0 26px ${color}`,
        }}
      />
      <div
        style={{
          position: "absolute", left: x - 90, top: y - 90, width: 180, height: 180, borderRadius: 90,
          background: `radial-gradient(circle, ${color}55, transparent 65%)`,
          opacity: p,
        }}
      />
      {[0.4, 0.75].map((k, i) => (
        <div
          key={i}
          style={{
            position: "absolute", left: x - 26 + (i === 0 ? -260 : 300) * k * 2, top: y - 26,
            width: 52, height: 52, borderRadius: 26, border: `2px solid ${color}88`,
            opacity: p * 0.5,
          }}
        />
      ))}
    </>
  );
};

/* ------------------------------- RimLight ------------------------------- */
/* A diagonal sheen sweeping across a surface.                               */

export const RimLight: React.FC<{ p: number }> = ({ p }) => {
  if (p <= 0 || p >= 1) return null;
  return (
    <div
      style={{
        position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", borderRadius: "inherit",
        background: `linear-gradient(115deg, transparent ${30 + p * 40}%, #ffffff30 ${44 + p * 40}%, transparent ${58 + p * 40}%)`,
      }}
    />
  );
};

/* --------------------------------- Stamp -------------------------------- */
/* Ink stamp that slams in with a scale punch.                               */

export const Stamp: React.FC<{ t: number; text: string; color?: string; size?: number; rot?: number }> = ({
  t, text, color = C.danger, size = 44, rot = -12,
}) => {
  const s = 1.7 - seg(t, 0, 0.3) * 0.7;
  return (
    <div
      data-qa-stamp
      style={{
        display: "inline-block",
        fontFamily: titleFont, fontWeight: 700, fontSize: size, letterSpacing: 4,
        color, border: `5px solid ${color}`, borderRadius: 12, padding: "10px 26px",
        transform: `rotate(${rot}deg) scale(${s})`, opacity: Math.min(1, seg(t, 0, 0.18) * 2),
        textShadow: glow(color, 16), boxShadow: `inset 0 0 30px ${color}22, ${glow(color, 30)}`,
        background: `${color}0d`, whiteSpace: "nowrap",
      }}
    >
      {text}
    </div>
  );
};
