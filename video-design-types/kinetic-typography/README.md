# Kinetic Typography

Words ARE the visuals. Every audio line is performed by type — punched in,
slammed, sliced, scaled. Three registers share one system:

| Mode | Feel | When |
|---|---|---|
| `minimal` | Quiet type composition, huge negative space, one accent word | Quotes, definitions, slow beats |
| `editorial` | Bold stacked headlines, split panels, outlined ghost words | Explanations, lists, comparisons |
| `energetic` | Slam-ins, scale punches, marquees, flash frames | Hooks, punchlines, calls to action |

## Palette

| Token | Value | Use |
|---|---|---|
| background | `#111111` | Near-black stage |
| surface / surfaceAlt | `#1A1A1A` / `#242424` | Blocks behind words, split panels |
| text | `#FFFFFF` | Default word colour |
| accent (cobalt) | `#2457FF` | Default keyword colour + accent blocks |
| cyan | `#56D7FF` | Second accent — data points, underlines |
| orange | `#FF7438` | Warning / contrast accent |
| yellow | `#F8E34A` | Highlight-flash accent |
| magenta | `#F45AA6` | Rare emphasis accent |
| grey | `#A6A6A6` | Supporting text, ghost words |

Rules:
- One or two accents per scene, never all of them. Cobalt is the default;
  the others are seasoning.
- Keyword flip: white word → accent colour, optionally on an accent block
  with black text (`#111111`) for maximum punch.
- Flash frames: background may flip to an accent for 4–8 frames on impact.

## Typography

- Display: **Barge Black** (900) — the workhorse. Stack it at 0.92 line-height
  so lines nearly collide.
- **Titan One** for round, poster-weight statements; **Milker** for condensed
  expressive bursts; **Newake** for wide accent/caption lettering.
- **Designer** is the quiet supporting sans — captions, kickers, footnotes.
- Outlined ghost words: `-webkit-text-stroke` in white at 5px over transparent
  fill (see `THEME.type.outlineStroke`).
- Auto-fit: `fitSize()` clamps words between `type.hugeMin` and
  `type.hugeMax` so a word nearly touches the frame edges without clipping.

## Motion

- Entrances are snappy with an out-ease (`THEME.motion.easing`), 9 frames, and
  a punchy spring overshoot for word landings.
- Word cascade at 2-frame stagger; characters at 1-frame (`charStagger`).
- Scale punch on landing: 1 → 1.12 → 1 over `punchFrames`.
- Letter-spacing settle (`trackingDuration`) — words breathe in from wide
  tracking to tight.
- Exits are cuts and slams, never fades. Holds keep a slow watermark drift
  (`watermarkDrift`) or marquee so no frame is ever static.

## Scene composition

- Layer hierarchy: watermark ghost word (7% opacity) → headline stack →
  keyword accents → supporting caption.
- Sync to audio: read the line aloud, find the stressed word, that's the
  accent moment.
- Drive scenes from `KineticSceneData` — modes, lines and keyword indexes are
  data, so the same composer renders any subject.

## Example scene shape

```
[AUDIO LINE]: "Nobody reads the terms. Nobody."
mode: energetic
→ "Nobody" slams in on a cobalt block (black text), scale-punch on landing.
  "reads the" types on white, 2-frame stagger.
  "terms." tracks in + cyan underline swipe.
  Cut. "Nobody." re-enters bigger, outlined, fills the frame. Hold with drift.
```

## Files

- `style.json` — catalogue metadata (`video style` lists this).
- `tokens.ts` — THEME: colours, fonts (+ real font file paths in `fonts.faces`),
  motion, layout, treatment, style-specific `type` block.
- `lib/anim.ts` — motion vocabulary: slam, punch, track, wipe, marquee.
- `components/` — `primitives.tsx` (blocks, ghost words, underlines, tickers),
  `scene.tsx` (`KineticScene` composer + `KineticSceneData` schema),
  `ExampleScene.tsx` (three modes, one subject), `index.ts` (public surface).
