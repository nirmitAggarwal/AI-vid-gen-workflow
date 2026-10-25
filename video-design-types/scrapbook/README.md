# Scrapbook

A personal journal page in motion. Washi-taped polaroids drop onto cream
paper, handwritten notes settle at slight angles, stickers pop with a spin,
blanket stitches draw themselves along the edges. Warm, casual, handmade.

## Palette

| Token | Value | Use |
|---|---|---|
| background | `#F6EEE2` | Soft cream page |
| surface | `#FFFFFF` | Polaroid borders, note cards |
| surfaceAlt | `#EFE3D0` | Mats and pockets |
| text (ink) | `#3A342B` | Warm ink for handwriting |
| accent (rose) | `#D06B6B` | Stickers, tape, hearts — the leading accent |
| sage | `#8AA88B` | Secondary tape/sticker colour |
| mustard | `#E5B84B` | Ticket stubs, highlights |
| sky | `#8FB8D6` | Photo tints |
| kraft | `#D9C2A0` | Kraft mats |

Rules:
- Everything sits at a slight angle (±6°) — nothing is perfectly square.
- Soft paper shadows only (`treatment.shadow`), never hard offsets.
- Rose leads; sage/mustard/sky are seasoning, two extra colours max.

## Typography

- Headings & polaroid captions: **Papernotes** Bold — the journal hand.
- Margin notes: **SimpleHandmade** (fallback Papernotes).
- Accent lines (labels on tape, ticket text): **Stay With Me**.
- Body copy: **Designer** → Helvetica, small and quiet.
- Title fitting clamps to `scrap.titleMin/Max` via `fitSize()`.

## Motion

- **Drop-and-settle**: pieces fall from `dropHeight` px and bounce
  (`spring: damping 12, stiffness 180`), landing at their resting rotation.
  The easing curve itself overshoots (`[0.34, 1.3, 0.42, 1]`).
- **Tape wipes** on over `tapeFrames` — it sticks from one end.
- **Stickers pop and spin** `stickerSpin` degrees into place.
- **Stitches draw**: dashed blanket-stitch borders animate their dash offset
  over `stitchFrames`.
- Holds sway: pieces drift ±`floatAmp` px on a `floatPeriod`-frame sine.

## Scene composition

- Layer hierarchy: page + grain → mats/stitch frames → polaroids → tape →
  notes → stickers/tickets (top).
- Drive scenes from `ScrapbookSceneData` with a `layout`:
  `album` (one big taped polaroid + title), `board` (several scattered
  polaroids + stickers + ticket), `spread` (handwritten note inside a stitch
  frame).
- Polaroid/tape/sticker positions are normalised (0..1) — reusable for any
  subject.
- Sync to audio: the polaroid lands on the noun it "photographs"; stickers
  pop on emphasis words; the note writes the sentence being spoken.

## Example scene shape

```
[AUDIO LINE]: "Three machines quietly share one job."
layout: board
→ Three polaroids drop in at -4°, +3°, -2° with gradient photo fields and
  handwritten captions ("queue", "worker ×3", "merged"). Rose washi tape
  sticks across each top corner. Star sticker pops on the middle one.
  Stitched frame draws around the page. Note settles bottom-left. Sway.
```

## Files

- `style.json` — catalogue metadata (`video style` lists this).
- `tokens.ts` — THEME: colours, fonts (+ real font file paths in `fonts.faces`),
  motion, layout, treatment, style-specific `scrap` block.
- `lib/anim.ts` — motion vocabulary: drop-settle, tape wipe, sticker pop,
  stitch draw, sway.
- `components/` — `primitives.tsx` (polaroids, washi tape, stickers, ticket
  stubs, stitches, hand notes), `scene.tsx` (`ScrapbookScene` composer +
  `ScrapbookSceneData` schema), `ExampleScene.tsx`, `index.ts`.
