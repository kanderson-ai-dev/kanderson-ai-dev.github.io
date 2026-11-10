/** Option B scene objects — vault, arena, chain, columns, scorecard, rail,
 *  iteration ring, end plate. All are DOM standees mounted inside <Stand>. */
import React from "react";
import { T, fonts, glow, tglow, rand, clamp01, lerp } from "../theme";
import { Tag } from "./CamWorldB";

const seg = (f: number, a: number, d: number) => clamp01((f - a) / d);
const segO = (f: number, a: number, d: number) => {
  const t = seg(f, a, d);
  return t * t * (3 - 2 * t);
};

const panel: React.CSSProperties = {
  background: `linear-gradient(165deg, ${T.panel2}f2, ${T.panel}f2)`,
  border: `2px solid ${T.line}aa`,
  borderRadius: 18,
  boxShadow: "0 24px 70px #00000088, inset 0 0 40px #02060c66",
  fontFamily: fonts.mono,
};

/* ------------------------------- vault ------------------------------------ */

export const VaultB: React.FC<{ lit?: number }> = ({ lit = 1 }) => (
  <div style={{ ...panel, width: 330, padding: "26px 30px", borderColor: `${T.model}88` }}>
    <div style={{ fontSize: 17, letterSpacing: 4, color: T.muted, marginBottom: 14 }}>READ-ONLY VAULT</div>
    <div style={{ display: "flex", gap: 14, alignItems: "center", opacity: lit }}>
      <svg width={86} height={86} viewBox="0 0 86 86">
        <rect x={6} y={6} width={74} height={74} rx={12} fill="#14102e" stroke={T.model} strokeWidth={3} />
        <circle cx={43} cy={43} r={20} fill="none" stroke={T.model} strokeWidth={4} />
        <circle cx={43} cy={43} r={7} fill={T.model} />
        {[0, 60, 120, 180, 240, 300].map((a) => (
          <rect key={a} x={41} y={27} width={4} height={10} rx={2} fill={T.model} transform={`rotate(${a} 43 43)`} />
        ))}
      </svg>
      <div style={{ fontSize: 15, color: T.text, lineHeight: 1.55 }}>
        database ×2 read-only<br />
        <span style={{ color: T.model }}>sql · fs jailed</span>
      </div>
    </div>
  </div>
);

/* ------------------------------ hash chain --------------------------------- */

export const ChainB: React.FC<{ n?: number; lit?: number; tamper?: number }> = ({ n = 8, lit = 7, tamper = -1 }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
    {Array.from({ length: n }, (_, i) => {
      const bad = i === tamper;
      const c = bad ? T.danger : T.code;
      return (
        <React.Fragment key={i}>
          {i > 0 && <div style={{ width: 26, height: 5, background: c, boxShadow: glow(c, 8), opacity: i <= lit ? 0.9 : 0.2 }} />}
          <div
            style={{
              width: 92,
              padding: "12px 10px",
              textAlign: "center",
              borderRadius: 12,
              border: `2px solid ${c}`,
              background: bad ? "#2a0d16" : "#06231e",
              boxShadow: glow(c, bad ? 30 : 14),
              opacity: i <= lit ? 1 : 0.25,
            }}
          >
            <div style={{ fontFamily: fonts.mono, fontSize: 15, fontWeight: 700, color: c }}>h{String(i + 1).padStart(2, "0")}</div>
            <div style={{ fontFamily: fonts.mono, fontSize: 12, color: bad ? "#ffb9c4" : T.muted, marginTop: 3 }}>
              {bad ? "tamper" : `…${(rand(i * 7) * 0xffff).toString(16).slice(0, 4)}`}
            </div>
          </div>
        </React.Fragment>
      );
    })}
  </div>
);

/* ------------------------------- columns ----------------------------------- */

export const ColumnB: React.FC<{ name: string; verb: string; sub: string; color: string; lit?: number; icon: "brain" | "code" | "pen" }> = ({
  name, verb, sub, color, lit = 1, icon,
}) => (
  <div style={{ ...panel, width: 240, padding: "24px 20px", textAlign: "center", borderColor: `${color}88`, opacity: lit }}>
    <svg width={62} height={62} viewBox="0 0 62 62" style={{ marginBottom: 12 }}>
      {icon === "brain" && (
        <>
          <circle cx={31} cy={28} r={17} fill="none" stroke={color} strokeWidth={3} />
          <path d="M18 52 Q31 40 44 52" stroke={color} strokeWidth={3} fill="none" />
          <circle cx={25} cy={24} r={3} fill={color} />
          <circle cx={37} cy={24} r={3} fill={color} />
        </>
      )}
      {icon === "code" && (
        <>
          <rect x={8} y={12} width={46} height={38} rx={7} fill="none" stroke={color} strokeWidth={3} />
          <path d="M24 22 L16 31 L24 40 M38 22 L46 31 L38 40" stroke={color} strokeWidth={3.5} fill="none" strokeLinecap="round" />
        </>
      )}
      {icon === "pen" && (
        <>
          <rect x={10} y={12} width={42} height={40} rx={7} fill="none" stroke={color} strokeWidth={3} />
          <path d="M20 42 L38 24 L43 29 L25 47 L19 48 Z" fill="none" stroke={color} strokeWidth={3} strokeLinejoin="round" />
          <path d="M18 33 L30 33" stroke={color} strokeWidth={2.5} />
        </>
      )}
    </svg>
    <div style={{ fontFamily: fonts.mono, fontSize: 21, fontWeight: 700, letterSpacing: 3, color, textShadow: tglow(color) }}>{name}</div>
    <div style={{ fontFamily: fonts.title, fontSize: 19, fontWeight: 700, color: T.text, marginTop: 8 }}>{verb}</div>
    <div style={{ fontFamily: fonts.mono, fontSize: 13.5, color: T.muted, marginTop: 6, lineHeight: 1.5 }}>{sub}</div>
  </div>
);

