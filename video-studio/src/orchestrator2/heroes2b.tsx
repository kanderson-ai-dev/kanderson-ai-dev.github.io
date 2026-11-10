/**
 * heroes2b — promise beats + built-by card for the orchestrator rebuild.
 */
import React from "react";
import { C, bodyFont, monoFont, titleFont } from "../upgrade/utheme";
import { Chip } from "../upgrade/primitives";
import { LockIcon, PenIcon, SearchIcon } from "../mcptoolkit3/icons3";
import { ChartIcon, CompassIcon, ScaleIcon } from "./oicons";
import { glow, LensFlare, seg, Shockwave, Stamp } from "./fx";

/* ===================== 6 · PROMISE 1: MAGNIFIER ========================= */

const DocPanel: React.FC<{
  x: number; y: number; w: number; tag: string; tagColor: string; title: React.ReactNode;
  children: React.ReactNode; rot?: number; p: number;
}> = ({ x, y, w, tag, tagColor, title, children, rot = 0, p }) => (
  <div
    style={{
      position: "absolute", left: x, top: y, width: w,
      background: C.panel, border: `2.5px solid ${tagColor}66`, borderRadius: 20,
      boxShadow: `0 30px 70px #000000cc`, padding: "34px 36px",
      transform: `rotate(${rot}deg) translateY(${(1 - p) * 60}px)`, opacity: p,
    }}
  >
    <div style={{ fontFamily: monoFont, fontWeight: 600, fontSize: 22, letterSpacing: 3, color: tagColor }}>{tag}</div>
    <div style={{ fontFamily: titleFont, fontWeight: 700, fontSize: 32, color: C.text, marginTop: 10 }}>{title}</div>
    <div style={{ marginTop: 26 }}>{children}</div>
  </div>
);

const TextBar: React.FC<{ w: string; mt?: number; color?: string }> = ({ w, mt = 16, color = "#22333a" }) => (
  <div style={{ marginTop: mt, height: 13, borderRadius: 6, width: w, background: color }} />
);

