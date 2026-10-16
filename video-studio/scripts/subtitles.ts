// Generate SRT + VTT from a cues JSON: [{ "from": sec, "to": sec, "text": "..." }]
// Usage: npx tsx scripts/subtitles.ts <cues.json> <out-basename>   (writes .srt and .vtt)
import { readFileSync, writeFileSync } from "node:fs";

type Cue = { from: number; to: number; text: string };

const [cuesPath, base] = process.argv.slice(2);
if (!cuesPath || !base) throw new Error("usage: subtitles.ts <cues.json> <out-basename>");

const cues: Cue[] = JSON.parse(readFileSync(cuesPath, "utf8"));

const ts = (s: number, sep: string) => {
  const ms = Math.round(s * 1000);
  const p = (n: number, w = 2) => String(n).padStart(w, "0");
  return `${p(Math.floor(ms / 3600000))}:${p(Math.floor(ms / 60000) % 60)}:${p(Math.floor(ms / 1000) % 60)}${sep}${p(ms % 1000, 3)}`;
};

for (const [i, c] of cues.entries()) {
  const lines = c.text.split("\n");
  if (lines.length > 2 || lines.some((l) => l.length > 42)) console.warn(`cue ${i + 1}: exceeds 2 lines / 42 chars`);
  const d = c.to - c.from;
  if (d < 1 || d > 6) console.warn(`cue ${i + 1}: duration ${d.toFixed(2)}s outside 1-6 s`);
}

writeFileSync(`${base}.srt`, cues.map((c, i) => `${i + 1}\n${ts(c.from, ",")} --> ${ts(c.to, ",")}\n${c.text}\n`).join("\n"));
writeFileSync(`${base}.vtt`, `WEBVTT\n\n${cues.map((c) => `${ts(c.from, ".")} --> ${ts(c.to, ".")}\n${c.text}\n`).join("\n")}`);
console.log(`wrote ${base}.srt and ${base}.vtt (${cues.length} cues)`);
