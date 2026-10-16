import { AbsoluteFill, Easing, interpolate, OffthreadVideo, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { CalloutBadge } from "./components/Callout";
import { EndCard } from "./components/EndCard";
import { CornerBrackets, GridBackground } from "./components/GridBackground";
import { KineticText } from "./components/KineticText";
import { MetricCounter } from "./components/MetricCounter";
import { NeonTitle } from "./components/NeonTitle";
import { ZoomPan } from "./components/ZoomPan";
import { theme, titleFont } from "./theme";
import type { PromoProps, Scene } from "./types";

const Sweep: React.FC<{ frames: number }> = ({ frames }) => {
  const f = useCurrentFrame();
  if (f >= frames) return null;
  const x = interpolate(f, [0, frames], [-30, 130], { easing: Easing.inOut(Easing.quad) });
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", top: 0, bottom: 0, left: `${x}%`, width: "30%", background: `linear-gradient(90deg, transparent, ${theme.accent}55, transparent)`, transform: "skewX(-20deg)" }} />
    </AbsoluteFill>
  );
};

const SceneBody: React.FC<{ s: Scene }> = ({ s }) => {
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
    case "clip":
      return (
        <AbsoluteFill>
          <ZoomPan from={s.zoom?.from} to={s.zoom?.to}>
            {s.clip && <OffthreadVideo src={staticFile(s.clip)} muted style={{ width: 1920, height: 1080 }} />}
          </ZoomPan>
          {s.callouts?.map((c) => <CalloutBadge key={c.n} c={c} />)}
          {s.text && (
            <div style={{ position: "absolute", left: 96, bottom: 80, fontFamily: titleFont, fontWeight: 700, fontSize: 52, color: theme.text, background: "#000000cc", padding: "10px 22px", borderLeft: `6px solid ${theme.accent}` }}>{s.text}</div>
          )}
        </AbsoluteFill>
      );
    case "metric":
      return <AbsoluteFill style={center}>{s.metric && <MetricCounter m={s.metric} />}</AbsoluteFill>;
    case "end":
      return <AbsoluteFill style={center}>{s.end && <EndCard e={s.end} />}</AbsoluteFill>;
  }
};

const Subtitles: React.FC<{ cues: NonNullable<PromoProps["subtitles"]> }> = ({ cues }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = f / fps;
  const cue = cues.find((c) => t >= c.from && t < c.to);
  if (!cue) return null;
  return (
    <div style={{ position: "absolute", left: 160, right: 160, bottom: 36, textAlign: "center", fontFamily: titleFont, fontWeight: 500, fontSize: 44, color: "#fff", textShadow: "0 2px 8px #000, 0 0 3px #000", whiteSpace: "pre-line" }}>{cue.text}</div>
  );
};

export const ProjectPromo: React.FC<PromoProps & { burnSubtitles?: boolean }> = ({ scenes, fps, transitionFrames, subtitles, burnSubtitles }) => {
  let start = 0;
  return (
    <AbsoluteFill style={{ background: theme.bg }}>
      {scenes.map((s, i) => {
        const dur = Math.round(s.durationSec * fps);
        const from = start;
        start += dur;
        return (
          <Sequence key={s.id} from={from} durationInFrames={dur} name={s.id}>
            {s.kind !== "clip" && <GridBackground dim={s.kind === "metric" ? 0.6 : 1} />}
            {s.kind !== "clip" && <CornerBrackets />}
            <SceneBody s={s} />
            {i > 0 && <Sweep frames={transitionFrames} />}
          </Sequence>
        );
      })}
      {burnSubtitles && subtitles && <Subtitles cues={subtitles} />}
    </AbsoluteFill>
  );
};
