/**
 * PromoAgentic — the agentic-api flagship film. 19 scenes on the flat stage,
 * scene list + captions driven by the timeline JSON (built from VO takes).
 * Same grammar as Promo3: Stage + headline + one hero + one-line captions,
 * Camera drift/push per scene, GlitchSweep between scenes, letterboxed cold open,
 * ActCard interstitials, EndCard3 CTA.
 */
import React from "react";
import { AbsoluteFill, Sequence, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Grain, Particles, Stage } from "../upgrade/primitives";
import { C, titleFont } from "../upgrade/utheme";
import { ActCard, Letterbox } from "../orchestrator2/fx";
import { Camera, Captions3, GlitchSweep } from "../mcptoolkit3/Promo3";
import type { CaptionCue } from "../mcptoolkit3/Promo3";
import { EndCard3 } from "../mcptoolkit3/heroes3";
import {
  AnswerLockBeat, ApiTitleBeat, ChatFloodBeat, DoorBeat, ProblemBeat,
  ProofBeat, ScoreboardBeat, ShieldBeat, TurnstileBeat,
} from "./heroes";
import {
  ControlBeatA, MemoryBeat, RealBeatA, RecordBeat, WorkBeat, YoursBeatA,
} from "./heroes_b";

export type SceneKind =
  | "coldopen" | "problem" | "reveal"
  | "act1" | "question"
  | "act2" | "promise1" | "flood" | "work" | "memory" | "promise2" | "promise3"
  | "record" | "control"
  | "act3" | "proof" | "real" | "yours" | "cta";

export type Scene = {
  id: string;
  kind: SceneKind;
  durationSec: number;
};

const HEADLINES: Partial<Record<SceneKind, React.ReactNode>> = {
  problem: <>One clever message <span style={{ color: C.danger }}>— and it turns on you.</span></>,
  question: <>Every question gets a <span style={{ color: C.accent }}>tracking number.</span></>,
  promise1: <>Promise one: <span style={{ color: C.accent }}>attacks stay out.</span></>,
  flood: <>A flood gets a polite <span style={{ color: C.accent }}>slow down.</span></>,
  work: <>The AI plans. <span style={{ color: C.accent }}>Code does the math.</span></>,
  memory: <>It remembers <span style={{ color: C.accent }}>the conversation.</span></>,
  promise2: <>Promise two: <span style={{ color: C.accent }}>secrets stay in.</span></>,
  promise3: <>Promise three: <span style={{ color: C.accent }}>every change is proven.</span></>,
  record: <>Every decision lands on <span style={{ color: C.accent }}>a record.</span></>,
  control: <>The AI plans. Code guards. <span style={{ color: C.human }}>You decide.</span></>,
  proof: <>Measured. <span style={{ color: C.accent }}>Not claimed.</span></>,
  real: <>A real, running service — <span style={{ color: C.accent }}>not a slide.</span></>,
  yours: <>Your tools. Your rules. <span style={{ color: C.accent }}>The same safe core.</span></>,
};

const ACT_TITLES: Record<string, string> = {
  act1: "ACT I · ONE QUESTION",
  act2: "ACT II · THREE PROMISES",
  act3: "ACT III · PROOF, NOT PROMISES",
};

const isAct = (k: SceneKind) => k === "act1" || k === "act2" || k === "act3";

/** Letterbox bars: nearly closed over the cold open, fully closed on act cards. */
const SceneBox: React.FC<{ act: boolean }> = ({ act }) => {
  const f = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  if (act) return <Letterbox open={0} />;
  return <Letterbox open={interpolate(f, [0, Math.max(1, durationInFrames)], [0, 0.12], { extrapolateRight: "clamp" })} />;
};

const Beat: React.FC<{ s: Scene }> = ({ s }) => {
  const f = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const t = durationInFrames > 1 ? f / (durationInFrames - 1) : 1;
  switch (s.kind) {
    case "coldopen":
      return <ChatFloodBeat t={t} />;
    case "problem":
      return <ProblemBeat t={t} />;
    case "reveal":
      return <ApiTitleBeat t={t} open={Math.min(1, t * 2.5)} />;
    case "act1":
    case "act2":
    case "act3":
      return <ActCard t={t} title={ACT_TITLES[s.kind]} />;
    case "question":
      return <DoorBeat t={t} />;
    case "promise1":
      return <ShieldBeat t={t} />;
    case "flood":
      return <TurnstileBeat t={t} />;
    case "work":
      return <WorkBeat t={t} />;
    case "memory":
      return <MemoryBeat t={t} />;
    case "promise2":
      return <AnswerLockBeat t={t} />;
    case "promise3":
      return <ScoreboardBeat t={t} />;
    case "record":
      return <RecordBeat t={t} />;
    case "control":
      return <ControlBeatA t={t} />;
    case "proof":
      return <ProofBeat t={t} />;
    case "real":
      return <RealBeatA t={t} />;
    case "yours":
      return <YoursBeatA t={t} />;
    case "cta":
      return (
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <EndCard3 project="Guardrailed Agentic AI API" progress={t} />
        </div>
      );
    default:
      return null;
  }
};

export type PromoAgenticProps = {
  scenes: Scene[];
  subtitles?: CaptionCue[];
  burnSubtitles?: boolean;
  fadeOutSec?: number;
  brackets?: boolean;
};

export const PromoAgentic: React.FC<PromoAgenticProps> = ({ scenes, subtitles, burnSubtitles = true, fadeOutSec = 1.2, brackets = true }) => {
  const { fps, durationInFrames } = useVideoConfig();
  const frame = useCurrentFrame();
  let start = 0;
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      {scenes.map((s, i) => {
        const dur = Math.round(s.durationSec * fps);
        const from = start;
        start += dur;
        const boxed = s.kind === "coldopen" || isAct(s.kind);
        return (
          <Sequence key={s.id} from={from} durationInFrames={dur} name={s.id}>
            <Stage dim={s.kind === "proof" || s.kind === "cta" ? 0.7 : 1} brackets={brackets && s.kind !== "act1" && s.kind !== "act2" && s.kind !== "act3"}>
              <Camera idx={i}>
                {HEADLINES[s.kind] && (
                  <div
                    data-qa="headline"
                    style={{
                      position: "absolute", top: 84, left: 0, right: 0, textAlign: "center",
                      fontFamily: titleFont, fontWeight: 700, fontSize: 54, color: C.text, padding: "0 140px",
                    }}
                  >
                    {HEADLINES[s.kind]}
                  </div>
                )}
                <div data-qa={`beat-${s.kind}`} style={{ position: "absolute", inset: 0 }}>
                  <Beat s={s} />
                </div>
              </Camera>
            </Stage>
            {boxed && <SceneBox act={isAct(s.kind)} />}
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
      {burnSubtitles && subtitles && <div data-qa="captions"><Captions3 cues={subtitles} /></div>}
    </AbsoluteFill>
  );
};
