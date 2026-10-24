// Design tokens — Kinetic Typography
// Copied to <project>/video/src/data/theme.ts by `video style <name> --set kinetic-typography`.

export const THEME = {
  id: "kinetic-typography",
  name: "Kinetic Typography",

  colors: {
    background: "#0D0D0D",
    surface: "#171717",
    surfaceAlt: "#232323",
    text: "#FFFFFF",
    textSecondary: "#A3A3A3",
    accent: "#FFE600", // hi-vis yellow
    accentAlt: "#FF3B30", // punch red for one-word emphasis
    accentSoft: "rgba(255, 230, 0, 0.15)",
    line: "rgba(255,255,255,0.14)",
  },

  fonts: {
    heading: "Impact, 'Arial Black', 'Helvetica Neue', sans-serif",
    body: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    mono: "'SF Mono', Consolas, monospace",
    headingWeight: 900,
    bodyWeight: 700,
    headingLetterSpacing: "0em",
    lineHeights: { heading: 0.95, body: 1.25 },
  },

  motion: {
    // Snappy out-ease — instant arrival, no soft landing.
    easing: [0.19, 1, 0.22, 1] as const,
    durations: { enter: 10, exit: 8, hold: 25 },
    stagger: 2, // fast cascade
    spring: { damping: 14, stiffness: 220, mass: 0.6 }, // bouncy, punchy
    maxAnimationsPerScene: 5, // this style thrives on layered motion
  },

  layout: {
    safeMargin: 72,
    maxTextWidth: 936,
    align: "center" as const,
  },

  treatment: {
    shadow: "6px 6px 0 rgba(0,0,0,0.9)", // hard offset shadow, no blur
    border: "3px solid #FFFFFF",
    radius: 0,
    grain: false,
    gradient: false,
  },
} as const;

export type Theme = typeof THEME;
