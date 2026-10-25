// Design tokens — Line Art Illustration
// Copied to <project>/video/src/data/theme.ts by `video style <name> --set line-art-illustration`.
// Plain data only. Scenes read colors/fonts/motion from THEME, never hardcode them.

export const THEME = {
  id: "line-art-illustration",
  name: "Line Art Illustration",

  colors: {
    background: "#FBFAF6", // warm white — the paper
    surface: "#FFFFFF",
    surfaceAlt: "#F1EEE6", // soft wash behind steps
    text: "#23303A", // ink navy — the only line colour
    textSecondary: "#6B7480",
    accent: "#127C71", // teal — the one accent (checks, dots, key strokes)
    accentSoft: "rgba(18, 124, 113, 0.10)",
    line: "rgba(35, 48, 58, 0.30)",

    ink: "#23303A",
    teal: "#127C71",
    paper: "#FBFAF6",
    grey: "#6B7480",
    white: "#FFFFFF",
  },

  fonts: {
    // Elegant serif headings, clean sans body, handwritten annotations.
    heading: "'Scaver', Georgia, 'Times New Roman', serif",
    display: "'Scaver', Georgia, 'Times New Roman', serif",
    body: "'Designer', 'Helvetica Neue', Helvetica, Arial, sans-serif",
    annotation: "'SimpleHandmade', 'Papernotes', 'Segoe UI', Helvetica, Arial, sans-serif",
    mono: "'SF Mono', Consolas, monospace",
    headingWeight: 500,
    bodyWeight: 400,
    headingLetterSpacing: "-0.005em",
    lineHeights: { heading: 1.14, body: 1.5 },
    // Real files these families resolve to (repo-root relative). Register them
    // with @font-face before rendering; every stack falls back to Georgia /
    // Helvetica so a missing face never breaks the frame.
    faces: [
      { family: "Scaver", weight: 500, style: "normal", file: "assets/fonts/serif/Scaver-Medium.ttf" },
      { family: "Scaver", weight: 700, style: "normal", file: "assets/fonts/serif/Scaver-Bold.ttf" },
      { family: "Designer", weight: 400, style: "normal", file: "assets/fonts/sans serif/Designer.otf" },
      { family: "SimpleHandmade", weight: 400, style: "normal", file: "assets/fonts/handwritten/SimpleHandmade.ttf" },
      { family: "Papernotes", weight: 400, style: "normal", file: "assets/fonts/handwritten/Papernotes.ttf" },
    ],
  },

  motion: {
    // Pen-like: strokes draw at near-constant speed with a soft landing.
    easing: [0.4, 0, 0.2, 1] as const,
    durations: { enter: 22, exit: 12, hold: 34 }, // frames @30fps
    stagger: 7,
    spring: { damping: 30, stiffness: 90, mass: 1 }, // gentle settle, tiny overshoot at most
    maxAnimationsPerScene: 5,
    drawFrames: 26, // icon/illustration draw-on
    trailFrames: 30, // dotted trail marching
    floatAmp: 5, // px gentle breathing float
    floatPeriod: 74, // frames per float cycle
    dashMarch: 40, // frames per dash cycle on trails
  },

  layout: {
    safeMargin: 90,
    maxTextWidth: 900,
    align: "left" as const,
  },

  treatment: {
    shadow: "none",
    border: "none",
    radius: 20,
    grain: false,
    gradient: false,
  },

  // Style-specific tokens (read by the line-art components.
  lineArt: {
    stroke: 3.2, // px at 1080w — one weight everywhere
    iconStroke: 1.7, // viewBox units (24-unit icons)
    round: "round" as const, // linecap/linejoin — continuous-line feel
    trailDash: "10 14", // dotted marching trail
    accentThick: 4.5, // underlines / swooshes
    headlineMax: 148,
    headlineMin: 56,
    charRatio: 0.52, // serif avg glyph width ÷ font size — fitting only
    annotationSize: 34,
    labelSize: 22,
    floatDelay: 12, // floats begin after the draw-on
  },
} as const;

export type Theme = typeof THEME;