/* ------------------------------- scorecard --------------------------------- */

export const ScorecardB: React.FC<{ rows?: number; honest?: boolean }> = ({ rows = 6, honest = true }) => {
  const data = [
    ["task score", "4.79 / 5", 0.96],
    ["grounding", "4.83 / 5", 0.97],
    ["tool usage", "4.88 / 5", 0.98],
    ["adversarial", "13 / 13", 1],
    ["citations", "100 %", 1],
    ["avg cost / run", "$0.00039", 0.62],
  ] as const;
  return (
    <div style={{ ...panel, width: 560, padding: "30px 38px", borderColor: `${T.code}99` }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 18 }}>
        <span style={{ fontSize: 18, letterSpacing: 4, color: T.muted }}>LIVE SCORECARD · dataset v1.2.0 · 24 q</span>
        <span style={{ fontSize: 15, color: T.code }}>graded by a different model</span>
      </div>
      {data.slice(0, rows).map(([k, v, w], i) => (
        <div key={k} style={{ display: "grid", gridTemplateColumns: "150px 1fr 110px", alignItems: "center", gap: 14, margin: "11px 0", opacity: seg(60 + i * 14, 0, 14) || 1 }}>
          <span style={{ fontSize: 15.5, color: T.muted }}>{k}</span>
          <div style={{ height: 10, borderRadius: 6, background: "#0a1420", overflow: "hidden" }}>
            <div style={{ width: `${w * 100}%`, height: "100%", borderRadius: 6, background: `linear-gradient(90deg, ${T.code}66, ${T.code})`, boxShadow: glow(T.code, 10) }} />
          </div>
          <span style={{ fontSize: 18, fontWeight: 700, color: i < 3 ? T.code : T.text, textAlign: "right" }}>{v}</span>
        </div>
      ))}
      {honest && (
        <div style={{ marginTop: 18, paddingTop: 14, borderTop: `1.5px dashed ${T.danger}66`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 14.5, color: T.danger }}>first run failed — 3.58 → fixed through the same gate</span>
          <span style={{ fontSize: 14.5, color: T.muted }}>not edited. re-measured.</span>
        </div>
      )}
    </div>
  );
};

/* --------------------------------- CI rail ---------------------------------- */

