/** Option B beats — the remaining 11 film beats in the shared world. */
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { T, fonts, glow, tglow, lerp, clamp01, ease } from "../theme";
import { CAMS, WORLD } from "../world";
import { Stand, Tag, WorldB, camAt } from "./CamWorldB";
import { ClientB, ErrorChipB, GateB, LinkB, MonolithB, PacketB, ServerB, ShardsB, TrailB, seg, segOut } from "./objectsB";
import { ArenaB, ChainB, ColumnB, EndCardB, IterRingB, RailB, ScorecardB, VaultB } from "./objectsB2";
import { A, FlatB } from "./flatB";

const W = WORLD;

/* -------------------------------- shared map ------------------------------- */

const MapDress: React.FC<{ pose: ReturnType<typeof camAt>; gates?: boolean }> = ({ pose, gates = true }) => (
  <>
    <LinkB />
    <Stand x={W.client.pos[0]} z={W.client.pos[2]} pose={pose} lean={0.88}>
      <ClientB />
    </Stand>
    <Stand x={W.server.pos[0]} z={W.server.pos[2]} pose={pose} lean={0.88}>
      <ServerB />
    </Stand>
    {gates && W.gates.map((g, i) => (
      <Stand key={g.id} x={g.pos[0]} z={g.pos[2]} pose={pose} lean={0.8}>
        <GateB label={g.label} sub={["60 calls/min", "fs + sql jail", "strip + clip"][i]} state="pass" />
      </Stand>
    ))}
    {W.resources.map((r) => (
      <Stand key={r.id} x={r.pos[0]} z={r.pos[2]} pose={pose} lean={0.8}>
        <MonolithB kind={r.kind} label={r.label} lit={0.7} />
      </Stand>
    ))}
  </>
);

/* ================================ WHAT ===================================== */

export const WhatB: React.FC = () => {
  const f = useCurrentFrame();
  const pose = camAt(f, CAMS.what);
  const hs = ease(seg(f, 40, 120)); // handshake packet client → server
  const hsx = lerp(-8.8, 6.4, hs);
  const bays = ["web_search", "db_query", "read_file", "write_file"];
  return (
    <WorldB pose={pose}>
      <MapDress pose={pose} />
      {/* handshake packet rides the link */}
      {hs > 0 && hs < 1 && (
        <Stand x={hsx} z={-0.4} y={-0.95} pose={pose} lean={1}>
          <div style={{ position: "relative" }}>
            <PacketB text="tools/call" small />
            <TrailB color={T.code} len={120} />
          </div>
        </Stand>
      )}
      {/* stdio tag pinned to the link */}
      {f > 60 && (
        <Stand x={-2.2} z={-0.4} y={-1.7} pose={pose} lean={1}>
          <div style={{ opacity: seg(f, 60, 18) }}>
            <Tag color={T.code} size={17} bold>stdio · JSON-RPC</Tag>
          </div>
        </Stand>
      )}
      {/* tool labels pop over the bays in sync with the VO — one clean row */}
      <Stand x={W.server.pos[0]} z={W.server.pos[2] + 1.5} y={-1.35} pose={pose} lean={1}>
        <div style={{ display: "flex", gap: 14 }}>
          {bays.map((b, i) => {
            const p = seg(f, 150 + i * 42, 18);
            return (
              <div key={b} style={{ opacity: p, transform: `translateY(${(1 - p) * 18}px)` }}>
                <Tag color={T.code} size={19} bold>{b}</Tag>
              </div>
            );
          })}
        </div>
      </Stand>
      {f > 330 && (
        <Stand x={W.server.pos[0]} z={W.server.pos[2] + 2.6} y={-0.6} pose={pose} lean={1}>
          <div style={{ opacity: seg(f, 330, 20) }}>
            <Tag color={T.muted} size={16}>every one guarded · any MCP client</Tag>
          </div>
        </Stand>
      )}
    </WorldB>
  );
};

/* =============================== DISCOVER ================================== */

