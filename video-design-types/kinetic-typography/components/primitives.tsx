// Kinetic Typography — drawing kit.
// Type-first primitives: slammed words, char cascades, ghost words, accent
// blocks, underline swipes, tickers, flash frames. All motion is seeded and
// deterministic; keywords are data, not hardcoded colours.

import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { THEME } from "../tokens";
import {
  chars,
  charStagger,
  fitSize,
  frames,
  rng,
  stagger,
  useDrift,
  useMarquee,
  useProgress,
  usePunch,
  useSlam,
  useTrack,
  useWipe,
} from "../lib/anim";

// ------------------------------------------------------------ ghost layers

/** Giant watermark word behind everything — 7% opacity, slow drift. */
export const GhostWord: React.FC<{
  text: string;
  delay?: number;
  size?: number;
  color?: string;
  seed?: number;
  top?: number;
}> = ({ text, delay = 0, size = 460, color = THEME.colors.text, seed = 1, top }) => {
  const drift = useDrift(seed);
  const p = useProgress(delay, THEME.motion.durations.enter);
  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: top ?? Math.round(THEME.layout.safeMargin * 3),
        transform: `translateX(calc(-50% + ${drift.toFixed(2)}px))`,
        opacity: THEME.type.watermarkOpacity * p,
        fontFamily: THEME.fonts.heading,
        fontWeight: THEME.fonts.headingWeight,
        fontSize: size,
        lineHeight: 1,
        letterSpacing: THEME.fonts.headingLetterSpacing,
        color,
        whiteSpace: "nowrap",
        pointerEvents: "none",
        userSelect: "none",
      }}
    >
      {text}
    </div>
  );
};

/** Outlined ghost word — transparent fill, white stroke. Editorial layer. */
export const OutlinedWord: React.FC<{
  text: string;
  size?: number;
  delay?: number;
  color?: string;
  strokeWidth?: number;
  rotate?: number;
  top?: number;
  left?: number;
}> = ({ text, size = 190, delay = 0, color = THEME.colors.text, strokeWidth = THEME.type.outlineStroke, rotate = 0, top, left }) => {
  const cut = useWipe(delay, 9, "left");
  return (
    <div
      style={{
        position: "absolute",
        left: left ?? THEME.layout.safeMargin,
        top: top ?? 0,
        clipPath: cut,
        fontFamily: THEME.fonts.heading,
        fontWeight: THEME.fonts.headingWeight,
        fontSize: fitSize(text, THEME.layout.maxTextWidth, size, THEME.type.hugeMin, THEME.type.charRatio, 2),
        lineHeight: THEME.fonts.lineHeights.heading,
        letterSpacing: THEME.fonts.headingLetterSpacing,
        color: "transparent",
        WebkitTextStroke: `${strokeWidth}px ${color}`,
        transform: `rotate(${rotate}deg)`,
        whiteSpace: "nowrap",
        pointerEvents: "none",
      }}
    >
      {text}
    </div>
  );
};

// --------------------------------------------------------------- words

/**
 * A single word that slams in and punches on landing. Optionally sits on an
 * accent block that wipes in first.
 */
/** Slam-in word props. */
type SlamWordProps = {
  text: string;
  delay?: number;
  color?: string;
  size?: number;
  block?: boolean;
  blockColor?: string;
  rotate?: number;
  from?: "bottom" | "top" | "left" | "right";
  index?: number;
};

export const SlamWord: React.FC<SlamWordProps> = ({
  text,
  delay = 0,
  color = THEME.colors.text,
  size = 96,
  block = false,
  blockColor = THEME.colors.accent,
  rotate = 0,
  from = "bottom",
  index = 0,
}: SlamWordProps) => {
  const slam = useSlam(delay + stagger(index), { dy: 56, from });
  const punch = usePunch(delay + stagger(index) + THEME.motion.durations.enter);
  const blockWipe = useWipe(delay + stagger(index), 6, "left");
  return (
    <span
      style={{
        display: "inline-block",
        transform: `${slam.transform} ${punch} rotate(${rotate}deg)`,
        opacity: slam.opacity,
        background: block ? blockColor : "transparent",
        color: block ? THEME.colors.black : color,
        padding: block ? `${Math.round(size * 0.06)}px ${THEME.type.blockPadX}px` : 0,
        clipPath: block ? blockWipe : undefined,
        fontFamily: THEME.fonts.heading,
        fontWeight: THEME.fonts.headingWeight,
        fontSize: size,
        lineHeight: THEME.fonts.lineHeights.heading,
        letterSpacing: THEME.fonts.headingLetterSpacing,
        whiteSpace: "pre",
      }}
    >
      {text}
    </span>
  );
};

