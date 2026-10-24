---
name: scriptwriting
description: Write and edit voiceover scripts for motion-design videos — line splitting, TTS-friendly prose, hook/payoff structure, revision loops.
---

# Scriptwriting for Motion Design

Scripts here are sequences of **spoken lines** — each line is one scene beat.
The full rules live in **`docs/scripting.md`** — read it before writing.
This skill is the quick reference.

## Contract

Output format is `projects/<name>/script.json`:

```json
{ "voice": "af_heart", "speed": 1.0,
  "lines": [ { "id": "L1", "text": "..." } ] }
```

## Core rules

1. 3–12 words per line; one breath, one idea, one scene.
2. Stable ids `L1, L2, …` — never renumber; insert as `L2b` or append.
3. End every line with `.` `?` or `!`.
4. Normal sentence case; write numbers as they should sound.
5. Read aloud before proposing; if you stumble, rewrite.

## Structure for a full video

- **Hook (L1–L2):** pattern interrupt or bold claim in the first line.
- **Body:** one idea per line, escalating or alternating problem → solution.
- **Payoff:** the key line stands alone with a pause before/after.
- **CTA (optional):** final line, short.

## Revision loops (human-in-the-loop)

- Line-level fix → edit that line only, `video tts <name> --only L<n> --play`.
- Wholesale rejection → clear all lines, regenerate from the idea fresh.
- Never patch a rejected script line-by-line; offer a clean rewrite.
- Present lines numbered; ask "which lines?" not "any changes?".

## Duration budgeting

~3s per line at 1.0 speed: 15s ≈ 5–6 lines, 30s ≈ 10–12, 60s ≈ 20–24.

## Before you call it done

- [ ] Every line passes the "one scene" test
- [ ] First line would make someone keep watching
- [ ] Pacing hits the target duration (check `tts` output)
- [ ] `project.json` → `scriptApproved` set only after human confirms
