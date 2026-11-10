import React from "react";
import { AbsoluteFill, Easing, Sequence, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Captions } from "../upgrade/PromoUpgrade";
import type { CaptionCue } from "../upgrade/PromoUpgrade";
import { Grain, Particles, Stage } from "../upgrade/primitives";
import { C, bodyFont, monoFont, titleFont } from "../upgrade/utheme";

export type OSceneKind =
  | "hook"
  | "tension"
  | "reveal"
  | "guardrail"
  | "team"
  | "routing"
  | "debate"
  | "gate"
  | "human"
  | "seal"
  | "control"
  | "proof"
  | "rigor"
  | "real"
  | "adapt"
  | "cta";

export type OScene = { id: string; kind: OSceneKind; durationSec: number };
export type OAnimaticProps = {
  fps: number;
  scenes: OScene[];
  subtitles?: CaptionCue[];
  burnSubtitles?: boolean;
  fadeOutSec?: number;
};

// grey-box content per beat: headline + placeholder blocks named after the
// planned picture elements (mirrors Plan_video.md section 4).
const BEATS: Record<OSceneKind, { head: string; blocks: [string, string][]; note?: string }> = {
  hook: {
    head: "One brief in. The right team. Sealed.",
    blocks: [
      ["brief card slams onto board", "#1 BriefCard"],
      ["5 agent nodes ignite in sequence", "#2 AgentNode ×5"],
      ["light trail → report seals verified ✓ · rewind glitch", "#3 report + seal"],
    ],
  },
  tension: {
    head: "Most agent demos are one fixed pipeline.",
    blocks: [
      ["rigid conveyor pipeline jams", "#1 fixed rails"],
      ["red cost meter spins → $∞", "#2 cost meter"],
      ["quote with glitching `source?` tag", "#3 broken citation"],
    ],
  },
  reveal: {
    head: "LangGraph Multi-Agent Orchestrator",
    blocks: [
      ["title builds from circuit traces (stroke→fill→bloom)", "#1 title"],
      ["'answer to you' light sweep underline", "#2 underline"],
    ],
    note: "MUSIC DROP lands here",
  },
  guardrail: {
    head: "Hostile briefs die before a paid call.",
    blocks: [
      ["red hostile brief hits shield → shatters", "#1 shield"],
      ["counter $0.00 · our brief passes screened ✓", "#2 $0.00 / pass"],
    ],
  },
  team: {
    head: "Each report type gets its own team.",
    blocks: [
      ["report-type dial general → vendor_assessment", "#1 dial"],
      ["core trio + Financial + Compliance snap in", "#2 cards"],
      ["chip: team: 5", "#3 chip"],
    ],
  },
  routing: {
    head: "The supervisor draws its own path. Send() ×3.",
    blocks: [
      ["violet supervisor draws edges at decision time", "#1 DrawnEdge"],
      ["one edge splits → 3 lanes, parallel bars rejoin", "#2 Send() ×3"],
    ],
  },
  debate: {
    head: "Every quote checked against its source.",
    blocks: [
      ["writer ↔ reviewer ping-pong, round 1/3", "#1 DebateLoop"],
      ["'…by 12%…' → '21%' → red unsupported", "#2 QuoteCheck"],
      ["rubric score ticks up", "#3 rubric"],
    ],
  },
  gate: {
    head: "If the worst case won't fit, the call never happens.",
    blocks: [
      ["fuel gauge: cap / spent / remaining", "#1 BudgetGauge"],
      ["worst-case bar doesn't fit → REFUSED lock", "#2 refuse"],
      ["brief turns amber: awaiting review", "#3 amber state"],
    ],
    note: "MUSIC: bass-only breakdown (edit-low.wav)",
  },
  human: {
    head: "A person sees why it paused — and decides.",
    blocks: [
      ["review modal: reason + 4 actions", "#1 ReviewModal"],
      ["click Fund & continue → resume from checkpoint", "#2 funded"],
      ["interrupt() · survives restarts", "#3 checkpoint"],
    ],
  },
  seal: {
    head: "Alter one line — verification fails.",
    blocks: [
      ["transcript stacks as hash-linked blocks", "#1 HashChain"],
      ["ghost edit → later links turn red · verified: false", "#2 tamper"],
      ["rewind → intact · report seals audit ✓", "#3 seal"],
    ],
    note: "sonic signature motif (3 notes)",
  },
  control: {
    head: "Model thinks. Code enforces. Human decides.",
    blocks: [
      ["MODEL violet: routes · drafts · reviews", "#1 model"],
      ["CODE turquoise: guardrail · gate · chain", "#2 code"],
      ["HUMAN amber: fund · approve · reject", "#3 human"],
    ],
  },
  proof: {
    head: "Every gate passed. Twice. Live.",
    blocks: [
      ["citation 1.000 / 0.929 (gate ≥ 0.90)", "#1 counter"],
      ["8/8 attacks blocked @ $0.00", "#2 counter"],
      ["$0.009–0.011 per job (gate ≤ $0.08)", "#3 counter"],
    ],
    note: "footer label: live held-out gate · 2026-10-27",
  },
  rigor: {
    head: "415 tests. 92% coverage. Gates in CI.",
    blocks: [
      ["CI rail lights green stage by stage", "#1 CIRail"],
      ["prompt A/B: v2 regresses → v1 stays", "#2 ABCard"],
      ["Python · FastAPI · LangGraph · Postgres · Docker", "#3 stack"],
    ],
  },
  real: {
    head: "A real product, not a slide.",
    blocks: [
      ["4 masked capture panels in tilted frames, ≤1s each", "#1–4 montage"],
    ],
    note: "MUSIC ONLY — no voice",
  },
  adapt: {
    head: "One class. One registry line. Your domain.",
    blocks: [
      ["registry.register(ContractAnalyst) types in", "#1 RegistryTyper"],
      ["new specialist snaps into team", "#2 card"],
      ["board re-labels: legal · finance · market", "#3 DomainMorph"],
    ],
  },
  cta: {
    head: "Need agents you can trust in production?",
    blocks: [
      ["light trail draws kaarstenanderson.com", "#1 URL"],
      ["Kaarsten Anderson · Agentic AI Developer", "#2 name/role"],
      ["contact@kaarstenanderson.com · GitHub repo", "#3 contact"],
    ],
    note: "sonic signature + stinger, hold ≥ 3 s",
  },
};