export const DiscoverB: React.FC = () => {
  const f = useCurrentFrame();
  const pose = camAt(f, CAMS.discover);
  const gone = f > 300; // one tool leaves — the agent adapts
  const req = ease(seg(f, 30, 90));
  const reqx = lerp(-8.8, 6.4, req);
  const bays = ["web_search", "db_query", "read_file", "write_file"];
  return (
    <WorldB pose={pose}>
      <MapDress pose={pose} gates={false} />
      {/* tools/list request */}
      {req < 1 && (
        <Stand x={reqx} z={-0.4} y={-0.95} pose={pose} lean={1}>
          <div style={{ position: "relative" }}>
            <PacketB text="tools/list" small />
            <TrailB color={T.code} len={120} />
          </div>
        </Stand>
      )}
      {/* schema cards pop out of the bays — one clean row */}
      <Stand x={W.server.pos[0]} z={W.server.pos[2] + 1.5} y={-1.35} pose={pose} lean={1}>
        <div style={{ display: "flex", gap: 14 }}>
          {bays.map((b, i) => {
            const p = seg(f, 140 + i * 36, 22);
            const dead = gone && i === 1;
            return (
              <div key={b} style={{ opacity: dead ? 0.3 : p, transform: `translateY(${(1 - p) * 22}px)`, filter: dead ? "grayscale(1)" : "none" }}>
                <Tag color={dead ? T.dim : T.code} size={18} bold>{dead ? "db_query — gone" : b}</Tag>
              </div>
            );
          })}
        </div>
      </Stand>
      {gone && (
        <Stand x={-8.6} z={0.4} y={-1.5} pose={pose} lean={1}>
          <div style={{ opacity: seg(f, 305, 18) }}>
            <Tag color={T.model} size={17} bold>agent adapts — nothing hard-coded</Tag>
          </div>
        </Stand>
      )}
      <Stand x={W.server.pos[0]} z={W.server.pos[2] + 2.7} y={-0.5} pose={pose} lean={1}>
        <div style={{ opacity: seg(f, 210, 20) }}>
          <Tag color={T.muted} size={15}>discovered at runtime via tools/list</Tag>
        </div>
      </Stand>
    </WorldB>
  );
};

/* =============================== HARDENED ================================== */

export const HardenedB: React.FC = () => {
  const f = useCurrentFrame();
  const esc = ease(seg(f, 110, 130)); // escape attempt climbs off the vault
  const boom = f >= 244;
  const chip = segOut(f, 260, 70);
  const bridge = seg(f, 60, 90); // symlink bridge then retracts
  return (
    <FlatB kicker="guardrails" title={<>Every tool is <A>hardened</A>.</>}>
      <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 200 }}>
        {/* vault */}
        <div style={{ position: "relative", transform: "scale(1.5)", transformOrigin: "center" }}>
          <VaultB lit={seg(f, 10, 30)} />
          {/* hostile packet climbs the vault */}
          {esc > 0 && !boom && (
            <div style={{ position: "absolute", left: 40 + esc * 230, top: 210 - esc * 240 }}>
              <div style={{ position: "relative" }}>
                <PacketB text="../" danger small />
                <TrailB len={100} />
              </div>
            </div>
          )}
          {boom && (
            <>
              <div style={{ position: "absolute", right: -170, top: -80 }}>
                <ShardsB p={segOut(f, 244, 26)} seed={9} size={270} />
              </div>
              <div style={{ position: "absolute", right: -140, top: -110, opacity: seg(f, 252, 12) }}>
                <Tag color={T.code} size={15}>jail wall</Tag>
              </div>
              <div style={{ position: "absolute", left: 260 - chip * 460, top: -80 - chip * 50, opacity: chip < 0.95 ? 1 : 0 }}>
                <ErrorChipB code="forbidden" />
              </div>
            </>
          )}
        </div>
        {/* island */}
        <div style={{ position: "relative" }}>
          <div style={{ width: 300, padding: "18px 22px", borderRadius: 14, border: `1.5px dashed ${T.dim}88`, background: "#0a1420aa", fontFamily: fonts.mono, fontSize: 14, color: T.dim, textAlign: "center" }}>
            outside the jail<br />/etc/passwd
          </div>
          {/* symlink bridge */}
          <div
            style={{
              position: "absolute",
              right: "100%",
              top: "50%",
              marginRight: 8,
              width: 190 * clamp01(bridge * (boom ? 0 : 1)),
              height: 6,
              borderRadius: 3,
              background: `repeating-linear-gradient(90deg, ${T.model} 0 14px, transparent 14px 24px)`,
              opacity: boom ? 1 - seg(f, 244, 16) : seg(f, 60, 40),
            }}
          />
          {bridge > 0.4 && !boom && (
            <div style={{ position: "absolute", right: "100%", top: -44, marginRight: 10 }}>
              <Tag color={T.model} size={15}>symlink → ../../etc</Tag>
            </div>
          )}
        </div>
      </div>
      {f > 330 && (
        <div style={{ position: "absolute", bottom: 170, width: "100%", textAlign: "center", opacity: seg(f, 330, 20) }}>
          <Tag color={T.code} size={17} bold>read-only twice · no symlink escape</Tag>
        </div>
      )}
    </FlatB>
  );
};

/* ================================ BOUNDED ================================== */

