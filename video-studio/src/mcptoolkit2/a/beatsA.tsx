/** Option A beats — the slice scenes in real 3D.
 *  Architecture: WebGL renders geometry only; ALL text lives in DOM overlays
 *  projected via proj.ts (crisp fonts, zero GL-text fragility). */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import { T, fonts, lerp } from "../theme";
import { CAMS, WORLD } from "../world";
import { camAt } from "../b/CamWorldB";
import { Labels, type LSpec } from "./proj";
import {
  Board3D, Client3D, ErrorChip3D, Gate3D, Link3D, Monolith3D,
  Packet3D, QuestionCard3D, Server3D, Shards3D, Trail3D, seg, segOut,
} from "./objects3d";

/* ------------------------------ camera rig -------------------------------- */

const Rig: React.FC<{ pose: ReturnType<typeof camAt> }> = ({ pose }) => {
  const { camera } = useThree();
  const [tx, ty, tz] = pose.t;
  const az = (pose.az * Math.PI) / 180;
  const el = (pose.el * Math.PI) / 180;
  camera.position.set(
    tx + pose.d * Math.cos(el) * Math.sin(az),
    ty + pose.d * Math.sin(el),
    tz + pose.d * Math.cos(el) * Math.cos(az)
  );
  camera.lookAt(tx, ty, tz);
  return null;
};

const Lights: React.FC = () => (
  <>
    <ambientLight intensity={0.32} color="#9fc8e8" />
    <directionalLight position={[6, 12, 8]} intensity={0.55} color="#bdefff" />
    <pointLight position={[0, 7, 6]} intensity={18} color={T.code} distance={26} decay={2} />
  </>
);

/** Depth fog only — postprocessing kills the render in this GL environment.
 *  Glow comes from emissive materials + additive shells; vignette is DOM. */
const Atmo: React.FC = () => <fog attach="fog" args={[T.bgDeep as unknown as string, 16, 38]} />;

const Canvas: React.FC<{ pose: ReturnType<typeof camAt>; children?: React.ReactNode }> = ({ pose, children }) => {
  const { width, height } = useVideoConfig();
  return (
    <ThreeCanvas width={width} height={height} camera={{ fov: 42, near: 0.1, far: 200 }}>
      <Lights />
      <Rig pose={pose} />
      {children}
      <Atmo />
    </ThreeCanvas>
  );
};

/* ================================ HOOK ==================================== */

const HookScene: React.FC = () => {
  const f = useCurrentFrame();
  const FREEZE = 336;
  const fz = Math.min(f, FREEZE);
  const dim = segOut(f, FREEZE, 14);
  const question = "Give an AI agent your database, your files, and the web.";
  const typed = Math.floor(seg(fz, 8, 66) * question.length);

  const pt = segOut(fz, 152, 184);
  const from = WORLD.questionCard.pos;
  const to = WORLD.resources[0].pos;
  const px = lerp(from[0] + 1.4, to[0] - 0.7, pt);
  const py = lerp(from[1] - 0.6, 1.7, pt) + Math.sin(pt * Math.PI) * -1.1;
  const pz = lerp(from[2], to[2] + 1.5, pt);
  const trailFrom: [number, number, number] = [
    lerp(px, from[0] + 1.4, 0.35),
    lerp(py, from[1] - 0.6, 0.35),
    lerp(pz, from[2], 0.35),
  ];
  const dimmed = (base: number) => base * (1 - dim * 0.65);

  return (
    <group>
      <Board3D />
      <QuestionCard3D
        pos={[from[0], from[1] + Math.sin(fz * 0.03) * 0.08, from[2]]}
        typed={question.slice(0, typed)}
        done={typed >= question.length}
        chip={fz > 100 ? "the agent is about to act" : undefined}
      />
      {WORLD.resources.map((r, i) => (
        <Monolith3D key={r.id} pos={[r.pos[0], r.pos[1], r.pos[2]]} kind={r.kind} label={r.label} lit={dimmed(seg(fz, 96 + i * 18, 26))} />
      ))}
      {pt > 0 && (
        <>
          <Packet3D pos={[px, py, pz]} danger />
          {f < FREEZE && <Trail3D from={trailFrom} to={[px, py, pz]} />}
        </>
      )}
    </group>
  );
};

