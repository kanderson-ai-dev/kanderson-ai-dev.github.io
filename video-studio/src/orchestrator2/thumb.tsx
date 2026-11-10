/**
 * ThumbOrch2 — dedicated YouTube thumbnail for the upgrade film.
 * Type carries the claim on the left; a film beat is the hero on the right.
 * Variant via --props='{"variant":"debate"}' (debate|proof|stops).
 */
import React from "react";
import { AbsoluteFill } from "remotion";
import { Grain, Particles, Stage } from "../upgrade/primitives";
import { C, bodyFont, monoFont, titleFont } from "../upgrade/utheme";
import { ConstellationBeat, Promise2Beat, Promise3Beat } from "./heroes2b";
import { PenIcon, SearchIcon } from "../mcptoolkit3/icons3";
import { ChartIcon, CompassIcon, EyeIcon, PersonIcon, ScaleIcon } from "./oicons";

const Kicker: React.FC = () => (
  <div
    style={{
      fontFamily: monoFont,
      fontSize: 18,
      fontWeight: 700,
      letterSpacing: 4,
      color: C.accent,
      border: `1.5px solid ${C.accent}66`,
      borderRadius: 999,
      padding: "9px 20px",
      display: "inline-block",
      background: `${C.accent}0d`,
      whiteSpace: "nowrap",
    }}
  >
    LANGGRAPH MULTI-AGENT ORCHESTRATOR
  </div>
);

const Headline: React.FC<{ top: number; size?: number; children: React.ReactNode }> = ({ top, size = 76, children }) => (
  <div
    style={{
      position: "absolute",
      top,
      left: 60,
      fontFamily: titleFont,
      fontWeight: 800,
      fontSize: size,
      lineHeight: 1.02,
      letterSpacing: -2,
      color: C.text,
      textShadow: "0 6px 30px #000",
    }}
  >
    {children}
  </div>
);

const Sub: React.FC<{ top: number; children: React.ReactNode }> = ({ top, children }) => (
  <div
    style={{
      position: "absolute",
      left: 62,
      top,
      fontFamily: monoFont,
      fontSize: 21,
      letterSpacing: 1.5,
      color: C.muted,
      maxWidth: 480,
    }}
  >
    {children}
  </div>
);

const StatChip: React.FC<{ top: number; left: number; children: React.ReactNode }> = ({ top, left, children }) => (
  <div
    style={{
      position: "absolute",
      top,
      left,
      fontFamily: monoFont,
      fontSize: 20,
      fontWeight: 700,
      letterSpacing: 1,
      color: C.text,
      background: "#0d1418f2",
      border: `1.5px solid ${C.accent}55`,
      borderRadius: 12,
      padding: "12px 20px",
      boxShadow: `0 12px 40px #000c, 0 0 30px ${C.accent}22`,
      whiteSpace: "nowrap",
    }}
  >
    {children}
  </div>
);

const Url: React.FC = () => (
  <div
    style={{
      position: "absolute",
      bottom: 38,
      left: 60,
      fontFamily: monoFont,
      fontSize: 21,
      letterSpacing: 3,
      color: C.muted,
    }}
  >
    kaarstenanderson.com
  </div>
);

/** Clipped window that shows the interesting part of a 1920×1080 beat. */
const BeatWindow: React.FC<{
  cx: number;
  cy: number;
  scale?: number;
  children: React.ReactNode;
}> = ({ cx, cy, scale = 0.72, children }) => (
  <div style={{ position: "absolute", left: 620, top: 0, width: 660, height: 720, overflow: "hidden" }}>
    <div
      style={{
        position: "absolute",
        left: 330 - cx,
        top: 360 - cy,
        width: 1920,
        height: 1080,
        transform: `scale(${scale})`,
        transformOrigin: `${cx}px ${cy}px`,
      }}
    >
      {children}
    </div>
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: 140,
        height: 720,
        background: "linear-gradient(90deg, #070b0e 0%, transparent 100%)",
      }}
    />
  </div>
);

/* ---------------- dedicated multi-agent team diagram ---------------- */

type IconT = React.FC<{ size?: number; color?: string }>;

