/**
 * FlatB — flat presentation stage (reference-quality UI motion).
 * Big centered hero on a subtle grid, corner brackets, bold display title.
 * No camera tilt: content is king, space is intentional.
 */
import React from "react";
import { AbsoluteFill } from "remotion";
import { T, fonts } from "../theme";

export const FlatB: React.FC<{
  title?: React.ReactNode;
  kicker?: string;
  children?: React.ReactNode;
}> = ({ title, kicker, children }) => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(130% 100% at 50% 38%, ${T.bg} 0%, ${T.bgDeep} 100%)`,
      overflow: "hidden",
    }}
  >
    {/* fine grid */}
    <AbsoluteFill
      style={{
        backgroundImage: `
          repeating-linear-gradient(0deg, ${T.grid}55 0, ${T.grid}55 1px, transparent 1px, transparent 96px),
          repeating-linear-gradient(90deg, ${T.grid}55 0, ${T.grid}55 1px, transparent 1px, transparent 96px)`,
        opacity: 0.55,
      }}
    />
    {/* corner brackets */}
    {[
      { top: 26, left: 26, bt: 2, bl: 2 },
      { top: 26, right: 26, bt: 2, br: 2 },
      { bottom: 26, left: 26, bb: 2, bl: 2 },
      { bottom: 26, right: 26, bb: 2, br: 2 },
    ].map((c, i) => (
      <div
        key={i}
        style={{
          position: "absolute",
          top: c.top,
          bottom: c.bottom,
          left: c.left,
          right: c.right,
          width: 46,
          height: 46,
          borderTop: c.bt ? `2px solid ${T.code}cc` : undefined,
          borderBottom: c.bb ? `2px solid ${T.code}cc` : undefined,
          borderLeft: c.bl ? `2px solid ${T.code}cc` : undefined,
          borderRight: c.br ? `2px solid ${T.code}cc` : undefined,
        }}
      />
    ))}
    {/* kicker */}
    {kicker && (
      <div
        style={{
          position: "absolute",
          top: 74,
          width: "100%",
          textAlign: "center",
          fontFamily: fonts.mono,
          fontSize: 18,
          letterSpacing: 6,
          color: T.muted,
          textTransform: "uppercase",
        }}
      >
        {kicker}
      </div>
    )}
    {/* display title */}
    {title && (
      <div
        style={{
          position: "absolute",
          top: kicker ? 108 : 96,
          width: "100%",
          textAlign: "center",
          fontFamily: fonts.body,
          fontWeight: 800,
          fontSize: 58,
          letterSpacing: 1,
          color: T.text,
          textShadow: `0 0 34px ${T.code}33`,
          padding: "0 120px",
        }}
      >
        {title}
      </div>
    )}
    {/* hero zone */}
    <AbsoluteFill
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        paddingTop: title ? 120 : 40,
      }}
    >
      {children}
    </AbsoluteFill>
    {/* vignette */}
    <AbsoluteFill
      style={{
        background: `radial-gradient(95% 75% at 50% 46%, transparent 60%, #02040a88 100%)`,
        pointerEvents: "none",
      }}
    />
  </AbsoluteFill>
);

/** Accent-colored word inside a title. */
export const A: React.FC<{ c?: string; children: React.ReactNode }> = ({ c = T.code, children }) => (
  <span style={{ color: c }}>{children}</span>
);
