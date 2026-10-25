# AI Motion Design Studio — Agent Playbook

This folder is a one-place studio for generating motion design videos with AI.
You (the AI agent) run the whole pipeline here: idea → script → voiceover →
storyboard → design → Remotion scenes → rendered MP4. The human only makes
decisions; you do the work with the tools below. **Never ask the human to
explain setup, install things, or write code.**

## Golden rules

1. **Never reinstall.** The Remotion template at `templates/remotion-vertical`
   has `node_modules` and agent skills already installed. Projects link to that
   `node_modules` automatically. Do not run `npm install` in a project unless
   `video new` tells you it fell back to installing.
2. **Never write plumbing code.** Every repetitive operation has a command
   (below). If you catch yourself writing boilerplate (timeline math, audio
   concatenation, project scaffolding, theme copying) — use the CLI instead.
3. **Nothing ships without approval.** Script, audio, storyboard, and design
   each get explicit human approval before moving to the next phase. Record
   approvals in `projects/<name>/project.json` (`scriptApproved`,
   `audioApproved`, `storyboardApproved`, `designApproved`).
4. **One phase at a time.** Don't storyboard before audio is approved. Don't
   build scenes before the storyboard is approved. Timing comes from audio, so
   audio before visuals, always.
5. **Keep the human in the loop with playback, not descriptions.** When audio
   or a preview is ready, play it (`video play`, `video dev`) and wait for a
   verdict. Never ask "does that sound right?" without letting them hear it.

## The one command

```
node tools/video.mjs <command>          # from the repo root
```

| Command | Purpose |
|---|---|
| `doctor` | Verify environment (node, ffmpeg, uv, kokoro models, template) |
| `new <name> --preset reel\|youtube\|youtube-short\|square\|custom [--duration <sec>] [--style <style>]` | Scaffold a project |
| `list` / `status <name>` | See projects and their phase |
| `tts <name> [--only L2,L5] [--voice <id>] [--speed <x>] [--play]` | Synthesize voiceover from `script.json` |
| `play <name> [--line L2]` | Play the full voiceover or one line |
| `sync <name>` | Regenerate `timeline.ts` from audio (also runs after `tts`) |
| `style` / `style <name> --set <style>` | List/apply design styles |
| `dev <name>` | Start Remotion Studio (live preview) |
| `render <name> [--quality preview\|final]` | Render MP4 to `projects/<name>/output/` |
| `delete <name>` | Delete a project |

## The workflow

Follow `docs/workflow.md` in order. Summary:

1. **Intake** — Ask: what's the idea? Which frame (`reel` 1080×1920,
   `youtube` 1920×1080, `youtube-short`, `square`, or custom)? Rough duration?
   Then `video new <name> --preset <frame> --duration <sec>`.
2. **Script** — Ask if they have a prewritten script.
   - *Have one:* split it into short spoken **lines** (one sentence or phrase
     each) into `projects/<name>/script.json` (`lines: [{id: "L1", text: "..."}]`).
   - *Don't:* generate one from the idea, present it, iterate.
   Loops: edit a line → `video tts <name> --only L1` re-synthesizes just that
   line. Hate all of it → delete `script.json` lines and regenerate.
   Mark `scriptApproved` when the human is happy with the words.
3. **Voice** — `video tts <name> --play`. Let them hear it. If a line is off,
   edit its text and `--only` regen; if the voice itself is wrong, try another
   Kokoro voice (`uv run --project voice-lab python voice-lab/tts.py voices`).
   Mark `audioApproved` only when they confirm the whole track.
4. **Storyboard** — Write `projects/<name>/storyboard.md`: one section per
   audio line, VERY detailed (visuals, layout, motion, text on screen, which
   frames). Human can edit manually or ask you to rewrite parts/whole. Mark
   `storyboardApproved` when confirmed.
5. **Design** — Discuss feel: mood, colors, how many fonts, animation density,
   transitions. Either map to an existing style
   (`node tools/video.mjs style` lists them; each style folder has a README
   with the full design language) or create a new style in
   `video-design-types/` (see `video-design-types/README.md`). Apply with
   `video style <name> --set <style>`. Mark `designApproved`.
6. **Build** — Create one scene component per storyboard section in
   `projects/<name>/video/src/scenes/`, register them in `scenes/index.ts`
   keyed by line id (`L1`, `L2`, …). Read `docs/remotion-guide.md` first.
   Preview with `video dev <name>`.
7. **Render** — Only when explicitly asked. `video render <name>`.

## Project anatomy

```
projects/<name>/
  project.json      # phase, frame, fps, style, voice, approvals — edit to record progress
  script.json       # {voice, speed, lines: [{id, text}]} — the source of truth for TTS
  audio/            # per-line wavs + manifest.json + voiceover.wav (generated)
  storyboard.md     # approved visual plan, one section per line (you write, human edits)
  design.md         # design discussion outcome (mood, palette, fonts, motion)
  video/            # Remotion project (scaffolded from template)
    src/data/timeline.ts   # AUTO-GENERATED by `video sync` — never hand-edit
    src/data/theme.ts      # design tokens, written by `video style --set`
    src/scenes/            # you build these; registry in index.ts
    public/audio/          # audio copies for Remotion (generated)
  output/           # rendered MP4s
```

## Reference docs

- `docs/workflow.md` — phase-by-phase instructions, questions to ask, loops
- `docs/scripting.md` — writing TTS-friendly scripts (line splitting, pacing)
- `docs/storyboarding.md` — storyboard format with a worked example
- `docs/remotion-guide.md` — building scenes, THEME tokens, motion helpers
- `docs/voice.md` — Kokoro voices, speed, troubleshooting
- Skills (load when relevant): `skills/scriptwriting/`, `skills/voiceover/`,
  `skills/motion-design/`, `skills/rendering/`, `skills/research/`
- Vendored Remotion skills: `templates/remotion-vertical/.agents/skills/`
- premade asssets: `assets folder`