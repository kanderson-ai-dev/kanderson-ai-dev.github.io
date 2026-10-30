import React from "react";
import { C, bodyFont, monoFont, titleFont } from "./utheme";
import { Check } from "./primitives";

const rules = [
  { label: "Return window", value: "6 of 30 days used", ok: true, verdict: "Yes" },
  { label: "Item condition", value: "Unused, tags on", ok: true, verdict: "Yes" },
  { label: "Prior refund on this item", value: "none found", ok: true, verdict: "No" },
];

export const RulePanel: React.FC<{ progress?: number; w?: number }> = ({ progress = 1, w = 980 }) => {
  const amountRow = Math.min(1, Math.max(0, (progress - 0.75) / 0.2));
  return (
    <div style={{ width: w, fontFamily: bodyFont }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 22 }}>
        <div style={{ fontFamily: titleFont, fontWeight: 700, fontSize: 46, color: C.text }}>
          Policy engine <span style={{ color: C.accent }}>— decides in code</span>
        </div>
        <span style={{ fontFamily: monoFont, fontSize: 22, color: "#04211d", background: C.accent, borderRadius: 8, padding: "6px 14px", fontWeight: 700 }}>CODE · no AI</span>
      </div>
      <div style={{ background: `${C.panel}e6`, border: `2px solid ${C.accent}55`, borderRadius: 20, overflow: "hidden", boxShadow: `0 0 60px ${C.accent}22` }}>
        {rules.map((r, i) => {
          const t = Math.min(1, Math.max(0, (progress - 0.12 - i * 0.2) / 0.15));
          return (
            <div key={r.label} style={{ display: "flex", alignItems: "center", gap: 22, padding: "22px 30px", borderBottom: `1px solid ${C.line}`, opacity: 0.15 + 0.85 * t }}>
              <span style={{ width: 40, opacity: t }}><Check ok size={38} /></span>
              <span style={{ flex: 1, fontSize: 30, color: C.text }}>{r.label}</span>
              <span style={{ fontFamily: monoFont, fontSize: 25, color: C.muted }}>{r.value}</span>
              <span style={{ fontFamily: monoFont, fontWeight: 700, fontSize: 26, color: C.accent, width: 70, textAlign: "right", opacity: t }}>{r.verdict}</span>
            </div>
          );
        })}
        <div style={{ display: "flex", alignItems: "center", gap: 22, padding: "26px 30px", background: `${C.warn}14`, opacity: 0.15 + 0.85 * amountRow }}>
          <span style={{ width: 40, opacity: amountRow }}>
            <svg width="38" height="38" viewBox="0 0 24 24" fill="none"><path d="M12 8v5m0 3.5v.5M10.3 3.9L2.6 17a2 2 0 001.7 3h15.4a2 2 0 001.7-3L13.7 3.9a2 2 0 00-3.4 0z" stroke={C.warn} strokeWidth={2.4} strokeLinecap="round" /></svg>
          </span>
          <span style={{ flex: 1, fontSize: 30, color: C.text }}>Amount</span>
          <span style={{ fontFamily: monoFont, fontSize: 27, color: C.human, fontWeight: 700 }}>$240.00 &gt; cap $75.00</span>
          <span style={{ fontFamily: monoFont, fontWeight: 700, fontSize: 24, color: C.warn, width: 70, textAlign: "right" }}>OVER</span>
        </div>
      </div>
      <div style={{ marginTop: 16, fontFamily: monoFont, fontSize: 21, color: C.dim }}>Domestic return window — 30 days · same input, same decision</div>
    </div>
  );
};
