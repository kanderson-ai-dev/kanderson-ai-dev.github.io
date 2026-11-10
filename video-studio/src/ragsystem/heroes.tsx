/**
 * ragsystem heroes — the animated concept beats for the promo.
 * Each beat takes t (0..1) and poses at t≈0.9+ for styleframes.
 * Grammar: one recognizable hero object, large, centered on the stage.
 */
import React from "react";
import { C, bodyFont, monoFont, titleFont } from "../upgrade/utheme";
import { Chip } from "../upgrade/primitives";
import { EndCard3 } from "../mcptoolkit3/heroes3";
import { glow, LensFlare } from "../orchestrator2/fx";

const seg = (t: number, a: number, b: number) => Math.min(1, Math.max(0, (t - a) / (b - a)));
const ease = (x: number) => 1 - Math.pow(1 - x, 3);

/* ======================= DOCUMENT STACK (cold open / yours) ============= */

export const DocStackBeat: React.FC<{ t: number; label?: string }> = ({ t, label = "YOUR DOCUMENTS" }) => {
  const p = ease(seg(t, 0.05, 0.4));
  const docs = [0, 1, 2, 3, 4];
  // continuous idle motion once settled: gentle bob + a scan sweep across the
  // top document every few beats + a slow shimmer on the accent bars
  const bob = Math.sin(t * Math.PI * 5) * 6;
  const scan = (t * 2.2) % 1; // sweeps left->right across the top doc, loops
  const scanOn = p > 0.95 && scan > 0.02 && scan < 0.98;
  const shim = 0.55 + 0.45 * Math.sin(t * Math.PI * 6 + 1.2);
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 46 }}>
      <div style={{ position: "relative", width: 620, height: 330, transform: `translateY(${bob}px)` }}>
        {docs.map((i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 40 + i * 26,
              top: 60 - i * 8,
              width: 460,
              height: 300,
              borderRadius: 12,
              background: i === 4 ? "#10201f" : C.panel,
              border: `2px solid ${i === 4 ? C.accent : C.line}`,
              boxShadow: "0 18px 40px #00000088",
              transform: `translateY(${(1 - p) * (60 + i * 30)}px) rotate(${(i - 2) * 1.6}deg)`,
              opacity: p,
              padding: "22px 26px",
              overflow: "hidden",
            }}
          >
            {i === 4 && scanOn && (
              <div
                style={{
                  position: "absolute", top: 0, bottom: 0, left: scan * 460 - 30, width: 60,
                  background: `linear-gradient(90deg, transparent, ${C.accent}26, transparent)`,
                }}
              />
            )}
            <div style={{ height: 14, width: "55%", borderRadius: 7, background: i === 4 ? C.accent : C.dim, marginBottom: 18, opacity: i === 4 ? shim : 1 }} />
            {[0, 1, 2, 3].map((l) => (
              <div key={l} style={{ height: 9, width: `${88 - l * 9}%`, borderRadius: 5, background: i === 4 ? C.line : C.line, marginBottom: 13, opacity: i === 4 ? 0.5 + 0.5 * shim : 1 }} />
            ))}
          </div>
        ))}
      </div>
      <div style={{ fontFamily: monoFont, fontSize: 30, letterSpacing: 8, color: C.accent, opacity: p }}>{label}</div>
    </div>
  );
};

/* ============================ PROBLEM: confident liar ==================== */

