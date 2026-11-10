/**
 * Option B — deep-2.5D diorama world.
 *
 * One ground plane (the board) tilted in real CSS-3D perspective; objects are
 * "standees" anchored at ground points and un-tilted toward the camera.
 * The camera spec (target / az / el / dist) is shared with option A.
 */
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import type { CamKey } from "../world";
import { T, U, fonts, rand } from "../theme";

/** Interpolate the camera through its keys with cubic easing. */
export const camAt = (f: number, keys: CamKey[]) => {
  const times = keys.map((k) => k.f);
  const chan = (get: (k: CamKey) => number) =>
    interpolate(f, times, keys.map(get), {
      easing: Easing.inOut(Easing.quad),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  const tg = (i: 0 | 1 | 2) => chan((k) => k.target[i]);
  return { t: [tg(0), tg(1), tg(2)] as [number, number, number], az: chan((k) => k.azDeg), el: chan((k) => k.elDeg), d: chan((k) => k.dist) };
};

/* ------------------------------ ground plane ----------------------------- */

const BW = 16 * 2 * U; // board: x in [-16,16], z in [-9,9]
const BH = 9 * 2 * U;

export const gx = (x: number) => BW / 2 + x * U; // world x → plane px
export const gz = (z: number) => BH / 2 + z * U;

/** Circuit traces + protocol link drawn ON the board plane. */
const Traces: React.FC = () => {
  const traces = React.useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => {
        const r = (j: number) => rand(i * 31 + j * 7);
        const x0 = r(1) * BW;
        const y0 = r(2) * BH;
        const pts = [`${x0} ${y0}`];
        let x = x0;
        let y = y0;
        for (let s = 0; s < 3 + Math.floor(r(3) * 3); s++) {
          if (r(4 + s) > 0.5) x += (r(8 + s) - 0.3) * 420;
          else y += (r(12 + s) - 0.3) * 300;
          pts.push(`${x} ${y}`);
        }
        return pts.join(" L ");
      }),
    []
  );
  return (
    <svg width={BW} height={BH} style={{ position: "absolute", inset: 0 }}>
      {traces.map((d, i) => (
        <path key={i} d={`M ${d}`} stroke={T.grid} strokeWidth={1.5} fill="none" opacity={0.85} />
      ))}
      {traces.map((d, i) => (
        <circle key={`c${i}`} cx={+d.split(" L ").pop()!.split(" ")[0]} cy={+d.split(" L ").pop()!.split(" ")[1]} r={4} fill={T.code} opacity={0.28} />
      ))}
    </svg>
  );
};

export type CamPose = ReturnType<typeof camAt>;

/**
 * The world container: children live in "plane space" via <Ground> (points on
 * the board) or <Stand> (objects standing up at ground points).
 */
export const WorldB: React.FC<{
  pose: CamPose;
  dim?: number; // 0..1 extra darkening (freeze)
  desat?: number; // 0..1 desaturation (freeze)
  children?: React.ReactNode;
}> = ({ pose, dim = 0, desat = 0, children }) => {
  const [tx, ty, tz] = pose.t;
  const zoom = 8.4 / pose.d; // dist 8.4 ≈ subject fills frame
  return (
    <AbsoluteFill style={{ perspective: 1250, perspectiveOrigin: "50% 42%", overflow: "hidden", background: `radial-gradient(120% 90% at 50% 30%, ${T.bg} 0%, ${T.bgDeep} 100%)` }}>
      <AbsoluteFill
        style={{
          transform: `scale(${zoom}) rotateX(${pose.el}deg) rotateY(${pose.az}deg) translate3d(${-tx * U}px, ${ty * U}px, ${-tz * U}px)`,
          transformStyle: "preserve-3d",
          filter: desat > 0 ? `saturate(${1 - desat * 0.6}) brightness(${1 - dim * 0.3})` : dim > 0 ? `brightness(${1 - dim * 0.3})` : undefined,
        }}
      >
        {/* the board plane itself */}
        <div
          style={{
            position: "absolute",
            left: `calc(50% - ${BW / 2}px)`,
            top: `calc(50% - ${BH / 2}px)`,
            width: BW,
            height: BH,
            transform: "translateZ(0)",
            transformStyle: "preserve-3d",
            background: `linear-gradient(180deg, #060d18 0%, #04070c 100%)`,
            border: `1.5px solid ${T.line}55`,
            boxShadow: `0 0 160px #00000090, inset 0 0 220px #02060880`,
            backgroundImage: `
              repeating-linear-gradient(0deg, ${T.grid}66 0, ${T.grid}66 1.5px, transparent 1.5px, transparent ${U}px),
              repeating-linear-gradient(90deg, ${T.grid}66 0, ${T.grid}66 1.5px, transparent 1.5px, transparent ${U}px)`,
          }}
        >
          <Traces />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: `radial-gradient(90% 70% at 46% 50%, transparent 55%, #02040990 100%)`,
            }}
          />
        </div>
        {children}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** A point on the board plane (children positioned in plane px). */
export const Ground: React.FC<{ x: number; z: number; y?: number; children?: React.ReactNode; style?: React.CSSProperties }> = ({
  x, z, y = 0, children, style,
}) => (
  <div
    style={{
      position: "absolute",
      left: `calc(50% + ${x * U}px)`,
      top: `calc(50% + ${z * U}px)`,
      transform: `translateZ(${y * U}px)`,
      transformStyle: "preserve-3d",
      ...style,
    }}
  >
    {children}
  </div>
);

/**
 * A "standee": content standing at a ground point, un-tilted toward the
 * camera by `lean` (0 = flat on board, 1 = fully facing camera).
 * `rise` lifts the anchor above the board (floating cards).
 */
export const Stand: React.FC<{
  x: number; z: number; y?: number;
  pose: CamPose;
  lean?: number; // extra fraction of un-tilt (0..1), default .85
  w?: number; h?: number;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ x, z, y = 0, pose, lean = 0.85, children, style }) => {
  const unX = -pose.el * lean;
  const unY = -pose.az * lean;
  return (
    <div
      style={{
        position: "absolute",
        left: `calc(50% + ${x * U}px)`,
        top: `calc(50% + ${z * U}px)`,
        transform: `translateZ(${y * U}px)`,
        transformStyle: "preserve-3d",
        ...style,
      }}
    >
      <div style={{ transform: `rotateY(${unY}deg) rotateX(${unX}deg)`, transformStyle: "preserve-3d" }}>
        <div style={{ position: "absolute", transform: "translate(-50%, -100%)" }}>{children}</div>
      </div>
    </div>
  );
};

/* ------------------------------ shared pieces ---------------------------- */

/** Mono label chip used across beats. */
export const Tag: React.FC<{ children: React.ReactNode; color?: string; size?: number; bold?: boolean }> = ({
  children, color = T.muted, size = 15, bold = false,
}) => (
  <span
    style={{
      fontFamily: fonts.mono,
      fontSize: size,
      fontWeight: bold ? 700 : 400,
      letterSpacing: 1.2,
      color,
      background: `${T.panel}e6`,
      border: `1.5px solid ${color}55`,
      borderRadius: 8,
      padding: "4px 10px",
      whiteSpace: "nowrap",
    }}
  >
    {children}
  </span>
);
