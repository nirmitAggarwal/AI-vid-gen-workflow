// Design tokens — Minimal Tech
// Copied to <project>/video/src/data/theme.ts by `video style <name> --set minimal-tech`.
// Import THEME from here in scene components. Never hardcode colors/fonts in scenes.

export const THEME = {
  id: "minimal-tech",
  name: "Minimal Tech",

  colors: {
    background: "#F7F7F5",
    surface: "#FFFFFF",
    surfaceAlt: "#EDEDEA",
    text: "#111111",
    textSecondary: "#6B6B66",
    accent: "#0071E3",
    accentSoft: "rgba(0, 113, 227, 0.12)",
    line: "rgba(17, 17, 17, 0.10)",
  },

  fonts: {
    // System stacks only — no font files to install, renders identically anywhere.
    heading: "-apple-system, 'SF Pro Display', 'Segoe UI', Helvetica, Arial, sans-serif",
    body: "-apple-system, 'SF Pro Text', 'Segoe UI', Helvetica, Arial, sans-serif",
    mono: "'SF Mono', 'Cascadia Code', Consolas, monospace",
    headingWeight: 700,
    bodyWeight: 400,
    // Tight, confident headings; comfortable body.
    headingLetterSpacing: "-0.02em",
    lineHeights: { heading: 1.08, body: 1.5 },
  },

  motion: {
    // One easing everywhere: smooth deceleration, no bounce.
    easing: [0.16, 1, 0.3, 1] as const,
    durations: { enter: 24, exit: 16, hold: 40 }, // frames @30fps
    stagger: 4, // frames between sibling elements
    spring: { damping: 200, stiffness: 120, mass: 0.8 },
    // Restraint is the style: at most one "move" per element.
    maxAnimationsPerScene: 2,
  },

  layout: {
    safeMargin: 96, // px @1080 wide
    maxTextWidth: 820,
    align: "left" as const,
  },

  treatment: {
    shadow: "0 2px 24px rgba(0,0,0,0.06)",
    border: "1px solid rgba(17,17,17,0.08)",
    radius: 20,
    grain: false,
    gradient: false,
  },
} as const;

export type Theme = typeof THEME;