export const HookA: React.FC = () => {
  const f = useCurrentFrame();
  const pose = camAt(f, CAMS.hook);
  const fz = Math.min(f, 336);
  const frz = f >= 336;
  const dim = segOut(f, 336, 14);
  const question = "Give an AI agent your database, your files, and the web.";
  const typed = question.slice(0, Math.floor(seg(fz, 8, 66) * question.length));
  const done = typed.length >= question.length;
  const Q = WORLD.questionCard.pos;

  const pt = segOut(fz, 152, 184);
  const to = WORLD.resources[0].pos;
  const px = lerp(Q[0] + 1.4, to[0] - 0.7, pt);
  const py = lerp(Q[1] - 0.6, 1.7, pt) + Math.sin(pt * Math.PI) * -1.1;
  const pz = lerp(Q[2], to[2] + 1.5, pt);

  const labels: LSpec[] = [
    // question card face — anchored to the card's world corners
    { p: [Q[0] - 1.55, Q[1] + 0.78, Q[2] + 0.2], text: "· QUESTION", size: 15, color: T.muted, ls: 4 },
    { p: [Q[0], Q[1] + 0.28, Q[2] + 0.2], text: typed.slice(0, 34), size: 30, color: T.text, weight: 700, mono: false },
    { p: [Q[0], Q[1] - 0.35, Q[2] + 0.2], text: typed.slice(34, 68) + (!done ? "▌" : ""), size: 30, color: T.text, weight: 700, mono: false },
    ...(fz > 100 ? [{ p: [Q[0], Q[1] - 0.95, Q[2] + 0.2], text: "the agent is about to act", size: 15, color: T.model, bg: "#14102ecc" } as LSpec] : []),
    // monolith nameplates
    ...WORLD.resources.map((r, i) => ({
      p: [r.pos[0], 0.55, r.pos[2] + 0.6] as [number, number, number],
      text: r.label,
      size: 20,
      color: seg(fz, 96 + i * 18, 26) > 0.5 ? T.text : T.dim,
      weight: 400,
      bg: "#0a1420b0",
    })),
    // packet label
    ...(pt > 0 && !frz ? [{ p: [px, py + 0.55, pz], text: "db_query('DROP TABLE reports')", size: 19, color: "#ffd9e0", bg: "#2a0d16e6", weight: 700 } as LSpec] : []),
    ...(frz ? [{ p: [px, py + 0.55, pz], text: "db_query('DROP TABLE reports')", size: 19, color: "#ffd9e0", bg: "#2a0d16e6", weight: 700 } as LSpec] : []),
  ];

  return (
    <AbsoluteFill>
      <Canvas pose={pose}>
        <HookScene />
      </Canvas>
      <AbsoluteFill style={{ pointerEvents: "none" }}>
        <Labels pose={pose} items={labels} />
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          opacity: frz ? 0.55 * dim : 0,
          background: "radial-gradient(ellipse 70% 60% at 50% 45%, transparent 30%, rgba(1,4,9,0.92) 100%)",
          pointerEvents: "none",
        }}
      />
      {f > 205 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 700, textAlign: "center", opacity: seg(f, 205, 26), pointerEvents: "none" }}>
          <span style={{ fontFamily: fonts.mono, fontSize: 34, fontWeight: 700, letterSpacing: 6, color: T.danger, textShadow: `0 0 26px ${T.danger}aa, 0 0 80px ${T.danger}55, 0 2px 14px #000` }}>
            NOW ASK: WHAT STOPS IT?
          </span>
        </div>
      )}
    </AbsoluteFill>
  );
};

/* ================================ REVEAL =================================== */

const RevealScene: React.FC = () => {
  const f = useCurrentFrame();
  const slam = segOut(f, 4, 14);
  const shatter = segOut(f, 22, 34);
  const shake = f > 4 && f < 20 ? (1 - (f - 4) / 16) * 0.9 : 0;
  return (
    <group position={[shake * 0.06, shake * -0.04, 0]}>
      <Board3D />
      {WORLD.resources.map((r) => (
        <Monolith3D key={r.id} pos={[r.pos[0], r.pos[1], r.pos[2]]} kind={r.kind} label="" lit={0.5} />
      ))}
      {/* the three gates erupt as a silhouette behind the title */}
      {WORLD.gates.map((g, i) => (
        <group key={g.id} position={[g.pos[0], 0, g.pos[2] - 0.8]} scale={[1, 0.05 + slam * 0.95, 1]}>
          <Gate3D pos={[0, 0, 0]} label="" sub="" state="pass" flash={slam * (1 - i * 0.18)} />
        </group>
      ))}
      {f < 26 && (
        <group position={[WORLD.gates[1].pos[0] - 1.5, 1.5, WORLD.gates[1].pos[2] - 0.1]} scale={1 - seg(f, 20, 6) * 0.3}>
          <Packet3D pos={[0, 0, 0]} danger />
        </group>
      )}
      <group position={[WORLD.gates[1].pos[0] - 0.9, 1.5, WORLD.gates[1].pos[2] - 0.1]}>
        <Shards3D p={shatter} seed={7} />
      </group>
    </group>
  );
};

