/**
 * RealFrame — a real app screenshot inside a designed browser frame.
 * Geometry comes from film/run-data/frames.json (source pixels).
 * `crop` selects the region shown; `highlights` overlay animated boxes.
 */
import React from "react";
import { staticFile } from "remotion";
import { useAssetFile } from "./assets";
import { C, monoFont } from "../upgrade/utheme";

export type Rect = [number, number, number, number]; // x,y,w,h in source px

export type Highlight = {
  rect: Rect;
  color?: string;
  label?: string;
  labelPos?: "above" | "below"; // where the label chip sits (default above)
  dim?: boolean; // draw the 40% dim scrim over everything else
};

export const RealFrame: React.FC<{
  file: string; // path under public/, e.g. "rag/landing-answer.png"
  size: [number, number]; // source px
  crop?: Rect; // defaults to full image
  highlights?: Highlight[];
  width?: number; // frame content width in design px (default 1400)
  tag?: string; // corner label, default "real app · live run"
  tilt?: number; // entry tilt deg, default 0 (already settled for stills)
  glow?: boolean;
}> = ({ file, size, crop, highlights = [], width = 1400, tag = "real app · live run", tilt = 0, glow = true }) => {
  const [ix, iy, iw, ih] = crop ?? [0, 0, size[0], size[1]];
  const scale = width / iw;
  const imgW = size[0] * scale;
  const imgH = size[1] * scale;
  const offX = -ix * scale;
  const offY = -iy * scale;
  const frameH = ih * scale;
  const dimRects = highlights.filter((h) => h.dim !== false).map((h) => h.rect);
  const dimUnion: Rect | null = dimRects.length
    ? dimRects.reduce((a, r) => {
        const x = Math.min(a[0], r[0]);
        const y = Math.min(a[1], r[1]);
        return [x, y, Math.max(a[0] + a[2], r[0] + r[2]) - x, Math.max(a[1] + a[3], r[1] + r[3]) - y];
      })
    : null;
  // adaptive chrome: keep the tag fully inside narrow frames
  const showUrl = width >= 700;
  const showTag = tag !== "" && width >= 300;
  const tagSize = width >= 760 ? 22 : width >= 480 ? 16 : 13;
  const assetFile = useAssetFile(file);
  return (
    <div
      style={{
        width,
        borderRadius: 18,
        overflow: "hidden",
        background: "#0d1418",
        border: `1.5px solid ${C.accent}55`,
        boxShadow: glow
          ? `0 40px 90px #000000d9, 0 0 0 1px ${C.accent}22, 0 0 60px ${C.accent}26`
          : "0 30px 70px #000000cc",
        transform: `perspective(2400px) rotateX(${tilt}deg)`,
        position: "relative",
      }}
    >
      {/* browser chrome */}
      <div
        style={{
          height: 46,
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "0 18px",
          background: "#111a1f",
          borderBottom: `1px solid ${C.line}`,
        }}
      >
        {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
          <div key={c} style={{ width: 13, height: 13, borderRadius: "50%", background: c, opacity: 0.85, flexShrink: 0 }} />
        ))}
        {showUrl && (
          <div
            style={{
              marginLeft: 14,
              flexShrink: 0,
              fontFamily: monoFont,
              fontSize: 18,
              color: C.muted,
              background: "#0a0f12",
              border: `1px solid ${C.line}`,
              borderRadius: 8,
              padding: "5px 16px",
              letterSpacing: 0.5,
              whiteSpace: "nowrap",
            }}
          >
            kaarstenanderson.com
          </div>
        )}
        {showTag && (
          <div
            data-qa="reelframe-tag"
            style={{
              marginLeft: "auto",
              marginRight: 8,
              flexShrink: 0,
              whiteSpace: "nowrap",
              fontFamily: monoFont,
              fontSize: tagSize,
              color: C.accent,
              letterSpacing: 1.5,
              textTransform: "uppercase",
              opacity: 0.9,
            }}
          >
            {tag}
          </div>
        )}
      </div>
      {/* image window */}
      <div style={{ position: "relative", width, height: frameH, overflow: "hidden", background: C.bg }}>
        <img
          src={staticFile(assetFile)}
          style={{ position: "absolute", left: offX, top: offY, width: imgW, height: imgH, display: "block" }}
          draggable={false}
        />
        {dimUnion && (
          <div
            style={{
              position: "absolute",
              left: (dimUnion[0] - ix) * scale - 5,
              top: (dimUnion[1] - iy) * scale - 5,
              width: dimUnion[2] * scale + 10,
              height: dimUnion[3] * scale + 10,
              borderRadius: 10,
              boxShadow: "0 0 0 9999px rgba(3,7,9,0.4)",
              pointerEvents: "none",
            }}
          />
        )}
        {highlights.map((h, i) => {
          const [hx, hy, hw, hh] = h.rect;
          const color = h.color ?? C.accent;
          const labelTop = h.labelPos === "below"
            ? (hy + hh - iy) * scale + 14
            : (hy - iy) * scale - 50;
          return (
            <div key={i}>
              <div
                style={{
                  position: "absolute",
                  left: (hx - ix) * scale - 8,
                  top: (hy - iy) * scale - 8,
                  width: hw * scale + 16,
                  height: hh * scale + 16,
                  border: `3px solid ${color}`,
                  borderRadius: 8,
                  boxShadow: `0 0 22px ${color}55, inset 0 0 22px ${color}18`,
                }}
              />
              {h.label && (
                <div
                  data-qa="highlight-label"
                  style={{
                    position: "absolute",
                    left: (hx - ix) * scale,
                    top: labelTop,
                    fontFamily: monoFont,
                    fontSize: 24,
                    fontWeight: 700,
                    color: "#04110f",
                    background: color,
                    padding: "4px 14px",
                    borderRadius: 7,
                    whiteSpace: "nowrap",
                    boxShadow: `0 6px 24px ${color}66`,
                  }}
                >
                  {h.label}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
