import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme, titleFont } from "../theme";

export const NeonTitle: React.FC<{ text: string; size?: number; color?: string }> = ({ text, size = 96, color = theme.accent }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: f, fps, config: { damping: 18 } });
  const glitch = f < 8 && f % 2 === 0 ? (f % 4 === 0 ? 6 : -6) : 0;
  return (
    <div
      style={{
        fontFamily: titleFont, fontWeight: 700, fontSize: size, color,
        textAlign: "center", letterSpacing: 2, lineHeight: 1.1,
        opacity: interpolate(p, [0, 1], [0, 1]),
        transform: `translateY(${interpolate(p, [0, 1], [30, 0])}px) translateX(${glitch}px) scale(${interpolate(p, [0, 1], [0.96, 1])})`,
        textShadow: `0 0 12px ${color}, 0 0 36px ${color}66`
      }}
    >
      {text}
    </div>
  );
};
