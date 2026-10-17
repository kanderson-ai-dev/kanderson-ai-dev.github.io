# Video pipeline (Windows)

Everything lives in `video-studio/`. Work files go to `_video/<slug>/` (never committed).

## One-time setup (tested 2026-10-16)

```powershell
winget install --id Gyan.FFmpeg -e
winget install --id eSpeak-NG.eSpeak-NG -e
cd video-studio
npm install
npx playwright install chromium
uv venv --python 3.12 .venv
uv pip install --python .venv/Scripts/python.exe kokoro soundfile
```

Open a new terminal afterwards so `ffmpeg`/`ffprobe` are on `PATH`. First TTS run downloads the Kokoro model and a spaCy model (~1 GB total incl. torch). Python 3.13 is not used; Kokoro runs on the 3.12 venv.

## Commands

| Step | Command |
|---|---|
| Preview | `npx remotion studio src/index.ts` |
| Silent render | `npx remotion render src/index.ts ProjectPromo out/<slug>-silent.mp4 --props=projects/<slug>.json --codec=h264 --crf=18` |
| Voice (one WAV per sentence + `timeline.json`) | `.venv/Scripts/python scripts/tts.py ../_video/<slug>/script.json ../_video/<slug>/vo [--voice af_heart --speed 0.97 --only s03]` |
| Subtitles | `npx tsx scripts/subtitles.ts cues.json subtitles/<slug>` (writes `.srt` and `.vtt`, warns on >2 lines, >42 chars, 1-6 s) |
| Mix + export | `npx tsx scripts/mix.ts out/<slug>-silent.mp4 voice.wav music.mp3 out/<slug>-final.mp4 [sfx.wav]` (sidechain ducking, two-pass loudnorm -14 LUFS / TP -1.5) |
| Capture helpers | `capture/lib.ts` (`startSession`, `clickOn`, `typeInto`, `moveTo`, `finish`); smoke test: `npx tsx capture/smoke.ts <dir>` |

Clips used by `clip` scenes are resolved with `staticFile()`: copy them into `video-studio/public/clips/` (git-ignored via the `*.webm`/`*.mp4` rules) before rendering.

## Validated by the pilot

- Remotion render of a 11 s composition (title, problem, metric counter, end card) at 1920x1080/30 fps: OK.
- Kokoro (`af_heart`) generated two sentences; durations written to `timeline.json`.
- Mix with a synthetic test bed: H.264 + AAC 48 kHz, 11 s; measured about -15.5 LUFS, true peak -1.4 dBFS on a voice-light test clip (re-measure on the real mix).
- Playwright capture helper: recorded a 1920x1080 clip with the overlaid cursor and click ripple.

## Known notes

- Remotion's renderer downloads Chrome Headless Shell on first render.
- ffmpeg/espeak-ng are GPL tools; they are not redistributed with the videos.
- Reading generated frames/clips: keep review copies under `_video/` (the `out/` folder is ignored).

## Capture quality (learned on the pilot)

Playwright's `recordVideo` is capped at 1 Mbit/s VP8 and looks soft once zoomed. `capture/lib.ts` therefore records through the CDP screencast (JPEG q=100 frames with real timestamps) at a 2880x1620 viewport (`body{zoom:2}` keeps the 1440 px layout) and encodes with x264 CRF 14 to `.mp4`. Remotion renders with JPEG quality 100 and the silent render uses `--crf=12`. Effects are scaled by `SFX_MASTER` in `scripts/build_audio.py`; `scripts/build_audio.py` builds `voice_full.wav` and `sfx_bed.wav` from the project JSON.
