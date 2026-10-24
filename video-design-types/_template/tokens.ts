// Design tokens — <Style Name>
// Keep every key that scenes rely on: colors, fonts, motion, layout, treatment.

export const THEME = {
  id: "my-style",
  name: "My Style",

  colors: {
    background: "#101014",
    surface: "#1A1A21",
    surfaceAlt: "#24242D",
    text: "#F5F5F7",
    textSecondary: "#9B9BA5",
    accent: "#4F8CFF",
    accentSoft: "rgba(79, 140, 255, 0.14)",
    line: "rgba(245,245,247,0.12)",
  },

  fonts: {
    heading: "-apple-system, 'Segoe UI', Helvetica, Arial, sans-serif",
    body: "-apple-system, 'Segoe UI', Helvetica, Arial, sans-serif",
    mono: "'SF Mono', Consolas, monospace",
    headingWeight: 700,
    bodyWeight: 400,
    headingLetterSpacing: "-0.01em",
    lineHeights: { heading: 1.1, body: 1.5 },
  },

  motion: {
    easing: [0.16, 1, 0.3, 1] as const,
    durations: { enter: 20, exit: 14, hold: 30 }, // frames @30fps
    stagger: 3,
    spring: { damping: 200, stiffness: 120, mass: 1 },
    maxAnimationsPerScene: 3,
  },

  layout: {
    safeMargin: 84,
    maxTextWidth: 860,
    align: "center" as const,
  },

  treatment: {
    shadow: "0 4px 32px rgba(0,0,0,0.4)",
    border: "none",
    radius: 16,
    grain: false,
    gradient: false,
  },
} as const;

export type Theme = typeof THEME;
