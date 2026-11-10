/**
 * heroes3b — the remaining 7 hero beats of the v3 film (reveal title, four
 * tools, limits, registry, control, real-console montage, yours).
 * Same grammar as heroes3: deterministic, driven by a single 0→1 `t`.
 */
import React from "react";
import { staticFile, useCurrentFrame } from "remotion";
import { C, bodyFont, monoFont, titleFont } from "../upgrade/utheme";
import { Check, Chip, StatusPill } from "../upgrade/primitives";
import {
  BotIcon, CheckSvgIcon, DbIcon, FileIcon, FilesIcon, GaugeIcon,
  GlobeIcon, KeyIcon, LinkIcon, LockIcon, PenIcon, PlugIcon,
  SearchIcon, ShieldIcon, XIcon,
} from "./icons3";

const ease = (t: number) => 1 - Math.pow(1 - Math.min(1, Math.max(0, t)), 3);
const seg = (t: number, a: number, b: number) => ease((t - a) / (b - a));
const glow = (c: string, r: number) => `0 0 ${r}px ${c}66`;

/* ======================= 3 · REVEAL: PRODUCT TITLE ======================== */

export const TitleBeat: React.FC<{ t: number }> = ({ t }) => {
  const mark = seg(t, 0, 0.35);
  const name = seg(t, 0.2, 0.5);
  const rule = seg(t, 0.45, 0.75);
  const sub = seg(t, 0.55, 0.85);
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 40 }}>
      {/* product mark: plug inside a shield */}
      <div
        style={{
          width: 210, height: 210, borderRadius: 52,
          background: `linear-gradient(160deg, ${C.panel2}, ${C.panel})`,
          border: `4px solid ${C.accent}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: `inset 0 0 60px ${C.accent}20, 0 0 90px ${C.accent}44`,
          opacity: mark, transform: `scale(${0.7 + mark * 0.3})`,
        }}
      >
        <PlugIcon size={110} color={C.accent} />
      </div>
      <div style={{ textAlign: "center", opacity: name, transform: `translateY(${(1 - name) * 40}px)` }}>
        <div style={{ fontFamily: titleFont, fontWeight: 700, fontSize: 110, color: C.text, letterSpacing: -2, lineHeight: 1.05 }}>
          MCP <span style={{ color: C.accent, textShadow: `0 0 50px ${C.accent}88` }}>Agent Toolkit</span>
        </div>
      </div>
      <div
        style={{
          width: 620 * rule, height: 4, borderRadius: 2,
          background: `linear-gradient(90deg, transparent, ${C.accent}, transparent)`,
          boxShadow: `0 0 24px ${C.accent}`,
        }}
      />
      <div style={{ fontFamily: titleFont, fontWeight: 500, fontSize: 44, color: C.muted, opacity: sub, transform: `translateY(${(1 - sub) * 30}px)` }}>
        Real tools for any AI agent — <span style={{ color: C.human }}>under your rules.</span>
      </div>
    </div>
  );
};

/* ========================= 5 · TOOLS: FOUR CARDS ========================== */

const TOOLS = [
  { icon: SearchIcon, label: "Search the web", sub: "web_search" },
  { icon: DbIcon, label: "Query a database", sub: "db_query" },
  { icon: FileIcon, label: "Read files", sub: "read_file" },
  { icon: PenIcon, label: "Write files", sub: "write_file" },
];

export const ToolsBeat: React.FC<{ t: number }> = ({ t }) => (
  <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 44 }}>
    {TOOLS.map((tool, i) => {
      const p = seg(t, 0.05 + i * 0.14, 0.24 + i * 0.14);
      const Icon = tool.icon;
      return (
        <div
          key={tool.sub}
          style={{
            width: 330, height: 420,
            background: `linear-gradient(165deg, ${C.panel2}, ${C.panel})`,
            border: `3px solid ${C.accent}88`, borderRadius: 28,
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 34,
            boxShadow: `0 30px 70px #000000aa, ${glow(C.accent, 34)}`,
            opacity: p, transform: `translateY(${(1 - p) * 110}px) scale(${0.75 + p * 0.25})`,
          }}
        >
          <div
            style={{
              width: 120, height: 120, borderRadius: 30, background: `${C.accent}14`,
              border: `2.5px solid ${C.accent}`, display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <Icon size={64} color={C.accent} />
          </div>
          <div style={{ fontFamily: titleFont, fontWeight: 700, fontSize: 32, color: C.text, textAlign: "center", lineHeight: 1.3, padding: "0 24px" }}>
            {tool.label}
          </div>
          <div style={{ fontFamily: monoFont, fontSize: 21, color: C.dim }}>{tool.sub}</div>
        </div>
      );
    })}
  </div>
);