/** Character-by-character cascade — one line of type typing on in rhythm. */
export const CharLine: React.FC<{
  text: string;
  delay?: number;
  size?: number;
  color?: string;
  font?: string;
  weight?: number;
  letterSpacing?: string;
  startColor?: string;
}> = ({ text, delay = 0, size = 96, color = THEME.colors.text, font = THEME.fonts.heading, weight = THEME.fonts.headingWeight, letterSpacing = THEME.fonts.headingLetterSpacing }) => (
  <div style={{ display: "flex", flexWrap: "wrap" }}>
    {chars(text).map((c, i) => {
      const slam = useSlam(delay + charStagger(i), { dy: 30 });
      return (
        <span
          key={i}
          style={{
            display: "inline-block",
            whiteSpace: "pre",
            transform: slam.transform,
            opacity: slam.opacity,
            fontFamily: font,
            fontWeight: weight,
            fontSize: size,
            lineHeight: THEME.fonts.lineHeights.heading,
            letterSpacing,
            color,
          }}
        >
          {c}
        </span>
      );
    })}
  </div>
);

/** Wide-tracked word that settles into its final tracking. Quiet entrance. */
export const TrackedWord: React.FC<{
  text: string;
  delay?: number;
  size?: number;
  color?: string;
  font?: string;
  weight?: number;
  from?: number;
}> = ({ text, delay = 0, size = 72, color = THEME.colors.text, font = THEME.fonts.heading, weight = THEME.fonts.headingWeight, from = 0.34 }) => {
  const track = useTrack(delay, from);
  return (
    <div
      style={{
        fontFamily: font,
        fontWeight: weight,
        fontSize: size,
        lineHeight: THEME.fonts.lineHeights.heading,
        letterSpacing: track.letterSpacing,
        opacity: track.opacity,
        color,
        whiteSpace: "pre-wrap",
      }}
    >
      {text}
    </div>
  );
};

// ------------------------------------------------------- marks & furniture

/** Accent underline that swipes in beneath a word/line. */
export const UnderlineSwipe: React.FC<{
  x: number;
  y: number;
  w: number;
  color?: string;
  delay?: number;
  thickness?: number;
  rotate?: number;
}> = ({ x, y, w, color = THEME.colors.cyan, delay = 0, thickness = 10, rotate = 0 }) => {
  const cut = useWipe(delay, 7, "left");
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: thickness,
        background: color,
        clipPath: cut,
        transform: `rotate(${rotate}deg)`,
        transformOrigin: "left center",
      }}
    />
  );
};

/** Full-bleed accent block (panel) that wipes in from one side. */
export const SplitPanel: React.FC<{
  side: "left" | "right" | "top" | "bottom";
  frac?: number;
  color?: string;
  delay?: number;
}> = ({ side, frac = 0.4, color = THEME.colors.accent, delay = 0 }) => {
  const cut = useWipe(delay, 10, side === "right" ? "right" : side === "bottom" ? "down" : side === "top" ? "up" : "left");
  const box: React.CSSProperties =
    side === "left"
      ? { left: 0, top: 0, bottom: 0, width: `${frac * 100}%` }
      : side === "right"
        ? { right: 0, top: 0, bottom: 0, width: `${frac * 100}%` }
        : side === "top"
          ? { left: 0, right: 0, top: 0, height: `${frac * 100}%` }
          : { left: 0, right: 0, bottom: 0, height: `${frac * 100}%` };
  return <div style={{ position: "absolute", ...box, background: color, clipPath: cut }} />;
};

/** Short-lived full-screen accent flash on impact beats. */
export const FlashFrame: React.FC<{
  color?: string;
  at: number;
  duration?: number;
  opacity?: number;
}> = ({ color = THEME.colors.accent, at, duration = 6, opacity = 0.9 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const start = frames(at, fps);
  const end = start + frames(duration, fps);
  const on = frame >= start && frame < end;
  if (!on) return null;
  return <div style={{ position: "absolute", inset: 0, background: color, opacity, pointerEvents: "none" }} />;
};

/** Scrolling ticker strip — keeps holds alive with continuous motion. */
export const Ticker: React.FC<{
  text: string;
  y?: number;
  speed?: number;
  size?: number;
  color?: string;
  bg?: string;
  delay?: number;
  repeat?: number;
}> = ({ text, y, speed = 2.4, size = 40, color = THEME.colors.black, bg = THEME.colors.yellow, delay = 0, repeat = 8 }) => {
  const { width } = useVideoConfig();
  const p = useProgress(delay, 6);
  const unit = `${text}   ✦   `;
  const span = width * 2;
  const x = useMarquee(span, speed, -1);
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: y ?? undefined,
        bottom: y == null ? THEME.layout.safeMargin * 2 : undefined,
        background: bg,
        borderTop: `3px solid ${THEME.colors.black}`,
        borderBottom: `3px solid ${THEME.colors.black}`,
        overflow: "hidden",
        opacity: p,
        height: Math.round(size * 2.1),
        display: "flex",
        alignItems: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          whiteSpace: "nowrap",
          transform: `translateX(${x.toFixed(1)}px)`,
          fontFamily: THEME.fonts.accent,
          fontSize: size,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color,
        }}
      >
        {Array.from({ length: repeat }).map((_, i) => (
          <span key={i} style={{ paddingRight: 8 }}>
            {unit}
          </span>
        ))}
      </div>
    </div>
  );
};

