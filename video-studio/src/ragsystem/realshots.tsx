/**
 * realshots — moving real-app footage inside the RealFrame chrome, plus the
 * shared motion/act-card pieces for the final film.
 *
 * - `RealClip`  : stub-mode recording (OffthreadVideo) in the browser frame.
 * - `RealShot`  : RealFrame with entry + camera move (push / scroll / fade).
 * - `ActCard`   : letterboxed trailer card (<= 1.2 s, no voice).
 * - `ColumnsBeat` / `BarsBeat` : the control and why-it-works heroes.
 * Geometry for highlights still comes from frames.json (source pixels of the
 * PNGs); clips are full-window motion and get no rect overlays.
 */
import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { AssetRoot } from "./assets";
import { C, bodyFont, monoFont, titleFont } from "../upgrade/utheme";
import { RealFrame } from "./RealFrame";
import type { Highlight, Rect } from "./RealFrame";

const seg = (t: number, a: number, b: number) => Math.min(1, Math.max(0, (t - a) / (b - a)));
const ease = (x: number) => 1 - Math.pow(1 - x, 3);
const CLIP_FPS = 30; // stub-mode clips are recorded at 30 fps

/* ---------------- shared chrome ---------------- */

export const FrameChrome: React.FC<{
  width: number;
  tag?: string;
  tilt?: number;
  glow?: boolean;
  children: React.ReactNode;
}> = ({ width, tag = "real app · live run", tilt = 0, glow = true, children }) => {
  // adaptive chrome: keep the tag fully inside narrow frames
  const showUrl = width >= 700;
  const showTag = tag !== "" && width >= 300;
  const tagSize = width >= 760 ? 22 : width >= 480 ? 16 : 13;
  return (
    <div
      style={{
        width,
        borderRadius: 18,
        overflow: "hidden",
        background: "#0d1418",
        border: `1.5px solid ${C.accent}55`,
        boxShadow: glow
          ? `0 40px 90px #000000d9, 0 0 0 1px ${C.accent}22, 0 0 60px ${C.accent}26`
          : "0 30px 70px #000000cc",
        transform: `perspective(2400px) rotateX(${tilt}deg)`,
        position: "relative",
      }}
    >
      <div
        style={{
          height: 46,
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "0 18px",
          background: "#111a1f",
          borderBottom: `1px solid ${C.line}`,
        }}
      >
        {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
          <div key={c} style={{ width: 13, height: 13, borderRadius: "50%", background: c, opacity: 0.85, flexShrink: 0 }} />
        ))}
        {showUrl && (
          <div
            style={{
              marginLeft: 14,
              flexShrink: 0,
              fontFamily: monoFont,
              fontSize: 18,
              color: C.muted,
              background: "#0a0f12",
              border: `1px solid ${C.line}`,
              borderRadius: 8,
              padding: "5px 16px",
              letterSpacing: 0.5,
              whiteSpace: "nowrap",
            }}
          >
            kaarstenanderson.com
          </div>
        )}
        {showTag && (
          <div
            data-qa="reelframe-tag"
            style={{
              marginLeft: "auto",
              marginRight: 8,
              flexShrink: 0,
              whiteSpace: "nowrap",
              fontFamily: monoFont,
              fontSize: tagSize,
              color: C.accent,
              letterSpacing: 1.5,
              textTransform: "uppercase",
              opacity: 0.9,
            }}
          >
            {tag}
          </div>
        )}
      </div>
      {children}
    </div>
  );
};

/* ---------------- clip in frame ---------------- */

