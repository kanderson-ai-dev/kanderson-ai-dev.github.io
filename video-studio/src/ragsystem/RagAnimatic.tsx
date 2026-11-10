/**
 * RagAnimatic — G4 pacing/story pass: the approved G1 styleframes sequenced on
 * the real timeline (VO + music edit mixed in post via guide.wav).
 * Each scene gets a slow push-in + fade edges; two beats without a styleframe
 * ("control", "why") get light composite placeholders built from real pieces.
 */
import React from "react";
import { AbsoluteFill, Sequence, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Captions } from "../upgrade/PromoUpgrade";
import type { CaptionCue } from "../upgrade/PromoUpgrade";
import { C, titleFont } from "../upgrade/utheme";
import { RealFrame } from "./RealFrame";
import { PersonBeat } from "./heroes";
import { RagStyleframes } from "./Styleframes";
import type { RagDesign } from "./Styleframes";

export type RagScene = { id: string; kind: string; durationSec: number; voFile?: string | null; voStart?: number | null };
export type RagAnimaticProps = {
  fps: number;
  scenes: RagScene[];
  subtitles?: CaptionCue[];
  burnSubtitles?: boolean;
  fadeOutSec?: number;
};

const KIND_TO_DESIGN: Record<string, RagDesign> = {
  coldopen: "coldopen",
  problem: "problem",
  reveal: "reveal",
  question: "guardrail",
  promise1: "promise1",
  promise2a: "promise2",
  promise2b: "review",
  promise3: "promise3",
  proof: "proof",
  real: "montage",
  yours: "yours",
  cta: "cta",
};

/* control (s09): AI reads/writes · code enforces · people decide — person hero
   + the real "1 Escalated to human" dashboard tile as proof. */
const ControlBeat: React.FC = () => (
  <div style={{ position: "absolute", inset: 0 }}>
    <div style={{ position: "absolute", top: 56, left: 0, right: 0, textAlign: "center", fontFamily: titleFont, fontWeight: 700, fontSize: 52, color: C.text, padding: "0 140px" }} data-qa="headline">
      AI works. <span style={{ color: C.accent }}>Code enforces.</span> <span style={{ color: C.human }}>People decide.</span>
    </div>
    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 70 }}>
      <div style={{ position: "relative", width: 620, height: 700 }}>
        <PersonBeat t={0.9} />
      </div>
      <RealFrame
        file="rag/console-dashboard.png" size={[1280, 1000]} crop={[760, 500, 420, 280]} width={620}
        highlights={[{ rect: [865, 586, 205, 96], color: C.human, label: "escalated" }]}
      />
    </div>
  </div>
);

/* why (s11): sourced answers collapse 100% -> 7% when retrieval is off. */
const WhyBeat: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = f / fps;
  const fall = interpolate(t, [0.9, 2.2], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const big = interpolate(fall, [0, 1], [100, 7]);
  const shown = Math.round(big);
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <div style={{ position: "absolute", top: 56, left: 0, right: 0, textAlign: "center", fontFamily: titleFont, fontWeight: 700, fontSize: 52, color: C.text, padding: "0 140px" }} data-qa="headline">
        Turn the search off — <span style={{ color: C.danger }}>watch it fall.</span>
      </div>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 30 }}>
        <div style={{ fontFamily: titleFont, fontWeight: 800, fontSize: 320, lineHeight: 1, color: shown > 30 ? C.accent : C.danger, textShadow: `0 0 60px ${shown > 30 ? C.accent : C.danger}55` }} data-qa="hero-number">
          {shown}%
        </div>
        <div style={{ fontFamily: titleFont, fontWeight: 500, fontSize: 34, color: C.muted }}>
          answers backed by sources · retrieval {fall < 0.5 ? "on" : "off"}
        </div>
      </div>
    </div>
  );
};

const SceneView: React.FC<{ kind: string; dur: number }> = ({ kind, dur }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = f / fps;
  const push = interpolate(t, [0, dur], [1, 1.045]);
  const fade = Math.min(1, t / 0.3, Math.max(0, (dur - t) / 0.3));
  const design = KIND_TO_DESIGN[kind];
  return (
    <AbsoluteFill style={{ transform: `scale(${push})`, opacity: Math.max(0, fade) }}>
      {design ? <RagStyleframes design={design} /> : kind === "control" ? <ControlBeat /> : <WhyBeat />}
    </AbsoluteFill>
  );
};

export const RagAnimatic: React.FC<RagAnimaticProps> = ({ scenes, subtitles = [], burnSubtitles = true, fadeOutSec = 1.4 }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const total = scenes.reduce((a, s) => a + s.durationSec, 0);
  const tEnd = f / fps;
  const out = fadeOutSec > 0 ? interpolate(tEnd, [total - fadeOutSec, total], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 1;
  let acc = 0;
  return (
    <AbsoluteFill style={{ background: C.bg, opacity: out }}>
      {scenes.map((s) => {
        const from = Math.round(acc * fps);
        acc += s.durationSec;
        return (
          <Sequence key={s.id} from={from} durationInFrames={Math.max(1, Math.round(s.durationSec * fps))}>
            <SceneView kind={s.kind} dur={s.durationSec} />
          </Sequence>
        );
      })}
      {burnSubtitles && <Captions cues={subtitles} />}
    </AbsoluteFill>
  );
};
