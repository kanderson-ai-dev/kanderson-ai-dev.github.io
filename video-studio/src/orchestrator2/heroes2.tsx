/**
 * heroes2 — hero beats of the LangGraph Orchestrator flagship rebuild.
 * Flat stage, one recognizable object per shot, hero = 40–60% of frame.
 * Every component is deterministic, driven by a single 0→1 progress `t`.
 */
import React from "react";
import { C, bodyFont, monoFont, titleFont } from "../upgrade/utheme";
import { Chip } from "../upgrade/primitives";
import { SearchIcon, PenIcon, BotIcon } from "../mcptoolkit3/icons3";
import { ChartIcon, CompassIcon, DocIcon, EyeIcon, ScaleIcon } from "./oicons";
import { glow, Letterbox, LensFlare, RimLight, seg, Shockwave, Stamp } from "./fx";

/* ===================== 1 · COLD OPEN: REPORT DROP ======================= */

const QUESTIONS = [
  { text: "Who to buy from.", x: 1180, y: 250, d: 0.28 },
  { text: "Where to grow.", x: 1310, y: 480, d: 0.46 },
  { text: "What could go wrong.", x: 1150, y: 700, d: 0.64 },
];

export const ColdOpenBeat: React.FC<{ t: number }> = ({ t }) => {
  const drop = seg(t, 0, 0.22);
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      {/* the report: the thing every decision needs */}
      <div
        style={{
          position: "absolute", left: 620 - 260, top: 190,
          width: 520, height: 680,
          background: `linear-gradient(165deg, #101a20, ${C.panel})`,
          border: `3px solid ${C.accent}`, borderRadius: 20,
          boxShadow: `0 60px 120px #000000ee, inset 0 0 90px ${C.accent}10, ${glow(C.accent, 60)}`,
          opacity: drop,
          transform: `translateY(${(1 - drop) * -140}px) rotate(${(1 - drop) * 4 - 2}deg) scale(${0.86 + drop * 0.14})`,
          padding: "52px 48px",
        }}
      >
        <div style={{ fontFamily: monoFont, fontWeight: 600, fontSize: 24, letterSpacing: 5, color: C.muted }}>REPORT</div>
        <div style={{ fontFamily: titleFont, fontWeight: 700, fontSize: 46, color: C.text, marginTop: 16, lineHeight: 1.2 }}>
          Vendor<br />Assessment
        </div>
        {/* document lines */}
        {[92, 78, 88, 60, 84, 70].map((w, i) => (
          <div key={i} style={{ marginTop: i === 0 ? 44 : 18, height: 14, borderRadius: 7, width: `${w}%`, background: i === 3 ? `${C.accent}55` : `${C.line}` }} />
        ))}
        {/* a chart block */}
        <div style={{ marginTop: 40, height: 150, border: `1.5px solid ${C.line}`, borderRadius: 12, position: "relative", overflow: "hidden" }}>
          <svg width="100%" height="100%" viewBox="0 0 400 150" preserveAspectRatio="none">
            <path d="M0 120 L60 100 L120 108 L180 70 L240 80 L300 40 L400 30" stroke={C.accent} strokeWidth="4" fill="none" style={{ filter: `drop-shadow(0 0 6px ${C.accent})` }} />
            <path d="M0 120 L60 116 L120 122 L180 104 L240 110 L300 92 L400 86" stroke={C.muted} strokeWidth="3" fill="none" opacity={0.7} />
          </svg>
        </div>
        <div style={{ position: "absolute", bottom: 40, left: 48, right: 48, display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontFamily: monoFont, fontSize: 22, color: C.dim }}>Quentell · Norvane</span>
          <DocIcon size={30} color={C.dim} />
        </div>
        <RimLight p={seg(t, 0.2, 0.42)} />
      </div>
      <Shockwave p={seg(t, 0.18, 0.5)} x={620} y={870} color={C.accent} r={220} />
      {/* the questions a decision asks */}
      {QUESTIONS.map((q) => {
        const p = seg(t, q.d, q.d + 0.2);
        return (
          <div
            key={q.text}
            style={{
              position: "absolute", left: q.x, top: q.y,
              background: C.panel, border: `2px solid ${C.accent}88`, borderRadius: 18,
              padding: "26px 34px", boxShadow: `0 24px 60px #000000cc, ${glow(C.accent, 24)}`,
              opacity: p, transform: `translateX(${(1 - p) * 90}px) scale(${0.85 + p * 0.15})`,
            }}
          >
            <span style={{ fontFamily: titleFont, fontWeight: 700, fontSize: 34, color: C.text }}>{q.text}</span>
          </div>
        );
      })}
      <Letterbox open={0} />
    </div>
  );
};

