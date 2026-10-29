import { Easing, interpolate, useCurrentFrame } from "remotion";
import { theme, titleFont } from "../theme";
import type { FlowSpec } from "../types";

const ramp = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], { easing: Easing.out(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" });
const box = (x: number, y: number, w: number, h: number, extra: React.CSSProperties = {}): React.CSSProperties => ({
  position: "absolute", left: x, top: y, width: w, height: h, background: theme.panel, border: `2px solid ${theme.accent}`, boxShadow: `0 0 28px ${theme.accent}44`, fontFamily: titleFont, ...extra
});

const Beam: React.FC<{ x1: number; x2: number; y: number; start: number }> = ({ x1, x2, y, start }) => {
  const f = useCurrentFrame();
  const t = ramp(f, start, start + 24);
  const dot = ((f - start) % 40) / 40;
  return (
    <>
      <div style={{ position: "absolute", left: x1, top: y, width: (x2 - x1) * t, height: 3, background: theme.accent, boxShadow: `0 0 12px ${theme.accent}` }} />
      {t >= 1 && <div style={{ position: "absolute", left: x1 + (x2 - x1) * dot - 8, top: y - 7, width: 16, height: 16, borderRadius: 8, background: "#fff", boxShadow: `0 0 16px ${theme.accent}` }} />}
    </>
  );
};

const DEFAULT_FLOW: FlowSpec = {
  input: "Supplier audit",
  node: "Compliance Co-Pilot",
  chips: ["Labour Standards", "Health & Safety", "Environment", "Business Ethics"],
  outs: [
    { big: "HIGH · 69", sub: "Risk score" },
    { big: "8 findings", sub: "Each with a verbatim quote" },
    { big: "Action plan", sub: "Approved by a human" }
  ]
};

export const HookFlow: React.FC<{ flow?: FlowSpec }> = ({ flow = DEFAULT_FLOW }) => {
  const f = useCurrentFrame();
  const doc = ramp(f, 4, 26);
  const node = ramp(f, 30, 50);
  const outs = flow.outs.map((o, i) => ({ ...o, y: 340 + i * 160, at: 105 + i * 20 }));
  return (
    <>
      <div style={box(150, 380, 320, 420, { transform: `translateX(${(1 - doc) * -300}px)`, opacity: doc, padding: 24 })}>
        <div style={{ color: theme.muted, fontSize: 26, marginBottom: 20 }}>{flow.input}</div>
        {Array.from({ length: 11 }).map((_, i) => <div key={i} style={{ height: 8, marginBottom: 16, width: `${92 - ((i * 29) % 38)}%`, background: "#1c2b2f" }} />)}
      </div>
      <Beam x1={470} x2={750} y={590} start={55} />
      <div style={box(760, 340, 400, 500, { opacity: node, transform: `scale(${0.92 + 0.08 * node})`, padding: 28 })}>
        <div style={{ color: theme.accent, fontSize: 34, fontWeight: 700, marginBottom: 24, textShadow: `0 0 10px ${theme.accent}` }}>{flow.node}</div>
        {flow.chips.map((p, i) => {
          const on = ramp(f, 62 + i * 8, 74 + i * 8);
          const pulse = f > 100 ? 0.6 + 0.4 * Math.sin(f / 6 + i) : 1;
          return (
            <div key={p} style={{ opacity: on * pulse, transform: `translateX(${(1 - on) * 30}px)`, fontSize: 30, color: theme.text, border: `1px solid ${theme.accent}88`, padding: "10px 16px", marginBottom: 16 }}>{p}</div>
          );
        })}
      </div>
      <Beam x1={1160} x2={1350} y={590} start={95} />
      {outs.map((o) => {
        const t = ramp(f, o.at, o.at + 16);
        return (
          <div key={o.big} style={box(1360, o.y, 420, 130, { opacity: t, transform: `translateX(${(1 - t) * 60}px)`, padding: "16px 24px" })}>
            <div style={{ fontSize: 50, fontWeight: 700, color: theme.accent, textShadow: `0 0 12px ${theme.accent}88` }}>{o.big}</div>
            <div style={{ fontSize: 26, color: theme.muted }}>{o.sub}</div>
          </div>
        );
      })}
    </>
  );
};
