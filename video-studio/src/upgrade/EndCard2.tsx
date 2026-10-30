import React from "react";
import { C, bodyFont, monoFont, titleFont } from "./utheme";

export const EndCard2: React.FC<{ progress?: number }> = ({ progress = 1 }) => {
  const t = Math.min(1, progress / 0.5);
  const url = "kaarstenanderson.com";
  const sub = Math.min(1, Math.max(0, (progress - 0.45) / 0.4));
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 26 }}>
      {/* light trail draws the URL */}
      <div style={{ position: "relative" }}>
        <div
          style={{
            fontFamily: titleFont,
            fontWeight: 700,
            fontSize: 128,
            color: C.accent,
            textShadow: `0 0 60px ${C.accent}99, 0 0 140px ${C.accent}44`,
            letterSpacing: -1,
            opacity: t,
            transform: `scale(${0.92 + t * 0.08})`,
          }}
        >
          {url}
        </div>
        <div
          style={{
            position: "absolute",
            bottom: -18,
            left: "50%",
            transform: "translateX(-50%)",
            width: 700 * t,
            height: 4,
            background: `linear-gradient(90deg, transparent, ${C.accent}, transparent)`,
            boxShadow: `0 0 26px ${C.accent}`,
          }}
        />
      </div>
      <div style={{ fontFamily: titleFont, fontWeight: 500, fontSize: 44, color: C.text, opacity: sub }}>Kaarsten Anderson</div>
      <div
        style={{
          fontFamily: bodyFont,
          fontSize: 30,
          color: C.muted,
          border: `1.5px solid ${C.line}`,
          borderRadius: 14,
          padding: "14px 30px",
          background: `${C.panel}cc`,
          opacity: sub,
        }}
      >
        Private project · <span style={{ color: C.text }}>adapted to your store on request</span>
      </div>
      <div style={{ fontFamily: monoFont, fontSize: 26, color: C.accent, opacity: sub }}>contact@kaarstenanderson.com</div>
    </div>
  );
};
