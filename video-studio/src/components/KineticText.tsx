import { interpolate, useCurrentFrame } from "remotion";
import { theme, titleFont } from "../theme";

export const KineticText: React.FC<{ text: string; size?: number; color?: string; stagger?: number }> = ({ text, size = 72, color = theme.text, stagger = 3 }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ fontFamily: titleFont, fontWeight: 500, fontSize: size, color, textAlign: "center", maxWidth: 1500, lineHeight: 1.2 }}>
      {text.split(" ").map((w, i) => {
        const t = interpolate(f - i * stagger, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return (
          <span key={i} style={{ display: "inline-block", marginRight: size * 0.28, opacity: t, transform: `translateY(${(1 - t) * 24}px)` }}>
            {w}
          </span>
        );
      })}
    </div>
  );
};