export const ProblemBeat: React.FC<{ t: number }> = ({ t }) => {
  const ask = ease(seg(t, 0.02, 0.2));
  const lie = ease(seg(t, 0.22, 0.45));
  const stamp = ease(seg(t, 0.55, 0.72));
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 60 }}>
      {/* the confident chatbot */}
      <div
        style={{
          width: 980,
          borderRadius: 26,
          background: C.panel,
          border: `2px solid ${C.dim}`,
          padding: "44px 50px",
          opacity: ask,
          transform: `translateY(${(1 - ask) * 60}px)`,
          position: "relative",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 26 }}>
          <div style={{ width: 46, height: 46, borderRadius: "50%", background: `${C.dim}55`, border: `2px solid ${C.dim}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: titleFont, fontWeight: 700, fontSize: 24, color: C.muted }}>AI</div>
          <div style={{ fontFamily: monoFont, fontSize: 22, color: C.muted, letterSpacing: 3 }}>ANY CHATBOT</div>
        </div>
        <div style={{ fontFamily: bodyFont, fontSize: 34, color: C.text, lineHeight: 1.45 }}>
          "The capital of France is <span style={{ color: C.danger, fontWeight: 600 }}>Germany</span>."
        </div>
        <div style={{ fontFamily: monoFont, fontSize: 20, color: C.dim, marginTop: 18 }}>sounds confident. shows nothing.</div>
        {/* red stamp */}
        <div
          style={{
            position: "absolute", right: 40, top: 30,
            fontFamily: titleFont, fontWeight: 700, fontSize: 52,
            color: C.danger, border: `6px solid ${C.danger}`, borderRadius: 14,
            padding: "8px 30px", letterSpacing: 6, transform: `rotate(-12deg) scale(${0.6 + stamp * 0.4})`, opacity: stamp,
            textShadow: `0 0 30px ${C.danger}55`,
          }}
        >
          WRONG?
        </div>
      </div>
      <div style={{ fontFamily: monoFont, fontSize: 26, color: C.muted, letterSpacing: 4, opacity: lie }}>
        NO SOURCES · NO PROOF · JUST A GUESS
      </div>
    </div>
  );
};

/* ============================ REVEAL: product name ======================== */

export const RevealBeat: React.FC<{ t: number }> = ({ t }) => {
  const draw = seg(t, 0, 0.35);
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      {/* circuit traces building in — same title grammar as the series */}
      <svg width="1920" height="1080" style={{ position: "absolute", inset: 0 }}>
        {[
          "M120 300 H560 L640 380",
          "M200 800 H520 L600 720",
          "M1740 840 H1360 L1300 760",
          "M960 120 V300",
        ].map((d, i) => (
          <path key={i} d={d} pathLength={1} stroke={C.accent} strokeWidth="2.5" fill="none" opacity={0.28}
            strokeDasharray="1" strokeDashoffset={1 - seg(t, i * 0.06, 0.3 + i * 0.06)}
            style={{ filter: `drop-shadow(0 0 5px ${C.accent})` }} />
        ))}
      </svg>
      {/* the title */}
      <div
        style={{
          position: "absolute", left: 0, right: 0, top: 340, textAlign: "center",
          fontFamily: titleFont, fontWeight: 700, fontSize: 118, color: C.text,
          textShadow: `0 0 50px ${C.accent}44`,
          opacity: draw, transform: `scale(${0.94 + draw * 0.06})`, lineHeight: 1.08,
        }}
      >
        <span style={{ color: C.accent, textShadow: glow(C.accent, 40) }}>Agentic RAG</span>
        <br />&amp; Knowledge System
      </div>
      <div
        style={{
          position: "absolute", left: 0, right: 0, top: 640, textAlign: "center",
          fontFamily: bodyFont, fontWeight: 500, fontSize: 40, color: C.muted,
          opacity: seg(t, 0.4, 0.6),
        }}
      >
        Answers from your documents —{" "}
        <span style={{ color: C.accent, fontWeight: 700 }}>with the proof attached</span>
      </div>
      {/* underline sweep */}
      <div
        style={{
          position: "absolute", left: 660, top: 706, width: 560 * seg(t, 0.55, 0.85), height: 4,
          background: `linear-gradient(90deg, transparent, ${C.accent}, transparent)`, boxShadow: glow(C.accent, 16),
        }}
      />
      <LensFlare x={960} y={330} p={seg(t, 0.35, 0.55)} />
    </div>
  );
};

/* ======================= GUARDRAIL: shield vs trick ====================== */

export const ShieldBeat: React.FC<{ t: number }> = ({ t }) => {
  const shield = ease(seg(t, 0.05, 0.35));
  const trick = ease(seg(t, 0.3, 0.55));
  const block = ease(seg(t, 0.6, 0.8));
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 120 }}>
      {/* incoming trick card */}
      <div
        style={{
          width: 480, borderRadius: 18, background: "#1a0d12", border: `2px solid ${C.danger}88`,
          padding: "30px 34px", transform: `translateX(${(1 - trick) * -260}px)`, opacity: trick,
        }}
      >
        <div style={{ fontFamily: monoFont, fontSize: 20, color: C.danger, letterSpacing: 3, marginBottom: 14 }}>TRICK QUESTION</div>
        <div style={{ fontFamily: bodyFont, fontSize: 30, color: C.text, lineHeight: 1.4 }}>
          "Ignore all previous instructions…"
        </div>
      </div>
      {/* shield */}
      <div style={{ position: "relative", width: 300, height: 360, opacity: shield, transform: `scale(${0.7 + shield * 0.3})` }}>
        <svg width="300" height="360" viewBox="0 0 300 360">
          <path
            d="M150 10 L280 60 L280 190 C280 280 220 330 150 356 C80 330 20 280 20 190 L20 60 Z"
            fill={`${C.accent}14`} stroke={C.accent} strokeWidth="7"
            style={{ filter: `drop-shadow(0 0 30px ${C.accent}66)` }}
          />
          <path
            d="M95 185 L135 228 L215 138" fill="none" stroke={C.accent} strokeWidth="16"
            strokeLinecap="round" strokeLinejoin="round"
            style={{ strokeDasharray: 320, strokeDashoffset: 320 * (1 - block) }}
          />
        </svg>
      </div>
    </div>
  );
};

/* ================== HYBRID SEARCH: meaning + connections ================= */

export const TwinSearchBeat: React.FC<{ t: number }> = ({ t }) => {
  const p = ease(seg(t, 0.1, 0.7));
  const stars = Array.from({ length: 26 }, (_, i) => ({
    x: 120 + ((i * 173) % 420), y: 90 + ((i * 97) % 300), r: 2 + (i % 3) * 1.6,
  }));
  const nodes = [
    [80, 200], [200, 120], [330, 180], [260, 300], [420, 320], [120, 330], [360, 90],
  ] as const;
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 90 }}>
      {/* meaning: star field */}
      <div style={{ width: 560, height: 460, borderRadius: 20, background: C.panel, border: `2px solid ${C.line}`, position: "relative", overflow: "hidden", opacity: p, transform: `translateX(${(1 - p) * -60}px)` }}>
        <div style={{ position: "absolute", top: 22, left: 26, fontFamily: monoFont, fontSize: 24, color: C.accent, letterSpacing: 4 }}>BY MEANING</div>
        <svg width="560" height="460">
          {stars.map((s, i) => (
            <circle key={i} cx={s.x} cy={s.y} r={s.r} fill={i % 5 === 0 ? C.accent : C.dim} opacity={0.4 + (i % 5 === 0 ? 0.6 : 0)} />
          ))}
          <circle cx="330" cy="200" r="14" fill={C.accent} style={{ filter: `drop-shadow(0 0 14px ${C.accent})` }} />
          <circle cx="330" cy="200" r="42" fill="none" stroke={C.accent} strokeWidth="2" opacity="0.5" />
        </svg>
      </div>
      {/* connections: node graph */}
      <div style={{ width: 560, height: 460, borderRadius: 20, background: C.panel, border: `2px solid ${C.line}`, position: "relative", overflow: "hidden", opacity: p, transform: `translateX(${(1 - p) * 60}px)` }}>
        <div style={{ position: "absolute", top: 22, left: 26, fontFamily: monoFont, fontSize: 24, color: C.model, letterSpacing: 4 }}>BY CONNECTIONS</div>
        <svg width="560" height="460">
          {[[0, 1], [1, 2], [2, 3], [3, 4], [1, 5], [2, 6], [3, 6], [0, 5]].map(([a, b], i) => (
            <line key={i} x1={nodes[a][0] + 70} y1={nodes[a][1] + 30} x2={nodes[b][0] + 70} y2={nodes[b][1] + 30} stroke={C.model} strokeWidth="2.5" opacity="0.55" />
          ))}
          {nodes.map(([x, y], i) => (
            <circle key={i} cx={x + 70} cy={y + 30} r={i === 3 ? 13 : 8} fill={i === 3 ? C.model : C.dim} opacity={i === 3 ? 1 : 0.8} />
          ))}
        </svg>
      </div>
      {/* the formula — explains what the two panels combine into */}
      <div
        style={{
          position: "absolute", bottom: 40, left: 0, right: 0, textAlign: "center",
          fontFamily: monoFont, fontSize: 32, color: C.text, letterSpacing: 1,
          opacity: ease(seg(t, 0.55, 0.75)),
        }}
      >
        <span style={{ color: C.accent, fontWeight: 700 }}>hybrid approach</span>
        {" = "}
        <span style={{ color: C.accent }}>vector database</span>
        {" + "}
        <span style={{ color: C.model }}>graph database</span>
      </div>
    </div>
  );
};

/* ================= SELF-CHECK: checklist over evidence ==================== */

export const ChecklistBeat: React.FC<{ t: number }> = ({ t }) => {
  const cards = ["doc A", "doc B", "doc C"];
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 44 }}>
      <div
        style={{
          width: 720, borderRadius: 20, background: C.panel, border: `2px solid ${C.accent}66`,
          padding: "36px 44px", position: "relative",
          boxShadow: `0 30px 70px #000000aa, 0 0 50px ${C.accent}22`,
          opacity: ease(seg(t, 0.05, 0.3)), transform: `translateY(${(1 - ease(seg(t, 0.05, 0.3))) * 50}px)`,
        }}
      >
        <div style={{ fontFamily: monoFont, fontSize: 24, letterSpacing: 5, color: C.accent, marginBottom: 24 }}>SELF-CHECK</div>
        {cards.map((c, i) => {
          const ok = ease(seg(t, 0.35 + i * 0.16, 0.5 + i * 0.16));
          return (
            <div key={c} style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 20 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, border: `3px solid ${ok > 0.5 ? C.accent : C.dim}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: titleFont, fontWeight: 700, fontSize: 26, color: C.accent, opacity: ok }}>
                {ok > 0.5 ? "✓" : ""}
              </div>
              <div style={{ flex: 1, height: 16, borderRadius: 8, background: C.line }} />
              <div style={{ fontFamily: monoFont, fontSize: 20, color: C.muted }}>{c}</div>
              <div style={{ fontFamily: monoFont, fontSize: 20, fontWeight: 700, color: ok > 0.5 ? C.accent : C.dim }}>{ok > 0.5 ? "kept" : "weak"}</div>
            </div>
          );
        })}
      </div>
      <div style={{ fontFamily: monoFont, fontSize: 26, color: C.muted, letterSpacing: 4, opacity: ease(seg(t, 0.7, 0.9)) }}>
        TOO WEAK? IT REPHRASES AND TRIES AGAIN — MAX 2
      </div>
    </div>
  );
};

/* ================= REWRITE: question card morphs ========================= */

export const RewriteBeat: React.FC<{ t: number }> = ({ t }) => {
  const p = ease(seg(t, 0.15, 0.85));
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 50 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 60 }}>
        <div style={{ width: 560, borderRadius: 20, background: C.panel, border: `2px solid ${C.line}`, padding: "34px 38px" }}>
          <div style={{ fontFamily: monoFont, fontSize: 20, color: C.muted, letterSpacing: 4, marginBottom: 16 }}>QUESTION</div>
          <div style={{ fontFamily: bodyFont, fontSize: 36, color: C.text, lineHeight: 1.4 }}>Tell me about bananas</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, opacity: p }}>
          <div style={{ fontFamily: monoFont, fontSize: 22, color: C.accent, letterSpacing: 4 }}>REWRITES</div>
          <svg width="150" height="50" viewBox="0 0 150 50">
            <line x1="8" y1="25" x2="126" y2="25" stroke={C.accent} strokeWidth="7" strokeLinecap="round" />
            <path d="M118 8 L142 25 L118 42" fill="none" stroke={C.accent} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div style={{ width: 560, borderRadius: 20, background: "#10201f", border: `2px solid ${C.accent}`, padding: "34px 38px", boxShadow: `0 0 50px ${C.accent}33` }}>
          <div style={{ fontFamily: monoFont, fontSize: 20, color: C.accent, letterSpacing: 4, marginBottom: 16 }}>REWRITTEN</div>
          <div style={{ fontFamily: bodyFont, fontSize: 32, color: C.text, lineHeight: 1.4 }}>
            What are the nutritional benefits of bananas…
          </div>
        </div>
      </div>
      <div style={{ fontFamily: monoFont, fontSize: 26, color: C.human, letterSpacing: 4, opacity: ease(seg(t, 0.75, 0.95)) }}>
        TRY 2 OF 2 — STILL NOTHING? IT STOPS.
      </div>
    </div>
  );
};

/* ================= HUMAN: person decides ================================ */

export const PersonBeat: React.FC<{ t: number }> = ({ t }) => {
  const lock = ease(seg(t, 0.05, 0.25));
  const person = ease(seg(t, 0.3, 0.55));
  const decide = ease(seg(t, 0.55, 0.72));
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 56 }}>
      <div style={{ position: "relative" }}>
        {/* STOPPED lock */}
        <div
          style={{
            width: 252, height: 190, borderRadius: 24,
            background: "#1a0d12", border: `4px solid ${C.danger}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: titleFont, fontWeight: 700, fontSize: 36, color: C.danger,
            letterSpacing: 3, transform: `scale(${0.6 + lock * 0.4})`, opacity: lock,
            boxShadow: `0 0 50px ${C.danger}44`,
          }}
        >
          STOPPED
        </div>
        {/* person stepping in */}
        <div
          style={{
            position: "absolute", left: 310, top: 20,
            width: 150, height: 190, borderRadius: 20,
            background: `${C.human}14`, border: `3px solid ${C.human}`,
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10,
            opacity: person, transform: `translateX(${(1 - person) * 160}px)`,
          }}
        >
          <div style={{ width: 54, height: 54, borderRadius: "50%", background: C.human, opacity: 0.9 }} />
          <div style={{ width: 90, height: 60, borderRadius: "12px 12px 0 0", background: C.human, opacity: 0.55 }} />
        </div>
      </div>
      <div style={{ fontFamily: titleFont, fontWeight: 700, fontSize: 58, color: C.text, opacity: decide }}>
        It won't guess. <span style={{ color: C.human }}>A person decides.</span>
      </div>
      <div style={{ display: "flex", gap: 18, opacity: decide }}>
        <Chip text="Approve" color={C.accent} size={24} />
        <Chip text="Retry" color={C.accent} size={24} />
        <Chip text="Override" color={C.accent} size={24} />
      </div>
    </div>
  );
};