/** Small-caps kicker label (Newake) — mode tag / section label. */
export const Kicker: React.FC<{
  text: string;
  delay?: number;
  color?: string;
  x?: number;
  y?: number;
}> = ({ text, delay = 0, color = THEME.colors.accent, x = THEME.layout.safeMargin, y = THEME.layout.safeMargin }) => {
  const slam = useSlam(delay, { dy: 16, from: "left" });
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        fontFamily: THEME.fonts.accent,
        fontSize: 34,
        letterSpacing: "0.3em",
        textTransform: "uppercase",
        color,
        opacity: slam.opacity,
        transform: slam.transform,
      }}
    >
      {text}
    </div>
  );
};

/** Quiet supporting line — the only place a soft fade is allowed. */
export const Caption: React.FC<{
  text: string;
  delay?: number;
  size?: number;
  color?: string;
  x?: number;
  y?: number;
  width?: number;
  align?: "left" | "center" | "right";
}> = ({ text, delay = 0, size = 34, color = THEME.colors.textSecondary, x, y, width, align = "left" }) => {
  const { width: vw } = useVideoConfig();
  const p = useProgress(delay, THEME.motion.durations.enter);
  const m = THEME.layout.safeMargin;
  return (
    <div
      style={{
        position: "absolute",
        left: x ?? m,
        top: y ?? undefined,
        bottom: y == null && x == null ? m * 2.2 : undefined,
        width: width ?? vw - m * 2,
        fontFamily: THEME.fonts.body,
        fontWeight: THEME.fonts.bodyWeight,
        fontSize: size,
        lineHeight: THEME.fonts.lineHeights.body,
        color,
        textAlign: align,
        opacity: p,
        transform: `translateY(${((1 - p) * 14).toFixed(2)}px)`,
      }}
    >
      {text}
    </div>
  );
};

/** Display line that auto-fits the frame — shared by every mode. */
export const DisplayLine: React.FC<{
  text: string;
  delay?: number;
  size?: number;
  color?: string;
  max?: number;
  align?: "left" | "center";
  outline?: boolean;
}> = ({ text, delay = 0, size, color = THEME.colors.text, max, align = "center", outline = false }) => {
  const { width } = useVideoConfig();
  const m = THEME.layout.safeMargin;
  const fit = fitSize(text, width - m * 2, max ?? THEME.type.hugeMax, THEME.type.hugeMin, THEME.type.wordRatio, 2);
  const sz = size ?? fit;
  const track = useTrack(delay, 0.16);
  return (
    <div
      style={{
        fontFamily: THEME.fonts.heading,
        fontWeight: THEME.fonts.headingWeight,
        fontSize: sz,
        lineHeight: THEME.fonts.lineHeights.heading,
        letterSpacing: track.letterSpacing,
        opacity: track.opacity,
        color: outline ? "transparent" : color,
        WebkitTextStroke: outline ? `${THEME.type.outlineStroke}px ${color}` : undefined,
        textAlign: align,
        textTransform: "none",
        whiteSpace: "pre-line",
      }}
    >
      {text}
    </div>
  );
};

/** Seeded micro-jitter — a 1–2px tremble so holds never sit perfectly still. */
export const useJitter = (seed = 0, amp = 1.6): { x: number; y: number; r: number } => {
  const frame = useCurrentFrame();
  const r = rng(seed * 31 + 7);
  const t = frame / 6;
  const a = r() * Math.PI * 2;
  return {
    x: Math.sin(t + a) * amp,
    y: Math.cos(t * 0.9 + a) * amp,
    r: Math.sin(t * 0.7 + a) * amp * 0.14,
  };
};

/** Seeded rotation offset for stacked display lines (-range..range deg). */
export const tilt = (seed: number, range = 1.4): number => {
  const r = rng(seed);
  return (r() * 2 - 1) * range;
};

/** Delay helper for stacked lines — line i lands `stagger` frames after i-1. */
export const lineDelay = (i: number, base = 0): number => base + stagger(i, THEME.motion.stagger * 2);
