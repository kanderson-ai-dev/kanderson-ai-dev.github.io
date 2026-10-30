import React from "react";
import { AbsoluteFill } from "remotion";
import { ApprovalReplica } from "./ApprovalReplica";
import { EndCard2 } from "./EndCard2";
import { Gate } from "./Gate";
import { HookWall } from "./HookWall";
import { ProofCounters } from "./ProofCounters";
import { RulePanel } from "./RulePanel";
import { TicketCard } from "./TicketCard";
import { Stage } from "./primitives";
import { C, titleFont } from "./utheme";

export type StyleframeDesign = "hook" | "policy" | "gate" | "approval" | "proof" | "end";

const Title: React.FC<{ text: string; top?: number }> = ({ text, top = 64 }) => (
  <div style={{ position: "absolute", top, left: 0, right: 0, textAlign: "center", fontFamily: titleFont, fontWeight: 700, fontSize: 54, color: C.text }}>{text}</div>
);

export const Styleframes: React.FC<{ design?: StyleframeDesign }> = ({ design = "hook" }) => {
  switch (design) {
    case "hook":
      return (
        <Stage>
          <HookWall progress={1} />
        </Stage>
      );
    case "policy":
      return (
        <Stage>
          <Title text="Then plain code applies your return policy." />
          <div style={{ position: "absolute", left: 80, top: 400 }}>
            <TicketCard status="eligible" w={480} />
          </div>
          <div style={{ position: "absolute", right: 70, top: 280 }}>
            <RulePanel progress={1} w={1000} />
          </div>
        </Stage>
      );
    case "gate":
      return (
        <Stage>
          <Title text="$240 is over the $75 cap." />
          <Gate progress={1} />
        </Stage>
      );
    case "approval":
      return (
        <Stage dim={0.6}>
          <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)" }}>
            <ApprovalReplica />
          </div>
        </Stage>
      );
    case "proof":
      return (
        <Stage>
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <ProofCounters progress={1} />
          </div>
        </Stage>
      );
    case "end":
      return (
        <Stage>
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <EndCard2 progress={1} />
          </div>
        </Stage>
      );
    default:
      return <AbsoluteFill />;
  }
};
