/**
 * heroes2c — remaining hero beats for the orchestrator rebuild:
 * brief+shield, model/code/human control, proof counters, real-product
 * montage and the CTA end card. Grammar matches heroes2/heroes2b.
 */
import React from "react";
import { C, bodyFont, monoFont, titleFont } from "../upgrade/utheme";
import { Chip } from "../upgrade/primitives";
import { CheckSvgIcon } from "../mcptoolkit3/icons3";
import { DocIcon, PersonIcon, ScaleIcon, SparkIcon } from "./oicons";
import { ease, glow, LensFlare, seg, Shockwave, Stamp } from "./fx";

/* ================== 4 · BRIEF + SHIELD ================================= */

const BriefCard: React.FC<{ p: number }> = ({ p }) => (
  <div
    style={{
      position: "absolute", left: 180, top: 300, width: 560,
      background: C.panel, border: `2.5px solid ${C.accent}77`, borderRadius: 22,
      boxShadow: `0 26px 60px #000000cc, ${glow(C.accent, 30)}`,
      padding: "34px 38px",
      transform: `translateY(${(1 - p) * 90}px)`, opacity: p,
    }}
  >
    <div style={{ fontFamily: monoFont, fontSize: 22, letterSpacing: 3, color: C.muted }}>YOUR BRIEF</div>
    <div style={{ fontFamily: titleFont, fontWeight: 700, fontSize: 36, color: C.text, marginTop: 12 }}>
      Vendor assessment — Quentell vs Norvane
    </div>
    <div style={{ marginTop: 22, display: "flex", gap: 14 }}>
      <Chip text="budget $0.0060" size={22} />
      <Chip text="tone: executive" size={22} />
    </div>
  </div>
);

const Shield: React.FC<{ hit: number }> = ({ hit }) => (
  <svg
    width="340" height="400" viewBox="0 0 100 118"
    style={{
      position: "absolute", left: 1050, top: 260,
      filter: `drop-shadow(0 0 ${18 + hit * 26}px ${C.accent})`,
    }}
  >
    <path
      d="M50 6 L92 22 V58 C92 88 74 106 50 112 C26 106 8 88 8 58 V22 Z"
      fill={`${C.accent}14`} stroke={C.accent} strokeWidth="3.5"
    />
    <path d="M50 22 L78 32 V58 C78 78 66 92 50 98 C34 92 22 78 22 58 V32 Z"
      fill="none" stroke={`${C.accent}88`} strokeWidth="2" />
    <path d="M36 58 l10 10 l20 -22" fill="none" stroke={C.accent} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const HostileCard: React.FC<{ p: number; shatter: number }> = ({ p, shatter }) => {
  // one solid hostile card flies in and smashes on the shield face;
  // it only breaks into shards on impact
  const x = 1920 - p * (1920 - 1300);
  const shards = [
    { dx: -70, dy: -80, r: -24 }, { dx: 60, dy: -60, r: 18 },
    { dx: -40, dy: 70, r: 30 }, { dx: 80, dy: 60, r: -16 },
    { dx: 0, dy: -20, r: 8 },
  ];
  return (
    <>
      <div
        style={{
          position: "absolute", left: x, top: 425, width: 240, height: 112,
          background: "#3a1020", border: `2.5px solid ${C.danger}`, borderRadius: 12,
          opacity: Math.max(0, Math.min(1, p * 3) - shatter * 4),
          boxShadow: `0 0 24px ${C.danger}66`,
        }}
      >
        <div style={{ fontFamily: monoFont, fontSize: 20, color: C.danger, padding: "18px 20px 6px", letterSpacing: 1 }}>
          hostile brief
        </div>
        <div style={{ fontFamily: monoFont, fontSize: 16, color: "#d98a96", padding: "0 20px", letterSpacing: 1 }}>
          ignore all rules…
        </div>
      </div>
      {shatter > 0 && shards.map((s, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: x + 55 + shatter * s.dx,
            top: 440 + shatter * s.dy,
            width: 120 - i * 14, height: 70 - i * 6,
            background: "#3a1020", border: `2.5px solid ${C.danger}`,
            borderRadius: 10, opacity: 1 - shatter,
            transform: `rotate(${shatter * s.r}deg)`,
            boxShadow: `0 0 20px ${C.danger}55`,
          }}
        >
          <div style={{ fontFamily: monoFont, fontSize: 18, color: C.danger, padding: "14px 16px", letterSpacing: 1 }}>
            {i === 0 ? "hostile" : i === 1 ? "rules…" : ""}
          </div>
        </div>
      ))}
    </>
  );
};

