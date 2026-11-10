/** Option A objects — real 3D versions of the world furniture.
 *  NOTE: drei `Html` renders nothing under Remotion's headless GL, so every
 *  label uses drei `Text` (troika SDF — pure in-canvas geometry). */
import React from "react";
import * as THREE from "three";
import { RoundedBox, Text } from "@react-three/drei";
import { staticFile } from "remotion";
import { T, fonts, lerp, clamp01, rand } from "../theme";
import { WORLD } from "../world";

export const C = {
  code: T.code,
  model: T.model,
  human: T.human,
  danger: T.danger,
  panel: "#0a1420",
  panel2: "#0e1a2a",
};

export const seg = (f: number, a: number, d: number) => clamp01((f - a) / d);
export const segOut = (f: number, a: number, d: number) => {
  const t = seg(f, a, d);
  return t * t * (3 - 2 * t);
};

const MONO = staticFile("fonts/DejaVuSansMono-Bold.ttf");
const TITLE = staticFile("fonts/DejaVuSans-Bold.ttf");

/** Text in 3D proved unreliable under headless GL (async font/SDF), so all
 *  labels render as DOM overlays via proj.ts. SyncText is a no-op stub kept
 *  so existing JSX stays valid. */
const SyncText: React.FC<React.ComponentProps<typeof Text>> = () => null;

/** In-canvas label; troika renders this as geometry — always visible. */
export const Label3D: React.FC<{
  pos: [number, number, number];
  text: string;
  size?: number;
  color?: string;
  weight?: number;
  ls?: number;
  outline?: number;
}> = ({ pos, text, size = 0.28, color = T.text, weight = 700, ls = 1.6, outline = 0 }) => (
  <SyncText
    position={pos}
    fontSize={size}
    color={color}
    font={weight >= 700 ? MONO : staticFile("fonts/DejaVuSansMono.ttf")}
    letterSpacing={ls * 0.06}
    anchorX="center"
    anchorY="middle"
    outlineWidth={outline}
    outlineColor="#02060a"
  >
    {text}
  </SyncText>
);

/* --------------------------------- board ---------------------------------- */

export const Board3D: React.FC = () => (
  <group>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]}>
      <planeGeometry args={[34, 20]} />
      <meshStandardMaterial color="#060d18" roughness={0.92} metalness={0.15} />
    </mesh>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]}>
      <planeGeometry args={[32, 18, 32, 18]} />
      <meshBasicMaterial color={T.grid} wireframe transparent opacity={0.55} />
    </mesh>
    {Array.from({ length: 10 }, (_, i) => {
      const r = (j: number) => rand(i * 29 + j * 11);
      const x0 = (r(1) - 0.5) * 26;
      const z0 = (r(2) - 0.5) * 14;
      const pts = [new THREE.Vector3(x0, 0.02, z0)];
      let x = x0;
      let z = z0;
      for (let s = 0; s < 3; s++) {
        if (r(3 + s) > 0.5) x += (r(6 + s) - 0.35) * 6;
        else z += (r(9 + s) - 0.35) * 4;
        pts.push(new THREE.Vector3(x, 0.02, z));
      }
      const geo = new THREE.BufferGeometry().setFromPoints(pts);
      return (
        <primitive key={i} object={new THREE.Line(geo, new THREE.LineBasicMaterial({ color: T.code, transparent: true, opacity: 0.25 }))} />
      );
    })}
  </group>
);

/* ------------------------------ protocol link ------------------------------ */

export const Link3D: React.FC<{ lit?: number }> = ({ lit = 1 }) => {
  const L = WORLD.link;
  const curve = React.useMemo(() => new THREE.LineCurve3(new THREE.Vector3(...L.from), new THREE.Vector3(...L.to)), [L]);
  return (
    <group>
      <mesh>
        <tubeGeometry args={[curve, 24, 0.05, 8, false]} />
        <meshStandardMaterial color={T.code} emissive={T.code} emissiveIntensity={0.85 * lit} roughness={0.4} />
      </mesh>
      <mesh>
        <tubeGeometry args={[curve, 24, 0.16, 8, false]} />
        <meshBasicMaterial color={T.code} transparent opacity={0.09 * lit} depthWrite={false} />
      </mesh>
    </group>
  );
};

/* -------------------------------- question card ---------------------------- */

