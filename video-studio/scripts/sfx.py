"""Synthesize original SFX (no third-party assets) and optionally assemble a bed.
Usage: python scripts/sfx.py <out_dir> [--cues cues.json --bed bed.wav --length 90]
cues.json: [{"sfx": "click", "t": 3.2, "gain": 0.8}, ...]  (t in seconds)
"""
import argparse, json, os
import numpy as np, soundfile as sf

SR = 48000
rng = np.random.default_rng(7)

def t(d): return np.arange(int(SR * d)) / SR
def env(n, a, r):
    e = np.ones(n); na, nr = int(SR * a), int(SR * r)
    e[:na] = np.linspace(0, 1, na); e[-nr:] = np.linspace(1, 0, nr) ** 2
    return e
def lp(x, k):
    return np.convolve(x, np.ones(k) / k, mode="same")

def click():
    x = t(0.09); s = np.sin(2 * np.pi * 1800 * x) * np.exp(-x * 90) + 0.4 * np.sin(2 * np.pi * 900 * x) * np.exp(-x * 60)
    return 0.5 * s
def whoosh():
    x = t(0.7); n = rng.standard_normal(len(x)); sweep = np.linspace(40, 4, len(x))
    out = np.zeros(len(x))
    for k in (4, 16, 48):
        out += lp(n, k) * (1 / k ** 0.3)
    out = out - lp(out, 400)
    return 0.55 * out / np.abs(out).max() * np.sin(np.pi * x / x[-1]) ** 1.5
def hit():
    x = t(1.1); f = 55 + 80 * np.exp(-x * 18)
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-x * 4.5)
    n = lp(rng.standard_normal(len(x)), 6) * np.exp(-x * 25) * 0.4
    return 0.6 * (s + n)
def glitch():
    x = t(0.35); n = rng.standard_normal(len(x)); g = (np.sin(2 * np.pi * 38 * x) > 0).astype(float)
    s = np.sign(np.sin(2 * np.pi * 700 * x * (1 + 0.5 * g))) * 0.25 + 0.2 * n
    return 0.45 * s * g * np.exp(-x * 7)
def riser(d=2.0):
    x = t(d); f = 200 * (12 ** (x / d)); ph = 2 * np.pi * np.cumsum(f) / SR
    s = np.sin(ph) + 0.5 * np.sin(2 * ph); s += 0.5 * lp(rng.standard_normal(len(x)), 3)
    return 0.4 * s / np.abs(s).max() * (x / d) ** 2 * (1 - np.exp(-x * 30))
def impact():
    x = t(1.4); f = 50 + 120 * np.exp(-x * 25)
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-x * 3.5)
    n = lp(rng.standard_normal(len(x)), 12) * np.exp(-x * 9) * 0.5
    return 0.6 * (s + n)
def stinger():
    x = t(2.4); out = np.zeros(len(x))
    for f, off in ((261.63, 0), (329.63, 0.04), (392.0, 0.08), (523.25, 0.12)):
        m = x >= off; y = np.zeros(len(x)); xx = x[m] - off
        y[m] = (np.sin(2 * np.pi * f * xx) + 0.3 * np.sin(2 * np.pi * 2 * f * xx)) * np.exp(-xx * 1.6)
        out += y
    return 0.28 * out / np.abs(out).max()

SFX = {"click": click, "whoosh": whoosh, "hit": hit, "glitch": glitch, "riser": riser, "impact": impact, "stinger": stinger}

def main():
    ap = argparse.ArgumentParser(); ap.add_argument("out"); ap.add_argument("--cues"); ap.add_argument("--bed"); ap.add_argument("--length", type=float, default=90)
    a = ap.parse_args(); os.makedirs(a.out, exist_ok=True)
    clips = {k: np.clip(f(), -1, 1) for k, f in SFX.items()}
    for k, v in clips.items(): sf.write(os.path.join(a.out, f"{k}.wav"), v, SR)
    if a.cues and a.bed:
        bed = np.zeros(int(SR * a.length))
        for c in json.load(open(a.cues, encoding="utf-8")):
            v = clips[c["sfx"]] * c.get("gain", 1.0); i = int(SR * c["t"]); v = v[: max(0, len(bed) - i)]
            bed[i:i + len(v)] += v
        sf.write(a.bed, np.clip(bed, -1, 1), SR)

if __name__ == "__main__": main()
