/**
 * Full-animation beats for the MCP Agent Toolkit flagship film
 * (Plan_video.md §4). One component per script beat, driven by the scene
 * clock (useCurrentFrame inside each Sequence). All timing is deterministic
 * — every motion is a pure function of the frame.
 *
 * Design space: 1920×1080 fixed (a scale wrapper in PromoMcpToolkit maps it
 * to the render resolution). Times below are in frames at 60 fps.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { StatusPill } from "../upgrade/primitives";
import { Board, Label, MC, bodyFont, glow, monoFont, tglow, titleFont } from "./look";
import { MOTION, drift, inSpring, noise1, popScale, seg, segOut, stagger } from "./motion";
import {
  ABLane,
  AuditChain,
  BlockedDialog,
  CallPacket,
  ClientNode,
  ErrorChip,
  Gate,
  MEndCard,
  MKicker,
  MTitle,
  ProtocolLink,
  QuestionCard,
  ScoreRow,
  ServerNode,
  Shards,
  TOOL,
  ToolBay,
  ToolGlyph,
  Vault,
  VersionChip,
} from "./pieces";
import type { ToolName } from "./pieces";

const sec = (s: number) => Math.round(s * 60);
const ease = (t: number) => t * t * (3 - 2 * t); // smoothstep
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Small bordered chip used for schema tokens, sources, domains. */
const Chip: React.FC<{ text: string; color?: string; size?: number; dim?: boolean }> = ({
  text,
  color = MC.code,
  size = 20,
  dim = false,
}) => (
  <span
    style={{
      fontFamily: monoFont,
      fontSize: size,
      color: dim ? MC.muted : color,
      border: `2px solid ${dim ? MC.line : color}88`,
      borderRadius: 10,
      padding: "6px 14px",
      background: `${dim ? MC.panel : color}12`,
      whiteSpace: "nowrap",
    }}
  >
    {text}
  </span>
);

/** Row of tool bays used by several beats. */
const BayRow: React.FC<{ lit: number[]; offIdx?: number; w?: number; small?: boolean }> = ({ lit, offIdx = -1, w = 264 }) => (
  <div style={{ display: "flex", gap: 18 }}>
    {(Object.keys(TOOL) as ToolName[]).map((tool, i) => (
      <ToolBay key={tool} tool={tool} w={w} lit={lit[i]} off={i === offIdx} />
    ))}
  </div>
);