export const RevealA: React.FC = () => {
  const f = useCurrentFrame();
  const pose = camAt(f, CAMS.reveal);
  const labels: LSpec[] = []; // gates rise as a silhouette — names return in the gauntlet
  return (
    <AbsoluteFill>
      <Canvas pose={pose}>
        <RevealScene />
      </Canvas>
      <AbsoluteFill style={{ pointerEvents: "none" }}>
        <Labels pose={pose} items={labels} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ================================ GAUNTLET ================================= */

const GauntletScene: React.FC = () => {
  const f = useCurrentFrame();
  const G = WORLD.gates;
  const z = -0.4;

  const r1 = segOut(f, 30, 130);
  const r1x = lerp(-8.4, 7.0, r1);
  const r2 = segOut(f, 185, 150);
  const r2x = lerp(-8.4, -0.9, r2);
  const boom = f >= 362;
  const chipFly = segOut(f, 382, 84);
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
    <group>
      <Board3D />
      <Link3D />
      <Client3D pos={[WORLD.client.pos[0], 0, WORLD.client.pos[2]]} />
      <Server3D pos={[WORLD.server.pos[0], 0, WORLD.server.pos[2]]} />
      {G.map((g, i) => (
        <Gate3D key={g.id} pos={[g.pos[0], 0, g.pos[2]]} label="" sub="" state={state(i)} flash={seg(f, 40 + i * 20, 24)} />
      ))}

      {r1 > 0 && r1 < 1 && <Packet3D pos={[r1x, 0.9, z]} />}
      {r1 > 0 && r1 < 0.98 && <Trail3D from={[r1x - 1.6, 0.9, z]} to={[r1x, 0.9, z]} color={T.code} />}

      {r2 > 0 && !boom && <Packet3D pos={[r2x, 0.62, z + 0.7]} danger />}
      {r2 > 0 && !boom && <Trail3D from={[r2x - 1.4, 0.62, z + 0.7]} to={[r2x, 0.62, z + 0.7]} />}
      {boom && (
        <group position={[-0.7, 0.62, z + 0.7]}>
          <Shards3D p={segOut(f, 362, 30)} seed={4} />
        </group>
      )}

      {burst > 0 && [0, 1, 2].map((i) => (
        <Packet3D key={i} pos={[lerp(-8.6, -4.7, Math.min(1, burst + i * 0.09)) - i * 0.3, 0.5 + i * 0.3, z + 0.35 + i * 0.6]} danger={i === 2} scale={0.9} />
      ))}
    </group>
  );
};

export const GauntletA: React.FC = () => {
  const f = useCurrentFrame();
  const pose = camAt(f, CAMS.gauntlet);
  const G = WORLD.gates;
  const z = -0.4;
  const r1 = segOut(f, 30, 130);
  const r1x = lerp(-8.4, 7.0, r1);
  const r2 = segOut(f, 185, 150);
  const r2x = lerp(-8.4, -0.9, r2);
  const boom = f >= 362;
  const chipFly = segOut(f, 382, 84);
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

  const labels: LSpec[] = [
    { p: [WORLD.client.pos[0], 1.62, WORLD.client.pos[2] + 0.35], text: "agent client", size: 24 },
    { p: [WORLD.client.pos[0], 1.18, WORLD.client.pos[2] + 0.35], text: "MODEL · LLM LOOP", size: 14, color: T.model, weight: 400 },
    { p: [WORLD.server.pos[0], 3.7, WORLD.server.pos[2]], text: "MCP server · 4 tools", size: 20, bg: "#04070c99" },
    ...G.flatMap((g, i): LSpec[] => {
      const c = state(i) === "block" ? T.danger : T.code;
      return [
        { p: [g.pos[0], 3.0, g.pos[2]], text: g.label, size: 19, color: c, ls: 2, bg: "#04070c99" },
        { p: [g.pos[0], -0.28, g.pos[2]], text: ["60 calls/min", "fs + sql jail", "strip + clip"][i], size: 13, color: T.muted, weight: 400 },
      ];
    }),
    ...["web_search", "db_query", "read_file", "write_file"].map((b, i) => ({
      p: [WORLD.server.pos[0] - 1.56 + i * 1.04, 0.5, WORLD.server.pos[2] + 0.65] as [number, number, number],
      text: b,
      size: 13,
      color: T.code,
      weight: 400,
    })),
    ...(r1 > 0 && r1 < 1 ? [{ p: [r1x, 1.5, z], text: "db_query('SELECT …')", size: 15, color: "#d8fff6", bg: "#06231ee6" } as LSpec] : []),
    ...(r1 >= 1 && f < 200 ? [{ p: [6.9, 0.9, z + 0.9], text: "result → model", size: 15, color: T.code, bg: "#06231eaa" } as LSpec] : []),
    ...(r2 > 0 && !boom ? [{ p: [r2x, 1.2, z + 0.7], text: "read_file('../../etc/passwd')", size: 15, color: "#ffd9e0", bg: "#2a0d16e6" } as LSpec] : []),
    ...(boom && chipFly < 0.96 ? [{ p: [lerp(-0.7, -9.4, chipFly), 0.62 + chipFly * 0.8, z + 0.7], text: "forbidden", size: 19, color: T.danger, bg: "#2a0d16f0" } as LSpec] : []),
    ...(burst > 0.8 ? [{ p: [-5.0, 1.7, z + 0.9], text: "rate_limited", size: 17, color: T.danger, bg: "#2a0d16f0" } as LSpec] : []),
    ...(burst > 0 ? [{ p: [-5.3, 0.3, z + 1.3], text: "web_search(…)  ×3 burst", size: 13, color: "#ffd9e0", bg: "#2a0d16cc", weight: 400 } as LSpec] : []),
  ];

  return (
    <AbsoluteFill>
      <Canvas pose={pose}>
        <GauntletScene />
      </Canvas>
      <AbsoluteFill style={{ pointerEvents: "none" }}>
        <Labels pose={pose} items={labels} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