/* ===================== 2 · THE PROBLEM: 3 RED STAMPS ==================== */

export const ProblemBeat: React.FC<{ t: number }> = ({ t }) => {
  const spin = seg(t, 0.3, 0.6);
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      {/* glossy AI report — looks great, proves nothing */}
      <div
        style={{
          position: "absolute", left: 700, top: 230, width: 520, height: 640,
          background: "linear-gradient(160deg, #182430, #0d141b)",
          border: `2.5px solid ${C.model}88`, borderRadius: 22,
          boxShadow: `0 50px 110px #000000dd, ${glow(C.model, 40)}`,
          padding: "44px 42px",
          opacity: seg(t, 0, 0.15), transform: `scale(${0.9 + seg(t, 0, 0.15) * 0.1}) rotate(-1.5deg)`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <BotIcon size={40} color={C.model} />
          <span style={{ fontFamily: titleFont, fontWeight: 700, fontSize: 32, color: C.model }}>AI report</span>
        </div>
        {[94, 82, 88, 64].map((w, i) => (
          <div key={i} style={{ marginTop: i === 0 ? 34 : 16, height: 13, borderRadius: 6, width: `${w}%`, background: "#2a3d4c" }} />
        ))}
        {/* a confident-looking quote */}
        <div style={{ marginTop: 30, border: `1.5px solid ${C.model}55`, borderRadius: 12, padding: "18px 22px", background: `${C.model}0c` }}>
          <div style={{ fontFamily: bodyFont, fontSize: 26, color: C.text, lineHeight: 1.45 }}>
            “…growth reached <span style={{ color: C.danger, fontWeight: 700 }}>340%</span> last year…”
          </div>
          <div style={{ fontFamily: monoFont, fontSize: 21, color: C.muted, marginTop: 10 }}>
            source: <span style={{ color: C.danger }}>???</span>
          </div>
        </div>
        {/* fake chart */}
        <div style={{ marginTop: 30, height: 130, border: `1.5px solid #2a3d4c`, borderRadius: 12, overflow: "hidden" }}>
          <svg width="100%" height="100%" viewBox="0 0 400 130" preserveAspectRatio="none">
            <path d="M0 110 L80 96 L160 100 L240 60 L320 66 L400 20" stroke={C.model} strokeWidth="4" fill="none" />
          </svg>
        </div>
      </div>
      {/* stamp 1 — MADE UP */}
      <div style={{ position: "absolute", left: 220, top: 250, opacity: seg(t, 0.1, 0.22) }}>
        <Stamp t={seg(t, 0.1, 0.3)} text="MADE UP" size={52} rot={-10} />
        <div style={{ fontFamily: bodyFont, fontSize: 26, color: C.muted, marginTop: 18, maxWidth: 360 }}>
          quotes it can’t prove
        </div>
      </div>
      {/* stamp 2 — the bill runs away: a receipt climbing off the meter */}
      <div style={{ position: "absolute", left: 1330, top: 250, opacity: seg(t, 0.34, 0.46) }}>
        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          <div
            style={{
              width: 150, height: 150, position: "relative",
              background: "#0a0d10", border: `4px solid ${C.danger}`, borderRadius: 18,
              boxShadow: glow(C.danger, 30),
              transform: `scale(${0.7 + seg(t, 0.34, 0.5) * 0.3})`,
            }}
          >
            <svg width="142" height="142" viewBox="0 0 100 100" style={{ position: "absolute", inset: 0 }}>
              {/* meter ticks across the top */}
              {[0, 1, 2, 3, 4].map((i) => (
                <line key={i} x1={14 + i * 18} y1="14" x2={14 + i * 18} y2="20" stroke={C.danger} strokeWidth="3" opacity={0.7} />
              ))}
              {/* climbing cost bars */}
              {[16, 26, 38, 54].map((h, i) => (
                <rect key={i} x={16 + i * 19} y={88 - h} width="12" height={h} rx="3"
                  fill={i === 3 ? C.danger : "#5c2a38"}
                  opacity={i === 3 ? seg(t, 0.4, 0.55) : 1} />
              ))}
              {/* runaway arrow */}
              <path d="M14 80 C 40 74, 62 58, 86 34" stroke={C.danger} strokeWidth="5" fill="none" strokeLinecap="round"
                pathLength={1} strokeDasharray="1" strokeDashoffset={1 - spin} />
              <path d="M86 34 l-16 1 M86 34 l-2 -15" stroke={C.danger} strokeWidth="5" fill="none" strokeLinecap="round"
                opacity={seg(t, 0.5, 0.6)} />
            </svg>
          </div>
          <div>
            <div style={{ fontFamily: bodyFont, fontWeight: 700, fontSize: 58, color: C.danger, textShadow: glow(C.danger, 20) }}>$∞</div>
            <div style={{ fontFamily: bodyFont, fontSize: 26, color: C.muted, maxWidth: 260 }}>nobody capped it</div>
          </div>
        </div>
      </div>
      {/* stamp 3 — NO PROOF / black box */}
      <div style={{ position: "absolute", left: 240, top: 620, opacity: seg(t, 0.56, 0.68) }}>
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <div
            style={{
              width: 130, height: 130, borderRadius: 20, background: "#0a0d10",
              border: `4px solid ${C.danger}`, boxShadow: glow(C.danger, 30),
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: monoFont, fontWeight: 700, fontSize: 46, color: C.danger,
              transform: `scale(${0.7 + seg(t, 0.56, 0.72) * 0.3})`,
            }}
          >
            ?
          </div>
          <div>
            <Stamp t={seg(t, 0.58, 0.78)} text="NO PROOF" size={44} rot={4} />
            <div style={{ fontFamily: bodyFont, fontSize: 26, color: C.muted, marginTop: 14, maxWidth: 380 }}>
              a black box — nothing to check
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ===================== 3 · REVEAL: TITLE + FLARE ======================== */

export const RevealBeat: React.FC<{ t: number; open?: number }> = ({ t, open = 1 }) => {
  const draw = seg(t, 0, 0.35);
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      {/* circuit traces building in */}
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
          opacity: draw, transform: `scale(${0.94 + draw * 0.06})`,
        }}
      >
        <span style={{ color: C.accent, textShadow: glow(C.accent, 40) }}>LangGraph</span>
        {" "}Multi-Agent<br />Orchestrator
      </div>
      <div
        style={{
          position: "absolute", left: 0, right: 0, top: 640, textAlign: "center",
          fontFamily: bodyFont, fontWeight: 500, fontSize: 40, color: C.muted,
          opacity: seg(t, 0.4, 0.6),
        }}
      >
        A team of AI specialists writes your reports —{" "}
        <span style={{ color: C.accent, fontWeight: 700 }}>
          and proves every word
        </span>
      </div>
      {/* underline sweep */}
      <div
        style={{
          position: "absolute", left: 660, top: 706, width: 560 * seg(t, 0.55, 0.85), height: 4,
          background: `linear-gradient(90deg, transparent, ${C.accent}, transparent)`, boxShadow: glow(C.accent, 16),
        }}
      />
      <LensFlare x={960} y={330} p={seg(t, 0.35, 0.55)} />
      <Letterbox open={open} />
    </div>
  );
};