export const RealClip: React.FC<{
  seq: string; // frame dir under public/rag/frames/, e.g. "C02"
  count: number; // extracted frames
  size: [number, number]; // extracted crop px
  width?: number;
  rate?: number; // playback rate vs clip fps (30)
  tag?: string;
  tilt?: number;
  enter?: number; // 0..1 entry progress (1 = settled)
}> = ({ seq, count, size, width = 1400, rate = 1, tag, tilt = 0, enter = 1 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const root = React.useContext(AssetRoot);
  const t = Math.max(0, frame / fps);
  const idx = Math.min(count, Math.floor(t * rate * CLIP_FPS) + 1);
  const [iw, ih] = size;
  const e = ease(enter);
  return (
    <FrameChrome width={width} tag={tag} tilt={tilt * (1 - e)}>
      <div
        style={{
          position: "relative",
          width,
          height: ih * (width / iw),
          overflow: "hidden",
          background: C.bg,
          opacity: 0.25 + 0.75 * e,
          transform: `translateY(${(1 - e) * 60}px)`,
        }}
      >
        <Img
          src={staticFile(`${root}/frames/${seq}/${String(idx).padStart(4, "0")}.png`)}
          style={{ width, height: ih * (width / iw), objectFit: "fill" }}
        />
      </div>
    </FrameChrome>
  );
};

/* ---------------- still with motion ---------------- */

export const RealShot: React.FC<{
  file: string;
  size: [number, number];
  crop?: Rect; // the window shown, in source px (crop[3] = window height)
  scrollY?: [number, number]; // pan the window's y within the source, px
  highlights?: Highlight[];
  hlFrom?: number; // seconds: highlights appear after this local time
  width?: number;
  tag?: string;
  dur: number; // seconds this shot lives
  t: number; // local time s inside the shot
  push?: number; // total push factor (default 1.06)
  enter?: number;
}> = ({ file, size, crop, scrollY, highlights = [], hlFrom = 0, width = 1400, tag, dur, t, push = 1.06, enter = 1 }) => {
  const e = ease(enter);
  const k = Math.min(1, t / Math.max(0.001, dur));
  const zoom = 1 + (push - 1) * k;
  const [ix, iy0, iw, ih] = crop ?? [0, 0, size[0], size[1]];
  const iy = scrollY ? interpolate(k, [0, 1], scrollY) : iy0;
  const liveCrop: Rect = [ix, iy, iw, ih];
  // highlight rects live in source space; when the window pans they move with it
  const hl = t >= hlFrom ? highlights : [];
  return (
    <div style={{ transform: `translateY(${(1 - e) * 50}px)`, opacity: e }}>
      <div style={{ transform: `scale(${zoom})`, transformOrigin: "50% 45%" }}>
        <RealFrame file={file} size={size} crop={liveCrop} highlights={hl} width={width} tag={tag} />
      </div>
    </div>
  );
};

/* ---------------- act card ---------------- */

export const ActCard: React.FC<{ text: string; local: number; dur?: number }> = ({ text, local, dur = 1.1 }) => {
  const p = seg(local, 0, dur);
  if (p >= 1) return null;
  const inn = ease(seg(local, 0, 0.22));
  const out = 1 - ease(seg(local, dur - 0.25, dur));
  return (
    <AbsoluteFill style={{ background: "#000", zIndex: 30, opacity: Math.min(inn, out) }}>
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: 0,
          right: 0,
          transform: `translateY(-50%) scale(${0.92 + inn * 0.08})`,
          textAlign: "center",
          fontFamily: titleFont,
          fontWeight: 700,
          fontSize: text.length > 14 ? 92 : 130,
          letterSpacing: 10,
          color: C.text,
          textShadow: `0 0 60px ${C.accent}44`,
          padding: "0 120px",
        }}
        data-qa="act-card"
      >
        {text}
      </div>
      {/* letterbox */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 120, background: "#000" }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 120, background: "#000" }} />
    </AbsoluteFill>
  );
};

/* ---------------- control: AI · CODE · PEOPLE ---------------- */

