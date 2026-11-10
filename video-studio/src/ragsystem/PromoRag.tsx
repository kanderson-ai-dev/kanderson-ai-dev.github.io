/**
 * PromoRag — the final Agentic RAG film. 14 scenes on the flat stage, driven
 * by video-studio/projects/agentic-rag-system-film.json. Each scene animates
 * its approved G1 hero in real time, then hands off to real-app proof:
 * stub-mode clips (motion of the app in use) and live stills with camera
 * moves + highlights on the element the voice names.
 */
import React from "react";
import { AbsoluteFill, Easing, Sequence, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Grain, Particles, Stage } from "../upgrade/primitives";
import { C, bodyFont, monoFont, titleFont } from "../upgrade/utheme";
import {
  CountersBeat, DocStackBeat, EndCardRag, PersonBeat,
  ProblemBeat, RevealBeat, RewriteBeat, ShieldBeat, TwinSearchBeat, VerdictBeat, VersionsBeat, CostBeat,
} from "./heroes";
import { ActCard, BarsBeat, ColumnsBeat, Letterbox, RealClip, RealShot } from "./realshots";
import { AssetRoot } from "./assets";
import { Captions3 } from "../mcptoolkit3/Promo3";
import type { CaptionCue } from "../mcptoolkit3/Promo3";

export type RagSceneKind =
  | "coldopen" | "problem" | "reveal" | "question" | "promise1"
  | "promise2a" | "promise2b" | "promise3" | "control" | "proof"
  | "why" | "real" | "yours" | "cta";

export type RagScene = { id: string; kind: RagSceneKind | string; durationSec: number; voFile?: string | null; voStart?: number | null };
export type PromoRagProps = {
  fps: number;
  scenes: RagScene[];
  subtitles?: CaptionCue[];
  burnSubtitles?: boolean;
  fadeOutSec?: number;
  assetRoot?: "rag" | "rag2x"; // "rag2x": 2× pre-upscaled footage for the 4K master
  brackets?: boolean;
};

const seg = (t: number, a: number, b: number) => Math.min(1, Math.max(0, (t - a) / (b - a)));
const ease = (x: number) => 1 - Math.pow(1 - x, 3);

const HEADLINES: Partial<Record<string, React.ReactNode>> = {
  coldopen: <>It answers from <span style={{ color: C.accent }}>your documents</span>.</>,
  problem: <>Confident answers. <span style={{ color: C.danger }}>Zero proof.</span></>,
  question: <>Tricks are stopped <span style={{ color: C.accent }}>at the door</span>.</>,
  promise1: <>Promise one: <span style={{ color: C.accent }}>every answer shows its sources</span>.</>,
  promise2a: <>Promise two: <span style={{ color: C.accent }}>it checks its own evidence</span>.</>,
  promise2b: <>Still nothing? <span style={{ color: C.human }}>It won't guess.</span></>,
  promise3: <>Promise three: <span style={{ color: C.accent }}>quality you can measure</span>.</>,
  control: <>AI works. <span style={{ color: C.accent }}>Code enforces.</span> <span style={{ color: C.human }}>People decide.</span></>,
  proof: <>Measured. <span style={{ color: C.accent }}>Not claimed.</span></>,
  why: <>Turn the search off — <span style={{ color: C.danger }}>watch it fall.</span></>,
  real: <>A real product. <span style={{ color: C.accent }}>Not a slide.</span></>,
  yours: <>Point it at <span style={{ color: C.accent }}>your documents</span>.</>,
};

const ACT_CARDS: Partial<Record<string, string>> = {
  problem: "THE PROBLEM",
  promise1: "PROMISE 1 · EVERY ANSWER SHOWS ITS SOURCES",
  promise2a: "PROMISE 2 · NO PROOF, NO GUESS",
  promise3: "PROMISE 3 · QUALITY YOU CAN MEASURE",
  proof: "PROOF",
};

/* Stack of sub-shots inside one scene: each gets its own window + crossfade.
   Each shot is a Sequence so OffthreadVideo's media clock restarts at mount. */
