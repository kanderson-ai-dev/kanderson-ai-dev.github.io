/**
 * Styleframes for the MCP Agent Toolkit flagship (G1 gate) — one static frame
 * per key beat at final visual quality. Rendered via `npx remotion still`.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { Board, Finish, Label, MC, tglow, monoFont, titleFont, bodyFont } from "./look";
import {
  ABLane, AuditChain, BlockedDialog, CallPacket, ClientNode, ErrorChip,
  Gate, MEndCard, MKicker, MTitle, ProtocolLink, QuestionCard, ScoreRow,
  ServerNode, Shards, ToolBay, Vault, VersionChip,
} from "./pieces";

export type MStyleframeDesign =
  | "cold" | "reveal" | "board" | "gauntlet" | "arena" | "proof" | "end";

const Frame: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { width, height } = useVideoConfig();
  const k = Math.min(width / 1920, height / 1080);
  return (
    <AbsoluteFill style={{ background: MC.bg }}>
      <div style={{ position: "absolute", width: 1920, height: 1080, left: (width - 1920 * k) / 2, top: (height - 1080 * k) / 2, transform: `scale(${k})`, transformOrigin: "0 0" }}>
        <Board />
        {children}
        <Finish />
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// cold — the freeze: hostile packet mid-flight toward the vault
// ---------------------------------------------------------------------------

const ColdFrame: React.FC = () => (
  <>
    {/* question card, just typed into existence */}
    <div style={{ position: "absolute", left: 120, top: 380 }}>
      <QuestionCard w={560} chip="3–2000 chars ✓" />
    </div>
    {/* three resources the agent may touch */}
    <div style={{ position: "absolute", right: 330, top: 150 }}>
      <Vault w={320} />
      <div style={{ marginTop: 8, textAlign: "center" }}><Label text="your database" size={17} /></div>
    </div>
    <div style={{ position: "absolute", right: 300, top: 470 }}>
      <ToolBay tool="read_file" w={320} />
      <div style={{ marginTop: 8, textAlign: "center" }}><Label text="your files" size={17} /></div>
    </div>
    <div style={{ position: "absolute", right: 340, top: 790 }}>
      <ToolBay tool="web_search" w={320} />
      <div style={{ marginTop: 8, textAlign: "center" }}><Label text="the web" size={17} /></div>
    </div>
    {/* hostile packet frozen mid-flight */}
    <div style={{ position: "absolute", left: 810, top: 330 }}>
      <CallPacket text="read_file ../../etc/passwd" danger />
      <div style={{ position: "absolute", left: -60, top: 4, width: 50, height: 4, background: `linear-gradient(90deg, transparent, ${MC.danger})`, filter: "blur(1px)" }} />
    </div>
    <div style={{ position: "absolute", left: 950, top: 560 }}>
      <CallPacket text="DROP TABLE reports" danger />
      <div style={{ position: "absolute", left: -60, top: 4, width: 50, height: 4, background: `linear-gradient(90deg, transparent, ${MC.danger})`, filter: "blur(1px)" }} />
    </div>
    <svg width="1920" height="1080" style={{ position: "absolute", inset: 0 }}>
      <path d="M 700 470 L 830 360" stroke={MC.danger} strokeWidth={2.5} strokeDasharray="8 10" opacity={0.6} />
      <path d="M 720 500 L 980 590" stroke={MC.danger} strokeWidth={2.5} strokeDasharray="8 10" opacity={0.6} />
    </svg>
    <MTitle size={62}>Give an AI agent your <span style={{ color: MC.model }}>database</span>, your <span style={{ color: MC.code }}>files</span>, and the <span style={{ color: "#67E8F9" }}>web</span>.</MTitle>
    <div style={{ position: "absolute", bottom: 90, left: 0, right: 0, textAlign: "center", fontFamily: titleFont, fontWeight: 700, fontSize: 84, color: MC.text, textShadow: tglow(MC.text, 20, 60) }}>
      Now ask: <span style={{ color: MC.danger }}>what stops it?</span>
    </div>
  </>
);

