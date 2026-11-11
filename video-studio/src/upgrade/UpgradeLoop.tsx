import React from "react";
import { AbsoluteFill, Easing, useCurrentFrame, useVideoConfig } from "remotion";
import { NodeGraph } from "./beats";
import { Grain, Particles, Stage } from "./primitives";
import { C, monoFont } from "./utheme";

// ---------------------------------------------------------------------------
// UpgradeLoop — 1280x720 page-hero loop: supervisor fans out to the five
// specialists and back. Perfectly cyclic: the palindrome envelope returns the
// graph to its empty start state by the last frame (draw -> hold -> undraw),
// and the marching-dash pattern period (20f) divides the duration (600f).
// ---------------------------------------------------------------------------

const segF = (f: number, a: number, b: number) =>
  Math.min(1, Math.max(0, (f - a) / Math.max(1e-6, b - a)));
const easeF = (f: number, a: number, b: number) =>
  Easing.out(Easing.cubic)(segF(f, a, b));

export const UpgradeLoop: React.FC = () => {
  const f = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  // palindrome: draw in over ~1.8s, hold, undraw over the last ~1.8s
  const t = Math.min(
    easeF(f, 0, 110),
    1 - easeF(f, durationInFrames - 130, durationInFrames - 12),
  );
  const caption = Math.min(easeF(f, 150, 220), 1 - easeF(f, durationInFrames - 180, durationInFrames - 100));
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      <Particles />
      <Stage brackets>
        {/* NodeGraph is authored for 1920x1080 — scale into 1280x720 */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: -140,
            width: 1920,
            height: 1080,
            transform: "scale(0.6667)",
            transformOrigin: "top left",
          }}
        >
          <NodeGraph t={t} headline={false} />
        </div>
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 30,
            textAlign: "center",
            fontFamily: monoFont,
            fontSize: 22,
            color: C.muted,
            letterSpacing: 3,
            opacity: caption,
          }}
        >
          supervisor → five specialists · live
        </div>
      </Stage>
      <Grain />
    </AbsoluteFill>
  );
};
