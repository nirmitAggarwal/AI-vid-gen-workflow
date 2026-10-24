# Voice — Kokoro TTS

Voiceover runs locally through Kokoro (ONNX) in `voice-lab/`. No API keys, no
network, no installs — models are already in `voice-lab/models/` and the
environment is `voice-lab/.venv` managed by `uv`.

## Everyday commands

```bash
node tools/video.mjs tts <name>                  # full track (incremental)
node tools/video.mjs tts <name> --only L3,L4     # regen just these lines
node tools/video.mjs tts <name> --force          # regenerate everything
node tools/video.mjs tts <name> --voice bm_george --speed 1.1 --play
node tools/video.mjs play <name>                 # full track
node tools/video.mjs play <name> --line L3       # single line
```

Under the hood (only if you need the raw tool):

```bash
uv run --project voice-lab python voice-lab/tts.py voices
uv run --project voice-lab python voice-lab/tts.py batch --script <file> --outdir <dir> [--only L2]
uv run --project voice-lab python voice-lab/tts.py concat --outdir <dir> --out <file>
uv run --project voice-lab python voice-lab/tts.py line --text "..." --out one.wav
```

## Voices (54)

Naming: prefix letter = gender (`a` female, `b` male), second = accent
(`f`/`m` same as first is conventional; `f` = female, `m` = male), suffix =
region (`us`, `gb`). Examples:

| Voice | Feel |
|---|---|
| `af_heart` | Warm, friendly — default |
| `af_bella` | Bright, expressive |
| `af_nicole` | Soft, breathy |
| `am_michael` | Confident male, good for narration |
| `bm_george` | British male, documentary |
| `bf_isabella` | British female, polished |

Full list: `node tools/video.mjs` → `uv run --project voice-lab python voice-lab/tts.py voices`.
Trial a candidate on one line before switching the whole track:
`--voice <id> --only L1 --play`, then `--force` once they like it.

## Speed

`--speed` (or `speed` in `script.json`), sensible range **0.8–1.3**. Use it to
fine-tune pacing, not to cram extra copy — cut words instead.

## What the pipeline produces

`video tts <name>` →
- `projects/<name>/audio/L*.wav` — per-line files (the edit unit)
- `projects/<name>/audio/manifest.json` — per-line `duration` + `start`
  (computed with a 0.25s gap between lines)
- `projects/<name>/audio/voiceover.wav` — concatenated track
- copies into `video/public/audio/` + regenerated `timeline.ts` (sync)

**Caching:** each line is hashed by `voice|speed|text`. Unchanged lines are
never re-synthesized — that's why `--only` and plain re-runs are fast after
the first pass (first pass: ~0.5–1s per line).

## Troubleshooting

- *"uv: command not found"* → install uv (docs: docs.astral.sh/uv), then
  re-run `node tools/video.mjs doctor`.
- *Models missing* → `voice-lab/models/` must contain
  `kokoro-v1.0.int8.onnx` + `voices-v1.0.bin` (already present in this setup).
- *No player* → `video play` tries ffplay, paplay, aplay, mpv, afplay; install
  any one (ffmpeg covers ffplay).
- *Garbled pronunciation* → rewrite the word phonetically in the line text
  (see `docs/scripting.md`).
- *Total duration off target* → change the number of lines / trim copy;
  durations are printed by every `tts` run.
