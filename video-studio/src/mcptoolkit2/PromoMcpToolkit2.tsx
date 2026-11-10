/**
 * PromoMcpToolkit2 — the full film on the option-B world (PLAN_upgrade U2+).
 * Same scenes/subtitles props as the flagship timeline; each scene is a beat
 * inside the shared deep-2.5D world, captions = stable Captions2.
 */
import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import { Particles } from "../upgrade/primitives";
import { Finish } from "../mcptoolkit/look";
import { T } from "./theme";
import { Captions2, type CapCue } from "./Captions2";
import { HookB, RevealB, GauntletB } from "./b/beatsB";
import {
  WhatB, DiscoverB, HardenedB, BoundedB, RegistryB, AuditB,
  ControlB, ProofB, RigorB, BuilderB, CtaB,
} from "./b/beatsB2";

export type Promo2Props = { fps: number; scenes: { id: string; durationSec: number }[]; subtitles: CapCue[]; burnSubtitles?: boolean; fadeOutSec?: number };

const BEAT: Record<string, React.FC> = {
  hook: HookB, reveal: RevealB, what: WhatB, discover: DiscoverB, gauntlet: GauntletB,
  hardened: HardenedB, bounded: BoundedB, registry: RegistryB, audit: AuditB, control: ControlB,
  proof: ProofB, rigor: RigorB, builder: BuilderB, cta: CtaB,
};

const OVERLAYS: Record<string, React.FC> = { reveal: TitleOver };

function TitleOver() {
  const f = useCurrentFrameInner();
  const p = segF(f, 58, 46);
  const sub = segFO(f, 120, 36);
  const ray = segF(f, 64, 90);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", inset: 0, background: `linear-gradient(105deg, transparent ${28 + ray * 32}%, ${T.code}16 ${44 + ray * 32}%, transparent ${60 + ray * 32}%)` }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 300, textAlign: "center", opacity: p, transform: `scale(${0.92 + p * 0.08})` }}>
        <div style={{ fontFamily: fontsM.mono, fontSize: 30, color: T.code, letterSpacing: 10, marginBottom: 24 }}>THIS DOES</div>
        <div style={{ fontFamily: fontsM.title, fontWeight: 700, fontSize: 132, color: T.text, textShadow: `0 0 54px ${T.code}66, 0 0 140px ${T.code}33, 0 4px 24px #000`, letterSpacing: -1 }}>
          MCP <span style={{ color: T.code }}>Agent Toolkit</span>
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 660, textAlign: "center", opacity: sub }}>
        <div style={{ display: "inline-flex", gap: 20 }}>
          {["real MCP server", "four guarded tools", "any agent that speaks MCP"].map((c, i) => (
            <span key={c} style={{ fontFamily: fontsM.mono, fontSize: 23, color: [T.code, T.model, T.human][i], border: `2px solid ${[T.code, T.model, T.human][i]}88`, borderRadius: 12, padding: "9px 20px", background: `${T.panel}cc` }}>
              {c}
            </span>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
}

import { fonts as fontsM } from "./theme";
const useCurrentFrameInner = useCurrentFrame;
const segF = (f: number, a: number, d: number) => Math.min(1, Math.max(0, (f - a) / d));
const segFO = (f: number, a: number, d: number) => { const t = segF(f, a, d); return t * t * (3 - 2 * t); };

export const PromoMcpToolkit2: React.FC<Promo2Props> = ({ fps, scenes, subtitles, fadeOutSec = 1.4 }) => {
  let acc = 0;
  const seqs = scenes.map((s) => {
    const from = Math.round(acc * fps);
    const frames = Math.round(s.durationSec * fps);
    acc += s.durationSec;
    return { id: s.id, from, frames };
  });
  const total = Math.round(acc * fps);
  return (
    <AbsoluteFill style={{ background: T.bg }}>
      {seqs.map((s) => {
        const Beat = BEAT[s.id];
        const Ov = OVERLAYS[s.id];
        return Beat ? (
          <Sequence key={s.id} from={s.from} durationInFrames={s.frames} name={s.id}>
            <Beat />
            {Ov && <Ov />}
          </Sequence>
        ) : null;
      })}
      <Particles count={20} color={T.code} />
      <Finish />
      {/* final fade-out */}
      <AbsoluteFill
        style={{
          pointerEvents: "none",
          background: "#010409",
          opacity: ((f) => Math.min(1, Math.max(0, (f - (total - fadeOutSec * fps)) / (fadeOutSec * fps))))(useCurrentFrame()),
        }}
      />
      <Captions2 cues={subtitles} />
    </AbsoluteFill>
  );
};
