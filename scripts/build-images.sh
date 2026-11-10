#!/usr/bin/env bash
# Rebuilds the film-derived public/ image assets from the clean Remotion stills
# in _raw/<slug>/stills/ (rendered by scripts/render-stills.mjs: no burned
# subtitles, no corner brackets, full composition).
#
# Slots: card-800.webp (800x500), hero-1600.webp (1600x1000), og.png
# (1200x630), video-poster-1920.webp (1920x1080), hook-1920.webp (1920x1080),
# feature-N-1600.webp (1600x900).
#
# Stills are scaled straight to 16:9 slots, or padded to taller slots with a
# stage backdrop (blurred extension of the still + the films' 64 px grid).
# Content is never cropped.
set -euo pipefail
cd "$(dirname "$0")/.."
Q=82
BG=0x050709

# fit SRC DST W H — scale a still straight to a 16:9 slot (no crop)
fit() { ffmpeg -y -v error -i "$1" -vf "scale=$3:$4" -q:v $Q "public/projects/$2"; }

# pad SRC DST W H — still on a stage backdrop, centred, no crop.
# The backdrop is the still itself stretched+blurred (keeps the stage's
# vignette tones) with the turquoise grid drawn back on top.
pad() {
  local gw=$(( $3 / 30 ))
  ffmpeg -y -v error -i "$1" -filter_complex \
    "[0:v]scale=$3:$4,gblur=sigma=30,drawgrid=w=$gw:h=$gw:t=1:c=0x00f5d4@0.05[bg];[0:v]scale=w=$3:h=$4:force_original_aspect_ratio=decrease[s];[bg][s]overlay=(W-w)/2:(H-h)/2" \
    -frames:v 1 -q:v $Q "public/projects/$2"
}

O=langgraph-multiagent-orchestrator
OS=_raw/$O/stills
pad "$OS/thumb.png"      $O/card-800.webp          800  500
pad "$OS/thumb.png"      $O/hero-1600.webp        1600 1000
pad "$OS/thumb.png"      $O/og.png                1200  630
fit "$OS/thumb.png"      $O/video-poster-1920.webp 1920 1080
fit "$OS/hook.png"       $O/hook-1920.webp        1920 1080
fit "$OS/feature-1.png"  $O/feature-1-1600.webp   1600  900
fit "$OS/feature-2.png"  $O/feature-2-1600.webp   1600  900
fit "$OS/feature-5.png"  $O/feature-5-1600.webp   1600  900

M=mcp-agent-toolkit-py
MS=_raw/$M/stills
pad "$MS/title.png"      $M/card-800.webp          800  500
pad "$MS/title.png"      $M/hero-1600.webp        1600 1000
pad "$MS/title.png"      $M/og.png                1200  630
fit "$MS/thumb.png"      $M/video-poster-1920.webp 1920 1080
fit "$MS/hook.png"       $M/hook-1920.webp        1920 1080
fit "$MS/feature-5.png"  $M/feature-5-1600.webp   1600  900

R=agentic-rag-system
RS=_raw/$R/stills
pad "$RS/thumb.png"      $R/card-800.webp          800  500
pad "$RS/thumb.png"      $R/hero-1600.webp        1600 1000
pad "$RS/thumb.png"      $R/og.png                1200  630
fit "$RS/thumb.png"      $R/video-poster-1920.webp 1920 1080
fit "$RS/hook.png"       $R/hook-1920.webp        1920 1080
fit "$RS/feature-2.png"  $R/feature-2-1600.webp   1600  900
# f1 interim: real landing capture padded to 16:9 (feature-browser in a later pass)
pad video-studio/public/rag/landing-answer.png $R/feature-1-1600.webp 1600 900

A=agentic-api
AS=_raw/$A/stills
pad "$AS/title.png"      $A/card-800.webp          800  500
pad "$AS/title.png"      $A/hero-1600.webp        1600 1000
pad "$AS/title.png"      $A/og.png                1200  630
fit "$AS/thumb.png"      $A/video-poster-1920.webp 1920 1080
fit "$AS/hook.png"       $A/hook-1920.webp        1920 1080
# API feature stills intentionally absent: its features are rebuilt from real
# keyless-run captures, not film frames.

echo "done"
