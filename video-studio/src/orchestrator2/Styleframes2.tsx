/**
 * Styleframes2 — one design per render, at final quality, for gate G1.
 * Grammar: Stage + headline (≤7 words) + one hero + one-line caption.
 */
import React from "react";
import { AbsoluteFill } from "remotion";
import { Grain, Particles, Stage } from "../upgrade/primitives";
import { C, titleFont } from "../upgrade/utheme";
import { GodRays } from "./fx";
import { ColdOpenBeat, CrewBeat, LeadBeat, ProblemBeat, RevealBeat } from "./heroes2";
import { BuiltByBeat, ConstellationBeat, Promise1Beat, Promise2Beat, Promise3Beat } from "./heroes2b";

export type Orchestrator2Design =
  | "coldopen" | "problem" | "reveal" | "crew" | "lead"
  | "promise1" | "promise2" | "promise3" | "constellation" | "builtby";

const DESIGNS: Record<
  Orchestrator2Design,
  { headline: React.ReactNode; caption: string; beat: React.ReactNode; dim?: number; rays?: [number, number] }
> = {
  coldopen: {
    headline: null,
    caption: "Every big business decision starts with a report.",
    beat: <ColdOpenBeat t={0.88} />,
    rays: [38, 50],
  },
  problem: {
    headline: <>Fast answers. <span style={{ color: C.danger }}>Nobody checks.</span></>,
    caption: "You could ask an AI. But it makes things up, runs up the bill, and can't show its work.",
    beat: <ProblemBeat t={0.92} />,
  },
  reveal: {
    headline: null,
    caption: "A team of AI specialists writes your reports — and proves every word.",
    beat: <RevealBeat t={0.92} open={0.85} />,
    rays: [50, 45],
  },
  crew: {
    headline: <>The right team. <span style={{ color: C.accent }}>Assembled.</span></>,
    caption: "It assembles the right team — and a critic who checks every claim.",
    beat: <CrewBeat t={0.95} />,
    rays: [50, 48],
  },
  lead: {
    headline: <>A team lead <span style={{ color: C.model }}>decides</span> who works.</>,
    caption: "An AI team lead decides who works next, and splits the work in parallel when it can.",
    beat: <LeadBeat t={0.95} />,
  },
  promise1: {
    headline: <>Promise one: <span style={{ color: C.accent }}>nothing made up.</span></>,
    caption: "Every quote is checked against its source. Change twelve percent to twenty-one — caught.",
    beat: <Promise1Beat t={0.95} />,
  },
  promise2: {
    headline: <>Promise two: <span style={{ color: C.accent }}>no runaway bills.</span></>,
    caption: "Before every AI call, it checks the cost. Over budget? It stops — and asks you.",
    beat: <Promise2Beat t={0.95} />,
  },
  promise3: {
    headline: <>Promise three: <span style={{ color: C.accent }}>proof for every word.</span></>,
    caption: "Each step is sealed into a chain of receipts. Change one line — the seal breaks.",
    beat: <Promise3Beat t={0.85} />,
  },
  constellation: {
    headline: <>Any field. <span style={{ color: C.accent }}>Its own team.</span></>,
    caption: "Legal, finance, market research — the same engine builds the team your field needs.",
    beat: <ConstellationBeat t={0.95} />,
    rays: [50, 40],
  },
  builtby: {
    headline: null,
    caption: "Designed, built, and measured by Kaarsten Anderson.",
    beat: <BuiltByBeat t={0.95} />,
    rays: [50, 52],
    dim: 0.7,
  },
};

export const Styleframes2: React.FC<{ design: Orchestrator2Design }> = ({ design }) => {
  const d = DESIGNS[design];
  return (
    <AbsoluteFill>
      <Stage dim={d.dim ?? 1} brackets={design !== "coldopen" && design !== "reveal" && design !== "builtby"}>
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
          position: "absolute", left: 40, right: 40, bottom: design === "coldopen" ? 150 : 44, textAlign: "center",
          fontFamily: titleFont, fontWeight: 500, fontSize: 42, color: "#fff",
          textShadow: "0 2px 8px #000, 0 0 3px #000",
        }}
      >
        {d.caption}
      </div>
      <Particles />
      <Grain />
    </AbsoluteFill>
  );
};