export const Promise1Beat: React.FC<{ t: number }> = ({ t }) => {
  const caught = seg(t, 0.55, 0.75);
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      {/* draft report */}
      <DocPanel x={280} y={250} w={480} tag="REPORT DRAFT" tagColor={C.muted} title={<span>the claim</span>} rot={-1.5} p={seg(t, 0, 0.15)}>
        <TextBar w="92%" mt={0} />
        <TextBar w="78%" />
        <div style={{ marginTop: 20, border: `1.5px solid ${C.muted}44`, borderRadius: 12, padding: "16px 20px", background: `${C.bg}` }}>
          <div style={{ fontFamily: bodyFont, fontSize: 27, color: C.text, lineHeight: 1.45 }}>
            “…reduced onboarding time by{" "}
            <span style={{ position: "relative", display: "inline-block", color: caught > 0 ? C.danger : C.text, fontWeight: 700, padding: "0 6px" }}>
              21%
              <span
                style={{
                  position: "absolute", inset: -6, borderRadius: 8,
                  border: `3px solid ${C.danger}`, opacity: caught,
                  transform: `scale(${1.3 - caught * 0.3})`,
                }}
              />
            </span>{" "}
            for new clients…”
          </div>
        </div>
        <TextBar w="84%" mt={20} />
        <TextBar w="66%" />
      </DocPanel>
      {/* source passage */}
      <DocPanel x={1160} y={250} w={480} tag="SOURCE [S3-P1]" tagColor={C.accent} title={<span>the truth</span>} rot={1.5} p={seg(t, 0.08, 0.24)}>
        <TextBar w="86%" mt={0} />
        <div style={{ marginTop: 20, border: `1.5px solid ${C.accent}55`, borderRadius: 12, padding: "16px 20px", background: `${C.accent}08` }}>
          <div style={{ fontFamily: bodyFont, fontSize: 27, color: C.text, lineHeight: 1.45 }}>
            “…reduced onboarding time by{" "}
            <span style={{ color: C.accent, fontWeight: 700 }}>12%</span> for new clients…”
          </div>
        </div>
        <TextBar w="90%" mt={20} />
        <TextBar w="72%" />
      </DocPanel>
      {/* the critic's magnifying glass */}
      <div
        style={{
          position: "absolute", left: 640, top: 560,
          transform: `translate(${(1 - seg(t, 0.2, 0.4)) * 120}px, ${(1 - seg(t, 0.2, 0.4)) * -80}px) rotate(-8deg)`,
          opacity: seg(t, 0.2, 0.4),
        }}
      >
        <svg width="330" height="330" viewBox="0 0 330 330">
          <circle cx="140" cy="140" r="118" fill="#05070999" stroke={caught > 0 ? C.danger : C.accent} strokeWidth="10"
            style={{ filter: `drop-shadow(0 0 18px ${caught > 0 ? C.danger : C.accent})`, transition: "stroke 0.2s" }} />
          <circle cx="140" cy="140" r="104" fill="none" stroke={caught > 0 ? C.danger : C.accent} strokeWidth="2" opacity={0.4} />
          <line x1="222" y1="222" x2="300" y2="300" stroke={caught > 0 ? C.danger : C.accent} strokeWidth="22" strokeLinecap="round" />
        </svg>
        <div
          style={{
            position: "absolute", left: 0, top: 0, width: 280, height: 280,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: titleFont, fontWeight: 700, fontSize: 96,
            color: caught > 0 ? C.danger : C.text, textShadow: glow(caught > 0 ? C.danger : C.accent, 30),
          }}
        >
          21%
        </div>
      </div>
      {/* mismatch → CAUGHT */}
      <div style={{ position: "absolute", left: 830, top: 300, opacity: caught }}>
        <Stamp t={caught} text="CAUGHT" size={58} rot={-9} />
        <div style={{ fontFamily: bodyFont, fontSize: 26, color: C.muted, marginTop: 16, textAlign: "center" }}>
          quote ≠ source
        </div>
      </div>
      <Shockwave p={seg(t, 0.62, 0.9)} x={915} y={350} color={C.danger} r={150} />
      {/* engineer label */}
      <div style={{ position: "absolute", left: 1020, right: 60, top: 800, opacity: seg(t, 0.7, 0.9), display: "flex", gap: 16 }}>
        <Chip text="citation verification" color={C.dim} size={26} />
        <Chip text="round 2 / 3 — bounded" color={C.dim} size={26} />
      </div>
    </div>
  );
};

/* ==================== 7 · PROMISE 2: FUEL GAUGE ========================= */

