"""Build subtitle cues from a project JSON + vo/timeline.json.

Each voice sentence becomes one or more cues (max 2 lines, <=42 chars/line,
1-6 s each). Cue times are proportional to the share of characters spoken,
inside the sentence's window [scene_start + atSec, +duration].

Usage: python scripts/subcues.py <project.json> <timeline.json> <cues.json>
"""
import json
import re
import sys

MAX_LINE = 42
MAX_LINES = 2
MIN_DUR, MAX_DUR = 1.0, 6.0


def wrap(text: str) -> list[str]:
    """Greedy word-wrap into lines of <= MAX_LINE chars."""
    lines: list[str] = []
    for part in text.split("\n"):
        cur = ""
        for w in part.split(" "):
            t = (cur + " " + w).strip()
            if len(t) <= MAX_LINE:
                cur = t
            else:
                if cur:
                    lines.append(cur)
                cur = w
        if cur:
            lines.append(cur)
    return lines


def chunks(text: str) -> list[str]:
    """Split a sentence into cue-sized pieces (<=2 lines), preferring clause breaks."""
    # Candidate split points: after . , ; : — keeping the punctuation.
    parts = [p.strip() for p in re.split(r"(?<=[.,;:])\s+", text) if p.strip()]
    cues: list[str] = []
    cur = ""
    for p in parts:
        cand = (cur + " " + p).strip()
        if cur and len(wrap(cand)) > MAX_LINES:
            cues.append(cur)
            cur = p
        else:
            cur = cand
    if cur:
        cues.append(cur)
    # Hard-split any cue that still exceeds 2 lines.
    out: list[str] = []
    for c in cues:
        lines = wrap(c)
        for i in range(0, len(lines), MAX_LINES):
            out.append("\n".join(lines[i:i + MAX_LINES]))
    return out


def main() -> int:
    proj_path, tl_path, out_path = sys.argv[1:4]
    proj = json.load(open(proj_path, encoding="utf-8"))
    timeline = {t["id"]: t for t in json.load(open(tl_path, encoding="utf-8"))}

    cues: list[dict] = []
    start = 0.0
    for s in proj["scenes"]:
        v = s.get("voice")
        if v and v["id"] in timeline:
            t = timeline[v["id"]]
            vs, ve = start + v["atSec"], start + v["atSec"] + t["duration"]
            pieces = chunks(t["text"])
            weights = [max(1, len(p.replace("\n", " "))) for p in pieces]
            total = sum(weights)
            at = vs
            for p, w in zip(pieces, weights):
                d = max(MIN_DUR, min(MAX_DUR, (ve - vs) * w / total))
                end = min(ve, at + d)
                if end - at < 0.3:  # too short to show: merge into previous
                    cues[-1]["to"] = end
                    cues[-1]["text"] += " " + p.replace("\n", " ")
                else:
                    cues.append({"from": round(at, 3), "to": round(end, 3), "text": p})
                at = end
            cues[-1]["to"] = round(ve, 3)
        start += s["durationSec"]

    json.dump(cues, open(out_path, "w", encoding="utf-8"), indent=1, ensure_ascii=False)
    bad = [c for c in cues if c["to"] - c["from"] < 0.99 or c["to"] - c["from"] > 6.01
           or any(len(l) > MAX_LINE for l in c["text"].split("\n")) or len(c["text"].split("\n")) > MAX_LINES]
    print(f"{len(cues)} cues -> {out_path}" + (f" | {len(bad)} out of bounds" if bad else ""))
    for c in bad:
        print("  !", round(c["to"] - c["from"], 2), repr(c["text"][:60]))
    return 0


if __name__ == "__main__":
    sys.exit(main())
