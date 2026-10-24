# Cinematic

Film-title energy. The viewer should feel like the opening of a prestige
documentary. Slow, deliberate, confident. Pauses in the audio are space for
the visuals to breathe.

## Palette

| Token | Value | Use |
|---|---|---|
| background | `#0A0A0F` | Near-black with a blue undertone |
| surface | `#14141C` | Panels, cards |
| surfaceAlt | `#1E1E28` | Secondary fills |
| text | `#F4F1EA` | Warm off-white — projected-light feel, not sterile #FFF |
| textSecondary | `#9A968C` | Muted captions |
| accent | `#C9A227` | Antique gold. Key words, rules, highlights. |

Rules:
- Use `treatment.gradient` as the scene background, never flat black.
- Gold is a spice: thin rules, single words, small marks. Never a gold background.
- Add subtle grain overlay (`treatment.grain`) for texture.

## Typography

- Display: serif (Georgia), weight 400, large — 88–140px for hero lines.
- Body/captions: light sans (300), small — 26–34px.
- Wide letter-spacing on tiny labels (0.3em, uppercase, 16–20px).
- Mix serif display + sans caption in the same scene is the signature pairing.

## Motion

- Everything is SLOW: enters take 45 frames, exits 30.
- Text reveals: word-by-word opacity fade with a 4–8 frame stagger, slight upward drift (12px max).
- Images/backgrounds: slow parallax push-in (scale 1.0 → 1.06 over the scene).
- Transitions: long dissolves through black (20–30 frames). Never hard cuts, never slides.

## Scene composition

- Center-aligned hero text on the lower third or dead center.
- Thin gold rule (1px × 80px) above a heading is a recurring motif.
- Letterbox feel: keep key content inside the middle 80% vertically.
- Let a scene hold on empty background for 10–20 frames before/after text — silence is part of the score.

## Example scene shape

```
[AUDIO LINE]: "In 2019, nobody saw it coming."
→ Gradient + grain. 10 frames of empty dark. Gold rule fades in.
  "In 2019" fades in word-by-word (serif, 120px, centered).
  Hold 15 frames. "nobody saw it coming" fades in below, sans, muted.
  Long dissolve to next scene.
```
