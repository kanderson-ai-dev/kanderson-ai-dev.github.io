import { interpolate, useCurrentFrame } from "remotion";
import { theme, titleFont } from "../theme";
import type { PainSpec } from "../types";

const Doc: React.FC<{ x: number; y: number; r: number; delay: number; label: string }> = ({ x, y, r, delay, label }) => {
  const f = useCurrentFrame();
  const t = interpolate(f - delay, [0, 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", left: x, top: y, width: 340, height: 440, opacity: t, transform: `translateY(${(1 - t) * 60}px) rotate(${r}deg)`, background: "#0b1114", border: `1px solid ${theme.accent}66`, padding: 24, fontFamily: titleFont }}>
      <div style={{ color: theme.muted, fontSize: 22, marginBottom: 18 }}>{label}</div>
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} style={{ height: 8, marginBottom: 14, width: `${90 - ((i * 37) % 40)}%`, background: "#1c2b2f" }} />
      ))}
    </div>
  );
};

const Cells: React.FC = () => {
  const f = useCurrentFrame();
  const t = interpolate(f, [10, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", left: 1180, top: 330, width: 560, opacity: t, display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 4, transform: "rotate(2deg)" }}>
      {Array.from({ length: 40 }).map((_, i) => (
        <div key={i} style={{ height: 36, background: i % 7 === 0 ? "#12343a" : "#0f1a1d", border: "1px solid #1c2b2f" }} />
      ))}
    </div>
  );
};

const DEFAULT_PAIN: PainSpec = {
  docs: ["Supplier audit report", "Interview notes", "Payroll extract"],
  glitch: "“…no overtime was ever worked…”",
  glitchSub: "not in the document"
};

export const PainGraphic: React.FC<{ pain?: PainSpec }> = ({ pain = DEFAULT_PAIN }) => {
  const f = useCurrentFrame();
  const q = interpolate(f, [110, 122], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const jitter = f > 122 && f % 6 < 2 ? (f % 4 < 2 ? 7 : -7) : 0;
  const [d0, d1, d2] = pain.docs;
  return (
    <>
      <Doc x={200} y={300} r={-6} delay={0} label={d0} />
      <Doc x={440} y={340} r={3} delay={6} label={d1} />
      <Doc x={680} y={310} r={-2} delay={12} label={d2} />
      <Cells />
      <div
        style={{
          position: "absolute", left: 360, top: 800, opacity: q * 0.9, transform: `translateX(${jitter}px)`, fontFamily: titleFont, fontSize: 44, color: theme.danger,
          background: "#2a0a12cc", border: `1px solid ${theme.danger}`, padding: "10px 24px", textShadow: `0 0 14px ${theme.danger}88`
        }}
      >
        {pain.glitch}
        <span style={{ marginLeft: 24, fontSize: 28, color: theme.danger }}>{pain.glitchSub}</span>
      </div>
    </>
  );
};
