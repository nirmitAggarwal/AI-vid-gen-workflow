# Scripting for Voiceover

Scripts are not essays — they are **sequences of spoken lines**, each line one
visual beat. The audio drives everything downstream (scene timing, storyboard
sections, animation pacing), so script quality decides video quality.

## File format — `projects/<name>/script.json`

```json
{
  "voice": "af_heart",
  "speed": 1.0,
  "lines": [
    { "id": "L1", "text": "Most teams start with a blank page." },
    { "id": "L2", "text": "We start with a plan." }
  ]
}
```

- `id` — stable forever: `"L1"`, `"L2"`, … Audio files, timeline entries and
  scenes all key off it. **Never renumber**; insert new lines with the next
  free id (append at the end or give an id like `L2b` when inserting).
- `text` — one sentence or phrase. Synthesized independently.
- `voice` / `speed` — defaults; `video tts --voice/--speed` overrides.

## Line splitting rules

1. **3–12 words per line.** Under 3 reads choppy; over ~15 words becomes two
   visual ideas glued together.
2. **Split at breath points** — after a complete clause, where you'd pause
   reading aloud.
3. **Each line = one visual beat.** Before writing a line, picture its scene.
   If you can't, the line is doing too much; split it.
4. **Punchlines stand alone.** Put the payoff in its own line — it gets its
   own scene, its own pause.
5. **Read it aloud.** If you stumble, rewrite. TTS will stumble too.

## Writing for Kokoro

Kokoro is good but literal — it doesn't improvise.

- Write numbers the way they should sound: `30%` fine, but "a third of their
  week" if you want it spoken that way. Spell out what matters:
  `"3 in 5"` vs `"three in five"`.
- Avoid unexplained acronyms; add articles: `"an API"` not `"API"` alone.
- Em-dashes and ellipses create unnatural jumps mid-line — end the line instead.
- Line-final punctuation matters: end every line with `.` `?` or `!` so the
  prosody closes properly.
- All-caps or unusual casing gets read oddly; normal sentence case.

## Pacing to duration

Roughly **2.5–3.5 seconds per line** at speed 1.0 (varies with length). To hit
a target duration:

- 15s reel ≈ 5–6 lines
- 30s reel ≈ 10–12 lines
- 60s ≈ 20–24 lines

Check reality after synthesis: `video tts` prints each line's duration and the
total. Trim lines (not words mid-sentence) to shorten; add lines to lengthen.
`speed` (0.8–1.3 sensible range) is a last-resort nudge, not a fix for too
much copy.

## Edit-loop etiquette

- Change text → `video tts <name> --only <ids>` (cached lines aren't redone).
- Changing any line's text changes total duration → `sync` runs automatically
  inside `tts`; the timeline re-flows. Storyboard sections referencing other
  lines don't need changes.
- Re-approve: after edits, `scriptApproved` reflects the last agreed words —
  flip it back to `false` while reworking, `true` when agreed again.

## When the human has no script

Generate one (skills: `skills/scriptwriting/`):

1. Ask: who's the audience, what's the one takeaway, tone (hype / calm /
   educational / funny), CTA if any.
2. Write a first draft as 5–10 lines using the rules above.
3. Show it numbered (`L1 …`), ask for changes by line.
4. Iterate until they approve → `scriptApproved: true`.

Keep the "trash it all" path visible: they can always say "start over with
X" — regenerate the whole `lines` array in one go, never patch line-by-line
into a script they've rejected wholesale.
