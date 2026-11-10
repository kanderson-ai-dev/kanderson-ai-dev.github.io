/**
 * Look module for the MCP Agent Toolkit flagship — palette, finish layer
 * (grain, vignette, grade), board backdrop, glow helpers (Plan_video.md §2.1).
 */
import React from "react";
import { C, titleFont, monoFont, bodyFont } from "../upgrade/utheme";
import { Grain } from "../upgrade/primitives";

export { titleFont, monoFont, bodyFont };

/** Film palette — the site accent set + the film's own neutral scale. */
export const MC = {
  bg: "#05070B",
  panel: "#0A1016",
  panel2: "#0F1820",
  line: "#14303A",
  dim: "#3E5C63",
  muted: "#86A7AD",
  text: "#E9FBF7",
  code: C.accent, // #00F5D4 — code / deterministic gates
  model: C.model, // #9B8CFF — model (agent / judge)
  human: C.human, // #FFC857 — human
  danger: C.danger, // #FF4D6D — blocked / failed / tampered
  // product-console replica tokens (frontend dark theme, index.css)
  pc: {
    page: "#020617",
    raised: "#0F172A",
    overlay: "#1E293B",
    lineStrong: "#334155",
    ink: "#F1F5F9",
    soft: "#CBD5E1",
    muted: "#94A3B8",
    accent: "#A5B4FC",
    ok: "#6EE7B7",
    danger: "#FDA4AF",
    warn: "#FCD34D",
  },
} as const;

/** Layered neon glow — boxShadow string. */
export const glow = (color: string, i1 = 40, i2 = 110): string =>
  `0 0 ${i1}px ${color}66, 0 0 ${i2}px ${color}2e`;

/** Text glow. */
export const tglow = (color: string, i1 = 34, i2 = 90): string =>
  `0 0 ${i1}px ${color}99, 0 0 ${i2}px ${color}44`;

/** Shared board backdrop: deep base + grid + circuit traces + haze. */
export const Board: React.FC<{ opacity?: number }> = ({ opacity = 1 }) => (
  <>
    <div
      style={{
        position: "absolute",
        inset: 0,
        opacity,
        backgroundImage:
          "linear-gradient(#0d2028 1px, transparent 1px), linear-gradient(90deg, #0d2028 1px, transparent 1px)",
        backgroundSize: "80px 80px",
        maskImage: "radial-gradient(ellipse 90% 80% at 50% 45%, black 30%, transparent 100%)",
        WebkitMaskImage: "radial-gradient(ellipse 90% 80% at 50% 45%, black 30%, transparent 100%)",
      }}
    />
    <svg width="1920" height="1080" style={{ position: "absolute", inset: 0, opacity: 0.5 * opacity }}>
      {[
        "M0 300 H340 V180 H760",
        "M1920 260 H1560 V140 H1180",
        "M0 780 H300 V920 H700",
        "M1920 820 H1620 V940 H1240",
        "M0 520 H180",
        "M1740 520 H1920",
      ].map((d) => (
        <path key={d} d={d} stroke="#134049" strokeWidth={2} fill="none" opacity={0.55} />
      ))}
      {[
        [340, 300], [760, 180], [1560, 260], [1180, 140], [300, 780], [700, 920], [1620, 820], [1240, 940], [180, 520], [1740, 520],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={5} fill="#134049" />
      ))}
    </svg>
    {/* volumetric haze — two soft radial washes */}
    <div
      style={{
        position: "absolute",
        inset: 0,
        opacity,
        background:
          "radial-gradient(ellipse 55% 45% at 30% 40%, rgba(0,245,212,0.05), transparent 70%), radial-gradient(ellipse 50% 45% at 75% 60%, rgba(155,140,255,0.05), transparent 70%)",
      }}
    />
  </>
);

/** Full-frame finish: grain + vignette + gentle cool grade. Render last. */
export const Finish: React.FC = () => (
  <>
    <Grain opacity={0.05} />
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        background: "radial-gradient(ellipse 115% 105% at 50% 46%, transparent 62%, rgba(0,0,0,0.42) 100%)",
      }}
    />
  </>
);

/** Upper-case mono label used for CODE/MODEL/HUMAN legend and kickers. */
export const Label: React.FC<{ text: string; color?: string; size?: number; spacing?: number }> = ({
  text,
  color = MC.muted,
  size = 22,
  spacing = 4,
}) => (
  <div style={{ fontFamily: monoFont, fontSize: size, color, letterSpacing: spacing, textTransform: "uppercase" }}>
    {text}
  </div>
);
