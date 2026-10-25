// Animation vocabulary — Technical Sketchnotes.
//
// Everything here is frame-driven and deterministic: the same scene data
// draws the same wobble on every render. Durations are authored at 30fps and
// scaled with `frames()` so a project at another fps stays in sync.

import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { THEME } from "../tokens";

const EASE = THEME.motion.easing as unknown as [number, number, number, number];
const DRAW_EASE = THEME.motion.drawEasing as unknown as [number, number, number, number];
const EASING = Easing.bezier(...EASE);
const DRAW_EASING = Easing.bezier(...DRAW_EASE);

/** Scale a 30fps theme duration to the project fps. */
export const frames = (n: number, fps: number): number => Math.round((n * fps) / 30);

/** Deterministic PRNG (mulberry32). Same seed → same hand-drawn shape. */
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

/** Stagger delay (frames) for the i-th sibling element. */
export const stagger = (i: number, step: number = THEME.motion.stagger): number => i * step;

/** Eased 0→1 progress for something that starts at `delay` (30fps units). */
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
 * Stroke reveal props for an SVG path. `pathLength={1}` normalises the path,
 * so no getTotalLength() call is needed and rendering stays deterministic.
 */
export const drawOn = (p: number): { pathLength: number; strokeDasharray: number; strokeDashoffset: number } => {
  const c = Math.min(1, Math.max(0, p));
  return { pathLength: 1, strokeDasharray: 1, strokeDashoffset: 1 - c };
};

/** Draw-on props at a given delay — spreads onto a `<path>`. */
export const useDraw = (delay = 0, duration?: number) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const d = duration ?? THEME.motion.drawDuration;
  const p = interpolate(frame, [frames(delay, fps), frames(delay + d, fps)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: DRAW_EASING,
  });
  return drawOn(p);
};

/** Spring pop for stamps, circled numbers and callouts (0.6 → 1). */
export const usePop = (delay = 0, from = 0.6): number => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
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
  return interpolate(s, [0, 1], [from, 1]);
};

/** Fade + small rise entrance (the everyday entrance). */
export const useEnter = (delay = 0, distance = 18) => {
  const p = useProgress(delay);
  return {
    opacity: p,
    transform: `translateY(${((1 - p) * distance).toFixed(2)}px)`,
  } as const;
};

// ---------------------------------------------------------------- geometry

type Pt = [number, number];

const mid = (a: Pt, b: Pt): Pt => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];

/** Smooth closed shape through points (quadratics anchored at midpoints). */
export const closedPath = (pts: Pt[]): string => {
  const n = pts.length;
  if (n < 3) return "";
  const start = mid(pts[n - 1], pts[0]);
  let d = `M ${start[0].toFixed(2)} ${start[1].toFixed(2)}`;
  for (let i = 0; i < n; i++) {
    const p = pts[i];
    const m = mid(p, pts[(i + 1) % n]);
    d += ` Q ${p[0].toFixed(2)} ${p[1].toFixed(2)} ${m[0].toFixed(2)} ${m[1].toFixed(2)}`;
  }
  return `${d} Z`;
};

