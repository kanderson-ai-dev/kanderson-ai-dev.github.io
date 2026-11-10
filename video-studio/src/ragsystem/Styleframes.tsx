/**
 * RagStyleframes — one design per render, at final quality, for gate G1.
 * Grammar: Stage + headline (≤7 words) + one hero + one-line caption.
 * Real-app frames use film/run-data/frames.json geometry (copied PNGs in
 * public/rag/, 2x Lanczos versions rendered by Remotion at comp scale).
 */
import React from "react";
import { AbsoluteFill } from "remotion";
import { Grain, Particles, Stage } from "../upgrade/primitives";
import { C, titleFont } from "../upgrade/utheme";
import { RealFrame } from "./RealFrame";
import {
  ChecklistBeat, CountersBeat, DocStackBeat, EndCardRag, PersonBeat,
  ProblemBeat, RevealBeat, RewriteBeat, ShieldBeat, TwinSearchBeat, VerdictBeat, VersionsBeat,
} from "./heroes";

export type RagDesign =
  | "coldopen" | "problem" | "reveal" | "guardrail" | "promise1"
  | "promise2" | "review" | "promise3" | "proof" | "montage" | "yours" | "cta";

/* ---------- composite beats (hero + real frame) ---------- */

const SideBySide: React.FC<{ left: React.ReactNode; right: React.ReactNode }> = ({ left, right }) => (
  <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 70 }}>
    <div style={{ position: "relative", width: 760, height: 800 }}>{left}</div>
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>{right}</div>
  </div>
);

const OverReal: React.FC<{ children: React.ReactNode; frame: React.ReactNode }> = ({ children, frame }) => (
  <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
    <div style={{ position: "relative" }}>
      {frame}
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
        {children}
      </div>
    </div>
  </div>
);

const DESIGNS: Record<
  RagDesign,
  { headline: React.ReactNode; caption: string; beat: React.ReactNode }
