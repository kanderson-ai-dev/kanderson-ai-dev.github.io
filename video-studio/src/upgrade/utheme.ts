import { loadFont } from "@remotion/google-fonts/ChakraPetch";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";

export const { fontFamily: titleFont } = loadFont("normal", { weights: ["500", "700"], subsets: ["latin"] });
export const { fontFamily: bodyFont } = loadInter("normal", { weights: ["400", "500", "600", "700"], subsets: ["latin"] });
export const { fontFamily: monoFont } = loadMono("normal", { weights: ["400", "600", "700"], subsets: ["latin"] });

export const C = {
  bg: "#050709",
  panel: "#0b1114",
  panel2: "#0f1a1f",
  accent: "#00F5D4",
  text: "#e8fffb",
  muted: "#7fa8a1",
  dim: "#3f5f5a",
  danger: "#ff4d6d",
  model: "#9b8cff",
  human: "#ffc857",
  warn: "#ffb020",
  line: "#17343a",
  // faithful replica of the product's light UI
  lightBg: "#f1f4f6",
  lightPanel: "#ffffff",
  lightBorder: "#d9e2e6",
  lightText: "#22333a",
  lightMuted: "#5a6b73",
  lightTeal: "#0f766e",
  lightTealBright: "#0d9488",
  lightRed: "#b91c1c",
  lightGreenBg: "#dcfce7",
  lightGreenText: "#166534",
} as const;
