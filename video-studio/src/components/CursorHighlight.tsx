import { theme } from "../theme";

export const CursorHighlight: React.FC<{ x: number; y: number; clickAge?: number }> = ({ x, y, clickAge }) => (
  <div style={{ position: "absolute", left: x, top: y, pointerEvents: "none" }}>
    {clickAge !== undefined && clickAge >= 0 && clickAge < 15 && (
      <div style={{ position: "absolute", left: -40, top: -40, width: 80, height: 80, borderRadius: 40, border: `3px solid ${theme.accent}`, opacity: 1 - clickAge / 15, transform: `scale(${0.4 + clickAge / 15})` }} />
    )}
    <div style={{ width: 0, height: 0, borderLeft: "14px solid transparent", borderRight: "14px solid transparent", borderBottom: `36px solid ${theme.accent}`, transform: "rotate(-30deg)", filter: `drop-shadow(0 0 8px ${theme.accent})` }} />
  </div>
);
