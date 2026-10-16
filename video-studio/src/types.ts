export type Rect = { x: number; y: number; w: number; h: number };

export type Callout = { n: number; text: string; x: number; y: number; atSec?: number };

export type Scene = {
  id: string;
  durationSec: number;
  kind: "title" | "problem" | "clip" | "metric" | "end";
  text?: string;
  sub?: string;
  clip?: string;
  zoom?: { from: Rect; to: Rect };
  callouts?: Callout[];
  metric?: { label: string; from: number; to: number; suffix: string; versus?: { label: string; value: string }; note?: string };
  end?: { url: string; line?: string; disclaimer?: string; contact?: string };
};

export type PromoProps = {
  slug: string;
  title: string;
  fps: number;
  scenes: Scene[];
  transitionFrames: number;
  subtitles?: { from: number; to: number; text: string }[];
};
