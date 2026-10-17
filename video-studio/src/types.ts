export type Rect = { x: number; y: number; w: number; h: number };

export type Callout = { n: number; text: string; x: number; y: number; atSec?: number };

export type Segment = { clip: string; startSec: number; durationSec: number; rate?: number; zoom?: { from: Rect; to: Rect }; callouts?: Callout[] };

export type TrioPanel = { clip: string; startSec: number; rate?: number; crop: Rect; x: number; y: number; w: number; delaySec: number };

export type Scene = {
  id: string;
  durationSec: number;
  kind: "title" | "problem" | "pain" | "flow" | "arch" | "clip" | "trio" | "metric" | "end";
  voice?: { id: string; atSec: number };
  sfx?: { sfx: string; atSec: number; gain?: number }[];
  frame?: "full" | "inset";
  segments?: Segment[];
  panels?: TrioPanel[];
  arch?: { llmAt: number; codeAt: number; humanAt: number };
  backdrop?: { clip: string; startSec: number };
  text?: string;
  sub?: string;
  clip?: string;
  zoom?: { from: Rect; to: Rect };
  callouts?: Callout[];
  metric?: { label: string; from: number; to: number; suffix: string; versus?: { label: string; value: string }; note?: string };
  end?: { url: string; line?: string; disclaimer?: string; contact?: string };
  headline?: string;
  stageScale?: number;
};

export type PromoProps = {
  slug: string;
  title: string;
  fps: number;
  scenes: Scene[];
  transitionFrames: number;
  fadeOutSec?: number;
  subtitles?: { from: number; to: number; text: string }[];
  thumb?: { big: string; sub?: string };
};
