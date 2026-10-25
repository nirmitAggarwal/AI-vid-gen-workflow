// Animation vocabulary — Paper Collage.
// Paper moves like paper: it slides into place, lands with a restrained
// overshoot, and stacks in depth order. Everything is seeded and deterministic.

import type { CSSProperties } from "react";
import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { THEME } from "../tokens";

const EASE = THEME.motion.easing as unknown as [number, number, number, number];
const EASING = Easing.bezier(...EASE);

/** Scale a 30fps theme duration to the project fps. */
export const frames = (n: number, fps: number): number => Math.round((n * fps) / 30);

/** Deterministic PRNG (mulberry32). */
export const rng = (seed: number): (() => number) => {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

/** Stagger delay for the i-th sibling. */
export const stagger = (i: number, step: number = THEME.motion.stagger): number => i * step;

/** Layer-aware delay: deeper layers arrive first. */
export const layerDelay = (depth: number, index: number): number =>
  6 + depth * THEME.motion.stagger * 2 + stagger(index);

/** Eased 0→1 progress starting at `delay`. */
export const useProgress = (delay = 0, duration: number = THEME.motion.durations.enter): number => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return interpolate(frame, [frames(delay, fps), frames(delay + duration, fps)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASING,
  });
};

/**
 * Paper placement: slide in from (dx, dy) with an extra spin, land on `rot`
 * with the theme's spring settle. Returns a transform/opacity style.
 */
export const usePlace = (
  delay = 0,
  opts: { dx?: number; dy?: number; rot?: number; spin?: number } = {}
): { opacity: number; transform: string } => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { dx = 0, dy = 48, rot = 0, spin = rot + 7 } = opts;
  const local = Math.max(0, frame - frames(delay, fps));
  const s = spring({
    frame: local,
    fps,
    config: {
      damping: THEME.motion.spring.damping,
      stiffness: THEME.motion.spring.stiffness,
      mass: THEME.motion.spring.mass,
    },
    durationInFrames: frames(THEME.motion.durations.enter, fps),
  });
  const p = s; // spring may exceed 1 — that overshoot is the paper settling
  const opacity = interpolate(local, [0, frames(7, fps)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const angle = (1 - p) * spin + p * rot;
  return {
    opacity,
    transform: `translate(${((1 - p) * dx).toFixed(2)}px, ${((1 - p) * dy).toFixed(2)}px) rotate(${angle.toFixed(3)}deg)`,
  };
};

/** Simple fade + rise (for text that should not spin). */
export const useEnter = (delay = 0, distance = 24): { opacity: number; transform: string } => {
  const p = useProgress(delay);
  return { opacity: p, transform: `translateY(${((1 - p) * distance).toFixed(2)}px)` };
};

/** Slow deterministic drift for background layers across the hold. */
export const useDrift = (depth: number): number => {
  const frame = useCurrentFrame();
  if (depth > 1) return 0;
  const t = frame / 30;
  return Math.sin(t * 0.5) * THEME.motion.drift * (depth === 0 ? 1 : 0.5);
};

// ------------------------------------------------------------ paper edges

const has = (v: boolean | undefined): boolean => v === true;

/**
 * CSS `clip-path: polygon()` with torn edges on the requested sides.
 * Sampled every `tornStep` px with depth up to `tornDepth` — irregular, but
 * seeded, so the same piece tears identically on every render.
 */
export const tornPolygon = (
  w: number,
  h: number,
  seed = 1,
  sides: { t?: boolean; r?: boolean; b?: boolean; l?: boolean } = { t: true, b: true }
): string => {
  const r = rng(seed);
  const depth = THEME.paper.tornDepth;
  const step = THEME.paper.tornStep;
  const bite = (on: boolean, amp: number): number => (on ? (0.35 + r() * 0.65) * amp : 0);
  const pts: string[] = [];

  const nx = Math.max(2, Math.round(w / step));
  const ny = Math.max(2, Math.round(h / step));

  for (let i = 0; i <= nx; i++) pts.push(`${((i / nx) * w).toFixed(1)}px ${bite(has(sides.t), depth).toFixed(1)}px`);
  for (let i = 1; i <= ny; i++) pts.push(`${(w - bite(has(sides.r), depth)).toFixed(1)}px ${((i / ny) * h).toFixed(1)}px`);
  for (let i = nx - 1; i >= 0; i--) pts.push(`${((i / nx) * w).toFixed(1)}px ${(h - bite(has(sides.b), depth)).toFixed(1)}px`);
  for (let i = ny - 1; i >= 1; i--) pts.push(`${bite(has(sides.l), depth).toFixed(1)}px ${((i / ny) * h).toFixed(1)}px`);

  return `polygon(${pts.join(", ")})`;
};

/** Procedural paper tooth — two fine crossing gradients, no raster texture. */
export const grainCss = (opacity: number = THEME.paper.grainOpacity): CSSProperties => ({
  backgroundImage: [
    `repeating-linear-gradient(47deg, rgba(41,43,50,${opacity}) 0 1px, transparent 1px 3px)`,
    `repeating-linear-gradient(-41deg, rgba(41,43,50,${opacity * 0.7}) 0 1px, transparent 1px 4px)`,
  ].join(", "),
});

/** Paper stock lookup — keeps scene code about composition, not hex values. */
export type Stock = "cream" | "white" | "kraft" | "blue" | "terracotta" | "mustard" | "ink" | "sage";

export const stock = (s: Stock): string => {
  switch (s) {
    case "white":
      return THEME.colors.warmWhite;
    case "kraft":
      return THEME.colors.kraft;
    case "blue":
      return THEME.colors.mutedBlue;
    case "terracotta":
      return THEME.colors.terracotta;
    case "mustard":
      return THEME.colors.mustard;
    case "ink":
      return THEME.colors.ink;
    case "sage":
      return THEME.colors.sage;
    default:
      return THEME.colors.cream;
  }
};

/** Readable ink colour for a given stock (light papers get dark ink). */
export const inkOn = (s: Stock): string =>
  s === "ink" ? THEME.colors.warmWhite : THEME.colors.ink;

/** Deterministic headline size so long titles wrap instead of clipping. */
export const fitSize = (text: string, maxWidth: number, max: number, min: number, ratio = 0.52, maxLines = 3): number => {
  const lines = text.split("\n");
  const longest = lines.reduce((a, b) => (b.length > a.length ? b : a), "");
  const lineCount = Math.max(1, Math.min(maxLines, lines.length));
  const byWidth = longest.length > 0 ? maxWidth / (longest.length * ratio) : max;
  return Math.max(min, Math.min(max, byWidth * 1.05, (maxWidth / lineCount) * 1.5));
};

/**
 * Deterministic word wrap. Character-count based (no DOM measuring) so the
 * result is identical on every render; `ratio` tunes it per typeface.
 */
export const wrapText = (text: string, maxChars: number): string[] => {
  const out: string[] = [];
  for (const para of text.split("\n")) {
    const words = para.split(/\s+/).filter(Boolean);
    if (!words.length) {
      out.push("");
      continue;
    }
    let line = "";
    for (const w of words) {
      const t = line ? `${line} ${w}` : w;
      if (t.length > maxChars && line) {
        out.push(line);
        line = w;
      } else {
        line = t;
      }
    }
    if (line) out.push(line);
  }
  return out;
};