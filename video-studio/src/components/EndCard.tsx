import { theme, titleFont } from "../theme";
import { NeonTitle } from "./NeonTitle";
import type { Scene } from "../types";

export const EndCard: React.FC<{ e: NonNullable<Scene["end"]>; name?: string }> = ({ e, name = "Kaarsten Anderson" }) => (
  <div style={{ textAlign: "center", fontFamily: titleFont }}>
    <NeonTitle text={e.url} size={120} />
    <div style={{ fontSize: 44, color: theme.text, marginTop: 24 }}>{name}</div>
    {e.line && <div style={{ fontSize: 32, color: theme.accent, marginTop: 36 }}>{e.line}</div>}
    {e.contact && <div style={{ fontSize: 28, color: theme.muted, marginTop: 12 }}>{e.contact}</div>}
    {e.disclaimer && <div style={{ fontSize: 22, color: theme.muted, marginTop: 40 }}>{e.disclaimer}</div>}
  </div>
);