export const BriefBeat: React.FC<{ t: number }> = ({ t }) => {
  const card = seg(t, 0, 0.14);
  const fly = seg(t, 0.3, 0.55);
  const hit = seg(t, 0.55, 0.66);
  const shatter = seg(t, 0.58, 0.78);
  const zero = seg(t, 0.66, 0.8);
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <BriefCard p={card} />
      <HostileCard p={fly} shatter={shatter} />
      <Shield hit={hit} />
      <Shockwave p={hit} x={1205} y={460} color={C.accent} count={14} r={130} />
      {/* the price of a blocked attack */}
      <div
        style={{
          position: "absolute", left: 1090, top: 615, textAlign: "center",
          fontFamily: titleFont, fontWeight: 700, fontSize: 92, color: C.accent,
          textShadow: glow(C.accent, 24), opacity: zero,
          transform: `scale(${0.8 + zero * 0.2})`,
        }}
      >
        $0.00
        <div style={{ fontFamily: bodyFont, fontWeight: 600, fontSize: 26, color: C.dim, marginTop: 4 }}>
          spent on the attack
        </div>
      </div>
      <div
        style={{
          position: "absolute", left: 260, top: 640, opacity: seg(t, 0.75, 0.9),
          display: "flex", alignItems: "center", gap: 14,
          fontFamily: titleFont, fontWeight: 700, fontSize: 34, color: C.accent,
        }}
      >
        <CheckSvgIcon size={40} color={C.accent} sw={2.4} /> screened — the brief goes in
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 240, textAlign: "center" }}>
        <Chip text="attacks stopped at the door — 8/8 in the live gate" />
      </div>
    </div>
  );
};

/* ================== 10 · MODEL / CODE / HUMAN ========================== */

const Lane: React.FC<{
  x: number; w: number; color: string; title: string; items: string[]; p: number;
}> = ({ x, w, color, title, items, p }) => (
  <div
    style={{
      position: "absolute", left: x, top: 260, width: w, minHeight: 560,
      background: `linear-gradient(180deg, ${color}12, ${C.panel})`,
      border: `2.5px solid ${color}88`, borderRadius: 24,
      padding: "40px 36px", opacity: p,
      transform: `translateY(${(1 - p) * 60}px)`,
      boxShadow: `0 24px 50px #000000bb`,
    }}
  >
    <div
      style={{
        fontFamily: monoFont, fontSize: 24, letterSpacing: 4, color,
        borderBottom: `2px solid ${color}44`, paddingBottom: 18,
      }}
    >
      {title}
    </div>
    {items.map((it, i) => (
      <div
        key={it}
        style={{
          marginTop: 26, display: "flex", gap: 16, alignItems: "center",
          fontFamily: bodyFont, fontWeight: 600, fontSize: 30, color: C.text,
          opacity: ease(Math.min(1, Math.max(0, (p - i * 0.18) / 0.25))),
        }}
      >
        <div style={{ width: 12, height: 12, borderRadius: 6, background: color, boxShadow: glow(color, 10) }} />
        {it}
      </div>
    ))}
  </div>
);

