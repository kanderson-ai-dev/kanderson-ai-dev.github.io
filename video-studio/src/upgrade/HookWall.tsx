import React from "react";
import { C, bodyFont, titleFont } from "./utheme";

const MSGS = [
  "Where's my order? It's been 9 days",
  "It arrived damaged — I want a refund",
  "Can I return this? Tags still on",
  "Refund for order ORD-1012 please",
  "Wrong item shipped, need a replacement",
  "My package says delivered — it's not here",
  "I was charged twice for ORD-1021",
  "Return window expired yesterday, any chance?",
  "Refund my $240 — I want it back today",
  "Does the jacket come with a warranty?",
  "Cancel order ORD-1003 before it ships",
  "Item is faulty, refund or replace?",
];

// deterministic pseudo-random layout of ticket bubbles forming a "wall"
export const HookWall: React.FC<{ progress?: number; overlay?: boolean }> = ({ progress = 1, overlay = true }) => {
  const bubbles: { msg: string; x: number; y: number; w: number; accent: boolean; d: number }[] = [];
  const cols = 5;
  let i = 0;
  for (let r = 0; r < 5 && i < MSGS.length * 2; r++) {
    for (let c = 0; c < cols && i < MSGS.length * 2; c++) {
      const msg = MSGS[i % MSGS.length];
      const seed = i * 2654435761 % 1000 / 1000;
      bubbles.push({
        msg,
        x: 70 + c * 356 + (seed - 0.5) * 60,
        y: 90 + r * 205 + ((i * 7919) % 40) - 20,
        w: 330 + (i % 3) * 30,
        accent: i % 4 === 2,
        d: 0.04 * i,
      });
      i++;
    }
  }
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      {bubbles.map((b, k) => {
        const t = Math.min(1, Math.max(0, (progress - b.d) / 0.18));
        return (
          <div
            key={k}
            style={{
              position: "absolute",
              left: b.x,
              top: b.y,
              width: b.w,
              opacity: t * 0.92,
              transform: `translateY(${(1 - t) * 46}px)`,
              background: C.panel2,
              border: `1.5px solid ${b.accent ? C.accent + "66" : C.line}`,
              borderRadius: 16,
              padding: "14px 18px",
              fontFamily: bodyFont,
              fontSize: 21,
              color: b.accent ? C.text : C.muted,
            }}
          >
            <span style={{ display: "block", fontSize: 15, color: C.dim, marginBottom: 4, letterSpacing: 1 }}>CUSTOMER</span>
            {b.msg}
          </div>
        );
      })}
      {overlay && (
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "radial-gradient(ellipse at center, #050709d9 30%, #05070955 70%)" }}>
          <div style={{ fontFamily: titleFont, fontWeight: 700, fontSize: 96, color: C.text, textShadow: `0 0 40px ${C.accent}55` }}>Your support inbox.</div>
          <div style={{ fontFamily: titleFont, fontWeight: 500, fontSize: 52, color: C.accent, marginTop: 10 }}>every single day</div>
        </div>
      )}
    </div>
  );
};
