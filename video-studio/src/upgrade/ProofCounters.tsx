import React from "react";
import { C, monoFont, titleFont } from "./utheme";

export const ProofCounters: React.FC<{ progress?: number }> = ({ progress = 1 }) => {
  const p100 = Math.min(1, progress / 0.6);
  const v100 = Math.round(p100 * 100);
  const p11 = Math.min(1, Math.max(0, (progress - 0.35) / 0.4));
  const v11 = Math.round(p11 * 11);
  const row2 = Math.min(1, Math.max(0, (progress - 0.7) / 0.3));
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 30, fontFamily: titleFont }}>
      <div style={{ fontSize: 34, fontWeight: 500, color: C.muted, letterSpacing: 3, textTransform: "uppercase" }}>Correct decisions</div>
      <div style={{ display: "flex", alignItems: "center", gap: 90 }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 220, fontWeight: 700, color: C.accent, textShadow: `0 0 70px ${C.accent}88`, lineHeight: 1 }}>{v100}%</div>
          <div style={{ fontSize: 28, color: C.text, marginTop: 8 }}>the pipeline</div>
        </div>
        <div style={{ fontSize: 70, color: C.dim, fontWeight: 500 }}>vs</div>
        <div style={{ textAlign: "center", opacity: 0.95 }}>
          <div style={{ fontSize: 220, fontWeight: 700, color: C.danger, textShadow: `0 0 50px ${C.danger}66`, lineHeight: 1 }}>{v11}%</div>
          <div style={{ fontSize: 28, color: C.text, marginTop: 8 }}>a single bare prompt</div>
        </div>
      </div>
      <div style={{ display: "flex", gap: 26, alignItems: "baseline", opacity: row2, transform: `translateY(${(1 - row2) * 30}px)` }}>
        <span style={{ fontSize: 38, fontWeight: 700, color: C.text }}>Injection attempts blocked:</span>
        <span style={{ fontSize: 52, fontWeight: 700, color: C.accent }}>100%</span>
        <span style={{ fontSize: 34, color: C.dim }}>vs</span>
        <span style={{ fontSize: 52, fontWeight: 700, color: C.danger }}>0%</span>
        <span style={{ fontSize: 30, color: C.muted }}>for the bare prompt</span>
      </div>
      <div style={{ fontFamily: monoFont, fontSize: 22, color: C.dim, marginTop: 12 }}>
        live scorecard · 36 synthetic tickets · one run · pipeline vs single-prompt baseline
      </div>
    </div>
  );
};