export const QuestionCard3D: React.FC<{ pos: [number, number, number]; typed: string; done: boolean; chip?: string; w?: number }> = ({
  pos, typed, done, chip, w = 4.9,
}) => {
  // wrap the typed line onto two rows for the panel face
  const max = 34;
  const line1 = typed.slice(0, max);
  const line2 = typed.slice(max, max * 2);
  return (
    <group position={pos}>
      <RoundedBox args={[w, w * 0.6, 0.22]} radius={0.09} smoothness={4}>
        <meshStandardMaterial color={C.panel2} roughness={0.6} metalness={0.2} emissive={T.code} emissiveIntensity={0.04} />
      </RoundedBox>
      <RoundedBox args={[w + 0.08, w * 0.6 + 0.08, 0.06]} radius={0.1} smoothness={4} position={[0, 0, -0.1]}>
        <meshStandardMaterial color={T.code} emissive={T.code} emissiveIntensity={0.7} roughness={0.4} transparent opacity={0.75} />
      </RoundedBox>
      {/* content on the +z face */}
      <group position={[-w / 2 + 0.32, 0, 0.16]}>
        <mesh position={[0.14, 0.62, 0]}>
          <circleGeometry args={[0.09, 16]} />
          <meshBasicMaterial color={T.code} />
        </mesh>
        <SyncText position={[0.34, 0.62, 0]} fontSize={0.2} color={T.muted} font={MONO} letterSpacing={0.25} anchorX="left" anchorY="middle">
          QUESTION
        </SyncText>
        <SyncText position={[0, 0.28, 0]} fontSize={0.32} color={T.text} font={TITLE} fontWeight={700} anchorX="left" anchorY="middle" maxWidth={w - 0.6} lineHeight={1.3}>
          {line1}
        </SyncText>
        <SyncText position={[0, -0.18, 0]} fontSize={0.32} color={T.text} font={TITLE} fontWeight={700} anchorX="left" anchorY="middle" maxWidth={w - 0.6} lineHeight={1.3}>
          {line2 + (!done ? "▌" : "")}
        </SyncText>
        {chip && (
          <>
            <mesh position={[1.15, -0.72, -0.02]}>
              <planeGeometry args={[2.5, 0.42]} />
              <meshStandardMaterial color="#14102e" emissive={T.model} emissiveIntensity={0.35} transparent opacity={0.95} />
            </mesh>
            <SyncText position={[0, -0.72, 0.01]} fontSize={0.19} color={T.model} font={MONO} anchorX="left" anchorY="middle" letterSpacing={0.06}>
              {chip}
            </SyncText>
          </>
        )}
      </group>
    </group>
  );
};

/* --------------------------------- monolith -------------------------------- */

const MonoGlyph: React.FC<{ kind: string; lit: number }> = ({ kind, lit }) => {
  const e = 0.25 + lit * 0.75;
  if (kind === "database")
    return (
      <group>
        {[0, 1, 2, 3].map((i) => (
          <mesh key={i} position={[0, -0.55 + i * 0.36, 0]}>
            <torusGeometry args={[0.62, 0.035, 8, 40]} />
            <meshStandardMaterial color={T.model} emissive={T.model} emissiveIntensity={e} roughness={0.4} />
          </mesh>
        ))}
      </group>
    );
  if (kind === "files")
    return (
      <group>
        {[0, 1, 2].map((i) => (
          <mesh key={i} position={[-0.28 + i * 0.28, 0.05, i * -0.06]} rotation={[0, 0, 0.06 * (i - 1)]}>
            <boxGeometry args={[0.62, 0.85, 0.05]} />
            <meshStandardMaterial color={T.panel2} emissive={T.model} emissiveIntensity={e * 0.8} roughness={0.5} transparent opacity={0.95} />
          </mesh>
        ))}
      </group>
    );
  return (
    <mesh>
      <sphereGeometry args={[0.66, 16, 12]} />
      <meshStandardMaterial color={T.model} emissive={T.model} emissiveIntensity={e} wireframe roughness={0.4} />
    </mesh>
  );
};

export const Monolith3D: React.FC<{ pos: [number, number, number]; kind: string; label: string; lit: number }> = ({ pos, kind, label, lit }) => (
  <group position={pos}>
    <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <circleGeometry args={[1.4, 32]} />
      <meshBasicMaterial color={T.model} transparent opacity={0.08 * lit} depthWrite={false} />
    </mesh>
    <RoundedBox args={[1.9, 3.1, 0.9]} radius={0.08} smoothness={4} position={[0, 1.55, 0]}>
      <meshStandardMaterial
        color={C.panel2}
        roughness={0.55}
        metalness={0.3}
        emissive={T.model}
        emissiveIntensity={0.05 + lit * 0.1}
        transparent
        opacity={0.55 + lit * 0.45}
      />
    </RoundedBox>
    <RoundedBox args={[2.0, 3.2, 0.06]} radius={0.08} smoothness={4} position={[0, 1.55, 0.46]}>
      <meshStandardMaterial color={T.model} emissive={T.model} emissiveIntensity={0.25 + lit * 0.7} roughness={0.4} transparent opacity={0.35 + lit * 0.45} />
    </RoundedBox>
    <group position={[0, 1.9, 0.52]}>
      <MonoGlyph kind={kind} lit={lit} />
    </group>
    <Label3D pos={[0, 0.62, 0.52]} text={label} size={0.26} color={lit > 0.5 ? T.text : T.dim} weight={400} ls={0.6} />
  </group>
);

