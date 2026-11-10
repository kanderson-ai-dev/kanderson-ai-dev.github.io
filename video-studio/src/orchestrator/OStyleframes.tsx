import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Stage, Chip, StatusPill } from "../upgrade/primitives";
import { C, bodyFont, monoFont, titleFont } from "../upgrade/utheme";
import { AgentNode, BriefCard, BudgetGauge, DrawnEdge, Glyph, HashChain, Kicker, OEndCard, ProofBoard, TitleText } from "./pieces";

export type OStyleframeDesign = "hook" | "routing" | "gate" | "seal" | "proof" | "end";

// ---------------------------------------------------------------------------
// hook: brief in → team ignites → sealed report out
// ---------------------------------------------------------------------------

const HookFrame: React.FC = () => (
  <>
    <svg width="1920" height="1080" style={{ position: "absolute", inset: 0 }}>
      {/* brief → supervisor */}
      <DrawnEdge x1={640} y1={540} x2={830} y2={540} />
      {/* supervisor → 4 workers fan */}
      <DrawnEdge x1={1150} y1={540} x2={1280} y2={330} bend={-40} />
      <DrawnEdge x1={1150} y1={540} x2={1280} y2={470} bend={-10} pulse frame={12} />
      <DrawnEdge x1={1150} y1={540} x2={1280} y2={610} bend={10} />
      <DrawnEdge x1={1150} y1={540} x2={1280} y2={750} bend={40} />
      <DrawnEdge x1={1150} y1={540} x2={1280} y2={890} bend={50} />
      {/* workers → report */}
      <DrawnEdge x1={1660} y1={330} x2={1690} y2={500} bend={20} color={C.accent} />
      <DrawnEdge x1={1660} y1={470} x2={1690} y2={520} bend={0} color={C.accent} />
      <DrawnEdge x1={1660} y1={610} x2={1690} y2={560} bend={0} color={C.accent} />
      <DrawnEdge x1={1660} y1={750} x2={1690} y2={600} bend={-20} color={C.accent} />
      <DrawnEdge x1={1660} y1={890} x2={1690} y2={600} bend={-40} color={C.accent} />
    </svg>
    <div style={{ position: "absolute", left: 110, top: 410 }}>
      <BriefCard w={530} status="team" />
    </div>
    <div style={{ position: "absolute", left: 830, top: 430 }}>
      <AgentNode role="supervisor" w={320} active tag="MODEL · router" />
    </div>
    <div style={{ position: "absolute", left: 1300, top: 270 }}>
      <AgentNode role="researcher" w={360} lit={1} />
    </div>
    <div style={{ position: "absolute", left: 1300, top: 410 }}>
      <AgentNode role="financial_analyst" w={360} lit={1} />
    </div>
    <div style={{ position: "absolute", left: 1300, top: 550 }}>
      <AgentNode role="compliance_analyst" w={360} lit={1} />
    </div>
    <div style={{ position: "absolute", left: 1300, top: 690 }}>
      <AgentNode role="writer" w={360} lit={1} />
    </div>
    {/* sealed report */}
    <div
      style={{
        position: "absolute",
        right: 40,
        top: 380,
        width: 220,
        background: `${C.panel}f5`,
        border: `3px solid ${C.accent}`,
        borderRadius: 20,
        padding: "22px 18px",
        textAlign: "center",
        boxShadow: `0 0 60px ${C.accent}55`,
      }}
    >
      <Glyph role="assembler" size={52} />
      <div style={{ fontFamily: titleFont, fontWeight: 700, fontSize: 26, color: C.text, marginTop: 8 }}>Report</div>
      <div style={{ fontFamily: monoFont, fontSize: 17, color: C.accent, marginTop: 8 }}>#73e4…cc5e6</div>
      <div style={{ marginTop: 12 }}>
        <StatusPill text="sealed ✓" color={C.accent} size={18} />
      </div>
    </div>
    <div style={{ position: "absolute", left: 1300, top: 830 }}>
      <AgentNode role="reviewer" w={360} lit={1} />
    </div>
    <Kicker text="one brief in — the right team, inside the budget — a sealed report out" />
  </>
);

// ---------------------------------------------------------------------------
// routing: the supervisor draws each edge at decision time + Send() fan-out
// ---------------------------------------------------------------------------