const ShotSeq: React.FC<{ shots: { at: number; el: React.ReactNode }[]; local: number; fps: number }> = ({ shots, local, fps }) => (
  <AbsoluteFill>
    {shots.map((s, i) => {
      const next = i + 1 < shots.length ? shots[i + 1].at : Infinity;
      if (local < s.at - 0.4 || local >= next + 0.35) return null;
      const fadeIn = ease(seg(local, s.at - 0.35, s.at + 0.05));
      const fadeOut = 1 - ease(seg(local, next - 0.05, next + 0.3));
      const from = Math.max(0, Math.round(s.at * fps));
      const dur = next === Infinity ? undefined : Math.ceil((next + 0.35 - s.at) * fps);
      return (
        <AbsoluteFill key={i} style={{ opacity: Math.min(fadeIn, fadeOut), zIndex: i }}>
          <Sequence from={from} durationInFrames={dur} premountFor={Math.round(0.5 * fps)}>
            {s.el}
          </Sequence>
        </AbsoluteFill>
      );
    })}
  </AbsoluteFill>
);

const Center: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>{children}</div>
);

/* ---------- per-scene content ---------- */

const BeatView: React.FC<{ kind: string; dur: number }> = ({ kind, dur }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = f / fps;
  const t = dur > 0 ? Math.min(1, local / dur) : 1;

  switch (kind) {
    case "coldopen":
      return (
        <Letterbox open={ease(seg(local, 0.1, 1.2))}>
          <DocStackBeat t={t} />
        </Letterbox>
      );

    case "problem":
      // act card holds 0-2.6; the beat animates after it lifts
      return <ProblemBeat t={seg(local, 2.6, dur)} />;

    case "reveal":
      return (
        <>
          <RevealBeat t={Math.min(1, local / 5.8)} />
          <ShotSeq
            local={local} fps={fps}
            shots={[
              {
                at: 5.8,
                el: (
                  <Center>
                    <div style={{ transform: "translateY(120px)" }}>
                      <RealShot
                        file="rag/landing-empty-1280-dark.png" size={[1280, 900]}
                        crop={[290, 190, 700, 340]} width={1000} dur={2.2} t={local - 5.8}
                        enter={seg(local, 5.8, 6.5)} tag="real app · live run"
                      />
                    </div>
                  </Center>
                ),
              },
            ]}
          />
        </>
      );

    case "question":
      return (
        <ShotSeq
          local={local} fps={fps}
          shots={[
            { at: 0, el: <ShieldBeat t={Math.min(1, local / 3.2)} /> },
            {
              at: 3.2,
              el: (
                <Center>
                  <RealClip
                    seq="C02" count={178} size={[1120, 420]}
                    width={1180} rate={1.28}
                    enter={seg(local, 3.2, 3.8)} tag="real app · live-run data"
                  />
                </Center>
              ),
            },
          ]}
        />
      );

    case "promise1":
      return (
        <ShotSeq
          local={local} fps={fps}
          shots={[
            {
              at: 2.6,
              el: (
                <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
                  <div style={{ position: "relative", width: 1920, height: 700 }}>
                    <TwinSearchBeat t={Math.min(1, (local - 2.6) / 5.8)} />
                  </div>
                </div>
              ),
            },
            {
              at: 8.4,
              el: (
                <Center>
                  <RealClip
                    seq="C03" count={117} size={[980, 640]}
                    width={1050} rate={1.03}
                    enter={seg(local, 8.4, 9.0)} tag="real app · live-run data"
                  />
                </Center>
              ),
            },
            {
              at: 12.6,
              el: (
                <Center>
                  <RealShot
                    file="rag/console-chat.png" size={[912, 384]} width={1000}
                    dur={dur - 12.6} t={local - 12.6} enter={seg(local, 12.6, 13.2)} push={1.08}
                    highlights={[
                      { rect: [34, 230, 324, 56], color: C.accent },
                    ]}
                    hlFrom={0.8}
                  />
                </Center>
              ),
            },
          ]}
        />
      );

    case "promise2a":
      return (
        <ShotSeq
          local={local} fps={fps}
          shots={[
            { at: 2.6, el: <RewriteBeat t={Math.min(1, (local - 2.6) / 4.0)} /> },
            {
              at: 6.6,
              el: (
                <Center>
                  <RealShot
                    file="rag/landing-escalated.png" size={[1280, 900]}
                    crop={[300, 480, 680, 240]} width={1100}
                    dur={2.4} t={local - 6.6} enter={seg(local, 6.6, 7.2)}
                    highlights={[{ rect: [320, 598, 640, 30], color: C.human }]}
                    hlFrom={0.5}
                  />
                </Center>
              ),
            },
            {
              at: 9.0,
              el: (
                <Center>
                  <RealShot
                    file="rag/console-hitl-modal.png" size={[1280, 1000]}
                    crop={[360, 180, 560, 660]} width={640}
                    dur={dur - 9.0} t={local - 9.0} enter={seg(local, 9.0, 9.6)} push={1.05}
                    highlights={[{ rect: [410, 308, 460, 64], color: C.human }]}
                    hlFrom={0.6}
                  />
                </Center>
              ),
            },
          ]}
        />
      );

    case "promise2b":
      return (
        <ShotSeq
          local={local} fps={fps}
          shots={[
            { at: 0, el: <PersonBeat t={Math.min(1, local / 4.0)} /> },
            {
              at: 4.0,
              el: (
                <Center>
                  <RealShot
                    file="rag/console-hitl-modal.png" size={[1280, 1000]}
                    crop={[375, 180, 535, 640]} width={620}
                    dur={4.4} t={local - 4.0} enter={seg(local, 4.0, 4.6)} push={1.04}
                    highlights={[{ rect: [400, 448, 480, 348], color: C.human }]}
                    hlFrom={0.7}
                  />
                </Center>
              ),
            },
            {
              at: 8.4,
              el: (
                <Center>
                  <RealShot
                    file="rag/console-dashboard.png" size={[1280, 1000]}
                    crop={[700, 500, 520, 340]} width={760}
                    dur={dur - 8.4} t={local - 8.4} enter={seg(local, 8.4, 9.0)} push={1.06}
                    highlights={[{ rect: [865, 586, 205, 96], color: C.human }]}
                    hlFrom={0.5}
                  />
                </Center>
              ),
            },
          ]}
        />
      );

    case "promise3":
      return (
        <ShotSeq
          local={local} fps={fps}
          shots={[
            {
              at: 2.6,
              el: (
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 60 }}>
                  <div style={{ position: "relative", width: 860, height: 640 }}>
                    <VersionsBeat t={Math.min(1, (local - 2.6) / 4.2)} />
                  </div>
                  <div style={{ position: "relative", width: 800, height: 640 }}>
                    <VerdictBeat t={seg(local, 4.4, 6.0)} />
                  </div>
                </div>
              ),
            },
            {
              at: 6.8,
              el: (
                <Center>
                  <RealShot
                    file="rag/console-prompts-list.png" size={[912, 321]} width={1100}
                    dur={2.8} t={local - 6.8} enter={seg(local, 6.8, 7.4)}
                    highlights={[
                      { rect: [30, 93, 856, 214], color: C.accent },
                    ]}
                    hlFrom={0.55}
                  />
                </Center>
              ),
            },
            {
              at: 9.6,
              el: (
                <Center>
                  <RealShot
                    file="rag/console-prompts-diff.png" size={[862, 348]} width={1100}
                    dur={2.8} t={local - 9.6} enter={seg(local, 9.6, 10.2)}
                    highlights={[{ rect: [0, 0, 862, 348], color: C.accent }]}
                    hlFrom={0.5}
                  />
                </Center>
              ),
            },
            {
              at: 12.4,
              el: (
                <Center>
                  <RealClip
                    seq="C07" count={104} size={[1320, 700]}
                    width={1080} rate={0.77}
                    enter={seg(local, 12.4, 13.0)} tag="real app · live-run data"
                  />
                </Center>
              ),
            },
          ]}
        />
      );

    case "control":
      return <ColumnsBeat t={t} />;

    case "proof":
      return (
        <ShotSeq
          local={local} fps={fps}
          shots={[
            { at: 2.6, el: <CountersBeat t={Math.min(1, (local - 2.6) / 5.4)} /> },
            { at: 8.4, el: <CostBeat t={Math.min(1, (local - 8.4) / 2.6)} /> },
            {
              at: 11.0,
              el: (
                <Center>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 26 }}>
                    <RealShot
                      file="rag/console-performance.png" size={[912, 1844]}
                      crop={[15, 505, 882, 140]} width={1150}
                      dur={dur - 11.0} t={local - 11.0} enter={seg(local, 11.0, 11.7)} push={1.07}
                      highlights={[
                        { rect: [20, 518, 220, 112], color: C.accent },
                        { rect: [238, 518, 220, 112], color: C.accent },
                        { rect: [457, 518, 220, 112], color: C.accent },
                        { rect: [675, 518, 215, 112], color: C.accent },
                      ]}
                      hlFrom={0.9}
                    />
                    <div style={{ fontFamily: monoFont, fontSize: 26, color: C.muted, letterSpacing: 3 }}>
                      committed scorecard · 18 test questions
                    </div>
                  </div>
                </Center>
              ),
            },
          ]}
        />
      );

    case "why":
      return <BarsBeat t={t} />;

    case "real":
      return (
        <ShotSeq
          local={local} fps={fps}
          shots={[
            {
              at: 0,
              el: (
                <Center>
                  <RealShot
                    file="rag/console-dashboard.png" size={[1280, 1000]}
                    crop={[170, 60, 960, 560]} width={1100}
                    dur={3.1} t={local} enter={1} push={1.07}
                  />
                </Center>
              ),
            },
            {
              at: 3.1,
              el: (
                <Center>
                  <RealShot
                    file="rag/console-performance.png" size={[912, 1844]}
                    crop={[0, 505, 912, 330]} scrollY={[505, 1120]} width={980}
                    dur={3.1} t={local - 3.1} enter={seg(local, 3.1, 3.6)} push={1.02}
                  />
                </Center>
              ),
            },
            {
              at: 6.2,
              el: (
                <Center>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 46 }}>
                    <RealShot
                      file="rag/console-tablet-768.png" size={[768, 2574]}
                      crop={[0, 0, 768, 700]} width={560}
                      dur={3.1} t={local - 6.2} enter={seg(local, 6.2, 6.7)} push={1.05}
                    />
                    <RealShot
                      file="rag/console-mobile-375.png" size={[375, 3329]}
                      crop={[0, 0, 375, 640]} width={300}
                      dur={3.1} t={local - 6.2} enter={seg(local, 6.4, 6.9)} push={1.05}
                    />
                  </div>
                </Center>
              ),
            },
            {
              at: 9.3,
              el: (
                <Center>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
                    <RealShot
                      file="rag/console-prompts-ab-live.png" size={[862, 418]} width={950}
                      dur={3.2} t={local - 9.3} enter={seg(local, 9.3, 9.9)} push={1.05}
                    />
                    <div style={{ display: "flex", gap: 22, opacity: ease(seg(local, 10.2, 10.9)) }}>
                      {["396 tests", "95% coverage", "quality gates in CI"].map((c) => (
                        <div
                          key={c}
                          style={{
                            fontFamily: monoFont, fontSize: 26, fontWeight: 700, color: C.accent,
                            border: `1.5px solid ${C.accent}66`, borderRadius: 12, padding: "8px 20px",
                            background: `${C.accent}0d`,
                          }}
                        >
                          {c}
                        </div>
                      ))}
                    </div>
                  </div>
                </Center>
              ),
            },
          ]}
        />
      );

    case "yours":
      return (
        <>
          <Center>
            <RealShot
              file="rag/landing-empty-1280-dark.png" size={[1280, 900]}
              crop={[290, 185, 700, 345]} width={1150}
              dur={dur} t={local} enter={seg(local, 0, 0.6)} push={1.05}
              tag="real app · live run"
            />
          </Center>
          <div
            style={{
              position: "absolute", top: 170, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 26,
            }}
          >
            {["POLICIES", "CONTRACTS", "MANUALS"].map((w, i) => {
              const p = ease(seg(local, 0.8 + i * 1.4, 1.5 + i * 1.4));
              const lit = seg(local, 0.8 + i * 1.4, 1.9 + i * 1.4);
              return (
                <div
                  key={w}
                  style={{
                    fontFamily: titleFont, fontWeight: 700, fontSize: 44, letterSpacing: 4,
                    color: lit > 0.6 ? C.accent : C.text,
                    border: `2px solid ${lit > 0.6 ? C.accent : C.line}`,
                    borderRadius: 14, padding: "12px 30px", background: `${C.panel}ee`,
                    opacity: p, transform: `translateY(${(1 - p) * 40}px)`,
                    boxShadow: lit > 0.6 ? `0 0 40px ${C.accent}44` : "none",
                  }}
                >
                  {w}
                </div>
              );
            })}
          </div>
          <div
            style={{
              position: "absolute", bottom: 120, left: 0, right: 0, textAlign: "center",
              fontFamily: monoFont, fontSize: 26, color: C.muted, letterSpacing: 3,
              opacity: ease(seg(local, 5.6, 6.6)),
            }}
          >
            examples · adapted on request
          </div>
        </>
      );

    case "cta":
      return (
        <Center>
          <EndCardRag progress={Math.min(1, local / dur)} />
        </Center>
      );

    default:
      return null;
  }
};