/* ---------------------------------- packet --------------------------------- */

export const Packet3D: React.FC<{ pos: [number, number, number]; danger?: boolean; text?: string; scale?: number }> = ({
  pos, danger, text, scale = 1,
}) => {
  const c = danger ? T.danger : T.code;
  return (
    <group position={pos} scale={scale}>
      <mesh>
        <octahedronGeometry args={[0.3, 0]} />
        <meshStandardMaterial color={c} emissive={c} emissiveIntensity={1.4} roughness={0.3} />
      </mesh>
      <mesh>
        <octahedronGeometry args={[0.5, 0]} />
        <meshBasicMaterial color={c} transparent opacity={0.14} depthWrite={false} />
      </mesh>
      {text && (
        <group position={[0, 0.62, 0]}>
          <mesh position={[0, 0, -0.03]}>
            <planeGeometry args={[text.length * 0.155 + 0.5, 0.42]} />
            <meshStandardMaterial color={danger ? "#2a0d16" : "#06231e"} transparent opacity={0.94} />
          </mesh>
          <SyncText position={[0, 0, 0.02]} fontSize={0.21} color={danger ? "#ffd9e0" : "#d8fff6"} font={MONO} fontWeight={700} anchorX="center" anchorY="middle">
            {text}
          </SyncText>
        </group>
      )}
    </group>
  );
};

export const Trail3D: React.FC<{ from: [number, number, number]; to: [number, number, number]; color?: string }> = ({ from, to, color = T.danger }) => {
  const curve = React.useMemo(() => new THREE.LineCurve3(new THREE.Vector3(...from), new THREE.Vector3(...to)), [from, to]);
  return (
    <mesh>
      <tubeGeometry args={[curve, 12, 0.09, 6, false]} />
      <meshBasicMaterial color={color} transparent opacity={0.5} depthWrite={false} />
    </mesh>
  );
};

/* ----------------------------------- gate ---------------------------------- */

export const Gate3D: React.FC<{
  pos: [number, number, number];
  label: string;
  sub: string;
  state: "idle" | "pass" | "block";
  flash?: number;
}> = ({ pos, label, sub, state, flash = 0 }) => {
  const c = state === "block" ? T.danger : T.code;
  const e = state === "idle" ? 0.3 : 0.85 + flash;
  return (
    <group position={pos}>
      {[-0.75, 0.75].map((x) => (
        <RoundedBox key={x} args={[0.26, 2.6, 0.26]} radius={0.08} smoothness={4} position={[x, 1.3, 0]}>
          <meshStandardMaterial color={C.panel2} emissive={c} emissiveIntensity={e * 0.55} roughness={0.5} metalness={0.3} />
        </RoundedBox>
      ))}
      <RoundedBox args={[1.9, 0.26, 0.26]} radius={0.08} smoothness={4} position={[0, 2.55, 0]}>
        <meshStandardMaterial color={C.panel2} emissive={c} emissiveIntensity={e * 0.55} roughness={0.5} metalness={0.3} />
      </RoundedBox>
      <mesh position={[0, 1.25, 0]}>
        <planeGeometry args={[1.26, 2.3]} />
        <meshBasicMaterial color={c} transparent opacity={state === "idle" ? 0.07 : 0.16} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      {state !== "idle" && (
        <mesh position={[0, 1.25, 0]}>
          <planeGeometry args={[1.26, 0.07]} />
          <meshBasicMaterial color={c} transparent opacity={0.8} side={THREE.DoubleSide} />
        </mesh>
      )}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.5, 32]} />
        <meshBasicMaterial color={c} transparent opacity={state === "idle" ? 0.04 : 0.12} depthWrite={false} />
      </mesh>
      <Label3D pos={[0, 2.98, 0]} text={label} size={0.26} color={c} ls={2} outline={0.05} />
      <Label3D pos={[0, -0.25, 0]} text={sub} size={0.15} color={T.muted} weight={400} ls={0.6} />
    </group>
  );
};

