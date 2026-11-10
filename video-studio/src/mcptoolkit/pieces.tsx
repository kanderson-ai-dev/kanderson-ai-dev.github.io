/**
 * Pieces for the MCP Agent Toolkit flagship film — the physical metaphors
 * (Plan_video.md §2): question card, tool bays, protocol link, gate array,
 * vault, sandbox shoreline, version stack, A/B arena, audit chain, score rows.
 */
import React from "react";
import { useCurrentFrame } from "remotion";
import { MC, titleFont, monoFont, bodyFont, glow, tglow } from "./look";
import { noise1 } from "./motion";
import { StatusPill } from "../upgrade/primitives";

export { MC };

// ---------------------------------------------------------------------------
// Tool identity system — glyphs drawn inline, reused in every beat
// ---------------------------------------------------------------------------

export type ToolName = "web_search" | "db_query" | "read_file" | "write_file";

export const TOOL: Record<ToolName, { label: string; color: string; hint: string }> = {
  web_search: { label: "web_search", color: "#67E8F9", hint: "web · read-only" },
  db_query: { label: "db_query", color: "#A5B4FC", hint: "sql · read-only" },
  read_file: { label: "read_file", color: "#6EE7B7", hint: "sandboxed" },
  write_file: { label: "write_file", color: "#FCD34D", hint: "sandboxed" },
};

export const ToolGlyph: React.FC<{ tool: ToolName; size?: number; color?: string }> = ({ tool, size = 46, color }) => {
  const c = color ?? TOOL[tool].color;
  const common = { stroke: c, strokeWidth: 3, fill: "none", strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <svg width={size} height={size} viewBox="0 0 48 48">
      {tool === "web_search" && (
        <g {...common}>
          <circle cx="24" cy="24" r="17" />
          <ellipse cx="24" cy="24" rx="8" ry="17" />
          <path d="M7.5 20 H40.5 M7.5 28 H40.5" />
          <circle cx="38" cy="38" r="7" fill={MC.bg} />
          <circle cx="37" cy="37" r="6" />
          <path d="M41.5 41.5 L46 46" />
        </g>
      )}
      {tool === "db_query" && (
        <g {...common}>
          <ellipse cx="24" cy="12" rx="15" ry="6.5" />
          <path d="M9 12 V36 C9 39.6 15.7 42.5 24 42.5 C32.3 42.5 39 39.6 39 36 V12" />
          <path d="M9 24 C9 27.6 15.7 30.5 24 30.5 C32.3 30.5 39 27.6 39 24" />
        </g>
      )}
      {tool === "read_file" && (
        <g {...common}>
          <path d="M13 5 H30 L39 14 V43 H13 Z" />
          <path d="M30 5 V14 H39" />
          <path d="M19 23 H33 M19 30 H33 M19 37 H28" />
        </g>
      )}
      {tool === "write_file" && (
        <g {...common}>
          <path d="M13 5 H30 L39 14 V43 H13 Z" />
          <path d="M30 5 V14 H39" />
          <path d="M18 38 L19.5 33 L32 20.5 L36 24.5 L23.5 37 Z" />
          <path d="M30 23 L33.5 26.5" />
        </g>
      )}
    </svg>
  );
};

// ---------------------------------------------------------------------------
// ToolBay — a tool docked on the server side
// ---------------------------------------------------------------------------