// ===========================================================================
// 1 · HOOK — question in, resources ignite, hostile packet, FREEZE
// ===========================================================================
export const HookBeat: React.FC = () => {
  const f = useCurrentFrame();
  const FREEZE = sec(5.6); // last ~2 s sit frozen under the silence
  const fz = Math.min(f, FREEZE); // frozen clock: everything driven by it
  const question = "Give an AI agent your database, your files, and the web.";
  const typed = Math.floor(seg(fz, 8, 66) * question.length);

  // three resources ignite on the right
  const RES = [
    { icon: "db", label: "reports.db" },
    { icon: "fs", label: "/reports/*.md" },
    { icon: "web", label: "the web" },
  ];
  // hostile packet flight (question card → resources), stops dead at FREEZE
  const pt = ease(seg(fz, 150, 150));
  const px = lerp(520, 1410, pt);
  const py = lerp(560, 470, pt) + Math.sin(pt * Math.PI) * -60;
  const frozen = f >= FREEZE;
  const flash = seg(f, FREEZE, 8);

  return (
    <AbsoluteFill>
      <Board opacity={0.9} />
      {/* question card, typing */}
      <div style={{ position: "absolute", left: 130, top: 400, transform: `translateY(${drift(f, 3, 6)}px)` }}>
        <QuestionCard
          w={660}
          text={question.slice(0, typed) + (typed < question.length ? "▌" : "")}
          chip={f > 100 ? "the agent is about to act" : undefined}
          chipColor={MC.model}
        />
      </div>
      {/* resources */}
      {RES.map((r, i) => {
        const p = stagger(fz, 96, i, 18);
        return (
          <div
            key={r.label}
            style={{
              position: "absolute",
              left: 1240 + i * 210,
              top: 380 + drift(fz, i * 7 + 11, 8),
              opacity: p,
              transform: `scale(${popScale(p)})`,
            }}
          >
            <div
              style={{
                width: 190,
                background: `${MC.panel}f5`,
                border: `2.5px solid ${MC.model}`,
                borderRadius: 18,
                padding: "18px 16px",
                textAlign: "center",
                boxShadow: glow(MC.model, 30, 80),
              }}
            >
              <div style={{ fontFamily: monoFont, fontSize: 40, color: MC.model, marginBottom: 8 }}>
                {r.icon === "db" ? "▣" : r.icon === "fs" ? "▤" : "◍"}
              </div>
              <div style={{ fontFamily: monoFont, fontSize: 19, color: MC.text }}>{r.label}</div>
            </div>
          </div>
        );
      })}
      {/* hostile packet */}
      {pt > 0 && (
        <div style={{ position: "absolute", left: px, top: py, transform: "translate(-50%,-50%)" }}>
          <CallPacket text="db_query('DROP TABLE reports')" danger />
          {!frozen && <div style={{ position: "absolute", left: -170, top: "50%", width: 150, height: 3, background: `linear-gradient(90deg, transparent, ${MC.danger})`, boxShadow: `0 0 18px ${MC.danger}` }} />}
        </div>
      )}
      {/* kicker: "Now ask: what stops it?" */}
      {f > 205 && (
        <div style={{ position: "absolute", left: 130, top: 760, opacity: seg(f, 205, 30) }}>
          <Label text="now ask: what stops it?" color={MC.danger} size={30} spacing={3} />
        </div>
      )}
      {/* freeze signature: white-ish pulse + vignette clamp */}
      <AbsoluteFill
        style={{
          opacity: frozen ? 0.16 : flash * 0.3,
          background: "radial-gradient(ellipse 75% 65% at 50% 45%, transparent 40%, rgba(2,6,12,0.9) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};

// ===========================================================================
// 2 · REVEAL — gate slam, shatter, title draws from shards
// ===========================================================================
export const RevealBeat: React.FC = () => {
  const f = useCurrentFrame();
  const slam = inSpring(f, 4, MOTION.snap);
  const shatter = segOut(f, 22, 40);
  const title = inSpring(f, 58, MOTION.arrive);
  const sub = segOut(f, 130, 40);
  const ray = seg(f, 70, 110);
  return (
    <AbsoluteFill>
      <Board opacity={0.75} />
      {/* gate wall slams up across the packet path */}
      <div
        style={{
          position: "absolute",
          left: 880,
          bottom: 200,
          width: 160,
          height: 360 * slam,
          borderRadius: 18,
          border: `3px solid ${MC.code}`,
          background: `linear-gradient(180deg, ${MC.code}1e, ${MC.code}08)`,
          boxShadow: `0 0 ${60 + slam * 50}px ${MC.code}66`,
          transformOrigin: "bottom",
        }}
      />
      {/* hostile packet hits the gate */}
      <div style={{ position: "absolute", left: 860, top: 430, opacity: 1 - seg(f, 18, 8) }}>
        <CallPacket text="DROP TABLE reports" danger />
      </div>
      <div style={{ position: "absolute", left: 960, top: 450 }}>
        <Shards n={16} p={shatter} seed={7} />
      </div>
      {/* god-ray sweep behind the title */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(105deg, transparent ${30 + ray * 30}%, ${MC.code}18 ${44 + ray * 30}%, transparent ${58 + ray * 30}%)`,
        }}
      />
      {/* title */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 330, textAlign: "center", opacity: title, transform: `scale(${popScale(title, 0.9)})` }}>
        <div style={{ fontFamily: monoFont, fontSize: 26, color: MC.code, letterSpacing: 8, marginBottom: 22 }}>THIS DOES</div>
        <div style={{ fontFamily: titleFont, fontWeight: 700, fontSize: 118, color: MC.text, textShadow: tglow(MC.code, 50, 130), letterSpacing: -1 }}>
          MCP <span style={{ color: MC.code }}>Agent Toolkit</span>
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 620, textAlign: "center", opacity: sub }}>
        <div style={{ display: "inline-flex", gap: 18 }}>
          <Chip text="real MCP server" color={MC.code} size={24} />
          <Chip text="four guarded tools" color={MC.model} size={24} />
          <Chip text="any agent that speaks MCP" color={MC.human} size={24} />
        </div>
      </div>
      <MKicker text="tools any agent can use · rules no agent can break" bottom={150} />
    </AbsoluteFill>
  );
};

// ===========================================================================
// 3 · WHAT — the whole board, then anonymous clients plug in
// ===========================================================================
export const WhatBeat: React.FC = () => {
  const f = useCurrentFrame();
  const gates = ["rate limit", "sandbox", "sanitizer"];
  const clients = ["agent α", "agent β", "agent γ"];
  return (
    <AbsoluteFill>
      <Board />
      {/* client */}
      <div style={{ position: "absolute", left: 90, top: 400, opacity: inSpring(f, 2), transform: `translateX(${(1 - inSpring(f, 2)) * -50}px)` }}>
        <ClientNode w={320} />
      </div>
      {/* link + gates */}
      <svg width={1920} height="1080" style={{ position: "absolute", inset: 0 }}>
        <ProtocolLink x1={420} y1={470} x2={1080} y2={470} packets={3} packetFrom={140} />
      </svg>
      <div style={{ position: "absolute", left: 750, top: 705, transform: "translateX(-50%)", opacity: seg(f, 90, 30) }}>
        <Label text="stdio · JSON-RPC" color={MC.muted} size={19} />
      </div>
      {gates.map((g, i) => {
        const p = stagger(f, 60, i, 22);
        return (
          <div key={g} style={{ position: "absolute", left: 470 + i * 200, top: 330, opacity: p, transform: `scale(${popScale(p)})` }}>
            <Gate label={g} h={250} w={120} state={f > 160 ? "pass" : "idle"} flash={seg(f, 150 + i * 8, 20)} />
          </div>
        );
      })}
      {/* server with the four bays */}
      <div style={{ position: "absolute", left: 1060, top: 200, opacity: inSpring(f, 100), transform: `scale(${popScale(inSpring(f, 100), 0.94)})` }}>
        <ServerNode w={760} label="MCP server · 4 tools">
          <div style={{ display: "flex", gap: 14 }}>
            {(Object.keys(TOOL) as ToolName[]).map((tool, i) => {
              const p = stagger(f, 130, i, 14);
              return (
                <div key={tool} style={{ opacity: p, transform: `scale(${popScale(p)})` }}>
                  <ToolBay tool={tool} w={168} lit={p} />
                </div>
              );
            })}
          </div>
        </ServerNode>
      </div>
      {/* vault + sandbox island */}
      <div style={{ position: "absolute", left: 1180, top: 640, opacity: stagger(f, 210, 0) }}>
        <Vault w={330} />
      </div>
      <div style={{ position: "absolute", left: 1540, top: 660, opacity: stagger(f, 210, 1, 18) }}>
        <Chip text="sandbox island · write_file" color={MC.human} size={20} />
      </div>
      {/* anonymous clients plug in */}
      {clients.map((c, i) => {
        const p = stagger(f, 330, i, 40);
        return (
          <div key={c} style={{ position: "absolute", left: 130 + i * 240, top: 700, opacity: p, transform: `translateY(${(1 - p) * 46}px)` }}>
            <div style={{ width: 210, background: `${MC.panel}f5`, border: `2px solid ${MC.model}aa`, borderRadius: 16, padding: "14px 16px", textAlign: "center", boxShadow: glow(MC.model, 20, 60) }}>
              <div style={{ fontFamily: monoFont, fontSize: 22, color: MC.text }}>{c}</div>
              <div style={{ fontFamily: monoFont, fontSize: 15, color: MC.model, marginTop: 4 }}>speaks MCP</div>
            </div>
          </div>
        );
      })}
      <MTitle top={90} size={52}>A real MCP server — one protocol, four guarded tools.</MTitle>
    </AbsoluteFill>
  );
};

// ===========================================================================
// 4 · DISCOVER — tools/list at runtime; unplug a bay → next run adapts
// ===========================================================================
export const DiscoverBeat: React.FC = () => {
  const f = useCurrentFrame();
  const shelf = (Object.keys(TOOL) as ToolName[]);
  const listPkt = seg(f, 40, 90); // tools/list packet position on the link
  const unplugged = f > 340;
  return (
    <AbsoluteFill>
      <Board opacity={0.9} />
      <div style={{ position: "absolute", left: 90, top: 380 }}>
        <ClientNode w={300} label="agent client" />
      </div>
      <svg width={1920} height="1080" style={{ position: "absolute", inset: 0 }}>
        <ProtocolLink x1={400} y1={450} x2={880} y2={450} packets={0} />
        {/* the tools/list request packet */}
        {listPkt > 0 && listPkt < 1 && (
          <g>
            <rect x={400 + 480 * listPkt - 120} y={424} width={240} height={52} rx={14} fill={MC.panel2} stroke={MC.code} strokeWidth={2.5} />
            <text x={400 + 480 * listPkt} y={458} textAnchor="middle" fontFamily={monoFont} fontSize={24} fill="#D8FFF6">tools/list</text>
          </g>
        )}
      </svg>
      {/* server + bays lighting in arpeggio */}
      <div style={{ position: "absolute", left: 900, top: 190 }}>
        <ServerNode w={880} label="MCP server">
          <div style={{ display: "flex", gap: 16 }}>
            {shelf.map((tool, i) => {
              const p = stagger(f, 110, i, 20);
              const off = unplugged && tool === "write_file";
              return (
                <div key={tool} style={{ opacity: off ? 0.4 : p, transform: `scale(${popScale(p)})` }}>
                  <ToolBay tool={tool} w={196} lit={p} off={off} />
                </div>
              );
            })}
          </div>
        </ServerNode>
      </div>
      {/* schema chips fly to the model's shelf */}
      <div style={{ position: "absolute", left: 900, top: 150, display: "flex", gap: 14 }}>
        {shelf.map((tool, i) => {
          const p = stagger(f, 150, i, 20);
          const gone = unplugged && tool === "write_file";
          return (
            <div key={tool} style={{ opacity: gone ? p * (1 - seg(f, 340, 20)) : p, transform: `translateY(${(1 - p) * 40}px)` }}>
              <Chip text={`{ "${tool}" }`} color={TOOL[tool].color} size={18} />
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: 900, top: 118, opacity: seg(f, 130, 30) }}>
        <Label text="model's tool shelf" color={MC.model} size={18} spacing={3} />
      </div>
      {/* unplug + next-run proof strip */}
      {unplugged && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 800, textAlign: "center", opacity: inSpring(f, 345) }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 18, background: `${MC.panel}f5`, border: `2px solid ${MC.line}`, borderRadius: 16, padding: "18px 26px" }}>
            <Label text="next run" color={MC.muted} size={20} />
            {shelf.filter((t) => t !== "write_file").map((t) => <Chip key={t} text={t} color={TOOL[t].color} size={20} />)}
            <StatusPill text="still answers ✓" color={MC.code} size={20} />
          </div>
        </div>
      )}
      <MTitle top={40} size={48}>Discovered at runtime — remove a tool, it adapts.</MTitle>
    </AbsoluteFill>
  );
};

// ===========================================================================
// 5 · GAUNTLET — pass run, hostile run (passes rate, dies at sandbox), burst
// ===========================================================================
export const GauntletBeat: React.FC = () => {
  const f = useCurrentFrame();
  const G = ["rate limit", "sandbox", "sanitizer"];
  const GX = [470, 830, 1190]; // gate centers
  // run 1 — legit call crosses all three
  const r1 = ease(seg(f, 30, 150));
  const r1x = lerp(160, 1560, r1);
  // run 2 — hostile call: passes gate 1, dies at gate 2
  const r2 = ease(seg(f, 210, 150));
  const r2x = lerp(160, 1105, r2);
  const boom = f > 360;
  const chipFly = seg(f, 380, 90); // forbidden chip back to the client
  // run 3 — burst into rate limit
  const burst = seg(f, 470, 80);
  const gateState = (i: number): "idle" | "pass" | "block" => {
    if (i === 0) {
      if (burst > 0.85) return "block";
      if (r2x > GX[0] - 60 || r1x > GX[0] - 60) return "pass";
      return "idle";
    }
    if (i === 1) {
      if (boom) return "block";
      if (r1x > GX[1] - 60) return "pass";
      return "idle";
    }
    return r1x > GX[2] - 60 ? "pass" : "idle";
  };
  return (
    <AbsoluteFill>
      <Board opacity={0.85} />
      <MTitle top={70} size={50}>Every call runs the gauntlet.</MTitle>
      {G.map((g, i) => (
        <div key={g} style={{ position: "absolute", left: GX[i] - 65, top: 300 }}>
          <Gate label={g} sub={["60 calls/min", "fs + sql jail", "strip + clip"][i]} h={330} w={130} state={gateState(i)} flash={seg(f, i === 0 ? 60 : 100, 30)} />
        </div>
      ))}
      {/* legit packet */}
      {r1 < 1 && (
        <div style={{ position: "absolute", left: r1x, top: 470, transform: "translate(-50%,-50%)" }}>
          <CallPacket text="db_query('SELECT title FROM reports')" small />
        </div>
      )}
      {r1 >= 1 && f < 205 && (
        <div style={{ position: "absolute", left: 1470, top: 445, opacity: 1 - seg(f, 190, 15) }}>
          <StatusPill text="result → model" color={MC.code} size={22} />
        </div>
      )}
      {/* hostile packet */}
      {r2 > 0 && !boom && (
        <div style={{ position: "absolute", left: r2x, top: 555, transform: "translate(-50%,-50%)" }}>
          <CallPacket text="read_file('../../etc/passwd')" danger small />
        </div>
      )}
      {boom && (
        <>
          <div style={{ position: "absolute", left: 1105, top: 555, opacity: 1 - seg(f, 420, 70) }}>
            <Shards n={14} p={segOut(f, 362, 40)} seed={4} />
          </div>
          {/* typed error flies back to the model */}
          <div style={{ position: "absolute", left: lerp(1105, 300, ease(chipFly)), top: 555, transform: "translate(-50%,-50%)", opacity: chipFly < 1 ? 1 : 0 }}>
            <ErrorChip code="forbidden" size={26} />
          </div>
        </>
      )}
      {/* burst → rate_limited */}
      {burst > 0 && (
        <div style={{ position: "absolute", left: 120, top: 300, opacity: burst }}>
          {[0, 1, 2].map((i) => (
            <div key={i} style={{ position: "absolute", left: burst * 320 + i * 26, top: i * 46 }}>
              <CallPacket text="web_search(…)" small danger={i === 2} />
            </div>
          ))}
        </div>
      )}
      {burst > 0.8 && (
        <div style={{ position: "absolute", left: 320, top: 320, opacity: seg(f, 500, 15) }}>
          <ErrorChip code="rate_limited" size={24} />
        </div>
      )}
      <MKicker text="a typed error — never silence" bottom={195} />
    </AbsoluteFill>
  );
};

// ===========================================================================
// 6 · HARDENED — read-only twice; shoreline blocks ../ and symlinks
// ===========================================================================
export const HardenedBeat: React.FC = () => {
  const f = useCurrentFrame();
  const atk1 = ease(seg(f, 50, 110));
  const atk2 = ease(seg(f, 170, 110));
  const boom1 = atk1 >= 1;
  const boom2 = atk2 >= 1;
  const shore = 1150; // sandbox boundary x
  const esc = ease(seg(f, 300, 110));
  const escx = lerp(880, 1400, esc);
  return (
    <AbsoluteFill>
      <Board opacity={0.85} />
      <MTitle top={70} size={50}>Read-only, twice. Files can't escape.</MTitle>
      {/* vault + two attacks */}
      <div style={{ position: "absolute", left: 300, top: 430 }}>
        <Vault w={380} />
      </div>
      {!boom1 && (
        <div style={{ position: "absolute", left: lerp(-40, 240, atk1), top: 400 }}>
          <CallPacket text="db_query('DROP TABLE reports')" danger small />
        </div>
      )}
      {boom1 && (
        <div style={{ position: "absolute", left: 300, top: 400 }}>
          <Shards n={10} p={segOut(f, 160, 30)} seed={9} />
          <div style={{ position: "absolute", left: 30, top: -46, opacity: seg(f, 170, 15) }}><ErrorChip code="forbidden" size={22} /></div>
        </div>
      )}
      {f > 165 && !boom2 && (
        <div style={{ position: "absolute", left: lerp(-40, 240, atk2), top: 640 }}>
          <CallPacket text="db_query('INSERT INTO reports…')" danger small />
        </div>
      )}
      {boom2 && (
        <div style={{ position: "absolute", left: 300, top: 640 }}>
          <Shards n={10} p={segOut(f, 282, 30)} seed={13} />
          <div style={{ position: "absolute", left: 30, top: -46, opacity: seg(f, 290, 15) }}><ErrorChip code="forbidden" size={22} /></div>
        </div>
      )}
      {/* shoreline */}
      <div style={{ position: "absolute", left: shore, top: 220, bottom: 220, width: 0, borderLeft: `3px dashed ${MC.human}` }} />
      <div style={{ position: "absolute", left: shore + 20, top: 200 }}>
        <Label text="sandbox root" color={MC.human} size={19} />
      </div>
      {/* files inside */}
      {[0, 1, 2].map((i) => (
        <div key={i} style={{ position: "absolute", left: shore + 60 + i * 130, top: 420 + drift(f, i * 5, 6), opacity: stagger(f, 90, i, 16) }}>
          <ToolGlyph tool="read_file" size={54} color={MC.human} />
          <div style={{ fontFamily: monoFont, fontSize: 15, color: MC.muted, marginTop: 6 }}>{["q3.md", "q4.md", "sec.md"][i]}</div>
        </div>
      ))}
      {/* ../ escape + symlink bridge */}
      {esc > 0 && escx < shore + 40 && (
        <div style={{ position: "absolute", left: escx, top: 640, transform: "translate(-50%,-50%)" }}>
          <CallPacket text="read_file('../../etc/passwd')" danger small />
        </div>
      )}
      {escx >= shore + 40 && (
        <div style={{ position: "absolute", left: shore + 40, top: 640 }}>
          <Shards n={10} p={segOut(f, 415, 30)} seed={17} color={MC.danger} />
          <div style={{ position: "absolute", left: 0, top: 60, opacity: seg(f, 420, 15) }}><ErrorChip code="forbidden · path escapes sandbox" size={19} /></div>
        </div>
      )}
      {f > 360 && (
        <div style={{ position: "absolute", left: shore - 40, top: 330, opacity: seg(f, 360, 25), transform: `rotate(90deg)` }}>
          <Label text="✕ symlink bridge retracts" color={MC.danger} size={17} spacing={2} />
        </div>
      )}
      <MKicker text="statement guard + read-only connection · sandbox root + no symlink escape" bottom={195} />
    </AbsoluteFill>
  );
};

// ===========================================================================
// 7 · BOUNDED — iteration ring + exit gates + cost cap ghost run
// ===========================================================================
export const BoundedBeat: React.FC = () => {
  const f = useCurrentFrame();
  const ring = ease(seg(f, 30, 180));
  const segs = 8;
  const exits = [
    { label: "answer", col: MC.code },
    { label: "iteration_limit", col: MC.human },
    { label: "budget_limit", col: MC.danger },
  ];
  const exitPick = seg(f, 230, 40);
  const ghost = seg(f, 300, 80);
  return (
    <AbsoluteFill>
      <Board opacity={0.85} />
      <MTitle top={70} size={50}>Every run is bounded.</MTitle>
      {/* iteration ring */}
      <div style={{ position: "absolute", left: 260, top: 330 }}>
        <svg width={360} height={360} viewBox="0 0 200 200">
          {Array.from({ length: segs }, (_, i) => {
            const a = (i / segs) * Math.PI * 2 - Math.PI / 2;
            const on = i < Math.floor(ring * 3.2);
            const col = on ? MC.code : MC.line;
            return (
              <path
                key={i}
                d={`M ${100 + Math.cos(a) * 58} ${100 + Math.sin(a) * 58} A 58 58 0 0 1 ${100 + Math.cos(a + 0.62) * 58} ${100 + Math.sin(a + 0.62) * 58}`}
                stroke={col}
                strokeWidth={on ? 12 : 7}
                fill="none"
                strokeLinecap="round"
                style={{ filter: on ? `drop-shadow(0 0 8px ${MC.code})` : "none" }}
              />
            );
          })}
          <text x={100} y={94} textAnchor="middle" fontFamily={titleFont} fontWeight={700} fontSize={34} fill={MC.text}>
            {Math.max(1, Math.floor(ring * 3.2))}/8
          </text>
          <text x={100} y={122} textAnchor="middle" fontFamily={monoFont} fontSize={13} fill={MC.muted}>
            tool iterations
          </text>
        </svg>
      </div>
      {/* exit gates */}
      <div style={{ position: "absolute", left: 820, top: 310, display: "flex", flexDirection: "column", gap: 26 }}>
        {exits.map((e, i) => {
          const picked = i === 0 && exitPick > 0.6;
          const ghostHit = i === 2 && ghost > 0.85;
          return (
            <div
              key={e.label}
              style={{
                width: 620,
                display: "flex",
                alignItems: "center",
                gap: 18,
                background: `${MC.panel}f5`,
                border: `2.5px solid ${picked || ghostHit ? e.col : MC.line}`,
                borderRadius: 16,
                padding: "20px 24px",
                boxShadow: picked || ghostHit ? glow(e.col, 30, 80) : "none",
                opacity: inSpring(f, 60 + i * 18),
              }}
            >
              <span style={{ fontFamily: monoFont, fontSize: 26, fontWeight: 700, color: picked || ghostHit ? e.col : MC.muted }}>{e.label}</span>
              {picked && (
                <span style={{ display: "inline-flex", gap: 8, marginLeft: "auto" }}>
                  {["S1", "S2", "S3"].map((s) => <Chip key={s} text={s} color={MC.code} size={17} />)}
                </span>
              )}
              {i === 1 && <span style={{ marginLeft: "auto", fontFamily: monoFont, fontSize: 18, color: MC.muted }}>max 8 (bounded ≤ 50)</span>}
              {ghostHit && <span style={{ marginLeft: "auto", fontFamily: monoFont, fontSize: 18, color: MC.danger }}>cap hit → stop</span>}
            </div>
          );
        })}
      </div>
      {/* ghost cost meter */}
      <div style={{ position: "absolute", left: 260, top: 760, opacity: ghost }}>
        <div style={{ width: 420, height: 16, borderRadius: 8, background: `${MC.line}88`, overflow: "hidden", position: "relative" }}>
          <div style={{ width: `${Math.min(1, ghost * 1.15) * 100}%`, height: "100%", background: `linear-gradient(90deg, ${MC.human}55, ${MC.danger})` }} />
        </div>
        <div style={{ fontFamily: monoFont, fontSize: 17, color: MC.muted, marginTop: 8 }}>hard budget cap — a ghost run stops here</div>
      </div>
      <MKicker text="answer · iteration limit · budget cap — nothing runs away" bottom={195} />
    </AbsoluteFill>
  );
};

// ===========================================================================
// 8 · REGISTRY — prompt cards on the upper deck; v4 wins the arena
// ===========================================================================
export const RegistryBeat: React.FC = () => {
  const f = useCurrentFrame();
  const deck = segOut(f, 20, 60);
  const race = ease(seg(f, 200, 160));
  const stamp = inSpring(f, 380, MOTION.snap);
  return (
    <AbsoluteFill>
      <Board opacity={0.85} />
      {/* upper deck */}
      <div style={{ position: "absolute", left: 120, right: 120, top: 250, borderTop: `2px dashed ${MC.line}`, opacity: deck }} />
      <div style={{ position: "absolute", left: 120, top: 222, opacity: deck }}>
        <Label text="prompt registry · upper deck" color={MC.human} size={20} />
      </div>
      {/* prompt card + version stack */}
      <div style={{ position: "absolute", left: 140, top: 300, transform: `translateY(${(1 - deck) * 160}px)`, opacity: deck }}>
        <div style={{ background: `${MC.panel}f5`, border: `2.5px solid ${MC.human}`, borderRadius: 20, padding: "22px 26px", width: 430, boxShadow: glow(MC.human, 30, 80) }}>
          <div style={{ fontFamily: monoFont, fontSize: 26, color: MC.text, fontWeight: 700 }}>agent_system</div>
          <div style={{ fontFamily: monoFont, fontSize: 18, color: MC.human, marginTop: 4 }}>prompt · live v4</div>
          <div style={{ display: "flex", gap: 12, marginTop: 18, flexWrap: "wrap" }}>
            <VersionChip v={1} state="rolled_back" small />
            <VersionChip v={2} state="blocked" small />
            <VersionChip v={3} state="promoted" small />
            <VersionChip v={4} state="promoted" small />
          </div>
        </div>
      </div>
      {/* A/B arena: v3 champion vs v4 candidate */}
      <div style={{ position: "absolute", left: 640, top: 300, opacity: seg(f, 140, 40) }}>
        <ABLane
          name="v3 · champion"
          w={560}
          bars={[
            { label: "grounding", value: 4.83 * race },
            { label: "adversarial", value: 5 * race, max: 5 },
            { label: "tool share", value: 4.5 * race },
          ]}
        />
        <div style={{ height: 22 }} />
        <ABLane
          name="v4 · candidate"
          w={560}
          winner={stamp > 0.5}
          bars={[
            { label: "grounding", value: 4.88 * race },
            { label: "adversarial", value: 5 * race, max: 5 },
            { label: "tool share", value: 4.55 * race },
          ]}
        />
      </div>
      {/* result stamp */}
      {stamp > 0 && (
        <div style={{ position: "absolute", left: 1330, top: 330, opacity: stamp, transform: `scale(${popScale(stamp, 0.6)}) rotate(-8deg)` }}>
          <div style={{ fontFamily: titleFont, fontWeight: 700, fontSize: 44, color: MC.code, border: `4px solid ${MC.code}`, borderRadius: 16, padding: "10px 26px", textShadow: tglow(MC.code) }}>
            PROMOTED ✓
          </div>
        </div>
      )}
      {/* v2 ghost + judge override note */}
      <div style={{ position: "absolute", left: 1330, top: 500, opacity: seg(f, 240, 40) }}>
        <VersionChip v={2} state="blocked" />
        <div style={{ fontFamily: monoFont, fontSize: 16, color: MC.muted, marginTop: 10, maxWidth: 300 }}>
          judge_rubric v2 · override — audited reason on record
        </div>
      </div>
      <MTitle top={70} size={50}>Prompts ship only by beating the champion.</MTitle>
      <MKicker text="live A/B gate · tolerance 0.1 · adversarial must stay 100%" bottom={195} />
    </AbsoluteFill>
  );
};

// ===========================================================================
// 9 · AUDIT — v2 blocked; hash chain; ghost edit → rewind → seal
// ===========================================================================
export const AuditBeat: React.FC = () => {
  const f = useCurrentFrame();
  const bars = ease(seg(f, 40, 140));
  const stamp = inSpring(f, 200, MOTION.snap);
  const chain = seg(f, 220, 120);
  const tamper = f > 330 && f < 390;
  const seal = inSpring(f, 395, MOTION.snap);
  return (
    <AbsoluteFill>
      <Board opacity={0.85} />
      <MTitle top={64} size={50}>v2 lost. It never shipped.</MTitle>
      {/* v2 result card */}
      <div style={{ position: "absolute", left: 110, top: 190, width: 520, background: `${MC.panel}f5`, border: `2px solid ${MC.danger}88`, borderRadius: 18, padding: "20px 24px" }}>
        <div style={{ fontFamily: monoFont, fontSize: 22, fontWeight: 700, color: MC.danger, marginBottom: 14 }}>v2 vs v1 · A/B gate</div>
        {[
          { l: "grounding", a: 3.71, b: 3.33 },
          { l: "adversarial", a: 13, b: 11, max: 13 },
        ].map((r) => (
          <div key={r.l} style={{ marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontFamily: monoFont, fontSize: 18, color: MC.muted }}>
              <span>{r.l}</span>
              <span style={{ color: MC.danger }}>{r.a} → {(r.a + (r.b - r.a) * bars).toFixed(r.max ? 0 : 2)}</span>
            </div>
            <div style={{ height: 12, borderRadius: 6, background: `${MC.line}88`, marginTop: 6 }}>
              <div style={{ width: `${(r.b / (r.max ?? 5)) * 100 * bars}%`, height: "100%", background: MC.danger, borderRadius: 6 }} />
            </div>
          </div>
        ))}
      </div>
      {stamp > 0 && (
        <div style={{ position: "absolute", left: 310, top: 195, opacity: stamp, transform: `scale(${popScale(stamp, 0.5)}) rotate(-10deg)` }}>
          <div style={{ fontFamily: titleFont, fontWeight: 700, fontSize: 50, color: MC.danger, border: `4px solid ${MC.danger}`, borderRadius: 16, padding: "8px 26px", textShadow: tglow(MC.danger) }}>
            BLOCKED
          </div>
        </div>
      )}
      <div style={{ position: "absolute", left: 110, top: 480, opacity: seg(f, 240, 30) }}>
        <BlockedDialog w={520} />
      </div>
      {/* audit chain */}
      <div style={{ position: "absolute", left: 700, top: 240 }}>
        <AuditChain w={1120} progress={chain} tampered={tamper} compact />
        {seal > 0 && (
          <div style={{ position: "absolute", right: 10, top: -64, opacity: seal, transform: `scale(${popScale(seal, 0.6)})` }}>
            <StatusPill text="verified: true" color={MC.code} size={24} />
          </div>
        )}
        <div style={{ fontFamily: monoFont, fontSize: 18, color: MC.muted, marginTop: 18 }}>
          {tamper ? "ghost edit → every later link turns red" : "every decision is a hash-chained event"}
        </div>
      </div>
      <MKicker text="tamper-evident · not tamper-proof" bottom={195} color={MC.human} />
    </AbsoluteFill>
  );
};

// ===========================================================================
// 10 · CONTROL — model thinks / code enforces / people sign off
// ===========================================================================
export const ControlBeat: React.FC = () => {
  const f = useCurrentFrame();
  const cols = [
    { head: "MODEL", col: MC.model, items: ["agent loop", "judge (different model)"] },
    { head: "CODE", col: MC.code, items: ["gauntlet gates", "budget cap", "a/b gate", "hash chain"] },
    { head: "HUMAN", col: MC.human, items: ["promote", "roll back", "override — with reason"] },
  ];
  return (
    <AbsoluteFill>
      <Board opacity={0.85} />
      <MTitle top={90} size={52}>Models think. Code enforces. People sign off.</MTitle>
      <div style={{ position: "absolute", left: 0, right: 0, top: 300, display: "flex", justifyContent: "center", gap: 90 }}>
        {cols.map((c, i) => {
          const p = stagger(f, 40, i, 34);
          return (
            <div key={c.head} style={{ width: 400, opacity: p, transform: `translateY(${(1 - p) * 50}px)` }}>
              <div style={{ background: `${MC.panel}f5`, border: `2.5px solid ${c.col}`, borderRadius: 20, padding: "24px 28px", boxShadow: glow(c.col, 30, 90) }}>
                <div style={{ fontFamily: monoFont, fontSize: 24, fontWeight: 700, color: c.col, letterSpacing: 4, marginBottom: 16 }}>{c.head}</div>
                {c.items.map((it, j) => (
                  <div key={it} style={{ fontFamily: bodyFont, fontSize: 24, color: MC.text, padding: "9px 0", borderTop: j ? `1px solid ${MC.line}` : "none", opacity: stagger(f, 80 + i * 34, j, 10) }}>
                    {it}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      <MKicker text="the reason is on record — always" bottom={195} />
    </AbsoluteFill>
  );
};

// ===========================================================================
// 11 · PROOF — the live scorecard, then the honest first-run arc
// ===========================================================================
export const ProofBeat: React.FC = () => {
  const f = useCurrentFrame();
  const rows: [string, string, string][] = [
    ["task success", "4.79 / 5", "gate ≥ 4.5"],
    ["grounding", "4.83 / 5", "gate ≥ 4.0"],
    ["tool usage", "4.88 / 5", "gate ≥ 4.0"],
    ["adversarial", "13 / 13", "= 13 / 13"],
    ["appropriate use", "100 %", "= 100 %"],
    ["citations", "100 %", "= 100 %"],
  ];
  const red = f > 430;
  const fixed = f > 520;
  return (
    <AbsoluteFill>
      <Board opacity={0.8} />
      <MTitle top={56} size={50}>Graded by a different model than the agent.</MTitle>
      <div style={{ position: "absolute", left: 0, right: 0, top: 116, textAlign: "center" }}>
        <Label text="live scorecard · dataset v1.2.0 · 24 questions · agent_system@v4 · judge_rubric@v2 · $0.0093 whole run" color={MC.muted} size={17} spacing={2} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 160, display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
        {rows.map(([l, v, g], i) => {
          const p = stagger(f, 30, i, 26);
          return (
            <div key={l} style={{ opacity: p, transform: `translateX(${(1 - p) * (i % 2 ? 60 : -60)}px)` }}>
              <ScoreRow label={l} value={v} gate={g} w={1320} size={0.82} />
            </div>
          );
        })}
        {/* the honest row */}
        {red && (
          <div style={{ opacity: inSpring(f, 432), transform: `scale(${popScale(inSpring(f, 432), 0.95)})` }}>
            {fixed ? (
              <ScoreRow label="first run → fixed via registry" value="3.58 → 4.83" gate="same gate · same rules" w={1320} size={0.82} ok />
            ) : (
              <ScoreRow label="first run · grounding" value="3.58" gate="< 4.0 · failed" w={1320} size={0.82} ok={false} />
            )}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};

// ===========================================================================
// 12 · RIGOR — CI rail lights stage by stage + console replicas + stack
// ===========================================================================
export const RigorBeat: React.FC = () => {
  const f = useCurrentFrame();
  const stages = ["ruff", "mypy --strict", "517 tests", "92.98 % branch", "54 e2e", "docker smoke"];
  const replicas = ["runs console", "prompt registry", "audit log"];
  return (
    <AbsoluteFill>
      <Board opacity={0.85} />
      <MTitle top={70} size={50}>Strict typing. Zero-secret CI.</MTitle>
      {/* CI rail */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 300, display: "flex", justifyContent: "center", alignItems: "center", gap: 0 }}>
        {stages.map((s, i) => {
          const p = stagger(f, 40, i, 32, MOTION.settle);
          return (
            <React.Fragment key={s}>
              {i > 0 && (
                <svg width={54} height={20} style={{ opacity: p }}>
                  <path d="M0 10h54" stroke={p > 0.5 ? MC.code : MC.line} strokeWidth={3.5} />
                  <path d="M42 3l10 7-10 7" fill="none" stroke={p > 0.5 ? MC.code : MC.line} strokeWidth={3.5} />
                </svg>
              )}
              <div
                style={{
                  background: `${MC.panel}f5`,
                  border: `2px solid ${p > 0.5 ? MC.code : MC.line}`,
                  borderRadius: 14,
                  padding: "16px 18px",
                  fontFamily: monoFont,
                  fontSize: 22,
                  color: p > 0.5 ? MC.text : MC.muted,
                  boxShadow: p > 0.5 ? glow(MC.code, 16, 50) : "none",
                  opacity: Math.max(0.35, p),
                }}
              >
                {s} {p > 0.9 && <span style={{ color: MC.code }}>✓</span>}
              </div>
            </React.Fragment>
          );
        })}
      </div>
      {/* console replica strip */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 470, display: "flex", justifyContent: "center", gap: 44 }}>
        {replicas.map((r, i) => {
          const p = stagger(f, 250, i, 20);
          return (
            <div key={r} style={{ opacity: p, transform: `translateY(${(1 - p) * 30}px)` }}>
              <div style={{ width: 340, background: MC.pc.raised, border: `1.5px solid ${MC.pc.lineStrong}`, borderRadius: 14, padding: "14px 16px", boxShadow: "0 18px 60px rgba(0,0,0,0.5)" }}>
                <div style={{ display: "flex", gap: 7, marginBottom: 10 }}>
                  {[0, 1, 2].map((d) => <span key={d} style={{ width: 9, height: 9, borderRadius: 5, background: MC.pc.lineStrong }} />)}
                  <span style={{ marginLeft: "auto", fontFamily: monoFont, fontSize: 14, color: MC.pc.muted }}>{r}</span>
                </div>
                {[0.9, 0.65, 0.8].map((w, j) => (
                  <div key={j} style={{ height: 9, width: `${w * 100}%`, borderRadius: 5, background: `${MC.pc.accent}${j === 1 ? "55" : "33"}`, marginBottom: 8 }} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 690, textAlign: "center", opacity: seg(f, 270, 40) }}>
        <Label text="console replicas · fictional data" color={MC.dim} size={17} spacing={3} />
      </div>
      {/* stack line */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 790, display: "flex", justifyContent: "center", gap: 14, opacity: seg(f, 320, 40) }}>
        {["Python", "MCP SDK", "FastAPI", "React", "SQLite", "Docker"].map((s) => <Chip key={s} text={s} color={MC.muted} size={19} dim />)}
      </div>
      <MKicker text="branch coverage on · CI runs with zero secrets" bottom={195} />
    </AbsoluteFill>
  );
};

// ===========================================================================
// 13 · BUILDER — constellation pull-back + credit line + your-tools-next
// ===========================================================================
export const BuilderBeat: React.FC = () => {
  const f = useCurrentFrame();
  const constellation = segOut(f, 10, 90);
  const credit = inSpring(f, 80, MOTION.arrive);
  const bay = inSpring(f, 300, MOTION.snap);
  // constellation nodes = board territories collapsed to points
  const nodes: [number, number, string][] = [
    [380, 420, MC.model], [640, 430, MC.code], [880, 430, MC.code], [1120, 430, MC.code],
    [1400, 400, MC.code], [1520, 620, MC.human], [1180, 640, MC.code],
    [900, 240, MC.human], [700, 250, MC.model], [1250, 250, MC.human],
  ];
  const links: [number, number][] = [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [4, 6], [7, 8], [7, 9], [8, 2]];
  const domains = ["knowledge base", "ticketing", "data warehouse"];
  const di = Math.min(2, Math.floor(seg(f, 330, 130) * 3));
  return (
    <AbsoluteFill>
      <Board opacity={0.7} />
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        {links.map(([a, b], i) => (
          <path
            key={i}
            d={`M${nodes[a][0]} ${nodes[a][1]} L${nodes[b][0]} ${nodes[b][1]}`}
            stroke={MC.line}
            strokeWidth={2}
            opacity={constellation}
          />
        ))}
        {nodes.map(([x, y, c], i) => (
          <g key={i} opacity={constellation}>
            <circle cx={x} cy={y} r={6 + Math.abs(noise1(i)) * 5} fill={c} opacity={0.85 + 0.15 * Math.sin(f * 0.08 + i)} />
            <circle cx={x} cy={y} r={16} fill={c} opacity={0.18} />
          </g>
        ))}
      </svg>
      {/* credit line */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 420, textAlign: "center", opacity: credit, transform: `scale(${popScale(credit, 0.94)})` }}>
        <div style={{ fontFamily: bodyFont, fontSize: 34, color: MC.muted, marginBottom: 14 }}>Designed, built, and measured by</div>
        <div style={{ fontFamily: titleFont, fontWeight: 700, fontSize: 84, color: MC.text, textShadow: tglow(MC.human, 40, 100) }}>
          Kaarsten <span style={{ color: MC.human }}>Anderson</span>
        </div>
      </div>
      {/* fifth bay snaps on */}
      {bay > 0 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 660, textAlign: "center", opacity: bay }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 16, background: `${MC.panel}f5`, border: `2.5px solid ${MC.code}`, borderRadius: 16, padding: "16px 24px", boxShadow: glow(MC.code, 30, 80) }}>
            <span style={{ fontFamily: monoFont, fontSize: 22, color: MC.code, fontWeight: 700 }}>+ bay 5</span>
            <span style={{ fontFamily: monoFont, fontSize: 20, color: MC.muted }}>your tools next →</span>
            <Chip text={domains[di]} color={MC.human} size={21} />
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};

// ===========================================================================
// 14 · CTA — end card with light-trail URL
// ===========================================================================
export const CtaBeat: React.FC = () => {
  const f = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const p = seg(f, 6, Math.min(150, durationInFrames - 40));
  const trail = seg(f, 30, 80);
  return (
    <AbsoluteFill>
      <Board opacity={0.7} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 210, display: "flex", justifyContent: "center" }}>
        <MEndCard progress={p} />
      </div>
      {/* light trail under the URL */}
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <path
          d="M560 430 H1360"
          stroke={MC.code}
          strokeWidth={4}
          strokeDasharray={`${800 * trail} 2000`}
          opacity={0.85}
          style={{ filter: `drop-shadow(0 0 12px ${MC.code})` }}
        />
        {trail > 0 && trail < 1 && <circle cx={560 + 800 * trail} cy={430} r={9} fill={MC.code} />}
      </svg>
    </AbsoluteFill>
  );
};

export const MBeatFor = (kind: string): React.FC => {
  switch (kind) {
    case "hook": return HookBeat;
    case "reveal": return RevealBeat;
    case "what": return WhatBeat;
    case "discover": return DiscoverBeat;
    case "gauntlet": return GauntletBeat;
    case "hardened": return HardenedBeat;
    case "bounded": return BoundedBeat;
    case "registry": return RegistryBeat;
    case "audit": return AuditBeat;
    case "control": return ControlBeat;
    case "proof": return ProofBeat;
    case "rigor": return RigorBeat;
    case "builder": return BuilderBeat;
    case "cta": return CtaBeat;
    default: return RevealBeat;
  }
};
