// Design tokens — Paper Collage
// Copied to <project>/video/src/data/theme.ts by `video style <name> --set paper-collage`.
// Plain data only.

export const THEME = {
  id: "paper-collage",
  name: "Paper Collage",

  colors: {
    // Papers
    background: "#F7F0E4", // cream base sheet
    surface: "#FFFDF8", // warm white paper
    surfaceAlt: "#D9C7A6", // light kraft
    text: "#292B32", // dark ink
    textSecondary: "#6B6459", // printed secondary text
    accent: "#D8795B", // terracotta
    accentAlt: "#E9BE55", // mustard
    accentSoft: "rgba(216, 121, 91, 0.16)",
    line: "rgba(41, 43, 50, 0.14)",

    // The paper stock palette — one background field + two pieces max per frame.
    cream: "#F7F0E4",
    warmWhite: "#FFFDF8",
    kraft: "#D9C7A6",
    mutedBlue: "#8EB8D8",
    terracotta: "#D8795B",
    mustard: "#E9BE55",
    ink: "#292B32",
    sage: "#A9BE9C", // occasional fourth stock
    shadow: "rgba(41, 43, 50, 0.16)", // paper lift, never glossy
  },

  fonts: {
    // One dramatic serif display + one readable serif text + one sans label face.
    heading: "'BodoniXT', Georgia, 'Times New Roman', serif",
    display: "'Vogue', 'BodoniXT', Georgia, serif",
    subheading: "'Scaver', 'Helvetica Neue', Helvetica, Arial, sans-serif",
    body: "'Scaver', Georgia, 'Times New Roman', serif",
    label: "'Designer', 'Helvetica Neue', Helvetica, Arial, sans-serif",
    annotation: "'Papernotes', 'Segoe UI', Helvetica, Arial, sans-serif",
    mono: "'SF Mono', 'Cascadia Code', Consolas, monospace",
    headingWeight: 400, // BodoniXT is single-weight — never faux-bold it
    bodyWeight: 400,
    subWeight: 800,
    labelWeight: 700,
    headingLetterSpacing: "-0.01em",
    lineHeights: { heading: 1.02, body: 1.5 },
    faces: [
      { family: "BodoniXT", weight: 400, style: "normal", file: "assets/fonts/serif/BodoniXT.ttf" },
      { family: "Vogue", weight: 400, style: "normal", file: "assets/fonts/serif/Vogue-Regular.otf", note: "verify licence before commercial use" },
      { family: "Scaver", weight: 400, style: "normal", file: "assets/fonts/serif/Scaver-Regular.ttf" },
      { family: "Scaver", weight: 500, style: "normal", file: "assets/fonts/serif/Scaver-Medium.ttf" },
      { family: "Scaver", weight: 700, style: "normal", file: "assets/fonts/serif/Scaver-Bold.ttf" },
      { family: "Scaver", weight: 800, style: "normal", file: "assets/fonts/serif/Scaver-ExtraBold.ttf" },
      { family: "Scaver", weight: 900, style: "normal", file: "assets/fonts/serif/Scaver-Black.ttf" },
      { family: "Designer", weight: 400, style: "normal", file: "assets/fonts/sans serif/Designer.otf" },
      { family: "Papernotes", weight: 400, style: "normal", file: "assets/fonts/handwritten/Papernotes.ttf" },
    ],
  },

  motion: {
    // Paper lands: decelerates with a small, restrained overshoot.
    easing: [0.16, 1, 0.3, 1] as const,
    durations: { enter: 26, exit: 18, hold: 42 }, // frames @30fps
    stagger: 5,
    spring: { damping: 18, stiffness: 140, mass: 1 }, // a hint of settle, not a bounce
    maxAnimationsPerScene: 4,
    drift: 5, // px of slow background-layer drift across a scene
    tearDuration: 20,
  },

  layout: {
    safeMargin: 96,
    maxTextWidth: 900,
    align: "center" as const,
  },

  treatment: {
    shadow: "0 10px 24px rgba(41, 43, 50, 0.16)",
    border: "none",
    radius: 3, // paper is cut, not rounded
    grain: true,
    gradient: false,
  },

  // Style-specific tokens (read by the collage components).
  paper: {
    tornDepth: 18, // px a torn edge wanders
    tornStep: 46, // px between torn samples
    rotationMax: 2.6, // deg — controlled asymmetry
    shadowLift: "0 14px 30px rgba(41, 43, 50, 0.18)",
    shadowPiece: "0 6px 14px rgba(41, 43, 50, 0.14)",
    shadowFlat: "0 2px 6px rgba(41, 43, 50, 0.10)",
    edgeDarken: "rgba(41, 43, 50, 0.10)",
    grainOpacity: 0.05,
    headlineSize: 112,
    subSize: 40,
    bodySize: 30,
    labelSize: 22,
    captionSize: 21,
  },
} as const;

export type Theme = typeof THEME;