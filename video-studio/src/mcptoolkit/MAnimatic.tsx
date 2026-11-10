/**
 * Animatic for the MCP Agent Toolkit flagship (G4 gate): grey-box beats with
 * real type, real camera drift, scratch VO + music edit (muxed post-render).
 * Variant A = stakes-first cold open; variant B = result-first hook.
 * Render: npx remotion render src/index.ts McpToolkitAnimatic out.mp4 --props=...
 */
import React from "react";
import { AbsoluteFill, Easing, Sequence, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Captions } from "../upgrade/PromoUpgrade";
import type { CaptionCue } from "../upgrade/PromoUpgrade";
import { Board, Finish, MC, bodyFont, monoFont, titleFont } from "./look";

export type MSceneKind =
  | "hook" | "reveal" | "what" | "discover" | "gauntlet" | "hardened"
  | "untrusted" | "bounded" | "registry" | "audit" | "control" | "proof"
  | "rigor" | "builder" | "cta";

export type MScene = { id: string; kind: MSceneKind; durationSec: number };
export type MAnimaticProps = {
  fps: number;
  scenes: MScene[];
  subtitles?: CaptionCue[];
  burnSubtitles?: boolean;
  fadeOutSec?: number;
  variant?: "A" | "B";
};

// grey-box content per beat (mirrors Plan_video.md section 4)
const BEATS: Record<MSceneKind, { head: string; blocks: [string, string][]; note?: string }> = {
  hook: {
    head: "Give an agent your database, files, the web.",
    blocks: [
      ["question card types in · 3 resources ignite", "#1 QuestionCard + vault/folder/globe"],
      ["red hostile packet launches → FREEZE", "#2 CallPacket danger"],
      ["'Now ask: what stops it?' + 0.4 s silence", "#3 freeze"],
    ],
    note: "0.4 s dead silence on the freeze",
  },
  reveal: {
    head: "This does. The MCP Agent Toolkit.",
    blocks: [
      ["packet shatters on a gate that slams up", "#1 Gate slam + Shatter"],
      ["shards → circuit traces draw the title", "#2 title draw + god-rays"],
    ],
    note: "MUSIC DROP lands on 'This does.'",
  },
  what: {
    head: "A real MCP server. Four guarded tools.",
    blocks: [
      ["fly-over: client · stdio link · 4 bays · gate array", "#1 board establishing"],
      ["3 anonymous client ports plug the same server", "#2 MCP-client ports"],
    ],
  },
  discover: {
    head: "Tools discovered at runtime — tools/list.",
    blocks: [
      ["tools/list packet; 4 bays light one by one", "#1 bays + arpeggio"],
      ["schema chips fly to the model's fn shelf", "#2 chips"],
      ["bay unplugged → next run: 3 chips, still answers", "#3 unplug + next run"],
    ],
  },
  gauntlet: {
    head: "Every call: rate · sandbox · sanitize.",
    blocks: [
      ["green call passes 3 gates (✓ per word)", "#1 GateArray pass"],
      ["../../etc/passwd shatters at sandbox → forbidden", "#2 shatter + error chip"],
      ["burst → rate_limited", "#3 burst"],
    ],
    note: "honest 2-state: hostile passes rate, dies at sandbox",
  },
  hardened: {
    head: "Read-only, twice. Files can't escape.",
    blocks: [
      ["vault: DROP TABLE hits statement guard", "#1 Padlock 1"],
      ["forced write hits mode=ro conn", "#2 Padlock 2"],
      ["../ path + symlink bridge retract at shore", "#3 Shoreline"],
    ],
  },
  untrusted: {
    head: "Tool output = untrusted data.",
    blocks: [
      ["result carries glowing hidden chars → stripped", "#1 ScannerWall"],
      ["over-long result clipped, truncation marker", "#2 cap 12 000"],
      ["glass wall: result lane | system prompt", "#3 wall"],
    ],
  },
  bounded: {
    head: "Bounded: answer · iter limit · budget cap.",
    blocks: [
      ["iteration ring 1/8 → 3/8", "#1 IterationRing"],
      ["3 exit gates; exits via answer · 3 sources", "#2 exit gates"],
      ["ghost run hits cost cap → stops", "#3 CostMeter"],
    ],
  },
  registry: {
    head: "Prompts ship only by beating the champion.",
    blocks: [
      ["answer card → prompt card; rise to upper deck", "#1 PromptCard"],
      ["version stack v1…v4; candidate rides in", "#2 VersionStack"],
      ["twin-lane arena, bars race", "#3 ABArena"],
    ],
  },
  audit: {
    head: "v2 lost. Never shipped. Hash-chained.",
    blocks: [
      ["v2 bars short: 3.71→3.33 · 11/13 → BLOCKED", "#1 AB result + stamp"],
      ["blocked dialog replica · audit chain stacks", "#2 BlockedDialogReplica"],
      ["ghost edit → later links red · rewind → seal", "#3 AuditChain tamper"],
    ],
    note: "MUSIC: calm layer (pads only) · sonic signature on seal",
  },
  control: {
    head: "Models think. Code enforces. People sign off.",
    blocks: [
      ["MODEL violet · CODE turquoise · HUMAN amber", "#1 3 columns + legend"],
    ],
    note: "3 equal hits, music rebuilds",
  },
  proof: {
    head: "4.79/5 · 13/13 · first run failed → fixed.",
    blocks: [
      ["counters land on downbeats: 4.79 · 4.83 · 13/13", "#1 ScoreRows"],
      ["red first-run row 3.58 → arena → green 4.83", "#2 red→green"],
      ["footer: live scorecard · 24 questions · $0.0093", "#3 footer"],
    ],
    note: "EMOTIONAL PEAK — full resolve chord on green",
  },
  rigor: {
    head: "517 tests. Strict typing. Zero-secret CI.",
    blocks: [
      ["CI rail lights: ruff → mypy → 517 → 92.98% → e2e → docker", "#1 CiRail"],
      ["3 console replicas strip (fictional data)", "#2 replicas"],
      ["stack line: Python · MCP SDK · FastAPI · React · SQLite · Docker", "#3 stack"],
    ],
  },
  builder: {
    head: "Designed, built, and measured by Kaarsten Anderson.",
    blocks: [
      ["board pulls back → glowing constellation", "#1 Constellation"],
      ["credit line lands; soft signature hit on the name", "#2 credit super"],
      ["5th bay snaps on: knowledge base · ticketing · warehouse", "#3 your tools next"],
    ],
  },
  cta: {
    head: "kaarstenanderson.com",
    blocks: [
      ["light trail writes the URL", "#1 URL draw"],
      ["Kaarsten Anderson · Agentic AI Developer", "#2 name/role"],
      ["contact@ · GitHub button · hold ≥ 3 s", "#3 contact"],
    ],
    note: "sonic signature + stinger · music tail rings",
  },
};