export const ControlBeat: React.FC<{ t: number }> = ({ t }) => (
  <div style={{ position: "absolute", inset: 0 }}>
    <Lane x={130} w={520} color={C.model} title="THE MODEL" p={seg(t, 0.05, 0.2)}
      items={["thinks", "routes", "drafts", "reviews"]} />
    <Lane x={700} w={520} color={C.accent} title="THE CODE" p={seg(t, 0.25, 0.4)}
      items={["screens input", "enforces budget", "seals the record"]} />
    <Lane x={1270} w={520} color={C.human} title="YOU" p={seg(t, 0.45, 0.6)}
      items={["fund or stop", "edit or approve", "make the final call"]} />
  </div>
);

/* ================== 11 · PROOF ========================================= */

const BigStat: React.FC<{
  x: number; y: number; w: number; v: string; l: string; gate: string;
  color?: string; p: number; fs?: number;
}> = ({ x, y, w, v, l, gate, color = C.accent, p, fs = 104 }) => (
  <div
    style={{
      position: "absolute", left: x, top: y, width: w, textAlign: "center",
      opacity: p, transform: `translateY(${(1 - p) * 40}px) scale(${0.92 + p * 0.08})`,
    }}
  >
    <div style={{ fontFamily: titleFont, fontWeight: 800, fontSize: fs, color, textShadow: glow(color, 26), letterSpacing: -2 }}>
      {v}
    </div>
    <div style={{ fontFamily: bodyFont, fontWeight: 700, fontSize: 30, color: C.text, marginTop: 6 }}>{l}</div>
    <div style={{ marginTop: 14 }}>
      <Chip text={gate} />
    </div>
  </div>
);

export const ProofBeat: React.FC<{ t: number }> = ({ t }) => (
  <div style={{ position: "absolute", inset: 0 }}>
    <div
      style={{
        position: "absolute", left: 0, right: 0, top: 150, textAlign: "center",
        fontFamily: bodyFont, fontSize: 28, color: C.dim, opacity: seg(t, 0.72, 0.85),
      }}
    >
      plus the offline floor: 572 tests · 92% coverage · strict typing
    </div>
    <BigStat x={150} y={270} w={700} v="22" l="briefs it had never seen — live AI, live web" gate="held-out gate · 2026-10-27" p={seg(t, 0.02, 0.15)} fs={150} />
    <BigStat x={950} y={270} w={700} v="2×" l="every quality bar cleared, twice" gate="citation 1.000 / 0.929 — gate ≥0.90" p={seg(t, 0.2, 0.33)} fs={150} />
    <BigStat x={150} y={580} w={700} v="8/8" l="attacks blocked — $0.00 spent" gate="must-block payloads · live" color={C.danger} p={seg(t, 0.38, 0.51)} fs={120} />
    <BigStat x={950} y={580} w={700} v="≈$0.01" l="a full report — cap enforced in code" gate="$0.0092 / $0.011 — gate ≤$0.08" p={seg(t, 0.56, 0.69)} fs={120} />
  </div>
);

/* ================== 11b · PROMPT REGISTRY ============================= */
/* Every prompt is a versioned artifact. A new version only ships when it
   beats the running one on the golden dataset — writer v2 regressed
   (citation 0.79 < 0.85), so v1 stayed promoted. */

const RegRow: React.FC<{
  v: string; state: "live" | "candidate" | "archived"; detail: string; p: number;
  hideBadge?: boolean;
}> = ({ v, state, detail, p, hideBadge }) => {
  const col = state === "live" ? C.accent : state === "candidate" ? C.warn : C.muted;
  return (
    <div
      style={{
        display: "flex", alignItems: "center", gap: 20, padding: "16px 22px",
        marginTop: 16, border: `1.5px solid ${col}55`, borderRadius: 12,
        background: `${col}0a`, opacity: p,
        transform: `translateX(${(1 - p) * 60}px)`,
      }}
    >
      <span style={{ fontFamily: monoFont, fontWeight: 700, fontSize: 26, color: col, width: 60 }}>{v}</span>
      <span style={{ fontFamily: monoFont, fontSize: 19, color: state === "archived" ? C.muted : C.text, flex: 1 }}>{detail}</span>
      {!hideBadge && (
        <span
          style={{
            fontFamily: monoFont, fontSize: 16, color: col,
            border: `1px solid ${col}`, borderRadius: 6, padding: "4px 12px",
          }}
        >
          {state === "live" ? "● LIVE" : state === "candidate" ? "evaluating…" : "archived"}
        </span>
      )}
    </div>
  );
};

