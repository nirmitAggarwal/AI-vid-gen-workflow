# Minimal Tech

Clean, restrained, Apple-keynote energy. The viewer should feel calm confidence.
Whitespace is a feature — if a scene feels empty, it is probably right.

## Palette

| Token | Value | Use |
|---|---|---|
| background | `#F7F7F5` | Warm off-white full-bleed background |
| surface | `#FFFFFF` | Cards, chips, elevated blocks |
| surfaceAlt | `#EDEDEA` | Secondary blocks, dividers, fills |
| text | `#111111` | Headings, primary copy |
| textSecondary | `#6B6B66` | Subtitles, captions, labels |
| accent | `#0071E3` | ONE accent. Highlight words, progress, key numbers. Never flood with it. |

Rules:
- Never use more than one accent color per scene.
- No gradients, no glows, no grain.
- Background is always `background`; don't invent per-scene colors.

## Typography

- Headings: heading font, weight 700, letter-spacing -0.02em, line-height 1.08.
- Body: body font, weight 400, line-height 1.5, color `textSecondary`.
- Maximum 2 type sizes per scene (one heading, one body). Mono only for numbers/code.
- Sentence case, never ALL CAPS except tiny labels (≤14px letter-spaced).

## Motion

- Everything eases in with `motion.easing` over `motion.durations.enter` frames.
- Stagger siblings by `motion.stagger` frames — never animate two things at once.
- Transitions between scenes: fade through background color. No slides, no zooms.
- Numbers count up; words fade up 12–16px. That's the whole vocabulary.

## Scene composition

- One idea per scene. If the audio line says two things, consider two scenes.
- Keep ≥40% of the frame empty.
- Text sits on the `layout.align` edge with `layout.safeMargin` margin, vertically centered or on the lower third.
- Cards use `treatment.shadow`, `treatment.radius`, and `surface` background.

## Example scene shape

```
[AUDIO LINE]: "Teams waste 30% of their week on status meetings."
→ Full-bleed background. Upper-left: small accent label "THE PROBLEM".
  Center: huge "30%" counting up in accent, then "of the week, gone" in text.
  Nothing else. Hold. Fade out.
```
