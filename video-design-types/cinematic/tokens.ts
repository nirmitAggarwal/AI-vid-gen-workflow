// Design tokens — Cinematic
// Copied to <project>/video/src/data/theme.ts by `video style <name> --set cinematic`.

export const THEME = {
  id: "cinematic",
  name: "Cinematic",

  colors: {
    background: "#0A0A0F",
    surface: "#14141C",
    surfaceAlt: "#1E1E28",
    text: "#F4F1EA", // warm off-white, like projected light
    textSecondary: "#9A968C",
    accent: "#C9A227", // antique gold
    accentSoft: "rgba(201, 162, 39, 0.14)",
    line: "rgba(244, 241, 234, 0.12)",
  },

  fonts: {
    // Georgia is present on Windows/macOS/Linux desktops; serif for display.
    heading: "Georgia, 'Times New Roman', serif",
    body: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    mono: "'SF Mono', Consolas, monospace",
    headingWeight: 400, // serifs carry weight naturally
    bodyWeight: 300,
    headingLetterSpacing: "0.01em",
    lineHeights: { heading: 1.15, body: 1.6 },
  },

  motion: {
    // Long, filmic deceleration.
    easing: [0.22, 1, 0.36, 1] as const,
    durations: { enter: 45, exit: 30, hold: 55 }, // slow!
    stagger: 8,
    spring: { damping: 200, stiffness: 60, mass: 1.4 },
    maxAnimationsPerScene: 2,
  },

  layout: {
    safeMargin: 120,
    maxTextWidth: 760,
    align: "center" as const,
  },

  treatment: {
    shadow: "0 8px 60px rgba(0,0,0,0.6)",
    border: "none",
    radius: 4,
    grain: true,
    gradient:
      "radial-gradient(ellipse at 50% 40%, rgba(201,162,39,0.08) 0%, transparent 60%), linear-gradient(180deg, #0A0A0F 0%, #101018 50%, #0A0A0F 100%)",
  },
} as const;

export type Theme = typeof THEME;