export const RegistryBeat: React.FC<{ t: number }> = ({ t }) => {
  const evalP = seg(t, 0.42, 0.6);       // bars animate
  const blockP = seg(t, 0.6, 0.72);      // BLOCKED stamp slams
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <div
        style={{
          position: "absolute", left: 330, top: 235, width: 1260,
          background: "#0a1014", border: `2px solid ${C.accent}55`, borderRadius: 16,
          boxShadow: `0 34px 80px #000000e0, ${glow(C.accent, 18)}`,
          opacity: seg(t, 0.0, 0.12), transform: `translateY(${(1 - seg(t, 0.0, 0.12)) * 60}px)`,
        }}
      >
        <div
          style={{
            display: "flex", alignItems: "center", gap: 10, padding: "14px 20px",
            borderBottom: `1.5px solid ${C.muted}33`, background: "#0d1418",
          }}
        >
          <div style={{ width: 10, height: 10, borderRadius: 5, background: C.danger }} />
          <div style={{ width: 10, height: 10, borderRadius: 5, background: C.warn }} />
          <div style={{ width: 10, height: 10, borderRadius: 5, background: C.accent }} />
          <div style={{ fontFamily: monoFont, fontSize: 18, color: C.dim, marginLeft: 10 }}>
            prompt registry — writer.prompt
          </div>
        </div>
        <div style={{ padding: "8px 26px 26px" }}>
          <RegRow v="v0" state="archived" detail="citation 0.71 — superseded" p={seg(t, 0.08, 0.2)} />
          <RegRow v="v1" state="live" detail="citation 0.85 — promoted" p={seg(t, 0.16, 0.3)} />
          <div style={{ position: "relative" }}>
            <RegRow v="v2" state="candidate" detail="new draft — running A/B eval…" p={seg(t, 0.3, 0.44)} hideBadge={blockP > 0.15} />
            {blockP > 0 && (
              <div style={{ position: "absolute", right: 30, top: 8 }}>
                <Stamp t={blockP} text="BLOCKED" size={34} rot={-7} />
              </div>
            )}
          </div>
          {/* A/B eval — golden dataset */}
          <div style={{ marginTop: 26, opacity: seg(t, 0.42, 0.5) }}>
            <div style={{ fontFamily: monoFont, fontSize: 16, color: C.dim, marginBottom: 12 }}>
              run_ab_eval — golden dataset · citation score
            </div>
            {([["v2", 0.79, C.danger], ["v1", 0.85, C.accent]] as const).map(([v, s, c]) => (
              <div key={v} style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 10 }}>
                <span style={{ fontFamily: monoFont, fontWeight: 700, fontSize: 20, color: c, width: 46 }}>{v}</span>
                <div style={{ flex: 1, height: 16, borderRadius: 8, background: "#141d24" }}>
                  <div
                    style={{
                      height: "100%", width: `${s * evalP * 100}%`, borderRadius: 8,
                      background: c, boxShadow: glow(c, 12),
                    }}
                  />
                </div>
                <span style={{ fontFamily: monoFont, fontSize: 20, color: c, width: 60 }}>{s.toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div
            style={{
              marginTop: 22, fontFamily: monoFont, fontSize: 18, color: C.accent,
              opacity: seg(t, 0.72, 0.82),
            }}
          >
            → v2 regresses: v1 stays promoted. prompt_sha256 logged.
          </div>
        </div>
      </div>
      <div
        style={{
          position: "absolute", left: 0, right: 0, top: 830, display: "flex",
          justifyContent: "center", gap: 16, opacity: seg(t, 0.78, 0.9),
        }}
      >
        <Chip text="prompt registry · versioned artifacts" />
        <Chip text="A/B eval on the golden dataset" />
      </div>
    </div>
  );
};

/* ================== 12 · REAL PRODUCT MONTAGE ========================== */

const Panel3d: React.FC<{
  x: number; y: number; w: number; h: number; rot: number; p: number;
  title: string; children: React.ReactNode;
}> = ({ x, y, w, h, rot, p, title, children }) => (
  <div
    style={{
      position: "absolute", left: x, top: y, width: w, height: h,
      background: "#0a1014", border: `2px solid ${C.accent}55`, borderRadius: 16,
      boxShadow: `0 34px 80px #000000e0, ${glow(C.accent, 18)}`,
      transform: `perspective(1400px) rotateY(${rot}deg) translateY(${(1 - p) * 80}px)`,
      opacity: p, overflow: "hidden",
    }}
  >
    <div
      style={{
        display: "flex", alignItems: "center", gap: 10, padding: "14px 18px",
        borderBottom: `1.5px solid ${C.muted}33`, background: "#0d1418",
      }}
    >
      <div style={{ width: 10, height: 10, borderRadius: 5, background: C.danger }} />
      <div style={{ width: 10, height: 10, borderRadius: 5, background: C.warn }} />
      <div style={{ width: 10, height: 10, borderRadius: 5, background: C.accent }} />
      <div style={{ fontFamily: monoFont, fontSize: 17, color: C.dim, marginLeft: 10 }}>{title}</div>
    </div>
    <div style={{ padding: "18px 20px" }}>{children}</div>
  </div>
);

const MBar: React.FC<{ w: string; c?: string; mt?: number }> = ({ w, c = "#1c2a30", mt = 10 }) => (
  <div style={{ marginTop: mt, height: 11, borderRadius: 5, width: w, background: c }} />
);

export const RealBeat: React.FC<{ t: number }> = ({ t }) => (
  <div style={{ position: "absolute", inset: 0 }}>
    {/* console — faithful recreation of the real landing console */}
    <Panel3d x={40} y={180} w={680} h={560} rot={-7} p={seg(t, 0.05, 0.25)} title="orchestrator — console">
      {/* app nav */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: monoFont, fontSize: 14 }}>
        <span style={{ background: C.accent, color: "#04211d", borderRadius: 6, padding: "2px 7px", fontWeight: 700, fontSize: 12 }}>S/M</span>
        <span style={{ color: C.text, fontWeight: 700 }}>orchestrator</span>
        <span style={{ border: `1px solid ${C.muted}66`, borderRadius: 999, padding: "1px 8px", color: C.dim, fontSize: 11 }}>v0.2</span>
        <span style={{ marginLeft: "auto", color: C.dim, fontSize: 12 }}>Console&nbsp;&nbsp;API&nbsp;&nbsp;Metrics</span>
      </div>
      {/* agents pill */}
      <div style={{ display: "flex", justifyContent: "center", marginTop: 14 }}>
        <span style={{ fontFamily: monoFont, fontSize: 11, color: C.dim, border: `1px solid ${C.muted}44`, borderRadius: 999, padding: "3px 14px" }}>
          <span style={{ color: C.accent }}>●</span> supervisor · researcher · writer · reviewer · human
        </span>
      </div>
      {/* hero */}
      <div style={{ fontFamily: titleFont, fontWeight: 700, fontSize: 30, lineHeight: 1.15, color: C.text, marginTop: 14 }}>
        Agents that <span style={{ color: C.accent }}>debate</span>,<br />reports that hold up.
      </div>
      <div style={{ fontFamily: bodyFont, fontSize: 12, color: C.dim, lineHeight: 1.4, marginTop: 8 }}>
        A Supervisor routes work between specialist agents. The Writer drafts, the
        Reviewer verifies every citation against real source text, and they iterate —
        bounded — until the report passes the bar or a human steps in.
      </div>
      {/* two columns: brief form + THE LOOP */}
      <div style={{ display: "flex", gap: 14, marginTop: 14 }}>
        <div style={{ flex: "0 0 350px", border: `1px solid ${C.muted}33`, borderRadius: 12, padding: "12px 14px", background: "#0c1318" }}>
          <div style={{ fontFamily: monoFont, fontSize: 10, letterSpacing: 2, color: C.dim }}>NEW RESEARCH BRIEF</div>
          {[
            { k: "Topic *", v: "Evaluate Quentell vs Norvane…" },
            { k: "Audience · Tone", v: "general business · Analytical" },
            { k: "Report type · Budget cap", v: "General · unlimited" },
            { k: "Your company context", v: "optional" },
          ].map((f, i) => (
            <div key={i} style={{ marginTop: 8 }}>
              <div style={{ fontFamily: bodyFont, fontSize: 10, color: C.muted }}>{f.k}</div>
              <div style={{ fontFamily: bodyFont, fontSize: 12, color: i === 0 ? C.text : C.dim, border: `1px solid ${C.muted}33`, borderRadius: 6, padding: "4px 8px", marginTop: 3, background: "#0a1014" }}>{f.v}</div>
            </div>
          ))}
          <div style={{ marginTop: 10, fontFamily: bodyFont, fontWeight: 700, fontSize: 12, textAlign: "center", color: "#04211d", background: C.accent, borderRadius: 8, padding: "7px 0" }}>Generate report</div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: monoFont, fontSize: 10, letterSpacing: 2, color: C.dim }}>THE LOOP</div>
          {[
            { n: "01", ti: "Supervisor routes", d: "assembles the team, decides who acts next" },
            { n: "02", ti: "Researcher gathers", d: "real web search, sanitized sources" },
            { n: "03", ti: "Writer ↔ Reviewer debate", d: "every quote verified, bounded rounds" },
            { n: "04", ti: "Human in the loop", d: "stalls or budget out → it escalates" },
          ].map((s, i) => (
            <div key={i} style={{ marginTop: 7, border: `1px solid ${C.muted}33`, borderRadius: 10, padding: "7px 10px", background: "#0c1318" }}>
              <div style={{ fontFamily: bodyFont, fontSize: 12, fontWeight: 700, color: C.text }}>
                <span style={{ color: C.accent, fontFamily: monoFont, fontSize: 11 }}>{s.n}&nbsp;&nbsp;</span>{s.ti}
              </div>
              <div style={{ fontFamily: bodyFont, fontSize: 10, color: C.dim, marginTop: 1 }}>{s.d}</div>
            </div>
          ))}
        </div>
      </div>
    </Panel3d>
    {/* sealed report */}
    <Panel3d x={680} y={290} w={600} h={400} rot={4} p={seg(t, 0.3, 0.5)} title="report — Quentell vs Norvane.pdf">
      <div style={{ fontFamily: titleFont, fontWeight: 700, fontSize: 22, color: C.text }}>Vendor Assessment</div>
      <MBar w="92%" mt={16} /><MBar w="80%" /><MBar w="85%" />
      <div style={{ display: "flex", gap: 8, marginTop: 18, fontFamily: monoFont, fontSize: 15, color: C.accent }}>
        <span style={{ border: `1px solid ${C.accent}66`, borderRadius: 6, padding: "4px 10px" }}>[1]</span>
        <span style={{ border: `1px solid ${C.accent}66`, borderRadius: 6, padding: "4px 10px" }}>[2]</span>
        <span style={{ border: `1px solid ${C.accent}66`, borderRadius: 6, padding: "4px 10px" }}>[3]</span>
        <span style={{ color: C.dim, padding: "4px 6px" }}>26 sources</span>
      </div>
    </Panel3d>
    {/* human review modal — faithful to the real "Human review required" dialog */}
    <Panel3d x={1250} y={250} w={560} h={380} rot={8} p={seg(t, 0.55, 0.75)} title="review — budget pause">
      <div style={{ fontFamily: titleFont, fontWeight: 700, fontSize: 24, color: C.text }}>Human review required</div>
      <div style={{ fontFamily: bodyFont, fontSize: 18, color: C.dim, lineHeight: 1.45, marginTop: 12 }}>
        The budget cap was reached — add budget to keep the team working, or reject the run.
      </div>
      <div style={{ display: "flex", gap: 10, marginTop: 26, fontFamily: bodyFont, fontSize: 16, justifyContent: "flex-end" }}>
        <span style={{ border: `1px solid ${C.muted}66`, borderRadius: 8, padding: "8px 16px", color: C.dim }}>Decide later</span>
        <span style={{ border: `1px solid ${C.danger}88`, borderRadius: 8, padding: "8px 16px", color: C.danger }}>Reject</span>
        <span style={{ background: C.accent, borderRadius: 8, padding: "8px 16px", color: "#04211d", fontWeight: 700 }}>Fund & continue</span>
      </div>
    </Panel3d>
    <div
      style={{
        position: "absolute", left: 0, right: 0, bottom: 240, textAlign: "center",
        fontFamily: bodyFont, fontWeight: 700, fontSize: 30, color: C.text, opacity: seg(t, 0.8, 0.9),
      }}
    >
      A real product — not a slide.
    </div>
  </div>
);

