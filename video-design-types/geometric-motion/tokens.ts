// Design tokens — Geometric Motion
// Copied to <project>/video/src/data/theme.ts by `video style <name> --set geometric-motion`.
// Plain data only. Scenes read colors/fonts/motion from THEME, never hardcode them.

export const THEME = {
  id: "geometric-motion",
  name: "Geometric Motion",

  colors: {
    background: "#F5F3EE", // gallery white
    surface: "#FFFFFF",
    surfaceAlt: "#E8E4DA", // grid tint
    text: "#111111",
    textSecondary: "#5A574F",
    accent: "#E63329", // Bauhaus red — the leading accent
    accentSoft: "rgba(230, 51, 41, 0.12)",
    line: "rgba(17, 17, 17, 0.18)",

    black: "#111111",
    red: "#E63329",
    blue: "#0B4FD9", // Bauhaus blue
    yellow: "#FFC90E", // Bauhaus yellow
    paper: "#F5F3EE",
    grey: "#5A574F",
  },

  fonts: {
    // Geometric display over a clean grotesque; mono for axis labels.
    display: "'Newake', 'Futura', 'Century Gothic', 'Helvetica Neue', Arial, sans-serif",
    heading: "'Futura', 'Century Gothic', 'Avenir Next', 'Helvetica Neue', Helvetica, Arial, sans-serif",
    body: "'Futura', 'Century Gothic', 'Helvetica Neue', Helvetica, Arial, sans-serif",
    label: "'Futura', 'Century Gothic', 'Helvetica Neue', Helvetica, Arial, sans-serif",
    mono: "'SF Mono', 'Cascadia Code', Consolas, 'Courier New', monospace",
    headingWeight: 700,
    bodyWeight: 400,
    headingLetterSpacing: "0.04em",
    lineHeights: { heading: 1.04, body: 1.45 },
    // Real files these families resolve to (repo-root relative). Register them
    // with @font-face before rendering; every stack falls back to Futura /
    // Helvetica so a missing face never breaks the frame.
    // NOTE: NewakeFont-Demo.otf is a DEMO font — check its licence before any
    // commercial distribution; the fallback stack covers you if you drop it.
    faces: [
      { family: "Newake", weight: 400, style: "normal", file: "assets/fonts/sans serif/NewakeFont-Demo.otf", note: "demo licence — verify before commercial use" },
    ],
  },

  motion: {
    // Symmetrical ease-in-out — shapes travel, stop precisely, never bounce.
    easing: [0.65, 0, 0.35, 1] as const,
    durations: { enter: 18, exit: 12, hold: 30 }, // frames @30fps
    stagger: 3,
    spring: { damping: 200, stiffness: 120, mass: 1 }, // critically damped
    maxAnimationsPerScene: 6,
    rotateFrames: 36, // arc/ring rotation into place
    orbitPeriod: 90, // continuous orbit loop (frames)
    countFrames: 22, // numeral count-up
    gridStagger: 1.5, // dot-grid cell cascade
  },

  layout: {
    safeMargin: 84,
    maxTextWidth: 912,
    align: "left" as const,
    gridUnit: 108, // Swiss grid cell — snaps shape coordinates
    columns: 6,
  },

  treatment: {
    shadow: "none", // flat design — depth is overlap, not blur
    border: "0px solid transparent",
    radius: 0,
    grain: false,
    gradient: false,
  },

  // Style-specific tokens (read by the geometric components).
  geo: {
    ringThickness: 26,
    barHeight: 54,
    dotSize: 16,
    dotGap: 54,
    triangleRatio: 0.87, // equilateral height ÷ width
    numeralSize: 320,
    numeralMin: 120,
    headlineMax: 150,
    headlineMin: 52,
    labelSize: 24,
    charRatio: 0.62, // grotesque avg glyph width ÷ font size — fitting only
    seamLabel: "right", // rotation side for split compositions
  },
} as const;

export type Theme = typeof THEME;
