/** Slice beats for option B — hook, reveal, gauntlet in the shared world. */
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { T, fonts, glow, tglow, lerp, clamp01, ease } from "../theme";
import { CAMS, WORLD } from "../world";
import { Ground, Stand, WorldB, camAt } from "./CamWorldB";
import { ClientB, ErrorChipB, GateB, LinkB, MonolithB, PacketB, QuestionCardB, ServerB, ShardsB, Tag, TrailB, seg, segOut } from "./objectsB";

/* =============================== 1 · HOOK ================================== */

export const HookB: React.FC = () => {
  const f = useCurrentFrame();
  const FREEZE = 336;
  const fz = Math.min(f, FREEZE);
  const pose = camAt(f, CAMS.hook);
  const frozen = f >= FREEZE;
  const dim = segOut(f, FREEZE, 14);
  const question = "Give an AI agent your database, your files, and the web.";
  const typed = Math.floor(seg(fz, 8, 66) * question.length);

  // hostile packet flight: card → db monolith, halts at FREEZE
  const pt = ease(seg(fz, 152, 184));
  const from = WORLD.questionCard.pos;
  const to = WORLD.resources[0].pos;
  const px = lerp(from[0] + 1.2, to[0] - 0.6, pt);
  const py = lerp(from[1] - 0.4, 1.6, pt) + Math.sin(pt * Math.PI) * -1.1;
  const pz = lerp(from[2], to[2] + 1.4, pt);

  return (
    <>
      <WorldB pose={pose} dim={dim * 0.9} desat={dim * 0.85}>
      {/* question card (floats above board) */}
      <Stand x={WORLD.questionCard.pos[0]} z={WORLD.questionCard.pos[2]} y={-1.9} pose={pose} lean={0.9}>
        <div style={{ transform: `translateY(${Math.sin(fz * 0.03) * 8}px)` }}>
          <QuestionCardB typed={question.slice(0, typed)} done={typed >= question.length} chip={fz > 100 ? "the agent is about to act" : undefined} />
        </div>
      </Stand>

      {/* the three resource monoliths */}
      {WORLD.resources.map((r, i) => (
        <Stand key={r.id} x={r.pos[0]} z={r.pos[2]} pose={pose} lean={0.8}>
          <MonolithB kind={r.kind} label={r.label} lit={seg(fz, 96 + i * 18, 26)} />
        </Stand>
      ))}

      {/* hostile packet */}
      {pt > 0 && (
        <Stand x={px} z={pz} y={-py} pose={pose} lean={1}>
          <div style={{ position: "relative" }}>
            <PacketB text="db_query('DROP TABLE reports')" danger />
            {!frozen && <TrailB />}
          </div>
        </Stand>
      )}
      </WorldB>

      {/* screen-space freeze overlay — NOT inside the camera transform */}
      <AbsoluteFill style={{ pointerEvents: "none" }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: frozen ? dim * 0.55 : 0,
            background: "radial-gradient(ellipse 68% 58% at 50% 46%, transparent 32%, rgba(1,4,9,0.9) 100%)",
          }}
        />
        {f > 205 && (
          <div style={{ position: "absolute", left: 0, right: 0, top: 712, textAlign: "center", opacity: seg(f, 205, 26) }}>
            <span
              style={{
                fontFamily: fonts.mono,
                fontSize: 34,
                fontWeight: 700,
                letterSpacing: 6,
                color: T.danger,
                textShadow: tglow(T.danger, 26, 80),
              }}
            >
              NOW ASK: WHAT STOPS IT?
            </span>
          </div>
        )}
      </AbsoluteFill>
    </>
  );
};

/* =============================== 2 · REVEAL ================================ */