/* ==================== 10 · LIMITS: STEP CAP + BUDGET ====================== */

export const LimitsBeat: React.FC<{ t: number }> = ({ t }) => {
  const steps = Math.round(seg(t, 0.1, 0.55) * 8);
  const budget = seg(t, 0.3, 0.75);
  const stopped = seg(t, 0.78, 0.92);
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 120 }}>
      {/* step cap */}
      <div style={{ width: 560, display: "flex", flexDirection: "column", alignItems: "center", gap: 30 }}>
        <div style={{ fontFamily: titleFont, fontWeight: 700, fontSize: 36, color: C.text }}>Step cap</div>
        <div style={{ display: "flex", gap: 12 }}>
          {Array.from({ length: 8 }).map((_, i) => {
            const on = i < steps;
            return (
              <div
                key={i}
                style={{
                  width: 52, height: 84, borderRadius: 12,
                  border: `2.5px solid ${on ? C.accent : C.dim}`,
                  background: on ? `${C.accent}2a` : "transparent",
                  boxShadow: on ? `inset 0 0 18px ${C.accent}55` : "none",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: monoFont, fontWeight: 700, fontSize: 26, color: on ? C.accent : C.dim,
                }}
              >
                {i + 1}
              </div>
            );
          })}
        </div>
        <div style={{ fontFamily: monoFont, fontSize: 24, color: C.muted }}>max <span style={{ color: C.accent }}>8</span> tool calls per run</div>
      </div>
      <div style={{ width: 2, height: 380, background: C.line }} />
      {/* hard budget */}
      <div style={{ width: 560, display: "flex", flexDirection: "column", alignItems: "center", gap: 30 }}>
        <div style={{ fontFamily: titleFont, fontWeight: 700, fontSize: 36, color: C.text }}>Hard budget</div>
        <div style={{ position: "relative", width: 480, height: 84 }}>
          <div style={{ position: "absolute", inset: 0, border: `2.5px solid ${C.dim}`, borderRadius: 16, background: `${C.panel}` }} />
          <div
            style={{
              position: "absolute", top: 8, bottom: 8, left: 8,
              width: 464 * budget, borderRadius: 10,
              background: `linear-gradient(90deg, ${C.accent}, ${budget > 0.85 ? C.warn : C.accent})`,
              boxShadow: glow(C.accent, 20),
            }}
          />
          {/* the wall */}
          <div
            style={{
              position: "absolute", right: -6, top: -16, bottom: -16, width: 10,
              background: C.human, borderRadius: 4,
              boxShadow: glow(C.human, 24),
              opacity: seg(t, 0.25, 0.4),
            }}
          />
          <div style={{ position: "absolute", right: 6, top: -44, fontFamily: monoFont, fontSize: 22, color: C.human, opacity: seg(t, 0.3, 0.45) }}>
            spending limit
          </div>
        </div>
        <div style={{ fontFamily: monoFont, fontSize: 24, color: C.muted }}>a run that hits it <span style={{ color: C.human }}>stops</span></div>
      </div>
      {/* the verdict */}
      <div
        style={{
          position: "absolute", left: "50%", bottom: 150, transform: "translateX(-50%)",
          opacity: stopped,
        }}
      >
        <StatusPill text="It stops — it never runs away" color={C.accent} size={30} />
      </div>
    </div>
  );
};

/* ================= 11 · REGISTRY: VERSIONS + AUDIT CHAIN ================== */