/* ===================== 4 · CREW: HEIST LINEUP =========================== */

export const CREW = [
  { name: "Researcher", job: "finds the facts", Icon: SearchIcon, key: "researcher" },
  { name: "Analyst", job: "runs the numbers", Icon: ChartIcon, key: "financial_analyst" },
  { name: "Compliance", job: "checks the rules", Icon: ScaleIcon, key: "compliance_analyst" },
  { name: "Writer", job: "writes the report", Icon: PenIcon, key: "writer" },
  { name: "The Critic", job: "checks every claim", Icon: EyeIcon, key: "reviewer" },
] as const;

export const CrewCard: React.FC<{
  c: (typeof CREW)[number]; p: number; big?: boolean; dim?: number;
}> = ({ c, p, big, dim = 1 }) => {
  const Icon = c.Icon;
  const w = big ? 310 : 286;
  return (
    <div
      style={{
        width: w, height: big ? 470 : 440,
        background: `linear-gradient(172deg, ${C.panel2}, ${C.panel})`,
        border: `3px solid ${c.key === "reviewer" ? C.accent : C.model}${c.key === "reviewer" ? "" : "aa"}`,
        borderRadius: 24, position: "relative",
        boxShadow: `0 34px 70px #000000cc, ${glow(c.key === "reviewer" ? C.accent : C.model, c.key === "reviewer" ? 44 : 26)}`,
        opacity: p * dim,
        transform: `translateY(${(1 - p) * 110}px) scale(${0.75 + p * 0.25})`,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 24,
        padding: "0 20px",
      }}
    >
      <div
        style={{
          width: 150, height: 150, borderRadius: 75,
          background: `${c.key === "reviewer" ? C.accent : C.model}14`,
          border: `3px solid ${c.key === "reviewer" ? C.accent : C.model}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: `inset 0 0 40px ${c.key === "reviewer" ? C.accent : C.model}22`,
        }}
      >
        <Icon size={78} color={c.key === "reviewer" ? C.accent : C.model} />
      </div>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontFamily: titleFont, fontWeight: 700, fontSize: 42, color: C.text }}>{c.name}</div>
        <div style={{ fontFamily: bodyFont, fontSize: 27, color: C.muted, marginTop: 8 }}>{c.job}</div>
      </div>
      <RimLight p={seg(p, 0.6, 1)} />
    </div>
  );
};

export const CrewBeat: React.FC<{ t: number }> = ({ t }) => (
  <div style={{ position: "absolute", inset: 0 }}>
    <div style={{ position: "absolute", left: 0, right: 0, top: 300, display: "flex", justifyContent: "center", gap: 34 }}>
      {CREW.map((c, i) => {
        const p = seg(t, 0.06 + i * 0.14, 0.24 + i * 0.14);
        return <CrewCard key={c.key} c={c} p={p} big={c.key === "reviewer"} />;
      })}
    </div>
    {/* engineer label */}
    <div style={{ position: "absolute", left: 0, right: 0, top: 800, textAlign: "center", opacity: seg(t, 0.7, 0.9) }}>
      <Chip text="vendor_assessment → 5 agents" color={C.dim} size={26} />
    </div>
    <Shockwave p={seg(t, 0.62, 0.9)} x={1468} y={730} color={C.accent} r={140} />
  </div>
);

/* =================== 5 · TEAM LEAD: DRAWN PATH + 3 LANES ================ */

const LANES = [
  { label: "research sub-questions", Icon: SearchIcon, fill: 0.86 },
  { label: "financial model", Icon: ChartIcon, fill: 0.62 },
  { label: "compliance check", Icon: ScaleIcon, fill: 0.44 },
];

export const LeadBeat: React.FC<{ t: number }> = ({ t }) => {
  const draw = seg(t, 0.08, 0.34);
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      {/* the team lead card */}
      <div
        style={{
          position: "absolute", left: 170, top: 300, width: 330, height: 400,
          background: `linear-gradient(172deg, ${C.panel2}, ${C.panel})`,
          border: `4px solid ${C.model}`, borderRadius: 26,
          boxShadow: `0 34px 80px #000000dd, ${glow(C.model, 60)}`,
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 22,
          opacity: seg(t, 0, 0.15), transform: `translateX(${(1 - seg(t, 0, 0.15)) * -80}px)`,
        }}
      >
        <div style={{ width: 140, height: 140, borderRadius: 70, background: `${C.model}16`, border: `3px solid ${C.model}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <CompassIcon size={76} color={C.model} />
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: titleFont, fontWeight: 700, fontSize: 40, color: C.text }}>Team lead</div>
          <div style={{ fontFamily: bodyFont, fontSize: 26, color: C.muted, marginTop: 6 }}>an AI that decides</div>
        </div>
        <RimLight p={seg(t, 0.1, 0.3)} />
      </div>
      {/* live-drawn path to the fan-out hub */}
      <svg width="1920" height="1080" style={{ position: "absolute", inset: 0 }}>
        <path
          d="M500 500 C 640 500, 660 500, 780 500" pathLength={1}
          stroke={C.model} strokeWidth="5" fill="none"
          strokeDasharray="1" strokeDashoffset={1 - draw}
          style={{ filter: `drop-shadow(0 0 10px ${C.model})` }}
        />
        {draw >= 1 && <circle cx="780" cy="500" r="14" fill={C.model} style={{ filter: `drop-shadow(0 0 14px ${C.model})` }} />}
        {/* three lanes splitting out and rejoining */}
        {LANES.map((l, i) => {
          const sp = seg(t, 0.36, 0.58);
          const y = 300 + i * 200;
          return (
            <path
              key={l.label}
              d={`M780 500 C 880 500, 900 ${y}, 1010 ${y} H1560`}
              pathLength={1} stroke={C.accent} strokeWidth="4.5" fill="none"
              strokeDasharray="1" strokeDashoffset={1 - sp}
              style={{ filter: `drop-shadow(0 0 8px ${C.accent})` }}
            />
          );
        })}
      </svg>
      {/* lanes = parallel work with live progress */}
      {LANES.map((l, i) => {
        const p = seg(t, 0.55 + i * 0.08, 0.7 + i * 0.08);
        const y = 300 + i * 200;
        const Icon = l.Icon;
        return (
          <div key={l.label} style={{ position: "absolute", left: 1030, top: y - 66, width: 560, opacity: p }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 12 }}>
              <Icon size={34} color={C.accent} />
              <span style={{ fontFamily: bodyFont, fontWeight: 600, fontSize: 26, color: C.text }}>{l.label}</span>
              <span style={{ marginLeft: "auto", fontFamily: monoFont, fontSize: 24, color: C.accent }}>{Math.round(l.fill * p * 100)}%</span>
            </div>
            <div style={{ height: 16, borderRadius: 8, background: `${C.line}`, overflow: "hidden" }}>
              <div style={{ width: `${l.fill * p * 100}%`, height: "100%", borderRadius: 8, background: `linear-gradient(90deg, ${C.accent}88, ${C.accent})`, boxShadow: `0 0 14px ${C.accent}66` }} />
            </div>
          </div>
        );
      })}
      {/* engineer label */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 800, textAlign: "center", opacity: seg(t, 0.7, 0.9) }}>
        <Chip text="dynamic routing · Send() ×3" color={C.dim} size={26} />
      </div>
    </div>
  );
};
