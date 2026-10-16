import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { theme, titleFont } from "../theme";
import type { Scene } from "../types";

export const MetricCounter: React.FC<{ m: NonNullable<Scene["metric"]> }> = ({ m }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const v = interpolate(f, [0, fps * 1.5], [m.from, m.to], { easing: Easing.out(Easing.cubic), extrapolateRight: "clamp" });
  const digits = Number.isInteger(m.to) ? 0 : 1;
  return (
    <div style={{ textAlign: "center", fontFamily: titleFont }}>
      <div style={{ fontSize: 40, color: theme.muted, marginBottom: 12 }}>{m.label}</div>
      <div style={{ fontSize: 220, fontWeight: 700, color: theme.accent, textShadow: `0 0 30px ${theme.accent}88`, lineHeight: 1 }}>
        {v.toFixed(digits)}
        {m.suffix}
      </div>
      {m.versus && (
        <div style={{ fontSize: 56, color: theme.danger, marginTop: 20 }}>
          vs {m.versus.value} <span style={{ color: theme.muted, fontSize: 36 }}>{m.versus.label}</span>
        </div>
      )}
      {m.note && <div style={{ fontSize: 28, color: theme.muted, marginTop: 36 }}>{m.note}</div>}
    </div>
  );
};
