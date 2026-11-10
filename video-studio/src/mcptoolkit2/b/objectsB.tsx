/** Option B standees + helpers shared by the slice beats. */
import React from "react";
import { T, U, fonts, glow, tglow, rand, lerp, clamp01, ease } from "../theme";
import { WORLD } from "../world";
import type { CamPose } from "./CamWorldB";
import { Tag } from "./CamWorldB";

/* ------------------------------ small helpers ---------------------------- */

export const seg = (f: number, a: number, d: number) => clamp01((f - a) / d);
export const segOut = (f: number, a: number, d: number) => ease(seg(f, a, d));
export const pop = (p: number, over = 0.12) => {
  if (p <= 0) return 0;
  const s = 1 + over;
  const q = 1 - p;
  const v = 1 - q * q * q;
  return v * s - (s - 1);
};

/* ------------------------------ question card ---------------------------- */

export const QuestionCardB: React.FC<{ typed: string; done: boolean; chip?: string }> = ({ typed, done, chip }) => (
  <div
    style={{
      width: 760,
      background: `linear-gradient(160deg, ${T.panel2}f2, ${T.panel}f2)`,
      border: `2.5px solid ${T.code}`,
      borderRadius: 22,
      padding: "30px 36px",
      boxShadow: `0 30px 90px #000000b0, ${glow(T.code, 36, 120)}`,
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
      <span style={{ width: 12, height: 12, borderRadius: 6, background: T.code, boxShadow: `0 0 14px ${T.code}` }} />
      <span style={{ fontFamily: fonts.mono, fontSize: 20, letterSpacing: 5, color: T.muted }}>QUESTION</span>
    </div>
    <div style={{ fontFamily: fonts.title, fontWeight: 700, fontSize: 44, lineHeight: 1.25, color: T.text, minHeight: 118 }}>
      {typed}
      {!done && <span style={{ color: T.code }}>▌</span>}
    </div>
    {chip && (
      <div style={{ marginTop: 16 }}>
        <Tag color={T.model} size={17} bold>{chip}</Tag>
      </div>
    )}
  </div>
);

/* ------------------------------ data monolith ---------------------------- */

const RES_GLYPH: Record<string, React.ReactNode> = {
  database: (
    <svg width="150" height="120" viewBox="0 0 150 120">
      {[0, 1, 2, 3].map((i) => (
        <ellipse key={i} cx="75" cy={22 + i * 26} rx="62" ry="16" fill="none" stroke={T.model} strokeWidth="3.5" />
      ))}
      <path d="M13 22 V96 M137 22 V96" stroke={T.model} strokeWidth="3.5" fill="none" />
    </svg>
  ),
  files: (
    <svg width="150" height="120" viewBox="0 0 150 120">
      {[0, 1, 2].map((i) => (
        <g key={i} transform={`translate(${18 + i * 14}, ${8 + i * 12})`}>
          <path d="M0 12 L0 88 L82 88 L82 26 L68 12 Z" fill="none" stroke={T.model} strokeWidth="3.5" />
          <path d="M68 12 L68 26 L82 26" fill="none" stroke={T.model} strokeWidth="3.5" />
        </g>
      ))}
    </svg>
  ),
  web: (
    <svg width="130" height="130" viewBox="0 0 130 130">
      <circle cx="65" cy="65" r="52" fill="none" stroke={T.model} strokeWidth="3.5" />
      <ellipse cx="65" cy="65" rx="24" ry="52" fill="none" stroke={T.model} strokeWidth="3" />
      <path d="M13 65 H117 M20 38 H110 M20 92 H110" stroke={T.model} strokeWidth="3" fill="none" />
    </svg>
  ),
};

export const MonolithB: React.FC<{ kind: string; label: string; lit: number; h?: number }> = ({ kind, label, lit, h = 300 }) => (
  <div style={{ textAlign: "center" }}>
    <div
      style={{
        width: 220,
        height: h,
        margin: "0 auto",
        borderRadius: 20,
        border: `2.5px solid ${T.model}${lit > 0.5 ? "" : "55"}`,
        background: `linear-gradient(180deg, ${T.panel2}${lit > 0 ? "f2" : "aa"}, ${T.panel}${lit > 0 ? "ee" : "77"})`,
        boxShadow: lit > 0 ? `0 24px 80px #000000b0, ${glow(T.model, 40 * lit, 120 * lit)}` : "0 24px 60px #00000090",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 22,
        opacity: 0.45 + lit * 0.55,
        transform: `translateY(${(1 - lit) * 10}px)`,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* ignite scanline */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(0deg, ${T.model}38 ${lit * 110}%, transparent ${lit * 110 + 4}%)`,
          opacity: lit > 0 && lit < 1 ? 1 : 0,
        }}
      />
      {RES_GLYPH[kind]}
      <div style={{ fontFamily: fonts.mono, fontSize: 21, color: lit > 0.6 ? T.text : T.dim, letterSpacing: 1 }}>{label}</div>
    </div>
  </div>
);

/* --------------------------------- packet --------------------------------- */

export const PacketB: React.FC<{ text: string; danger?: boolean; small?: boolean }> = ({ text, danger, small }) => (
  <div
    style={{
      fontFamily: fonts.mono,
      fontSize: small ? 19 : 23,
      fontWeight: 700,
      color: danger ? "#ffd9e0" : "#d8fff6",
      background: `${danger ? "#2a0d16" : "#06231e"}f2`,
      border: `2.5px solid ${danger ? T.danger : T.code}`,
      borderRadius: 14,
      padding: small ? "10px 18px" : "14px 22px",
      boxShadow: glow(danger ? T.danger : T.code, 30, 90),
      whiteSpace: "nowrap",
    }}
  >
    {text}
  </div>
);

/** Light streak behind a flying packet (plane-space child). */
export const TrailB: React.FC<{ len?: number; color?: string }> = ({ len = 180, color = T.danger }) => (
  <div
    style={{
      position: "absolute",
      right: "70%",
      top: "50%",
      width: len,
      height: 5,
      transform: "translateY(-50%)",
      background: `linear-gradient(90deg, transparent, ${color})`,
      boxShadow: `0 0 18px ${color}`,
      borderRadius: 3,
    }}
  />
);

/* ---------------------------------- gate ---------------------------------- */

export const GateB: React.FC<{ label: string; sub: string; state: "idle" | "pass" | "block"; flash?: number; h?: number }> = ({
  label, sub, state, flash = 0, h = 330,
}) => {
  const c = state === "block" ? T.danger : T.code;
  const lit = state === "idle" ? 0.45 : 1;
  return (
    <div style={{ textAlign: "center" }}>
      {/* arch: two posts + lintel */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "center", height: h }}>
        {[0, 1].map((i) => (
          <div
            key={i}
            style={{
              width: 34,
              height: h,
              borderRadius: 12,
              border: `2.5px solid ${c}`,
              background: `linear-gradient(180deg, ${c}2a, ${c}08)`,
              boxShadow: `0 0 ${22 + flash * 40}px ${c}${state === "idle" ? "44" : "99"}`,
              opacity: lit,
            }}
          />
        ))}
        <div style={{ width: 132, marginLeft: -34, marginRight: -34 }}>
          <div
            style={{
              height: 34,
              marginTop: -2,
              borderRadius: 12,
              border: `2.5px solid ${c}`,
              background: `${c}33`,
              boxShadow: `0 0 ${22 + flash * 40}px ${c}${state === "idle" ? "44" : "99"}`,
              opacity: lit,
            }}
          />
          {/* scan field */}
          <div
            style={{
              height: h - 46,
              marginTop: 8,
              borderRadius: 10,
              background: `repeating-linear-gradient(0deg, ${c}${state === "block" ? "30" : "1c"} 0 3px, transparent 3px 14px)`,
              opacity: state === "idle" ? 0.35 : 0.8,
              boxShadow: `inset 0 0 30px ${c}22`,
            }}
          />
        </div>
      </div>
      <div style={{ marginTop: 14, fontFamily: fonts.mono, fontSize: 21, fontWeight: 700, letterSpacing: 2, color: c, textShadow: tglow(c) }}>{label}</div>
      <div style={{ marginTop: 5, fontFamily: fonts.mono, fontSize: 15, color: T.muted, letterSpacing: 1, textShadow: "0 2px 8px #000" }}>{sub}</div>
    </div>
  );
};

/* --------------------------------- shards --------------------------------- */

export const ShardsB: React.FC<{ p: number; seed: number; n?: number; color?: string; size?: number }> = ({
  p, seed, n = 14, color = T.danger, size = 240,
}) => {
  if (p <= 0) return null;
  const shards = [];
  for (let i = 0; i < n; i++) {
    const r = (j: number) => rand(seed * 97 + i * 13 + j * 7);
    const ang = r(1) * Math.PI * 2;
    const dist = (0.4 + r(2)) * size;
    const x = Math.cos(ang) * dist * p;
    const y = Math.sin(ang) * dist * p * 0.8 + p * p * 60; // slight gravity
    const rot = (r(3) - 0.5) * 720 * p;
    const sc = 0.35 + r(4) * 0.75;
    const o = clamp01(1.25 - p * 1.2);
    const s = 16 + r(5) * 44;
    shards.push(
      <div
        key={i}
        style={{
          position: "absolute",
          left: x,
          top: y,
          width: s,
          height: s * (0.5 + r(6)),
          background: `${color}${i % 3 ? "" : "66"}`,
          border: `1.5px solid ${color}`,
          clipPath: `polygon(${r(7) * 40}% 0%, ${60 + r(8) * 40}% ${r(9) * 45}%, ${55 + r(10) * 45}% 100%, ${r(11) * 35}% ${55 + r(12) * 45}%)`,
          transform: `rotate(${rot}deg) scale(${sc})`,
          opacity: o,
          boxShadow: `0 0 ${14 * o}px ${color}88`,
        }}
      />
    );
  }
  return <>{shards}</>;
};

/* -------------------------------- error chip ------------------------------ */

export const ErrorChipB: React.FC<{ code: string; size?: number }> = ({ code, size = 24 }) => (
  <span
    style={{
      fontFamily: fonts.mono,
      fontSize: size,
      fontWeight: 700,
      color: T.danger,
      background: "#2a0d16f2",
      border: `2.5px solid ${T.danger}`,
      borderRadius: 12,
      padding: "10px 20px",
      boxShadow: glow(T.danger, 26, 80),
      whiteSpace: "nowrap",
    }}
  >
    {code}
  </span>
);

/* ------------------------------ protocol link ----------------------------- */

/** The stdio filament drawn in plane space (inside the board SVG area). */
export const LinkB: React.FC<{ lit?: number; packets?: { p: number; danger?: boolean; y?: number }[] }> = ({ lit = 1, packets = [] }) => {
  const L = WORLD.link;
  const x1 = L.from[0];
  const x2 = L.to[0];
  const z = L.from[2];
  return (
    <>
      {/* the filament */}
      <div
        style={{
          position: "absolute",
          left: `calc(50% + ${x1 * U}px)`,
          top: `calc(50% + ${z * U}px)`,
          width: (x2 - x1) * U,
          height: 6,
          transform: "translateY(-50%)",
          background: `linear-gradient(90deg, ${T.code}cc, ${T.code})`,
          borderRadius: 3,
          boxShadow: `0 0 18px ${T.code}, 0 0 46px ${T.code}55`,
          opacity: 0.55 + lit * 0.45,
        }}
      />
      {packets.map((pk, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `calc(50% + ${lerp(x1, x2, pk.p) * U}px)`,
            top: `calc(50% + ${(pk.y ?? z) * U}px)`,
            transform: "translate(-50%,-50%)",
          }}
        >
          <div
            style={{
              width: 26,
              height: 26,
              borderRadius: 13,
              background: pk.danger ? T.danger : "#d8fff6",
              border: `3px solid ${pk.danger ? T.danger : T.code}`,
              boxShadow: `0 0 16px ${pk.danger ? T.danger : T.code}, 0 0 42px ${pk.danger ? T.danger : T.code}88`,
            }}
          />
        </div>
      ))}
    </>
  );
};

/* ------------------------------- node pieces ------------------------------ */

export const ClientB: React.FC<{ active?: number }> = ({ active = 1 }) => (
  <div
    style={{
      width: 300,
      background: `linear-gradient(160deg, ${T.panel2}f0, ${T.panel}f0)`,
      border: `2.5px solid ${T.model}`,
      borderRadius: 20,
      padding: "20px 24px",
      boxShadow: `0 24px 70px #000000a0, ${glow(T.model, 26, 90)}`,
      opacity: 0.55 + active * 0.45,
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <svg width="34" height="30" viewBox="0 0 34 30">
        <rect x="1.5" y="1.5" width="31" height="20" rx="4" fill="none" stroke={T.model} strokeWidth="2.5" />
        <path d="M9 8 L15 11 L9 14 M16 18 H24" stroke={T.code} strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <path d="M10 27 H24" stroke={T.model} strokeWidth="2.5" strokeLinecap="round" />
      </svg>
      <div>
        <div style={{ fontFamily: fonts.mono, fontSize: 22, fontWeight: 700, color: T.text }}>agent client</div>
        <div style={{ fontFamily: fonts.mono, fontSize: 14, color: T.model, letterSpacing: 1.5 }}>MODEL · LLM LOOP</div>
      </div>
    </div>
  </div>
);

export const ServerB: React.FC<{ litBays?: number[]; offIdx?: number }> = ({ litBays = [1, 1, 1, 1], offIdx = -1 }) => {
  const bays = ["web_search", "db_query", "read_file", "write_file"];
  const subs = ["web · read-only", "sql · read-only", "sandboxed", "sandboxed"];
  return (
    <div
      style={{
        background: `linear-gradient(160deg, ${T.panel2}f4, ${T.panel}f4)`,
        border: `2.5px solid ${T.code}`,
        borderRadius: 22,
        padding: "18px 20px 20px",
        boxShadow: `0 30px 90px #000000b0, ${glow(T.code, 34, 110)}`,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 14 }}>
        <span style={{ fontFamily: fonts.mono, fontSize: 21, fontWeight: 700, color: T.text }}>MCP server · 4 tools</span>
        <span style={{ fontFamily: fonts.mono, fontSize: 13, color: T.dim }}>official SDK</span>
      </div>
      <div style={{ display: "flex", gap: 12 }}>
        {bays.map((b, i) => (
          <div
            key={b}
            style={{
              width: 150,
              padding: "13px 10px 11px",
              borderRadius: 13,
              border: `2px solid ${i === offIdx ? T.danger : litBays[i] > 0.5 ? T.code : T.line}`,
              background: i === offIdx ? "#220b12cc" : litBays[i] > 0.5 ? `${T.code}12` : "#0a1420aa",
              textAlign: "center",
              boxShadow: litBays[i] > 0.5 && i !== offIdx ? `0 0 ${16 * litBays[i]}px ${T.code}44` : "none",
              opacity: i === offIdx ? 0.45 : 0.55 + litBays[i] * 0.45,
            }}
          >
            <div style={{ fontFamily: fonts.mono, fontSize: 16.5, fontWeight: 700, color: i === offIdx ? T.danger : litBays[i] > 0.5 ? T.code : T.dim, whiteSpace: "nowrap" }}>{b}</div>
            <div style={{ fontFamily: fonts.mono, fontSize: 11.5, color: T.dim, marginTop: 3, whiteSpace: "nowrap" }}>{subs[i]}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export { Tag };
