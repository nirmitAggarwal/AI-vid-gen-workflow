# AI Motion Design Studio

One folder where you create motion design videos with AI — no repeated setup,
no skill reinstalling, no plumbing. You bring an idea; the AI agent drives the
pipeline; you approve each stage by watching and listening.

```
idea → script → voiceover → storyboard → design → Remotion scenes → MP4
```

## Quick start

Open this folder in your agent (Freebuff, opencode, Cursor, …) and say:

> "I want to make a video about ___ — Instagram Reel, about 30 seconds."

The agent takes it from there: it asks for what it needs, scaffolds the
project in seconds (reusing the pre-installed template), and walks you through
each approval gate. Everything it needs to know is already written down in
**`AGENTS.md`** and **`docs/`** — you never have to explain the process.

Manual control, if you prefer it:

```bash
node tools/video.mjs doctor        # check the environment
node tools/video.mjs new my-idea --preset reel --duration 30
node tools/video.mjs list          # all projects + phase
node tools/video.mjs play my-idea  # hear the voiceover
node tools/video.mjs dev my-idea   # open Remotion Studio preview
node tools/video.mjs render my-idea
node tools/video.mjs delete my-idea
```

## What's inside

| Path | What it is |
|---|---|
| `AGENTS.md` | The agent's playbook — workflow, rules, commands |
| `docs/` | Phase guides: workflow, scripting, storyboarding, remotion, voice |
| `skills/` | Agent skills: scriptwriting, voiceover, motion-design, rendering, research |
| `tools/video.mjs` | One CLI for the whole project lifecycle |
| `templates/remotion-vertical/` | Pre-installed Remotion template + vendored Remotion skills (never reinstalled) |
| `voice-lab/` | Local Kokoro TTS (models included, works offline) |
| `video-design-types/` | Reusable design styles — palette, fonts, motion, mood; add new ones with AI |
| `projects/` | Your videos (script, audio, storyboard, scenes, renders) |

## The approval gates

Nothing ships without you saying yes: **script** (the words) → **audio**
(play it back) → **storyboard** (scene by scene) → **design** (the look) →
build → render. At every gate you can edit manually, ask for targeted rewrites,
or trash the stage and start it over — the tools only regenerate what changed.

## Design styles

`node tools/video.mjs style` lists them. Each folder in
`video-design-types/` carries a full design language (palette, typography,
motion vocabulary, worked examples) that the AI applies to any project with:

```bash
node tools/video.mjs style my-idea --set cinematic
```

Create your own styles on the fly — see `video-design-types/README.md`.
