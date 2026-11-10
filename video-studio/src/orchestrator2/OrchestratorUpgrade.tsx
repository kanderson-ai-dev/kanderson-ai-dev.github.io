/**
 * OrchestratorUpgrade — the rebuilt promo. Scene sequences driven by the
 * timeline JSON (projects/langgraph-multiagent-orchestrator-upgrade.json):
 * each scene = Stage + act card (optional) + headline + hero beat + caption.
 * Audio is laid in post (voice_full + sfx_bed + music edit), as in the
 * flagship pipeline.
 */
import React from "react";
import {
  AbsoluteFill, Easing, Sequence, interpolate, useCurrentFrame, useVideoConfig,
} from "remotion";
import { Grain, Particles, Stage } from "../upgrade/primitives";
import type { CaptionCue } from "../upgrade/PromoUpgrade";
import { C, titleFont } from "../upgrade/utheme";
import { ActCard, GodRays, Letterbox } from "./fx";

// word-kinetic captions — no background pill, just a hard shadow
const O2Captions: React.FC<{ cues: CaptionCue[] }> = ({ cues }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = f / fps;
  const cue = cues.find((c) => t >= c.from && t < c.to);
  if (!cue) return null;
  const fade = Math.min(1, (t - cue.from) / 0.15, Math.max(0, (cue.to - t) / 0.2));
  return (
    <div style={{ position: "absolute", left: 40, right: 40, bottom: 44, zIndex: 50, textAlign: "center", fontFamily: titleFont, fontWeight: 500, fontSize: 42, lineHeight: 1.5, textShadow: "0 3px 10px #000, 0 0 4px #000, 0 1px 2px #000", opacity: Math.max(0, fade) }}>
      {cue.words && cue.words.length > 0
        ? cue.words.map((w, i) => {
            const active = t >= w.s && t < w.e;
            return (
              <span
                key={i}
                style={{
                  color: active ? C.accent : "#fff",
                  textShadow: active
                    ? `0 3px 10px #000, 0 0 4px #000, 0 1px 2px #000, 0 0 18px ${C.accent}`
                    : undefined,
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
import {
  ColdOpenBeat, CrewBeat, LeadBeat, ProblemBeat, RevealBeat,
} from "./heroes2";
import {
  ConstellationBeat, Promise1Beat, Promise2Beat, Promise3Beat,
} from "./heroes2b";
import { BriefBeat, ControlBeat, EndCardBeat, ProofBeat, RealBeat, RegistryBeat } from "./heroes2c";

export type O2Design =
  | "coldopen" | "problem" | "reveal" | "brief" | "crew" | "lead"
  | "promise1" | "promise2" | "promise3" | "control" | "proof" | "registry" | "real"
  | "constellation" | "builtby" | "cta";

export type O2Scene = {
  id: string;
  design: O2Design;
  startSec: number;
  durationSec: number;
  act?: string;           // e.g. "ACT I — A BRIEF GOES IN" (kicker line)
  headOverride?: React.ReactNode;
  voFile?: string;
  voStart?: number;
  letterbox?: boolean;    // cold-open cinema bars that open
  dim?: number;
  rays?: [number, number];
  brackets?: boolean;
};

const BEATS: Record<O2Design, React.FC<{ t: number }>> = {
  coldopen: ColdOpenBeat,
  problem: ProblemBeat,
  reveal: (p) => <RevealBeat {...p} open={Math.min(1, p.t * 2)} />,
  brief: BriefBeat,
  crew: CrewBeat,
  lead: LeadBeat,
  promise1: Promise1Beat,
  promise2: Promise2Beat,
  promise3: Promise3Beat,
  control: ControlBeat,
  proof: ProofBeat,
  registry: RegistryBeat,
  real: RealBeat,
  constellation: ConstellationBeat,
  builtby: (p) => <EndCardBeat {...p} part="a" />,
  cta: (p) => <EndCardBeat {...p} part="b" />,
};

const HEADLINES: Partial<Record<O2Design, React.ReactNode>> = {
  problem: <>Fast answers. <span style={{ color: C.danger }}>Nobody checks.</span></>,
  brief: <>Brief in. <span style={{ color: C.accent }}>Attacks stay out.</span></>,
  crew: <>The right team. <span style={{ color: C.accent }}>Assembled.</span></>,
  lead: <>A team lead <span style={{ color: C.model }}>decides</span> who works.</>,
  promise1: <>Promise one: <span style={{ color: C.accent }}>nothing made up.</span></>,
  promise2: <>Promise two: <span style={{ color: C.accent }}>no runaway bills.</span></>,
  promise3: <>Promise three: <span style={{ color: C.accent }}>proof for every word.</span></>,
  control: <>The AI works. <span style={{ color: C.accent }}>The code enforces.</span> <span style={{ color: C.human }}>You decide.</span></>,
  proof: <>Measured. <span style={{ color: C.accent }}>Not claimed.</span></>,
  registry: <>Nothing ships <span style={{ color: C.accent }}>unless it wins.</span></>,
  real: <>A real product. <span style={{ color: C.accent }}>Not a slide.</span></>,
  constellation: <>Any field. <span style={{ color: C.accent }}>Its own team.</span></>,
};

const Scene: React.FC<{ s: O2Scene; brackets: boolean }> = ({ s, brackets }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const t = frame / Math.max(1, durationInFrames - 1);
  const Beat = BEATS[s.design];
  const head = s.headOverride ?? HEADLINES[s.design];
  const headIn = interpolate(frame, [0, fps * 0.45], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic),
  });
  // subtle push-in on every scene — keeps stills from feeling frozen
  const push = interpolate(frame, [0, durationInFrames], [1.015, 1.055]);
  return (
    <AbsoluteFill>
      <Stage dim={s.dim ?? 1} brackets={s.brackets ?? brackets}>
        {s.rays && <GodRays x={s.rays[0]} y={s.rays[1]} opacity={0.9} />}
        {head && (
          <div
            style={{
              position: "absolute", top: 64, left: 0, right: 0, textAlign: "center",
              fontFamily: titleFont, fontWeight: 700, fontSize: 54, color: C.text,
              padding: "0 140px", opacity: headIn,
              transform: `translateY(${(1 - headIn) * 18}px)`,
            }}
          >
            {head}
          </div>
        )}
        <AbsoluteFill style={{ transform: `scale(${push})` }}>
          <Beat t={t} />
        </AbsoluteFill>
      </Stage>
      {s.act && (
        <AbsoluteFill
          style={{
            opacity: interpolate(frame, [fps * 1.9, fps * 2.4], [1, 0], {
              extrapolateLeft: "clamp", extrapolateRight: "clamp",
            }),
          }}
        >
          <ActCard t={Math.min(1, frame / (fps * 1.6))} title={s.act} />
        </AbsoluteFill>
      )}
      {s.letterbox && <Letterbox open={interpolate(frame, [0, fps * 0.8, fps * 2.4], [1, 1, 0])} />}
    </AbsoluteFill>
  );
};

// hard-cut flash between scenes — a 3-frame luma whip, kept subtle
const Whip: React.FC = () => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(circle at 50% 50%, ${C.accent}26, transparent 60%)`,
      opacity: interpolate(useCurrentFrame(), [0, 4, 8], [0.9, 0.4, 0], { extrapolateRight: "clamp" }),
    }}
  />
);

export type O2Props = {
  fps: number;
  scenes: O2Scene[];
  subtitles?: CaptionCue[];
  burnSubtitles?: boolean;
  fadeInSec?: number;
  fadeOutSec?: number;
  brackets?: boolean;
};

export const OrchestratorUpgrade: React.FC<O2Props> = ({ scenes, subtitles, burnSubtitles = true, fadeInSec = 0.4, fadeOutSec = 1.4, brackets = true }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      {scenes.map((s, i) => {
        const dur = Math.round(s.durationSec * fps);
        const from = Math.round((s.startSec ?? 0) * fps);
        return (
          <Sequence key={s.id} from={from} durationInFrames={dur} name={s.id}>
            <Scene s={s} brackets={brackets} />
            {i > 0 && <Whip />}
          </Sequence>
        );
      })}
      <Particles />
      <Grain />
      <AbsoluteFill
        style={{
          background: "#000",
          opacity: interpolate(frame, [0, fadeInSec * fps], [1, 0], { extrapolateRight: "clamp" }),
        }}
      />
      {fadeOutSec ? (
        <AbsoluteFill
          style={{
            background: "#000",
            opacity: interpolate(frame, [durationInFrames - fadeOutSec * fps, durationInFrames], [0, 1], {
              extrapolateLeft: "clamp", extrapolateRight: "clamp",
            }),
          }}
        />
      ) : null}
      {burnSubtitles && subtitles && <O2Captions cues={subtitles} />}
    </AbsoluteFill>
  );
};
