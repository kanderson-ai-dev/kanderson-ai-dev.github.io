import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { theme, titleFont } from "../theme";
import type { Callout as C } from "../types";

export const CalloutBadge: React.FC<{ c: C }> = ({ c }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = interpolate(f - (c.atSec ?? 0) * fps, [0, 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", left: c.x, top: c.y, opacity: t, transform: `scale(${0.8 + 0.2 * t})`, display: "flex", alignItems: "center", gap: 14 }}>
      <div style={{ width: 52, height: 52, borderRadius: 26, background: theme.accent, color: "#001a16", fontFamily: titleFont, fontWeight: 700, fontSize: 30, display: "grid", placeItems: "center", boxShadow: `0 0 24px ${theme.accent}` }}>{c.n}</div>
      <div style={{ fontFamily: titleFont, fontWeight: 500, fontSize: 38, color: theme.text, background: "#000000cc", padding: "8px 18px", border: `1px solid ${theme.accent}` }}>{c.text}</div>
    </div>
  );
};
