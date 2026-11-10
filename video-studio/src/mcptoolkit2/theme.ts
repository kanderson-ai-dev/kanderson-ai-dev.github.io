/** Shared theme for the rebuilt flagship film (mcptoolkit2). */

export const T = {
  bg: "#04070c",
  bgDeep: "#02040a",
  panel: "#0a1420",
  panel2: "#0e1a2a",
  line: "#16303f",
  grid: "#0b2233",
  text: "#e8fbff",
  muted: "#7fa3b8",
  dim: "#4d6b7d",
  code: "#00F5D4",
  model: "#9b8cff",
  human: "#ffc857",
  danger: "#ff4d6d",
} as const;

export const fonts = {
  title: "'Chakra Petch', sans-serif",
  body: "'Chakra Petch', sans-serif",
  mono: "'JetBrains Mono', monospace",
} as const;

/** Glow helper for DOM elements. */
export const glow = (c: string, a = 30, b = 80) =>
  `0 0 ${a}px ${c}55, 0 0 ${b}px ${c}26`;

export const tglow = (c: string, a = 22, b = 70) =>
  `0 0 ${a}px ${c}66, 0 0 ${b}px ${c}2a, 0 2px 14px rgba(0,0,0,.7)`;

/** Design-space px per world unit (option B uses px directly). */
export const U = 90;

/** Deterministic pseudo-random in [0,1) from an integer seed. */
export const rand = (seed: number) => {
  let s = (seed * 2654435761) >>> 0;
  s ^= s << 13;
  s ^= s >>> 17;
  s ^= s << 5;
  return (s >>> 0) / 4294967296;
};

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
export const ease = (t: number) => t * t * (3 - 2 * t); // smoothstep
