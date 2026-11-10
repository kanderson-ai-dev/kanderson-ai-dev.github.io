/**
 * world.ts — the ONE world both renderers share.
 *
 * World units are abstract "u" (option B maps 1 u ≈ 90 px on the ground
 * plane; option A maps them to three.js meters). Coordinates:
 *   x → right,  y → up,  z → toward the camera (front).
 * The board is the x/z plane at y = 0.
 *
 * Every object has ONE home. Beats move the camera, not the furniture.
 */

export type V3 = [number, number, number];

export const WORLD = {
  /** Board extent. */
  board: { x: 16, z: 9 },

  /** Question card floats in front of the client. */
  questionCard: { pos: [-8.6, 2.6, 2.2] as V3 },

  /** Agent client: vertical panel standing at the left end of the link. */
  client: { pos: [-10.4, 0, -0.4] as V3, w: 3.4, h: 3.6 },

  /** Protocol link: client → server, gentle arc. */
  link: { from: [-8.8, 0.9, -0.4] as V3, to: [6.4, 0.9, -0.4] as V3, sag: 0.55 },

  /** The three gates stand across the link (arch openings). */
  gates: [
    { id: "rate", label: "rate limit", pos: [-4.2, 0, -0.4] as V3 },
    { id: "sandbox", label: "sandbox", pos: [-0.4, 0, -0.4] as V3 },
    { id: "sanitizer", label: "sanitizer", pos: [3.4, 0, -0.4] as V3 },
  ],

  /** MCP server block with four bays on its front face — sits a lane behind the gates so it never occludes them. */
  server: { pos: [8.2, 0, -1.9] as V3, w: 4.6, h: 4.4, d: 2.4 },

  /** The three data resources: huge monoliths behind the server. */
  resources: [
    { id: "db", label: "reports.db", kind: "database", pos: [5.2, 0, -5.4] as V3 },
    { id: "fs", label: "/reports/*.md", kind: "files", pos: [8.4, 0, -5.8] as V3 },
    { id: "web", label: "the web", kind: "web", pos: [11.6, 0, -5.4] as V3 },
  ] as const,

  /** Read-only vault, front right. */
  vault: { pos: [10.4, 0, 3.4] as V3 },

  /** Sandbox island: a separate plate at the far right. */
  island: { pos: [13.6, 0, 0.6] as V3, w: 4.4, d: 4.6 },

  /** Front stage — a raised zone in front of the link for showcase beats. */
  stage: { pos: [1.2, 0, 2.6] as V3 },
} as const;

/* ------------------------------------------------------------------------ */
/* Camera                                                                     */
/* ------------------------------------------------------------------------ */

/**
 * One camera spec both options interpret:
 *   target — world point the camera looks at
 *   azDeg  — azimuth (0 = looking straight down -z at the board's -z edge…
 *            we use azimuth 0 ≈ classic 3/4 front view; + swings right)
 *   elDeg  — elevation above the board (0 = board level, ~55 = high 3/4)
 *   dist   — distance to target in world units
 */
export type CamKey = {
  f: number; // local frame the key applies from
  target: V3;
  azDeg: number;
  elDeg: number;
  dist: number;
};

export type BeatSpec = { id: string; dur: number; cam: CamKey[] };

