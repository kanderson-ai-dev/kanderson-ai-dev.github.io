import { loadFont } from "@remotion/google-fonts/ChakraPetch";

export const { fontFamily: titleFont } = loadFont("normal", { weights: ["500", "700"], subsets: ["latin"] });

export const theme = {
  bg: "#050709",
  panel: "#0b1114",
  accent: "#00F5D4",
  text: "#e8fffb",
  muted: "#7fa8a1",
  danger: "#ff4d6d",
  mono: "'JetBrains Mono', Consolas, monospace"
} as const;