export const ToolBay: React.FC<{
  tool: ToolName;
  w?: number;
  lit?: number; // 0..1 ignition
  off?: boolean; // unplugged
}> = ({ tool, w = 300, lit = 1, off = false }) => {
  const t = TOOL[tool];
  const col = off ? MC.dim : t.color;
  return (
    <div
      style={{
        width: w,
        background: `${MC.panel2}f2`,
        border: `2px solid ${off ? MC.line : col}`,
        borderRadius: 16,
        padding: "14px 18px",
        display: "flex",
        alignItems: "center",
        gap: 14,
        boxShadow: off ? "none" : `0 0 ${30 * lit}px ${col}33`,
        opacity: off ? 0.35 : 0.35 + 0.65 * lit,
        transform: `scale(${0.9 + lit * 0.1})`,
      }}
    >
      <ToolGlyph tool={tool} size={40} color={off ? MC.dim : col} />
      <div>
        <div style={{ fontFamily: monoFont, fontSize: 24, color: off ? MC.muted : MC.text, fontWeight: 600 }}>{t.label}</div>
        <div style={{ fontFamily: monoFont, fontSize: 16, color: MC.muted, marginTop: 3 }}>{off ? "unplugged" : t.hint}</div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// QuestionCard — the protagonist
// ---------------------------------------------------------------------------

export const QuestionCard: React.FC<{
  w?: number;
  text?: string;
  chip?: string;
  chipColor?: string;
  danger?: boolean;
}> = ({ w = 560, text = "Which reports cover security, and what is the newest one?", chip, chipColor, danger = false }) => {
  const col = danger ? MC.danger : MC.code;
  return (
    <div
      style={{
        width: w,
        background: `linear-gradient(180deg, ${MC.panel2}, ${MC.panel})`,
        border: `2.5px solid ${col}`,
        borderRadius: 20,
        padding: "24px 26px",
        boxShadow: glow(col, 46, 120),
        position: "relative",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
        <div style={{ width: 12, height: 12, borderRadius: 6, background: col, boxShadow: `0 0 14px ${col}` }} />
        <span style={{ fontFamily: monoFont, fontSize: 18, color: MC.muted, letterSpacing: 2 }}>
          {danger ? "HOSTILE REQUEST" : "QUESTION"}
        </span>
      </div>
      <div style={{ fontFamily: bodyFont, fontSize: 30, lineHeight: 1.35, color: MC.text, fontWeight: 500 }}>{text}</div>
      {chip && (
        <div style={{ marginTop: 16 }}>
          <StatusPill text={chip} color={chipColor ?? col} size={22} />
        </div>
      )}
    </div>
  );
};

// ---------------------------------------------------------------------------
// ClientNode / ServerNode — territories of the board
// ---------------------------------------------------------------------------

export const ClientNode: React.FC<{ w?: number; active?: boolean; label?: string }> = ({
  w = 340,
  active = true,
  label = "agent client",
}) => (
  <div
    style={{
      width: w,
      background: `${MC.panel}f5`,
      border: `2.5px solid ${MC.model}`,
      borderRadius: 22,
      padding: "20px 24px",
      boxShadow: active ? glow(MC.model, 40, 110) : "none",
      opacity: active ? 1 : 0.55,
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
      <svg width={52} height={52} viewBox="0 0 48 48">
        <rect x={6} y={10} width={36} height={24} rx={4} stroke={MC.model} strokeWidth={3} fill="none" />
        <path d="M14 40 H34 M24 34 V40" stroke={MC.model} strokeWidth={3} strokeLinecap="round" />
        <circle cx={18} cy={22} r={3} fill={MC.model} />
        <circle cx={24} cy={22} r={3} fill={MC.model} opacity={0.7} />
        <circle cx={30} cy={22} r={3} fill={MC.model} opacity={0.4} />
      </svg>
      <div>
        <div style={{ fontFamily: titleFont, fontWeight: 700, fontSize: 30, color: MC.text }}>{label}</div>
        <div style={{ fontFamily: monoFont, fontSize: 18, color: MC.model, marginTop: 4 }}>MODEL · LLM loop</div>
      </div>
    </div>
  </div>
);

export const ServerNode: React.FC<{ w?: number; children?: React.ReactNode; label?: string }> = ({
  w = 560,
  children,
  label = "MCP server",
}) => (
  <div
    style={{
      width: w,
      background: `${MC.panel}e8`,
      border: `2.5px solid ${MC.code}`,
      borderRadius: 24,
      padding: "18px 22px 22px",
      boxShadow: glow(MC.code, 46, 130),
    }}
  >
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
      <div style={{ fontFamily: titleFont, fontWeight: 700, fontSize: 30, color: MC.text }}>{label}</div>
      <div style={{ fontFamily: monoFont, fontSize: 18, color: MC.code }}>official SDK</div>
    </div>
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>{children}</div>
  </div>
);

// ---------------------------------------------------------------------------
// ProtocolLink — the stdio filament with travelling light packets (SVG)
// ---------------------------------------------------------------------------

export const ProtocolLink: React.FC<{
  x1: number; y1: number; x2: number; y2: number;
  packets?: number; // travelling packets count
  packetFrom?: number; // frame each packet set starts
  label?: string;
  color?: string;
}> = ({ x1, y1, x2, y2, packets = 0, packetFrom = 0, label, color = MC.code }) => {
  const f = useCurrentFrame();
  const mx = (x1 + x2) / 2;
  return (
    <g>
      <path d={`M${x1} ${y1} H${x2}`} stroke={color} strokeWidth={3} opacity={0.9} />
      <path d={`M${x1} ${y1} H${x2}`} stroke={color} strokeWidth={9} opacity={0.16} />
      {Array.from({ length: packets }, (_, i) => {
        const t = ((f - packetFrom + i * 18) % 80) / 80;
        if (t < 0 || t > 1) return null;
        const x = x1 + (x2 - x1) * t;
        return (
          <g key={i} opacity={Math.sin(t * Math.PI) * 0.95}>
            <circle cx={x} cy={y1} r={7} fill={color} />
            <circle cx={x} cy={y1} r={15} fill={color} opacity={0.25} />
          </g>
        );
      })}
      {label && (
        <text x={mx} y={y1 - 18} textAnchor="middle" fontFamily={monoFont} fontSize={19} fill={MC.muted} letterSpacing={2}>
          {label}
        </text>
      )}
    </g>
  );
};

// ---------------------------------------------------------------------------
// Gate — one guardrail station in the gauntlet
// ---------------------------------------------------------------------------

export const Gate: React.FC<{
  label: string;
  sub?: string;
  x?: number;
  h?: number;
  w?: number;
  state?: "idle" | "pass" | "block";
  flash?: number; // 0..1 pass flash
}> = ({ label, sub, h = 300, w = 130, state = "idle", flash = 0 }) => {
  const col = state === "block" ? MC.danger : state === "pass" ? MC.code : MC.dim;
  return (
    <div style={{ width: w, display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
      <div
        style={{
          width: w,
          height: h,
          borderRadius: 18,
          border: `3px solid ${col}`,
          background: `linear-gradient(180deg, ${col}18, ${col}06)`,
          boxShadow: state === "idle" ? "none" : `0 0 ${36 + flash * 30}px ${col}55`,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* scan lines */}
        {Array.from({ length: 5 }, (_, i) => (
          <div key={i} style={{ position: "absolute", left: 10, right: 10, top: 22 + i * (h - 60) / 5, height: 3, background: col, opacity: state === "idle" ? 0.25 : 0.55, borderRadius: 2 }} />
        ))}
        {state === "pass" && (
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontFamily: titleFont, fontWeight: 700, fontSize: 64, color: MC.code, textShadow: tglow(MC.code) }}>✓</span>
          </div>
        )}
        {state === "block" && (
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontFamily: titleFont, fontWeight: 700, fontSize: 58, color: MC.danger, textShadow: tglow(MC.danger) }}>✕</span>
          </div>
        )}
      </div>
      <div style={{ fontFamily: monoFont, fontSize: 20, color: col === MC.dim ? MC.muted : col, textAlign: "center", whiteSpace: "nowrap" }}>{label}</div>
      {sub && <div style={{ fontFamily: monoFont, fontSize: 16, color: MC.muted, textAlign: "center", marginTop: -6 }}>{sub}</div>}
    </div>
  );
};

// ---------------------------------------------------------------------------
// CallPacket — a travelling tool call (good or hostile)
// ---------------------------------------------------------------------------

export const CallPacket: React.FC<{
  text: string;
  danger?: boolean;
  w?: number;
  small?: boolean;
}> = ({ text, danger = false, w, small = false }) => {
  const col = danger ? MC.danger : MC.code;
  return (
    <div
      style={{
        width: w,
        background: `${MC.panel2}f8`,
        border: `2px solid ${col}`,
        borderRadius: 14,
        padding: small ? "8px 14px" : "12px 18px",
        boxShadow: `0 0 26px ${col}44`,
        fontFamily: monoFont,
        fontSize: small ? 17 : 21,
        color: danger ? "#FFD9E0" : "#D8FFF6",
        whiteSpace: "nowrap",
      }}
    >
      {text}
    </div>
  );
};

/** Error chip that flies back to the model after a rejection. */
export const ErrorChip: React.FC<{ code: string; size?: number }> = ({ code, size = 24 }) => (
  <span
    style={{
      fontFamily: monoFont,
      fontSize: size,
      fontWeight: 700,
      color: MC.danger,
      border: `2.5px solid ${MC.danger}`,
      borderRadius: 12,
      padding: "8px 18px",
      background: `${MC.danger}14`,
      boxShadow: `0 0 30px ${MC.danger}55`,
    }}
  >
    {code}
  </span>
);

// ---------------------------------------------------------------------------
// Shard — one piece of a shattered hostile call (deterministic via seed)
// ---------------------------------------------------------------------------

export const Shards: React.FC<{ n?: number; color?: string; seed?: number; p?: number }> = ({
  n = 8,
  color = MC.danger,
  seed = 1,
  p = 1,
}) => (
  <>
    {Array.from({ length: n }, (_, i) => {
      const s = i + seed * 100;
      const x = noise1(s) * 60 * p;
      const y = noise1(s + 7) * 44 * p;
      const rot = noise1(s + 13) * 90 * p;
      const w = 10 + Math.abs(noise1(s + 3)) * 18;
      return (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `calc(50% + ${x}px)`,
            top: `calc(50% + ${y}px)`,
            width: w,
            height: 6,
            borderRadius: 3,
            background: color,
            transform: `rotate(${rot}deg)`,
            boxShadow: `0 0 12px ${color}88`,
            opacity: 0.9 - p * 0.3,
          }}
        />
      );
    })}
  </>
);

// ---------------------------------------------------------------------------
// Vault — read-only-twice data store with two padlocks
// ---------------------------------------------------------------------------

export const Vault: React.FC<{ w?: number; locks?: number }> = ({ w = 300, locks = 2 }) => (
  <div
    style={{
      width: w,
      background: `${MC.panel}f5`,
      border: `2.5px solid ${MC.code}`,
      borderRadius: 18,
      padding: "16px 18px",
      boxShadow: glow(MC.code, 30, 80),
      position: "relative",
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <svg width={46} height={46} viewBox="0 0 48 48" stroke={MC.code} strokeWidth={3} fill="none">
        <ellipse cx="24" cy="12" rx="15" ry="6.5" />
        <path d="M9 12 V36 C9 39.6 15.7 42.5 24 42.5 C32.3 42.5 39 39.6 39 36 V12" />
        <path d="M9 24 C9 27.6 15.7 30.5 24 30.5 C32.3 30.5 39 27.6 39 24" />
      </svg>
      <div>
        <div style={{ fontFamily: monoFont, fontSize: 22, color: MC.text, fontWeight: 600 }}>reports.db</div>
        <div style={{ fontFamily: monoFont, fontSize: 16, color: MC.muted, marginTop: 2 }}>fixture data</div>
      </div>
    </div>
    <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
      {["statement guard", "mode=ro conn"].slice(0, locks).map((l) => (
        <span
          key={l}
          style={{
            fontFamily: monoFont,
            fontSize: 14,
            color: MC.code,
            border: `1.5px solid ${MC.code}66`,
            borderRadius: 8,
            padding: "4px 10px",
            background: `${MC.code}0d`,
          }}
        >
          🔒 {l}
        </span>
      ))}
    </div>
  </div>
);

// ---------------------------------------------------------------------------
// VersionStack + ABArena — the Prompt Registry duel
// ---------------------------------------------------------------------------

export const VersionChip: React.FC<{ v: number; state?: "promoted" | "candidate" | "blocked" | "rolled_back"; small?: boolean }> = ({
  v,
  state = "candidate",
  small = false,
}) => {
  const col = state === "promoted" ? MC.code : state === "blocked" ? MC.danger : state === "rolled_back" ? MC.human : MC.model;
  return (
    <div
      style={{
        fontFamily: monoFont,
        fontSize: small ? 20 : 26,
        fontWeight: 700,
        color: state === "candidate" ? MC.text : col,
        border: `2.5px solid ${col}`,
        borderRadius: 12,
        padding: small ? "6px 14px" : "10px 20px",
        background: `${col}14`,
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
        boxShadow: state === "promoted" ? `0 0 24px ${col}44` : "none",
        opacity: state === "rolled_back" ? 0.55 : 1,
      }}
    >
      v{v}
      <span style={{ fontSize: small ? 13 : 16, fontWeight: 400, color: col, opacity: 0.9 }}>{state.replace("_", " ")}</span>
    </div>
  );
};

export const ABLane: React.FC<{ name: string; bars: { label: string; value: number; max?: number; color?: string }[]; w?: number; winner?: boolean }> = ({
  name,
  bars,
  w = 640,
  winner = false,
}) => (
  <div
    style={{
      width: w,
      background: `${MC.panel}f2`,
      border: `2px solid ${winner ? MC.code : MC.line}`,
      borderRadius: 18,
      padding: "18px 22px",
      boxShadow: winner ? glow(MC.code, 30, 90) : "none",
    }}
  >
    <div style={{ fontFamily: monoFont, fontSize: 22, color: winner ? MC.code : MC.muted, fontWeight: 700, marginBottom: 14 }}>
      {name} {winner && "· wins"}
    </div>
    {bars.map((b) => {
      const max = b.max ?? 5;
      const col = b.color ?? (winner ? MC.code : MC.muted);
      return (
        <div key={b.label} style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 10 }}>
          <span style={{ width: 150, fontFamily: monoFont, fontSize: 19, color: MC.muted }}>{b.label}</span>
          <div style={{ flex: 1, height: 18, borderRadius: 7, background: `${MC.line}88`, overflow: "hidden" }}>
            <div style={{ width: `${(b.value / max) * 100}%`, height: "100%", background: `linear-gradient(90deg, ${col}55, ${col})` }} />
          </div>
          <span style={{ width: 76, fontFamily: monoFont, fontSize: 19, color: col, textAlign: "right" }}>{b.value.toFixed(2)}</span>
        </div>
      );
    })}
  </div>
);

/** Blocked promotion dialog — faithful replica of the console's modal. */
export const BlockedDialog: React.FC<{ w?: number }> = ({ w = 560 }) => (
  <div
    style={{
      width: w,
      background: MC.pc.raised,
      border: `1.5px solid ${MC.pc.danger}66`,
      borderRadius: 16,
      padding: "20px 24px",
      boxShadow: "0 24px 80px rgba(0,0,0,0.55)",
      fontFamily: bodyFont,
    }}
  >
    <div style={{ fontSize: 24, fontWeight: 700, color: MC.pc.ink, marginBottom: 10 }}>Promotion blocked</div>
    <div style={{ fontSize: 19, color: MC.pc.soft, lineHeight: 1.5 }}>
      The A/B gate failed. Promoting anyway needs an <span style={{ color: MC.pc.warn }}>override reason</span> — it is written to the audit log.
    </div>
    <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
      <span style={{ fontSize: 17, fontFamily: monoFont, color: MC.pc.danger, border: `1.5px solid ${MC.pc.danger}55`, borderRadius: 9, padding: "7px 14px", background: `${MC.pc.danger}14` }}>
        A/B gate failed
      </span>
      <span style={{ fontSize: 17, fontFamily: monoFont, color: MC.pc.muted, border: `1.5px solid ${MC.pc.lineStrong}55`, borderRadius: 9, padding: "7px 14px" }}>
        override reason required
      </span>
    </div>
  </div>
);

// ---------------------------------------------------------------------------
// AuditChain — registry events as linked hash blocks (real event types)
// ---------------------------------------------------------------------------

export const AuditChain: React.FC<{
  tampered?: boolean;
  w?: number;
  progress?: number;
  compact?: boolean;
}> = ({ tampered = false, w = 1560, progress = 1, compact = false }) => {
  const events = [
    { type: "candidate", detail: "v2 submitted", hash: "7b32…5231" },
    { type: "ab_test", detail: "v2 vs v1 · gate failed", hash: "ac02…61c9", red: true },
    { type: "candidate", detail: "v3 submitted", hash: "74a6…6a95" },
    { type: "ab_test", detail: "v3 vs v1 · passed", hash: "3be6…5e7b" },
    { type: "promoted", detail: "v3 → live", hash: "e366…6b9e" },
    { type: "promoted", detail: "v4 → live", hash: "8902…cc49" },
  ];
  const editIdx = 3;
  const bw = (w - (events.length - 1) * 46) / events.length;
  return (
    <div style={{ width: w, position: "relative" }}>
      <div style={{ display: "flex", alignItems: "center" }}>
        {events.map((e, i) => {
          const bad = tampered && i > editIdx;
          const edited = tampered && i === editIdx;
          const col = bad || edited ? MC.danger : e.red ? MC.human : MC.code;
          const p = Math.min(1, Math.max(0, progress * 1.5 - i * 0.12));
          return (
            <React.Fragment key={i}>
              {i > 0 && (
                <svg width={46} height={20} style={{ flexShrink: 0, opacity: p }}>
                  <path d="M0 10h46" stroke={col} strokeWidth={3.5} />
                  <path d="M36 3l10 7-10 7" fill="none" stroke={col} strokeWidth={3.5} />
                </svg>
              )}
              <div
                style={{
                  width: bw,
                  flexShrink: 0,
                  boxSizing: "border-box",
                  background: `${MC.panel}f5`,
                  border: `2.5px solid ${col}`,
                  borderRadius: 14,
                  padding: compact ? "12px 12px" : "16px 14px",
                  boxShadow: `0 0 26px ${col}2e`,
                  opacity: p,
                  transform: `translateY(${(1 - p) * 24}px)`,
                }}
              >
                <div style={{ fontFamily: monoFont, fontWeight: 700, fontSize: compact ? 17 : 20, color: col }}>{e.type}</div>
                {!compact && (
                  <div style={{ fontFamily: bodyFont, fontSize: 17, color: MC.muted, marginTop: 5, minHeight: 40 }}>
                    {edited ? <span style={{ color: MC.danger }}>{e.detail} · edited</span> : e.detail}
                  </div>
                )}
                <div style={{ fontFamily: monoFont, fontSize: compact ? 14 : 16, color: col, marginTop: 6, opacity: 0.85 }}>#{e.hash}</div>
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// ScoreRow — one scorecard gate row
// ---------------------------------------------------------------------------

export const ScoreRow: React.FC<{
  label: string;
  value: string;
  gate: string;
  ok?: boolean;
  w?: number;
  size?: number;
}> = ({ label, value, gate, ok = true, w = 1500, size = 1 }) => {
  const col = ok ? MC.code : MC.danger;
  return (
    <div
      style={{
        width: w,
        display: "flex",
        alignItems: "center",
        gap: 30 * size,
        background: `${MC.panel}ee`,
        border: `2px solid ${col}55`,
        borderRadius: 18,
        padding: `${20 * size}px ${28 * size}px`,
        boxShadow: `0 0 ${ok ? 40 : 60}px ${col}${ok ? "22" : "44"}`,
      }}
    >
      <span style={{ width: 380 * size, fontFamily: titleFont, fontSize: 30 * size, fontWeight: 700, color: MC.text }}>{label}</span>
      <span style={{ fontFamily: monoFont, fontSize: 40 * size, fontWeight: 700, color: col, textShadow: tglow(col, 24, 60), minWidth: 260 * size }}>{value}</span>
      <span style={{ fontFamily: monoFont, fontSize: 21 * size, color: MC.muted }}>{gate}</span>
      <span style={{ marginLeft: "auto", fontFamily: titleFont, fontSize: 34 * size, color: col }}>{ok ? "✓" : "✕"}</span>
    </div>
  );
};

// ---------------------------------------------------------------------------
// MEndCard — CTA
// ---------------------------------------------------------------------------

export const MEndCard: React.FC<{ progress?: number }> = ({ progress = 1 }) => {
  const t = Math.min(1, progress / 0.5);
  const sub = Math.min(1, Math.max(0, (progress - 0.45) / 0.4));
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 30 }}>
      <div style={{ position: "relative" }}>
        <div style={{ fontFamily: titleFont, fontWeight: 700, fontSize: 118, color: MC.code, textShadow: tglow(MC.code, 60, 140), letterSpacing: -1, opacity: t, transform: `scale(${0.92 + t * 0.08})` }}>
          kaarstenanderson.com
        </div>
        <div style={{ position: "absolute", bottom: -16, left: "50%", transform: "translateX(-50%)", width: 700 * t, height: 4, background: `linear-gradient(90deg, transparent, ${MC.code}, transparent)`, boxShadow: `0 0 26px ${MC.code}` }} />
      </div>
      <div style={{ fontFamily: titleFont, fontWeight: 500, fontSize: 46, color: MC.text, opacity: sub }}>
        Kaarsten Anderson <span style={{ color: MC.muted }}>·</span> <span style={{ color: MC.code }}>Agentic AI Developer</span>
      </div>
      <div style={{ fontFamily: bodyFont, fontSize: 30, color: MC.muted, opacity: sub }}>Agents you can trust in production — let’s build yours.</div>
      <div style={{ display: "flex", gap: 22, opacity: sub }}>
        <span style={{ fontFamily: monoFont, fontSize: 27, color: MC.code, border: `2px solid ${MC.code}`, borderRadius: 12, padding: "12px 26px", background: `${MC.code}14` }}>
          contact@kaarstenanderson.com
        </span>
        <span style={{ fontFamily: monoFont, fontSize: 27, color: MC.text, border: `2px solid ${MC.line}`, borderRadius: 12, padding: "12px 26px", background: `${MC.panel}cc`, display: "inline-flex", alignItems: "center", gap: 12 }}>
          <svg width="30" height="30" viewBox="0 0 24 24" fill={MC.text}><path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.9.58.11.79-.25.79-.55v-2.15c-3.2.7-3.87-1.37-3.87-1.37-.52-1.34-1.28-1.7-1.28-1.7-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.23-1.28-5.23-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.1 11.1 0 015.78 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.41-2.69 5.38-5.25 5.67.41.36.78 1.05.78 2.13v3.16c0 .3.21.67.8.55A11.5 11.5 0 0023.5 12C23.5 5.65 18.35.5 12 .5z"/></svg>
          kanderson-ai-dev/mcp-agent-toolkit
        </span>
      </div>
      <div style={{ fontFamily: monoFont, fontSize: 20, color: MC.dim, opacity: sub }}>public repo · MIT license</div>
    </div>
  );
};

/** Title helper with film typography. */
export const MTitle: React.FC<{ children: React.ReactNode; top?: number; size?: number; center?: boolean }> = ({
  children,
  top = 60,
  size = 54,
  center = true,
}) => (
  <div
    style={{
      position: "absolute",
      top,
      left: 0,
      right: 0,
      textAlign: center ? "center" : "left",
      fontFamily: titleFont,
      fontWeight: 700,
      fontSize: size,
      color: MC.text,
      textShadow: "0 2px 30px rgba(0,0,0,0.6)",
      paddingLeft: center ? 0 : 90,
    }}
  >
    {children}
  </div>
);

export const MKicker: React.FC<{ text: string; bottom?: number; color?: string }> = ({ text, bottom = 48, color = MC.muted }) => (
  <div style={{ position: "absolute", bottom, left: 0, right: 0, textAlign: "center", fontFamily: monoFont, fontSize: 22, color, letterSpacing: 2 }}>
    {text}
  </div>
);