export const RailB: React.FC<{ lit?: number; count?: number }> = ({ lit = 6, count = 517 }) => {
  const stages = ["lint", "types", "unit", "integration", "e2e", "coverage"];
  return (
    <div style={{ ...panel, padding: "26px 34px", borderColor: `${T.code}88` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
        <span style={{ fontSize: 16, letterSpacing: 3, color: T.muted }}>CI · ZERO SECRETS</span>
        <span style={{ marginLeft: "auto", fontSize: 26, fontWeight: 700, color: T.code, textShadow: tglow(T.code) }}>{count} backend tests</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {stages.map((s, i) => (
          <React.Fragment key={s}>
            {i > 0 && <div style={{ width: 30, height: 4, background: i < lit ? T.code : "#1a2f45", borderRadius: 2, boxShadow: i < lit ? glow(T.code, 8) : undefined }} />}
            <div
              style={{
                padding: "12px 16px",
                borderRadius: 11,
                border: `2px solid ${i < lit ? T.code : "#1a2f45"}`,
                background: i < lit ? "#06231e" : "#0a1420",
                fontFamily: fonts.mono,
                fontSize: 15,
                fontWeight: 700,
                color: i < lit ? T.code : T.dim,
                boxShadow: i < lit ? glow(T.code, 12) : undefined,
              }}
            >
              {i < lit ? "✓ " : ""}
              {s}
            </div>
          </React.Fragment>
        ))}
      </div>
      <div style={{ marginTop: 16, fontSize: 14, color: T.muted }}>
        strict typing · <span style={{ color: T.code }}>92.98 %</span> branch coverage · 54 e2e
      </div>
    </div>
  );
};

/* ------------------------------ arena (registry) ---------------------------- */

export const ArenaB: React.FC<{ a: number; b: number; stamped?: number; override?: number }> = ({ a, b, stamped = 0, override = 0 }) => (
  <div style={{ ...panel, width: 600, padding: "26px 34px", borderColor: `${T.model}88`, position: "relative", overflow: "hidden" }}>
    <div style={{ fontSize: 16, letterSpacing: 3, color: T.muted, marginBottom: 16 }}>PROMPT REGISTRY · live A/B gate · tolerance 0.1</div>
    {(["v2 → candidate", "v3 → promoted", "v4 → promoted"] as const).map((name, i) => {
      const w = [a, b, Math.max(a, b)][i];
      const dead = i === 0 && stamped > 0;
      const col = dead ? T.danger : i === 1 ? T.code : T.model;
      return (
        <div key={name} style={{ display: "grid", gridTemplateColumns: "140px 1fr", alignItems: "center", gap: 14, margin: "13px 0", opacity: dead ? 0.55 : 1 }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: col, textDecoration: dead ? "line-through" : "none" }}>{name}</span>
          <div style={{ height: 26, borderRadius: 8, background: "#0a1420", border: `1.5px solid ${col}44`, overflow: "hidden", position: "relative" }}>
            <div style={{ width: `${w * 100}%`, height: "100%", borderRadius: 7, background: `linear-gradient(90deg, ${col}55, ${col})`, boxShadow: glow(col, 12), transition: "none" }} />
          </div>
        </div>
      );
    })}
    {stamped > 0 && (
      <div style={{ position: "absolute", left: 190, top: 74, transform: `rotate(-9deg) scale(${0.6 + stamped * 0.4})`, opacity: stamped }}>
        <span style={{ fontFamily: fonts.mono, fontSize: 26, fontWeight: 800, letterSpacing: 3, color: T.danger, border: `4px solid ${T.danger}`, borderRadius: 10, padding: "4px 18px", background: "#2a0d16d0", boxShadow: glow(T.danger, 26) }}>BLOCKED</span>
      </div>
    )}
    {override > 0 && (
      <div style={{ position: "absolute", right: 30, bottom: 24, opacity: override }}>
        <Tag color={T.human} size={15} bold>judge rubric v2 · override · reason logged</Tag>
      </div>
    )}
  </div>
);

/* ------------------------------ iteration ring ------------------------------ */

export const IterRingB: React.FC<{ n: number; max?: number; done?: string }> = ({ n, max = 8, done }) => {
  const R = 120;
  return (
    <div style={{ ...panel, padding: "26px 30px", textAlign: "center", borderColor: `${T.human}77` }}>
      <div style={{ fontSize: 15, letterSpacing: 3, color: T.muted, marginBottom: 12 }}>BOUNDED RUN · max {max} iterations</div>
      <svg width={280} height={200} viewBox="0 0 280 200">
        {Array.from({ length: max }, (_, i) => {
          const a = -Math.PI / 2 + (i / max) * Math.PI * 2;
          const lit = i < n;
          const c = lit ? T.human : "#1a2f45";
          return (
            <g key={i} transform={`translate(140 100) rotate(${(i / max) * 360})`}>
              <rect x={-11} y={-R + 20} width={22} height={34} rx={6} fill={lit ? "#2a2013" : "#0a1420"} stroke={c} strokeWidth={2.5} style={{ filter: lit ? `drop-shadow(0 0 8px ${T.human})` : undefined }} />
              <text x={0} y={-R + 42} textAnchor="middle" fill={lit ? T.human : T.dim} fontSize={15} fontFamily={fonts.mono} fontWeight={700} transform={`rotate(${-(i / max) * 360})`}>
                {i + 1}
              </text>
            </g>
          );
        })}
        <text x={140} y={94} textAnchor="middle" fill={T.text} fontSize={44} fontFamily={fonts.mono} fontWeight={800}>
          {n}/{max}
        </text>
        <text x={140} y={126} textAnchor="middle" fill={done ? T.code : T.muted} fontSize={17} fontFamily={fonts.mono} fontWeight={700}>
          {done ?? "running…"}
        </text>
      </svg>
    </div>
  );
};

/* --------------------------------- end plate -------------------------------- */

export const EndCardB: React.FC<{ lit?: number }> = ({ lit = 1 }) => (
  <div style={{ ...panel, width: 720, padding: "44px 60px", textAlign: "center", borderColor: `${T.code}aa`, opacity: lit, boxShadow: `0 30px 90px #000000aa, 0 0 90px ${T.code}22, inset 0 0 40px #02060c66` }}>
    <div style={{ fontFamily: fonts.mono, fontSize: 19, letterSpacing: 5, color: T.muted, marginBottom: 20 }}>NEED AGENTS YOU CAN TRUST IN PRODUCTION?</div>
    <div style={{ fontFamily: fonts.title, fontSize: 66, fontWeight: 700, color: T.text, letterSpacing: -0.5 }}>
      kaarsten<span style={{ color: T.code, textShadow: tglow(T.code, 40) }}>anderson</span>.com
    </div>
    <div style={{ marginTop: 24, display: "flex", gap: 16, justifyContent: "center" }}>
      <Tag color={T.code} size={17} bold>MCP Agent Toolkit</Tag>
      <Tag color={T.model} size={17}>agentic AI developer</Tag>
      <Tag color={T.human} size={17}>open to work</Tag>
    </div>
  </div>
);
