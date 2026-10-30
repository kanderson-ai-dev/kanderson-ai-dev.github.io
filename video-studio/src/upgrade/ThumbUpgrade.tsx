import React from "react";
import { AbsoluteFill } from "remotion";
import { NodeGraph } from "./beats";
import { CornerBrackets, GridBackground } from "../components/GridBackground";
import { C, monoFont, titleFont } from "./utheme";

// 1280x720 YouTube thumbnail / social card. Hook text left, supervisor→workers
// diagram right — communicates "multi-agent" at a glance.
export const ThumbUpgrade: React.FC = () => (
  <AbsoluteFill style={{ background: C.bg, overflow: "hidden" }}>
    <GridBackground />
    <CornerBrackets />
    <div style={{ position: "absolute", left: 70, top: 120, width: 700 }}>
      <div style={{ fontFamily: titleFont, fontWeight: 700, fontSize: 30, letterSpacing: 6, color: C.muted, whiteSpace: "nowrap" }}>
        E-COMMERCE SUPPORT &amp; RETURNS
      </div>
      <div style={{ fontFamily: titleFont, fontWeight: 700, fontSize: 82, lineHeight: 1.05, color: C.accent, marginTop: 20, textShadow: `0 0 40px ${C.accent}55`, whiteSpace: "nowrap" }}>
        Multi-agent AI
      </div>
      <div style={{ fontFamily: titleFont, fontWeight: 700, fontSize: 48, lineHeight: 1.15, color: C.text, marginTop: 14, whiteSpace: "nowrap" }}>
        that plays by <span style={{ color: C.warn }}>YOUR</span> rules
      </div>
      <div
        style={{
          display: "inline-block",
          marginTop: 40,
          fontFamily: monoFont,
          fontWeight: 700,
          fontSize: 28,
          color: "#0a0f10",
          background: C.human,
          borderRadius: 12,
          padding: "12px 24px",
          boxShadow: `0 0 34px ${C.human}44`,
          whiteSpace: "nowrap",
        }}
      >
        $240 refund? A human decides.
      </div>
    </div>
    <div
      style={{
        position: "absolute",
        right: 46,
        top: 200,
        width: 520,
        height: 330,
        borderRadius: 24,
        border: `2.5px solid ${C.line}`,
        background: `${C.panel}cc`,
        overflow: "hidden",
        boxShadow: `0 0 60px ${C.accent}22`,
      }}
    >
      <div style={{ position: "absolute", width: 1920, height: 1080, left: -20, top: 10, transform: "scale(0.325)", transformOrigin: "top left" }}>
        <NodeGraph t={1} />
      </div>
    </div>
    <div style={{ position: "absolute", bottom: 40, right: 60, fontFamily: monoFont, fontSize: 26, color: C.dim, letterSpacing: 2 }}>
      kaarstenanderson.com
    </div>
  </AbsoluteFill>
);