/** Camera choreography for the three slice beats (local frames @60fps). */
export const CAMS: Record<string, CamKey[]> = {
  hook: [
    // macro on the question card, board-level, slow push + drift right
    { f: 0, target: [-8.6, 2.4, 2.2], azDeg: -14, elDeg: 14, dist: 8.6 },
    { f: 66, target: [-8.6, 2.4, 2.2], azDeg: -10, elDeg: 13, dist: 7.6 },
    // widen as the monoliths ignite
    { f: 100, target: [-3.0, 2.0, -1.0], azDeg: -6, elDeg: 17, dist: 13.5 },
    { f: 150, target: [-1.5, 2.0, -1.6], azDeg: -2, elDeg: 18, dist: 14.6 },
    // packet launch — whip right then hold low under the frozen packet
    { f: 190, target: [2.5, 1.6, -1.0], azDeg: 6, elDeg: 12, dist: 12.2 },
    { f: 336, target: [4.6, 1.7, -1.2], azDeg: 9, elDeg: 10.5, dist: 10.8 },
    // frozen hold — tiny drift only
    { f: 465, target: [4.9, 1.7, -1.2], azDeg: 10, elDeg: 10.5, dist: 10.6 },
  ],
  reveal: [
    // snap wide on the drop, gate at center, then push in on the title zone
    { f: 0, target: [1.8, 1.9, -1.0], azDeg: 4, elDeg: 16, dist: 13.6 },
    { f: 26, target: [1.4, 2.0, -0.9], azDeg: 3, elDeg: 15, dist: 12.4 },
    { f: 90, target: [0.6, 2.6, -0.6], azDeg: 0, elDeg: 12, dist: 10.8 },
    { f: 243, target: [0.2, 2.8, -0.4], azDeg: -1, elDeg: 11, dist: 10.2 },
  ],
  gauntlet: [
    // low tracking shot alongside the link for run 1
    { f: 0, target: [-3.2, 1.3, -0.4], azDeg: -12, elDeg: 7, dist: 9.6 },
    { f: 60, target: [-1.0, 1.3, -0.4], azDeg: -6, elDeg: 7, dist: 9.2 },
    { f: 150, target: [2.2, 1.3, -0.4], azDeg: 2, elDeg: 7, dist: 9.0 },
    // hostile run: camera eases ahead toward the sandbox gate
    { f: 250, target: [0.6, 1.3, -0.4], azDeg: 4, elDeg: 8, dist: 8.8 },
    { f: 360, target: [0.4, 1.4, -0.5], azDeg: 5, elDeg: 9, dist: 8.6 },
    // burst + rate_limited: pull back to frame gate 1 + flying chip
    { f: 470, target: [-3.4, 1.5, -0.2], azDeg: -6, elDeg: 11, dist: 10.4 },
    { f: 607, target: [-2.2, 1.6, -0.2], azDeg: -5, elDeg: 12, dist: 10.8 },
  ],
  what: [
    // pull back to the whole map: client → gates → server, bays ignite
    { f: 0, target: [-6.5, 1.6, -0.2], azDeg: -10, elDeg: 14, dist: 8.6 },
    { f: 80, target: [-2.0, 1.5, -0.6], azDeg: -4, elDeg: 16, dist: 11.6 },
    { f: 300, target: [1.6, 1.6, -0.9], azDeg: 2, elDeg: 18, dist: 13.2 },
    { f: 563, target: [2.4, 1.7, -1.0], azDeg: 3, elDeg: 19, dist: 13.6 },
  ],
  discover: [
    // close on the server: tools/list handshake + bays lighting
    { f: 0, target: [-4.0, 1.4, -0.4], azDeg: -8, elDeg: 10, dist: 9.4 },
    { f: 90, target: [3.0, 1.6, -1.4], azDeg: 2, elDeg: 11, dist: 8.8 },
    { f: 320, target: [6.6, 1.7, -1.8], azDeg: 6, elDeg: 12, dist: 8.2 },
    { f: 499, target: [7.0, 1.7, -1.8], azDeg: 7, elDeg: 12, dist: 8.0 },
  ],
  hardened: [
    // vault + sandbox island: escape attempt blocked — low target keeps the vault off the captions
    { f: 0, target: [7.0, 0.2, 2.0], azDeg: 6, elDeg: 9, dist: 8.2 },
    { f: 160, target: [9.0, 0.3, 2.4], azDeg: 9, elDeg: 9, dist: 7.8 },
    { f: 456, target: [10.0, 0.4, 2.5], azDeg: 10, elDeg: 9, dist: 7.6 },
  ],
  bounded: [
    // above the client: the iteration ring counts up
    { f: 0, target: [-8.0, 1.8, 0.6], azDeg: -10, elDeg: 12, dist: 8.8 },
    { f: 220, target: [-7.4, 1.9, 0.7], azDeg: -7, elDeg: 13, dist: 8.4 },
    { f: 400, target: [-7.0, 2.0, 0.8], azDeg: -5, elDeg: 13, dist: 8.2 },
  ],
  registry: [
    // front stage: the arena — versions duel
    { f: 0, target: [0.8, 1.3, 2.2], azDeg: 0, elDeg: 13, dist: 9.0 },
    { f: 240, target: [1.0, 1.3, 2.3], azDeg: 1, elDeg: 12, dist: 8.6 },
    { f: 574, target: [1.2, 1.4, 2.4], azDeg: 2, elDeg: 12, dist: 8.4 },
  ],
  audit: [
    // the hash chain — floats near the board's mid zone, camera tracks it
    { f: 0, target: [-1.0, 1.5, -2.6], azDeg: 0, elDeg: 11, dist: 8.6 },
    { f: 220, target: [0.4, 1.5, -2.5], azDeg: 2, elDeg: 11, dist: 8.2 },
    { f: 463, target: [1.4, 1.6, -2.4], azDeg: 3, elDeg: 11, dist: 8.0 },
  ],
  control: [
    // three columns at the stage
    { f: 0, target: [0.6, 1.5, 2.0], azDeg: -2, elDeg: 12, dist: 9.0 },
    { f: 200, target: [0.9, 1.5, 2.2], azDeg: 0, elDeg: 11, dist: 8.6 },
    { f: 388, target: [1.1, 1.6, 2.3], azDeg: 1, elDeg: 11, dist: 8.4 },
  ],
  proof: [
    // the scorecard erupts from the stage
    { f: 0, target: [1.0, 1.5, 2.0], azDeg: 0, elDeg: 11, dist: 8.8 },
    { f: 90, target: [1.1, 1.55, 2.1], azDeg: 0, elDeg: 11, dist: 8.2 },
    { f: 480, target: [1.2, 1.6, 2.2], azDeg: 1, elDeg: 10, dist: 7.8 },
    { f: 724, target: [1.3, 1.6, 2.3], azDeg: 1, elDeg: 10, dist: 7.6 },
  ],
  rigor: [
    // CI rail sweeps across the stage
    { f: 0, target: [-0.6, 1.2, 1.6], azDeg: -3, elDeg: 12, dist: 8.6 },
    { f: 200, target: [0.6, 1.2, 1.8], azDeg: 0, elDeg: 12, dist: 8.4 },
    { f: 420, target: [1.4, 1.3, 1.9], azDeg: 2, elDeg: 12, dist: 8.2 },
  ],
  builder: [
    // pull up high — the whole world as a constellation
    { f: 0, target: [1.0, 1.8, -0.4], azDeg: 0, elDeg: 18, dist: 11.0 },
    { f: 260, target: [0.8, 2.2, -0.2], azDeg: 2, elDeg: 28, dist: 14.6 },
    { f: 480, target: [0.6, 2.4, 0.0], azDeg: 3, elDeg: 34, dist: 16.4 },
  ],
  cta: [
    // slow push on the end plate above the stage
    { f: 0, target: [1.0, 1.35, 1.6], azDeg: 0, elDeg: 12, dist: 9.0 },
    { f: 300, target: [1.0, 1.35, 1.7], azDeg: 0, elDeg: 11, dist: 8.2 },
    { f: 598, target: [1.0, 1.45, 1.8], azDeg: 0, elDeg: 11, dist: 7.8 },
  ],
};

