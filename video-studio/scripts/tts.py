"""Kokoro TTS: one WAV per script sentence + timeline.json with measured durations.

Usage: .venv/Scripts/python scripts/tts.py <script.json> <out_dir> [--voice af_heart] [--speed 0.97] [--only id1,id2]

script.json: [{"id": "s01", "text": "...", "tts_text": "optional phonetic override", "scene": "hook"}]
"""

import argparse
import json
import os
import sys
from pathlib import Path

import numpy as np
import soundfile as sf

SR = 24000


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("script")
    ap.add_argument("out")
    ap.add_argument("--voice", default="af_heart")
    ap.add_argument("--speed", type=float, default=0.97)
    ap.add_argument("--only", default="")
    a = ap.parse_args()

    espeak = Path(os.environ.get("ProgramFiles", "C:/Program Files")) / "eSpeak NG"
    if espeak.exists():
        os.environ.setdefault("PHONEMIZER_ESPEAK_LIBRARY", str(espeak / "libespeak-ng.dll"))
        os.environ.setdefault("PHONEMIZER_ESPEAK_PATH", str(espeak / "espeak-ng.exe"))

    from kokoro import KPipeline

    out = Path(a.out)
    out.mkdir(parents=True, exist_ok=True)
    lines = json.loads(Path(a.script).read_text(encoding="utf-8"))
    only = {s for s in a.only.split(",") if s}
    pipe = KPipeline(lang_code="a", repo_id="hexgrad/Kokoro-82M")
    timeline = []
    for ln in lines:
        wav = out / f"vo_{ln['id']}.wav"
        if only and ln["id"] not in only and wav.exists():
            data, _ = sf.read(wav)
        else:
            chunks = [x if isinstance(x, np.ndarray) else x.numpy() for _, _, x in pipe(ln.get("tts_text", ln["text"]), voice=a.voice, speed=a.speed)]
            data = np.concatenate(chunks)
            sf.write(wav, data, SR)
        timeline.append({**ln, "file": wav.name, "duration": round(len(data) / SR, 3)})
        print(f"{ln['id']}: {timeline[-1]['duration']}s")
    (out / "timeline.json").write_text(json.dumps(timeline, indent=2, ensure_ascii=False), encoding="utf-8")
    return 0


if __name__ == "__main__":
    sys.exit(main())