/* ================= PROOF COUNTERS ======================================== */

export const CountersBeat: React.FC<{ t: number }> = ({ t }) => {
  const tiles = [
    { v: "1.00", l: "faithfulness", c: C.accent },
    { v: "1.00", l: "answer relevancy", c: C.accent },
    { v: "0.98", l: "context precision", c: C.accent },
    { v: "0.96", l: "context recall", c: C.accent },
  ];
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 56 }}>
      <div style={{ fontFamily: titleFont, fontWeight: 700, fontSize: 62, color: C.text, opacity: ease(seg(t, 0.05, 0.3)) }}>
        Quality you can <span style={{ color: C.accent }}>measure</span>
      </div>
      <div style={{ display: "flex", gap: 26 }}>
        {tiles.map((tile, i) => {
          const p = ease(seg(t, 0.3 + i * 0.12, 0.45 + i * 0.12));
          return (
            <div
              key={tile.l}
              style={{
                width: 300, borderRadius: 20, background: C.panel, border: `2px solid ${C.line}`,
                padding: "34px 20px", textAlign: "center",
                opacity: p, transform: `translateY(${(1 - p) * 60}px)`,
                boxShadow: `0 24px 60px #00000099, 0 0 40px ${tile.c}18`,
              }}
            >
              <div style={{ fontFamily: titleFont, fontWeight: 700, fontSize: 76, color: tile.c, lineHeight: 1 }}>{tile.v}</div>
              <div style={{ fontFamily: monoFont, fontSize: 19, color: C.muted, letterSpacing: 2, marginTop: 14, textTransform: "uppercase" }}>{tile.l}</div>
            </div>
          );
        })}
      </div>
      <div style={{ fontFamily: monoFont, fontSize: 24, color: C.muted, letterSpacing: 3, opacity: ease(seg(t, 0.75, 0.95)) }}>
        18 CASES · GATES IN CI
      </div>
    </div>
  );
};