/* ================== 14+15 · END CARD (ecommerce style) ================== */
/* One continuous card across the built-by and CTA scenes: part "a" draws
   the URL + name on the name-hit, part "b" adds the pill + contact line. */

export const EndCardBeat: React.FC<{ t: number; part: "a" | "b" }> = ({ t, part }) => {
  const url = part === "a" ? seg(t, 0.02, 0.55) : 1;
  const sub = part === "a" ? seg(t, 0.5, 0.85) : 1;
  const kicker = part === "b" ? seg(t, 0.02, 0.18) : 0;
  const extra = part === "b" ? seg(t, 0.1, 0.32) : 0;
  return (
    <div
      style={{
        position: "absolute", inset: 0, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", gap: 34,
      }}
    >
      <div
        style={{
          fontFamily: monoFont, fontWeight: 600, fontSize: 27, letterSpacing: 12,
          color: C.muted, opacity: kicker,
        }}
      >
        NEED AGENTS YOU CAN TRUST WITH REAL WORK?
      </div>
      <div style={{ position: "relative" }}>
        <div
          style={{
            fontFamily: titleFont, fontWeight: 700, fontSize: 128,
            color: C.accent, letterSpacing: -1,
            textShadow: `0 0 60px ${C.accent}99, 0 0 140px ${C.accent}44`,
            opacity: url,
            transform: `scale(${0.92 + url * 0.08})`,
          }}
        >
          kaarstenanderson.com
        </div>
        <div
          style={{
            position: "absolute", bottom: -22, left: "50%",
            transform: "translateX(-50%)",
            width: 700 * url, height: 4,
            background: `linear-gradient(90deg, transparent, ${C.accent}, transparent)`,
            boxShadow: `0 0 26px ${C.accent}`,
          }}
        />
      </div>
      <div
        style={{
          fontFamily: titleFont, fontWeight: 500, fontSize: 44, color: C.text,
          opacity: sub, transform: `translateY(${(1 - sub) * 18}px)`,
        }}
      >
        Kaarsten Anderson <span style={{ color: C.accent, fontSize: 34 }}>· Agentic AI Developer</span>
      </div>
      <div style={{ display: "flex", gap: 16, opacity: extra }}>
        <Chip text="LangGraph Multi-Agent Orchestrator" size={26} />
        <span
          style={{
            fontFamily: monoFont, fontWeight: 600, fontSize: 26, color: C.text,
            background: `${C.text}1a`, border: `2px solid ${C.text}88`,
            borderRadius: 10, padding: "6px 16px", whiteSpace: "nowrap", flexShrink: 0,
            display: "inline-flex", alignItems: "center", gap: 10,
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill={C.text} style={{ display: "block" }}>
            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
          </svg>
          github.com/kanderson-ai-dev
        </span>
      </div>
      <div
        style={{
          fontFamily: monoFont, fontSize: 26, color: C.accent, opacity: extra,
        }}
      >
        contact@kaarstenanderson.com
      </div>
    </div>
  );
};