export const BoundedB: React.FC = () => {
  const f = useCurrentFrame();
  const n = Math.min(8, Math.floor(seg(f, 30, 260) * 9));
  const done = f > 300 ? (f < 348 ? "answer" : f < 396 ? "iteration_limit" : "budget_limit") : undefined;
  return (
    <FlatB kicker="execution limits" title={<>Every run is <A>bounded</A>.</>}>
      <div style={{ display: "flex", alignItems: "center", gap: 120, transform: "scale(1.35)" }}>
        <IterRingB n={n} done={done} />
        <div style={{ opacity: seg(f, 70, 20), display: "grid", gap: 14 }}>
          <Tag color={T.code} size={17} bold>an answer</Tag>
          <Tag color={T.human} size={17}>an iteration limit</Tag>
          <Tag color={T.danger} size={17}>a hard budget cap</Tag>
        </div>
      </div>
      {/* budget meter */}
      {f > 250 && (
        <div style={{ position: "absolute", bottom: 190, width: "100%", display: "flex", justifyContent: "center" }}>
          <div style={{ opacity: seg(f, 250, 20), width: 420 }}>
            <div style={{ height: 12, borderRadius: 6, background: "#0a1420", border: `1.5px solid ${T.human}55`, overflow: "hidden" }}>
              <div style={{ width: `${(1 - seg(f, 250, 120) * 0.7) * 100}%`, height: "100%", background: `linear-gradient(90deg, ${T.human}, ${T.code})`, borderRadius: 6 }} />
            </div>
            <div style={{ fontFamily: fonts.mono, fontSize: 14, color: T.muted, marginTop: 8, textAlign: "center" }}>token budget</div>
          </div>
        </div>
      )}
    </FlatB>
  );
};

/* ================================ REGISTRY ================================= */

export const RegistryB: React.FC = () => {
  const f = useCurrentFrame();
  const a = Math.min(1, seg(f, 90, 120) * 0.62); // v2 tops out at 0.62 — loses
  const b = Math.min(1, seg(f, 120, 170) * 0.97); // v3 wins
  const stamp = segOut(f, 300, 14);
  const over = segOut(f, 400, 24);
  return (
    <FlatB kicker="prompt registry" title={<>New prompts ship only when they <A>win</A>.</>}>
      <div style={{ position: "relative", transform: "scale(1.45)", transformOrigin: "center" }}>
        <ArenaB a={a} b={b} stamped={stamp} override={over} />
      </div>
      {f > 200 && (
        <div style={{ position: "absolute", left: 140, top: 640, opacity: seg(f, 200, 18) }}>
          <Tag color={T.code} size={16} bold>ships only if it beats live traffic</Tag>
        </div>
      )}
      {f > 470 && (
        <div style={{ position: "absolute", right: 150, top: 250, opacity: seg(f, 470, 18) }}>
          <Tag color={T.human} size={15}>adversarial must stay 100 %</Tag>
        </div>
      )}
    </FlatB>
  );
};

/* ================================= AUDIT =================================== */

export const AuditB: React.FC = () => {
  const f = useCurrentFrame();
  const tamperAt = f > 220 && f < 400 ? 5 : -1;
  return (
    <FlatB kicker="audit trail" title={<>Every decision is <A>hash-chained</A>.</>}>
      <div style={{ transform: "scale(1.55)", transformOrigin: "center" }}>
        <ChainB lit={Math.floor(seg(f, 40, 140) * 8)} tamper={tamperAt} />
      </div>
      {f > 230 && (
        <div style={{ position: "absolute", right: 200, top: 640, opacity: f < 380 ? seg(f, 230, 14) * (1 - seg(f, 380, 20)) : 0 }}>
          <Tag color={T.danger} size={16} bold>edit one entry → the chain lights up</Tag>
        </div>
      )}
      {f > 300 && (
        <div style={{ position: "absolute", bottom: 170, width: "100%", textAlign: "center", opacity: seg(f, 300, 20) }}>
          <Tag color={T.code} size={17} bold>tamper-evident · not tamper-proof</Tag>
        </div>
      )}
      {f < 60 && (
        <div style={{ position: "absolute", left: 170, top: 620, opacity: 1 - seg(f, 30, 26) }}>
          <Tag color={T.muted} size={15}>v2 lost — it never shipped · every decision logged</Tag>
        </div>
      )}
    </FlatB>
  );
};

/* ================================= CONTROL ================================= */

