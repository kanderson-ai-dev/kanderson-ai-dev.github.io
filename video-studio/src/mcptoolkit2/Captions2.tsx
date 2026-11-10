/**
 * Captions2 — rebuilt kinetic captions (PLAN_upgrade §4).
 *
 * Rules that kill the v1 bugs:
 *  - The active word changes COLOR ONLY — same weight, same size → no reflow.
 *  - Cues are chunked into lines of ≤ 42 chars (≤ 2 lines per block).
 *  - The block is TOP-anchored inside a fixed band → it can never move
 *    vertically, whether it has one line or two.
 *  - A fixed-height backing plate keeps the plate from re-sizing mid-cue.
 */
import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { T, fonts } from "./theme";

export type CapWord = { w: string; s: number; e: number };
export type CapCue = { from: number; to: number; text: string; words?: CapWord[] };
export type CapLine = { from: number; to: number; words: CapWord[] };

const MAX_CHARS = 42;
const BAND_TOP = 900; // px in 1080 design space — safe above kickers, below content
const LINE_H = 58;

/** Greedy word wrap into ≤ MAX_CHARS lines; returns lines with word timings. */
export const chunkCue = (cue: CapCue): CapLine[] => {
  const words = cue.words ?? [{ w: cue.text, s: cue.from, e: cue.to }];
  const lines: CapWord[][] = [];
  let cur: CapWord[] = [];
  let len = 0;
  for (const w of words) {
    const add = (len ? 1 : 0) + w.w.length;
    if (cur.length && len + add > MAX_CHARS) {
      lines.push(cur);
      cur = [];
      len = 0;
    }
    cur.push(w);
    len += add;
  }
  if (cur.length) lines.push(cur);

  // group into blocks of ≤ 2 lines
  const blocks: CapWord[][][] = [];
  for (let i = 0; i < lines.length; i += 2) blocks.push(lines.slice(i, i + 2));

  return blocks.map((blk) => ({
    from: Math.max(cue.from, blk[0][0].s - 0.08),
    to: Math.min(cue.to + 0.05, blk[blk.length - 1][blk[blk.length - 1].length - 1].e + 0.35),
    words: blk.flat(),
  }));
};

export const chunkAll = (cues: CapCue[]): CapLine[] => cues.flatMap(chunkCue);

export const Captions2: React.FC<{ cues: CapCue[] }> = ({ cues }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = f / fps;
  const chunks = React.useMemo(() => chunkAll(cues), [cues]);
  const cur = chunks.find((c) => t >= c.from && t < c.to);
  if (!cur) return null;
  const fade = Math.min(1, (t - cur.from) / 0.12, Math.max(0, (cur.to - t) / 0.16));

  // re-wrap the active chunk into display lines
  const lines: CapWord[][] = [];
  let curLine: CapWord[] = [];
  let len = 0;
  for (const w of cur.words) {
    const add = (len ? 1 : 0) + w.w.length;
    if (curLine.length && len + add > MAX_CHARS) {
      lines.push(curLine);
      curLine = [];
      len = 0;
    }
    curLine.push(w);
    len += add;
  }
  if (curLine.length) lines.push(curLine);

  return (
    <div
      style={{
        position: "absolute",
        left: 60,
        right: 60,
        top: BAND_TOP,
        height: LINE_H * 2,
        textAlign: "center",
        opacity: Math.max(0, fade),
        pointerEvents: "none",
      }}
    >
      <span style={{ display: "inline-block" }}>
        {lines.map((line, li) => (
          <div
            key={li}
            style={{
              height: LINE_H,
              lineHeight: `${LINE_H}px`,
              fontFamily: fonts.body,
              fontWeight: 500,
              fontSize: 40,
              color: "#fff",
              textShadow: "0 2px 12px #000, 0 0 6px #000, 0 1px 3px #000",
              whiteSpace: "nowrap",
            }}
          >
            {line.map((w, i) => {
              const spoken = t >= w.e;
              const active = t >= w.s && t < w.e;
              return (
                <span
                  key={i}
                  style={{
                    color: active ? T.code : "#fff",
                    opacity: spoken || active ? 1 : 0.45,
                    textShadow: active ? `0 0 18px ${T.code}aa, 0 2px 10px #000` : undefined,
                  }}
                >
                  {w.w}
                  {i < line.length - 1 ? " " : ""}
                </span>
              );
            })}
          </div>
        ))}
      </span>
    </div>
  );
};
