import React from "react";
import { C, monoFont, titleFont } from "./utheme";
import { StatusPill } from "./primitives";

// Vault gate: the ticket is stopped by a physical lock — the "auto-approve" arm
// (violet = model) bounces off; the lock is turquoise (code).
export const Gate: React.FC<{ progress?: number }> = ({ progress = 1 }) => {
  const slam = Math.min(1, Math.max(0, progress / 0.55)); // gate closes
  const stop = Math.min(1, Math.max(0, (progress - 0.45) / 0.25)); // arm tries & fails
  const label = Math.min(1, Math.max(0, (progress - 0.7) / 0.3));
  const armPush = stop < 0.5 ? stop * 2 : 1 - (stop - 0.5) * 0.9; // pushes then recoils
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
      {/* vault frame */}
      <div style={{ position: "relative", width: 760, height: 560 }}>
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: 380 - slam * 180,
            background: `linear-gradient(90deg, ${C.panel2}, ${C.panel})`,
            borderRight: `4px solid ${C.accent}`,
            boxShadow: `inset -30px 0 60px #000000aa, 12px 0 40px ${C.accent}22`,
            borderRadius: "24px 0 0 24px",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            bottom: 0,
            width: 380 - slam * 180,
            background: `linear-gradient(-90deg, ${C.panel2}, ${C.panel})`,
            borderLeft: `4px solid ${C.accent}`,
            boxShadow: `inset 30px 0 60px #000000aa, -12px 0 40px ${C.accent}22`,
            borderRadius: "0 24px 24px 0",
          }}
        />
        {/* lock */}
        <div style={{ position: "absolute", left: "50%", top: "50%", transform: `translate(-50%, -50%) scale(${0.6 + slam * 0.4})`, opacity: slam }}>
          <svg width="180" height="180" viewBox="0 0 100 100" fill="none">
            <circle cx="50" cy="50" r="46" stroke={C.accent} strokeWidth="3" opacity="0.5" />
            <circle cx="50" cy="50" r="38" fill={C.panel} stroke={C.accent} strokeWidth="2.5" />
            <path d="M38 46v-8a12 12 0 0124 0v8" stroke={C.accent} strokeWidth="5" strokeLinecap="round" />
            <rect x="34" y="46" width="32" height="26" rx="6" fill={C.accent} />
            <circle cx="50" cy="56" r="4" fill={C.bg} />
            <rect x="48.5" y="58" width="3" height="8" fill={C.bg} />
          </svg>
        </div>
        {/* auto-approve arm (model) pushing from left, stopped */}
        <div style={{ position: "absolute", left: -300 + armPush * 210, top: 228, opacity: stop ? 1 : 0 }}>
          <div
            style={{
              fontFamily: monoFont,
              fontWeight: 700,
              fontSize: 26,
              color: C.model,
              border: `3px solid ${C.model}`,
              background: `${C.model}14`,
              borderRadius: 14,
              padding: "16px 26px",
              boxShadow: `0 0 30px ${C.model}44`,
            }}
          >
            AUTO-APPROVE →
          </div>
        </div>
        {stop > 0.55 && (
          <div
            style={{
              position: "absolute",
              left: 40,
              top: 150,
              transform: `rotate(-14deg) scale(${Math.min(1, (stop - 0.55) * 4)})`,
              fontFamily: titleFont,
              fontWeight: 700,
              fontSize: 40,
              color: C.danger,
              border: `5px solid ${C.danger}`,
              borderRadius: 12,
              padding: "8px 22px",
              background: "#0b0508dd",
              letterSpacing: 2,
              boxShadow: `0 0 40px ${C.danger}55`,
            }}
          >
            REFUSED
          </div>
        )}
        {/* enforcement label */}
        <div style={{ position: "absolute", left: "50%", bottom: -24, transform: "translateX(-50%)", textAlign: "center", opacity: label, width: 1200 }}>
          <div style={{ fontFamily: monoFont, fontSize: 26, color: C.muted, marginBottom: 14 }}>
            a hard rule in <span style={{ color: C.accent }}>code</span> — the database refuses it, no exceptions
          </div>
          <StatusPill text="Requires human approval" color={C.human} size={30} />
        </div>
      </div>
    </div>
  );
};