/* ------------------------------------------------------------------------ */
/* Events                                                                     */
/* ------------------------------------------------------------------------ */

/**
 * Event table — the single source of truth for SFX regeneration and for
 * hero-moment sync checks. `t` is seconds on the FINAL timeline; `frame`
 * is the local frame inside the beat (slice plays beats back-to-back).
 */
export type WorldEvent = {
  id: string;
  beat: string;
  frame: number; // local frame @60
  kind:
    | "ignite" | "launch" | "freeze" | "slam" | "shatter" | "stamp"
    | "pass" | "chip" | "burst" | "tick" | "confirm" | "sweep";
  x: number; // screen-x for panning (-1..1), authored from world x
};

export const EVENTS: WorldEvent[] = [
  // hook
  { id: "res-db", beat: "hook", frame: 96, kind: "ignite", x: 0.4 },
  { id: "res-fs", beat: "hook", frame: 114, kind: "ignite", x: 0.45 },
  { id: "res-web", beat: "hook", frame: 132, kind: "ignite", x: 0.5 },
  { id: "pkt-launch", beat: "hook", frame: 152, kind: "launch", x: -0.1 },
  { id: "freeze", beat: "hook", frame: 336, kind: "freeze", x: 0 },
  // reveal
  { id: "gate-slam", beat: "reveal", frame: 4, kind: "slam", x: 0.05 },
  { id: "pkt-shatter", beat: "reveal", frame: 22, kind: "shatter", x: 0.1 },
  { id: "title-land", beat: "reveal", frame: 58, kind: "stamp", x: 0 },
  // gauntlet
  { id: "r1-g1", beat: "gauntlet", frame: 68, kind: "pass", x: -0.25 },
  { id: "r1-g2", beat: "gauntlet", frame: 107, kind: "pass", x: 0 },
  { id: "r1-g3", beat: "gauntlet", frame: 145, kind: "pass", x: 0.2 },
  { id: "r1-done", beat: "gauntlet", frame: 160, kind: "confirm", x: 0.3 },
  { id: "r2-launch", beat: "gauntlet", frame: 210, kind: "launch", x: -0.2 },
  { id: "r2-g1", beat: "gauntlet", frame: 258, kind: "pass", x: -0.25 },
  { id: "r2-boom", beat: "gauntlet", frame: 360, kind: "shatter", x: 0.05 },
  { id: "r2-chip", beat: "gauntlet", frame: 384, kind: "chip", x: -0.1 },
  { id: "burst", beat: "gauntlet", frame: 470, kind: "burst", x: -0.25 },
  { id: "rate-limited", beat: "gauntlet", frame: 505, kind: "chip", x: -0.25 },
];

/** Scene timing (60 fps) for the slice, which plays beats back-to-back. */
export const SLICE_BEATS = [
  { id: "hook", from: 0, frames: 465 },
  { id: "reveal", from: 465, frames: 243 },
  { id: "gauntlet", from: 708, frames: 607 },
] as const;
export const SLICE_TOTAL = 1315;

/** Final-timeline scene starts (s) — used to keep VO/captions in sync. */
export const SCENE_START: Record<string, number> = {
  hook: 0,
  reveal: 7.75,
  gauntlet: 29.5,
};

/** Event absolute time on the final timeline. */
export const eventTime = (e: WorldEvent) =>
  SCENE_START[e.beat] + e.frame / 60;
