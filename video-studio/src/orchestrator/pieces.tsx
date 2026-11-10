import React from "react";
import { C, bodyFont, monoFont, titleFont } from "../upgrade/utheme";
import { Check, Chip, StatusPill } from "../upgrade/primitives";

// ---------------------------------------------------------------------------
// Shared atoms
// ---------------------------------------------------------------------------

export const TitleText: React.FC<{ children: React.ReactNode; top?: number; size?: number }> = ({ children, top = 64, size = 54 }) => (
  <div style={{ position: "absolute", top, left: 0, right: 0, textAlign: "center", fontFamily: titleFont, fontWeight: 700, fontSize: size, color: C.text, zIndex: 5 }}>
    {children}
  </div>
);

export const Kicker: React.FC<{ text: string; bottom?: number }> = ({ text, bottom = 54 }) => (
  <div style={{ position: "absolute", bottom, left: 0, right: 0, textAlign: "center", fontFamily: monoFont, fontSize: 24, color: C.muted, letterSpacing: 1 }}>{text}</div>
);

// Agent role identity: glyph + colour (model = violet, code = turquoise, human = amber)
export type Role = "supervisor" | "researcher" | "financial_analyst" | "compliance_analyst" | "writer" | "reviewer" | "guardrail" | "human" | "assembler";

export const ROLE: Record<Role, { label: string; kind: "MODEL" | "CODE" | "HUMAN"; color: string }> = {
  supervisor: { label: "Supervisor", kind: "MODEL", color: C.model },
  researcher: { label: "Researcher", kind: "MODEL", color: C.model },
  financial_analyst: { label: "Financial Analyst", kind: "MODEL", color: C.model },
  compliance_analyst: { label: "Compliance Analyst", kind: "MODEL", color: C.model },
  writer: { label: "Writer", kind: "MODEL", color: C.model },
  reviewer: { label: "Reviewer", kind: "MODEL", color: C.model },
  guardrail: { label: "Guardrail", kind: "CODE", color: C.accent },
  assembler: { label: "Report Assembler", kind: "CODE", color: C.accent },
  human: { label: "Human Review", kind: "HUMAN", color: C.human },
};

