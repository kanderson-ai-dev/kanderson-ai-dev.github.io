/**
 * PromoMcpToolkit — the flagship film composition (Plan_video.md §4).
 * Consumes the generated timeline JSON (scenes + subtitles + music moments),
 * lays out one Sequence per beat inside a shared board world, and renders
 * silent — guide/master audio is muxed post-render.
 *
 * The design space is fixed at 1920×1080 and scaled to the render
 * resolution by the useVideoConfig wrapper, so the same props render a
 * 1080p rough cut or the 4K master unchanged.
 */
import React from "react";
import { AbsoluteFill, Easing, Sequence, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Particles } from "../upgrade/primitives";
import type { CaptionCue } from "../upgrade/PromoUpgrade";
import { Finish, MC, titleFont } from "./look";
import type { MScene } from "./MAnimatic";
import { MBeatFor } from "./beats";

export type PromoMcpToolkitProps = {
  fps: number;
  scenes: MScene[];
  subtitles?: CaptionCue[];
  burnSubtitles?: boolean;
  fadeOutSec?: number;
};

/** Per-scene camera: entry settle + slow drift, alternating direction. */
const Camera: React.FC<{ idx: number; children?: React.ReactNode }> = ({ idx, children }) => {
  const f = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const entry = interpolate(f, [0, fps * 0.4], [1.045, 1], { easing: Easing.out(Easing.cubic), extrapolateRight: "clamp" });
  const dir = idx % 2 === 0 ? 1 : -1;
  const driftX = interpolate(f, [0, Math.max(1, durationInFrames)], [0, 10 * dir]);
  const push = interpolate(f, [0, Math.max(1, durationInFrames)], [1, 1.018]);
  return <AbsoluteFill style={{ transform: `scale(${entry * push}) translateX(${driftX}px)` }}>{children}</AbsoluteFill>;
};

/** Turquoise gate-sweep at every scene join. */
const Sweep: React.FC<{ frames?: number }> = ({ frames = 10 }) => {
  const f = useCurrentFrame();
  if (f >= frames) return null;
  const x = interpolate(f, [0, frames], [-30, 130], { easing: Easing.inOut(Easing.quad) });
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", top: 0, bottom: 0, left: `${x}%`, width: "30%", background: `linear-gradient(90deg, transparent, ${MC.code}42, transparent)`, transform: "skewX(-16deg)" }} />
      <div style={{ position: "absolute", top: 0, bottom: 0, left: `${x - 5}%`, width: "5%", background: `${MC.model}28`, transform: "skewX(-16deg)" }} />
    </AbsoluteFill>
  );
};

/** Kinetic captions pinned to the lower band (top edge ≈ y936). */
const FilmCaptions: React.FC<{ cues: CaptionCue[] }> = ({ cues }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = f / fps;
  const cue = cues.find((c) => t >= c.from && t < c.to);
  if (!cue) return null;
  const fade = Math.min(1, (t - cue.from) / 0.15, Math.max(0, (cue.to - t) / 0.2));
  return (
    <div style={{ position: "absolute", left: 40, right: 40, bottom: 30, textAlign: "center", fontFamily: titleFont, fontWeight: 500, fontSize: 40, textShadow: "0 2px 10px #000, 0 0 4px #000", opacity: Math.max(0, fade) }}>
      <span style={{ background: "rgba(3,8,12,0.82)", borderRadius: 14, padding: "8px 26px", boxDecorationBreak: "clone", WebkitBoxDecorationBreak: "clone", lineHeight: 1.6 } as React.CSSProperties}>
        {cue.words && cue.words.length > 0
          ? cue.words.map((w, i) => {
              const spoken = t >= w.e;
              const active = t >= w.s && t < w.e;
              return (
                <span key={i} style={{ color: active ? MC.code : "#fff", fontWeight: active ? 700 : 500, opacity: spoken || active ? 1 : 0.5 }}>
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

export const PromoMcpToolkit: React.FC<PromoMcpToolkitProps> = ({ scenes, subtitles, burnSubtitles = true, fadeOutSec = 1.4 }) => {
  const { fps, width, height, durationInFrames } = useVideoConfig();
  const frame = useCurrentFrame();
  const scale = Math.min(width / 1920, height / 1080);
  let start = 0;
  return (
    <AbsoluteFill style={{ background: MC.bg }}>
      <AbsoluteFill style={{ transform: `scale(${scale})`, transformOrigin: "center" }}>
        {scenes.map((s, i) => {
          const dur = Math.round(s.durationSec * fps);
          const from = start;
          start += dur;
          const Beat = MBeatFor(s.kind);
          return (
            <Sequence key={s.id + i} from={from} durationInFrames={dur} name={s.id}>
              <AbsoluteFill style={{ background: MC.bg }}>
                <Camera idx={i}>
                  <Beat />
                </Camera>
              </AbsoluteFill>
              {i > 0 && <Sweep frames={10} />}
            </Sequence>
          );
        })}
        <Particles count={22} color={MC.code} />
      </AbsoluteFill>
      <Finish />
      {fadeOutSec ? (
        <AbsoluteFill
          style={{
            background: "#000",
            opacity: interpolate(frame, [durationInFrames - fadeOutSec * fps, durationInFrames], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          }}
        />
      ) : null}
      {burnSubtitles && subtitles && (
        <AbsoluteFill style={{ transform: `scale(${scale})`, transformOrigin: "center" }}>
          <FilmCaptions cues={subtitles} />
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