/** Smooth open stroke through points. */
export const openPath = (pts: Pt[]): string => {
  if (pts.length < 2) return "";
  let d = `M ${pts[0][0].toFixed(2)} ${pts[0][1].toFixed(2)}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const [cx, cy] = pts[i];
    const [nx, ny] = pts[i + 1];
    d += ` Q ${cx.toFixed(2)} ${cy.toFixed(2)} ${mid([cx, cy], [nx, ny])[0].toFixed(2)} ${mid([cx, cy], [nx, ny])[1].toFixed(2)}`;
  }
  const last = pts[pts.length - 1];
  d += ` L ${last[0].toFixed(2)} ${last[1].toFixed(2)}`;
  return d;
};

/** Hand-drawn rectangle: coherent corners, gently wobbling edges. */
export const roughRect = (x: number, y: number, w: number, h: number, seed = 1, amp: number = THEME.sketchnote.wobble, segs = 4): string => {
  const r = rng(seed);
  const jitter = () => (r() * 2 - 1) * amp;
  const pts: Pt[] = [];
  const edge = (x1: number, y1: number, x2: number, y2: number) => {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const len = Math.hypot(dx, dy) || 1;
    const nx = -dy / len;
    const ny = dx / len;
    for (let i = 0; i < segs; i++) {
      const t = i / segs;
      const off = jitter();
      pts.push([x1 + dx * t + nx * off, y1 + dy * t + ny * off]);
    }
  };
  edge(x, y, x + w, y);
  edge(x + w, y, x + w, y + h);
  edge(x + w, y + h, x, y + h);
  edge(x, y + h, x, y);
  return closedPath(pts);
};

/** Hand-drawn straight stroke between two points. */
export const roughLine = (x1: number, y1: number, x2: number, y2: number, seed = 2, amp: number = THEME.sketchnote.wobble, segs = 5): string => {
  const r = rng(seed);
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len;
  const ny = dx / len;
  const pts: Pt[] = [[x1, y1]];
  for (let i = 1; i < segs; i++) {
    const t = i / segs;
    const off = (r() * 2 - 1) * amp;
    pts.push([x1 + dx * t + nx * off, y1 + dy * t + ny * off]);
  }
  pts.push([x2, y2]);
  return openPath(pts);
};

/** Slightly wobbly ellipse (for circled numbers and annotations). */
export const roughEllipse = (cx: number, cy: number, rx: number, ry: number, seed = 3, amp: number = THEME.sketchnote.wobble): string => {
  const r = rng(seed);
  const pts: Pt[] = [];
  const n = 14;
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const off = (r() * 2 - 1) * amp;
    pts.push([cx + Math.cos(a) * (rx + off), cy + Math.sin(a) * (ry + off)]);
  }
  return closedPath(pts);
};

/** Loose marker underline, drawn left to right. */
export const roughUnderline = (x: number, y: number, w: number, seed = 4, amp = 3): string => {
  const r = rng(seed);
  const pts: Pt[] = [];
  const n = 7;
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    pts.push([x + w * t, y + (r() * 2 - 1) * amp + Math.sin(t * Math.PI) * amp * 0.6]);
  }
  return openPath(pts);
};

export type ArrowGeom = {
  shaft: string;
  head: string;
  /** Point at t=0.5 of the shaft — where a connector label sits. */
  mid: Pt;
  box: { x: number; y: number; w: number; h: number };
};

/**
 * Curved hand-drawn arrow with a two-stroke head.
 * `curve` bends the shaft perpendicular to the line (fraction of length).
 */
export const roughArrow = (
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  seed = 5,
  curve = 0.14,
  head = THEME.sketchnote.arrowHead
): ArrowGeom => {
  const r = rng(seed);
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len;
  const ny = dx / len;
  const bend = (r() > 0.5 ? 1 : -1) * curve * len;
  const ctrl: Pt = [x1 + dx * 0.5 + nx * bend, y1 + dy * 0.5 + ny * bend];

  // Sample the quadratic so the shaft wobbles the way a pen does.
  const pts: Pt[] = [];
  const n = 7;
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const mt = 1 - t;
    const px = mt * mt * x1 + 2 * mt * t * ctrl[0] + t * t * x2;
    const py = mt * mt * y1 + 2 * mt * t * ctrl[1] + t * t * y2;
    const off = i === 0 || i === n ? 0 : (r() * 2 - 1) * THEME.sketchnote.wobble;
    pts.push([px + nx * off, py + ny * off]);
  }

  // Tangent at t=1 sets the head direction: 2·(P2 − control).
  const tx = 2 * (x2 - ctrl[0]);
  const ty = 2 * (y2 - ctrl[1]);
  const tl = Math.hypot(tx, ty) || 1;
  const ux = tx / tl;
  const uy = ty / tl;
  const spread = 0.48;
  const left: Pt = [x2 - (ux * Math.cos(spread) - uy * Math.sin(spread)) * head, y2 - (uy * Math.cos(spread) + ux * Math.sin(spread)) * head];
  const right: Pt = [x2 - (ux * Math.cos(-spread) - uy * Math.sin(-spread)) * head, y2 - (uy * Math.cos(-spread) + ux * Math.sin(-spread)) * head];

  const pad = THEME.sketchnote.wobble * 3 + head;
  const xs = [x1, x2, ctrl[0], left[0], right[0]];
  const ys = [y1, y2, ctrl[1], left[1], right[1]];
  const minX = Math.min(...xs) - pad;
  const minY = Math.min(...ys) - pad;
  const maxX = Math.max(...xs) + pad;
  const maxY = Math.max(...ys) + pad;

  const midPt: Pt = [0.25 * x1 + 0.5 * ctrl[0] + 0.25 * x2, 0.25 * y1 + 0.5 * ctrl[1] + 0.25 * y2];

  return {
    shaft: openPath(pts),
    head: `M ${left[0].toFixed(2)} ${left[1].toFixed(2)} L ${x2.toFixed(2)} ${y2.toFixed(2)} L ${right[0].toFixed(2)} ${right[1].toFixed(2)}`,
    mid: midPt,
    box: { x: minX, y: minY, w: maxX - minX, h: maxY - minY },
  };
};

/**
 * Deterministic font-size estimate so a headline never overflows its column.
 * `ratio` = average glyph width as a fraction of the font size (handwriting ≈ 0.5).
 */
export const fitSize = (
  text: string,
  maxWidth: number,
  max: number,
  min: number,
  ratio = 0.5,
  maxLines = 2
): number => {
  const longest = text.split("\n").reduce((a, b) => (b.length > a.length ? b : a), "");
  const lines = Math.max(1, Math.min(maxLines, text.split("\n").length));
  const byWidth = longest.length > 0 ? maxWidth / (longest.length * ratio) : max;
  return Math.max(min, Math.min(max, byWidth, (maxWidth / lines) * 1.6));
};

/** Semantic tone → { ink, wash } using the style's own palette. */
export type Tone = "default" | "info" | "success" | "decision" | "ai" | "error";

export const tone = (t: Tone = "default"): { ink: string; wash: string } => {
  switch (t) {
    case "info":
      return { ink: THEME.colors.accent, wash: THEME.colors.highlightBlue };
    case "success":
      return { ink: THEME.colors.mint, wash: THEME.colors.highlightGreen };
    case "decision":
      return { ink: THEME.colors.accentAlt, wash: THEME.colors.highlightYellow };
    case "ai":
      return { ink: THEME.colors.lavender, wash: THEME.colors.highlightViolet };
    case "error":
      return { ink: THEME.colors.coral, wash: THEME.colors.highlightCoral };
    default:
      return { ink: THEME.colors.text, wash: THEME.colors.surfaceAlt };
  }
};