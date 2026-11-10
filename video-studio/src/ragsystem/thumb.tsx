/**
 * ThumbRag — dedicated YouTube thumbnail cards for the film promo.
 * One still per variant; real app UI is the hero, type carries the claim.
 * Variant is passed via --props='{"variant":"proof"}' (proof|stopped|brand).
 */
import React from "react";
import { AbsoluteFill } from "remotion";
import { Grain, Particles, Stage } from "../upgrade/primitives";
import { C, monoFont, titleFont } from "../upgrade/utheme";
import { RealFrame } from "./RealFrame";
import { RevealBeat } from "./heroes";

const Kicker: React.FC = () => (
  <div
    style={{
      fontFamily: monoFont,
      fontSize: 19,
      fontWeight: 700,
      letterSpacing: 4,
      color: C.accent,
      border: `1.5px solid ${C.accent}66`,
      borderRadius: 999,
      padding: "9px 20px",
      display: "inline-block",
      background: `${C.accent}0d`,
    }}
  >
    AGENTIC RAG &amp; KNOWLEDGE SYSTEM
  </div>
);

const Headline: React.FC<{ top: number; size?: number; children: React.ReactNode }> = ({ top, size = 82, children }) => (
  <div
    style={{
      position: "absolute",
      top,
      left: 64,
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
      left: 66,
      top,
      fontFamily: monoFont,
      fontSize: 22,
      letterSpacing: 1.5,
      color: C.muted,
      maxWidth: 470,
    }}
  >
    {children}
  </div>
);

const Url: React.FC = () => (
  <div
    style={{
      position: "absolute",
      bottom: 40,
      left: 64,
      fontFamily: monoFont,
      fontSize: 22,
      letterSpacing: 3,
      color: C.muted,
    }}
  >
    kaarstenanderson.com
  </div>
);

/** Glass stat chip floating at the frame's lower edge. */
const StatChip: React.FC<{ top: number; left: number; children: React.ReactNode }> = ({
  top,
  left,
  children,
}) => (
  <div
    style={{
      position: "absolute",
      top,
      left,
      fontFamily: monoFont,
      fontSize: 21,
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

/** The chat answer card — question + answer + source chips + version footer. */
const ChatFrame: React.FC = () => (
  <div
    style={{
      position: "absolute",
      left: 584,
      top: 200,
      transform: "rotate(-2deg)",
    }}
  >
    <RealFrame
      file="rag/console-chat.png"
      size={[912, 384]}
      crop={[0, 26, 912, 306]}
      width={640}
      tag=""
      highlights={[{ rect: [46, 220, 320, 64], color: C.accent }]}
    />
  </div>
);

/** The human-review modal — proof the system stops instead of guessing. */
const ModalFrame: React.FC = () => (
  <div
    style={{
      position: "absolute",
      left: 600,
      top: 70,
      transform: "rotate(-2deg)",
    }}
  >
    <RealFrame
      file="rag/console-hitl-modal.png"
      size={[1280, 1000]}
      crop={[372, 168, 540, 480]}
      width={600}
      tag=""
    />
  </div>
);

export const ThumbRag: React.FC<{ variant?: string; brackets?: boolean; url?: boolean }> = ({ variant = "proof", brackets = true, url = true }) => (
  <AbsoluteFill>
    <Stage dim={0.88} brackets={brackets}>
      <Particles count={18} />
      {variant === "proof" && (
        <>
          <div style={{ position: "absolute", left: 64, top: 102 }}>
            <Kicker />
          </div>
          <Headline top={168}>
            ANSWERS
            <br />
            <span style={{ color: C.accent, textShadow: `0 0 44px ${C.accent}77` }}>WITH PROOF.</span>
          </Headline>
          <Sub top={376}>every answer · every source</Sub>
          <StatChip top={436} left={64}>
            $0.0004 <span style={{ color: C.muted, fontWeight: 400 }}>per answer · measured</span>
          </StatChip>
          <ChatFrame />
          {url && <Url />}
        </>
      )}
      {variant === "stopped" && (
        <>
          <div style={{ position: "absolute", left: 64, top: 126 }}>
            <Kicker />
          </div>
          <Headline top={200} size={92}>
            IT WON&apos;T
            <br />
            <span style={{ color: C.danger, textShadow: `0 0 44px ${C.danger}77` }}>GUESS.</span>
          </Headline>
          <Sub top={428}>it stops — and asks a person</Sub>
          <ModalFrame />
          {url && <Url />}
        </>
      )}
      {variant === "brand" && (
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: 1920,
            height: 1080,
            transform: "scale(0.67)",
            transformOrigin: "320px 360px",
          }}
        >
          <RevealBeat t={1} />
        </div>
      )}
      <Grain />
    </Stage>
  </AbsoluteFill>
);
