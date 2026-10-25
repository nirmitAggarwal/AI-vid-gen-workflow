// Animation vocabulary — Geometric Motion.
// Shapes travel on the grid with symmetrical ease-in-out and stop dead:
// bars grow from an edge, arcs rotate into place, orbits loop forever,
// numerals count up. Deterministic — no randomness in motion paths.

import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { THEME } from "../tokens";

const EASE = THEME.motion.easing as unknown as [number, number, number, number];
const EASING = Easing.bezier(...EASE);

/** Scale a 30fps theme duration to the project fps. */
export const frames = (n: number, fps: number): number => Math.round((n * fps) / 30);

/** Snap a coordinate to the Swiss grid unit. */
export const snap = (v: number): number => Math.round(v / THEME.layout.gridUnit) * THEME.layout.gridUnit;

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

/** Linear 0→1 over a window — for continuous, un-eased motion. */
export const useLinear = (delay = 0, duration = 10): number => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return interpolate(frame, [frames(delay, fps), frames(delay + duration, fps)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
};

/** Scale-in from 0 with a precise stop. Circles, dots, small marks. */
export const useScaleIn = (delay = 0, from = 0): { transform: string; opacity: number } => {
  const p = useProgress(delay);
  return {
    transform: `scale(${(from + (1 - from) * p).toFixed(4)})`,
    opacity: interpolate(p, [0, 0.25], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
  };
};

/**
 * Grow a bar/line from an edge: `dir` picks which edge it starts from.
 * Returns a transform + origin to place on the element.
 */
export const useGrow = (delay = 0, dir: "right" | "left" | "down" | "up" = "right"): { transform: string; transformOrigin: string } => {
  const p = useProgress(delay);
  const axis = dir === "right" || dir === "left" ? "X" : "Y";
  const origin =
    dir === "right" ? "left center" : dir === "left" ? "right center" : dir === "down" ? "center top" : "center bottom";
  return { transform: `scale${axis}(${p.toFixed(4)})`, transformOrigin: origin };
};

/**
 * Rotate into place: an arc/ring turns from `from` degrees to `to`.
 * After landing it keeps a slow constant rotation if `loop` is set.
 */
export const useRotateIn = (delay = 0, from = -90, to = 0, loop = false): string => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = useProgress(delay, THEME.motion.rotateFrames);
  const settled = from + (to - from) * p;
  if (!loop || p < 1) return `rotate(${settled.toFixed(3)}deg)`;
  const idle = ((frame - frames(delay + THEME.motion.rotateFrames, fps)) / THEME.motion.orbitPeriod) * 360;
  return `rotate(${(settled + idle).toFixed(3)}deg)`;
};

/** Continuous orbit — constant angular motion, never stops during the hold. */
export const useOrbit = (periodFrames: number = THEME.motion.orbitPeriod, offsetDeg = 0): number => {
  const frame = useCurrentFrame();
  return offsetDeg + (frame / periodFrames) * 360;
};

/**
 * Count-up numeral: 0 → `value` over `geo.countFrames`, eased, integers stay
 * integral. The signature data-as-motion move of this style.
 */
export const useCount = (value: number, delay = 0, duration: number = THEME.motion.countFrames): number => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = interpolate(frame, [frames(delay, fps), frames(delay + duration, fps)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASING,
  });
  const raw = value * p;
  return Number.isInteger(value) ? Math.round(raw) : Math.round(raw * 10) / 10;
};

/** Damped settle for labels and headlines — precise, no visible overshoot. */
export const useSettle = (delay = 0, distance = 20): { opacity: number; transform: string } => {
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
  const opacity = interpolate(local, [0, frames(6, fps)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return { opacity, transform: `translateY(${((1 - p) * distance).toFixed(2)}px)` };
};

// ------------------------------------------------------------- type fitting

/** Deterministic headline size — clamps to the geometric headline range. */
export const fitSize = (
  text: string,
  maxWidth: number,
  max: number = THEME.geo.headlineMax,
  min: number = THEME.geo.headlineMin,
  ratio: number = THEME.geo.charRatio,
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
