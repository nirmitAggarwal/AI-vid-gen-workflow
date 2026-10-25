# Technical Sketchnotes

An engineer's illustrated notebook, animated. Handwritten headings sit over
pale marker highlights; architecture diagrams are drawn box-by-box with
wobbly-but-coherent ink outlines; arrows connect the right components, and a
circled number tells the eye where to start.

It must feel **personal and handcrafted without being childish or messy** — a
structured sketchnote by someone who is very good at visual note-taking, not a
PowerPoint slide with a handwriting font on it, and not a corporate flowchart.

## Palette

| Token | Value | Role |
|---|---|---|
| background | `#FDFCF8` | warm notebook white (base page) |
| surface / surfaceAlt | `#FFFFFF` / `#F3F0E7` | a cleaner sheet / aged margin block |
| text | `#14264D` | navy ink — primary text + outlines |
| accent | `#2878E5` | architecture, information flow, ordinary relationships |
| accentAlt | `#F4A340` | decisions, warnings, important processing |
| mint | `#72D9B0` | success, storage, completed operations |
| lavender | `#B8A2F5` | AI components / abstract intelligence |
| coral | `#F27683` | errors, conflicts, failure states |
| highlight* | `#D9F0FF` `#DDF8E9` `#FFF0A8` `#EDE5FF` `#FFE3E6` | pastel marker fills behind text |

Semantic rules:
- Navy for text and technical outlines. Blue for flow. Green = done/stored.
  Orange = decide/warn. Violet = AI. Coral = failure. **One idea, one colour.**
- Pastels only ever sit *behind* text or *inside* a box — never as the page.
- `treatment.gradient` lays a barely-there 52px graph grid on the page. Delete
  it in scenes that stack more than ~8 elements.

## Typography

| Role | Family | Notes |
|---|---|---|
| title / section heading | `Papernotes` 700 | 88px title, 44px sections |
| diagram labels / body | `Papernotes` 400 | 27–30px, never smaller than 24px |
| annotations / marginalia | `SimpleHandmade` | 24px, short only |
| signatures / accent phrase | `Stay With Me` | one per scene, max |
| mono (ids, code) | system mono | uppercase, tracked +0.12em |

`THEME.fonts.faces` lists the real files under `assets/fonts/handwritten/`.
Register them with `@font-face` before rendering; the stacks already fall back
to a system sans so nothing breaks if a family is unavailable. **Never shrink
text to make a dense frame fit** — cut the content instead.

## Graphic vocabulary

`components/primitives.tsx` provides the whole drawing kit:

- `SketchBox` — wobbly hand-drawn rectangle (deterministic seed, draw-on border)
- `MarkerHighlight` — organic left-to-right marker wipe behind a phrase
- `SketchArrow` / `DashedConnector` — curved or straight hand-drawn arrows
- `Icon` — database, server, cloud, user, brain, gear, doc, warning, check, clock
- `CircledNumber`, `SectionTitle`, `HandUnderline`, `Callout`
- `DrawPath` / `DashedPath` — stroke reveal built on `pathLength={1}`

All wobble comes from a seeded PRNG (`rng(seed)` in `lib/anim.ts`), so the same
scene data draws the same way on every render. Amplitude stays at
`sketchnote.wobble` (2.2px) — lines look drawn, not broken.

## Composition

Underlying structure is a modular grid; the hand-drawn layer adds organic
variation on top. Supported layouts (see `layout` in the scene data):

- `"diagram"` — nodes placed on a ring/grid, arrows between them, focus callouts
- `"flow"` — a horizontal or vertical process chain with numbered steps
- `"sections"` — numbered heading + icon list, marker-highlighted titles

Rules:
- One idea per frame. Reveal a section, focus a component, then move on — do
  not cram the whole infographic into a single shot.
- Group related concepts; arrows must terminate on the box they describe.
- Keep the header band (badge + title + subtitle) at the top 22% of the frame.
- Safe margin is `layout.safeMargin` (88px @1080); boxes align to it, arrows
  may cross it.

## Motion

| Preset | Where | Behaviour |
|---|---|---|
| draw-on | `useDraw` / `DrawPath` | strokes reveal by `pathLength` at `drawDuration` |
| marker wipe | `MarkerHighlight` | `clip-path: inset` L→R, `markerDuration` |
| diagram assembly | `scene.tsx` | node box → label → arrow → next node (`stagger`) |
| annotation pop | `usePop` | circled numbers / callouts scale 0.6 → 1 |
| camera focus | `scene.tsx` `focus` | group scales ~1.12 toward the focused node |
| exit | `useProgress` on the exit window | whole page pans slightly, content fades |

Hierarchy: 1) headline/diagram, 2) connectors, 3) labels, 4) marginalia.
Never draw every stroke at once — that's noise, not explanation.

## Scene data (structured, reusable)

```ts
type SketchnoteSceneData = {
  title: string;
  subtitle?: string;
  section?: number | string;   // circled section number
  layout?: "diagram" | "flow" | "sections";
  nodes?: { id, label, sub?, icon?, tone?, x?, y? }[];
  edges?: { from, to, label?, kind?: "solid" | "dashed" }[];
  steps?: string[];            // ordered process for "flow"
  notes?: string[];            // marginalia
  focus?: string;              // node id to emphasise
};
```

`<SketchnoteScene data={...} />` builds the composition; omit `nodes` and it
falls back to a text-led section list, so missing optionals never blank a frame.

## Example scene — "How a distributed system assigns work to multiple computers"

```
[AUDIO LINE]: "A coordinator takes the job, splits it, and hands the pieces out."
Header: ① "Who does the work?" (yellow marker wipe) + subtitle "one job, many machines"
Diagram: Coordinator (blue, brain) ──> Queue ──dashed──> Worker ×3 (green, server)
         Workers ──curved──> Store (mint cylinder) ──> Result (orange)
Motion:  box draw-on (24f) → label fade → arrow draw → next node, stagger 4f.
         focus:"worker-2" pushes the camera 1.12× toward that box for the line
         about a single machine failing.
Marginalia: "retries are cheap" in SimpleHandmade with a coral hand arrow.
```

`ExampleScene.tsx` ships exactly this scene — register it in
`scenes/index.ts` (or copy its data into your own scene component).