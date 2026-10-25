# Geometric Motion

Bauhaus geometry on a Swiss grid. Circles, triangles, arcs and bars snap into
grid-locked compositions; numerals count up; registration marks anchor the
corners. Everything aligns to `THEME.layout.gridUnit` — the precision IS the
style.

## Palette

| Token | Value | Use |
|---|---|---|
| background | `#F5F3EE` | Gallery white |
| text (black) | `#111111` | Headlines, labels, bars |
| accent (red) | `#E63329` | Leading shape + key numerals |
| blue | `#0B4FD9` | Second shape colour, split fields |
| yellow | `#FFC90E` | Third shape colour, highlights |
| surfaceAlt | `#E8E4DA` | Grid tint, quiet panels |
| line | `rgba(17,17,17,0.18)` | Axes, hairlines |

Rules:
- Three colours maximum per frame: black + two of {red, blue, yellow}.
- Every shape edge lands on the grid unit (`snap()` helper rounds to it).
- No shadows, no gradients, no rounded corners — flat overlap only.

## Typography

- Display: **Newake** (wide caps) for numerals and hero labels — demo licence,
  fallback stack is Futura/Century Gothic.
- Headlines: geometric grotesque (Futura → Century Gothic → Helvetica), bold,
  uppercase, tracked `+0.04em`.
- Axis/annotation labels: mono, uppercase, `letter-spacing: 0.18em`, often
  rotated 90° along a seam.
- Headline fitting clamps to `geo.headlineMin/Max` via `fitSize()`.

## Motion

- Symmetrical ease-in-out (`THEME.motion.easing`) — shapes travel and stop
  dead on the grid. Critically damped spring; zero overshoot.
- Bars grow from an edge (`useGrow`), arcs rotate into place
  (`useRotateIn`), the orbit ring turns continuously (`useOrbit`,
  `geo.orbitPeriod` frames per revolution).
- Numerals **count up** from 0 to their value (`useCount`,
  `geo.countFrames`) — data as motion.
- Dot grids cascade cell-by-cell at `geo.gridStagger`.

## Scene composition

- Layer hierarchy: split fields → grid tint → dot grid/bars → shapes →
  numeral → headline + labels → registration marks.
- Drive scenes from `GeometricSceneData` with a `composition`:
  `orbit` (ring + circle + numeral), `stack` (growing bars),
  `grid` (dot field + positioned shapes), `split` (colour fields + seam label).
- Shape positions snap to `gridUnit`; `shapes[]` is data, so any subject can
  be composed.
- Sync to audio: the numeral lands on the stated quantity, bars on the listed
  items, the orbit on the process being described.

## Example scene shape

```
[AUDIO LINE]: "The coordinator splits one job across three machines."
composition: orbit
→ Blue split field wipes from the left. Ring rotates into place around a red
  circle. Numeral counts 0 → 3, label "MACHINES" tracks in beneath.
  Headline "SPLIT. RUN. MERGE." rises word by word on the grid.
  Registration marks tick on. Hold: orbit keeps turning.
```

## Files

- `style.json` — catalogue metadata (`video style` lists this).
- `tokens.ts` — THEME: colours, fonts (+ real font file paths in `fonts.faces`),
  motion, layout, treatment, style-specific `geo` block.
- `lib/anim.ts` — motion vocabulary: grow, rotate-in, orbit, count-up, snap.
- `components/` — `primitives.tsx` (shapes, bars, dot grids, numerals, seam
  labels, registration marks), `scene.tsx` (`GeometricScene` composer +
  `GeometricSceneData` schema), `ExampleScene.tsx`, `index.ts`.
