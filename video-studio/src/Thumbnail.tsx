import { AbsoluteFill } from "remotion";
import { CornerBrackets, GridBackground } from "./components/GridBackground";
import { NeonTitle } from "./components/NeonTitle";
import { theme, titleFont } from "./theme";
import type { PromoProps } from "./types";

// Static 1280x720 YouTube thumbnail: one short claim readable at small size.
export const Thumbnail: React.FC<PromoProps> = ({ title, thumb }) => (
  <AbsoluteFill style={{ background: theme.bg, alignItems: "center", justifyContent: "center" }}>
    <GridBackground />
    <CornerBrackets />
    <NeonTitle text={thumb?.big ?? "0% fabricated quotes"} size={thumb?.big && thumb.big.length > 14 ? 92 : 120} />
    {thumb?.sub && <div style={{ position: "relative", fontFamily: titleFont, fontWeight: 500, fontSize: 38, color: theme.text, marginTop: 28 }}>{thumb.sub}</div>}
    <div style={{ position: "absolute", bottom: 42, fontFamily: titleFont, fontWeight: 500, fontSize: 30, color: theme.muted, letterSpacing: 2 }}>{title}</div>
  </AbsoluteFill>
);