/* ================= COST: a fraction of a cent ============================ */

export const CostBeat: React.FC<{ t: number }> = ({ t }) => {
  const p = ease(seg(t, 0.02, 0.2));
  const under = ease(seg(t, 0.3, 0.55));
  const label = ease(seg(t, 0.45, 0.7));
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 34 }}>
      <div style={{ fontFamily: monoFont, fontSize: 26, color: C.muted, letterSpacing: 6, textTransform: "uppercase", opacity: ease(seg(t, 0, 0.15)) }}>
        and the cost?
      </div>
      <div
        style={{
          fontFamily: titleFont,
          fontWeight: 700,
          fontSize: 190,
          lineHeight: 1,
          color: C.accent,
          opacity: p,
          transform: `scale(${0.7 + p * 0.3})`,
          textShadow: `0 0 80px ${C.accent}55, 0 0 160px ${C.accent}26`,
        }}
      >
        $0.0004
      </div>
      <div style={{ width: 620 * under, height: 5, borderRadius: 3, background: `linear-gradient(90deg, ${C.accent}00, ${C.accent}, ${C.accent}00)`, boxShadow: `0 0 30px ${C.accent}66` }} />
      <div style={{ fontFamily: titleFont, fontWeight: 600, fontSize: 44, color: C.text, opacity: label }}>
        per question
      </div>
      <div style={{ fontFamily: monoFont, fontSize: 24, color: C.muted, letterSpacing: 3, opacity: ease(seg(t, 0.6, 0.85)) }}>
        measured average · committed scorecard
      </div>
    </div>
  );
};

