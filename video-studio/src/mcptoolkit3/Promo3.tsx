/**
 * Promo3 — the v3 MCP Agent Toolkit film. 16 scenes on the flat stage,
 * scene list + captions driven by the timeline JSON (built from VO takes).
 */
import React from "react";
import { AbsoluteFill, Easing, Sequence, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Grain, Particles, Stage } from "../upgrade/primitives";
import { C, titleFont } from "../upgrade/utheme";
import {
  CheckpointBeat, ConsoleBeat, EndCard3, KeyCardsBeat, LocksBeat,
  ProofBeat, SocketBeat, ThreatBeat,
} from "./heroes3";
import {
  ControlBeat, LimitsBeat, RealBeat, RegistryBeat, TitleBeat, ToolsBeat, YoursBeat,
} from "./heroes3b";

export type Scene3Kind =
  | "hook" | "risk" | "reveal" | "plug" | "tools" | "follow"
  | "checks" | "blocked" | "locks" | "limits" | "registry" | "control"
  | "proof" | "real" | "yours" | "cta";

export type Scene3 = {
  id: string;
  kind: Scene3Kind;
  durationSec: number;
};

const HEADLINES: Partial<Record<Scene3Kind, React.ReactNode>> = {
  hook: <>Your AI agent needs the <span style={{ color: C.accent }}>keys</span>.</>,
  risk: <>One bad instruction <span style={{ color: C.danger }}>— and it turns on you.</span></>,
  plug: <>One <span style={{ color: C.accent }}>standard</span> plug.</>,
  tools: <>Four tools — <span style={{ color: C.accent }}>each one guarded.</span></>,
  follow: <>It finds the tools it needs — <span style={{ color: C.accent }}>and shows every step.</span></>,
  checks: <>Every call passes <span style={{ color: C.accent }}>three checks</span> — in code.</>,
  blocked: <>Blocked — <span style={{ color: C.danger }}>loudly, with the reason.</span></>,
  locks: <>Read-only — <span style={{ color: C.accent }}>twice.</span></>,
  limits: <>Hard limits on <span style={{ color: C.accent }}>every run.</span></>,
  registry: <>Prompts — <span style={{ color: C.accent }}>versioned like code.</span></>,
  control: <>The model suggests. Code decides. <span style={{ color: C.human }}>You sign off.</span></>,
  proof: <>Measured. <span style={{ color: C.accent }}>Not claimed.</span></>,
  real: <>Not a demo — <span style={{ color: C.accent }}>a real product.</span></>,
  yours: <>Your systems — <span style={{ color: C.accent }}>plugged in safely.</span></>,
};

export type CaptionWord = { w: string; s: number; e: number };
export type CaptionCue = { from: number; to: number; text: string; words?: CaptionWord[] };

export type Promo3Props = {
  scenes: Scene3[];
  subtitles?: CaptionCue[];
  burnSubtitles?: boolean;
  fadeOutSec?: number;
  brackets?: boolean;
};

const Beat: React.FC<{ s: Scene3 }> = ({ s }) => {
  const f = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const t = durationInFrames > 1 ? f / (durationInFrames - 1) : 1;
  switch (s.kind) {
    case "hook":
      return <KeyCardsBeat t={t} />;
    case "risk":
      return <ThreatBeat t={t} />;
    case "reveal":
      return <TitleBeat t={t} />;
    case "plug":
      return <SocketBeat t={t} />;
    case "tools":
      return <ToolsBeat t={t} />;
    case "follow":
      return <ConsoleBeat t={t} />;
    case "checks":
      // first half of the checkpoint arc: the three checks tick in
      return <CheckpointBeat t={Math.min(t * 0.5, 0.5)} />;
    case "blocked":
      // second half: the attack arrives and shatters
      return <CheckpointBeat t={0.5 + t * 0.5} />;
    case "locks":
      return <LocksBeat t={t} />;
    case "limits":
      return <LimitsBeat t={t} />;
    case "registry":
      return <RegistryBeat t={t} />;
    case "control":
      return <ControlBeat t={t} />;
    case "proof":
      return <ProofBeat t={t} />;
    case "real":
      return <RealBeat t={t} />;
    case "yours":
      return <YoursBeat t={t} />;
    case "cta":
      return (
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <EndCard3 progress={t} />
        </div>
      );
    default:
      return null;
  }
};

export const Camera: React.FC<{ idx: number; children?: React.ReactNode }> = ({ idx, children }) => {
  const f = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const entry = interpolate(f, [0, fps * 0.45], [1.05, 1], { easing: Easing.out(Easing.cubic), extrapolateRight: "clamp" });
  const dir = idx % 2 === 0 ? 1 : -1;
  const drift = interpolate(f, [0, Math.max(1, durationInFrames)], [0, 12 * dir]);
  const push = interpolate(f, [0, Math.max(1, durationInFrames)], [1, 1.02]);
  return <AbsoluteFill style={{ transform: `scale(${entry * push}) translateX(${drift}px)` }}>{children}</AbsoluteFill>;
};

export const GlitchSweep: React.FC<{ frames: number }> = ({ frames }) => {
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

/**
 * Captions3 — clean text over the stage (no pill), one line, fixed geometry.
 * Words never change weight: the active word only gains accent color + glow,
 * unspoken words sit at 0.55 opacity — zero reflow at word boundaries.
 */
export const Captions3: React.FC<{ cues: CaptionCue[] }> = ({ cues }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = f / fps;
  const cue = cues.find((c) => t >= c.from && t < c.to);
  if (!cue) return null;
  const fade = Math.min(1, (t - cue.from) / 0.15, Math.max(0, (cue.to - t) / 0.2));
  return (
    <div
      style={{
        position: "absolute", left: 40, right: 40, bottom: 44, textAlign: "center",
        fontFamily: titleFont, fontWeight: 500, fontSize: 42, lineHeight: 1.35,
        color: "#fff", textShadow: "0 2px 8px #000, 0 0 3px #000",
        opacity: Math.max(0, fade),
      }}
    >
      {cue.words && cue.words.length > 0
        ? cue.words.map((w, i) => {
            const spoken = t >= w.e;
            const active = t >= w.s && t < w.e;
            return (
              <span
                key={i}
                style={{
                  color: active ? C.accent : "#fff",
                  textShadow: active ? `0 2px 8px #000, 0 0 18px ${C.accent}cc` : "0 2px 8px #000, 0 0 3px #000",
                  opacity: spoken || active ? 1 : 0.55,
                }}
              >
                {w.w}
                {i < cue.words!.length - 1 ? " " : ""}
              </span>
            );
          })
        : cue.text}
    </div>
  );
};

export const Promo3: React.FC<Promo3Props> = ({ scenes, subtitles, burnSubtitles = true, fadeOutSec = 1.2, brackets = true }) => {
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
            <Stage dim={s.kind === "proof" || s.kind === "cta" ? 0.7 : 1} brackets={brackets}>
              <Camera idx={i}>
                {HEADLINES[s.kind] && (
                  <div
                    style={{
                      position: "absolute", top: 64, left: 0, right: 0, textAlign: "center",
                      fontFamily: titleFont, fontWeight: 700, fontSize: 54, color: C.text, padding: "0 140px",
                    }}
                  >
                    {HEADLINES[s.kind]}
                  </div>
                )}
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
      {burnSubtitles && subtitles && <Captions3 cues={subtitles} />}
    </AbsoluteFill>
  );
};