// ---------------------------------------------------------------------------
// reveal — the title, gate + shards
// ---------------------------------------------------------------------------

const RevealFrame: React.FC = () => (
  <>
    {/* the gate that just slammed up */}
    <div style={{ position: "absolute", left: 940, top: 590 }}>
      <Gate label="guardrail chain" sub="rate limit · sandbox · sanitizer" state="pass" h={220} w={120} />
    </div>
    {/* shattering hostile packet */}
    <div style={{ position: "absolute", left: 700, top: 600, width: 220, height: 160 }}>
      <div style={{ position: "absolute", inset: 0, opacity: 0.4, transform: "rotate(-6deg)" }}>
        <CallPacket text="DROP TABLE reports" danger small />
      </div>
      <Shards n={10} p={1} />
    </div>
    {/* circuit traces converging into the title */}
    <svg width="1920" height="1080" style={{ position: "absolute", inset: 0 }}>
      <path d="M0 300 H420 L520 400" stroke={MC.code} strokeWidth={3} fill="none" opacity={0.8} />
      <path d="M0 700 H420 L520 600" stroke={MC.code} strokeWidth={3} fill="none" opacity={0.8} />
      <path d="M1920 340 H1500 L1400 430" stroke={MC.code} strokeWidth={3} fill="none" opacity={0.8} />
      <path d="M1920 740 H1500 L1400 610" stroke={MC.code} strokeWidth={3} fill="none" opacity={0.8} />
      <path d="M960 1080 V760" stroke={MC.code} strokeWidth={3} fill="none" opacity={0.6} />
    </svg>
    <div style={{ position: "absolute", top: 300, left: 0, right: 0, textAlign: "center" }}>
      <div style={{ fontFamily: monoFont, fontSize: 26, color: MC.muted, letterSpacing: 6, marginBottom: 26 }}>THIS DOES.</div>
      <div style={{ fontFamily: titleFont, fontWeight: 700, fontSize: 150, color: MC.text, letterSpacing: -2, textShadow: `0 0 30px rgba(232,251,247,0.35)` }}>
        MCP Agent <span style={{ color: MC.code, textShadow: tglow(MC.code, 50, 140) }}>Toolkit</span>
      </div>
      <div style={{ fontFamily: bodyFont, fontSize: 36, color: MC.muted, marginTop: 30 }}>
        A real <span style={{ color: MC.text }}>Model Context Protocol</span> server, built to be trusted.
      </div>
    </div>
  </>
);

// ---------------------------------------------------------------------------
// board — the hero establishing shot
// ---------------------------------------------------------------------------

