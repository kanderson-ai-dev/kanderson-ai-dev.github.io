/**
 * heroes_b — secondary beats of the agentic-api flagship film.
 * Same grammar as heroes.tsx: deterministic, driven by a single 0→1 `t`,
 * one recognizable hero per shot, real replica data only.
 */
import React from "react";
import { C, bodyFont, monoFont, titleFont } from "../upgrade/utheme";
import { Chip } from "../upgrade/primitives";
import { ease, seg, glow, seeded } from "../orchestrator2/fx";
import { BotIcon, LockIcon, ShieldIcon, CheckSvgIcon } from "../mcptoolkit3/icons3";
import {
  CalcIcon, CodeIcon, CoinIcon, PersonIcon, ReceiptIcon, ThreadIcon,
} from "./aicons";
import { AiCore, BigShield, EngineerLabel, QuestionCard } from "./heroes";

const panel: React.CSSProperties = {
  background: `linear-gradient(160deg, ${C.panel2}, ${C.panel})`,
  border: `3px solid ${C.line}`,
  borderRadius: 24,
};

/* ============ WORK: AI plans → code does the math → retry =============== */

export const WorkBeat: React.FC<{ t: number }> = ({ t }) => {
  const plan = seg(t, 0.05, 0.3);
  const calc = seg(t, 0.3, 0.55);
  const retry = seg(t, 0.6, 0.95);
  const dots = Math.floor(seg(t, 0.62, 0.9) * 3.999);
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      {/* the AI core lights for the first time and prints the plan */}
      <div style={{ position: "absolute", left: 330, top: 300, opacity: plan, transform: `translateY(${(1 - plan) * 30}px)` }}>
        <AiCore active={plan} />
        {/* stem from the core down to its plan card */}
        <div style={{ position: "absolute", left: 113, top: 232, width: 4, height: 20, background: `${C.model}66` }} />
        <div style={{ position: "absolute", left: -75, top: 252, width: 380, fontFamily: monoFont, fontSize: 26, color: C.muted, opacity: plan }}>
          <div style={{ ...panel, padding: "18px 22px", borderColor: `${C.model}66`, width: 380 }}>
            <div style={{ fontFamily: monoFont, fontSize: 24, color: C.dim }}>the plan</div>
            <div style={{ marginTop: 8, color: C.text, whiteSpace: "nowrap" }}>calculator("15 * 4")</div>
          </div>
        </div>
      </div>
      {/* arrow from the AI into the calculator tile */}
      <svg width="1920" height="1080" style={{ position: "absolute", inset: 0 }}>
        <path d="M 585 415 C 700 415 780 415 925 415" pathLength={1} stroke={C.accent} strokeWidth="4" fill="none"
          strokeDasharray="1" strokeDashoffset={1 - seg(t, 0.25, 0.4)} style={{ filter: `drop-shadow(0 0 8px ${C.accent})` }} />
      </svg>
      {/* the calculator tile returns 60 */}
      <div style={{ position: "absolute", left: 940, top: 280, opacity: calc, transform: `scale(${0.8 + calc * 0.2})` }}>
        <div
          style={{
            width: 240, height: 280, borderRadius: 28,
            background: `linear-gradient(160deg, ${C.panel2}, ${C.panel})`,
            border: `4px solid ${C.accent}`, display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center", gap: 20,
            boxShadow: `inset 0 0 50px ${C.accent}18, ${glow(C.accent, 30)}`,
          }}
        >
          <CalcIcon size={84} color={C.accent} />
          <div style={{ fontFamily: titleFont, fontWeight: 700, fontSize: 88, color: C.accent, textShadow: glow(C.accent, 30), lineHeight: 1 }}>60</div>
        </div>
      </div>
      {/* hiccup → retry dots → green check */}
      <div style={{ position: "absolute", left: 1330, top: 420, display: "flex", alignItems: "center", gap: 26, opacity: retry }}>
        <Chip text="timeout" size={26} color={C.danger} />
        <div style={{ display: "flex", gap: 12 }}>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                width: 20, height: 20, borderRadius: 10,
                background: i < dots ? C.accent : `${C.accent}22`,
                border: `2px solid ${C.accent}`, boxShadow: i < dots ? glow(C.accent, 12) : "none",
              }}
            />
          ))}
        </div>
        <span style={{ opacity: seg(t, 0.9, 1), transform: `scale(${0.6 + seg(t, 0.9, 1) * 0.4})`, display: "inline-flex" }}>
          <CheckSvgIcon size={54} color={C.accent} />
        </span>
      </div>
      <EngineerLabel text="structured plan · code-run tools · retry with backoff" />
    </div>
  );
};

/* ============ MEMORY: thread links back → 120 ========================== */

