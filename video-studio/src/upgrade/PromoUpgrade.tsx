import React from "react";
import { AbsoluteFill, Easing, Sequence, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { ApprovalReplica } from "./ApprovalReplica";
import { EndCard2 } from "./EndCard2";
import { Gate } from "./Gate";
import { HookWall } from "./HookWall";
import { ProofCounters } from "./ProofCounters";
import { RulePanel } from "./RulePanel";
import { TicketCard } from "./TicketCard";
import { BrandMorph, ControlModel, GuardrailBeat, NodeGraph, OrderRecord, RealMontage, Reveal, SetupBeat, TensionBeat, ValueBeat } from "./beats";
import { Grain, Particles, Stage } from "./primitives";
import { C, titleFont } from "./utheme";

export type UpgradeScene = {
  id: string;
  kind:
    | "hook"
    | "tension"
    | "reveal"
    | "setup"
    | "guardrail"
    | "routing"
    | "verify"
    | "policy"
    | "gate"
    | "human"
    | "control"
    | "proof"
    | "value"
    | "real"
    | "adapt"
    | "cta";
  durationSec: number;
  title?: string;
};

export type CaptionWord = { w: string; s: number; e: number };
export type CaptionCue = { from: number; to: number; text: string; words?: CaptionWord[] };

export type UpgradeProps = {
  fps: number;
  scenes: UpgradeScene[];
  subtitles?: CaptionCue[];
  burnSubtitles?: boolean;
  fadeOutSec?: number;
  brackets?: boolean;
  hookOverlay?: boolean;
};

const Beat: React.FC<{ s: UpgradeScene; hookOverlay?: boolean }> = ({ s, hookOverlay = true }) => {
  const f = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const t = durationInFrames > 1 ? f / (durationInFrames - 1) : 1;
  switch (s.kind) {
    case "hook":
      return <HookWall progress={Math.min(1, t * 1.2)} overlay={hookOverlay} />;
    case "tension":
      return <TensionBeat t={t} />;
    case "reveal":
      return <Reveal t={t} />;
    case "setup":
      return <SetupBeat t={t} />;
    case "guardrail":
      return <GuardrailBeat t={t} />;
    case "routing":
      return <NodeGraph t={t} />;
    case "verify":
      return <OrderRecord t={t} />;
    case "policy":
      return (
        <>
          <div style={{ position: "absolute", left: 80, top: 400 }}>
            <TicketCard status="eligible" w={480} />
          </div>
          <div style={{ position: "absolute", right: 70, top: 280 }}>
            <RulePanel progress={t} w={1000} />
          </div>
          <div style={{ position: "absolute", top: 64, left: 0, right: 0, textAlign: "center", fontFamily: titleFont, fontWeight: 700, fontSize: 54, color: C.text }}>
            Then plain code applies your return policy.
          </div>
        </>
      );
    case "gate":
      return (
        <>
          <Gate progress={t} />
          <div style={{ position: "absolute", top: 64, left: 0, right: 0, textAlign: "center", fontFamily: titleFont, fontWeight: 700, fontSize: 54, color: C.text }}>
            $240 is over the $75 cap.
          </div>
        </>
      );
    case "human":
      return (
        <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)" }}>
          <ApprovalReplica highlight={t > 0.55} />
        </div>
      );
    case "control":
      return <ControlModel t={t} />;
    case "proof":
      return (
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <ProofCounters progress={t} />
        </div>
      );
    case "value":
      return <ValueBeat t={t} />;
    case "real":
      return <RealMontage t={t} />;
    case "adapt":
      return <BrandMorph t={t} />;
    case "cta":
      return (
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <EndCard2 progress={t} />
        </div>
      );
    default:
      return null;
  }
};

const Camera: React.FC<{ idx: number; children?: React.ReactNode }> = ({ idx, children }) => {
  const f = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const entry = interpolate(f, [0, fps * 0.45], [1.055, 1], { easing: Easing.out(Easing.cubic), extrapolateRight: "clamp" });
  const dir = idx % 2 === 0 ? 1 : -1;
  const drift = interpolate(f, [0, Math.max(1, durationInFrames)], [0, 13 * dir]);
  const push = interpolate(f, [0, Math.max(1, durationInFrames)], [1, 1.024]);
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

export const Captions: React.FC<{ cues: CaptionCue[] }> = ({ cues }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = f / fps;
  const cue = cues.find((c) => t >= c.from && t < c.to);
  if (!cue) return null;
  const fade = Math.min(1, (t - cue.from) / 0.15, Math.max(0, (cue.to - t) / 0.2));
  return (
    <div style={{ position: "absolute", left: 40, right: 40, bottom: 44, textAlign: "center", fontFamily: titleFont, fontWeight: 500, fontSize: 42, textShadow: "0 2px 8px #000, 0 0 3px #000", opacity: Math.max(0, fade) }}>
      <span style={{ background: "rgba(4,10,14,0.8)", borderRadius: 14, padding: "8px 26px", boxDecorationBreak: "clone", WebkitBoxDecorationBreak: "clone", lineHeight: 1.7 } as React.CSSProperties}>
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

export const PromoUpgrade: React.FC<UpgradeProps> = ({ scenes, subtitles, burnSubtitles = true, fadeOutSec = 1.2, brackets = true, hookOverlay = true }) => {
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
          <Sequence key={s.id} from={from} durationInFrames={dur} name={s.id}>
            <Stage dim={s.kind === "proof" || s.kind === "cta" ? 0.7 : 1} brackets={brackets && s.kind !== "human"}>
              <Camera idx={i}>
                <Beat s={s} hookOverlay={hookOverlay} />
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
      {burnSubtitles && subtitles && <Captions cues={subtitles} />}
    </AbsoluteFill>
  );
};
