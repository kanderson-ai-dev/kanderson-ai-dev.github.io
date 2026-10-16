import { AbsoluteFill, useCurrentFrame } from "remotion";
import { theme } from "../theme";

export const GridBackground: React.FC<{ dim?: number }> = ({ dim = 1 }) => {
  const f = useCurrentFrame();
  const o = (f * 0.4) % 64;
  return (
    <AbsoluteFill style={{ background: theme.bg }}>
      <AbsoluteFill
        style={{
          opacity: 0.18 * dim,
          backgroundImage: `linear-gradient(${theme.accent} 1px, transparent 1px), linear-gradient(90deg, ${theme.accent} 1px, transparent 1px)`,
          backgroundSize: "64px 64px",
          backgroundPosition: `${o}px ${o}px`
        }}
      />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, transparent 40%, #000 100%)" }} />
    </AbsoluteFill>
  );
};

export const CornerBrackets: React.FC<{ inset?: number; size?: number }> = ({ inset = 48, size = 44 }) => {
  const s = (pos: React.CSSProperties): React.CSSProperties => ({
    position: "absolute", width: size, height: size, border: `3px solid ${theme.accent}`, ...pos
  });
  return (
    <>
      <div style={s({ top: inset, left: inset, borderRight: 0, borderBottom: 0 })} />
      <div style={s({ top: inset, right: inset, borderLeft: 0, borderBottom: 0 })} />
      <div style={s({ bottom: inset, left: inset, borderRight: 0, borderTop: 0 })} />
      <div style={s({ bottom: inset, right: inset, borderLeft: 0, borderTop: 0 })} />
    </>
  );
};