export const ControlB: React.FC = () => {
  const f = useCurrentFrame();
  const cols = [
    { name: "MODEL", verb: "thinks", sub: "proposes calls — never trusted by default", color: T.model, icon: "brain" as const, d: 30 },
    { name: "CODE", verb: "enforces", sub: "guardrails check every call", color: T.code, icon: "code" as const, d: 90 },
    { name: "HUMAN", verb: "signs off", sub: "reason on record for overrides", color: T.human, icon: "pen" as const, d: 150 },
  ];
  return (
    <FlatB
      kicker="control model"
      title={<><A c={T.model}>The model</A> proposes. <A>Code</A> decides. <A c={T.human}>You</A> sign off.</>}
    >
      <div style={{ position: "relative", display: "flex", gap: 56, transform: "scale(1.3)", transformOrigin: "center" }}>
        {cols.map((c) => {
          const p = segOut(f, c.d, 26);
          return (
            <div key={c.name} style={{ opacity: p, transform: `translateY(${(1 - p) * 30}px)` }}>
              <ColumnB name={c.name} verb={c.verb} sub={c.sub} color={c.color} icon={c.icon} lit={p} />
            </div>
          );
        })}
        {/* signature stroke on the human column */}
        {f > 230 && (
          <svg width={230} height={60} style={{ position: "absolute", right: 8, top: -46, opacity: seg(f, 230, 20), filter: `drop-shadow(0 0 8px ${T.human})` }}>
            <path d="M8 44 Q60 10 110 36 T215 30" fill="none" stroke={T.human} strokeWidth={4.5} strokeLinecap="round" strokeDasharray={320} strokeDashoffset={320 * (1 - segOut(f, 240, 40))} />
          </svg>
        )}
      </div>
      {f > 300 && (
        <div style={{ position: "absolute", bottom: 170, width: "100%", textAlign: "center", opacity: seg(f, 300, 18) }}>
          <Tag color={T.human} size={15}>"approved — overrides rubric v2, reason on record"</Tag>
        </div>
      )}
    </FlatB>
  );
};

/* ================================= PROOF =================================== */

export const ProofB: React.FC = () => {
  const f = useCurrentFrame();
  const rise = segOut(f, 10, 34);
  return (
    <FlatB kicker="scorecard" title={<>Measured. <A>Not claimed.</A></>}>
      <div style={{ transform: `translateY(${(1 - rise) * 60}px) scale(${1.15 + rise * 0.25})`, opacity: rise }}>
        <ScorecardB />
      </div>
    </FlatB>
  );
};

/* ================================= RIGOR =================================== */

export const RigorB: React.FC = () => {
  const f = useCurrentFrame();
  const lit = Math.floor(seg(f, 40, 300) * 7);
  return (
    <FlatB kicker="engineering rigor" title={<>Every merge passes the <A>rail</A>.</>}>
      <div style={{ transform: "scale(1.5)", transformOrigin: "center" }}>
        <RailB lit={lit} count={Math.round(seg(f, 60, 240) * 517)} />
      </div>
      {f > 330 && (
        <div style={{ position: "absolute", bottom: 175, width: "100%", textAlign: "center", opacity: seg(f, 330, 18) }}>
          <Tag color={T.muted} size={15}>517 backend · 54 e2e · strict mypy · CI blocks secrets</Tag>
        </div>
      )}
    </FlatB>
  );
};

/* ================================= BUILDER ================================= */

export const BuilderB: React.FC = () => {
  const f = useCurrentFrame();
  const pose = camAt(f, CAMS.builder);
  return (
    <WorldB pose={pose} dim={0.35}>
      <MapDress pose={pose} />
      {/* constellation nodes lighting across the world */}
      {[W.client.pos, ...W.gates.map((g) => g.pos), W.server.pos, ...W.resources.map((r) => r.pos), W.vault.pos, W.island.pos].map((p, i) => {
        const lit = seg(f, 40 + i * 26, 18);
        return (
          <Stand key={i} x={p[0]} z={p[2]} y={-0.15} pose={pose} lean={0.6}>
            <div style={{ width: 16, height: 16, borderRadius: 8, background: T.code, boxShadow: glow(T.code, 18), opacity: lit, transform: `scale(${0.4 + lit})` }} />
          </Stand>
        );
      })}
    </WorldB>
  );
};

/* ================================== CTA ==================================== */

export const CtaB: React.FC = () => {
  const f = useCurrentFrame();
  const lit = segOut(f, 20, 30);
  const sweep = seg(f, 90, 90);
  return (
    <FlatB>
      <div style={{ position: "relative", opacity: lit, transform: `translateY(${(1 - lit) * 40}px) scale(1.5)`, transformOrigin: "center" }}>
        <EndCardB lit={1} />
        {sweep > 0 && sweep < 1 && (
          <div style={{ position: "absolute", top: 0, bottom: 0, left: `${sweep * 110 - 15}%`, width: 90, background: `linear-gradient(100deg, transparent, ${T.code}55, transparent)`, pointerEvents: "none" }} />
        )}
      </div>
    </FlatB>
  );
};
