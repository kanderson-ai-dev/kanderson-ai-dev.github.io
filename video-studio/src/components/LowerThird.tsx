import { theme, titleFont } from "../theme";

export const LowerThird: React.FC<{ text: string; sub?: string }> = ({ text, sub }) => (
  <div style={{ position: "absolute", left: 96, bottom: 120, borderLeft: `6px solid ${theme.accent}`, paddingLeft: 24, fontFamily: titleFont }}>
    <div style={{ fontSize: 54, fontWeight: 700, color: theme.text, textShadow: "0 2px 12px #000" }}>{text}</div>
    {sub && <div style={{ fontSize: 30, color: theme.accent }}>{sub}</div>}
  </div>
);