> = {
  coldopen: {
    headline: <>It answers from <span style={{ color: C.accent }}>your documents</span>.</>,
    caption: "Upload once. Ask anything. Every answer shows its sources.",
    beat: <DocStackBeat t={0.9} />,
  },
  problem: {
    headline: <>Confident answers. <span style={{ color: C.danger }}>Zero proof.</span></>,
    caption: "Most AI assistants guess — and sound sure while they do.",
    beat: <ProblemBeat t={0.95} />,
  },
  reveal: {
    headline: null,
    caption: "Agentic RAG & Knowledge System — answers with proof.",
    beat: (
      <OverReal frame={<RealFrame file="rag/landing-empty-1280-dark.png" size={[1280, 900]} crop={[290, 230, 700, 290]} width={1250} />}>
        <RevealBeat t={0.9} />
      </OverReal>
    ),
  },
  guardrail: {
    headline: <>Tricks are stopped <span style={{ color: C.accent }}>at the door</span>.</>,
    caption: "Ignore-all-instructions? The real app refuses — in code, before the model.",
    beat: (
      <SideBySide
        left={<ShieldBeat t={0.9} />}
        right={
          <RealFrame
            file="rag/landing-blocked.png" size={[1280, 900]} crop={[300, 480, 680, 160]} width={860}
            highlights={[{ rect: [320, 505, 640, 60], color: C.danger, label: "refused" }]}
          />
        }
      />
    ),
  },
  promise1: {
    headline: <>Promise one: <span style={{ color: C.accent }}>every answer shows its sources</span>.</>,
    caption: "Real answer, real chips, real instruction version — on every reply.",
    beat: (
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
        <div style={{ position: "relative", width: 1920, height: 480 }}>
          <TwinSearchBeat t={0.9} />
        </div>
        <RealFrame
          file="rag/console-chat.png" size={[912, 384]} width={940}
          highlights={[
            { rect: [46, 232, 305, 28], color: C.accent, label: "sources" },
            { rect: [38, 266, 205, 20], color: C.accent },
          ]}
        />
      </div>
    ),
  },
  promise2: {
    headline: <>Promise two: <span style={{ color: C.accent }}>it checks its own evidence</span>.</>,
    caption: "Too weak? It rephrases the question and tries again — max two.",
    beat: (
      <SideBySide
        left={<RewriteBeat t={0.92} />}
        right={
          <RealFrame
            file="rag/console-hitl-modal.png" size={[1280, 1000]} crop={[360, 180, 560, 660]} width={620}
            highlights={[
              { rect: [410, 312, 460, 35], color: C.human, label: "rewritten" },
              { rect: [410, 338, 460, 30], color: C.human },
            ]}
          />
        }
      />
    ),
  },
  review: {
    headline: <>Still nothing? <span style={{ color: C.human }}>It won't guess.</span></>,
    caption: "Retries exhausted — a person decides: approve, retry, or override.",
    beat: (
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <RealFrame
          file="rag/console-hitl-modal.png" size={[1280, 1000]} crop={[360, 180, 560, 660]} width={760}
          highlights={[
            { rect: [400, 210, 480, 35], color: C.human, label: "human review" },
            { rect: [410, 338, 460, 30], color: C.human, label: "retries exhausted" },
            { rect: [400, 432, 480, 80], color: C.human },
            { rect: [400, 536, 480, 80], color: C.human },
            { rect: [400, 640, 480, 80], color: C.human, label: "decide" },
          ]}
        />
      </div>
    ),
  },
  promise3: {
    headline: <>Promise three: <span style={{ color: C.accent }}>quality you can measure</span>.</>,
    caption: "Every update is tested first. This version scored lower — blocked.",
    beat: (
      <SideBySide
        left={<VerdictBeat t={0.9} />}
        right={
          <RealFrame
            file="rag/console-prompts-ab-live.png" size={[862, 418]} width={860}
            highlights={[{ rect: [0, 345, 862, 35], color: C.danger, label: "blocked" }]}
          />
        }
      />
    ),
  },
  proof: {
    headline: <>Measured. <span style={{ color: C.accent }}>Not claimed.</span></>,
    caption: "Faithfulness 1.00, relevancy 1.00 — real scorecard, real dashboard.",
    beat: (
      <SideBySide
        left={<CountersBeat t={0.9} />}
        right={
          <RealFrame
            file="rag/console-performance.png" size={[912, 1844]} crop={[0, 480, 912, 200]} width={860}
            highlights={[{ rect: [20, 518, 872, 112], color: C.accent, label: "quality gates" }]}
          />
        }
      />
    ),
  },
  montage: {
    headline: <>A real product. <span style={{ color: C.accent }}>Not a slide.</span></>,
    caption: "Operator console — desktop, tablet, phone, light theme.",
    beat: (
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 34 }}>
        <RealFrame file="rag/console-dashboard.png" size={[1280, 1000]} crop={[170, 60, 960, 560]} width={820} />
        <div style={{ display: "flex", flexDirection: "column", gap: 34 }}>
          <RealFrame file="rag/console-tablet-768.png" size={[768, 2574]} crop={[0, 0, 768, 700]} width={330} />
          <RealFrame file="rag/console-mobile-375.png" size={[375, 3329]} crop={[0, 0, 375, 640]} width={180} />
        </div>
        <RealFrame file="rag/console-dashboard-1280-light.png" size={[1280, 2381]} crop={[150, 60, 990, 620]} width={430} />
      </div>
    ),
  },
  yours: {
    headline: <>Point it at <span style={{ color: C.accent }}>your documents</span>.</>,
    caption: "Support docs, policies, contracts, manuals — it learns your knowledge base.",
    beat: (
      <OverReal frame={<RealFrame file="rag/landing-empty-1280-dark.png" size={[1280, 900]} crop={[290, 230, 700, 290]} width={1150} />}>
        <DocStackBeat t={0.9} label="DROP YOUR DOCS" />
      </OverReal>
    ),
  },
  cta: {
    headline: null,
    caption: "Let's build yours — kaarstenanderson.com",
    beat: (
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <EndCardRag progress={0.95} />
      </div>
    ),
  },
};

export const RagStyleframes: React.FC<{ design: RagDesign }> = ({ design }) => {
  const d = DESIGNS[design];
  return (
    <AbsoluteFill>
      <Stage dim={design === "proof" || design === "cta" ? 0.7 : 1}>
        {d.headline && (
          <div
            data-qa="headline"
            style={{
              position: "absolute", top: 56, left: 0, right: 0, textAlign: "center",
              fontFamily: titleFont, fontWeight: 700, fontSize: 52, color: C.text, padding: "0 140px",
            }}
          >
            {d.headline}
          </div>
        )}
        {d.beat}
      </Stage>
      <div
        data-qa="caption"
        style={{
          position: "absolute", left: 40, right: 40, bottom: 40, textAlign: "center",
          fontFamily: titleFont, fontWeight: 500, fontSize: 40, color: "#fff",
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
