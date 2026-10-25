// Animation vocabulary — Comic Book.
// Motion hits hard: panels bounce in, balloons pop, action words slam and
// shake the frame, speed lines streak forever. Seeded and deterministic.

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
 * Bouncy pop: scale 0.55 → 1 with a real overshoot, then locks. The default
 * entrance for panels, balloons and bursts.
 */
export const usePop = (delay = 0, from = 0.55): { transform: string; opacity: number } => {
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
  const opacity = interpolate(local, [0, frames(2, fps)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return { transform: `scale(${(from + (1 - from) * p).toFixed(4)})`, opacity };
};

/**
 * Action-word slam: arrives huge and shrinks to size over `slamFrames`,
 * rotating into its final tilt. Pair with `useShake` for the impact.
 */
export const useSlam = (delay = 0, rotate = -6, fromScale = 2.4): { transform: string; opacity: number } => {
  const p = useProgress(delay, THEME.motion.slamFrames);
  const scale = fromScale + (1 - fromScale) * p;
  const tilt = rotate * 1.8 + (rotate - rotate * 1.8) * p;
  return {
    transform: `scale(${scale.toFixed(4)}) rotate(${tilt.toFixed(2)}deg)`,
    opacity: interpolate(p, [0, 0.12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
  };
};

/**
 * Impact shake: decaying sine jitter in x/y (+ a little rotation).
 * Returns a transform to layer onto the whole frame. Amp → 0 over
 * `shakeFrames`.
 */
export const useShake = (at: number, seed = 1): string => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const start = frames(at + THEME.motion.slamFrames, fps);
  const len = frames(THEME.motion.shakeFrames, fps);
  const local = frame - start;
  if (local < 0 || local > len) return "translate(0px, 0px) rotate(0deg)";
  const decay = 1 - local / len;
  const r = rng(seed * 17 + 3);
  const j1 = r() * Math.PI * 2;
  const j2 = r() * Math.PI * 2;
  const amp = THEME.motion.shakeAmp * decay;
  const x = Math.sin(local * 2.1 + j1) * amp;
  const y = Math.cos(local * 2.7 + j2) * amp * 0.7;
  const rot = Math.sin(local * 1.7 + j1) * decay * 1.6;
  return `translate(${x.toFixed(2)}px, ${y.toFixed(2)}px) rotate(${rot.toFixed(3)}deg)`;
};

/** Balloon tail / body pop — arrives a beat after the balloon body. */
export const useTail = (delay: number): { transform: string; opacity: number } => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = Math.max(0, frame - frames(delay, fps));
  const p = spring({
    frame: local,
    fps,
    config: { damping: THEME.motion.spring.damping, stiffness: THEME.motion.spring.stiffness, mass: THEME.motion.spring.mass },
    durationInFrames: frames(THEME.motion.balloonPop, fps),
  });
  const opacity = interpolate(local, [0, frames(2, fps)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return { transform: `scale(${(0.2 + 0.8 * p).toFixed(4)})`, opacity };
};

/**
 * Speed-line offset — stripes streak across forever (cycles every
 * `speedPeriod` frames). Use as background-position or translateX.
 */
export const useSpeedLines = (delay = 0): number => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < frames(delay, fps)) return 0;
  return ((frame - frames(delay, fps)) / THEME.motion.speedPeriod) % THEME.comic.speedGap;
};

/** Seeded jagged burst polygon (shout starburst) in a w×h box. */
export const burstPolygon = (w: number, h: number, seed = 7, teeth: number = THEME.comic.burstTeeth): string => {
  const r = rng(seed);
  const pts: string[] = [];
  const cx = w / 2;
  const cy = h / 2;
  for (let i = 0; i < teeth; i++) {
    const outer = i % 2 === 0;
    const base = outer ? 0.98 : 0.68;
    const jitter = outer ? 1 : 0.86 + r() * 0.3;
    const a = (i / teeth) * Math.PI * 2 - Math.PI / 2;
    const rx = Math.cos(a) * cx * base * jitter;
    const ry = Math.sin(a) * cy * base * jitter;
    pts.push(`${(cx + rx).toFixed(1)}px ${(cy + ry).toFixed(1)}px`);
  }
  return `polygon(${pts.join(", ")})`;
};

/** Ben-Day halftone overlay — CSS dot grid, no raster assets. */
export const halftoneCss = (color: string = THEME.colors.black, opacity: number = THEME.comic.halftoneOpacity): CSSProperties => {
  const d = THEME.comic.halftoneDot;
  const s = THEME.comic.halftoneSize;
  return {
    backgroundImage: `radial-gradient(${color} ${s / 2}px, transparent ${s / 2}px)`,
    backgroundSize: `${d}px ${d}px`,
    opacity,
  };
};

/** Outlined action-word text style (stroke + hard ink shadow). */
export const actionTypeStyle = (fill: string, stroke: string = THEME.colors.black): CSSProperties => ({
  color: fill,
  WebkitTextStroke: `${THEME.comic.actionStroke}px ${stroke}`,
  paintOrder: "stroke fill",
  textShadow: `8px 8px 0 ${THEME.colors.black}`,
});

// ------------------------------------------------------------- type fitting

/** Deterministic size for words that must fill their box without clipping. */
export const fitSize = (
  text: string,
  maxWidth: number,
  max: number = THEME.comic.actionMax,
  min: number = THEME.comic.actionMin,
  ratio: number = THEME.comic.charRatio,
  maxLines = 2
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