export const Promise2Beat: React.FC<{ t: number }> = ({ t }) => {
  const slide = seg(t, 0.3, 0.52);
  const lock = seg(t, 0.6, 0.78);
  // budget bar geometry: cap $0.0060 over 1240 px; spent $0.0031 → 52%
  const BX = 340, BY = 430, BW = 1240;
  const spentW = BW * 0.52;
  const remW = BW * 0.48;
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      {/* the budget bar */}
      <div style={{ position: "absolute", left: BX, top: BY - 60, fontFamily: bodyFont, fontWeight: 600, fontSize: 30, color: C.text }}>
        Budget — <span style={{ fontFamily: monoFont, color: C.accent }}>$0.0060</span>
      </div>
      <div
        style={{
          position: "absolute", left: BX, top: BY, width: BW, height: 96,
          borderRadius: 20, border: `3px solid ${C.accent}`, overflow: "hidden",
          background: `${C.bg}`, boxShadow: `0 24px 60px #000000aa, ${glow(C.accent, 26)}`,
          opacity: seg(t, 0, 0.15),
        }}
      >
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: spentW, background: `linear-gradient(90deg, ${C.model}99, ${C.model}55)` }} />
        <div style={{ position: "absolute", left: spentW, top: 0, bottom: 0, width: remW, background: `repeating-linear-gradient(135deg, ${C.accent}22, ${C.accent}22 14px, transparent 14px, transparent 28px)` }} />
      </div>
      <div style={{ position: "absolute", left: BX, top: BY + 112, fontFamily: bodyFont, fontSize: 27, color: C.model }}>
        spent <span style={{ fontFamily: monoFont }}>$0.0031</span>
      </div>
      <div style={{ position: "absolute", left: BX + BW - 320, top: BY - 60, width: 320, textAlign: "right", fontFamily: bodyFont, fontSize: 27, color: C.accent, whiteSpace: "nowrap" }}>
        remaining <span style={{ fontFamily: monoFont }}>$0.0029</span>
      </div>
      {/* the next step: a block that cannot fit */}
      <div
        style={{
          position: "absolute", left: BX + spentW + 30 + (1 - slide) * 420, top: BY + 210,
          width: 380, height: 90, borderRadius: 18,
          border: `3px dashed ${lock > 0 ? C.danger : C.warn}`,
          background: `${lock > 0 ? C.danger : C.warn}14`,
          display: "flex", alignItems: "center", justifyContent: "center", gap: 16,
          opacity: seg(t, 0.22, 0.34),
        }}
      >
        <span style={{ fontFamily: bodyFont, fontWeight: 600, fontSize: 27, color: lock > 0 ? C.danger : C.warn }}>
          next step — worst case <span style={{ fontFamily: monoFont }}>$0.0191</span>
        </span>
      </div>
      {/* fit arrow: the block is 6× the remaining sliver */}
      <svg width="1560" height="90" style={{ position: "absolute", left: BX, top: BY + 300 }} opacity={seg(t, 0.5, 0.62)}>
        <line x1={spentW} y1="16" x2={spentW + remW} y2="16" stroke={C.accent} strokeWidth="3" />
        <line x1={spentW} y1="8" x2={spentW} y2="24" stroke={C.accent} strokeWidth="3" />
        <line x1={spentW + remW} y1="8" x2={spentW + remW} y2="24" stroke={C.accent} strokeWidth="3" />
        {/* what the next step needs — starts at the same point and overshoots the cap */}
        <line x1={spentW} y1="56" x2={spentW + remW + 300} y2="56" stroke={C.danger} strokeWidth="3" strokeDasharray="10 8" />
        <line x1={spentW} y1="48" x2={spentW} y2="64" stroke={C.danger} strokeWidth="3" />
        <line x1={spentW + remW + 300} y1="48" x2={spentW + remW + 300} y2="64" stroke={C.danger} strokeWidth="3" />
        {/* ✗ where it crosses the budget cap */}
        <line x1={spentW + remW - 13} y1="43" x2={spentW + remW + 13} y2="69" stroke={C.danger} strokeWidth="5" strokeLinecap="round" />
        <line x1={spentW + remW + 13} y1="43" x2={spentW + remW - 13} y2="69" stroke={C.danger} strokeWidth="5" strokeLinecap="round" />
      </svg>
      {/* the lock slams at the boundary */}
      <div
        style={{
          position: "absolute", left: BX + spentW - 70, top: BY - 80,
          width: 140, height: 140, borderRadius: 26,
          background: C.panel2, border: `4px solid ${C.accent}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: `0 20px 60px #000000dd, ${glow(C.accent, 44)}`,
          opacity: lock, transform: `scale(${1.5 - lock * 0.5})`,
        }}
      >
        <LockIcon size={72} color={C.accent} />
      </div>
      <div style={{ position: "absolute", left: BX + spentW - 140, top: BY + 82, opacity: lock }}>
        <span style={{ fontFamily: titleFont, fontWeight: 700, fontSize: 34, letterSpacing: 3, color: "#04211d", background: C.accent, borderRadius: 999, padding: "10px 26px", boxShadow: glow(C.accent, 30) }}>
          STOPPED
        </span>
      </div>
      <Shockwave p={seg(t, 0.68, 0.95)} x={BX + spentW} y={BY - 10} color={C.accent} r={170} />
      {/* engineer label */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 800, textAlign: "center", opacity: seg(t, 0.7, 0.9), display: "flex", justifyContent: "center", gap: 16 }}>
        <Chip text="checked before every AI call — code, not the model" color={C.dim} size={26} />
        <Chip text="then it asks you" color={C.human} size={26} />
      </div>
    </div>
  );
};

