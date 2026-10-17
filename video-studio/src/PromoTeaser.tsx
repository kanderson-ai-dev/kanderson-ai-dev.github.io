import { AbsoluteFill, Easing, interpolate, Sequence, useCurrentFrame, useVideoConfig } from "remotion";
import { CornerBrackets, GridBackground } from "./components/GridBackground";
import { KineticText } from "./components/KineticText";
import { SceneBody, Subtitles, Sweep } from "./ProjectPromo";
import { theme } from "./theme";
import type { PromoProps } from "./types";

// Vertical (1080x1920) social cut: each 16:9 scene plays inside a neon stage
// scaled to the frame width, with a big headline above and burned subtitles below.
const W = 1920;
const H = 1080;

export const PromoTeaser: React.FC<PromoProps> = ({ scenes, fps, transitionFrames, subtitles, fadeOutSec }) => {
  const { durationInFrames, width } = useVideoConfig();
  const frame = useCurrentFrame();
  let start = 0;
  return (
    <AbsoluteFill style={{ background: theme.bg }}>
      <GridBackground />
      <CornerBrackets />
      {scenes.map((s, i) => {
        const dur = Math.round(s.durationSec * fps);
        const from = start;
        start += dur;
        const scale = s.stageScale ?? width / W;
        const stageW = W * scale;
        const stageH = H * scale;
        const headline = s.headline;
        return (
          <Sequence key={s.id} from={from} durationInFrames={dur} name={s.id}>
            {headline && (
              <div style={{ position: "absolute", top: 130, left: 60, right: 60, display: "flex", justifyContent: "center", textAlign: "center" }}>
                <KineticText text={headline} size={54} color={theme.text} />
              </div>
            )}
            <div
              style={{
                position: "absolute",
                left: (width - stageW) / 2,
                top: Math.round((1920 - stageH) / 2) - 40,
                width: stageW,
                height: stageH,
                overflow: "hidden",
                borderRadius: 16,
                boxShadow: `0 0 40px ${theme.accent}55, 0 0 0 2px ${theme.accent}`
              }}
            >
              <div style={{ position: "relative", width: W, height: H, transform: `scale(${scale})`, transformOrigin: "0 0" }}>
                <SceneBody s={s} />
              </div>
            </div>
            {i > 0 && <Sweep frames={transitionFrames} />}
          </Sequence>
        );
      })}
      {subtitles && <Subtitles cues={subtitles} bottom={110} size={46} />}
      {fadeOutSec ? <AbsoluteFill style={{ background: "#000", opacity: interpolate(frame, [durationInFrames - fadeOutSec * fps, durationInFrames], [0, 1], { extrapolateLeft: "clamp", easing: Easing.linear }) }} /> : null}
    </AbsoluteFill>
  );
};
