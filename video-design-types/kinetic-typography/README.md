# Kinetic Typography

Words ARE the visuals. Every audio line is performed by type — punched in,
slammed, sliced, scaled. The viewer reads along without trying to. High
contrast, high energy, zero quiet moments.

## Palette

| Token | Value | Use |
|---|---|---|
| background | `#0D0D0D` | Near-black stage |
| surface | `#171717` / `#232323` | Occasional blocks behind words |
| text | `#FFFFFF` | Default word color |
| accent | `#FFE600` | Hi-vis yellow — the keyword color |
| accentAlt | `#FF3B30` | Red — reserve for a SINGLE word per scene max |

Rules:
- One keyword per line gets the accent. Flip its background block too (yellow bg, black text).
- Background can flash to accent for 4–8 frames on impact moments (beats, punchlines).

## Typography

- Display: Impact/Arial Black, weight 900, HUGE — words should nearly touch the frame edges.
- Line-height 0.95: stacked lines nearly collide. That's the look.
- No thin weights anywhere. Captions are bold sans at 28–36px.
- Text can be rotated ±2°, scaled non-uniformly, or clipped for emphasis — but keep it readable.

## Motion

- Words arrive on the beat: 8–12 frame entrances, spring with overshoot (`motion.spring`).
- Stagger word-by-word at 2 frames — a sentence should cascade like a drum fill.
- Exits are fast cuts or vertical slams (translateY off-frame), never fades.
- Background number/word watermarks can scroll or pulse continuously.
- Emphasis moves: scale punch (1.0 → 1.12 → 1.0 in 8 frames), color flip, block reveal.

## Scene composition

- Text-first: if a scene has no type on screen, it's wrong.
- Layer hierarchy: giant background word (8% opacity) + foreground spoken words + optional accent block.
- Sync to the audio: each emphasis lands when the narrator stresses it. Read the line aloud, find the stressed word, that's your accent moment.
- Keep every frame busy — even holds get a slow drift or pulse.

## Example scene shape

```
[AUDIO LINE]: "Nobody reads the terms. Nobody."
→ "Nobody" SLAMS in (yellow block, black text), scale-punch on landing.
  "reads the" types on white, 2-frame stagger.
  "terms." stamps in + red underline swipe.
  Cut. "Nobody." re-enters bigger, red, fills the frame. Hold with pulse.
```