const ACCENT: Partial<Record<OSceneKind, string>> = {
  tension: C.danger,
  guardrail: C.danger,
  gate: C.danger,
  human: C.human,
  seal: C.accent,
};

const GreyBlock: React.FC<{ label: string; tag: string; i: number; accent: string }> = ({ label, tag, i, accent }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = interpolate(f, [i * 6, i * 6 + 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  return (
    <div
      style={{
        opacity: p,
        transform: `translateY(${(1 - p) * 26}px)`,
        border: `2px dashed ${accent}66`,
        borderRadius: 14,
        background: `${C.panel}cc`,
        padding: "18px 22px",
        minWidth: 470,
      }}
    >
      <div style={{ fontFamily: monoFont, fontSize: 19, color: accent, marginBottom: 8 }}>{tag}</div>
      <div style={{ fontFamily: bodyFont, fontSize: 25, color: C.text, lineHeight: 1.35 }}>{label}</div>
    </div>
  );
};

const Beat: React.FC<{ s: OScene }> = ({ s }) => {
  const f = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const b = BEATS[s.kind];
  const accent = ACCENT[s.kind] ?? C.accent;
  const headIn = interpolate(f, [0, fps * 0.4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const n = Math.max(2, b.blocks.length);
  return (
    <AbsoluteFill style={{ padding: "0 120px" }}>
      {/* kicker */}
      <div style={{ position: "absolute", top: 58, left: 120, fontFamily: monoFont, fontSize: 24, letterSpacing: 3, color: accent }}>
        {s.id.toUpperCase()} · {s.durationSec.toFixed(1)}s · {durationInFrames}f
      </div>
      {/* headline */}
      <div
        style={{
          position: "absolute",
          top: 120,
          left: 120,
          right: 120,
          fontFamily: titleFont,
          fontWeight: 700,
          fontSize: 62,
          lineHeight: 1.12,
          color: C.text,
          opacity: headIn,
          transform: `translateY(${(1 - headIn) * 22}px)`,
        }}
      >
        {b.head}
      </div>
      {/* placeholder blocks */}
      <div style={{ position: "absolute", top: 320, left: 120, right: 120, display: "flex", flexWrap: "wrap", gap: 26 }}>
        {b.blocks.map(([label, tag], i) => (
          <GreyBlock key={tag} label={label} tag={tag} i={i} accent={accent} />
        ))}
      </div>
      {b.note ? (
        <div style={{ position: "absolute", bottom: 130, left: 120, fontFamily: monoFont, fontSize: 22, color: C.dim }}>
          ▸ {b.note}
        </div>
      ) : null}
      {/* scene progress bar */}
      <div style={{ position: "absolute", bottom: 88, left: 120, right: 120, height: 6, background: `${C.accent}22`, borderRadius: 3 }}>
        <div style={{ width: `${(f / Math.max(1, durationInFrames - 1)) * 100}%`, height: "100%", background: accent, borderRadius: 3 }} />
      </div>
      <div style={{ position: "absolute", bottom: 100, left: 120, fontFamily: monoFont, fontSize: 17, color: `${C.dim}` }}>scene progress</div>
    </AbsoluteFill>
  );
};

const Camera: React.FC<{ idx: number; children?: React.ReactNode }> = ({ idx, children }) => {
  const f = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const entry = interpolate(f, [0, fps * 0.45], [1.045, 1], { easing: Easing.out(Easing.cubic), extrapolateRight: "clamp" });
  const dir = idx % 2 === 0 ? 1 : -1;
  const drift = interpolate(f, [0, Math.max(1, durationInFrames)], [0, 10 * dir]);
  return <AbsoluteFill style={{ transform: `scale(${entry}) translateX(${drift}px)` }}>{children}</AbsoluteFill>;
};

const GlitchSweep: React.FC<{ frames: number }> = ({ frames }) => {
  const f = useCurrentFrame();
  if (f >= frames) return null;
  const x = interpolate(f, [0, frames], [-35, 135], { easing: Easing.inOut(Easing.quad) });
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", top: 0, bottom: 0, left: `${x}%`, width: "32%", background: `linear-gradient(90deg, transparent, ${C.accent}50, transparent)`, transform: "skewX(-18deg)" }} />
    </AbsoluteFill>
  );
};

export const OAnimatic: React.FC<OAnimaticProps> = ({ scenes, subtitles, burnSubtitles = true, fadeOutSec = 1.2 }) => {
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
            <Stage dim={1} brackets={false}>
              <Camera idx={i}>
                <Beat s={s} />
              </Camera>
            </Stage>
            {i > 0 && <GlitchSweep frames={8} />}
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
