# Workflow — Phase by Phase

The pipeline is linear with approval gates. Each phase ends with the human
saying yes before the next begins. Record approvals in
`projects/<name>/project.json`.

```
intake → script → voice → storyboard → design → build → render
   ▲        │        │         │           │
   └────────┴────────┴─────────┴───────────┘
        (edit loops live here — go back as needed)
```

---

## Phase 1 — Intake

**Ask (short, in this order):**
1. "What's the video about?" (the idea)
2. "What frame? Instagram Reel / YouTube (16:9) / YouTube Short / Square /
   custom ratio?"
3. "Roughly how long? (seconds)" — used as a target; the real duration comes
   from the audio.

**Then:**
```
node tools/video.mjs new <name> --preset reel --duration 30 [--style <style>]
```
Pick a short lowercase-dash name. If they already know the look, pass
`--style`; otherwise choose later.

---

## Phase 2 — Script

**Ask:** "Do you have a prewritten script, or should I write one?"

### If they have a script
Split it into **lines** — each line is one natural spoken sentence or phrase,
short enough to be one visual beat (roughly 3–12 words). Write
`projects/<name>/script.json`:

```json
{
  "voice": "af_heart",
  "speed": 1.0,
  "lines": [
    { "id": "L1", "text": "Every great product starts with a stubborn idea." },
    { "id": "L2", "text": "Ours started in a folder like this one." }
  ]
}
```

Rules for splitting: split where a breath would go; keep each line a complete
thought; stable ids (`L1`, `L2`, …) that you NEVER renumber later (audio files
and scenes key off them).

### If they don't
Generate 3–10 lines from the idea (see `docs/scripting.md` +
`skills/scriptwriting/`), show them the numbered lines, and iterate.

### Edit loops (this is the core of the experience)

| Human says | You do |
|---|---|
| "Line 3 is clunky, try X" | Edit line 3's text in `script.json`, run `video tts <name> --only L3 --play` |
| "Too slow / too fast" | `video tts <name> --speed 1.1` (or edit `speed` in script.json) |
| "Different voice" | `video tts <name> --voice am_michael --force --play` |
| "I hate all of it" | Clear `lines: []` in `script.json`, regenerate a fresh script from scratch |
| "Add a line at the end" | Append `L<n>` with next id, run `video tts <name>` (only the new line synthesizes) |

**Approval:** when the words are right → set `scriptApproved: true` in
`project.json`, move to voice.

---

## Phase 3 — Voice

```
node tools/video.mjs tts <name> --play
```
This synthesizes every line, concatenates `voiceover.wav`, copies audio into
the Remotion project, and regenerates `timeline.ts` — so audio and visuals can
never drift. The human listens.

- Per-line fixes: same `--only` loop as above.
- Whole-track re-approval: after ANY text change, the affected line re-renders
  automatically; play the full track again before approving.
- Voice catalog: `uv run --project voice-lab python voice-lab/tts.py voices`
  (54 voices; `af_*`/`am_*` = American, `bf_*`/`bm_*` = British).
  Detail in `docs/voice.md`.

**Approval:** `audioApproved: true`. Do not storyboard against audio you may
still change — timings would shift.

---

## Phase 4 — Storyboard

Read `docs/storyboarding.md`, then write `projects/<name>/storyboard.md` with
one section per audio line. Each section is a VERY detailed paragraph
(visuals, layout, on-screen text, motion, enter/exit, style references) —
detailed enough that a scene can be coded from it alone.

Present it; offer both edit paths:
- **Manual:** "Edit `storyboard.md` directly and tell me when you're done."
- **AI:** "Rewrite section L3", "make L2's animation calmer", "redo the whole
  storyboard with X feel."

**Approval:** `storyboardApproved: true`. Only now does design/build start.

---

## Phase 5 — Design

Discuss feel with questions like: mood (calm / punchy / premium / playful)?
How many fonts (1 display + 1 body is the sweet spot)? Color: one accent or a
full palette? Animation density (few slow moves vs. constant motion)? Grain,
gradients, borders?

**Two paths:**
- **Existing style:** `node tools/video.mjs style` lists them; read the
  style's README for the exact language (palette table, typography rules,
  motion vocabulary, example scenes). Apply:
  `node tools/video.mjs style <name> --set cinematic`.
- **New style:** create `video-design-types/<style>/` with `style.json`,
  `tokens.ts`, `README.md` — see `video-design-types/README.md` for the
  contract. Then apply it like any other style.

Record decisions in `design.md` (palette, fonts + how many, motion density,
transitions, references). **Approval:** `designApproved: true`.

---

## Phase 6 — Build scenes

Read `docs/remotion-guide.md`. For each storyboard section, create a component
in `video/src/scenes/` and register it in `scenes/index.ts`:

```tsx
// video/src/scenes/L1Hook.tsx
export const L1Hook: React.FC<SceneProps> = ({ line }) => { ... }
```
```ts
// scenes/index.ts
export const SCENES = { L1: L1Hook, L2: L2Stat, ... };
```

Preview continuously with `node tools/video.mjs dev <name>` — Studio runs on
the template's existing install, never reinstall. Unregistered lines fall back
to `DefaultScene`, so the video always plays while you build.

---

## Phase 7 — Render

Only when explicitly asked ("render it", "give me the MP4"):
```
node tools/video.mjs render <name>                  # final quality
node tools/video.mjs render <name> --quality preview  # half-scale, fast
```
Output: `projects/<name>/output/<name>.mp4`.

---

## Managing projects

- `video list` — all projects with phase/frame/audio/style.
- `video status <name>` — full state + what's next.
- Start a new project anytime: `video new <other>` — projects are independent
  folders; nothing global changes.
- `video delete <name>` — removes the whole project (asks for confirmation
  unless `--yes`).
- Resume a project: `video status <name>` shows exactly where the phase
  machine stands.
