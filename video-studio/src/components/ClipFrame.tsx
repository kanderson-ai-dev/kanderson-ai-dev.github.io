import { OffthreadVideo, staticFile } from "remotion";
import { theme } from "../theme";
import type { Rect } from "../types";
import { FULL, ZoomPan } from "./ZoomPan";

export const INSET = { x: 204, y: 96, w: 1511, h: 850 };

export const ClipFrame: React.FC<{
  clip: string; startSec: number; rate?: number; zoom?: { from: Rect; to: Rect }; mode?: "full" | "inset"; children?: React.ReactNode;
}> = ({ clip, startSec, rate = 1, zoom, mode = "inset", children }) => {
  const video = <OffthreadVideo src={staticFile(clip)} muted startFrom={Math.round(startSec * 30)} playbackRate={rate} style={{ width: 1920, height: 1080 }} />;
  const content = <ZoomPan from={zoom?.from ?? FULL} to={zoom?.to ?? FULL}>{video}</ZoomPan>;
  if (mode === "full") return <div style={{ position: "absolute", inset: 0 }}>{content}{children}</div>;
  const k = INSET.w / 1920;
  return (
    <>
      <div style={{ position: "absolute", left: INSET.x, top: INSET.y, width: INSET.w, height: INSET.h, overflow: "hidden", borderRadius: 14, boxShadow: `0 0 40px ${theme.accent}55, 0 0 0 2px ${theme.accent}` }}>
        <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: "0 0", transform: `scale(${k})` }}>{content}</div>
      </div>
      {children}
    </>
  );
};

export const ClipWindow: React.FC<{ clip: string; startSec: number; rate?: number; crop: Rect; w: number; style?: React.CSSProperties }> = ({ clip, startSec, rate = 1, crop, w, style }) => {
  const k = w / crop.w;
  const h = crop.h * k;
  return (
    <div style={{ position: "absolute", width: w, height: h, overflow: "hidden", borderRadius: 12, boxShadow: `0 0 28px ${theme.accent}66, 0 0 0 2px ${theme.accent}`, background: "#fff", ...style }}>
      <div style={{ position: "absolute", width: 1920, height: 1080, transformOrigin: "0 0", transform: `scale(${k}) translate(${-crop.x}px, ${-crop.y}px)` }}>
        <OffthreadVideo src={staticFile(clip)} muted startFrom={Math.round(startSec * 30)} playbackRate={rate} style={{ width: 1920, height: 1080 }} />
      </div>
    </div>
  );
};
