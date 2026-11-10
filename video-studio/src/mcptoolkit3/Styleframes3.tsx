/**
 * Styleframes3 — one design per render, at final quality, for gate G1.
 * Same grammar as the reference film: Stage + headline + one hero + caption.
 */
import React from "react";
import { AbsoluteFill } from "remotion";
import { Grain, Particles, Stage } from "../upgrade/primitives";
import { C, titleFont } from "../upgrade/utheme";
import {
  CheckpointBeat, ConsoleBeat, EndCard3, KeyCardsBeat, LocksBeat,
  ProofBeat, SocketBeat, ThreatBeat,
} from "./heroes3";

export type Styleframe3Design =
  | "hook" | "risk" | "socket" | "console"
  | "checkpoint" | "locks" | "proof" | "cta";

const DESIGNS: Record<
  Styleframe3Design,
  { headline: React.ReactNode; caption: string; beat: React.ReactNode }
> = {
  hook: {
    headline: <>Your AI agent needs the <span style={{ color: C.accent }}>keys</span>.</>,
    caption: "You want an AI agent working in your company. That means giving it the keys.",
    beat: <KeyCardsBeat t={0.9} />,
  },
  risk: {
    headline: <>One bad instruction <span style={{ color: C.danger }}>— and it turns on you.</span></>,
    caption: "One bad instruction, and it deletes a table, leaks a file, or obeys a stranger.",
    beat: <ThreatBeat t={0.95} />,
  },
  socket: {
    headline: <>One <span style={{ color: C.accent }}>standard</span> plug.</>,
    caption: "It speaks MCP, the open standard. Any agent that speaks it can plug in.",
    beat: <SocketBeat t={0.9} />,
  },
  console: {
    headline: <>It finds the tools it needs — <span style={{ color: C.accent }}>and shows every step.</span></>,
    caption: "Ask it something real. It finds the tools, uses them, and shows every step.",
    beat: <ConsoleBeat t={0.95} />,
  },
  checkpoint: {
    headline: <>Every call passes <span style={{ color: C.accent }}>three checks</span> — in code.</>,
    caption: "Now the attack. Blocked — loudly, with the reason. Never a silent failure.",
    beat: <CheckpointBeat t={0.6} />,
  },
  locks: {
    headline: <>Read-only — <span style={{ color: C.accent }}>twice.</span></>,
    caption: "The database is read-only — twice. Files can't escape their folder.",
    beat: <LocksBeat t={0.9} />,
  },
  proof: {
    headline: <>Measured. <span style={{ color: C.accent }}>Not claimed.</span></>,
    caption: "Thirteen of thirteen attacks resisted, four point eight out of five on quality.",
    beat: <ProofBeat t={0.95} />,
  },
  cta: {
    headline: null,
    caption: "Let's build yours — kaarstenanderson.com",
    beat: <EndCard3 progress={0.95} />,
  },
};

export const Styleframes3: React.FC<{ design: Styleframe3Design }> = ({ design }) => {
  const d = DESIGNS[design];
  return (
    <AbsoluteFill>
      <Stage dim={design === "proof" || design === "cta" ? 0.7 : 1}>
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