const Camera: React.FC<{ idx: number; children?: React.ReactNode }> = ({ idx, children }) => {
  const f = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const entry = interpolate(f, [0, fps * 0.45], [1.05, 1], { easing: Easing.out(Easing.cubic), extrapolateRight: "clamp" });
  const dir = idx % 2 === 0 ? 1 : -1;
  const drift = interpolate(f, [0, Math.max(1, durationInFrames)], [0, 12 * dir]);
  const push = interpolate(f, [0, Math.max(1, durationInFrames)], [1, 1.02]);
  return <AbsoluteFill style={{ transform: `scale(${entry * push}) translateX(${drift}px)` }}>{children}</AbsoluteFill>;
};

export const PromoRag: React.FC<PromoRagProps> = ({ scenes, subtitles = [], burnSubtitles = true, fadeOutSec = 1.4, assetRoot = "rag", brackets = true }) => {
  const { fps, durationInFrames } = useVideoConfig();
  const frame = useCurrentFrame();
  let start = 0;
  return (
    <AssetRoot.Provider value={assetRoot}>
    <AbsoluteFill style={{ background: C.bg }}>
      {scenes.map((s, i) => {
        const dur = Math.round(s.durationSec * fps);
        const from = start;
        start += dur;
        const card = ACT_CARDS[s.kind];
        return (
          <Sequence key={s.id} from={from} durationInFrames={dur} name={s.id}>
            <Stage dim={s.kind === "proof" || s.kind === "cta" ? 0.7 : 1} brackets={brackets}>
              <Camera idx={i}>
                {HEADLINES[s.kind] && (
                  <div
                    data-qa="headline"
                    style={{
                      position: "absolute", top: 56, left: 0, right: 0, textAlign: "center",
                      fontFamily: titleFont, fontWeight: 700, fontSize: 52, color: C.text, padding: "0 140px",
                    }}
                  >
                    {HEADLINES[s.kind]}
                  </div>
                )}
                <BeatView kind={s.kind} dur={s.durationSec} />
              </Camera>
            </Stage>
            {card && <ActCard text={card} local={frame / fps - from / fps} dur={2.6} />}
          </Sequence>
        );
      })}
      <Particles />
      <Grain />
      {fadeOutSec ? (
        <AbsoluteFill
          style={{
            background: "#000",
            opacity: interpolate(frame, [durationInFrames - fadeOutSec * fps, durationInFrames], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          }}
        />
      ) : null}
      {burnSubtitles && <Captions3 cues={subtitles} />}
    </AbsoluteFill>
    </AssetRoot.Provider>
  );
};
