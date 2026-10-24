# Whiteboard Writing

A hand writes your text on screen, nib on the letter, in **whatever font you
give it**. No hand-drawn stroke data, no per-font tweaking.

```
index.ts                barrel export
WhiteboardWriting.tsx   the component (React + SVG, zero dependencies)
writing-path.ts         ink mask → skeleton → pen path (pure, testable)
HandPen.tsx             hand holding a pen, nib at (0, 0)
hand-holding-pen.svg    the same art as a standalone file
```

## How it works

1. The text is drawn into an offscreen canvas in the target font.
2. The ink is thinned to a 1px skeleton (Zhang-Suen), spurs pruned, and the
   skeleton is walked into strokes — following the direction of travel so it
   walks straight through junctions instead of stopping at them.
3. Strokes are ordered like a writer would (start left, nearest next) and
   smoothed.
4. A mask paints the text only where the pen trail has already passed; the
   hand is stamped at the current point on the path, rotated to the stroke.

Because step 1 is a rasterisation, any font works: webfonts, system fonts,
serif, script, monospace.

## Website (self-driving)

```tsx
import { WhiteboardWriting } from "./effects/whiteboard";

<WhiteboardWriting
  text="Hello there"
  fontFamily="'Playfair Display', serif"
  fontSize={72}
  duration={2600}          // or leave it out and it paces itself
  color="#111"
/>
```

It starts on mount, finishes, and calls `onComplete`. Use `playing`, `loop` and
`speed` to control it. `prefers-reduced-motion` shows the finished text.

## Remotion (frame-driven)

Drive it with `progress` so every frame is deterministic:

```tsx
const frame = useCurrentFrame();
const progress = interpolate(frame, [0, 60], [0, 1], { extrapolateRight: "clamp" });

<WhiteboardWriting text="Write" fontFamily="Scaver" fontSize={160} progress={progress} />
```

Load the font before rendering (Remotion's `staticFile()` + `@font-face`, or
`@remotion/google-fonts`). The component waits for `document.fonts` too.

## Props

| Prop | Default | What |
|---|---|---|
| `text` | — | Text to write, `\n` supported |
| `fontFamily` | system stack | Any CSS font stack |
| `fontSize` | `64` | px |
| `fontWeight` / `fontStyle` | `400` / `normal` | |
| `letterSpacing` | `0` | px |
| `lineHeight` | `1.3` | multiple of font size |
| `color` | `#111111` | Ink colour |
| `penColor` | `color` | Pen body colour |
| `revealWidth` | auto | Brush diameter; defaults to the font's stroke width |
| `progress` | — | 0..1, controlled mode |
| `duration` | auto | Auto-play length in ms |
| `speed` | `520` | px/s when `duration` is not set |
| `playing` / `loop` | `true` / `false` | Auto mode |
| `onComplete` | — | Auto mode |
| `showHand` | `true` | |
| `handScale` | `0.78` | Hand size relative to the font |
| `handAngle` / `handFollow` | `0` / `0.12` | Hand rotation |
| `handSrc` | — | Custom hand image, nib at its bottom-left (same 400×350 box) |
| `padding` | `8` | px of air around the text |

## Swapping the hand

`HandPen` (or `hand-holding-pen.svg`) has the nib at `(0, 0)` and everything
else up and to the right. A custom image is dropped into the same
`-46 -306 400 350` box, so keep the nib in the bottom-left corner.

## Notes

- Path building costs ~100 ms for a short word at 150px; results are cached by
  text + font + size.
- Very small text (under ~20px) gets a chunky 1px skeleton; scale the font up
  and use CSS `transform: scale()` if you need it tiny.
- Hand art adapted from the reference illustration supplied with the project.