export const ColumnsBeat: React.FC<{ t: number }> = ({ t }) => {
  const cols: { word: string; desc: string; c: string; big: string }[] = [
    { word: "AI", desc: "reads and writes", c: C.model, big: "AI" },
    { word: "CODE", desc: "enforces the rules", c: C.accent, big: "{ }" },
    { word: "PEOPLE", desc: "make the final call", c: C.human, big: "◉" },
  ];
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 90 }}>
      {cols.map((col, i) => {
        const p = ease(seg(t, 0.08 + i * 0.2, 0.3 + i * 0.2));
        return (
          <div
            key={col.word}
            style={{
              width: 420,
              height: 480,
              borderRadius: 26,
              background: C.panel,
              border: `2px solid ${p > 0.9 ? col.c : C.line}`,
              boxShadow: p > 0.9 ? `0 0 60px ${col.c}33` : "none",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 30,
              opacity: p,
              transform: `translateY(${(1 - p) * 80}px)`,
            }}
          >
            <div
              style={{
                width: 160,
                height: 160,
                borderRadius: 24,
                border: `3px solid ${col.c}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: monoFont,
                fontWeight: 700,
                fontSize: col.word === "AI" ? 52 : 44,
                color: col.c,
              }}
            >
              {col.big}
            </div>
            <div style={{ fontFamily: titleFont, fontWeight: 800, fontSize: 56, color: col.c, letterSpacing: 4 }}>
              {col.word}
            </div>
            <div style={{ fontFamily: bodyFont, fontSize: 32, color: C.text, opacity: 0.9 }}>{col.desc}</div>
          </div>
        );
      })}
    </div>
  );
};

/* ---------------- why: WITH SEARCH 100% vs WITHOUT 7% ---------------- */

export const BarsBeat: React.FC<{ t: number }> = ({ t }) => {
  const a = ease(seg(t, 0.05, 0.4));
  const b = ease(seg(t, 0.35, 0.85));
  const fall = ease(seg(t, 0.55, 0.9));
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 70 }}>
      {[
        { label: "WITH SEARCH", v: 100, c: C.accent, p: a, w: 1250 },
        { label: "WITHOUT", v: 7, c: C.danger, p: b, w: 1250 },
      ].map((bar) => {
        const frac = bar.v / 100;
        const wPx = bar.w * frac * bar.p;
        const shake = bar.v === 7 && fall > 0 ? Math.sin(t * 60) * 4 * (1 - fall) : 0;
        return (
          <div key={bar.label} style={{ width: bar.w + 320, display: "flex", alignItems: "center", gap: 40, transform: `translateX(${shake}px)` }}>
            <div style={{ width: 300, textAlign: "right", fontFamily: titleFont, fontWeight: 700, fontSize: 38, color: C.text, opacity: bar.p }}>
              {bar.label}
            </div>
            <div style={{ flex: 1, height: 120, borderRadius: 14, background: `${C.dim}33`, border: `1.5px solid ${C.line}`, overflow: "hidden" }}>
              <div
                style={{
                  width: wPx,
                  height: "100%",
                  borderRadius: 14,
                  background: `linear-gradient(90deg, ${bar.c}55, ${bar.c})`,
                  boxShadow: `0 0 40px ${bar.c}55`,
                  opacity: bar.v === 7 ? 1 - fall * 0.15 : 1,
                }}
              />
            </div>
            <div style={{ width: 240, fontFamily: titleFont, fontWeight: 800, fontSize: 100, color: bar.c, opacity: bar.p, lineHeight: 1 }}>
              {Math.round(bar.v * bar.p)}%
            </div>
          </div>
        );
      })}
      <div style={{ fontFamily: monoFont, fontSize: 26, color: C.muted, letterSpacing: 3, opacity: ease(seg(t, 0.6, 0.9)) }}>
        measured baseline · same 18 questions
      </div>
    </div>
  );
};

/* ---------------- letterbox wrapper (cold open) ---------------- */

export const Letterbox: React.FC<{ open: number; children?: React.ReactNode }> = ({ open, children }) => (
  <AbsoluteFill>
    {children}
    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 120 * (1 - open), background: "#000", zIndex: 20 }} />
    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 120 * (1 - open), background: "#000", zIndex: 20 }} />
  </AbsoluteFill>
);