/* ==================== 8 · PROMISE 3: RECEIPT CHAIN ====================== */

const RECEIPTS = [
  { who: "gatekeeper", what: "brief accepted", hash: "#0566…c58" },
  { who: "team lead", what: "sent researcher", hash: "#75e3…092" },
  { who: "researcher", what: "26 sources", hash: "#8990…c57" },
  { who: "writer", what: "draft v1", hash: "#ae40…c1c" },
  { who: "critic", what: "verdict: revise", hash: "#9841…830" },
];

const Receipt: React.FC<{
  r: (typeof RECEIPTS)[number]; i: number; broken: number; p: number; edited?: boolean;
}> = ({ r, i, broken, p, edited }) => (
  <div
    style={{
      width: 270, height: 330, position: "relative",
      background: edited ? `${C.danger}12` : `linear-gradient(170deg, ${C.panel2}, ${C.panel})`,
      border: `3px solid ${broken > 0 ? C.danger : C.accent}${broken > 0 ? "" : "77"}`,
      borderRadius: 18,
      boxShadow: `0 26px 60px #000000cc`,
      padding: "30px 26px",
      opacity: p, transform: `translateY(${(1 - p) * 70}px)`,
      display: "flex", flexDirection: "column",
    }}
  >
    {/* wax seal */}
    <div
      style={{
        position: "absolute", top: -26, right: 18, width: 76, height: 76, borderRadius: 38,
        background: broken > 0 ? C.danger : C.accent,
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: `0 8px 26px ${broken > 0 ? C.danger : C.accent}66, inset 0 0 0 6px #00000033`,
        transform: `scale(${0.5 + Math.min(1, p) * 0.5})`,
      }}
    >
      <span style={{ fontFamily: monoFont, fontWeight: 700, fontSize: 36, color: "#04211d" }}>#</span>
    </div>
    <div style={{ fontFamily: monoFont, fontWeight: 600, fontSize: 22, color: broken > 0 ? C.danger : C.accent, letterSpacing: 2 }}>{r.who}</div>
    <div style={{ fontFamily: bodyFont, fontWeight: 600, fontSize: 27, color: C.text, marginTop: 12 }}>{r.what}</div>
    <div style={{ marginTop: "auto" }}>
      <TextBar w="86%" mt={0} />
      <TextBar w="70%" />
      <div style={{ fontFamily: monoFont, fontSize: 24, color: broken > 0 ? C.danger : C.muted, marginTop: 20 }}>{r.hash}</div>
    </div>
    {edited && (
      <div style={{ position: "absolute", left: 16, right: 16, top: 130, fontFamily: monoFont, fontWeight: 700, fontSize: 24, color: C.danger, border: `2px dashed ${C.danger}`, borderRadius: 10, padding: "8px 14px", textAlign: "center", opacity: broken }}>
        edited ↺
      </div>
    )}
  </div>
);

