import React from "react";
import { C, bodyFont, monoFont } from "./utheme";

// Faithful, legible replica of the real "High-value refund — human decision" modal
// (product's light UI), values taken from the seeded demo store (ORD-1005).
export const ApprovalReplica: React.FC<{ w?: number; highlight?: boolean }> = ({ w = 1500, highlight = true }) => {
  const box: React.CSSProperties = {
    background: C.lightPanel,
    border: `1px solid ${C.lightBorder}`,
    borderRadius: 14,
    padding: "22px 26px",
  };
  const label: React.CSSProperties = { fontFamily: bodyFont, fontWeight: 700, fontSize: 19, letterSpacing: 1.4, color: C.lightMuted, textTransform: "uppercase" };
  return (
    <div
      style={{
        width: w,
        background: C.lightPanel,
        borderRadius: 26,
        border: `2px solid ${C.lightBorder}`,
        boxShadow: `0 40px 120px #000000cc, 0 0 0 1px ${C.accent}22, 0 0 80px ${C.accent}18`,
        padding: "38px 44px",
        fontFamily: bodyFont,
        color: C.lightText,
      }}
    >
      <div style={{ fontSize: 40, fontWeight: 700, marginBottom: 14 }}>
        High-value refund <span style={{ color: C.lightMuted, fontWeight: 500 }}>— human decision</span>
      </div>
      <div style={{ fontSize: 22, color: C.lightMuted, marginBottom: 16 }}>
        Ticket #b36e2f0f · Order ORD-1005 · Under specialist review · waiting 0m
      </div>
      <div style={{ fontSize: 26, fontStyle: "italic", color: C.lightText, marginBottom: 24 }}>
        "I need to return the leather weekender bag from order ORD-1005. Unused, tags still on."
      </div>
      <div style={{ display: "flex", gap: 22, marginBottom: 24 }}>
        <div style={{ ...box, flex: 1, borderTop: `4px solid ${C.lightTeal}` }}>
          <div style={{ ...label, color: C.lightTeal, marginBottom: 16 }}>Policy check — deterministic</div>
          {[
            ["Return window", "6 of 30 days used — Yes"],
            ["Item condition", "Yes"],
            ["Prior refund on this item", "No"],
          ].map(([k, v]) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: 24, padding: "8px 0" }}>
              <span style={{ color: C.lightMuted }}>{k}</span>
              <span style={{ fontWeight: 600, color: C.lightGreenText }}>{v}</span>
            </div>
          ))}
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 24, padding: "8px 0", fontWeight: 700 }}>
            <span style={{ color: C.lightMuted }}>Amount</span>
            <span style={{ color: C.lightText }}>$240.00 — auto-approve cap $75.00</span>
          </div>
          <div style={{ marginTop: 10, display: "inline-block", fontSize: 19, color: C.lightMuted, background: "#eef3f5", borderRadius: 8, padding: "5px 12px" }}>
            Domestic return window — 30 days
          </div>
        </div>
        <div style={{ ...box, flex: 1, borderTop: `4px solid ${C.model}` }}>
          <div style={{ ...label, color: "#7c6cf0", marginBottom: 16 }}>Drafted reply (model)</div>
          <div style={{ fontSize: 25, lineHeight: 1.5 }}>
            Your return qualifies under our policy, but because of the amount it needs a quick review from our team — you'll hear back within one business day.
          </div>
        </div>
      </div>
      <div style={{ display: "flex", gap: 22, alignItems: "flex-end" }}>
        <div>
          <div style={{ ...label, marginBottom: 8 }}>Refund amount (USD)</div>
          <div style={{ ...box, fontFamily: monoFont, fontSize: 28, padding: "14px 20px", width: 220 }}>240.00</div>
        </div>
        <div style={{ flex: 1 }} />
        <button
          style={{
            fontFamily: bodyFont,
            fontWeight: 700,
            fontSize: 30,
            color: "#fff",
            background: "#166534",
            border: "none",
            borderRadius: 12,
            padding: "18px 34px",
            boxShadow: highlight ? "0 0 0 4px #16a34a55, 0 0 44px #16a34a66" : "none",
            position: "relative",
          }}
        >
          Approve $240.00
        </button>
        <button style={{ fontFamily: bodyFont, fontWeight: 700, fontSize: 30, color: "#fff", background: C.lightRed, border: "none", borderRadius: 12, padding: "18px 30px" }}>Reject</button>
        <button style={{ fontFamily: bodyFont, fontWeight: 600, fontSize: 30, color: C.lightTeal, background: "transparent", border: "none", padding: "18px 10px" }}>Cancel</button>
      </div>
      {highlight && (
        <svg width="54" height="70" viewBox="0 0 30 40" style={{ position: "absolute", left: "72%", top: "78%", filter: `drop-shadow(0 4px 10px #000c)` }}>
          <path d="M4 2l22 18-12 2 8 16-6 2-8-16-8 8z" fill="#0b1114" stroke="#ffffff" strokeWidth="2.4" />
        </svg>
      )}
    </div>
  );
};
