import React from "react";
import { AbsoluteFill, Easing, Sequence, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import type { CaptionCue } from "../upgrade/PromoUpgrade";
import { Grain, Particles, Stage } from "../upgrade/primitives";
import { C, titleFont } from "../upgrade/utheme";
import type { OSceneKind } from "./OAnimatic";
import {
  AdaptBeat,
  ControlBeat,
  CtaBeat,
  DebateBeat,
  GateBeat,
  GuardrailBeat,
  HookBeat,
  HumanBeat,
  ProofBeat,
  RevealBeat,
  RigorBeat,
  RoutingBeat,
  SealBeat,
  TeamBeat,
  TensionBeat,
} from "./beats";

export type OrchestratorScene = { id: string; kind: OSceneKind; durationSec: number };

export type OrchestratorProps = {
  fps: number;
  scenes: OrchestratorScene[];
  subtitles?: CaptionCue[];
  burnSubtitles?: boolean;
  fadeOutSec?: number;
};

const Beat: React.FC<{ s: OrchestratorScene }> = ({ s }) => {
  const f = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const t = durationInFrames > 1 ? f / (durationInFrames - 1) : 1;
  switch (s.kind) {
    case "hook": return <HookBeat t={t} />;
    case "tension": return <TensionBeat t={t} />;
    case "reveal": return <RevealBeat t={t} />;
    case "guardrail": return <GuardrailBeat t={t} />;
    case "team": return <TeamBeat t={t} />;
    case "routing": return <RoutingBeat t={t} />;
    case "debate": return <DebateBeat t={t} />;
    case "gate": return <GateBeat t={t} />;
    case "human": return <HumanBeat t={t} />;
    case "seal": return <SealBeat t={t} />;
    case "control": return <ControlBeat t={t} />;
    case "proof": return <ProofBeat t={t} />;
    case "rigor": return <RigorBeat t={t} />;
    case "adapt": return <AdaptBeat t={t} />;
    case "cta": return <CtaBeat t={t} />;
    default: return null;
  }
};

const Camera: React.FC<{ idx: number; children?: React.ReactNode }> = ({ idx, children }) => {
  const f = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const entry = interpolate(f, [0, fps * 0.45], [1.05, 1], { easing: Easing.out(Easing.cubic), extrapolateRight: "clamp" });
  const dir = idx % 2 === 0 ? 1 : -1;
  const drift = interpolate(f, [0, Math.max(1, durationInFrames)], [0, 12 * dir]);
  const push = interpolate(f, [0, Math.max(1, durationInFrames)], [1, 1.022]);
  return <AbsoluteFill style={{ transform: `scale(${entry * push}) translateX(${drift}px)` }}>{children}</AbsoluteFill>;
};

const GlitchSweep: React.FC<{ frames: number }> = ({ frames }) => {
  const f = useCurrentFrame();
  if (f >= frames) return null;
  const x = interpolate(f, [0, frames], [-35, 135], { easing: Easing.inOut(Easing.quad) });
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", top: 0, bottom: 0, left: `${x}%`, width: "32%", background: `linear-gradient(90deg, transparent, ${C.accent}50, transparent)`, transform: "skewX(-18deg)" }} />
      <div style={{ position: "absolute", top: 0, bottom: 0, left: `${x - 6}%`, width: "6%", background: `${C.model}30`, transform: "skewX(-18deg)" }} />
    </AbsoluteFill>
  );
};

// Compact kinetic captions for this film — same behaviour as upgrade/Captions
// but a smaller band so scene content stays clear (top edge ≈ y920).
const FilmCaptions: React.FC<{ cues: CaptionCue[] }> = ({ cues }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = f / fps;
  const cue = cues.find((c) => t >= c.from && t < c.to);
  if (!cue) return null;
  const fade = Math.min(1, (t - cue.from) / 0.15, Math.max(0, (cue.to - t) / 0.2));
  return (
    <div style={{ position: "absolute", left: 40, right: 40, bottom: 36, textAlign: "center", fontFamily: titleFont, fontWeight: 500, fontSize: 38, textShadow: "0 2px 8px #000, 0 0 3px #000", opacity: Math.max(0, fade) }}>
      <span style={{ background: "rgba(4,10,14,0.8)", borderRadius: 12, padding: "6px 22px", boxDecorationBreak: "clone", WebkitBoxDecorationBreak: "clone", lineHeight: 1.6 } as React.CSSProperties}>
        {cue.words && cue.words.length > 0
          ? cue.words.map((w, i) => {
              const spoken = t >= w.e;
              const active = t >= w.s && t < w.e;
              return (
                <span
                  key={i}
                  style={{
                    color: active ? C.accent : "#fff",
                    fontWeight: active ? 700 : 500,
                    opacity: spoken || active ? 1 : 0.55,
                  }}
                >
                  {w.w}
                  {i < cue.words!.length - 1 ? " " : ""}
                </span>
              );
            })
          : cue.text}
      </span>
    </div>
  );
};

export const PromoOrchestrator: React.FC<OrchestratorProps> = ({ scenes, subtitles, burnSubtitles = true, fadeOutSec = 1.4 }) => {
  const { fps, durationInFrames } = useVideoConfig();
  const frame = useCurrentFrame();
  let start = 0;
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      {scenes.map((s, i) => {
        const dur = Math.round(s.durationSec * fps);
        const from = start;
        start += dur;
        return (
          <Sequence key={s.id + i} from={from} durationInFrames={dur} name={s.id}>
            <Stage dim={s.kind === "proof" || s.kind === "cta" ? 0.7 : 1} brackets={s.kind !== "human"}>
              <Camera idx={i}>
                <Beat s={s} />
              </Camera>
            </Stage>
            {i > 0 && <GlitchSweep frames={10} />}
          </Sequence>
        );
      })}
      <Particles />
      <Grain />
      {fadeOutSec ? (
        <AbsoluteFill
          style={{ background: "#000", opacity: interpolate(frame, [durationInFrames - fadeOutSec * fps, durationInFrames], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}
        />
      ) : null}
      {burnSubtitles && subtitles && <FilmCaptions cues={subtitles} />}
    </AbsoluteFill>
  );
};