export const RevealB: React.FC = () => {
  const f = useCurrentFrame();
  const pose = camAt(f, CAMS.reveal);
  const slam = segOut(f, 4, 14);
  const shake = f > 4 && f < 20 ? (1 - (f - 4) / 16) * 5 : 0;
  const shatter = segOut(f, 22, 34);
  const gateX = WORLD.gates[1].pos[0]; // the middle gate erupts

  return (
    <WorldB pose={{ ...pose, t: [pose.t[0] + (Math.sin(f * 2.3) * shake) / 90, pose.t[1] + (Math.cos(f * 1.7) * shake) / 160, pose.t[2]] }}>
      {/* monoliths still standing, dim */}
      {WORLD.resources.map((r) => (
        <Stand key={r.id} x={r.pos[0]} z={r.pos[2]} pose={pose} lean={0.8}>
          <MonolithB kind={r.kind} label={r.label} lit={0.5} />
        </Stand>
      ))}

      {/* gate wall erupts in the packet's path */}
      <Stand x={gateX} z={-1.2} pose={pose} lean={0.82}>
        <div
          style={{
            width: 130,
            height: 420 * slam,
            borderRadius: 16,
            border: `3px solid ${T.code}`,
            background: `linear-gradient(180deg, ${T.code}2e, ${T.code}0a)`,
            boxShadow: `0 0 ${50 + slam * 60}px ${T.code}77, inset 0 0 40px ${T.code}22`,
            transformOrigin: "bottom",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div style={{ position: "absolute", inset: 0, background: `repeating-linear-gradient(0deg, ${T.code}22 0 4px, transparent 4px 16px)` }} />
        </div>
      </Stand>

      {/* hostile packet hits the gate */}
      {f < 26 && (
        <Stand x={gateX - 1.6} z={-0.5} y={-1.5} pose={pose} lean={1}>
          <div style={{ opacity: 1 - seg(f, 20, 6), position: "relative" }}>
            <PacketB text="db_query('DROP TABLE reports')" danger />
            <TrailB />
          </div>
        </Stand>
      )}
      <Stand x={gateX - 0.9} z={-0.5} y={-1.5} pose={pose} lean={1}>
        <ShardsB p={shatter} seed={7} size={330} />
      </Stand>
    </WorldB>
  );
};

/* =============================== 3 · GAUNTLET ============================== */

export const GauntletB: React.FC = () => {
  const f = useCurrentFrame();
  const pose = camAt(f, CAMS.gauntlet);
  const G = WORLD.gates;
  const z = -0.4;

  // run 1 — legit crosses all three
  const r1 = ease(seg(f, 30, 130));
  const r1x = lerp(-8.4, 7.4, r1);
  // run 2 — hostile passes g1, dies at g2
  const r2 = ease(seg(f, 210, 150));
  const r2x = lerp(-8.4, -0.9, r2);
  const boom = f >= 362;
  const chipFly = segOut(f, 382, 84);
  // run 3 — burst into rate limit
  const burst = segOut(f, 470, 70);

  const state = (i: number): "idle" | "pass" | "block" => {
    const gx = G[i].pos[0];
    if (i === 0) {
      if (burst > 0.82) return "block";
      if (r2x > gx - 0.6 || r1x > gx - 0.6) return "pass";
      return "idle";
    }
    if (i === 1) {
      if (boom) return "block";
      if (r1x > gx - 0.6) return "pass";
      return "idle";
    }
    return r1x > gx - 0.6 ? "pass" : "idle";
  };

  return (
    <WorldB pose={pose}>
      {/* protocol link */}
      <LinkB />

      {/* client + server */}
      <Stand x={WORLD.client.pos[0]} z={WORLD.client.pos[2]} pose={pose} lean={0.88}>
        <ClientB />
      </Stand>
      <Stand x={WORLD.server.pos[0]} z={WORLD.server.pos[2]} pose={pose} lean={0.88}>
        <ServerB />
      </Stand>

      {/* gates */}
      {G.map((g, i) => (
        <Stand key={g.id} x={g.pos[0]} z={g.pos[2]} pose={pose} lean={0.8}>
          <GateB label={g.label} sub={["60 calls/min", "fs + sql jail", "strip + clip"][i]} state={state(i)} flash={seg(f, 40 + i * 20, 24)} />
        </Stand>
      ))}

      {/* legit packet */}
      {r1 > 0 && r1 < 1 && (
        <Stand x={r1x} z={z} y={-0.85} pose={pose} lean={1}>
          <div style={{ position: "relative" }}>
            <PacketB text="db_query('SELECT title FROM reports')" small />
            <TrailB color={T.code} len={130} />
          </div>
        </Stand>
      )}
      {r1 >= 1 && f < 200 && (
        <Stand x={6.9} z={z + 0.9} y={-0.9} pose={pose} lean={1}>
          <div style={{ opacity: 1 - seg(f, 185, 15) }}>
            <Tag color={T.code} size={18} bold>result → model</Tag>
          </div>
        </Stand>
      )}

      {/* hostile packet */}
      {r2 > 0 && !boom && (
        <Stand x={r2x} z={z + 0.7} y={-0.55} pose={pose} lean={1}>
          <div style={{ position: "relative" }}>
            <PacketB text="read_file('../../etc/passwd')" danger small />
            <TrailB len={130} />
          </div>
        </Stand>
      )}
      {boom && (
        <>
          <Stand x={-0.7} z={z + 0.7} y={-0.55} pose={pose} lean={1}>
            <ShardsB p={segOut(f, 362, 30)} seed={4} size={300} />
          </Stand>
          {/* forbidden chip flies home */}
          <Stand x={lerp(-0.7, -9.6, chipFly)} z={z + 0.7} y={-0.55 - chipFly * 0.7} pose={pose} lean={1}>
            <div style={{ opacity: chipFly < 0.96 ? 1 : 0 }}>
              <ErrorChipB code="forbidden" />
            </div>
          </Stand>
        </>
      )}

      {/* burst: three packets pile into gate 1 */}
      {burst > 0 && (
        <>
          {[0, 1, 2].map((i) => {
            const bx = lerp(-8.6, -4.6, Math.min(1, burst + i * 0.09)) - i * 0.25;
            return (
              <Stand key={i} x={bx} z={z + 0.35 + i * 0.6} y={-0.45 - i * 0.22} pose={pose} lean={1}>
                <PacketB text="web_search(…)" small danger={i === 2} />
              </Stand>
            );
          })}
          {burst > 0.8 && (
            <Stand x={-5.0} z={z - 0.9} y={-1.75} pose={pose} lean={1}>
              <div style={{ opacity: seg(f, 500, 14) }}>
                <ErrorChipB code="rate_limited" size={21} />
              </div>
            </Stand>
          )}
        </>
      )}
    </WorldB>
  );
};
