// Animation vocabulary — Editorial Magazine.
// Type is set, not thrown: baseline mask reveals, rules that draw across the
// measure, columns that cascade in reading order. Critically damped motion —
// nothing overshoots. Everything is seeded and deterministic.

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

/** Stagger delay for the i-th sibling (column / line cascade). */
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

/** Linear 0→1 — for rules and wipes that must run at constant speed. */
export const useLinear = (delay = 0, duration: number = THEME.motion.ruleFrames): number => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return interpolate(frame, [frames(delay, fps), frames(delay + duration, fps)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
};

/**
 * Baseline mask reveal — the headline sits inside a clipped box and rises into
 * it, the way a line of type is pulled up onto the page. THE headline move.
 */
export const useMaskReveal = (
  delay = 0,
  duration: number = THEME.motion.revealFrames,
  dir: "up" | "down" = "up"
): { clipPath: string; transform: string; opacity: number } => {
  const p = useProgress(delay, duration);
  const hidden = (1 - p) * 100;
  const clip = dir === "up" ? `inset(0 0 ${hidden.toFixed(2)}% 0)` : `inset(${hidden.toFixed(2)}% 0 0 0)`;
  return {
    clipPath: clip,
    transform: `translateY(${((dir === "up" ? 1 : -1) * (1 - p) * 18).toFixed(2)}px)`,
    opacity: interpolate(p, [0, 0.2], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
  };
};

/** Rule grows left → right. Thin first, thick second — magazine rhythm. */
export const useRuleGrow = (delay = 0, duration: number = THEME.motion.ruleFrames): string => {
  const p = useLinear(delay, duration);
  return `scaleX(${p.toFixed(4)})`;
};

/** Top-down wipe for photo blocks. */
export const usePhotoWipe = (delay = 0, duration = 12): string => {
  const p = useProgress(delay, duration);
  return `inset(0 0 ${((1 - p) * 100).toFixed(2)}% 0)`;
};

/**
 * Column cascade: blocks settle in place with a small rise — critically
 * damped spring, no overshoot (magazine pages don't bounce).
 */
export const useSettle = (delay = 0, distance = 16): { opacity: number; transform: string } => {
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

/** Quiet fade for captions and folios — support matter only. */
export const useFade = (delay = 0): number => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return interpolate(frame, [frames(delay, fps), frames(delay + 8, fps)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
};

// ------------------------------------------------------------- type fitting

/** Deterministic headline size — clamps to the magazine's headline range. */
export const fitSize = (
  text: string,
  maxWidth: number,
  max: number = THEME.magazine.headlineMax,
  min: number = THEME.magazine.headlineMin,
  ratio: number = THEME.magazine.charRatio,
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

/** Split wrapped lines into N balanced columns (reading order). */
export const toColumns = (text: string, maxChars: number, cols: number = THEME.layout.columns): string[][] => {
  const lines = wrapText(text, maxChars);
  const per = Math.ceil(lines.length / Math.max(1, cols));
  const out: string[][] = [];
  for (let i = 0; i < lines.length; i += per) out.push(lines.slice(i, i + per));
  return out;
};

/** First word of a paragraph (for drop-cap extraction). */
export const splitDropCap = (text: string, letters = 3): { cap: string; rest: string } => {
  const words = text.trim().split(/\s+/);
  if (!words.length) return { cap: "", rest: text };
  let head = words[0];
  const cap = head.slice(0, Math.min(letters, Math.max(1, head.length - 1)));
  head = head.slice(cap.length);
  const rebuilt = [head, ...words.slice(1)].join(" ");
  return { cap, rest: rebuilt };
};
