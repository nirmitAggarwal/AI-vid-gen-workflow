# Paper Collage

A designer cuts, tears, layers and arranges coloured paper, printed labels and
cut-out shapes into one deliberate composition — then the collage animates.
It is **editorial and art-directed**: controlled asymmetry, clear visual
weight, nothing random. (Scrapbook, the sibling style, is looser and more
personal; this one is composed.)

## Palette

| Token | Value | Role |
|---|---|---|
| background | `#F7F0E4` | cream base sheet |
| surface / surfaceAlt | `#FFFDF8` / `#D9C7A6` | warm white / kraft paper |
| text | `#292B32` | dark ink |
| accent / accentAlt | `#D8795B` / `#E9BE55` | terracotta / mustard |
| mutedBlue | `#8EB8D8` | cool counterweight paper |
| sage | `#A9BE9C` | occasional fourth stock |
| shadow | `rgba(41,43,50,0.16)` | paper lift |

Rules:
- **One background field + at most two accent stocks per frame.** The palette
  reads as a paper selection, not a rainbow.
- Text sits on a *lighter* paper than the one behind it; never ink on kraft
  without checking contrast.
- Depth = `paper.shadowLift` / `shadowPiece` / `shadowFlat` only. No blur
  stacks, no glossy gradients, no 3D card decks.

## Typography

| Role | Family | Notes |
|---|---|---|
| headline | `BodoniXT` 400 | dramatic editorial serif, 112px |
| display accent | `Vogue` | occasional alternate display line |
| secondary heading | `Scaver` 800 | strong sub-heads |
| body | `Scaver` 400 | readable printed text |
| labels | `Designer` 700 | uppercase, tracked +0.16em — the "printed sticker" face |
| annotation | `Papernotes` | one or two handwritten notes per scene |

Contrast the faces *on purpose*: a huge serif headline beside a tiny tracked
sans label beside a handwritten note. `THEME.fonts.faces` maps every family to
a real file under `assets/fonts/`; register them with `@font-face` before
rendering — stacks fall back to Georgia/system faces otherwise.

## Graphic vocabulary (`components/primitives.tsx`)

- `PaperPiece` — clipped paper rectangle: torn edges, seeded rotation, shadow
  level, place-in animation
- `TornBand` — full-width divider strip with torn top and bottom edges
- `CutCircle` — circle cut-out (the "photo/object" stand-in)
- `LabelStrip` — small printed label with tracked uppercase text
- `FoldCard` — card with a folded corner
- `CutOutNumeral` — oversized paper numeral
- `CollageArrow` — chunky cut-paper arrow
- `HandNote` — the occasional handwritten annotation
- `GrainOverlay` — procedural paper grain (CSS gradients, no raster)

Torn edges come from `tornPolygon()` (seeded, deterministic): sampled along
each edge at `paper.tornStep` with depth up to `paper.tornDepth`. They are
*irregular but intentional* — never random polygons that look like broken
geometry.

## Depth & layering

Five levels, applied in this order during a scene:

1. background sheet (`depth: 0`) — drifts a few px, `paper.shadowFlat`
2. large colour field (`depth: 1`) — `shadowPiece`
3. secondary pieces (`depth: 2`)
4. headline + main illustration (`depth: 3`) — `shadowLift`
5. small foreground labels/notes (`depth: 4`)

`depth` drives both z-order and entrance delay, so stacking always reads.

## Composition

Scene data supports overlapping pieces in normalised frame coordinates:

```ts
type CollageSceneData = {
  title: string;
  kicker?: string;             // tracked label strip
  subtitle?: string;
  field?: { color?: string; side?: "left" | "right" | "bottom" | "none" };
  tornBand?: { color?: string; at?: "top" | "middle" | "bottom" };
  pieces?: Array<{
    id: string;
    kind: "text" | "card" | "circle" | "numeral" | "label" | "arrow" | "note";
    text?: string; sub?: string; color?: string;
    at: { x: number; y: number; w: number; h: number }; // 0..1 of frame
    rotate?: number; depth?: number;
  }>;
  notes?: string[];
};
```

Missing `pieces` → the composer builds a text-led arrangement (kicker +
headline + subtitle + one accent circle), so optional data never blanks a
frame. Keep text clear of overlapping pieces; overlap belongs to decoration.

## Motion

| Preset | Behaviour |
|---|---|
| paper placement | slide in from a direction with `spring` settle, 26f |
| layered reveal | background pieces first, then content, then labels |
| paper stack | delay = `depth * stagger * 2 + index * stagger` |
| tear transition | `tornBand` wipes across with a torn leading edge |
| depth movement | background field drifts `paper.drift` px over the hold |
| exit | pieces slide off along their entry vector, 18f |

Hierarchy: headline → main piece → supporting pieces → labels/notes.
Do not animate every layer independently — depth 4 accents move last and least.

## Example scene — "How a distributed system assigns work to multiple computers"

```
kicker strip : "DISTRIBUTED SYSTEMS" (Designer, tracked, mustard paper)
headline     : "One job in.\nMachines out." (BodoniXT, warm white field behind)
torn band    : terracotta strip across the lower third
pieces       : circle "×3" (muted blue), label "COORDINATOR", label "QUEUE",
               arrow from coordinator to workers, numeral "3"
hand note    : "nobody holds the whole job" (Papernotes)
motion       : field slides up (f0) → headline lands (f10) → band tears across
               (f26) → labels drop in staggered 5f → hand note last (f62)
```

`ExampleScene.tsx` ships this composition; `SingleLayerExample` shows the
same subject reduced to a single paper layer + headline (content-adaptation
check: one layer vs. eight overlapping pieces, same code path).