const RoutingFrame: React.FC = () => {
  const f = useCurrentFrame();
  const team: { role: Parameters<typeof AgentNode>[0]["role"]; x: number; y: number }[] = [
    { role: "researcher", x: 1480, y: 180 },
    { role: "financial_analyst", x: 1480, y: 360 },
    { role: "compliance_analyst", x: 1480, y: 540 },
    { role: "writer", x: 1480, y: 720 },
    { role: "reviewer", x: 1480, y: 900 },
  ];
  const lanes = [
    { label: "research · pricing", y: 300 },
    { label: "research · compliance", y: 420 },
    { label: "research · posture", y: 540 },
  ];
  return (
    <>
      <TitleText>The supervisor <span style={{ color: C.model }}>draws its own path</span>.</TitleText>
      <svg width="1920" height="1080" style={{ position: "absolute", inset: 0 }}>
        {/* brief → supervisor */}
        <DrawnEdge x1={560} y1={560} x2={700} y2={560} />
        {/* drawn edges to two workers (done) */}
        <DrawnEdge x1={1020} y1={560} x2={1460} y2={225} bend={-60} pulse frame={f} />
        <DrawnEdge x1={1020} y1={560} x2={1460} y2={405} bend={-20} p={0.55} />
        {/* mid-draw edge */}
        <DrawnEdge x1={1020} y1={560} x2={1460} y2={585} bend={10} p={0.3} />
        {/* undrawn: faint ghost rails to writer/reviewer (dashed, not decided) */}
        <path d="M1020 560 Q 1240 700 1460 765" stroke={C.dim} strokeWidth={3} strokeDasharray="10 14" fill="none" opacity={0.5} />
        <path d="M1020 560 Q 1240 850 1460 945" stroke={C.dim} strokeWidth={3} strokeDasharray="10 14" fill="none" opacity={0.5} />
      </svg>
      <div style={{ position: "absolute", left: 60, top: 450 }}>
        <BriefCard w={500} status="working" />
      </div>
      <div style={{ position: "absolute", left: 700, top: 490 }}>
        <AgentNode role="supervisor" w={320} active tag="MODEL · LLM router" />
      </div>
      {team.map((w) => (
        <div key={w.role} style={{ position: "absolute", left: w.x, top: w.y }}>
          <AgentNode role={w.role} w={380} lit={1} />
        </div>
      ))}
      {/* Send() fan-out lanes (left bottom) */}
      <div style={{ position: "absolute", left: 90, top: 790, width: 1180 }}>
        <div style={{ fontFamily: monoFont, fontSize: 22, color: C.accent, marginBottom: 14 }}>Send() ×3 — parallel mandates</div>
        {lanes.map((l, i) => (
          <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 14 }}>
            <span style={{ width: 300, fontFamily: monoFont, fontSize: 20, color: C.text }}>{l.label}</span>
            <div style={{ flex: 1, height: 22, borderRadius: 8, border: `2px solid ${C.model}`, background: C.panel, overflow: "hidden" }}>
              <div style={{ width: `${[86, 62, 34][i]}%`, height: "100%", background: `linear-gradient(90deg, ${C.model}66, ${C.model})` }} />
            </div>
            <span style={{ fontFamily: monoFont, fontSize: 20, color: C.muted }}>{[86, 62, 34][i]}%</span>
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", left: 640, top: 640, fontFamily: monoFont, fontSize: 22, color: C.model }}>no fixed edges — decided per state</div>
    </>
  );
};

// ---------------------------------------------------------------------------
// gate: worst-case estimate doesn't fit remaining budget → REFUSED
// ---------------------------------------------------------------------------

const GateFrame: React.FC = () => (
  <>
    <TitleText>Every call is priced <span style={{ color: C.accent }}>before</span> it happens.</TitleText>
    <div style={{ position: "absolute", left: 110, top: 330 }}>
      <BriefCard w={480} status="awaiting" />
      <div style={{ marginTop: 26, marginLeft: 6 }}>
        <StatusPill text="awaiting human review" color={C.human} size={24} />
      </div>
    </div>
    <div style={{ position: "absolute", right: 90, top: 300 }}>
      <BudgetGauge progress={1} w={1090} />
    </div>
    <div style={{ position: "absolute", right: 100, top: 720, width: 1080, fontFamily: bodyFont, fontSize: 27, color: C.muted }}>
      The model wants one more analysis call. <span style={{ color: C.text }}>Plain code says no</span> — the call never happens, the job escalates to a human.
    </div>
    <Kicker text="checked before every metered call · CODE" />
  </>
);

// ---------------------------------------------------------------------------
// seal: hash chain — intact vs tampered
// ---------------------------------------------------------------------------

const SealFrame: React.FC = () => (
  <>
    <TitleText>Every message joins a <span style={{ color: C.accent }}>hash chain</span>.</TitleText>
    <div style={{ position: "absolute", left: "50%", top: 210, transform: "translateX(-50%)" }}>
      <HashChain progress={1} w={1560} />
    </div>
    <div style={{ position: "absolute", left: "50%", top: 590, transform: "translateX(-50%)" }}>
      <HashChain progress={1} tampered w={1560} />
    </div>
    <div style={{ position: "absolute", left: "50%", top: 490, transform: "translateX(-50%)", fontFamily: monoFont, fontSize: 24, color: C.danger }}>
      alter one line ↓ every later link fails
    </div>
    <Kicker text="report carries audit_root 73e47c0b… · anyone can re-verify · GET /reports/{id}/audit" />
  </>
);

// ---------------------------------------------------------------------------
// proof / end
// ---------------------------------------------------------------------------

const ProofFrame: React.FC = () => (
  <>
    <TitleText top={80}>Held-out briefs. Live models. <span style={{ color: C.accent }}>Every gate passed.</span></TitleText>
    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", paddingTop: 90 }}>
      <ProofBoard progress={1} />
    </div>
  </>
);

const EndFrame: React.FC = () => (
  <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
    <OEndCard progress={1} />
  </div>
);

export const OStyleframes: React.FC<{ design?: OStyleframeDesign }> = ({ design = "hook" }) => {
  switch (design) {
    case "hook": return <Stage><HookFrame /></Stage>;
    case "routing": return <Stage><RoutingFrame /></Stage>;
    case "gate": return <Stage><GateFrame /></Stage>;
    case "seal": return <Stage><SealFrame /></Stage>;
    case "proof": return <Stage dim={0.7}><ProofFrame /></Stage>;
    case "end": return <Stage dim={0.7}><EndFrame /></Stage>;
    default: return <AbsoluteFill />;
  }
};
