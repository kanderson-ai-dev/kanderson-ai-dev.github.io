/**
 * ThumbAgenticApi — dedicated YouTube thumbnail cards for the flagship film.
 * One still per variant; same grammar as mcptoolkit3/thumb3.
 * Variant via --props='{"variant":"brand"}' (brand|blocked|door).
 */
import React from "react";
import { AbsoluteFill } from "remotion";
import { Grain, Particles, Stage } from "../upgrade/primitives";
import { C, monoFont, titleFont } from "../upgrade/utheme";
import { ShieldIcon } from "../mcptoolkit3/icons3";
import { DoorBeat, ShieldBeat } from "./heroes";

const Headline: React.FC<{ children: React.ReactNode; top?: number }> = ({ children, top = 62 }) => (
  <div
    style={{
      position: "absolute", top, left: 0, right: 0, textAlign: "center",
      fontFamily: titleFont, fontWeight: 700, fontSize: 86, color: C.text,
      textShadow: "0 4px 18px #000", letterSpacing: -1,
    }}
  >
    {children}
  </div>
);

const Tag: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    style={{
      position: "absolute", bottom: 70, left: 0, right: 0, textAlign: "center",
      fontFamily: monoFont, fontSize: 30, color: C.muted, letterSpacing: 3,
    }}
  >
    {children}
  </div>
);

export const ThumbAgenticApi: React.FC<{ variant?: string; brackets?: boolean; url?: boolean }> = ({ variant = "brand", brackets = true, url = true }) => (
  <AbsoluteFill>
    <Stage dim={0.85} brackets={brackets}>
      <Particles count={22} />
      {variant === "brand" && (
        <>
          <div
            style={{
              position: "absolute", inset: 0, display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center", gap: 40,
            }}
          >
            <div
              style={{
                width: 180, height: 180, borderRadius: 48,
                background: `${C.accent}0e`, border: `4px solid ${C.accent}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: `0 0 90px ${C.accent}66, inset 0 0 50px ${C.accent}22`,
              }}
            >
              <ShieldIcon size={104} color={C.accent} />
            </div>
            <div style={{ fontFamily: titleFont, fontWeight: 800, fontSize: 96, color: C.text, textShadow: `0 0 60px ${C.accent}55` }}>
              Guardrailed <span style={{ color: C.accent }}>Agentic AI API</span>
            </div>
            <div style={{ fontFamily: titleFont, fontWeight: 500, fontSize: 44, color: C.muted }}>
              Attacks stay out. <span style={{ color: C.accent }}>Secrets stay in.</span>
            </div>
          </div>
          {url && <Tag>KAARSTENANDERSON.COM</Tag>}
        </>
      )}
      {variant === "blocked" && (
        <>
          <Headline>
            Attacks? <span style={{ color: C.danger }}>Blocked.</span>
          </Headline>
          <div style={{ position: "absolute", inset: 0, top: 190, transform: "scale(0.88)", transformOrigin: "50% 50%" }}>
            <ShieldBeat t={0.52} />
          </div>
          {url && <Tag>GUARDRAILED AGENTIC AI API — OWASP LLM01</Tag>}
        </>
      )}
      {variant === "door" && (
        <>
          <Headline>Every request <span style={{ color: C.accent }}>checked</span></Headline>
          <div style={{ position: "absolute", inset: 0, top: 120, transform: "scale(0.92)", transformOrigin: "50% 50%" }}>
            <DoorBeat t={0.55} />
          </div>
          {url && <Tag>GUARDRAILED AGENTIC AI API — TRACKED · KEYED</Tag>}
        </>
      )}
      <Grain />
    </Stage>
  </AbsoluteFill>
);