export const Glyph: React.FC<{ role: Role; size?: number; color?: string }> = ({ role, size = 44, color }) => {
  const col = color ?? ROLE[role].color;
  const s = size;
  const stroke = { stroke: col, strokeWidth: 3, fill: "none", strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  switch (role) {
    case "supervisor": // compass: circle + needle
      return (
        <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
          <circle cx="24" cy="24" r="19" {...stroke} />
          <path d="M31 17l-5 9-9 5 5-9z" fill={col} />
        </svg>
      );
    case "researcher": // magnifier
      return (
        <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
          <circle cx="21" cy="21" r="12" {...stroke} />
          <path d="M30 30l10 10" {...stroke} strokeWidth={4} />
        </svg>
      );
    case "financial_analyst": // $
      return (
        <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
          <text x="24" y="34" textAnchor="middle" fontFamily={monoFont} fontWeight={700} fontSize="34" fill={col}>$</text>
        </svg>
      );
    case "compliance_analyst": // scale-ish check inside shield
      return (
        <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
          <path d="M24 5l15 6v12c0 10-6.5 17-15 20-8.5-3-15-10-15-20V11z" {...stroke} />
          <path d="M17 24l5 5 9-10" {...stroke} />
        </svg>
      );
    case "writer": // pen
      return (
        <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
          <path d="M30 10l8 8L18 38l-9 2 2-9z" {...stroke} />
          <path d="M27 13l8 8" {...stroke} />
        </svg>
      );
    case "reviewer": // lens + check
      return (
        <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
          <circle cx="21" cy="21" r="12" {...stroke} />
          <path d="M15 21l4 4 8-8" {...stroke} />
          <path d="M30 30l10 10" {...stroke} strokeWidth={4} />
        </svg>
      );
    case "guardrail": // shield
      return (
        <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
          <path d="M24 4l16 6v13c0 11-7 18.5-16 21-9-2.5-16-10-16-21V10z" {...stroke} />
          <path d="M17 24l5 5 9-10" {...stroke} />
        </svg>
      );
    case "assembler": // seal / stamp
      return (
        <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
          <circle cx="24" cy="20" r="11" {...stroke} />
          <path d="M17 29l-4 12h22l-4-12" {...stroke} />
          <path d="M19 20l3.5 3.5L29 17" {...stroke} />
        </svg>
      );
    case "human": // person
      return (
        <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
          <circle cx="24" cy="15" r="8" {...stroke} />
          <path d="M10 42c0-8 6.5-13 14-13s14 5 14 13" {...stroke} />
        </svg>
      );
  }
};

// ---------------------------------------------------------------------------
// AgentNode — a team member card on the board
// ---------------------------------------------------------------------------

export const AgentNode: React.FC<{
  role: Role;
  lit?: number; // 0..1 ignition
  w?: number;
  active?: boolean; // currently working (pulsing edge)
  tag?: string;
}> = ({ role, lit = 1, w = 250, active = false, tag }) => {
  const r = ROLE[role];
  return (
    <div
      style={{
        width: w,
        background: `${C.panel}f2`,
        border: `2.5px solid ${r.color}`,
        borderRadius: 18,
        padding: "16px 18px",
        display: "flex",
        alignItems: "center",
        gap: 14,
        boxShadow: lit ? `0 0 ${28 + 30 * lit}px ${r.color}${active ? "88" : "44"}` : "none",
        opacity: lit,
        transform: `scale(${0.6 + lit * 0.4})`,
      }}
    >
      <Glyph role={role} size={42} />
      <div>
        <div style={{ fontFamily: titleFont, fontWeight: 700, fontSize: 25, color: C.text, lineHeight: 1.1 }}>{r.label}</div>
        <div style={{ fontFamily: monoFont, fontSize: 16, color: r.color, marginTop: 4 }}>{tag ?? r.kind}</div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// BriefCard — the protagonist: topic + report type + budget cap + status
// ---------------------------------------------------------------------------

export const BriefCard: React.FC<{
  w?: number;
  status?: "new" | "screened" | "team" | "working" | "awaiting" | "sealed";
  topic?: string;
}> = ({ w = 500, status = "new", topic = "Assess Quentell vs Norvane as KYC vendors" }) => {
  const pill: Record<string, { text: string; color: string } | undefined> = {
    new: undefined,
    screened: { text: "screened ✓", color: C.accent },
    team: { text: "team: 5", color: C.accent },
    working: { text: "in progress", color: C.model },
    awaiting: { text: "awaiting review", color: C.human },
    sealed: { text: "sealed ✓", color: C.accent },
  };
  const p = pill[status];
  return (
    <div
      style={{
        width: w,
        background: `${C.panel}f5`,
        border: `3px solid ${status === "awaiting" ? C.human : status === "sealed" ? C.accent : C.accent + "aa"}`,
        borderRadius: 22,
        padding: "26px 30px",
        boxShadow: `0 0 50px ${status === "awaiting" ? C.human : C.accent}33`,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <span style={{ fontFamily: monoFont, fontSize: 19, color: C.muted, letterSpacing: 2 }}>REPORT BRIEF</span>
        {p && <StatusPill text={p.text} color={p.color} size={19} />}
      </div>
      <div style={{ fontFamily: bodyFont, fontWeight: 600, fontSize: 31, color: C.text, lineHeight: 1.3 }}>“{topic}”</div>
      <div style={{ display: "flex", gap: 12, marginTop: 18, flexWrap: "wrap" }}>
        <Chip text="vendor_assessment" color={C.accent} size={19} />
        <Chip text="audience: procurement" color={C.muted} size={19} />
        <Chip text="cap $0.0060" color={C.warn} size={19} />
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// DrawnEdge — an SVG curve that draws itself; tip glows while drawing
// ---------------------------------------------------------------------------

export const DrawnEdge: React.FC<{
  x1: number; y1: number; x2: number; y2: number;
  p?: number; // draw progress 0..1
  color?: string;
  width?: number;
  bend?: number; // curvature control offset
  pulse?: boolean; // moving dash overlay once drawn
  frame?: number;
}> = ({ x1, y1, x2, y2, p = 1, color = C.accent, width = 4, bend, pulse = false, frame = 0 }) => {
  const mx = x1 + (x2 - x1) / 2;
  const my = y1 + (y2 - y1) / 2 + (bend ?? 0);
  const d = `M${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`;
  const len = 900;
  return (
    <g>
      <path d={d} stroke={color} strokeWidth={width} opacity={0.22} fill="none" />
      <path d={d} stroke={color} strokeWidth={width} fill="none" strokeDasharray={len} strokeDashoffset={len * (1 - p)} strokeLinecap="round" />
      {pulse && p >= 1 && <path d={d} stroke="#ffffff" strokeWidth={2} fill="none" strokeDasharray="6 40" strokeDashoffset={-((frame * 2.4) % 46)} opacity={0.6} />}
      {p > 0 && p < 1 && <circle cx={x1 + (x2 - x1) * p} cy={y1 + (y2 - y1) * p + (bend ?? 0) * 2 * p * (1 - p)} r={7} fill={color} />}
    </g>
  );
};

// ---------------------------------------------------------------------------
// BudgetGauge — cap / spent / remaining + worst-case bar + REFUSED lock
// ---------------------------------------------------------------------------

export const BudgetGauge: React.FC<{ progress?: number; w?: number }> = ({ progress = 1, w = 1040 }) => {
  const p = Math.min(1, progress);
  const cap = 0.006;
  const spent = 0.003;
  const remaining = cap - spent;
  const worst = 0.019091;
  const scale = w / (worst * 1.15); // px per dollar
  const slam = Math.min(1, Math.max(0, (p - 0.45) / 0.2));
  const stamp = Math.min(1, Math.max(0, (p - 0.62) / 0.2));
  const barX = Math.min(spent + remaining, worst); // bar can't pass the remaining slot
  const barW = worst * scale;
  const slotX = (spent + remaining) * scale;
  return (
    <div style={{ width: w, position: "relative" }}>
      {/* fuel gauge */}
      <div style={{ position: "relative", height: 74, borderRadius: 16, border: `2.5px solid ${C.accent}`, background: C.panel, overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: spent * scale, background: `linear-gradient(90deg, ${C.model}88, ${C.model})` }} />
        <div style={{ position: "absolute", left: spent * scale, top: 0, bottom: 0, width: remaining * scale, background: `${C.accent}26`, borderRight: `3px solid ${C.accent}` }} />
        <div style={{ position: "absolute", right: 14, top: 0, bottom: 0, display: "flex", alignItems: "center", fontFamily: monoFont, fontSize: 24, color: C.muted }}>cap $0.0060</div>
      </div>
      <div style={{ display: "flex", gap: 40, marginTop: 14, fontFamily: monoFont, fontSize: 23 }}>
        <span style={{ color: C.model }}>spent $0.0030</span>
        <span style={{ color: C.accent }}>remaining $0.0030</span>
      </div>
      {/* worst-case estimate bar sliding in */}
      <div style={{ position: "relative", marginTop: 60, height: 110 }}>
        <div style={{ position: "absolute", left: slotX, top: -8, bottom: -8, width: 3, background: C.accent, boxShadow: `0 0 18px ${C.accent}` }} />
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: Math.min(barW * p * 2, barX * scale + 4),
            height: 74,
            borderRadius: 14,
            background: `linear-gradient(90deg, ${C.danger}55, ${C.danger})`,
            border: `3px solid ${C.danger}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            paddingRight: 18,
            fontFamily: monoFont,
            fontWeight: 700,
            fontSize: 25,
            color: "#fff",
            boxShadow: `0 0 34px ${C.danger}55`,
          }}
        >
          worst-case $0.019091
        </div>
        {/* lock appears where the bar is stopped */}
        <div style={{ position: "absolute", left: slotX - 52, top: -18, opacity: slam, transform: `scale(${0.6 + slam * 0.4})` }}>
          <svg width="104" height="104" viewBox="0 0 100 100" fill="none">
            <circle cx="50" cy="50" r="46" stroke={C.accent} strokeWidth="3" opacity="0.5" />
            <circle cx="50" cy="50" r="38" fill={C.panel} stroke={C.accent} strokeWidth="2.5" />
            <path d="M38 46v-8a12 12 0 0124 0v8" stroke={C.accent} strokeWidth="5" strokeLinecap="round" />
            <rect x="34" y="46" width="32" height="26" rx="6" fill={C.accent} />
            <circle cx="50" cy="56" r="4" fill={C.bg} />
            <rect x="48.5" y="58" width="3" height="8" fill={C.bg} />
          </svg>
        </div>
        {stamp > 0 && (
          <div
            style={{
              position: "absolute",
              left: slotX + 130,
              top: 8,
              transform: `rotate(-8deg) scale(${Math.min(1, stamp * 2)})`,
              fontFamily: titleFont,
              fontWeight: 700,
              fontSize: 46,
              color: C.danger,
              border: `5px solid ${C.danger}`,
              borderRadius: 12,
              padding: "6px 22px",
              background: "#0b0508dd",
              letterSpacing: 2,
              boxShadow: `0 0 40px ${C.danger}55`,
            }}
          >
            REFUSED
          </div>
        )}
      </div>
      <div style={{ marginTop: 34, fontFamily: monoFont, fontSize: 22, color: C.muted, opacity: Math.min(1, Math.max(0, (p - 0.75) / 0.25)) }}>
        financial_analyst call refused: worst-case $0.019091 exceeds remaining budget $0.002874 (cap $0.0060)
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// HashChain — transcript blocks linked by hashes; tamper turns later links red
// ---------------------------------------------------------------------------

export const HashChain: React.FC<{ progress?: number; tampered?: boolean; w?: number }> = ({ progress = 1, tampered = false, w = 1560 }) => {
  const msgs: { sender: string; text: string; textEdited?: string; hash: string }[] = [
    { sender: "guardrail", text: "Brief accepted.", hash: "df29…287d" },
    { sender: "supervisor", text: "dispatch → researcher", hash: "9841…b830c" },
    { sender: "researcher", text: "26 evidence items sealed", textEdited: "41 evidence items sealed", hash: "084e…b65dc" },
    { sender: "writer", text: "drafted report v1", hash: "69a0…14c9cf" },
    { sender: "human", text: "funded +$0.0500", hash: "2def…cc29e" },
    { sender: "assembler", text: "transcript sealed", hash: "4ace…2de3d6" },
  ];
  const editIdx = 2;
  const bw = (w - 5 * 56) / 6;
  return (
    <div style={{ width: w, position: "relative" }}>
      <div style={{ display: "flex", alignItems: "center" }}>
        {msgs.map((m, i) => {
          const bad = tampered && i > editIdx;
          const edited = tampered && i === editIdx;
          const col = bad || edited ? C.danger : C.accent;
          const p = Math.min(1, Math.max(0, progress * 1.4 - i * 0.12));
          return (
            <React.Fragment key={i}>
              {i > 0 && (
                <svg width={56} height={20} style={{ flexShrink: 0, opacity: p }}>
                  <path d="M0 10h56" stroke={col} strokeWidth={3.5} />
                  <path d="M46 3l10 7-10 7" fill="none" stroke={col} strokeWidth={3.5} />
                </svg>
              )}
              <div
                style={{
                  width: bw,
                  flexShrink: 0,
                  boxSizing: "border-box",
                  background: `${C.panel}f5`,
                  border: `3px solid ${col}`,
                  borderRadius: 16,
                  padding: "18px 16px",
                  boxShadow: `0 0 30px ${col}33`,
                  opacity: p,
                  transform: `translateY(${(1 - p) * 26}px)`,
                }}
              >
                <div style={{ fontFamily: titleFont, fontWeight: 700, fontSize: 21, color: edited ? C.danger : C.text }}>{m.sender}</div>
                <div style={{ fontFamily: bodyFont, fontSize: 19, color: C.muted, marginTop: 6, minHeight: 50 }}>
                  {edited ? (
                    <>
                      <span style={{ textDecoration: "line-through", color: C.danger }}>{m.text}</span>
                      <br />
                      <span style={{ color: C.danger }}>{m.textEdited}</span>
                    </>
                  ) : (
                    m.text
                  )}
                </div>
                <div style={{ fontFamily: monoFont, fontSize: 18, color: col, marginTop: 8 }}>#{m.hash}</div>
              </div>
            </React.Fragment>
          );
        })}
      </div>
      <div style={{ position: "absolute", right: 0, top: -78, opacity: Math.min(1, progress) }}>
        {tampered ? (
          <StatusPill text="verified: false" color={C.danger} size={30} />
        ) : (
          <StatusPill text="audit ✓ verified" color={C.accent} size={30} />
        )}
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// ProofBoard — the live held-out gate counters
// ---------------------------------------------------------------------------

export const ProofBoard: React.FC<{ progress?: number }> = ({ progress = 1 }) => {
  const counter = (v: number, target: number, decimals = 3) => (v * target).toFixed(decimals);
  const p1 = Math.min(1, progress / 0.5);
  const p2 = Math.min(1, Math.max(0, (progress - 0.25) / 0.5));
  const p3 = Math.min(1, Math.max(0, (progress - 0.5) / 0.5));
  const foot = Math.min(1, Math.max(0, (progress - 0.7) / 0.3));
  const big = { fontFamily: titleFont, fontWeight: 700, fontSize: 150, lineHeight: 1 } as const;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 40 }}>
      <div style={{ display: "flex", gap: 80, alignItems: "flex-start" }}>
        <div style={{ textAlign: "center", width: 460 }}>
          <div style={{ ...big, color: C.accent, textShadow: `0 0 60px ${C.accent}88` }}>
            {counter(p1, 1)}<span style={{ fontSize: 70, color: C.muted }}> / {counter(p1, 0.929)}</span>
          </div>
          <div style={{ fontFamily: titleFont, fontSize: 30, color: C.text, marginTop: 14 }}>citation support</div>
          <div style={{ fontFamily: monoFont, fontSize: 21, color: C.muted, marginTop: 6 }}>gate ≥ 0.90 · both runs passed</div>
        </div>
        <div style={{ textAlign: "center", width: 420 }}>
          <div style={{ ...big, color: C.accent, textShadow: `0 0 60px ${C.accent}88` }}>
            {Math.round(p2 * 8)}/8<span style={{ fontSize: 60, color: C.muted }}> @ $0.00</span>
          </div>
          <div style={{ fontFamily: titleFont, fontSize: 30, color: C.text, marginTop: 14 }}>attack briefs blocked</div>
          <div style={{ fontFamily: monoFont, fontSize: 21, color: C.muted, marginTop: 6 }}>rejected before any paid call</div>
        </div>
        <div style={{ textAlign: "center", width: 420 }}>
          <div style={{ ...big, color: C.accent, textShadow: `0 0 60px ${C.accent}88`, fontSize: 118, lineHeight: 1.27 }}>
            ${counter(p3, 0.011, 3)}
          </div>
          <div style={{ fontFamily: titleFont, fontSize: 30, color: C.text, marginTop: 14 }}>per report, all agents</div>
          <div style={{ fontFamily: monoFont, fontSize: 21, color: C.muted, marginTop: 6 }}>gate ≤ $0.08</div>
        </div>
      </div>
      <div style={{ display: "flex", gap: 18, opacity: foot }}>
        <Chip text="415 tests" size={24} />
        <Chip text="92% coverage" size={24} />
        <Chip text="mypy --strict · 0 errors" size={24} />
        <Chip text="browser E2E in CI" size={24} />
      </div>
      <div style={{ fontFamily: monoFont, fontSize: 22, color: C.dim, opacity: foot }}>
        live held-out gate · live models + live web search · 2 complete runs · 2026-10-27
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// OEndCard — name · role · url · email · public repo
// ---------------------------------------------------------------------------

export const OEndCard: React.FC<{ progress?: number }> = ({ progress = 1 }) => {
  const t = Math.min(1, progress / 0.5);
  const sub = Math.min(1, Math.max(0, (progress - 0.45) / 0.4));
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 30 }}>
      <div style={{ position: "relative" }}>
        <div style={{ fontFamily: titleFont, fontWeight: 700, fontSize: 120, color: C.accent, textShadow: `0 0 60px ${C.accent}99, 0 0 140px ${C.accent}44`, letterSpacing: -1, opacity: t, transform: `scale(${0.92 + t * 0.08})` }}>
          kaarstenanderson.com
        </div>
        <div style={{ position: "absolute", bottom: -16, left: "50%", transform: "translateX(-50%)", width: 700 * t, height: 4, background: `linear-gradient(90deg, transparent, ${C.accent}, transparent)`, boxShadow: `0 0 26px ${C.accent}` }} />
      </div>
      <div style={{ fontFamily: titleFont, fontWeight: 500, fontSize: 46, color: C.text, opacity: sub }}>
        Kaarsten Anderson <span style={{ color: C.muted }}>·</span> <span style={{ color: C.accent }}>Agentic AI Developer</span>
      </div>
      <div style={{ fontFamily: bodyFont, fontSize: 30, color: C.muted, opacity: sub }}>Agents you can trust in production — let’s build yours.</div>
      <div style={{ display: "flex", gap: 22, opacity: sub }}>
        <span style={{ fontFamily: monoFont, fontSize: 27, color: C.accent, border: `2px solid ${C.accent}`, borderRadius: 12, padding: "12px 26px", background: `${C.accent}14` }}>
          contact@kaarstenanderson.com
        </span>
        <span style={{ fontFamily: monoFont, fontSize: 27, color: C.text, border: `2px solid ${C.line}`, borderRadius: 12, padding: "12px 26px", background: `${C.panel}cc`, display: "inline-flex", alignItems: "center", gap: 12 }}>
          <svg width="30" height="30" viewBox="0 0 24 24" fill={C.text}><path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.9.58.11.79-.25.79-.55v-2.15c-3.2.7-3.87-1.37-3.87-1.37-.52-1.34-1.28-1.7-1.28-1.7-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.23-1.28-5.23-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.1 11.1 0 015.78 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.41-2.69 5.38-5.25 5.67.41.36.78 1.05.78 2.13v3.16c0 .3.21.67.8.55A11.5 11.5 0 0023.5 12C23.5 5.65 18.35.5 12 .5z"/></svg>
          kanderson-ai-dev/langgraph-multiagent-orchestrator
        </span>
      </div>
      <div style={{ fontFamily: monoFont, fontSize: 20, color: C.dim, opacity: sub }}>public repo · MIT license</div>
    </div>
  );
};

export { Check, Chip, StatusPill };