export const RegistryBeat: React.FC<{ t: number }> = ({ t }) => {
  const v2fail = seg(t, 0.5, 0.68);
  const audit = seg(t, 0.3, 0.55);
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 90 }}>
      {/* version cards */}
      <div style={{ display: "flex", alignItems: "center", gap: 44 }}>
        <div
          style={{
            width: 300, height: 380, borderRadius: 26,
            background: `linear-gradient(165deg, ${C.panel2}, ${C.panel})`,
            border: `3px solid ${C.accent}`,
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 24,
            boxShadow: `0 30px 60px #000000aa, ${glow(C.accent, 30)}`,
            opacity: seg(t, 0.05, 0.2), transform: `translateY(${(1 - seg(t, 0.05, 0.2)) * 80}px)`,
          }}
        >
          <div style={{ fontFamily: titleFont, fontWeight: 700, fontSize: 74, color: C.accent }}>v1</div>
          <div style={{ fontFamily: monoFont, fontSize: 22, color: C.muted }}>prompt</div>
          <StatusPill text="LIVE" color="#34d399" size={22} />
        </div>
        <div
          style={{
            width: 300, height: 380, borderRadius: 26,
            background: `linear-gradient(165deg, ${C.panel2}, ${C.panel})`,
            border: `3px solid ${v2fail > 0.5 ? C.danger : C.dim}`,
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 24,
            boxShadow: `0 30px 60px #000000aa${v2fail > 0.5 ? `, ${glow(C.danger, 30)}` : ""}`,
            opacity: seg(t, 0.22, 0.38), transform: `translateY(${(1 - seg(t, 0.22, 0.38)) * 80}px)`,
          }}
        >
          <div style={{ fontFamily: titleFont, fontWeight: 700, fontSize: 74, color: v2fail > 0.5 ? C.danger : C.muted }}>v2</div>
          <div style={{ fontFamily: monoFont, fontSize: 22, color: C.muted, textAlign: "center" }}>
            {v2fail > 0.5 ? "lost the live test" : "candidate — live A/B test…"}
          </div>
          {v2fail > 0.3 ? (
            <StatusPill text="NEVER SHIPPED" color={C.danger} size={22} />
          ) : (
            <StatusPill text="TESTING…" color={C.muted} size={22} />
          )}
        </div>
      </div>
      {/* audit chain */}
      <div style={{ width: 2, height: 420, background: C.line }} />
      <div style={{ display: "flex", flexDirection: "column", gap: 22, opacity: audit }}>
        <div style={{ fontFamily: monoFont, fontSize: 22, color: C.muted, letterSpacing: 3 }}>EVERY DECISION — LOGGED</div>
        {["v1 promoted — won the test", "v2 rejected — gate held", "override: none"].map((row, i) => (
          <div
            key={row}
            style={{
              display: "flex", alignItems: "center", gap: 18,
              background: C.panel, border: `1.5px solid ${C.line}`, borderRadius: 14,
              padding: "18px 24px", fontFamily: monoFont, fontSize: 23, color: C.text,
              opacity: seg(t, 0.4 + i * 0.08, 0.52 + i * 0.08),
              transform: `translateX(${(1 - seg(t, 0.4 + i * 0.08, 0.52 + i * 0.08)) * 50}px)`,
            }}
          >
            <LinkIcon size={26} color={C.accent} />
            {row}
            <span style={{ fontFamily: monoFont, fontSize: 18, color: C.dim, marginLeft: 14 }}>#a{i + 1}f{i * 7 + 3}c</span>
          </div>
        ))}
        <div style={{ fontFamily: monoFont, fontSize: 20, color: C.dim, display: "flex", alignItems: "center", gap: 10 }}>
          <LockIcon size={20} color={C.accent} /> hash-chained — tamper-evident
        </div>
      </div>
    </div>
  );
};

/* ================ 12 · CONTROL: SUGGEST / DECIDE / SIGN OFF =============== */

const CONTROL_COLS = [
  { icon: BotIcon, title: "The model", verb: "suggests", color: C.model, note: "proposes the next call" },
  { icon: ShieldIcon, title: "The code", verb: "decides", color: C.accent, note: "guardrails enforce the rules" },
  { icon: KeyIcon, title: "You", verb: "sign off", color: C.human, note: "policy, budgets, promotion" },
];

export const ControlBeat: React.FC<{ t: number }> = ({ t }) => (
  <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 70 }}>
    {CONTROL_COLS.map((col, i) => {
      const p = seg(t, 0.08 + i * 0.22, 0.3 + i * 0.22);
      const Icon = col.icon;
      return (
        <React.Fragment key={col.title}>
          {i > 0 && (
            <div
              style={{
                fontFamily: titleFont, fontSize: 64, color: C.dim,
                opacity: seg(t, 0.08 + i * 0.22 - 0.06, 0.2 + i * 0.22 - 0.06),
              }}
            >
              →
            </div>
          )}
          <div
            style={{
              width: 400, height: 440, borderRadius: 28,
              background: `linear-gradient(165deg, ${C.panel2}, ${C.panel})`,
              border: `3px solid ${col.color}99`,
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 28,
              boxShadow: `0 30px 70px #000000aa, ${glow(col.color, 30)}`,
              opacity: p, transform: `translateY(${(1 - p) * 100}px) scale(${0.8 + p * 0.2})`,
            }}
          >
            <Icon size={92} color={col.color} />
            <div style={{ fontFamily: titleFont, fontWeight: 700, fontSize: 40, color: C.text }}>{col.title}</div>
            <div style={{ fontFamily: titleFont, fontWeight: 700, fontSize: 34, color: col.color }}>{col.verb}</div>
            <div style={{ fontFamily: monoFont, fontSize: 21, color: C.muted, textAlign: "center", padding: "0 30px" }}>{col.note}</div>
          </div>
        </React.Fragment>
      );
    })}
  </div>
);

/* =================== 14 · REAL: CONSOLE SCREENSHOT MONTAGE ================ */