/* ---------------------------------- shards --------------------------------- */

export const Shards3D: React.FC<{ p: number; seed: number; n?: number; color?: string }> = ({ p, seed, n = 14, color = T.danger }) => {
  if (p <= 0) return null;
  return (
    <group>
      {Array.from({ length: n }, (_, i) => {
        const r = (j: number) => rand(seed * 97 + i * 13 + j * 7);
        const ang = r(1) * Math.PI * 2;
        const v = 1.6 + r(2) * 3.2;
        const x = Math.cos(ang) * v * p;
        const y = Math.sin(ang) * v * p * 0.7 + p * 1.4 - p * p * 1.6;
        const z = (r(3) - 0.5) * 2.4 * p;
        const s = 0.1 + r(4) * 0.3;
        const o = clamp01(1.3 - p * 1.15);
        return (
          <mesh key={i} position={[x, y, z]} rotation={[r(5) * p * 8, r(6) * p * 8, r(7) * p * 8]} scale={s}>
            <tetrahedronGeometry args={[1, 0]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.9 * o} transparent opacity={o} roughness={0.4} />
          </mesh>
        );
      })}
    </group>
  );
};

/* -------------------------------- error chip -------------------------------- */

export const ErrorChip3D: React.FC<{ pos: [number, number, number]; code: string; size?: number }> = ({ pos, code, size = 0.26 }) => (
  <group position={pos}>
    <mesh position={[0, 0, -0.03]}>
      <planeGeometry args={[code.length * 0.19 + 0.55, 0.5]} />
      <meshStandardMaterial color="#2a0d16" emissive={T.danger} emissiveIntensity={0.25} transparent opacity={0.96} />
    </mesh>
    <SyncText position={[0, 0, 0.02]} fontSize={size} color={T.danger} font={MONO} fontWeight={700} anchorX="center" anchorY="middle" outlineWidth={0.03} outlineColor="#000">
      {code}
    </SyncText>
  </group>
);

/* ------------------------------ client + server ----------------------------- */

export const Client3D: React.FC<{ pos: [number, number, number] }> = ({ pos }) => (
  <group position={pos}>
    <RoundedBox args={[2.8, 2.9, 0.5]} radius={0.1} smoothness={4} position={[0, 1.45, 0]}>
      <meshStandardMaterial color={C.panel2} roughness={0.6} metalness={0.25} emissive={T.model} emissiveIntensity={0.08} />
    </RoundedBox>
    <RoundedBox args={[2.9, 3.0, 0.06]} radius={0.1} smoothness={4} position={[0, 1.45, 0.24]}>
      <meshStandardMaterial color={T.model} emissive={T.model} emissiveIntensity={0.4} roughness={0.4} transparent opacity={0.5} />
    </RoundedBox>
    <Label3D pos={[0, 1.62, 0.3]} text="agent client" size={0.28} color={T.text} ls={0.4} />
    <Label3D pos={[0, 1.22, 0.3]} text="MODEL · LLM LOOP" size={0.17} color={T.model} weight={400} ls={1.2} />
  </group>
);

export const Server3D: React.FC<{ pos: [number, number, number]; litBays?: number[] }> = ({ pos, litBays = [1, 1, 1, 1] }) => (
  <group position={pos}>
    <RoundedBox args={[4.4, 3.4, 1.1]} radius={0.12} smoothness={4} position={[0, 1.7, 0]}>
      <meshStandardMaterial color={C.panel2} roughness={0.6} metalness={0.25} emissive={T.code} emissiveIntensity={0.07} />
    </RoundedBox>
    {["web_search", "db_query", "read_file", "write_file"].map((b, i) => (
      <group key={b} position={[-1.56 + i * 1.04, 1.55, 0.6]}>
        <RoundedBox args={[0.92, 1.5, 0.14]} radius={0.06} smoothness={4}>
          <meshStandardMaterial
            color={C.panel}
            emissive={T.code}
            emissiveIntensity={0.15 + litBays[i] * 0.5}
            roughness={0.5}
            transparent
            opacity={0.6 + litBays[i] * 0.4}
          />
        </RoundedBox>
        <Label3D pos={[0, -1.05, 0.1]} text={b} size={0.15} color={litBays[i] > 0.5 ? T.code : T.dim} weight={400} ls={0.4} />
      </group>
    ))}
    <Label3D pos={[0, 3.6, 0]} text="MCP server · 4 tools" size={0.26} color={T.text} ls={0.6} outline={0.04} />
  </group>
);
