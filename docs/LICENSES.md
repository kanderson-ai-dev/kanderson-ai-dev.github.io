# Third-party licenses (video production)

| Asset / tool | Use | License | Source | Checked |
|---|---|---|---|---|
| Remotion 4.0.533 | Video composition | Remotion Free License: individuals and for-profit organizations of up to 3 employees may use it commercially | https://github.com/remotion-dev/remotion/blob/main/LICENSE.md | 2026-10-16 |
| Kokoro-82M (`kokoro` 0.9.4) | Local TTS voice-over | Apache-2.0 (weights and library) | https://huggingface.co/hexgrad/Kokoro-82M | 2026-10-16 |
| eSpeak NG 1.52.0 | Phonemizer for Kokoro (tooling only, not in output) | GPL-3.0 (tool; no code is distributed with the videos) | https://github.com/espeak-ng/espeak-ng | 2026-10-16 |
| FFmpeg 9.0.2 (Gyan full build) | Mix/export (tooling only) | GPL-3.0 build (tool; no code is distributed with the videos) | https://www.gyan.dev/ffmpeg/builds/ | 2026-10-16 |
| Playwright 1.56.1 | Screen capture (tooling only) | Apache-2.0 | https://github.com/microsoft/playwright | 2026-10-16 |
| Chakra Petch (via `@remotion/google-fonts`) | Titles | SIL Open Font License 1.1 | https://fonts.google.com/specimen/Chakra+Petch | 2026-10-16 |
| Chatterbox TTS (`chatterbox-tts` 0.1.7) | Local TTS voice-over ("bella-neutral" voice: model conditioned on synthetic Kokoro `af_bella` output — no real person's voice cloned) | MIT | https://github.com/resemble-ai/chatterbox | 2026-10-29 |
| faster-whisper 1.x (`small.en` model) | Word-level timing for captions/animation sync (tooling only) | MIT (library + model) | https://github.com/SYSTRAN/faster-whisper | 2026-10-29 |
| librosa 0.11 | Music BPM/section analysis (tooling only) | ISC | https://github.com/librosa/librosa | 2026-10-29 |

## Music and sound effects

Record one row per track/effect actually used in a published video: URL, title, author, license, download date.

| Title | Author | URL | License | Downloaded | Used in |
|---|---|---|---|---|---|
| Space City (space_city_bpm115.mp3, 115 BPM) | MintoDog | https://opengameart.org/content/space-city | CC0 1.0 (public domain) | 2026-10-16 | supply-chain-compliance-copilot-py (base series track), ecommerce-support-returns-copilot |
| Cyber March (cybermarch.mp3) | iamoneabe | https://opengameart.org/content/cyber-march | CC0 1.0 (public domain) | 2026-10-29 | ecommerce-support-returns-copilot upgrade promo |
| Trace Agent (trace_agent.mp3, 117 BPM) | vitalezzz | https://opengameart.org/content/trace-agent | CC0 1.0 (public domain) | 2026-10-30 | langgraph-multiagent-orchestrator flagship promo |
| Singularity (singularity_calm.mp3 + singularity_action.wav, calm/action pair used as layer stems) | vitalezzz | https://opengameart.org/content/singularity-0 | CC0 1.0 (public domain) | 2026-10-31 | mcp-agent-toolkit-py flagship promo; mcp-agent-toolkit-py v3 upgrade promo (final master) |
| Knight Templar (knight_templar.mp3, 120 BPM loopable) | iamoneabe | https://opengameart.org/content/knight-templar-0 | CC0 1.0 (public domain) | 2026-11-02 | downloaded for mcp-agent-toolkit-py v3 promo — replaced by Singularity in the final cut, not shipped |
| UI click, whoosh, hit, glitch, riser, impact, stinger | Own synthesis (`video-studio/scripts/sfx.py`) | n/a | Original work, no third-party material | 2026-10-16 | all videos |
| Cinematic SFX set (transition-braam/impact-hit/whoosh/riser/glitch, magic-scifi-hologram/shield/teleport, impact-metal-hit, glass-shatter, door-lock, mechanical-servo, ui-chime/tick/beep/send, feedback-confirm/error, office-keyboard, fire-electric-zap) | SFXMint (sfxmint.com) | https://sfxmint.com | CC0 1.0 (public domain) | 2026-10-30 | ecommerce-support-returns-copilot upgrade promo; langgraph-multiagent-orchestrator flagship promo |
| Sci-Fi Sounds (spaceEngineLow — machine-hum ambience bed only) | Kenney | https://opengameart.org/content/sci-fi-sounds | CC0 1.0 (public domain) | 2026-11-01 | ecommerce-support-returns-copilot upgrade promo |
| Hunter-class Lifeform (hunter_class_lifeform.mp3, ~129 BPM) | vitalezzz | https://opengameart.org/content/hunter-class-lifeform | CC0 1.0 (public domain) | 2026-11-03 | langgraph-multiagent-orchestrator upgrade promo |
| Generic Trailer Music (generic_trailer.mp3, ~152 BPM) | Emma_MA | https://opengameart.org/content/generic-trailer-music | CC0 1.0 (public domain) | 2026-11-03 | langgraph-multiagent-orchestrator upgrade promo — rejected (192 kbps source artifacts), not shipped |
| Net Infiltration (net_infiltration.mp3, ~99 BPM) | vitalezzz | https://opengameart.org/content/net-infiltration | CC0 1.0 (public domain) | 2026-11-06 | agentic-rag-system promo (pending final cut) |
| Project Mass(Cinematic) (project_mass.wav, ~136 BPM) | Umplix | https://opengameart.org/content/project-masscinematic | CC0 1.0 (public domain) | 2026-11-07 | agentic-api flagship promo |
