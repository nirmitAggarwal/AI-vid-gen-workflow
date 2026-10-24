// Motion helpers — thin wrappers around Remotion primitives that apply the
// active THEME's easing/durations, so scenes stay short and consistent.
//
//   const style = useFadeUp({ delay: 10 });
//   const scale = usePunch();

import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { THEME } from "../data/theme";

/** THEME easing as a mutable tuple for Easing.bezier(). */
const EASE = THEME.motion.easing as unknown as [number, number, number, number];
const EASING = Easing.bezier(...EASE);

/** Scale a theme duration (defined @30fps) to the project fps. */
export const frames = (n: number, fps: number): number => Math.round((n * fps) / 30);

type FadeUpOpts = {
  /** Frames after scene start before beginning. */
  delay?: number;
  /** Initial vertical offset in px. */
  distance?: number;
  /** Enter duration in frames (theme default if omitted). */
  duration?: number;
};

/** Fade + rise entrance. Returns a style object to spread onto the element. */
export const useFadeUp = (opts: FadeUpOpts = {}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { delay = 0, distance = 28 } = opts;
  const duration = opts.duration ?? THEME.motion.durations.enter;

  const progress = interpolate(frame, [delay, delay + frames(duration, fps)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASING,
  });

  return {
    opacity: progress,
    transform: `translateY(${(1 - progress) * distance}px)`,
  };
};

/**
 * Spring punch: overshoots then settles. Good for emphasis (scale punch, stamps).
 * Returns a 0→to scale factor to apply via transform.
 */
export const usePunch = (opts: { delay?: number; to?: number; from?: number } = {}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { delay = 0, to = 1, from = 0.82 } = opts;

  const s = spring({
    frame: frame - delay,
    fps,
    config: {
      damping: THEME.motion.spring.damping,
      stiffness: THEME.motion.spring.stiffness,
      mass: THEME.motion.spring.mass,
    },
    durationInFrames: frames(THEME.motion.durations.enter, fps),
  });

  return interpolate(s, [0, 1], [from, to]);
};
