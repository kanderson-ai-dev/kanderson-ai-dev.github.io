import { Easing, interpolate, useCurrentFrame } from "remotion";
import { theme, titleFont } from "../theme";
import type { ArchWorker } from "../types";

const ramp = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], { easing: Easing.out(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" });

const DEFAULT_WORKERS: ArchWorker[] = [
  { name: "Mapper", rows: [{ tag: "LLM", text: "structures the supplier profile" }] },
  { name: "Risk Scorer", rows: [{ tag: "CODE", text: "country·0.5 + sector·0.35 + tier + sites" }] },
  { name: "Compliance Analyst", rows: [{ tag: "LLM", text: "extracts the findings" }, { tag: "CODE", text: "verifies every quote is verbatim" }] },
  { name: "CAPA Writer", rows: [{ tag: "LLM", text: "drafts the actions" }, { tag: "CODE", text: "rejects orphan actions" }, { tag: "HUMAN", text: "approves each one" }] },
  { name: "Report Writer", rows: [{ tag: "LLM", text: "phrases the report" }, { tag: "CODE", text: "template + audit root" }] }
];

const CARD_W = 330, GAP = 28, CARD_TOP = 470;

const TagPill: React.FC<{ tag: ArchWorker["rows"][number]["tag"]; on: number }> = ({ tag, on }) => {
  const solid = tag !== "LLM";
  return (
    <span
      style={{
        display: "inline-block", minWidth: 84, textAlign: "center", fontWeight: 700, fontSize: 24, padding: "2px 10px", marginRight: 12,
        color: solid ? (on > 0.5 ? "#001a16" : theme.muted) : theme.accent,
        background: solid ? `rgba(0,245,212,${0.15 + 0.85 * on})` : "transparent",
        border: `2px solid ${theme.accent}`, boxShadow: on > 0.5 ? `0 0 14px ${theme.accent}` : "none"
      }}
    >
      {tag}
    </span>
  );
};

/** `llmAt` / `codeAt` / `humanAt`: frames at which each kind of row lights up (synced with the voice-over). */
export const ArchGraphic: React.FC<{ llmAt: number; codeAt: number; humanAt: number; workers?: ArchWorker[] }> = ({ llmAt, codeAt, humanAt, workers = DEFAULT_WORKERS }) => {
  const f = useCurrentFrame();
  const sup = ramp(f, 4, 22);
  const n = workers.length;
  const x0 = (1920 - (n * CARD_W + (n - 1) * GAP)) / 2;
  const cx = (i: number) => x0 + i * (CARD_W + GAP) + CARD_W / 2;
  return (
    <>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        {workers.map((_, i) => {
          const t = ramp(f, 22 + i * 4, 40 + i * 4);
          return <line key={i} x1={960} y1={330} x2={cx(i)} y2={CARD_TOP} stroke={theme.accent} strokeWidth={2.5} strokeOpacity={0.8 * t} strokeDasharray="1000" strokeDashoffset={(1 - t) * 1000} />;
        })}
      </svg>
      <div
        style={{
          position: "absolute", left: 710, top: 215, width: 500, height: 115, opacity: sup, transform: `scale(${0.94 + 0.06 * sup})`, background: theme.panel,
          border: `2px solid ${theme.accent}`, boxShadow: `0 0 30px ${theme.accent}55`, fontFamily: titleFont, textAlign: "center", padding: "12px 16px"
        }}
      >
        <div style={{ fontSize: 44, fontWeight: 700, color: theme.accent, textShadow: `0 0 10px ${theme.accent}` }}>Supervisor</div>
        <div style={{ fontSize: 26, color: theme.muted }}>routes the workers · bounded steps</div>
      </div>
      {workers.map((w, i) => {
        const t = ramp(f, 30 + i * 4, 48 + i * 4);
        return (
          <div
            key={w.name}
            style={{
              position: "absolute", left: x0 + i * (CARD_W + GAP), top: CARD_TOP, width: CARD_W, height: 430, opacity: t, transform: `translateY(${(1 - t) * 40}px)`,
              background: theme.panel, border: `2px solid ${theme.accent}77`, padding: 20, fontFamily: titleFont
            }}
          >
            <div style={{ fontSize: 36, fontWeight: 700, color: theme.text, marginBottom: 22 }}>{w.name}</div>
            {w.rows.map((r, j) => {
              const at = r.tag === "LLM" ? llmAt : r.tag === "CODE" ? codeAt : humanAt;
              const on = ramp(f, at, at + 14);
              return (
                <div key={j} style={{ marginBottom: 20, opacity: 0.25 + 0.75 * on }}>
                  <TagPill tag={r.tag} on={on} />
                  <div style={{ fontSize: 28, color: theme.text, marginTop: 8, lineHeight: 1.2 }}>{r.text}</div>
                </div>
              );
            })}
          </div>
        );
      })}
    </>
  );
};