export const Promise3Beat: React.FC<{ t: number }> = ({ t }) => {
  const broken = seg(t, 0.5, 0.7);
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 300, display: "flex", justifyContent: "center", gap: 26 }}>
        {RECEIPTS.map((r, i) => {
          const p = seg(t, 0.05 + i * 0.09, 0.2 + i * 0.09);
          const isBroken = broken > 0 && i >= 3;
          return (
            <React.Fragment key={r.who}>
              <Receipt r={r} i={i} p={p} broken={isBroken ? broken : 0} edited={i === 3} />
              {i < RECEIPTS.length - 1 && (
                <div style={{ display: "flex", alignItems: "center" }}>
                  <svg width="34" height="90" viewBox="0 0 34 90" opacity={Math.min(p, seg(t, 0.1 + i * 0.09, 0.26 + i * 0.09))}>
                    <ellipse cx="17" cy="24" rx="9" ry="14" fill="none" stroke={isBroken ? C.danger : C.accent} strokeWidth="4" />
                    <ellipse cx="17" cy="48" rx="9" ry="14" fill="none" stroke={isBroken ? C.danger : C.accent} strokeWidth="4" transform="rotate(90 17 48)" />
                    <ellipse cx="17" cy="72" rx="9" ry="14" fill="none" stroke={isBroken ? C.danger : C.accent} strokeWidth="4" />
                  </svg>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
      {/* crack through the edited receipt onward */}
      <svg width="1920" height="1080" style={{ position: "absolute", inset: 0 }} opacity={broken}>
        <path d="M1210 300 L1240 380 L1218 430 L1252 500 L1230 570 L1260 640" stroke={C.danger} strokeWidth="6" fill="none" style={{ filter: `drop-shadow(0 0 12px ${C.danger})` }} />
        <path d="M1540 320 L1570 400 L1548 460 L1580 540 L1556 610" stroke={C.danger} strokeWidth="5" fill="none" opacity={0.8} style={{ filter: `drop-shadow(0 0 10px ${C.danger})` }} />
      </svg>
      <div style={{ position: "absolute", left: 1310, top: 190, opacity: broken }}>
        <Stamp t={broken} text="VERIFIED: FALSE" size={46} rot={6} />
      </div>
      <Shockwave p={seg(t, 0.55, 0.85)} x={1230} y={460} color={C.danger} r={150} />
      {/* engineer label */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 800, textAlign: "center", opacity: seg(t, 0.75, 0.95), display: "flex", justifyContent: "center", gap: 16 }}>
        <Chip text="SHA-256 chain" color={C.dim} size={26} />
        <Chip text="tamper-evident · re-verifiable" color={C.dim} size={26} />
      </div>
    </div>
  );
};

/* ======================== 9 · BUILT BY ================================== */

const VERBS = [
  { text: "DESIGNED", x: 480 },
  { text: "BUILT", x: 810 },
  { text: "MEASURED", x: 1150 },
];

export const BuiltByBeat: React.FC<{ t: number }> = ({ t }) => (
  <div style={{ position: "absolute", inset: 0 }}>
    {/* three stamps, one per verb */}
    {VERBS.map((v, i) => (
      <div key={v.text} style={{ position: "absolute", left: v.x, top: 250, opacity: seg(t, 0.05 + i * 0.12, 0.2 + i * 0.12) }}>
        <Stamp t={seg(t, 0.05 + i * 0.12, 0.24 + i * 0.12)} text={v.text} size={40} rot={i === 1 ? 3 : -4} color={i === 2 ? C.accent : C.text} />
      </div>
    ))}
    {/* the name, drawn by light */}
    <div
      style={{
        position: "absolute", left: 0, right: 0, top: 400, textAlign: "center",
        fontFamily: titleFont, fontWeight: 700, fontSize: 150, color: C.text,
        textShadow: `0 0 60px ${C.accent}33`,
        opacity: seg(t, 0.3, 0.55), transform: `scale(${1.04 - seg(t, 0.3, 0.6) * 0.04})`,
        letterSpacing: 2,
      }}
    >
      Kaarsten Anderson
    </div>
    {/* light trail under the name */}
    <svg width="1920" height="200" style={{ position: "absolute", left: 0, top: 590 }}>
      <path
        d="M500 60 C 700 90, 1200 90, 1420 55" pathLength={1}
        stroke={C.accent} strokeWidth="5" fill="none"
        strokeDasharray="1" strokeDashoffset={1 - seg(t, 0.45, 0.8)}
        style={{ filter: `drop-shadow(0 0 12px ${C.accent})` }}
      />
      {seg(t, 0.45, 0.8) > 0.98 && <circle cx="1420" cy="55" r="10" fill={C.accent} style={{ filter: `drop-shadow(0 0 14px ${C.accent})` }} />}
    </svg>
    <div
      style={{
        position: "absolute", left: 0, right: 0, top: 700, textAlign: "center",
        fontFamily: titleFont, fontWeight: 500, fontSize: 48, color: C.accent,
        letterSpacing: 6, opacity: seg(t, 0.65, 0.85),
      }}
    >
      AGENTIC AI DEVELOPER
    </div>
    <LensFlare x={960} y={545} p={seg(t, 0.5, 0.7)} />
  </div>
);

/* ================== 10 · FINALE: TEAM CONSTELLATION ===================== */

const DOMAINS = [
  { label: "legal review", specialist: "Contract Analyst", x: 60, y: 230, s: 0.62, d: 0.35 },
  { label: "financial due diligence", specialist: "Risk Analyst", x: 1330, y: 230, s: 0.62, d: 0.5 },
  { label: "market intelligence", specialist: "Market Analyst", x: 690, y: 175, s: 0.46, d: 0.65 },
];

const MiniCard: React.FC<{ Icon: React.FC<{ size?: number; color?: string }>; name: string; color?: string }> = ({ Icon, name, color = C.model }) => (
  <div
    style={{
      width: 132, height: 170, background: `${C.panel}`,
      border: `2px solid ${color}99`, borderRadius: 14,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12,
      boxShadow: `0 16px 40px #000000aa, ${glow(color, 16)}`,
    }}
  >
    <Icon size={52} color={color} />
    <span style={{ fontFamily: titleFont, fontWeight: 700, fontSize: 19, color: C.text, textAlign: "center", lineHeight: 1.15, padding: "0 6px" }}>{name}</span>
  </div>
);

const Formation: React.FC<{
  label: string; specialist: string; p: number;
}> = ({ label, specialist, p }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18, opacity: p, transform: `scale(${0.8 + p * 0.2})` }}>
    <div style={{ display: "flex", gap: 14 }}>
      <MiniCard Icon={SearchIcon} name="Researcher" />
      <MiniCard Icon={specialist === "Contract Analyst" ? PenIcon : specialist === "Risk Analyst" ? ScaleIcon : ChartIcon} name={specialist} color={C.accent} />
      <MiniCard Icon={PenIcon} name="Writer" />
    </div>
    <Chip text={label} color={C.accent} size={26} />
  </div>
);

export const ConstellationBeat: React.FC<{ t: number }> = ({ t }) => (
  <div style={{ position: "absolute", inset: 0 }}>
    {/* light threads linking the formations */}
    <svg width="1920" height="1080" style={{ position: "absolute", inset: 0 }}>
      {[
        "M760 570 C 640 480, 480 430, 360 400",
        "M1020 570 C 1180 480, 1360 440, 1500 410",
        "M880 560 C 860 470, 850 380, 840 300",
      ].map((dd, i) => (
        <path key={i} d={dd} pathLength={1} stroke={C.accent} strokeWidth="3" fill="none" opacity={0.5}
          strokeDasharray="1" strokeDashoffset={1 - seg(t, 0.3 + i * 0.12, 0.55 + i * 0.12)}
          style={{ filter: `drop-shadow(0 0 6px ${C.accent})` }} />
      ))}
    </svg>
    {/* the teams your field needs — igniting behind ours */}
    {DOMAINS.map((d) => (
      <div key={d.label} style={{ position: "absolute", left: d.x, top: d.y, transform: `scale(${d.s})`, transformOrigin: "0 0" }}>
        <Formation label={d.label} specialist={d.specialist} p={seg(t, d.d, d.d + 0.25)} />
      </div>
    ))}
    {/* our formation — closest, already lit */}
    <div style={{ position: "absolute", left: 560, top: 540 }}>
      <Formation label="vendor assessment — your brief" specialist="Compliance" p={seg(t, 0, 0.2)} />
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 800, textAlign: "center", opacity: seg(t, 0.8, 0.95), display: "flex", justifyContent: "center", gap: 16 }}>
      <Chip text="new specialist = one class + one registry line" color={C.dim} size={26} />
      <Chip text="example teams — adapted on request" color={C.human} size={26} />
    </div>
  </div>
);
