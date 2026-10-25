# Video Design Types

Pre-made design languages the AI can apply to any project with one command:

```
node tools/video.mjs style <project> --set cinematic
node tools/video.mjs style            # list all styles
```

Applying a style copies its `tokens.ts` into the project as
`video/src/data/theme.ts`, so every scene reads colors, fonts and motion
settings from `THEME` instead of hardcoding them.

## Available styles

### Full kits (tokens + reusable component library)

These eight styles ship a scene composer and a reusable drawing/motion kit in
addition to tokens, so an AI agent can build varied videos from structured
scene data (`style.json` + `README.md` + `tokens.ts` + `lib/anim.ts` +
`components/`):

| Style | Feel |
|---|---|
| `technical-sketchnotes` | Dark sketchnote board: rough boxes, marker highlights, drawn icons |
| `paper-collage` | Torn-paper collage, print stocks, arrows and cut-out numerals |
| `kinetic-typography` | Words ARE the visuals — minimal / editorial / energetic modes, near-black + cobalt accents |
| `editorial-magazine` | Didone headlines, rubrics, drop caps, two-column body on warm paper |
| `geometric-motion` | Bauhaus shapes on a Swiss grid, counting numerals, registration marks |
| `line-art-illustration` | Single-weight line drawings that draw themselves on, dotted trails |
| `comic-book` | Panels, halftone, balloons, slam-in action words with frame shake |
| `scrapbook` | Washi-taped polaroids, handwriting, stickers, blanket-stitch frames |

Each kit exposes the same surface (`components/index.ts`):

- `<Style>Scene` — composer taking `{ data, line }`, where `data` is the
  style's scene schema (mode/layout/composition + normalised placements) and
  `line` is a timeline line (`{ text }` at minimum).
- `ExampleScene` (+ layout variants) — the same subject staged every way the
  style can stage it. All example data is exported so it can be spread into
  new scenes: `{ ...exampleData, ...overrides }`.
- `lib/anim` — the style's motion vocabulary (drop, slam, draw-on, reveal…),
  all seeded and deterministic.
- `primitives` — the style's graphic vocabulary (panels, polaroids, icons,
  shapes…), all reading colours/geometry from `THEME`.

### Tokens-only styles

| Style | Feel |
|---|---|
| `minimal-tech` | Clean, calm, Apple-keynote whitespace, one accent |
| `cinematic` | Dark film-title mood, gold accents, slow reveals |
| `marker-doodle` | Hand-drawn marker doodles on paper |

## Folder format

Every style folder contains:

- `style.json` — `{ id, name, description }` (shown by `video style`)
- `tokens.ts` — exports `THEME` with sections: `colors`, `fonts`, `motion`,
  `layout`, `treatment` (+ an optional style-specific block, e.g. `comic`,
  `geo`, `magazine`, `lineArt`, `scrap`)
- `README.md` — human/AI-facing design guide: palette rules, typography
  rules, motion vocabulary, scene composition guidance, and an example scene
  breakdown

Full kits additionally contain:

- `lib/anim.ts` — motion vocabulary + deterministic text fitting (`fitSize`,
  `wrapText`) + seeded PRNG helpers
- `components/primitives.tsx` — the graphic vocabulary as React components
- `components/scene.tsx` — the scene schema (typed `…SceneData`) + composer
  that builds a full frame from it at the real video size
- `components/ExampleScene.tsx` — example data for every layout the style
  supports, on one shared subject
- `components/index.ts` — the public barrel (`export * from "./primitives"`
  etc.)

## Creating a new style with AI

1. Copy the `_template` folder and name it (lowercase-with-dashes).
2. Ask the AI: *"Create a design style called <name> for <mood/reference>.
   Fill style.json, tokens.ts and README.md following the conventions of the
   other styles."*
3. The AI must keep the same `THEME` keys (`colors`, `fonts`, `motion`,
   `layout`, `treatment`) so scenes compile against any style.
4. Verify: `node tools/video.mjs style` should list it.

Rules for token files:
- `tokens.ts` must only use plain data (strings/numbers/arrays/objects) — it
  is copied verbatim into projects.
- Font stacks must always include system fallbacks so a missing face never
  breaks a frame. Supplied repo fonts may additionally be declared in
  `fonts.faces` with their `assets/fonts/...` path (repo-relative) plus a
  licence note where the file is a demo/trial face.
- `motion.durations` are in frames at 30fps; scale if the project fps
  differs.
- Never reference other styles' tokens; each folder is self-contained.
- Scene data drives content: never hardcode one example video into a
  composer — put subjects in `ExampleScene` data and keep composers generic.
