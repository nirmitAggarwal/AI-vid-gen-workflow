# Line Art Illustration

A pen moving across warm white paper. Single-weight continuous-line icons
draw themselves on, dotted trails march between steps, handwritten annotations
point at things. Calm and airy: one ink navy line colour, one teal accent, no
fills, no shadows, no boxes.

## Palette

| Token | Value | Use |
|---|---|---|
| background | `#FBFAF6` | Warm white paper |
| text (ink) | `#23303A` | Every stroke + headings |
| accent (teal) | `#127C71` | Checks, key strokes, dots, underlines |
| textSecondary | `#6B7480` | Labels, supporting copy |
| surfaceAlt | `#F1EEE6` | Soft wash panels behind steps |
| line | `rgba(35,48,58,0.30)` | Hairline separators |

Rules:
- One weight for every stroke (`lineArt.stroke` / `lineArt.iconStroke`) —
  varying weight breaks the single-line illusion.
- Teal is for *emphasis strokes* only, never for fills.
- Flat: no shadows, no gradients, no texture.

## Typography

- Headings: **Scaver** Medium (500) — elegant serif curves that echo the line
  drawings. 1.14 line-height, tight tracking.
- Body/labels: **Designer** → Helvetica, quiet and small.
- Annotations: **SimpleHandmade** (fallback Papernotes) — the handwritten
  marginalia that points at the drawing.
- Headline fitting clamps to `lineArt.headlineMin/Max` via `fitSize()`.

## Motion

- **Draw-on everywhere**: SVG paths animate `stroke-dashoffset` from
  `drawFrames` with the pen easing — an icon appears as if being drawn
  (`useDraw`).
- **Marching trails**: dashed connectors advance their offset every
  `dashMarch` frames so the dotted line flows between steps (`useTrail`).
- **Breathing holds**: drawn groups float ±`floatAmp` px on a
  `floatPeriod`-frame sine (`useFloat`) — nothing ever sits frozen.
- Entrances are draws and gentle settles (damping 30, stiffness 90); captions
  fade and rise. Nothing slams.

## Scene composition

- Layer hierarchy: soft wash panels → icons/drawings → trails connecting them
  → headline → handwritten annotations + arrows.
- Drive scenes from `LineArtSceneData` with a `composition`:
  `hero` (one large illustration + headline), `flow` (icons joined by dotted
  trails), `steps` (washed step panels with icons + labels).
- Icon positions are normalised (0..1) so any subject lays out cleanly.
- Sync to audio: each icon finishes drawing on the noun it illustrates; the
  trail completes when the narrator says what connects to what.

## Example scene shape

```
[AUDIO LINE]: "The coordinator hands each task to a free machine."
composition: flow
→ Icon: document draws on (left). Dotted trail marches to a second icon:
  three stacked machines, drawn in one weight. Teal check pops on the last.
  Headline "Hand it off." draws its underline swoosh. Handwritten annotation
  with a curved arrow: "only the free ones". Float begins; hold.
```

## Files

- `style.json` — catalogue metadata (`video style` lists this).
- `tokens.ts` — THEME: colours, fonts (+ real font file paths in `fonts.faces`),
  motion, layout, treatment, style-specific `lineArt` block.
- `lib/anim.ts` — motion vocabulary: draw-on, marching trails, floats, swoosh.
- `components/` — `primitives.tsx` (icon library, trails, arrows, annotations,
  swoosh underlines), `scene.tsx` (`LineArtScene` composer +
  `LineArtSceneData` schema), `ExampleScene.tsx`, `index.ts`.
