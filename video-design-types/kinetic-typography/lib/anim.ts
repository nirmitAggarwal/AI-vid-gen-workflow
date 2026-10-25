// Animation vocabulary — Kinetic Typography.
// Type moves like it is being shouted: fast slam-ins with overshoot, scale
// punches on landing, letter-spacing settles, hard wipes. No soft fades for
// headlines. Everything is seeded and deterministic.

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

/** Stagger delay for the i-th sibling (word cascade). */
export const stagger = (i: number, step: number = THEME.motion.stagger): number => i * step;

/** Character stagger — denser than the word cascade. */
export const charStagger = (i: number): number => i * THEME.motion.charStagger;

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

/** Linear 0→1 over a window — for wipes and swipes that must not ease. */
export const useLinear = (delay = 0, duration = 8): number => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return interpolate(frame, [frames(delay, fps), frames(delay + duration, fps)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
};

/**
 * Slam-in: the word arrives from below (or above) fast, overshoots slightly
 * and locks. The overshoot is the spring passing 1 — that's the punch.
 */
export const useSlam = (
  delay = 0,
  opts: { dy?: number; from?: "bottom" | "top" | "left" | "right" } = {}
): { opacity: number; transform: string } => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { dy = 64, from = "bottom" } = opts;
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
  const opacity = interpolate(local, [0, frames(3, fps)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const off = 1 - Math.min(p, 1.0001);
  const x = from === "left" ? -off * dy : from === "right" ? off * dy : 0;
  const y = from === "bottom" ? off * dy : from === "top" ? -off * dy : 0;
  return {
    opacity,
    transform: `translate(${x.toFixed(2)}px, ${y.toFixed(2)}px) scale(${(0.94 + 0.06 * Math.min(p, 1.06)).toFixed(4)})`,
  };
};

/**
 * Scale punch — 1 → `amp` → 1 over `punchFrames`. Apply on landing to make
 * an impact beat. Returns a transform string (compose with your own motion).
 */
export const usePunch = (at: number, amp = 0.12): string => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const start = frames(at, fps);
  const len = frames(THEME.motion.punchFrames, fps);
  const t = interpolate(frame, [start, start + len / 2, start + len], [0, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASING,
  });
  return `scale(${(1 + amp * t).toFixed(4)})`;
};

/**
 * Letter-spacing settle: type breathes in from wide tracking to its final
 * tracking over `THEME.motion.trackingDuration`.
 */
export const useTrack = (
  delay = 0,
  from = 0.34,
  to = THEME.fonts.headingLetterSpacing
): { opacity: number; letterSpacing: string } => {
  const p = useProgress(delay, THEME.motion.trackingDuration);
  const fromEm = typeof from === "number" ? from : 0.34;
  const toEm = typeof to === "number" ? to : -0.01;
  return {
    opacity: interpolate(p, [0, 0.35], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
    letterSpacing: `${(fromEm + (toEm - fromEm) * p).toFixed(4)}em`,
  };
};

/** Hard wipe — clip-path inset reveal. Cuts, never fades. */
export const useWipe = (delay = 0, duration = 8, dir: "left" | "right" | "up" | "down" = "left"): string => {
  const p = useLinear(delay, duration);
  const gone = ((1 - p) * 100).toFixed(2);
  switch (dir) {
    case "right":
      return `inset(0 ${gone}% 0 0)`;
    case "up":
      return `inset(${gone}% 0 0 0)`;
    case "down":
      return `inset(0 0 ${gone}% 0)`;
    default:
      return `inset(0 0 0 ${gone}%)`;
  }
};

/**
 * Hard cut-in: appears at `delay` with zero fade — the headline default for
 * `editorial` mode. Before the delay it is invisible; after, fully present.
 */
export const useCut = (delay = 0): { opacity: 0 | 1; visibility: "hidden" | "visible" } => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const on = frame >= frames(delay, fps);
  return { opacity: on ? 1 : 0, visibility: on ? "visible" : "hidden" };
};

/** Continuous marquee scroll — x offset in px, wraps by `span`. */
export const useMarquee = (span: number, speed = 2.4, dir: 1 | -1 = -1): number => {
  const frame = useCurrentFrame();
  if (span <= 0) return 0;
  const raw = ((frame * speed) % span) * dir;
  return dir === -1 ? -((frame * speed) % span) : raw;
};

/** Slow deterministic drift for watermark/ghost layers across the hold. */
export const useDrift = (seed = 0): number => {
  const frame = useCurrentFrame();
  const t = frame / 30;
  const r = rng(seed * 97 + 13);
  const dir = r() > 0.5 ? 1 : -1;
  return Math.sin(t * 0.6 + seed) * THEME.motion.watermarkDrift * dir;
};

// ------------------------------------------------------------- type fitting

/**
 * Deterministic display size: clamp so a word nearly fills the frame without
 * clipping. Character-count based (no DOM measuring) — identical every render.
 */
export const fitSize = (
  text: string,
  maxWidth: number,
  max: number = THEME.type.hugeMax,
  min: number = THEME.type.hugeMin,
  ratio: number = THEME.type.charRatio,
  maxLines = 3
): number => {
  const lines = text.split("\n");
  const longest = lines.reduce((a, b) => (b.length > a.length ? b : a), "");
  const lineCount = Math.max(1, Math.min(maxLines, lines.length));
  const byWidth = longest.length > 0 ? maxWidth / (longest.length * ratio) : max;
  return Math.max(min, Math.min(max, byWidth, (maxWidth / lineCount) * (1 / THEME.type.wordRatio)));
};

/** Deterministic word wrap — character-count based, identical every render. */
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

/** Split into chars for character-level cascades (keeps spaces). */
export const chars = (text: string): string[] => Array.from(text);

/**
 * Accent lookup: given a line's text and the indexes of the stressed word,
 * returns which words should be coloured. Data-driven keyword emphasis.
 */
export const isKeyword = (wordIndex: number, keywords: number[] | undefined): boolean =>
  Array.isArray(keywords) && keywords.includes(wordIndex);
