// Animation vocabulary — Scrapbook.
// Things DROP onto the page: a quick fall, a gentle bounce, a settle at a
// casual angle. Tape wipes, stickers spin, stitches draw, holds sway.
// Seeded and deterministic throughout.

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

/** Seeded resting angle for a piece — the ±`range` degrees casual tilt. */
export const tilt = (seed: number, range = 4): number => {
  const r = rng(seed * 13 + 5);
  return (r() * 2 - 1) * range;
};

/** Stagger delay for the i-th sibling. */
export const stagger = (i: number, step: number = THEME.motion.stagger): number => i * step;

/** Eased 0→1 progress starting at `delay` (curve itself overshoots). */
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
 * Drop-and-settle: the piece falls from `dropHeight` px, bounces once and
 * lands at `rot`. Returns transform + opacity for the piece.
 */
export const useDrop = (
  delay = 0,
  rot = 0,
  opts: { from?: number; dx?: number } = {}
): { opacity: number; transform: string } => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { from = THEME.motion.dropHeight, dx = 0 } = opts;
  const local = Math.max(0, frame - frames(delay, fps));
  const p = spring({
    frame: local,
    fps,
    config: {
      damping: THEME.motion.spring.damping,
      stiffness: THEME.motion.spring.stiffness,
      mass: THEME.motion.spring.mass,
    },
    durationInFrames: frames(THEME.motion.durations.enter, fps),
  });
  const opacity = interpolate(local, [0, frames(4, fps)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const y = (1 - p) * from;
  const x = (1 - p) * dx;
  const overshootRot = rot + (1 - p) * (rot >= 0 ? 6 : -6);
  return {
    opacity,
    transform: `translate(${x.toFixed(2)}px, ${y.toFixed(2)}px) rotate(${overshootRot.toFixed(3)}deg)`,
  };
};

/** Tape wipe: washi sticks down from one end. */
export const useTape = (delay = 0): { clipPath: string; opacity: number } => {
  const p = useProgress(delay, THEME.motion.tapeFrames);
  return {
    clipPath: `inset(0 ${((1 - p) * 100).toFixed(2)}% 0 0)`,
    opacity: interpolate(p, [0, 0.15], [0, THEME.scrap.tapeOpacity], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
  };
};

/**
 * Sticker pop: scales up while turning `stickerSpin` degrees into place —
 * then a tiny idle wobble keeps it alive during the hold.
 */
export const useSticker = (delay = 0, spin: number = THEME.motion.stickerSpin): string => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = Math.max(0, frame - frames(delay, fps));
  const p = spring({
    frame: local,
    fps,
    config: { damping: THEME.motion.spring.damping, stiffness: THEME.motion.spring.stiffness, mass: THEME.motion.spring.mass },
    durationInFrames: frames(16, fps),
  });
  const settle = Math.sin(Math.max(0, local - 16) / 26) * 1.2;
  return `scale(${(0.3 + 0.7 * p).toFixed(4)}) rotate(${((1 - p) * spin + settle).toFixed(2)}deg)`;
};

/**
 * Blanket-stitch draw-on: animates `stroke-dashoffset` from `gap` to 0 over
 * `stitchFrames` so the stitching sews itself along the edge.
 */
export const useStitch = (delay = 0): number => {
  const p = useProgress(delay, THEME.motion.stitchFrames);
  const gap = 480;
  return (1 - p) * gap;
};

/** Idle sway for holds — px offset on a slow sine. */
export const useSway = (delay = 0, seed = 0): string => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < frames(delay, fps)) return "translateY(0px)";
  const t = (frame - frames(delay, fps)) / THEME.motion.floatPeriod;
  const phase = (seed % 5) * 1.3;
  return `translateY(${(Math.sin(t * Math.PI * 2 + phase) * THEME.motion.floatAmp).toFixed(2)}px)`;
};

/** Gentle rise + fade for handwriting that should not bounce. */
export const useWrite = (delay = 0): { opacity: number; transform: string } => {
  const p = useProgress(delay, THEME.motion.durations.enter);
  return {
    opacity: p,
    transform: `translateY(${((1 - p) * 18).toFixed(2)}px)`,
  };
};

/** Paper corner lift — a subtle rotate+scale breathing for big pieces. */
export const useBreathe = (seed = 0): string => {
  const frame = useCurrentFrame();
  const t = frame / THEME.motion.floatPeriod;
  const r = rng(seed * 29 + 3);
  const phase = r() * Math.PI * 2;
  return `rotate(${(Math.sin(t * Math.PI * 2 + phase) * 0.5).toFixed(3)}deg)`;
};

// ------------------------------------------------------------- type fitting

/** Deterministic title size — clamps to the scrapbook title range. */
export const fitSize = (
  text: string,
  maxWidth: number,
  max: number = THEME.scrap.titleMax,
  min: number = THEME.scrap.titleMin,
  ratio: number = THEME.scrap.charRatio,
  maxLines = 3
): number => {
  const lines = text.split("\n");
  const longest = lines.reduce((a, b) => (b.length > a.length ? b : a), "");
  const lineCount = Math.max(1, Math.min(maxLines, lines.length));
  const byWidth = longest.length > 0 ? maxWidth / (longest.length * ratio) : max;
  return Math.max(min, Math.min(max, byWidth, (maxWidth / lineCount) * (1 / ratio)));
};

/** Deterministic wrap — character-count based, identical every render. */
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

/** Page grain — two fine crossing gradients, no raster texture. */
export const grainCss = (opacity: number = THEME.scrap.grainOpacity): { backgroundImage: string } => ({
  backgroundImage: [
    `repeating-linear-gradient(43deg, rgba(58,52,43,${opacity}) 0 1px, transparent 1px 3px)`,
    `repeating-linear-gradient(-37deg, rgba(58,52,43,${opacity * 0.7}) 0 1px, transparent 1px 4px)`,
  ].join(", "),
});