const BoardFrame: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <>
      <MTitle top={54} size={58}>One question. <span style={{ color: MC.code }}>Four tools.</span> Every call guarded.</MTitle>
      {/* client territory */}
      <div style={{ position: "absolute", left: 90, top: 480 }}>
        <ClientNode />
        <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 8 }}>
          {["function shelf", "iteration 2/8"].map((s, i) => (
            <div key={s} style={{ fontFamily: monoFont, fontSize: 17, color: i === 0 ? MC.model : MC.muted, background: `${MC.model}${i === 0 ? "14" : "08"}`, border: `1.5px solid ${MC.model}44`, borderRadius: 9, padding: "6px 12px" }}>
              {s === "function shelf" ? "fn shelf · tools/list ✓" : s}
            </div>
          ))}
        </div>
      </div>
      <div style={{ position: "absolute", left: 90, top: 230 }}>
        <QuestionCard w={420} text="Which reports cover security, and what is the newest one?" chip="asked" />
      </div>
      {/* the protocol link */}
      <svg width="1920" height="1080" style={{ position: "absolute", inset: 0 }}>
        <ProtocolLink x1={520} y1={520} x2={800} y2={520} packets={3} packetFrom={f - 10} />
        <path d="M900 450 h0" stroke="none" />
        {/* server → vault/island links */}
        <path d="M1560 430 C 1650 430 1650 300 1720 290" stroke={MC.code} strokeWidth={2.5} fill="none" opacity={0.7} />
        <path d="M1560 640 C 1650 650 1640 760 1700 780" stroke={MC.code} strokeWidth={2.5} fill="none" opacity={0.7} />
      </svg>
      {/* gate array in front of the bays */}
      <div style={{ position: "absolute", left: 810, top: 380, display: "flex", gap: 34 }}>
        <Gate label="rate" h={240} w={86} state="pass" />
        <Gate label="sandbox" h={240} w={86} state="pass" />
        <Gate label="sanitize" h={240} w={86} state="pass" />
      </div>
      <div style={{ position: "absolute", left: 530, top: 546 }}>
        <Label text="stdio · JSON-RPC" size={19} color={MC.muted} />
      </div>
      <div style={{ position: "absolute", left: 810, top: 690 }}>
        <Label text="guarded invoke" size={17} color={MC.code} />
      </div>
      {/* server node with bays */}
      <div style={{ position: "absolute", left: 1180, top: 210 }}>
        <ServerNode w={390} label="MCP server">
          <ToolBay tool="web_search" w={340} />
          <ToolBay tool="db_query" w={340} />
          <ToolBay tool="read_file" w={340} />
          <ToolBay tool="write_file" w={340} />
        </ServerNode>
      </div>
      {/* resources far right */}
      <div style={{ position: "absolute", right: 70, top: 210 }}>
        <Vault w={230} />
      </div>
      <div style={{ position: "absolute", right: 60, top: 720, width: 240 }}>
        <div style={{ background: `${MC.panel}f5`, border: `2px dashed ${MC.code}88`, borderRadius: 16, padding: "14px 16px", textAlign: "center" }}>
          <div style={{ fontFamily: monoFont, fontSize: 19, color: MC.text }}>sandbox island</div>
          <div style={{ fontFamily: monoFont, fontSize: 15, color: MC.muted, marginTop: 4 }}>files live here — only here</div>
        </div>
      </div>
      {/* a green call travelling the gauntlet */}
      <div style={{ position: "absolute", left: 545, top: 482 }}>
        <CallPacket text="db_query SELECT …" small />
      </div>
      <MKicker text="question → tools/list → guarded calls → cited answer" color={MC.muted} />
    </>
  );
};

// ---------------------------------------------------------------------------
// gauntlet — the three gates + a hostile call shattering into a typed error
// ---------------------------------------------------------------------------

