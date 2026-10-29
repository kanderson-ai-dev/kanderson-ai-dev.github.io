import { AbsoluteFill, Easing, interpolate, Sequence, useCurrentFrame, useVideoConfig } from "remotion";
import { ClipFrame, ClipWindow } from "./components/ClipFrame";
import { ArchGraphic } from "./components/ArchGraphic";
import { HookFlow } from "./components/HookFlow";
import { PainGraphic } from "./components/PainGraphic";
import { CalloutBadge } from "./components/Callout";
import { EndCard } from "./components/EndCard";
import { CornerBrackets, GridBackground } from "./components/GridBackground";
import { KineticText } from "./components/KineticText";
import { MetricCounter } from "./components/MetricCounter";
import { NeonTitle } from "./components/NeonTitle";
import { theme, titleFont } from "./theme";
import type { PromoProps, Scene } from "./types";

export const Sweep: React.FC<{ frames: number }> = ({ frames }) => {
  const f = useCurrentFrame();
  if (f >= frames) return null;
  const x = interpolate(f, [0, frames], [-30, 130], { easing: Easing.inOut(Easing.quad) });
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", top: 0, bottom: 0, left: `${x}%`, width: "30%", background: `linear-gradient(90deg, transparent, ${theme.accent}55, transparent)`, transform: "skewX(-20deg)" }} />
    </AbsoluteFill>
  );
};

let FPS = 30;

const TrioPanelView: React.FC<{ p: NonNullable<Scene["panels"]>[number] }> = ({ p }) => {
  const f = useCurrentFrame();
  const t = interpolate(f - p.delaySec * FPS, [0, 14], [0, 1], { easing: Easing.out(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const bob = Math.sin(f / 24 + p.x) * 6;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, opacity: t, transform: `translateY(${(1 - t) * 80 + bob}px)` }}>
      <ClipWindow clip={p.clip} startSec={p.startSec} rate={p.rate} crop={p.crop} w={p.w} style={{ left: p.x, top: p.y }} />
    </div>
  );
};

