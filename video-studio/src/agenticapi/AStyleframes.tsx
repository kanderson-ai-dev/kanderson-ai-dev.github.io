/**
 * AStyleframes — one design per render, at final quality, for gate G1.
 * Same grammar as the reference films: Stage + headline + one hero + caption.
 */
import React from "react";
import { AbsoluteFill } from "remotion";
import { Grain, Particles, Stage } from "../upgrade/primitives";
import { C, titleFont } from "../upgrade/utheme";
import { GodRays } from "../orchestrator2/fx";
import {
  AnswerLockBeat, ApiTitleBeat, ChatFloodBeat, CtaCheckBeat, DoorBeat,
  ProblemBeat, ProofBeat, ScoreboardBeat, ShieldBeat, TurnstileBeat,
} from "./heroes";

export type AgenticApiDesign =
  | "coldopen" | "problem" | "reveal" | "door" | "shield"
  | "turnstile" | "outshield" | "scoreboard" | "proof" | "cta";

const DESIGNS: Record<
  AgenticApiDesign,
  {
    headline: React.ReactNode;
    caption: string;
    beat: React.ReactNode;
    dim?: number;
    brackets?: boolean;
    rays?: [number, number];
  }
> = {
  coldopen: {
    headline: null,
    caption: "Now anyone can type anything to it.",
    beat: <ChatFloodBeat t={0.92} />,
    brackets: false,
    rays: [38, 50],
  },
  problem: {
    headline: <>One clever message <span style={{ color: C.danger }}>— and it turns on you.</span></>,
    caption: "…leaks its secret instructions, runs up your bill, or crashes.",
    beat: <ProblemBeat t={0.95} />,
  },
  reveal: {
    headline: null,
    caption: "A safe front door for your AI — attacks stay out, secrets stay in.",
    beat: <ApiTitleBeat t={0.92} open={0.9} />,
    brackets: false,
    rays: [50, 45],
  },
  door: {
    headline: <>Every question gets a <span style={{ color: C.accent }}>tracking number.</span></>,
    caption: "At the door, it gets a tracking number and a key check.",
    beat: <DoorBeat t={0.95} />,
  },
  shield: {
    headline: <>Promise one: <span style={{ color: C.accent }}>attacks stay out.</span></>,
    caption: "A blocked attack costs nothing.",
    beat: <ShieldBeat t={0.95} />,
  },
  turnstile: {
    headline: <>A flood gets a polite <span style={{ color: C.accent }}>slow down.</span></>,
    caption: "…not a surprise bill.",
    beat: <TurnstileBeat t={0.95} />,
  },
  outshield: {
    headline: <>Promise two: <span style={{ color: C.accent }}>secrets stay in.</span></>,
    caption: "Every answer is screened on the way out — before the user sees a word.",
    beat: <AnswerLockBeat t={0.95} />,
  },
  scoreboard: {
    headline: <>Promise three: <span style={{ color: C.accent }}>every change is proven.</span></>,
    caption: "This version got worse — blocked.",
    beat: <ScoreboardBeat t={0.95} />,
  },
  proof: {
    headline: <>Measured. <span style={{ color: C.accent }}>Not claimed.</span></>,
    caption: "One hundred seventy-nine tests, ninety-eight percent coverage.",
    beat: <ProofBeat t={0.95} />,
    dim: 0.7,
  },
  cta: {
    headline: null,
    caption: "Let's build yours — kaarstenanderson.com",
    beat: <CtaCheckBeat t={0.95} />,
    dim: 0.7,
  },
};

export const AStyleframes: React.FC<{ design: AgenticApiDesign }> = ({ design }) => {
  const d = DESIGNS[design];
  return (
    <AbsoluteFill>
      <Stage dim={d.dim ?? 1} brackets={d.brackets ?? true}>
        {d.rays && <GodRays x={d.rays[0]} y={d.rays[1]} opacity={0.9} />}
        {d.headline && (
          <div
            style={{
              position: "absolute", top: 64, left: 0, right: 0, textAlign: "center",
              fontFamily: titleFont, fontWeight: 700, fontSize: 54, color: C.text, padding: "0 140px",
            }}
          >
            {d.headline}
          </div>
        )}
        {d.beat}
      </Stage>
      {/* caption preview — one line, the reference style */}
      <div
        style={{
          position: "absolute", left: 40, right: 40, bottom: 44, textAlign: "center",
          fontFamily: titleFont, fontWeight: 500, fontSize: 42, color: "#fff",
          textShadow: "0 2px 8px #000, 0 0 3px #000", zIndex: 50,
        }}
      >
        {d.caption}
      </div>
      <Particles />
      <Grain />
    </AbsoluteFill>
  );
};