const NodeCard: React.FC<{
  x: number; y: number; name: string; job: string; Icon: IconT;
  color: string; w?: number; h?: number; nameSize?: number;
}> = ({ x, y, name, job, Icon, color, w = 232, h = 88, nameSize = 20 }) => (
  <div
    style={{
      position: "absolute",
      left: x - w / 2,
      top: y - h / 2,
      width: w,
      height: h,
      background: `linear-gradient(172deg, ${C.panel2}, ${C.panel})`,
      border: `2.5px solid ${color}`,
      borderRadius: 16,
      boxShadow: `0 14px 40px #000c, 0 0 26px ${color}33`,
      display: "flex",
      alignItems: "center",
      gap: 14,
      padding: "0 16px",
      boxSizing: "border-box",
    }}
  >
    <div
      style={{
        width: 52,
        height: 52,
        borderRadius: 26,
        background: `${color}14`,
        border: `2px solid ${color}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <Icon size={27} color={color} />
    </div>
    <div style={{ minWidth: 0 }}>
      <div style={{ fontFamily: titleFont, fontWeight: 700, fontSize: nameSize, color: C.text, whiteSpace: "nowrap" }}>{name}</div>
      <div style={{ fontFamily: bodyFont, fontSize: 13, color: C.muted, marginTop: 2, whiteSpace: "nowrap" }}>{job}</div>
    </div>
  </div>
);

const TEAM: { name: string; job: string; Icon: IconT; color: string; y: number }[] = [
  { name: "Researcher", job: "finds the facts", Icon: SearchIcon, color: C.model, y: 105 },
  { name: "Analyst", job: "runs the numbers", Icon: ChartIcon, color: C.model, y: 235 },
  { name: "Compliance", job: "checks the rules", Icon: ScaleIcon, color: C.model, y: 365 },
  { name: "Writer", job: "writes the report", Icon: PenIcon, color: C.model, y: 495 },
  { name: "The Critic", job: "checks every claim", Icon: EyeIcon, color: C.accent, y: 625 },
];

const HUB = { x: 760, y: 345 };
const COL_X = 1100;

const TeamDiagram: React.FC = () => (
  <>
    <svg width="1280" height="720" style={{ position: "absolute", inset: 0 }}>
      {/* supervisor -> each specialist */}
      {TEAM.map((a) => (
        <path
          key={a.name}
          d={`M${HUB.x + 115} ${HUB.y} C ${HUB.x + 155} ${HUB.y}, ${COL_X - 156} ${a.y}, ${COL_X - 116} ${a.y}`}
          stroke={a.color}
          strokeWidth="3.5"
          fill="none"
          opacity="0.55"
          style={{ filter: `drop-shadow(0 0 7px ${a.color})` }}
        />
      ))}
      {/* supervisor -> human gate */}
      <path
        d={`M${HUB.x} ${HUB.y + 58} V ${HUB.y + 126}`}
        stroke={C.warn}
        strokeWidth="3.5"
        fill="none"
        opacity="0.55"
        style={{ filter: `drop-shadow(0 0 7px ${C.warn})` }}
      />
    </svg>
    <NodeCard x={HUB.x} y={HUB.y} name="SUPERVISOR" job="an AI that routes" Icon={CompassIcon} color={C.accent} w={230} h={116} nameSize={20} />
    {TEAM.map((a) => (
      <NodeCard key={a.name} x={COL_X} y={a.y} name={a.name} job={a.job} Icon={a.Icon} color={a.color} />
    ))}
    <NodeCard x={HUB.x} y={HUB.y + 164} name="HUMAN" job="final call" Icon={PersonIcon} color={C.warn} w={220} h={76} nameSize={19} />
  </>
);

export const ThumbOrch2: React.FC<{ variant?: string; brackets?: boolean; url?: boolean }> = ({ variant = "team", brackets = true, url = true }) => (
  <AbsoluteFill>
    <Stage dim={0.9} brackets={brackets}>
      <Particles count={18} />
      {variant === "team" && (
        <>
          <div style={{ position: "absolute", left: 60, top: 96 }}>
            <Kicker />
          </div>
          <Headline top={162} size={78}>
            MULTI-AGENT
            <br />
            <span style={{ color: C.accent, textShadow: `0 0 44px ${C.accent}77` }}>TEAM.</span>
          </Headline>
          <Sub top={352}>a lead routes your brief to five AI specialists — a human keeps the final call</Sub>
          <StatChip top={462} left={60}>
            ~$0.01 <span style={{ color: C.muted, fontWeight: 400 }}>per report · every word proven</span>
          </StatChip>
          <TeamDiagram />
          {url && <Url />}
        </>
      )}
      {variant === "debate" && (
        <>
          <div style={{ position: "absolute", left: 60, top: 96 }}>
            <Kicker />
          </div>
          <Headline top={162}>
            AGENTS THAT
            <br />
            <span style={{ color: C.accent, textShadow: `0 0 44px ${C.accent}77` }}>DEBATE.</span>
          </Headline>
          <Sub top={356}>reports that hold up — a receipt for every claim</Sub>
          <StatChip top={420} left={60}>
            ~$0.01 <span style={{ color: C.muted, fontWeight: 400 }}>per report · measured</span>
          </StatChip>
          <BeatWindow cx={960} cy={480} scale={0.78}>
            <ConstellationBeat t={1} />
          </BeatWindow>
          {url && <Url />}
        </>
      )}
      {variant === "proof" && (
        <>
          <div style={{ position: "absolute", left: 60, top: 96 }}>
            <Kicker />
          </div>
          <Headline top={162}>
            PROOF FOR
            <br />
            <span style={{ color: C.accent, textShadow: `0 0 44px ${C.accent}77` }}>EVERY WORD.</span>
          </Headline>
          <Sub top={356}>each step sealed into a chain of receipts</Sub>
          <StatChip top={420} left={60}>
            26 <span style={{ color: C.muted, fontWeight: 400 }}>sealed sources · evidence manifest</span>
          </StatChip>
          <BeatWindow cx={960} cy={470} scale={0.8}>
            <Promise3Beat t={1} />
          </BeatWindow>
          {url && <Url />}
        </>
      )}
      {variant === "stops" && (
        <>
          <div style={{ position: "absolute", left: 60, top: 96 }}>
            <Kicker />
          </div>
          <Headline top={162}>
            STOPS.
            <br />
            <span style={{ color: C.danger, textShadow: `0 0 44px ${C.danger}77` }}>NOT SORRY.</span>
          </Headline>
          <Sub top={356}>budget enforced in code — before every AI call</Sub>
          <StatChip top={420} left={60}>
            $0.0060 <span style={{ color: C.muted, fontWeight: 400 }}>cap · it stops and asks you</span>
          </StatChip>
          <BeatWindow cx={960} cy={440} scale={0.78}>
            <Promise2Beat t={1} />
          </BeatWindow>
          {url && <Url />}
        </>
      )}
      <Grain />
    </Stage>
  </AbsoluteFill>
);
