# Comic Book

Pop-art comic pages in motion. Black-bordered panels pop in, Ben-Day halftone
dots sit over everything, speech balloons land with a bounce, and action words
slam in and shake the frame. Newsprint cream, ink black, red/blue/yellow
primaries — maximum punch.

## Palette

| Token | Value | Use |
|---|---|---|
| background | `#FDF1DC` | Newsprint cream |
| text (ink) | `#0E0E0E` | Borders, lettering, outlines |
| accent (red) | `#FF2E2E` | Action words, bursts, key balloons |
| blue | `#00A3E0` | Panel fills, balloons |
| yellow | `#FFD400` | Caption boxes, bursts, speed fields |
| surface | `#FFFFFF` | Speech balloons |
| surfaceAlt | `#FFE9B8` | Narrator caption boxes |

Rules:
- Every panel and balloon gets a **hard black border** + hard offset shadow —
  no soft shadows anywhere.
- Three primaries max per frame; red leads.
- Halftone overlay goes over panels, never over balloon lettering.

## Typography

- Action words: **Titan One** — round, fat, outlined with
  `-webkit-text-stroke` (`comic.actionStroke`) and a hard offset shadow.
- Titles and balloon lettering: **Barge Black**, ALL CAPS, line-height 0.98.
- Narrator captions: **Designer** in yellow caption boxes, sentence case.
- Balloon text auto-fits its bubble via `fitSize()` (clamps
  `comic.actionMin/Max` for action words).

## Motion

- Panels arrive one by one (`comic.panelStagger`) with a spring overshoot
  (`damping: 10, stiffness: 300`) — they visibly bounce into place.
- Balloons pop from 0.6 scale with a tail that arrives last.
- Action words **slam**: scale down from 2.4× over `slamFrames`, then the
  whole frame **shakes** (`useShake`: decaying sine, `shakeAmp` px over
  `shakeFrames`).
- Speed lines streak continuously (offset cycles every `speedPeriod`
  frames).
- Shout bursts expand with rotation — jagged polygon computed from seeded RNG.

## Scene composition

- Layer hierarchy: speed lines / colour field → panels → halftone →
  balloons + caption boxes → action word (top, shaking).
- Drive scenes from `ComicSceneData` with a `layout`:
  `splash` (one big panel + action word), `strip` (panel grid with
  balloons), `burst` (jagged shout burst owning the frame).
- Balloon/panel positions are normalised (0..1) so any subject reuses them.
- Sync to audio: the action word lands on the impact word; balloons arrive
  when their sentence starts.

## Example scene shape

```
[AUDIO LINE]: "The coordinator throws the job at three machines!"
layout: burst
→ Yellow jagged burst EXPANDS behind the shout.
  "THREE?!" slams in red-outlined, frame shakes 16px → 0.
  Speech balloon pops bottom-right: "Three machines, one result."
  Caption box: "Meanwhile, the queue refills…"
  Halftone + speed lines hold the page alive.
```

## Files

- `style.json` — catalogue metadata (`video style` lists this).
- `tokens.ts` — THEME: colours, fonts (+ real font file paths in `fonts.faces`),
  motion, layout, treatment, style-specific `comic` block.
- `lib/anim.ts` — motion vocabulary: slam, shake, balloon pop, burst polygon,
  speed lines, halftone.
- `components/` — `primitives.tsx` (panels, balloons, bursts, action words,
  caption boxes, halftone), `scene.tsx` (`ComicScene` composer +
  `ComicSceneData` schema), `ExampleScene.tsx`, `index.ts`.
