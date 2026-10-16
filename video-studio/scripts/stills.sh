#!/usr/bin/env bash
# Usage: scripts/stills.sh <slug> <outdir> <prefix> <sec...>  (renders half-scale review stills from the project JSON)
slug=$1; out=$2; pre=$3; shift 3
mkdir -p "$out"
for t in "$@"; do npx remotion still src/index.ts ProjectPromo "$out/$pre$t.png" --props=projects/$slug.json --frame=$((t*30)) --scale=0.5 >/dev/null 2>&1; done
