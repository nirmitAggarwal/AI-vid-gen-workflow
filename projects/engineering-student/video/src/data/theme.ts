// Design tokens — Marker Doodle
// Copied to <project>/video/src/data/theme.ts by `video style <name> --set marker-doodle`.

export const THEME = {
  id: "marker-doodle",
  name: "Marker Doodle",

  colors: {
    background: "#F7F1E3", // warm paper
    surface: "#FFFDF6", // clean sheet on the desk
    surfaceAlt: "#EDE3CB", // aged paper / shadow block
    text: "#141414", // marker black
    textSecondary: "#6F675A", // pencil grey
    accent: "#FFD400", // highlighter yellow
    accentAlt: "#FF4B3E", // red pen
    accentBlue: "#2050FF", // ballpoint blue (screens/UI)
    accentSoft: "rgba(255, 212, 0, 0.35)",
    line: "rgba(20, 20, 20, 0.18)",
  },

  fonts: {
    heading:
      "'Liberation Sans Narrow', 'DejaVu Sans Condensed', 'Arial Narrow', Impact, sans-serif",
    body: "'Liberation Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif",
    mono: "'DejaVu Sans Mono', 'SF Mono', Consolas, 'Courier New', monospace",
    headingWeight: 900,
    bodyWeight: 700,
    headingLetterSpacing: "0.005em",
    lineHeights: { heading: 0.94, body: 1.2 },
  },

  motion: {
    // Marker snap: arrives instantly, lands hard, barely settles.
    easing: [0.19, 1, 0.22, 1] as const,
    durations: { enter: 12, exit: 8, hold: 26 },
    stagger: 3,
    spring: { damping: 15, stiffness: 220, mass: 0.7 },
    maxAnimationsPerScene: 5,
  },

  layout: {
    safeMargin: 96,
    maxTextWidth: 1180,
    align: "left" as const,
  },

  treatment: {
    shadow: "8px 8px 0 #141414", // hard offset, no blur
    border: "4px solid #141414",
    radius: 2,
    grain: false,
    gradient: false,
  },

  // Illustration-specific tokens (read by the SVG scenes).
  illustration: {
    stroke: 7, // standard ink line @1920x1080
    strokeBold: 11, // hero outline
    strokeHair: 3.5, // detail lines
    dash: "14 10", // doodle dashed guides
    wobble: 1.6, // px of hand-drawn irregularity
    dotGrid: "rgba(20, 20, 20, 0.085)",
  },
} as const;

export type Theme = typeof THEME;