const GauntletFrame: React.FC = () => (
  <>
    <MTitle size={56}>Every call runs the <span style={{ color: MC.code }}>gauntlet</span>.</MTitle>
    {/* the gauntlet: the hostile call's current state — passed gate 1, dead at gate 2, gate 3 never reached */}
    <div style={{ position: "absolute", left: 660, top: 250, display: "flex", gap: 26 }}>
      <Gate label="rate limit" sub="60/min · per tool" state="pass" h={310} w={130} />
      <Gate label="path sandbox" sub="lexical + canonical" state="block" h={310} w={130} />
      <Gate label="sanitizer" sub="strip + cap" state="idle" h={310} w={130} />
    </div>
    {/* the hostile call and its dashed approach */}
    <div style={{ position: "absolute", left: 90, top: 380 }}>
      <CallPacket text="read_file ../../etc/passwd" danger />
      <div style={{ marginTop: 10, fontFamily: monoFont, fontSize: 17, color: MC.muted }}>a hostile call</div>
    </div>
    <svg width="1920" height="1080" style={{ position: "absolute", inset: 0 }}>
      <path d="M 520 405 L 800 405" stroke={MC.danger} strokeWidth={3} strokeDasharray="10 9" opacity={0.7} />
      {/* error chip arcs back to the model */}
      <path d="M 800 470 C 640 640 470 660 350 640" stroke={MC.danger} strokeWidth={2.5} strokeDasharray="6 10" fill="none" opacity={0.8} />
      {/* legitimate call already through → the db bay */}
      <path d="M 1150 410 L 1260 410" stroke={MC.code} strokeWidth={3} strokeDasharray="10 9" opacity={0.8} />
      <path d="M 1480 410 C 1480 340 1450 320 1420 310" stroke={MC.code} strokeWidth={2.5} fill="none" opacity={0.55} />
    </svg>
    {/* shatter point on the sandbox gate's left face */}
    <div style={{ position: "absolute", left: 786, top: 330, width: 60, height: 160 }}>
      <Shards n={12} p={1.1} seed={4} />
    </div>
    {/* the typed error returning to the model */}
    <div style={{ position: "absolute", left: 230, top: 600 }}>
      <ErrorChip code="forbidden" />
      <div style={{ marginTop: 10, fontFamily: monoFont, fontSize: 16, color: MC.muted, maxWidth: 300 }}>typed error → back to the model</div>
    </div>
    {/* a legitimate call on its way out */}
    <div style={{ position: "absolute", left: 1150, top: 380 }}>
      <CallPacket text="db_query SELECT …" small />
    </div>
    <div style={{ position: "absolute", left: 1420, top: 210 }}>
      <ToolBay tool="db_query" w={290} />
      <div style={{ marginTop: 8, textAlign: "center" }}><Label text="passes all three" size={16} /></div>
    </div>
    <MKicker text="typed errors · never silence — the model learns the limit" color={MC.muted} />
  </>
);

// ---------------------------------------------------------------------------
// arena — the registry duel + BLOCKED stamp + dialog replica
// ---------------------------------------------------------------------------

const ArenaFrame: React.FC = () => (
  <>
    <MTitle size={56}>Prompts ship like code — <span style={{ color: MC.code }}>or not at all</span>.</MTitle>
    {/* version stack */}
    <div style={{ position: "absolute", left: 100, top: 250, display: "flex", flexDirection: "column", gap: 14 }}>
      <VersionChip v={1} state="rolled_back" />
      <VersionChip v={2} state="blocked" />
      <VersionChip v={3} state="rolled_back" />
      <VersionChip v={4} state="promoted" />
      <div style={{ fontFamily: monoFont, fontSize: 17, color: MC.muted, marginTop: 6 }}>agent_system · registry history</div>
    </div>
    {/* the duel */}
    <div style={{ position: "absolute", left: 500, top: 250, display: "flex", flexDirection: "column", gap: 18 }}>
      <ABLane
        name="champion · v1"
        bars={[
          { label: "grounding", value: 3.71 },
          { label: "adversarial", value: 1.0, max: 1 },
        ]}
      />
      <ABLane
        name="candidate · v2"
        bars={[
          { label: "grounding", value: 3.33, color: MC.danger },
          { label: "adversarial", value: 0.846, max: 1, color: MC.danger },
        ]}
      />
    </div>
    {/* verdict */}
    <div style={{ position: "absolute", right: 90, top: 280, textAlign: "center" }}>
      <div
        style={{
          fontFamily: titleFont,
          fontWeight: 700,
          fontSize: 56,
          color: MC.danger,
          border: `5px solid ${MC.danger}`,
          borderRadius: 18,
          padding: "14px 34px",
          transform: "rotate(-8deg)",
          textShadow: tglow(MC.danger, 40, 90),
          boxShadow: `0 0 60px ${MC.danger}44`,
          display: "inline-block",
        }}
      >
        BLOCKED
      </div>
      <div style={{ fontFamily: monoFont, fontSize: 20, color: MC.muted, marginTop: 26 }}>grounding 3.71 → 3.33</div>
      <div style={{ fontFamily: monoFont, fontSize: 20, color: MC.muted }}>adversarial 11/13</div>
      <div style={{ fontFamily: monoFont, fontSize: 20, color: MC.danger, marginTop: 10 }}>v2 never shipped</div>
    </div>
    {/* real dialog replica */}
    <div style={{ position: "absolute", left: 500, top: 640 }}>
      <BlockedDialog w={640} />
    </div>
    <div style={{ position: "absolute", right: 90, top: 640 }}>
      <AuditChain w={560} compact />
      <div style={{ marginTop: 10, textAlign: "center" }}><Label text="audit.jsonl · hash-chained · verified" size={17} /></div>
    </div>
    <MKicker text="live A/B gate · no regression > 0.1 · adversarial must stay 100%" color={MC.muted} />
  </>
);

