import React from "react";
import { C, bodyFont, monoFont } from "./utheme";
import { Chip, StatusPill } from "./primitives";

export type TicketStatus = "new" | "verified" | "eligible" | "needs-approval" | "approved";

const statusMeta: Record<TicketStatus, { text: string; color: string }> = {
  new: { text: "New ticket", color: C.muted },
  verified: { text: "Order verified", color: C.accent },
  eligible: { text: "Eligible by policy", color: C.accent },
  "needs-approval": { text: "Needs human approval", color: C.human },
  approved: { text: "Refund approved", color: C.accent },
};

export const TicketCard: React.FC<{ status?: TicketStatus; w?: number; quote?: string }> = ({
  status = "new",
  w = 560,
  quote = "\u201CI need to return the leather weekender bag from order ORD-1005. Unused, tags still on.\u201D",
}) => {
  const m = statusMeta[status];
  return (
    <div
      style={{
        width: w,
        background: `linear-gradient(160deg, ${C.panel2}, ${C.panel})`,
        border: `2px solid ${m.color}`,
        borderRadius: 22,
        padding: "26px 30px",
        boxShadow: `0 0 46px ${m.color}33, inset 0 0 30px #00000066`,
        fontFamily: bodyFont,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", rowGap: 12 }}>
        <span style={{ fontFamily: monoFont, fontSize: 22, color: C.muted, letterSpacing: 1, whiteSpace: "nowrap" }}>SUPPORT TICKET</span>
        <StatusPill text={m.text} color={m.color} size={20} />
      </div>
      <div style={{ fontSize: 27, lineHeight: 1.42, color: C.text, fontStyle: "italic", marginBottom: 18 }}>{quote}</div>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <Chip text="ORD-1005" size={22} />
        <Chip text="Leather Weekender Bag" color={C.text} size={22} />
        <Chip text="$240.00" color={status === "needs-approval" || status === "approved" ? C.human : C.accent} filled={status === "needs-approval"} size={22} />
      </div>
    </div>
  );
};
