"""Build full voice track and SFX bed from a project JSON + timeline.json.
Usage: python scripts/build_audio.py <project.json> <vo_dir> <sfx_dir> <out_dir>
"""
import json, sys, os
import numpy as np, soundfile as sf

proj, vo, sfxd, out = sys.argv[1:5]
SR = 48000
p = json.load(open(proj, encoding="utf-8"))
total = sum(s["durationSec"] for s in p["scenes"])
voice = np.zeros(int(SR * total)); bed = np.zeros(int(SR * total))

def put(buf, x, t, gain=1.0):
    i = int(SR * t); x = x[: max(0, len(buf) - i)] * gain; buf[i:i + len(x)] += x

def load(path):
    x, sr = sf.read(path)
    if x.ndim > 1: x = x.mean(axis=1)
    if sr != SR:
        n = int(len(x) * SR / sr); x = np.interp(np.linspace(0, len(x) - 1, n), np.arange(len(x)), x)
    return x

start = 0.0
for s in p["scenes"]:
    if s.get("voice"): put(voice, load(os.path.join(vo, f"vo_{s['voice']['id']}.wav")), start + s["voice"]["atSec"])
    for c in s.get("sfx", []): put(bed, load(os.path.join(sfxd, f"{c['sfx']}.wav")), start + c["atSec"], c.get("gain", 1.0))
    start += s["durationSec"]
os.makedirs(out, exist_ok=True)
sf.write(os.path.join(out, "voice_full.wav"), np.clip(voice, -1, 1), SR)
sf.write(os.path.join(out, "sfx_bed.wav"), np.clip(bed, -1, 1), SR)
print("ok", total)
