/**
 * SliceB / SliceA wrappers — the vertical-slice composition (PLAN_upgrade U1).
 * Plays hook → reveal → gauntlet back-to-back in the shared world, with
 * Captions2 remapped onto slice time. Audio is muxed post-render.
 */
import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import { Particles } from "../upgrade/primitives";
import { Finish } from "../mcptoolkit/look";
import { T, fonts } from "./theme";
import { Captions2, type CapCue } from "./Captions2";
import { SLICE_BEATS, SCENE_START } from "./world";
import { GauntletB, HookB, RevealB } from "./b/beatsB";
import { GauntletA, HookA, RevealA } from "./a/beatsA";

const BEAT_B: Record<string, React.FC> = { hook: HookB, reveal: RevealB, gauntlet: GauntletB };
const BEAT_A: Record<string, React.FC> = { hook: HookA, reveal: RevealA, gauntlet: GauntletA };

/** Title overlay for the reveal beat (screen-space, both options). */
const TitleOverlay: React.FC = () => {
  const f = useCurrentFrame();
  const p = seg(f, 58, 46);
  const sub = segOut(f, 120, 36);
  const ray = seg(f, 64, 90);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(105deg, transparent ${28 + ray * 32}%, ${T.code}16 ${44 + ray * 32}%, transparent ${60 + ray * 32}%)`,
        }}
      />
      <div style={{ position: "absolute", left: 0, right: 0, top: 300, textAlign: "center", opacity: p, transform: `scale(${0.92 + p * 0.08})` }}>
        <div style={{ fontFamily: fonts.mono, fontSize: 30, color: T.code, letterSpacing: 10, marginBottom: 24 }}>THIS DOES</div>
        <div
          style={{
            fontFamily: fonts.title,
            fontWeight: 700,
            fontSize: 132,
            color: T.text,
            textShadow: `0 0 54px ${T.code}66, 0 0 140px ${T.code}33, 0 4px 24px #000`,
            letterSpacing: -1,
          }}
        >
          MCP <span style={{ color: T.code }}>Agent Toolkit</span>
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 660, textAlign: "center", opacity: sub }}>
        <div style={{ display: "inline-flex", gap: 20 }}>
          {["real MCP server", "four guarded tools", "any agent that speaks MCP"].map((c, i) => (
            <span
              key={c}
              style={{
                fontFamily: fonts.mono,
                fontSize: 23,
                color: [T.code, T.model, T.human][i],
                border: `2px solid ${[T.code, T.model, T.human][i]}88`,
                borderRadius: 12,
                padding: "9px 20px",
                background: `${T.panel}cc`,
              }}
            >
              {c}
            </span>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};

const seg = (f: number, a: number, d: number) => Math.min(1, Math.max(0, (f - a) / d));
const segOut = (f: number, a: number, d: number) => {
  const t = seg(f, a, d);
  return t * t * (3 - 2 * t);
};

/** Slice captions: shift the three scenes' cues to slice-local time. */
export const sliceCues = (cues: CapCue[]): CapCue[] =>
  cues
    .filter((c) => {
      const mid = (c.from + c.to) / 2;
      return SLICE_BEATS.some((b) => {
        const sceneId = b.id;
        const s0 = SCENE_START[sceneId];
        const s1 = s0 + b.frames / 60;
        return mid >= s0 && mid < s1;
      });
    })
    .map((c) => {
      const scene = SLICE_BEATS.find((b) => {
        const s0 = SCENE_START[b.id];
        return (c.from + c.to) / 2 >= s0 && (c.from + c.to) / 2 < s0 + b.frames / 60;
      })!;
      const shift = scene.from / 60 - SCENE_START[scene.id];
      return {
        ...c,
        from: c.from + shift,
        to: c.to + shift,
        words: c.words?.map((w) => ({ ...w, s: w.s + shift, e: w.e + shift })),
      };
    });

export const SliceBase: React.FC<{ opt: "A" | "B"; subtitles?: CapCue[] }> = ({ opt, subtitles }) => {
  const beats = opt === "A" ? BEAT_A : BEAT_B;
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: T.bg }}>
      {SLICE_BEATS.map((b) => {
        const Beat = beats[b.id];
        return (
          <Sequence key={b.id} from={b.from} durationInFrames={b.frames} name={b.id}>
            <Beat />
            {b.id === "reveal" && <TitleOverlay />}
          </Sequence>
        );
      })}
      <Particles count={20} color={T.code} />
      <Finish />
      {subtitles && <Captions2 cues={subtitles} />}
    </AbsoluteFill>
  );
};

export const SliceB: React.FC<{ subtitles?: CapCue[] }> = ({ subtitles }) => (
  <SliceBase opt="B" subtitles={subtitles ? sliceCues(subtitles) : undefined} />
);
export const SliceA: React.FC<{ subtitles?: CapCue[] }> = ({ subtitles }) => (
  <SliceBase opt="A" subtitles={subtitles ? sliceCues(subtitles) : undefined} />
);
