import React, { useEffect, useId, useRef, useState } from "react";
import { HandPen } from "./HandPen";
import {
  buildWritingPath,
  pointAt,
  revealPathData,
  type WritingPath,
} from "./writing-path";

/**
 * Whiteboard / hand-writing text effect that works with **any** font.
 *
 * It rasterises the text in the browser, thins the glyphs down to their
 * skeleton, and writes the text along that skeleton — so the pen follows the
 * real curves of whatever font is loaded. The pen nib sits on the point that is
 * currently being revealed, and the glyphs are masked by the trail the nib has
 * already drawn.
 *
 * Two ways to drive it:
 *
 * 1. Auto (websites): `<WhiteboardWriting text="Hello" duration={2500} />`
 *    plays on mount with requestAnimationFrame.
 * 2. Controlled (Remotion, scroll, scrubbing):
 *    `<WhiteboardWriting text="Hello" progress={frame / 60} />`
 *
 * No dependencies, no font files, no SVG text paths. React only.
 */

export type WhiteboardWritingProps = {
  /** The text to write. Newlines are honoured. */
  text: string;
  /** Any CSS font stack — a system font, a Google font, a webfont. */
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: number | string;
  fontStyle?: "normal" | "italic";
  /** Extra tracking in px. */
  letterSpacing?: number;
  /** Line height as a multiple of the font size. */
  lineHeight?: number;
  /** Ink colour. Also used for the pen body unless `penColor` is set. */
  color?: string;
  /** Pen body colour. */
  penColor?: string;
  /** Reveal brush diameter in px. Defaults to the font's own stroke width. */
  revealWidth?: number;
  /** Controlled progress, 0..1. When set, duration/playing are ignored. */
  progress?: number;
  /** Auto-play duration in ms. Defaults to a comfortable writing speed. */
  duration?: number;
  /** Writing speed in px per second, used when `duration` is not set. */
  speed?: number;
  /** Auto-play control. Defaults to true. */
  playing?: boolean;
  loop?: boolean;
  /** Fires once when the writing finishes (auto mode). */
  onComplete?: () => void;
  /** Show the hand + pen. */
  showHand?: boolean;
  /** Hand size relative to the font (1 = hand is ~3.9x the font size wide). */
  handScale?: number;
  /** Base hand rotation in degrees. */
  handAngle?: number;
  /** How much the hand tilts with the direction of the stroke, 0..1. */
  handFollow?: number;
  /** Custom hand image. It must have the nib at its bottom-left corner. */
  handSrc?: string;
  /** Empty space around the text, in px. */
  padding?: number;
  className?: string;
  style?: React.CSSProperties;
};

type LineLayout = { text: string; x: number; baseline: number };

type Layout = {
  width: number;
  height: number;
  lines: LineLayout[];
  path: WritingPath | null;
  brush: number;
};

type MeasureOptions = {
  text: string;
  fontFamily: string;
  fontSize: number;
  fontWeight: number | string;
  fontStyle: "normal" | "italic";
  letterSpacing: number;
  lineHeight: number;
  padding: number;
  revealWidth?: number;
};

/** Built paths are expensive; reuse them across renders and Remotion frames. */
const pathCache = new Map<string, Layout>();
const MAX_CACHE = 24;

function fontString(options: MeasureOptions): string {
  return `${options.fontStyle} ${options.fontWeight} ${options.fontSize}px ${options.fontFamily}`;
}

function measure(options: MeasureOptions): Layout | null {
  if (typeof document === "undefined") return null;

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return null;

  const {
    text,
    fontSize,
    letterSpacing,
    lineHeight,
    padding,
    revealWidth,
  } = options;

  const font = fontString(options);
  ctx.font = font;
  // Canvas letterSpacing is not in every TS lib yet; harmless when missing.
  (ctx as CanvasRenderingContext2D & { letterSpacing?: string }).letterSpacing =
    `${letterSpacing}px`;

  const lines = text.split("\n");
  const metrics = lines.map((line) => ctx.measureText(line.length > 0 ? line : " "));

  let ascent = fontSize * 0.8;
  let descent = fontSize * 0.2;
  let widest = 0;
  for (const metric of metrics) {
    ascent = Math.max(ascent, metric.actualBoundingBoxAscent || 0);
    descent = Math.max(descent, metric.actualBoundingBoxDescent || 0);
    widest = Math.max(widest, metric.width);
  }

  const lineBox = fontSize * lineHeight;
  const width = Math.ceil(widest + padding * 2);
  const height = Math.ceil(ascent + descent + (lines.length - 1) * lineBox + padding * 2);
  if (width < 2 || height < 2) return null;

  const baseline = padding + ascent;
  const lineLayouts: LineLayout[] = lines.map((line, index) => ({
    text: line,
    x: padding,
    baseline: baseline + index * lineBox,
  }));

  canvas.width = width;
  canvas.height = height;
  ctx.font = font;
  (ctx as CanvasRenderingContext2D & { letterSpacing?: string }).letterSpacing =
    `${letterSpacing}px`;
  ctx.textBaseline = "alphabetic";
  ctx.textAlign = "left";
  ctx.fillStyle = "#fff";
  for (const line of lineLayouts) {
    if (line.text.length > 0) ctx.fillText(line.text, line.x, line.baseline);
  }

  const { data } = ctx.getImageData(0, 0, width, height);
  const ink = new Uint8Array(width * height);
  for (let i = 0; i < ink.length; i += 1) {
    ink[i] = data[i * 4 + 3] > 100 ? 1 : 0;
  }

  const path = buildWritingPath(
    { width, height, data: ink },
    revealWidth ? { brushWidth: revealWidth } : undefined,
  );

  return {
    width,
    height,
    lines: lineLayouts,
    path,
    brush: path?.brushWidth ?? Math.max(2, fontSize * 0.09),
  };
}

