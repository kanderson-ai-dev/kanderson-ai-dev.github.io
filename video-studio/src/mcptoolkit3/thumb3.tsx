/**
 * Thumb3 — dedicated YouTube thumbnail cards for the v3 film.
 * One still per variant; reuses the flat stage + hero beats, minus captions.
 * Variant is passed via --props='{"variant":"keys"}' (keys|blocked|brand).
 */
import React from "react";
import { AbsoluteFill } from "remotion";
import { Grain, Particles, Stage } from "../upgrade/primitives";
import { C, monoFont, titleFont } from "../upgrade/utheme";
import { CheckpointBeat, KeyCardsBeat } from "./heroes3";
import { PlugIcon } from "./icons3";

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

export const Thumb3: React.FC<{ variant?: string; brackets?: boolean; url?: boolean }> = ({ variant = "keys", brackets = true, url = true }) => (
  <AbsoluteFill>
    <Stage dim={0.85} brackets={brackets}>
      <Particles count={22} />
      {variant === "keys" && (
        <>
          <Headline>
            Give your AI agent <span style={{ color: C.accent }}>the keys</span>
          </Headline>
          <div style={{ position: "absolute", inset: 0, top: 140, transform: "scale(0.92)" }}>
            <KeyCardsBeat t={1} />
          </div>
          {url && <Tag>MCP AGENT TOOLKIT — UNDER YOUR RULES</Tag>}
        </>
      )}
      {variant === "blocked" && (
        <>
          <Headline>
            Blocked — <span style={{ color: C.danger }}>loudly.</span>
          </Headline>
          <div style={{ position: "absolute", inset: 0, top: 150, transform: "scale(0.94)" }}>
            <CheckpointBeat t={0.88} />
          </div>
          {url && <Tag>MCP AGENT TOOLKIT — EVERY CALL CHECKED IN CODE</Tag>}
        </>
      )}
      {variant === "brand" && (
        <>
          <div
            style={{
              position: "absolute", inset: 0, display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center", gap: 44,
            }}
          >
            <div
              style={{
                width: 190, height: 190, borderRadius: 52,
                background: `${C.accent}0e`, border: `4px solid ${C.accent}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: `0 0 90px ${C.accent}66, inset 0 0 50px ${C.accent}22`,
              }}
            >
              <PlugIcon size={110} color={C.accent} />
            </div>
            <div style={{ fontFamily: titleFont, fontWeight: 800, fontSize: 128, color: C.text, textShadow: `0 0 60px ${C.accent}55` }}>
              MCP <span style={{ color: C.accent }}>Agent Toolkit</span>
            </div>
            <div style={{ fontFamily: titleFont, fontWeight: 500, fontSize: 46, color: C.muted }}>
              Real tools for any AI agent — <span style={{ color: C.human }}>under your rules.</span>
            </div>
          </div>
          {url && <Tag>KAARSTENANDERSON.COM</Tag>}
        </>
      )}
      <Grain />
    </Stage>
  </AbsoluteFill>
);