const SHOTS = [
  { file: "mcptoolkit3/02-streaming-1280.png", label: "live run — every step visible" },
  { file: "mcptoolkit3/03-result-expanded-1280.png", label: "results with trace IDs" },
  { file: "mcptoolkit3/06-guardrail-block-1280.png", label: "attack blocked, reason shown" },
];

export const RealBeat: React.FC<{ t: number }> = ({ t }) => (
  <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 40 }}>
    {SHOTS.map((shot, i) => {
      const p = seg(t, 0.05 + i * 0.18, 0.25 + i * 0.18);
      const mid = i === 1;
      return (
        <div
          key={shot.file}
          style={{
            width: mid ? 560 : 470,
            borderRadius: 18, overflow: "hidden",
            border: `2px solid ${mid ? C.accent : C.line}`,
            boxShadow: `0 30px 70px #000000cc${mid ? `, ${glow(C.accent, 36)}` : ""}`,
            opacity: p,
            transform: `translateY(${(1 - p) * 90}px) scale(${mid ? 1 : 0.92})`,
            position: "relative",
          }}
        >
          <img src={staticFile(shot.file)} style={{ width: "100%", display: "block" }} />
          <div
            style={{
              position: "absolute", left: 0, right: 0, bottom: 0,
              background: "linear-gradient(transparent, rgba(4,8,11,0.94))",
              padding: "40px 22px 16px",
              fontFamily: monoFont, fontSize: 20, color: C.muted,
            }}
          >
            {shot.label}
          </div>
        </div>
      );
    })}
  </div>
);

/* ================== 15 · YOURS: YOUR SYSTEMS, PLUGGED IN ================== */

const YOURS = [
  { icon: DbIcon, label: "Your database" },
  { icon: FilesIcon, label: "Your documents" },
  { icon: GlobeIcon, label: "Your systems" },
];

export const YoursBeat: React.FC<{ t: number }> = ({ t }) => (
  <div style={{ position: "absolute", inset: 0 }}>
    <svg width="1920" height="1080" style={{ position: "absolute", inset: 0 }}>
      {YOURS.map((y, i) => {
        const p = seg(t, 0.5 + i * 0.1, 0.68 + i * 0.1);
        // rail from the toolkit's right edge (x=600) into each card's left edge
        const x1 = 598, y1 = 540, x2 = 1155 + i * 260, y2 = 540;
        const mx = (x1 + x2) / 2;
        return (
          <path
            key={y.label}
            d={`M${x1} ${y1} C ${mx} ${y1} ${mx} ${y2} ${x2} ${y2}`}
            pathLength={1}
            stroke={C.accent} strokeWidth="4" fill="none"
            strokeDasharray="1" strokeDashoffset={1 - p}
            style={{ filter: `drop-shadow(0 0 8px ${C.accent})` }}
          />
        );
      })}
    </svg>
    {/* the toolkit on the left */}
    <div
      style={{
        position: "absolute", left: 300, top: 380, width: 300, height: 320,
        background: `linear-gradient(160deg, ${C.panel2}, ${C.panel})`,
        border: `4px solid ${C.accent}`, borderRadius: 30,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 24,
        boxShadow: `inset 0 0 60px ${C.accent}18, 0 0 70px ${C.accent}33`,
        opacity: seg(t, 0, 0.2), transform: `scale(${0.85 + seg(t, 0, 0.2) * 0.15})`,
      }}
    >
      <PlugIcon size={96} color={C.accent} />
      <div style={{ fontFamily: titleFont, fontWeight: 700, fontSize: 30, color: C.text }}>MCP Agent Toolkit</div>
      <StatusPill text="plugged in safely" color={C.accent} size={22} />
    </div>
    {/* the three systems on the right */}
    <div style={{ position: "absolute", left: 1140, top: 350, display: "flex", gap: 40 }}>
      {YOURS.map((y, i) => {
        const p = seg(t, 0.15 + i * 0.14, 0.34 + i * 0.14);
        const Icon = y.icon;
        return (
          <div
            key={y.label}
            style={{
              width: 220, height: 380,
              background: `linear-gradient(165deg, ${C.panel2}, ${C.panel})`,
              border: `3px solid ${C.human}88`, borderRadius: 24,
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 28,
              boxShadow: `0 30px 60px #000000aa, ${glow(C.human, 28)}`,
              opacity: p, transform: `translateY(${(1 - p) * 90}px) scale(${0.8 + p * 0.2})`,
            }}
          >
            <Icon size={86} color={C.human} />
            <div style={{ fontFamily: titleFont, fontWeight: 700, fontSize: 27, color: C.text, textAlign: "center", padding: "0 16px" }}>{y.label}</div>
          </div>
        );
      })}
    </div>
  </div>
);