function getLayout(options: MeasureOptions): Layout | null {
  const key = [
    options.text,
    options.fontFamily,
    options.fontSize,
    options.fontWeight,
    options.fontStyle,
    options.letterSpacing,
    options.lineHeight,
    options.padding,
    options.revealWidth ?? "",
  ].join("|");

  const cached = pathCache.get(key);
  if (cached) return cached;

  const layout = measure(options);
  if (layout) {
    if (pathCache.size >= MAX_CACHE) pathCache.clear();
    pathCache.set(key, layout);
  }
  return layout;
}

export const WhiteboardWriting: React.FC<WhiteboardWritingProps> = ({
  text,
  fontFamily = "-apple-system, 'Segoe UI', Helvetica, Arial, sans-serif",
  fontSize = 64,
  fontWeight = 400,
  fontStyle = "normal",
  letterSpacing = 0,
  lineHeight = 1.3,
  color = "#111111",
  penColor,
  revealWidth,
  progress,
  duration,
  speed = 520,
  playing = true,
  loop = false,
  onComplete,
  showHand = true,
  handScale = 0.78,
  handAngle = 0,
  handFollow = 0.12,
  handSrc,
  padding = 8,
  className,
  style,
}) => {
  const rawId = useId();
  const maskId = `ww-${rawId.replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const measureOptions: MeasureOptions = {
    text,
    fontFamily,
    fontSize,
    fontWeight,
    fontStyle,
    letterSpacing,
    lineHeight,
    padding,
    revealWidth,
  };

  // Measure synchronously when the font is already available (Remotion frames,
  // repeat renders); otherwise the effect below waits for the webfont.
  const [layout, setLayout] = useState<Layout | null>(() => {
    if (typeof document === "undefined") return null;
    try {
      const ready =
        !document.fonts ||
        document.fonts.check(`${fontStyle} ${fontWeight} ${fontSize}px ${fontFamily}`);
      return ready ? getLayout(measureOptions) : null;
    } catch {
      return getLayout(measureOptions);
    }
  });
  const [autoProgress, setAutoProgress] = useState(0);
  const completeRef = useRef(onComplete);
  completeRef.current = onComplete;

  const controlled = typeof progress === "number";

  // Measure once the font is actually available (webfonts load late).
  useEffect(() => {
    let cancelled = false;

    const run = () => {
      if (cancelled) return;
      setLayout(
        getLayout({
          text,
          fontFamily,
          fontSize,
          fontWeight,
          fontStyle,
          letterSpacing,
          lineHeight,
          padding,
          revealWidth,
        }),
      );
    };

    const fonts = typeof document !== "undefined" ? document.fonts : undefined;
    if (fonts) {
      fonts
        .load(`${fontStyle} ${fontWeight} ${fontSize}px ${fontFamily}`)
        .then(() => run())
        .catch(() => run());
    } else {
      run();
    }

    return () => {
      cancelled = true;
    };
  }, [
    text,
    fontFamily,
    fontSize,
    fontWeight,
    fontStyle,
    letterSpacing,
    lineHeight,
    padding,
    revealWidth,
  ]);

  const path = layout?.path ?? null;
  const durationMs =
    duration ?? Math.max(400, ((path?.duration ?? text.length * 40) / speed) * 1000);

  // Auto-play.
  useEffect(() => {
    if (controlled || !playing) return;

    const reduceMotion =
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion) {
      setAutoProgress(1);
      return;
    }

    setAutoProgress(0);
    let raf = 0;
    let start = performance.now();

    const tick = (now: number) => {
      const ratio = Math.min(1, (now - start) / durationMs);
      setAutoProgress(ratio);

      if (ratio < 1) {
        raf = requestAnimationFrame(tick);
      } else if (loop) {
        start = now;
        raf = requestAnimationFrame(tick);
      } else {
        completeRef.current?.();
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [controlled, playing, durationMs, loop, text]);

  const p = controlled
    ? Math.max(0, Math.min(1, progress))
    : autoProgress;

  const revealed = path ? revealPathData(path, p) : "";
  const nib = path ? pointAt(path, p) : null;

  if (!layout) return null;

  const { width, height, lines, brush } = layout;
  const handSize = (fontSize / 80) * handScale;
  const rotation = handAngle + (nib ? clamp(nib.angle, -40, 40) * handFollow : 0);

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      style={{ overflow: "visible", ...style }}
      role="img"
      aria-label={text}
    >
      <defs>
        <mask
          id={maskId}
          maskUnits="userSpaceOnUse"
          x={0}
          y={0}
          width={width}
          height={height}
        >
          <path
            d={revealed}
            fill="none"
            stroke="#fff"
            strokeWidth={brush}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </mask>
      </defs>

      <g mask={`url(#${maskId})`}>
        {lines.map((line, index) => (
          <text
            key={`${index}-${line.text}`}
            x={line.x}
            y={line.baseline}
            fill={color}
            fontFamily={fontFamily}
            fontSize={fontSize}
            fontWeight={fontWeight}
            fontStyle={fontStyle}
            letterSpacing={letterSpacing}
            xmlSpace="preserve"
          >
            {line.text}
          </text>
        ))}
      </g>

      {showHand && nib ? (
        <g
          transform={`translate(${nib.x} ${nib.y}) rotate(${rotation.toFixed(2)}) scale(${handSize.toFixed(4)})`}
        >
          {handSrc ? (
            // Same box as the bundled art: 400x350 with the nib at (0, 0).
            <image href={handSrc} x={-46} y={-306} width={400} height={350} />
          ) : (
            <HandPen penColor={penColor ?? color} />
          )}
        </g>
      ) : null}
    </svg>
  );
};

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export default WhiteboardWriting;