export const SceneBody: React.FC<{ s: Scene }> = ({ s }) => {
  const center: React.CSSProperties = { alignItems: "center", justifyContent: "center", gap: 28 };
  switch (s.kind) {
    case "title":
      return (
        <AbsoluteFill style={center}>
          <NeonTitle text={s.text ?? ""} size={s.text && s.text.length > 40 ? 76 : 110} />
          {s.sub && <KineticText text={s.sub} size={44} color={theme.muted} />}
        </AbsoluteFill>
      );
    case "problem":
      return (
        <AbsoluteFill style={center}>
          <KineticText text={s.text ?? ""} size={80} color={theme.danger} />
        </AbsoluteFill>
      );
    case "flow":
      return (
        <AbsoluteFill>
          <div style={{ position: "absolute", top: 90, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
            <KineticText text={s.text ?? ""} size={56} color={theme.text} />
          </div>
          <HookFlow flow={s.flow} />
        </AbsoluteFill>
      );
    case "arch":
      return (
        <AbsoluteFill>
          <div style={{ position: "absolute", top: 60, left: 0, right: 0 }}>
            <NeonTitle text={s.text ?? ""} size={64} />
          </div>
          <ArchGraphic llmAt={s.arch?.llmAt ?? 100} codeAt={s.arch?.codeAt ?? 186} humanAt={s.arch?.humanAt ?? 240} workers={s.workers} />
        </AbsoluteFill>
      );
    case "pain":
      return (
        <AbsoluteFill>
          <div style={{ position: "absolute", top: 90, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
            <KineticText text={s.text ?? ""} size={64} color={theme.text} />
          </div>
          <PainGraphic pain={s.pain} />
        </AbsoluteFill>
      );
    case "trio":
      return (
        <AbsoluteFill>
          <div style={{ position: "absolute", top: 70, left: 0, right: 0 }}>
            <NeonTitle text={s.text ?? ""} size={84} />
          </div>
          {s.panels?.map((p, i) => <TrioPanelView key={i} p={p} />)}
        </AbsoluteFill>
      );
    case "clip": {
      const mode = s.frame ?? "inset";
      let at = 0;
      return (
        <AbsoluteFill>
          {s.segments?.map((g, i) => {
            const d = Math.round(g.durationSec * FPS);
            const from = at;
            at += d;
            return (
              <Sequence key={i} from={from} durationInFrames={d} layout="none">
                <ClipFrame clip={g.clip} startSec={g.startSec} rate={g.rate} zoom={g.zoom} mode={mode}>
                  {g.callouts?.map((c) => <CalloutBadge key={c.n} c={c} />)}
                </ClipFrame>
              </Sequence>
            );
          })}
          {s.text && (
            mode === "full" ? (
              <div style={{ position: "absolute", left: 96, bottom: 150, maxWidth: 1300, fontFamily: titleFont, fontWeight: 700, fontSize: 52, color: theme.text, background: "#000000d9", padding: "12px 24px", borderLeft: `6px solid ${theme.accent}` }}>{s.text}</div>
            ) : (
              <div style={{ position: "absolute", left: 204, top: 24, fontFamily: titleFont, fontWeight: 700, fontSize: 40, color: theme.text, background: "#000000cc", padding: "6px 20px", borderLeft: `6px solid ${theme.accent}` }}>{s.text}</div>
            )
          )}
        </AbsoluteFill>
      );
    }
    case "metric":
      return (
        <AbsoluteFill style={center}>
          {s.backdrop && (
            <AbsoluteFill style={{ opacity: 0.16, filter: "blur(6px)" }}>
              <ClipFrame clip={s.backdrop.clip} startSec={s.backdrop.startSec} mode="full" />
            </AbsoluteFill>
          )}
          {s.metric && <MetricCounter m={s.metric} />}
        </AbsoluteFill>
      );
    case "end":
      return <AbsoluteFill style={center}>{s.end && <EndCard e={s.end} />}</AbsoluteFill>;
  }
};

export const Subtitles: React.FC<{ cues: NonNullable<PromoProps["subtitles"]>; bottom?: number; size?: number }> = ({ cues, bottom = 36, size = 44 }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = f / fps;
  const cue = cues.find((c) => t >= c.from && t < c.to);
  if (!cue) return null;
  return (
    <div style={{ position: "absolute", left: 40, right: 40, bottom, textAlign: "center", fontFamily: titleFont, fontWeight: 500, fontSize: size, color: "#fff", textShadow: "0 2px 8px #000, 0 0 3px #000", whiteSpace: "pre-line" }}>
      <span style={{ background: "rgba(4,10,14,0.78)", borderRadius: 14, padding: "8px 26px", boxDecorationBreak: "clone", WebkitBoxDecorationBreak: "clone", lineHeight: 1.7 } as React.CSSProperties}>{cue.text}</span>
    </div>
  );
};

export const ProjectPromo: React.FC<PromoProps & { burnSubtitles?: boolean }> = ({ scenes, fps, transitionFrames, subtitles, burnSubtitles, fadeOutSec }) => {
  FPS = fps;
  const { durationInFrames } = useVideoConfig();
  const frame = useCurrentFrame();
  let start = 0;
  return (
    <AbsoluteFill style={{ background: theme.bg }}>
      {scenes.map((s, i) => {
        const dur = Math.round(s.durationSec * fps);
        const from = start;
        start += dur;
        return (
          <Sequence key={s.id} from={from} durationInFrames={dur} name={s.id}>
            {!(s.kind === "clip" && s.frame === "full") && <GridBackground dim={s.kind === "metric" ? 0.6 : 1} />}
            {!(s.kind === "clip" && s.frame === "full") && <CornerBrackets />}
            <SceneBody s={s} />
            {i > 0 && <Sweep frames={transitionFrames} />}
          </Sequence>
        );
      })}
      {fadeOutSec ? <AbsoluteFill style={{ background: "#000", opacity: interpolate(frame, [durationInFrames - fadeOutSec * fps, durationInFrames], [0, 1], { extrapolateLeft: "clamp" }) }} /> : null}
      {burnSubtitles && subtitles && <Subtitles cues={subtitles} />}
    </AbsoluteFill>
  );
};