export const MemoryBeat: React.FC<{ t: number }> = ({ t }) => {
  const turn1 = seg(t, 0, 0.2);
  const turn2 = seg(t, 0.25, 0.55);
  const link = seg(t, 0.4, 0.65);
  const ans = seg(t, 0.6, 0.9);
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      {/* the conversation thread, left */}
      <div style={{ position: "absolute", left: 260, top: 300, opacity: turn1 }}>
        <div style={{ ...panel, width: 520, borderColor: `${C.accent}44`, padding: "20px 26px" }}>
          <div style={{ fontFamily: monoFont, fontSize: 24, color: C.dim }}>turn 1</div>
          <div style={{ fontFamily: bodyFont, fontSize: 34, color: C.text, marginTop: 6 }}>"What is 15 times 4?"</div>
          <div style={{ fontFamily: titleFont, fontWeight: 700, fontSize: 44, color: C.accent, marginTop: 10 }}>60</div>
        </div>
      </div>
      <div
        style={{
          position: "absolute", left: 300, top: 560, opacity: turn2, transform: `translateY(${(1 - turn2) * 26}px)`,
          fontFamily: bodyFont, fontSize: 34, color: C.text,
          background: `${C.accent}0e`, border: `3px solid ${C.accent}55`, borderRadius: "20px 20px 20px 4px",
          padding: "16px 24px",
        }}
      >
        <span style={{ fontFamily: monoFont, fontSize: 24, color: C.dim, display: "block", marginBottom: 4 }}>turn 2</span>
        "Now double that"
      </div>
      {/* thread linking turn 2 back to turn 1 */}
      <svg width="1920" height="1080" style={{ position: "absolute", inset: 0 }}>
        <path d="M 300 640 C 170 640 160 500 250 470" pathLength={1} stroke={C.accent} strokeWidth="4" fill="none"
          strokeDasharray="1" strokeDashoffset={1 - link} style={{ filter: `drop-shadow(0 0 8px ${C.accent})` }} />
      </svg>
      <div style={{ position: "absolute", left: 110, top: 445, opacity: link, fontFamily: monoFont, fontSize: 24, color: C.muted }}>
        remembers
      </div>
      {/* the answer, right — huge */}
      <div style={{ position: "absolute", left: 1120, top: 380, textAlign: "center", opacity: ans, transform: `scale(${0.7 + ans * 0.3})` }}>
        <div style={{ fontFamily: titleFont, fontWeight: 700, fontSize: 170, color: C.accent, textShadow: glow(C.accent, 50), lineHeight: 1 }}>120</div>
        <div style={{ fontFamily: monoFont, fontSize: 26, color: C.muted, marginTop: 30 }}>60 × 2</div>
      </div>
      <EngineerLabel text="per-session checkpointed memory" />
    </div>
  );
};

/* ============ RECORD: receipt chain + trace thread ====================== */

