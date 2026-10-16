import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import type { Rect } from "../types";

export const FULL: Rect = { x: 0, y: 0, w: 1920, h: 1080 };

export const ZoomPan: React.FC<{ from?: Rect; to?: Rect; children: React.ReactNode }> = ({ from = FULL, to = FULL, children }) => {
  const f = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const t = interpolate(f, [0, durationInFrames - 1], [0, 1], { easing: Easing.inOut(Easing.cubic), extrapolateRight: "clamp" });
  const L = (a: number, b: number) => a + (b - a) * t;
  const x = L(from.x, to.x);
  const y = L(from.y, to.y);
  const s = 1920 / L(from.w, to.w);
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      <div style={{ position: "absolute", width: 1920, height: 1080, transformOrigin: "0 0", transform: `scale(${s}) translate(${-x}px, ${-y}px)` }}>{children}</div>
    </div>
  );
};
