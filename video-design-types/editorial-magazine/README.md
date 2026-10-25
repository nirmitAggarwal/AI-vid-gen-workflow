# Editorial Magazine

Print-magazine spreads in motion. Type is *set*, not thrown: didone headlines
rise from their baseline behind a mask, rules grow across the measure, columns
cascade in reading order. Warm uncoated paper, press-ink black, one editorial
red.

## Palette

| Token | Value | Use |
|---|---|---|
| background | `#F7F4EF` | Warm uncoated paper |
| surface / surfaceAlt | `#FFFFFF` / `#EDE7DD` | Tint blocks, standfirst panels |
| text (ink) | `#14120F` | Headlines, body copy |
| textSecondary | `#5C564D` | Captions, folios |
| accent (red) | `#D0342C` | Rubrics, rules, pull-quote marks — the ONE accent |
| blue | `#1B3A6B` | Duotone photo tints only |
| line | `rgba(20,18,15,0.24)` | Hairline rules |

Rules:
- Red is rationed: one rubric + one rule per spread, never more.
- Black on paper is the default state; colour is annotation, not decoration.

## Typography

- Display: **Vogue** (didone, high contrast) for cover/feature headlines;
  **BodoniXT** as the workhorse serif for headlines and pull quotes.
- Kickers and captions: **Liberation Sans / Helvetica** small caps, wide
  tracking, uppercase.
- Body: sans at 400, generous 1.5 line-height, set in 2 columns with a 48px
  gutter (`THEME.layout.columns`, `gutter`).
- Drop cap: `magazine.dropCapSize` px serif, exactly 3 body lines tall.
- Headline fitting: `fitSize()` clamps between `magazine.headlineMin/Max`.

## Motion

- Everything is *dese* with `THEME.motion.easing` over 16 frames — a critically
  damped spring (`damping: 200, stiffness: 90`) means zero overshoot.
- Headlines reveal from the baseline: `clip-path: inset()` slides the line up
  inside its own box (`useMaskReveal`).
- Rules draw left→right with `scaleX` (`useRuleGrow`) — thin rule first, then
  the thick section rule.
- Columns cascade at `columnStagger`; pull quotes slide in from the gutter.
- Photos reveal with a top-down wipe; captions fade after.

## Scene composition

- Layer hierarchy: paper + grain → hairline grid → photo/duotone block →
  headline stack → body columns → folio.
- Drive scenes from `MagazineSceneData` with a `layout`:
  `cover` (masthead + huge headline), `feature` (rubric + headline + photo +
  columns), `columns` (drop cap + body), `quote` (pull quote dominant).
- Sync to audio: the headline lands on the topic sentence; the pull quote
  lands on the narrator's strongest phrase.

## Example scene shape

```
[AUDIO LINE]: "The coordinator splits the work; nobody holds the whole job."
layout: feature
→ Rubric "DISTRIBUTED SYSTEMS" tracked in, red hairline grows under it.
  Headline "One job in. Machines out." reveals from baseline, line by line.
  Duotone photo block wipes down; caption fades.
  Two body columns cascade in reading order. Folio ticks on. Hold with grain.
```

## Files

- `style.json` — catalogue metadata (`video style` lists this).
- `tokens.ts` — THEME: colours, fonts (+ real font file paths in `fonts.faces`),
  motion, layout, treatment, style-specific `magazine` block.
- `lib/anim.ts` — motion vocabulary: mask reveals, rule grows, column
  cascades, wipes, deterministic text fitting.
- `components/` — `primitives.tsx` (rules, headlines, drop caps, columns,
  pull quotes, photos, folios), `scene.tsx` (`MagazineScene` composer +
  `MagazineSceneData` schema), `ExampleScene.tsx`, `index.ts`.
