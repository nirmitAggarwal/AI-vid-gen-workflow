// Animation vocabulary — Line Art Illustration.
// Motion is a pen: strokes draw on with a soft landing, dotted trails march
// between steps, drawn groups breathe during holds. Deterministic throughout.

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
 * Draw-on state for an SVG path: returns `pathLength` + dash props so the
 * stroke grows from one end to the other, like a pen.
 */
export const drawOn = (p: number): { pathLength: number; strokeDasharray: number; strokeDashoffset: number } => ({
  pathLength: 1,
  strokeDasharray: 1,
  strokeDashoffset: 1 - Math.min(1, Math.max(0, p)),
});

/** Draw-on progress with the pen easing applied. */
export const useDraw = (delay = 0, duration: number = THEME.motion.drawFrames): { pathLength: number; strokeDasharray: number; strokeDashoffset: number } =>
  drawOn(useProgress(delay, duration));

/**
 * Marching dash offset for dotted trails — advances forever so the trail
 * flows between steps during the whole hold.
 */
export const useTrail = (delay = 0): number => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const started = frame >= frames(delay, fps);
  if (!started) return 0;
  return -((frame / THEME.motion.dashMarch) * 24);
};

/** Gentle breathing float for drawn groups — amplitude in px. */
export const useFloat = (delay: number = THEME.lineArt.floatDelay, seed = 0): string => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < frames(delay, fps)) return "translateY(0px)";
  const t = (frame - frames(delay, fps)) / THEME.motion.floatPeriod;
  const phase = (seed % 7) * 0.9;
  return `translateY(${(Math.sin(t * Math.PI * 2 + phase) * THEME.motion.floatAmp).toFixed(2)}px)`;
};

/** Soft settle — draws attention without slamming (damping 30). */
export const useSettle = (delay = 0, distance = 14): { opacity: number; transform: string } => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
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
  const opacity = interpolate(local, [0, frames(8, fps)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return { opacity, transform: `translateY(${((1 - p) * distance).toFixed(2)}px)` };
};

/** Quiet fade + rise for captions and labels. */
export const useFade = (delay = 0, distance = 10): { opacity: number; transform: string } => {
  const p = useProgress(delay, 12);
  return { opacity: p, transform: `translateY(${((1 - p) * distance).toFixed(2)}px)` };
};

/**
 * Pop for teal accent marks (checks, dots): scale 0.6 → 1.05 → 1 with the
 * gentle spring — the most overshoot this style ever allows.
 */
export const usePop = (delay = 0): string => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = Math.max(0, frame - frames(delay, fps));
  const p = spring({
    frame: local,
    fps,
    config: { damping: THEME.motion.spring.damping, stiffness: THEME.motion.spring.stiffness, mass: THEME.motion.spring.mass },
    durationInFrames: frames(14, fps),
  });
  return `scale(${(0.6 + 0.4 * p).toFixed(4)})`;
};

// ------------------------------------------------------------- type fitting

/** Deterministic headline size — clamps to the line-art headline range. */
export const fitSize = (
  text: string,
  maxWidth: number,
  max: number = THEME.lineArt.headlineMax,
  min: number = THEME.lineArt.headlineMin,
  ratio: number = THEME.lineArt.charRatio,
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

/** Curved arrow path from a → b with a bow (quadratic bezier), arrowhead included. */
export const curvedArrow = (
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  bow = 40
): { shaft: string; head: [number, number, number, number, number, number] } => {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy) || 1;
  const cx = mx - (dy / len) * bow;
  const cy = my + (dx / len) * bow;

  // Tangent at the end of a quadratic bezier is (end - control).
  const tx = x2 - cx;
  const ty = y2 - cy;
  const tlen = Math.hypot(tx, ty) || 1;
  const ux = tx / tlen;
  const uy = ty / tlen;
  const px = -uy;
  const py = ux;
  const head = 16;
  const spread = 0.5;
  const h1x = x2 - (ux * Math.cos(spread) - px * Math.sin(spread)) * head;
  const h1y = y2 - (uy * Math.cos(spread) - py * Math.sin(spread)) * head;
  const h2x = x2 - (ux * Math.cos(spread) + px * Math.sin(spread)) * head;
  const h2y = y2 - (uy * Math.cos(spread) + py * Math.sin(spread)) * head;

  return { shaft: `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`, head: [x2, y2, h1x, h1y, h2x, h2y] };
};
