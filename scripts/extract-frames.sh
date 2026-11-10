#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p _raw/_frames
ORCH="_video/langgraph-multiagent-orchestrator/upgrade/final/orchestrator-4k-final.mp4"
MCP="_video/mcp-agent-toolkit-py/upgrade/out/promo-master-2160p60.mp4"
RAG="_video/agentic-rag-system/film/out/promo-master-2160p60.mp4"
API="_video/agentic-api/flagship/out/agentic-api-promo-2160p60.mp4"

fr() { ffmpeg -y -v error -ss "$2" -i "$1" -frames:v 1 "_raw/_frames/$3" & }

# Orchestrator (4K)
fr "$ORCH" 18.5 o-title.png
fr "$ORCH" 9.0 o-hook.png
fr "$ORCH" 41 o-f1.png
fr "$ORCH" 50 o-f2.png
fr "$ORCH" 58 o-f3.png
fr "$ORCH" 66 o-f4.png
fr "$ORCH" 74 o-f5.png
fr "$ORCH" 93 o-f6.png
fr "$ORCH" 82 o-g1.png
fr "$ORCH" 100 o-g2.png
fr "$ORCH" 25.5 o-g3.png
fr "$ORCH" 31 o-loop.png

# MCP (4K master — out/ is the published cut)
fr "$MCP" 17 m-hero.png
fr "$MCP" 9 m-hook.png
fr "$MCP" 33 m-f1.png
fr "$MCP" 49 m-f2.png
fr "$MCP" 73 m-f3.png
fr "$MCP" 74 m-f4.png
fr "$MCP" 89 m-f5.png
fr "$MCP" 97 m-f6.png

# RAG (4K)
fr "$RAG" 11 r-hook.png
fr "$RAG" 41 r-hero.png
fr "$RAG" 31 r-poster.png
fr "$RAG" 42 r-f1.png
fr "$RAG" 51 r-f2.png
fr "$RAG" 61 r-f3.png
fr "$RAG" 81 r-f4.png
fr "$RAG" 71 r-f5.png
fr "$RAG" 101 r-f6.png

# API (2160p)
fr "$API" 9 a-hook.png
fr "$API" 18 a-title.png
fr "$API" 33 a-f1.png
fr "$API" 57 a-f2.png
fr "$API" 73 a-f3.png
fr "$API" 49 a-f4.png
fr "$API" 81 a-f5.png
fr "$API" 41 a-f6.png

wait
ls _raw/_frames | wc -l