/* ================= VERDICT: blocked ===================================== */

export const VerdictBeat: React.FC<{ t: number }> = ({ t }) => {
  const stamp = ease(seg(t, 0.2, 0.5));
  const why = ease(seg(t, 0.5, 0.72));
  const chips = ease(seg(t, 0.78, 0.95));
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 46 }}>
      <div
        style={{
          fontFamily: titleFont, fontWeight: 700, fontSize: 140, letterSpacing: 10,
          color: C.danger, border: `10px solid ${C.danger}`, borderRadius: 26,
          padding: "20px 80px", transform: `rotate(-8deg) scale(${0.5 + stamp * 0.5})`,
          opacity: stamp, textShadow: `0 0 60px ${C.danger}66`,
          background: "#14060b",
        }}
      >
        BLOCKED
      </div>
      <div style={{ fontFamily: monoFont, fontSize: 30, color: C.muted, letterSpacing: 3, opacity: why, textAlign: "center", maxWidth: 1200 }}>
        scored lower than the live version — the gate said no
      </div>
      <div style={{ display: "flex", gap: 20, opacity: chips, transform: `translateY(${(1 - chips) * 30}px)` }}>
        <Chip text="v2 live · judge 4.95" size={24} />
        <Chip text="v3 candidate · judge 4.90" color={C.human} size={24} />
      </div>
    </div>
  );
};