// variant B (result-first): only the first two beats change
const BEATS_B: Partial<Record<MSceneKind, typeof BEATS.hook>> = {
  hook: {
    head: "One question in. A cited answer out.",
    blocks: [
      ["5 s journey: question → tools light → answer 3 sources", "#1 condensed journey"],
      ["'What stops it from going wrong?'", "#2 re-ask"],
    ],
    note: "result-first cold open",
  },
  reveal: {
    head: "This does. The MCP Agent Toolkit.",
    blocks: [
      ["answer card rewinds → packet → gate slams", "#1 rewind + Gate slam"],
      ["shards → circuit traces draw the title", "#2 title draw + god-rays"],
    ],
    note: "MUSIC DROP lands on 'This does.'",
  },
};

const ACCENT: Partial<Record<MSceneKind, string>> = {
  hook: MC.danger,
  gauntlet: MC.danger,
  hardened: MC.code,
  audit: MC.danger,
  proof: MC.code,
  builder: MC.human,
};

const GreyBlock: React.FC<{ label: string; tag: string; i: number; accent: string }> = ({ label, tag, i, accent }) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [i * 6, i * 6 + 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  return (
    <div style={{
      opacity: p, transform: `translateY(${(1 - p) * 26}px)`,
      border: `2px dashed ${accent}66`, borderRadius: 14, background: `${MC.panel}cc`,
      padding: "18px 22px", minWidth: 460, maxWidth: 700,
    }}>
      <div style={{ fontFamily: monoFont, fontSize: 19, color: accent, marginBottom: 8 }}>{tag}</div>
      <div style={{ fontFamily: bodyFont, fontSize: 25, color: MC.text, lineHeight: 1.35 }}>{label}</div>
    </div>
  );
};

