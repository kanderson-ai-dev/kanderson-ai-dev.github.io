// Mix silent render + voice + music (+ optional sfx bed): sidechain ducking, two-pass loudnorm to -14 LUFS / TP -1.5.
// Usage: npx tsx scripts/mix.ts <silent.mp4> <voice.wav> <music.(mp3|wav)> <out.mp4> [sfx.wav]
import { spawnSync } from "node:child_process";

const [video, voice, music, out, sfx] = process.argv.slice(2);
if (!video || !voice || !music || !out) throw new Error("usage: mix.ts <silent.mp4> <voice.wav> <music> <out.mp4> [sfx.wav]");

const inputs = ["-i", video, "-i", voice, "-i", music, ...(sfx ? ["-i", sfx] : [])];
const tail = sfx ? "[vo2][duck][3:a]amix=inputs=3:duration=first:normalize=0" : "[vo2][duck]amix=inputs=2:duration=first:normalize=0";
const bed =
  "[1:a]asplit=2[vo1][vo2];[2:a]volume=0.3[m];[m][vo1]sidechaincompress=threshold=0.02:ratio=8:attack=20:release=400[duck];" + tail;
const target = "I=-14:TP=-1.5:LRA=11";

const measure = spawnSync("ffmpeg", ["-hide_banner", ...inputs, "-filter_complex", `${bed},loudnorm=${target}:print_format=json[a]`, "-map", "[a]", "-f", "null", "-"], { encoding: "utf8" });
const m = /\{[^{}]*"input_i"[^{}]*\}/.exec(measure.stderr)?.[0];
if (!m) throw new Error(`loudnorm measurement failed:\n${measure.stderr.slice(-800)}`);
const j = JSON.parse(m) as Record<string, string>;
const second = `loudnorm=${target}:measured_I=${j.input_i}:measured_TP=${j.input_tp}:measured_LRA=${j.input_lra}:measured_thresh=${j.input_thresh}:offset=${j.target_offset}:linear=true`;
// loudnorm linear does not guarantee the true-peak ceiling; catch residual overshoots.
const limiter = "alimiter=limit=0.75:level=false"; // -2.5 dBFS sample peak so inter-sample true peak stays <= -1.5 dBFS

const args = ["-y", ...inputs, "-filter_complex", `${bed},${second},${limiter}[a]`, "-map", "0:v", "-map", "[a]", "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-ar", "48000", "-t", "", "-movflags", "+faststart", out];
args.splice(args.indexOf("-t"), 2);
const r = spawnSync("ffmpeg", args, { stdio: "inherit" });
process.exit(r.status ?? 1);
