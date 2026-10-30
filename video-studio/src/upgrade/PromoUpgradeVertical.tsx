import React from "react";
import { AbsoluteFill } from "remotion";
import { Captions, PromoUpgrade, UpgradeProps } from "./PromoUpgrade";
import { Grain, Particles } from "./primitives";
import { C, titleFont } from "./utheme";

// 9:16 re-composition: the same 16:9 scene stack is scaled to full width and
// centered; captions sit in a dedicated band below the picture instead of
// overlapping the footage. Nothing is cropped.
const SRC_W = 1920;
const SRC_H = 1080;
const SCALE = 1080 / SRC_W; // 0.5625
const PIC_H = SRC_H * SCALE; // 607.5
const PIC_TOP = (1920 - PIC_H) / 2 - 80;

export const PromoUpgradeVertical: React.FC<UpgradeProps> = (props) => {
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      <div
        style={{
          position: "absolute",
          top: 330,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: titleFont,
          fontWeight: 700,
          fontSize: 30,
          letterSpacing: 10,
          color: C.accent,
          opacity: 0.85,
        }}
      >
        E-COMMERCE SUPPORT &amp; RETURNS COPILOT
      </div>
      <AbsoluteFill
        style={{
          top: PIC_TOP,
          left: 0,
          width: SRC_W,
          height: SRC_H,
          transform: `scale(${SCALE})`,
          transformOrigin: "top left",
          overflow: "hidden",
        }}
      >
        <PromoUpgrade {...props} burnSubtitles={false} fadeOutSec={0} />
      </AbsoluteFill>
      {props.burnSubtitles !== false && props.subtitles && (
        <div style={{ position: "absolute", left: 0, right: 0, top: PIC_TOP + PIC_H + 30, height: 420 }}>
          <Captions cues={props.subtitles} />
        </div>
      )}
      <div
        style={{
          position: "absolute",
          bottom: 260,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: titleFont,
          fontWeight: 500,
          fontSize: 26,
          letterSpacing: 4,
          color: C.text,
          opacity: 0.55,
        }}
      >
        kaarstenanderson.com
      </div>
      <Particles />
      <Grain />
    </AbsoluteFill>
  );
};
