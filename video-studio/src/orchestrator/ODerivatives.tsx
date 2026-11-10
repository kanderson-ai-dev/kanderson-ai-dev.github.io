import React from "react";
import { AbsoluteFill, Easing, Sequence, useCurrentFrame, useVideoConfig } from "remotion";
import type { CaptionCue } from "../upgrade/PromoUpgrade";
import { Chip, Grain, Particles } from "../upgrade/primitives";
import { C, titleFont, monoFont } from "../upgrade/utheme";
import type { OrchestratorProps, OrchestratorScene } from "./PromoOrchestrator";
import {
  AgentNode, BriefCard, BudgetGauge, DrawnEdge, HashChain,
} from "./pieces";
import {
  CtaBeat, GateBeat, HookBeat, ProofBeat, RoutingBeat, SealBeat,
} from "./beats";
import type { Role } from "./pieces";

// ---------------------------------------------------------------------------
// OLoop — 1280x582 page-hero loop: supervisor draws edges + Send() fan-out.
// Perfectly cyclic: every envelope returns to its initial state by frame end.
// ---------------------------------------------------------------------------

const segF = (f: number, a: number, b: number) =>
  Math.min(1, Math.max(0, (f - a) / Math.max(1e-6, b - a)));
const easeF = (f: number, a: number, b: number) =>
  Easing.out(Easing.cubic)(segF(f, a, b));

export const OLoop: React.FC = () => {
  const f = useCurrentFrame();
  const SX = 170, SY = 291; // supervisor anchor
  const workers: { role: Role; x: number; y: number; drawA: number; killA: number }[] = [
    { role: "researcher", x: 880, y: 78, drawA: 20, killA: 296 },
    { role: "writer", x: 880, y: 226, drawA: 55, killA: 306 },
    { role: "reviewer", x: 880, y: 374, drawA: 90, killA: 316 },
  ];
  // per-edge envelope: draw in (36 f) -> hold -> undraw (36 f); staggered
  const env = (drawA: number, killA: number) =>
    Math.min(easeF(f, drawA, drawA + 36), 1 - easeF(f, killA, killA + 36));
  const anyLit = Math.max(...workers.map((w) => env(w.drawA, w.killA)));
  const send = Math.min(segF(f, 150, 176), 1 - segF(f, 268, 296)); // chip window
  const caption = f > 20 && f < 330 ? "adaptive routing · live" : "";
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      <Particles />
      <svg style={{ position: "absolute", inset: 0 }} width="1280" height="582" viewBox="0 0 1280 582">
        {workers.map((w, i) => (
          <DrawnEdge
            key={w.role}
            x1={SX + 190}
            y1={SY}
            x2={w.x}
            y2={w.y + 45}
            p={env(w.drawA, w.killA)}
            color={i === 1 ? C.model : C.accent}
            width={4}
            bend={(w.y + 45 - SY) * 0.22}
          />
        ))}
      </svg>
      <div style={{ position: "absolute", left: SX - 20, top: SY - 45 }}>
        <AgentNode role="supervisor" lit={0.55 + 0.45 * anyLit} w={230} active={anyLit > 0.6} tag="routing live" />
      </div>
      {workers.map((w) => {
        const p = env(w.drawA, w.killA);
        return (
          <div key={w.role} style={{ position: "absolute", left: w.x, top: w.y }}>
            <AgentNode role={w.role} lit={p} w={230} active={p >= 0.99 && f < w.killA} />
          </div>
        );
      })}
      <div style={{ position: "absolute", left: 555, top: SY - 84, opacity: send }}>
        <Chip text="Send() ×3 — parallel dispatch" color={C.accent} size={20} />
      </div>
      {/* three dispatch pips travelling along the lanes during hold */}
      {send > 0 &&
        workers.map((w, i) => {
          const p = (f - 176 - i * 9) / 60;
          if (p <= 0 || p >= 1) return null;
          const x = SX + 190 + (w.x - SX - 190) * p;
          const y = SY + (w.y + 45 - SY) * (p + 0.22 * 2 * p * (1 - p));
          return <div key={i} style={{ position: "absolute", left: x - 6, top: y - 6, width: 12, height: 12, borderRadius: 6, background: "#fff", boxShadow: `0 0 14px ${C.accent}` }} />;
        })}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 22,
          textAlign: "center",
          fontFamily: monoFont,
          fontSize: 20,
          color: C.muted,
          opacity: caption ? 1 : 0,
        }}
      >
        {caption || "\u00A0"}
      </div>
      <Grain />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// OPoster — 1920x1080 hero still: title + brief + budget-gate lock + team.
// Rendered once via `remotion still`; also downscaled for the 1280x720 thumb.
// ---------------------------------------------------------------------------