/* ================= PROMPTS: versioned prompts ============================ */

export const VersionsBeat: React.FC<{ t: number }> = ({ t }) => {
  const rows = [
    { v: "v3", s: "candidate", c: C.human },
    { v: "v2", s: "promoted", c: C.accent },
    { v: "v1", s: "superseded", c: C.dim },
  ];
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 50 }}>
      <div style={{ fontFamily: titleFont, fontWeight: 700, fontSize: 60, color: C.text, opacity: ease(seg(t, 0.05, 0.3)) }}>
        Even its <span style={{ color: C.accent }}>prompts</span> are versioned
      </div>
      <div style={{ width: 780, borderRadius: 20, background: C.panel, border: `2px solid ${C.line}`, padding: "30px 38px", opacity: ease(seg(t, 0, 0.1)) }}>
        {rows.map((r, i) => {
          const p = ease(seg(t, 0.03 + i * 0.09, 0.16 + i * 0.09));
          return (
            <div key={r.v} style={{ display: "flex", alignItems: "center", gap: 22, padding: "16px 0", borderBottom: i < 2 ? `1px solid ${C.line}` : "none", opacity: p, transform: `translateX(${(1 - p) * -40}px)` }}>
              <div style={{ fontFamily: monoFont, fontWeight: 700, fontSize: 28, color: r.c, width: 60 }}>{r.v}</div>
              <div style={{ flex: 1, height: 14, borderRadius: 7, background: C.line }} />
              <div style={{ fontFamily: monoFont, fontSize: 22, color: r.c, letterSpacing: 2, textTransform: "uppercase" }}>{r.s}</div>
            </div>
          );
        })}
      </div>
      <div style={{ fontFamily: monoFont, fontSize: 24, color: C.accent, letterSpacing: 4, opacity: ease(seg(t, 0.7, 0.95)) }}>
        EVERY ANSWER KNOWS WHICH VERSION WROTE IT
      </div>
    </div>
  );
};

/* ================= END CARD ============================================== */

export const EndCardRag: React.FC<{ progress?: number }> = ({ progress = 1 }) => (
  <EndCard3 progress={progress} project="Agentic RAG & Knowledge System" />
);
