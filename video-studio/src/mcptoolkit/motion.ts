/**
 * Motion tokens for the MCP Agent Toolkit flagship film — the single source
 * of the motion language (Plan_video.md §2.1). Every animated value in this
 * project goes through these helpers so the whole film moves the same way.
 */
import { spring, interpolate } from "remotion";
import type { SpringConfig } from "remotion";

export const MOTION = {
  /** Elements entering the frame — 4-frame anticipation handled by callers,
      2-4 % overshoot via the under-damped spring. */
  arrive: { damping: 14, stiffness: 140, mass: 0.9, overshootClamping: false },
  /** UI state changes — critically damped feel, no overshoot. */
  settle: { damping: 24, stiffness: 190, mass: 1, overshootClamping: false },
  /** Locks, stamps, error chips — fast and hard, callers add squash. */
  snap: { damping: 18, stiffness: 360, mass: 0.7, overshootClamping: false },
  /** Camera moves — heavy and smooth. */
  camera: { damping: 30, stiffness: 90, mass: 1.4, overshootClamping: false },
} as const satisfies Record<string, SpringConfig>;

export const FPS = 60;

/** Spring progress 0→1 starting at `start` frame; clamps before `start`. */
export const inSpring = (
  frame: number,
  start: number,
  cfg: SpringConfig = MOTION.arrive,
): number => spring({ frame: Math.max(0, frame - start), fps: FPS, config: cfg });

/** Linear segment progress 0→1 between `from` and `from + dur` frames. */
export const seg = (frame: number, from: number, dur: number): number =>
  Math.min(1, Math.max(0, (frame - from) / dur));

/** Eased segment (ease-out cubic). */
export const segOut = (frame: number, from: number, dur: number): number => {
  const t = seg(frame, from, dur);
  return 1 - Math.pow(1 - t, 3);
};

/** Staggered spring for item `i` of a group (3-5 frame grid). */
export const stagger = (
  frame: number,
  start: number,
  i: number,
  step = 4,
  cfg: SpringConfig = MOTION.arrive,
): number => inSpring(frame, start + i * step, cfg);

/** Deterministic pseudo-random in [-1, 1] seeded by an integer — no
    Math.random() ever: every animation is a pure function of the frame. */
export const noise1 = (seed: number): number => {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return (x - Math.floor(x)) * 2 - 1;
};

/** Slow ambient drift: deterministic sine blend, amp in px. */
export const drift = (frame: number, seed: number, amp = 0.5): number =>
  amp * (Math.sin(frame * 0.021 + seed * 1.7) * 0.6 + Math.sin(frame * 0.013 + seed * 3.1) * 0.4);

/** Map a spring progress to a scale with light overshoot (arrival pop). */
export const popScale = (p: number, min = 0.85): number =>
  interpolate(p, [0, 1], [min, 1]);
