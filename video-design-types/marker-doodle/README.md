# Marker Doodle

A notebook margin come to life: warm paper, thick black marker lines, a
highlighter that argues with the sentence, and a red pen that grades it.
Funny, human, deliberately imperfect — every line looks drawn by a person in a
hurry, then animated with perfect comic timing.

## Palette

| Token | Value | Use |
|---|---|---|
| background | `#F7F1E3` | Warm paper — never pure white |
| surface | `#FFFDF6` | Cards, letters, screens |
| surfaceAlt | `#EDE3CB` | Aged paper, shadow blocks, stacks |
| text | `#141414` | Marker ink |
| textSecondary | `#6F675A` | Pencil labels, captions |
| accent | `#FFD400` | Highlighter — behind ONE keyword per scene |
| accentAlt | `#FF4B3E` | Red pen — stamps, cross-outs, corrections |
| accentBlue | `#2050FF` | Ballpoint — browser/UI chrome only |
| line | `rgba(20,20,20,0.18)` | Ruled lines, connection lines |

Rules:
- Paper is the stage. Never fill the whole frame with a dark color; let the
  paper breathe and use ink density for contrast.
- Yellow is a highlighter, not a fill: it goes BEHIND text, wipes on after the
  word lands, and overlaps the letters slightly.
- Red is the punchline pen: one dramatic stamp or cross-out per scene, max.
- Blue only for "technology" surfaces (browser, chat, job portal).

## Typography

- Display: Impact / Arial Black, uppercase, 900 — hero words at 120–220px,
  stacked with line-height 0.94 so lines nearly collide.
- Body: Helvetica 700, 34–44px, sentence case.
- Mono: SF Mono / Consolas for UI text, counters, timestamps, form fields.
- Rotate display type −2° to +2° occasionally; let it feel pasted on.
- Keywords get the highlighter block; punchlines get the red pen.

## Illustration

- Thick black outlines (`stroke` 7, `strokeBold` 11) with round caps and joins.
- Every path is slightly off — hand-drawn, never ruler-straight. Add gentle
  kinks to long lines.
- Fill with paper tones only, plus flat yellow/red/blue accents. No gradients.
- Character "Rohan": swoopy side-parted hair, round glasses, hoodie, permanent
  under-eye bags. Drawn with 12–20 paths — a doodle, not a portrait.
- Recurring props: sticky notes, browser tabs, stamped envelopes, roadmaps,
  red rejection letters, a battered syllabus book.

## Motion

- **Draw-on**: paths reveal with `strokeDashoffset` over 10–14 frames, hand
  speed, staggered by 2–3 frames. This is the signature move.
- **Highlighter wipe**: block scales X 0→1 in 6–8 frames, slightly overshooting
  the word, landing after the word.
- **Stamp**: scale 1.8→1 in 5 frames with 2–3px shake, plus a 3-frame paper
  jolt; the whole frame can nudge 4px on impact.
- **Paste**: sticky notes spring in from off-frame with 4–7° rotation.
- **Cross-out**: two quick strokes, 5 frames each, drawn after the word is read.
- Exits are hard cuts or a 6-frame vertical slam. Never a soft fade to black.

## Scene composition (1920×1080)

- Two-zone layout: type column (120–900px) and illustration zone
  (960–1820px); flip sides every 2–3 scenes to keep rhythm.
- One idea per scene, one keyword per sentence. If two jokes compete, split.
- Keep the paper edge visible: drawings can bleed off-frame, type cannot.
- Number/label every scene like a notebook page: mono caption top-left
  (`SUBJECT 001`, `FIG. 04`) — it sells the scrapbook feel and hides cuts.

## Example scene shape

```
[AUDIO]: "Entry level. Five years of experience required."
→ Job card pastes in (spring, −3°): "ENTRY LEVEL" in mono, big.
  Under it, "5+ YEARS EXPERIENCE" SLAMS in as a red stamp, shaking the card.
  A tiny door labeled "ENTRY" is drawn too small for the stick figure.
  Hold. Red circle scribbles around "5+ YEARS".
```