const Beat: React.FC<{ s: MScene; variant: "A" | "B" }> = ({ s, variant }) => {
  const f = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const b = (variant === "B" && BEATS_B[s.kind]) ? BEATS_B[s.kind]! : BEATS[s.kind];
  const accent = ACCENT[s.kind] ?? MC.code;
  const headIn = interpolate(f, [0, fps * 0.4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  return (
    <AbsoluteFill style={{ padding: "0 120px" }}>
      <div style={{ position: "absolute", top: 58, left: 120, fontFamily: monoFont, fontSize: 24, letterSpacing: 3, color: accent }}>
        {s.id.toUpperCase()} · {s.durationSec.toFixed(1)}s · {durationInFrames}f · hook-{variant}
      </div>
      <div style={{
        position: "absolute", top: 120, left: 120, right: 120,
        fontFamily: titleFont, fontWeight: 700, fontSize: 62, lineHeight: 1.12, color: MC.text,
        opacity: headIn, transform: `translateY(${(1 - headIn) * 22}px)`,
      }}>
        {b.head}
      </div>
      <div style={{ position: "absolute", top: 330, left: 120, right: 120, display: "flex", flexWrap: "wrap", gap: 26 }}>
        {b.blocks.map(([label, tag], i) => (
          <GreyBlock key={tag} label={label} tag={tag} i={i} accent={accent} />
        ))}
      </div>
      {b.note ? (
        <div style={{ position: "absolute", bottom: 150, left: 120, fontFamily: monoFont, fontSize: 22, color: MC.muted }}>
          ▸ {b.note}
        </div>
      ) : null}
      <div style={{ position: "absolute", bottom: 100, left: 120, right: 120, height: 6, background: `${MC.code}22`, borderRadius: 3 }}>
        <div style={{ width: `${(f / Math.max(1, durationInFrames - 1)) * 100}%`, height: "100%", background: accent, borderRadius: 3 }} />
      </div>
      <div style={{ position: "absolute", bottom: 110, left: 120, fontFamily: monoFont, fontSize: 17, color: MC.muted }}>scene progress</div>
    </AbsoluteFill>
  );
};

const CameraDrift: React.FC<{ idx: number; children?: React.ReactNode }> = ({ idx, children }) => {
  const f = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const entry = interpolate(f, [0, fps * 0.45], [1.045, 1], { easing: Easing.out(Easing.cubic), extrapolateRight: "clamp" });
  const dir = idx % 2 === 0 ? 1 : -1;
  const drift = interpolate(f, [0, Math.max(1, durationInFrames)], [0, 10 * dir]);
  return <AbsoluteFill style={{ transform: `scale(${entry}) translateX(${drift}px)` }}>{children}</AbsoluteFill>;
};

export const MAnimatic: React.FC<MAnimaticProps> = ({ scenes, subtitles, burnSubtitles = true, fadeOutSec = 1.4, variant = "A" }) => {
  const { fps, durationInFrames } = useVideoConfig();
  const frame = useCurrentFrame();
  let start = 0;
  return (
    <AbsoluteFill style={{ background: MC.bg }}>
      <Board />
      {scenes.map((s, i) => {
        const dur = Math.round(s.durationSec * fps);
        const from = start;
        start += dur;
        return (
          <Sequence key={s.id} from={from} durationInFrames={dur} name={s.id}>
            <CameraDrift idx={i}>
              <Beat s={s} variant={variant} />
            </CameraDrift>
          </Sequence>
        );
      })}
      <Finish />
      {fadeOutSec ? (
        <AbsoluteFill style={{
          background: "#000",
          opacity: interpolate(frame, [durationInFrames - fadeOutSec * fps, durationInFrames], [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }} />
      ) : null}
      {burnSubtitles && subtitles && <Captions cues={subtitles} />}
    </AbsoluteFill>
  );
};
