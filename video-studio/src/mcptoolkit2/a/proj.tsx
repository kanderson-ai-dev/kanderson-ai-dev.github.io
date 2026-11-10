/** Pure 3D→2D projection matching the Rig camera — lets DOM text sit exactly
 *  on world points (crisp brand fonts, no troika). */
import { fonts, T } from "../theme";
import type { CamPose } from "../b/CamWorldB";
import type { V3 } from "../world";
import React from "react";

const FOV = 42 * Math.PI / 180;

export const project = (p: V3, pose: CamPose, W = 1920, H = 1080) => {
  const az = (pose.az * Math.PI) / 180;
  const el = (pose.el * Math.PI) / 180;
  const [tx, ty, tz] = pose.t;
  const cx = tx + pose.d * Math.cos(el) * Math.sin(az);
  const cy = ty + pose.d * Math.sin(el);
  const cz = tz + pose.d * Math.cos(el) * Math.cos(az);
  // camera z axis points at the camera (looks down -z)
  const zc = norm3([cx - tx, cy - ty, cz - tz]);
  const xc = norm3(cross([0, 1, 0], zc));
  const yc = cross(zc, xc);
  const v = [p[0] - cx, p[1] - cy, p[2] - cz];
  const depth = -dot(v, zc); // >0 in front of camera
  if (depth < 0.1) return null;
  const x = (dot(v, xc) / (depth * Math.tan(FOV / 2) * (W / H)) + 1) / 2 * W;
  const y = (1 - dot(v, yc) / (depth * Math.tan(FOV / 2))) / 2 * H;
  return { x, y, depth };
};

const dot = (a: number[], b: number[]) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a: number[], b: number[]): number[] => [
  a[1] * b[2] - a[2] * b[1],
  a[2] * b[0] - a[0] * b[2],
  a[0] * b[1] - a[1] * b[0],
];
const norm3 = (a: number[]): number[] => {
  const l = Math.hypot(a[0], a[1], a[2]);
  return [a[0] / l, a[1] / l, a[2] / l];
};

export type LSpec = {
  p: V3;
  text: string;
  size?: number; // px at depth 9
  color?: string;
  weight?: number;
  mono?: boolean;
  ls?: number;
  bg?: string;
  pad?: boolean;
  dx?: number; // extra px offset
  dy?: number;
};

/** DOM overlay: projects label specs onto the frame. */
export const Labels: React.FC<{ pose: CamPose; items: LSpec[] }> = ({ pose, items }) => (
  <>
    {items.map((it, i) => {
      const s = project(it.p, pose);
      if (!s) return null;
      const size = (it.size ?? 20) * Math.min(1.9, 9.2 / s.depth);
      return (
        <div
          key={i}
          style={{
            position: "absolute",
            left: s.x + (it.dx ?? 0),
            top: s.y + (it.dy ?? 0),
            transform: "translate(-50%,-50%)",
            fontFamily: it.mono !== false ? fonts.mono : fonts.title,
            fontWeight: it.weight ?? 700,
            fontSize: size,
            letterSpacing: it.ls ?? 1,
            color: it.color ?? T.text,
            textShadow: "0 2px 10px #000, 0 0 6px #000",
            whiteSpace: "nowrap",
            pointerEvents: "none",
            ...(it.bg || it.pad
              ? {
                  background: it.bg ?? "rgba(5,10,18,0.72)",
                  border: `1.5px solid ${(it.color ?? T.text)}55`,
                  borderRadius: 8,
                  padding: `${size * 0.22}px ${size * 0.55}px`,
                }
              : {}),
          }}
        >
          {it.text}
        </div>
      );
    })}
  </>
);