export const OPoster: React.FC = () => (
  <AbsoluteFill style={{ background: C.bg }}>
    <Particles />
    {/* title block */}
    <div style={{ position: "absolute", left: 0, right: 0, top: 90, textAlign: "center" }}>
      <div style={{ fontFamily: monoFont, fontSize: 24, color: C.accent, letterSpacing: 6, marginBottom: 22 }}>
        LANGGRAPH MULTI-AGENT ORCHESTRATOR
      </div>
      <div style={{ fontFamily: titleFont, fontWeight: 700, fontSize: 92, color: C.text, lineHeight: 1.08 }}>
        AI agents that stay
        <br />
        on <span style={{ color: C.accent }}>budget</span>.
      </div>
      <div style={{ marginTop: 26, fontFamily: monoFont, fontSize: 26, color: C.muted }}>
        routed live · gated per call · sealed in a hash chain
      </div>
    </div>
    {/* brief + team row */}
    <div style={{ position: "absolute", left: 130, top: 560 }}>
      <BriefCard w={470} status="sealed" />
    </div>
    <div style={{ position: "absolute", left: 655, top: 545, display: "flex", flexDirection: "column", gap: 13 }}>
      <AgentNode role="supervisor" lit={1} w={220} active tag="routing live" />
      <AgentNode role="researcher" lit={1} w={220} />
      <AgentNode role="writer" lit={1} w={220} />
    </div>
    {/* gauge with lock, right side */}
    <div style={{ position: "absolute", left: 1000, top: 545, transform: "scale(0.78)", transformOrigin: "left top" }}>
      <BudgetGauge progress={0.82} w={1040} />
    </div>
    {/* hash chain strip along the bottom */}
    <div style={{ position: "absolute", left: "50%", bottom: 88, transform: "translateX(-50%) scale(0.5)", transformOrigin: "center bottom" }}>
      <HashChain progress={1} w={1560} />
    </div>
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 44,
        textAlign: "center",
        fontFamily: monoFont,
        fontSize: 24,
        color: C.dim,
        letterSpacing: 2,
      }}
    >
      kaarstenanderson.com · Agentic AI Developer
    </div>
    <Grain />
  </AbsoluteFill>
);

// ---------------------------------------------------------------------------
// OVertical — 9:16 re-composition of the 30 s cut. Same beat components render
// inside a scaled 16:9 window (whole scene visible, nothing cropped), with a
// dedicated portrait caption band below the window.
// ---------------------------------------------------------------------------

// per-scene fit: scale of the 1920x1080 scene window inside the 1080-wide canvas
const VFIT: Record<string, number> = {
  hook: 0.7,
  routing: 0.6,
  gate: 0.72,
  seal: 0.66,
  proof: 0.7,
  cta: 0.75,
};

const VBeat: React.FC<{ s: OrchestratorScene }> = ({ s }) => {
  const f = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const t = durationInFrames > 1 ? f / (durationInFrames - 1) : 1;
  switch (s.kind) {
    case "hook": return <HookBeat t={t} />;
    case "routing": return <RoutingBeat t={t} />;
    case "gate": return <GateBeat t={t} />;
    case "seal": return <SealBeat t={t} />;
    case "proof": return <ProofBeat t={t} />;
    case "cta": return <CtaBeat t={t} />;
    default: return null;
  }
};

const VCue: React.FC<{ cues: CaptionCue[] }> = ({ cues }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = f / fps;
  const cue = cues.find((c) => t >= c.from && t < c.to);
  if (!cue) return null;
  const fade = Math.min(1, (t - cue.from) / 0.15, Math.max(0, (cue.to - t) / 0.2));
  return (
    <div
      style={{
        position: "absolute",
        left: 50,
        right: 50,
        top: 1440,
        textAlign: "center",
        fontFamily: titleFont,
        fontWeight: 600,
        fontSize: 52,
        lineHeight: 1.42,
        textShadow: "0 2px 10px #000",
        opacity: Math.max(0, fade),
      }}
    >
      <span
        style={{
          background: "rgba(4,10,14,0.82)",
          borderRadius: 16,
          padding: "12px 26px",
          boxDecorationBreak: "clone",
          WebkitBoxDecorationBreak: "clone",
        } as React.CSSProperties}
      >
        {cue.words && cue.words.length > 0
          ? cue.words.map((w, i) => {
              const spoken = t >= w.e;
              const active = t >= w.s && t < w.e;
              return (
                <span key={i} style={{ color: active ? C.accent : "#fff", fontWeight: active ? 700 : 600, opacity: spoken || active ? 1 : 0.55 }}>
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

export const OVertical: React.FC<OrchestratorProps> = ({ scenes, subtitles }) => {
  const { fps } = useVideoConfig();
  let start = 0;
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      <Particles />
      {/* top label */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 110, textAlign: "center" }}>
        <div style={{ fontFamily: monoFont, fontSize: 26, color: C.accent, letterSpacing: 6 }}>LANGGRAPH</div>
        <div style={{ fontFamily: monoFont, fontSize: 26, color: C.muted, letterSpacing: 4, marginTop: 8 }}>MULTI-AGENT ORCHESTRATOR</div>
      </div>
      {scenes.map((s, i) => {
        const dur = Math.round(s.durationSec * fps);
        const from = start;
        start += dur;
        const sc = VFIT[s.kind] ?? 0.6;
        return (
          <Sequence key={s.id + i} from={from} durationInFrames={dur} name={s.id}>
            <div
              style={{
                position: "absolute",
                left: "50%",
                top: "47%",
                width: 1920,
                height: 1080,
                transform: `translate(-50%, -50%) scale(${sc})`,
              }}
            >
              <VBeat s={s} />
            </div>
          </Sequence>
        );
      })}
      {subtitles && <VCue cues={subtitles} />}
      {/* domain footer */}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 120, textAlign: "center", fontFamily: monoFont, fontSize: 30, color: C.dim, letterSpacing: 3 }}>
        kaarstenanderson.com
      </div>
      <Grain />
    </AbsoluteFill>
  );
};