const Receipt: React.FC<{ action: string; detail: string; ok?: boolean; p: number }> = ({ action, detail, ok = true, p }) => (
  <div
    style={{
      width: 340, ...panel, borderColor: `${ok ? C.accent : C.danger}66`, padding: "18px 22px",
      opacity: p, transform: `translateY(${(1 - p) * 30}px)`,
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <ReceiptIcon size={34} color={ok ? C.accent : C.danger} />
      <div style={{ fontFamily: monoFont, fontWeight: 700, fontSize: 26, color: ok ? C.accent : C.danger }}>{action}</div>
    </div>
    <div style={{ fontFamily: monoFont, fontSize: 24, color: C.muted, marginTop: 8 }}>{detail}</div>
    <div style={{ fontFamily: monoFont, fontSize: 24, color: C.dim, marginTop: 6 }}>9d41b0c3…f2a1<br />api-key-holder</div>
  </div>
);

export const RecordBeat: React.FC<{ t: number }> = ({ t }) => {
  const r1 = seg(t, 0, 0.2);
  const r2 = seg(t, 0.15, 0.4);
  const r3 = seg(t, 0.35, 0.6);
  const thread = seg(t, 0.5, 0.9);
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      {/* receipt chain across the top */}
      <div style={{ position: "absolute", left: 300, top: 225, display: "flex", alignItems: "center", gap: 54 }}>
        <Receipt action="promote" detail="v1 · initial import" p={r1} />
        <Receipt action="blocked" detail="v2 · regression" ok={false} p={r2} />
        <Receipt action="rollback" detail="v1 · reason required" p={r3} />
      </div>
      {/* chain links between receipts */}
      <svg width="1920" height="1080" style={{ position: "absolute", inset: 0 }}>
        {[0, 1].map((i) => {
          const p = i === 0 ? seg(t, 0.12, 0.3) : seg(t, 0.32, 0.5);
          return (
            <path key={i} d={`M ${692 + i * 438} 325 H ${730 + i * 438}`} pathLength={1} stroke={C.accent} strokeWidth="4"
              strokeDasharray="1" strokeDashoffset={1 - p} style={{ filter: `drop-shadow(0 0 8px ${C.accent})` }} />
          );
        })}
        {/* the tracking thread piercing three panels */}
        <path d="M 960 500 V 880" pathLength={1} stroke={C.accent} strokeWidth="4" fill="none"
          strokeDasharray="1" strokeDashoffset={1 - thread} style={{ filter: `drop-shadow(0 0 8px ${C.accent})` }} />
      </svg>
      <div
        style={{
          position: "absolute", left: 855, top: 435, opacity: seg(t, 0.45, 0.6),
          fontFamily: monoFont, fontWeight: 700, fontSize: 30, color: C.accent,
          background: `${C.accent}1a`, border: `3px solid ${C.accent}`, borderRadius: 12, padding: "8px 20px",
          transform: `scale(${0.8 + seg(t, 0.45, 0.6) * 0.2})`,
        }}
      >
        #7f3a…
      </div>
      {/* three panels the thread pierces */}
      <div style={{ position: "absolute", left: 540, top: 505, display: "flex", gap: 60, opacity: seg(t, 0.55, 0.75) }}>
        <div style={{ ...panel, width: 250, padding: "16px 20px" }}>
          <div style={{ fontFamily: monoFont, fontSize: 24, color: C.dim, marginBottom: 10 }}>trace</div>
          {[80, 55, 95, 40].map((w, i) => (
            <div key={i} style={{ width: w * 2, height: 14, borderRadius: 7, background: `${C.accent}${i === 3 ? "" : "55"}`, marginTop: 8, opacity: seg(t, 0.6 + i * 0.07, 0.75 + i * 0.07) }} />
          ))}
        </div>
        <div style={{ ...panel, width: 250, padding: "16px 20px" }}>
          <div style={{ fontFamily: monoFont, fontSize: 24, color: C.dim, marginBottom: 10 }}>log</div>
          <div style={{ fontFamily: monoFont, fontSize: 24, color: C.muted, lineHeight: 1.7 }}>
            node=planner<br />status=ok<br />req=7f3a9c2e…
          </div>
        </div>
        <div style={{ ...panel, width: 250, padding: "16px 20px", borderColor: `${C.accent}66` }}>
          <div style={{ fontFamily: monoFont, fontSize: 24, color: C.dim, marginBottom: 10 }}>response</div>
          <div style={{ fontFamily: monoFont, fontSize: 24, color: C.text, lineHeight: 1.7 }}>
            prompt v1<br /><span style={{ color: C.accent }}>c03f7baaef81</span>
          </div>
        </div>
      </div>
      <EngineerLabel text="SHA-256 audit chain · X-Request-ID · prompt_hash" />
    </div>
  );
};

/* ============ CONTROL: AI plans · CODE guards · YOU decide ============= */

export const ControlBeatA: React.FC<{ t: number }> = ({ t }) => {
  const cols = [
    { icon: BotIcon, word: "AI", verb: "plans", color: C.model, x: 420 },
    { icon: CodeIcon, word: "CODE", verb: "guards + enforces", color: C.accent, x: 810 },
    { icon: PersonIcon, word: "YOU", verb: "decide", color: C.human, x: 1200 },
  ];
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 90 }}>
      {cols.map((c, i) => {
        const p = seg(t, 0.08 + i * 0.22, 0.3 + i * 0.22);
        const Icon = c.icon;
        return (
          <div
            key={c.word}
            style={{
              display: "flex", flexDirection: "column", alignItems: "center", gap: 26,
              opacity: p, transform: `translateY(${(1 - p) * 50}px) scale(${0.85 + p * 0.15})`,
            }}
          >
            <div
              style={{
                width: 240, height: 240, borderRadius: 40,
                background: `linear-gradient(160deg, ${C.panel2}, ${C.panel})`,
                border: `4px solid ${c.color}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: `inset 0 0 50px ${c.color}18, ${glow(c.color, 30)}`,
              }}
            >
              <Icon size={110} color={c.color} />
            </div>
            <div style={{ fontFamily: titleFont, fontWeight: 700, fontSize: 54, color: c.color, textShadow: glow(c.color, 24), letterSpacing: 2 }}>{c.word}</div>
            <div style={{ fontFamily: bodyFont, fontSize: 32, color: C.text }}>{c.verb}</div>
          </div>
        );
      })}
    </div>
  );
};

/* ============ REAL: replica strip — real response format =============== */

const REAL_PANELS = [
  { tag: "blocked response", lines: ["blocked: true", "errors: guardrail_blocked:", "  input rejected by safety policy"], danger: true },
  { tag: "live progress events", lines: ["node: guardrail", "node: planner", "node: execution", "node: output_guardrail", "event: done"] },
  { tag: "/metrics", lines: ["agent_blocked_requests_total 3", "agent_tool_calls_total 41", "agent_planner_runs_total 128"] },
];

export const RealBeatA: React.FC<{ t: number }> = ({ t }) => (
  <div style={{ position: "absolute", inset: 0 }}>
    <div style={{ position: "absolute", left: 220, top: 290, display: "flex", gap: 56, perspective: 1200 }}>
      {REAL_PANELS.map((p, i) => {
        const pr = seg(t, 0.05 + i * 0.2, 0.28 + i * 0.2);
        return (
          <div
            key={p.tag}
            style={{
              width: 440, height: 460, ...panel,
              borderColor: p.danger ? `${C.danger}66` : C.line,
              padding: "22px 16px",
              opacity: pr, transform: `translateY(${(1 - pr) * 60}px) rotateY(${(1 - pr) * -18}deg)`,
              transformOrigin: "left center",
            }}
          >
            <div style={{ fontFamily: monoFont, fontSize: 26, color: p.danger ? C.danger : C.muted, borderBottom: `2px solid ${C.line}`, paddingBottom: 10 }}>
              {p.tag}
            </div>
            <div style={{ fontFamily: monoFont, fontSize: 24, color: C.text, marginTop: 16, lineHeight: 1.8, whiteSpace: "pre-wrap" }}>
              {p.lines.map((l, k) => (
                <div key={k} style={{ opacity: seg(t, 0.22 + i * 0.2 + k * 0.07, 0.34 + i * 0.2 + k * 0.07) }}>{l}</div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
    <div
      style={{
        position: "absolute", left: 0, right: 0, bottom: 300, textAlign: "center",
        fontFamily: monoFont, fontSize: 24, color: C.dim, opacity: seg(t, 0.6, 0.8),
      }}
    >
      replicas · real response format · fictional IDs
    </div>
    <div
      style={{
        position: "absolute", left: 0, right: 0, bottom: 246, textAlign: "center",
        fontFamily: monoFont, fontSize: 26, color: C.muted, opacity: seg(t, 0.7, 0.9),
      }}
    >
      Python · FastAPI · LangGraph · Pydantic · Prometheus · Docker · non-root · HEALTHCHECK
    </div>
  </div>
);

/* ============ YOURS: same safe core, your tools ========================= */

const TOOLS = ["order lookup", "CRM search", "create ticket"];

export const YoursBeatA: React.FC<{ t: number }> = ({ t }) => {
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      {/* the safe core underneath: door + two shields, static and glowing once */}
      <div style={{ position: "absolute", left: 300, top: 380, opacity: 0.9, transform: "scale(0.62)", transformOrigin: "top left" }}>
        <BigShield side="in" t={t} lit={seg(t, 0, 0.15)} />
      </div>
      <div style={{ position: "absolute", left: 1440, top: 380, opacity: 0.9, transform: "scale(0.62)", transformOrigin: "top left" }}>
        <BigShield side="out" t={t} lit={seg(t, 0, 0.15)} />
      </div>
      {/* the tool tile — always facing; tool names crossfade inside it */}
      <div style={{ position: "absolute", left: 800, top: 330 }}>
        <div
          style={{
            width: 330, height: 400, ...panel, borderColor: `${C.accent}66`,
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 30,
            boxShadow: `inset 0 0 60px ${C.accent}18, ${glow(C.accent, 30)}`,
            opacity: seg(t, 0.05, 0.2), transform: `translateY(${(1 - seg(t, 0.05, 0.2)) * 30}px)`,
          }}
        >
          <CalcIcon size={100} color={C.accent} />
          <div data-qa-xfade style={{ position: "relative", height: 60, width: "100%" }}>
            {TOOLS.map((tool, i) => {
              const in_ = seg(t, 0.15 + i * 0.24, 0.26 + i * 0.24);
              const out_ = i < 2 ? 1 - seg(t, 0.3 + i * 0.24, 0.4 + i * 0.24) : 1;
              return (
                <div
                  key={tool}
                  style={{
                    position: "absolute", left: 0, right: 0, top: 0,
                    fontFamily: titleFont, fontWeight: 700, fontSize: 40, color: C.accent, textAlign: "center",
                    padding: "0 20px", opacity: in_ * out_, transform: `translateY(${(1 - in_) * 14}px)`,
                  }}
                >
                  {tool}
                </div>
              );
            })}
          </div>
          <div style={{ fontFamily: monoFont, fontSize: 24, color: C.dim }}>your tool</div>
        </div>
      </div>
      <EngineerLabel text="examples · adapted on request" />
    </div>
  );
};