// ---------------------------------------------------------------------------
// proof — scorecard + the failed-first row repaired
// ---------------------------------------------------------------------------

const ProofFrame: React.FC = () => (
  <>
    <MTitle top={70} size={56}>
      Graded by a <span style={{ color: MC.model }}>different model</span> than the agent.
    </MTitle>
    <div style={{ position: "absolute", left: "50%", top: 220, transform: "translateX(-50%)", display: "flex", flexDirection: "column", gap: 20 }}>
      <ScoreRow label="Task success" value="4.79 / 5" gate="gate ≥ 4.0" />
      <ScoreRow label="Grounding" value="4.83 / 5" gate="gate ≥ 4.0" />
      <ScoreRow label="Attacks resisted" value="13 / 13" gate="gate 100 %" />
      <ScoreRow label="Citations verified" value="100 %" gate="gate 100 %" />
      {/* the honest row: first run failed, fixed through the registry */}
      <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
        <div style={{ width: 1230, display: "flex", alignItems: "center", gap: 24, background: `${MC.panel}ee`, border: `2px solid ${MC.human}66`, borderRadius: 18, padding: "18px 24px" }}>
          <span style={{ width: 380, fontFamily: titleFont, fontSize: 28, fontWeight: 700, color: MC.text }}>First run, same gate</span>
          <span style={{ fontFamily: monoFont, fontSize: 34, fontWeight: 700, color: MC.danger, textDecoration: "line-through", textDecorationThickness: 4 }}>3.58</span>
          <svg width={80} height={30}><path d="M4 15 H66 M60 6l14 9-14 9" stroke={MC.code} strokeWidth={3.5} fill="none" /></svg>
          <span style={{ fontFamily: monoFont, fontSize: 34, fontWeight: 700, color: MC.code, textShadow: tglow(MC.code, 24, 60) }}>4.83</span>
          <span style={{ fontFamily: monoFont, fontSize: 19, color: MC.muted, marginLeft: "auto" }}>fixed through the registry</span>
        </div>
        <VersionChip v={4} state="promoted" small />
      </div>
    </div>
    <MKicker text="live scorecard · dataset v1.2.0 · 24 questions · the whole run cost $0.0093" color={MC.dim} />
  </>
);

// ---------------------------------------------------------------------------
// end
// ---------------------------------------------------------------------------

const EndFrame: React.FC = () => (
  <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
    <MEndCard progress={1} />
  </div>
);

export const MStyleframes: React.FC<{ design?: MStyleframeDesign }> = ({ design = "cold" }) => {
  switch (design) {
    case "cold": return <Frame><ColdFrame /></Frame>;
    case "reveal": return <Frame><RevealFrame /></Frame>;
    case "board": return <Frame><BoardFrame /></Frame>;
    case "gauntlet": return <Frame><GauntletFrame /></Frame>;
    case "arena": return <Frame><ArenaFrame /></Frame>;
    case "proof": return <Frame><ProofFrame /></Frame>;
    case "end": return <Frame><EndFrame /></Frame>;
    default: return <AbsoluteFill />;
  }
};
