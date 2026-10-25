// Design tokens — Technical Sketchnotes
// Copied to <project>/video/src/data/theme.ts by `video style <name> --set technical-sketchnotes`.
// Plain data only. Scenes read colors/fonts/motion from THEME, never hardcode them.

export const THEME = {
  id: "technical-sketchnotes",
  name: "Technical Sketchnotes",

  colors: {
    // Paper + ink
    background: "#FDFCF8", // warm notebook white
    surface: "#FFFFFF", // a cleaner sheet laid on the page
    surfaceAlt: "#F3F0E7", // aged margin block
    text: "#14264D", // navy ink — primary text + technical outlines
    textSecondary: "#4C5B7A", // softer ink for annotations
    accent: "#2878E5", // architecture, information flow, ordinary relationships
    accentAlt: "#F4A340", // decisions, warnings, important processing steps
    accentSoft: "rgba(40, 120, 229, 0.14)",
    line: "rgba(20, 38, 77, 0.16)",

    // Marker colours (semantic roles — keep them consistent scene to scene)
    sky: "#77C8F5", // secondary blue
    highlightBlue: "#D9F0FF", // pale blue section highlight
    mint: "#72D9B0", // success, storage, completed operations
    highlightGreen: "#DDF8E9",
    orange: "#F4A340", // decisions / warnings
    highlightYellow: "#FFF0A8", // marker yellow
    lavender: "#B8A2F5", // AI components, abstract intelligence
    highlightViolet: "#EDE5FF",
    coral: "#F27683", // errors, conflicts, failure states
    highlightCoral: "#FFE3E6",
    grid: "rgba(40, 120, 229, 0.06)", // graph-paper rules
    dot: "rgba(20, 38, 77, 0.14)", // alignment dots
  },

  fonts: {
    // Handwritten first, system stack as the legibility fallback.
    heading: "'Papernotes', 'Segoe UI', Helvetica, Arial, sans-serif",
    headingBold: "'Papernotes', 'Segoe UI', Helvetica, Arial, sans-serif",
    body: "'Papernotes', 'Segoe UI', Helvetica, Arial, sans-serif",
    mono: "'SF Mono', 'Cascadia Code', Consolas, monospace",
    annotation: "'SimpleHandmade', 'Papernotes', 'Segoe UI', Helvetica, Arial, sans-serif",
    accent: "'Stay With Me', 'Papernotes', cursive",
    headingWeight: 700,
    bodyWeight: 400,
    headingLetterSpacing: "0.005em",
    lineHeights: { heading: 1.1, body: 1.45 },
    // Real files these families resolve to (repo-root relative). Plain data:
    // a project registers them with @font-face before rendering; if a family
    // is not registered the stack above falls back to a system sans.
    faces: [
      { family: "Papernotes", weight: 400, style: "normal", file: "assets/fonts/handwritten/Papernotes.ttf" },
      { family: "Papernotes", weight: 700, style: "normal", file: "assets/fonts/handwritten/Papernotes Bold.ttf" },
      { family: "SimpleHandmade", weight: 400, style: "normal", file: "assets/fonts/handwritten/SimpleHandmade.ttf" },
      { family: "Stay With Me", weight: 400, style: "normal", file: "assets/fonts/handwritten/Stay With Me.otf" },
    ],
  },

  motion: {
    // Pen-on-paper: confident deceleration, no bounce.
    easing: [0.22, 0.85, 0.28, 1] as const,
    durations: { enter: 22, exit: 16, hold: 38 }, // frames @30fps
    stagger: 4,
    spring: { damping: 200, stiffness: 110, mass: 1 }, // critically damped — never wobbles
    maxAnimationsPerScene: 4,
    // Draw-on runs steadier than entrances; strokes are drawn, not faded.
    drawEasing: [0.4, 0, 0.3, 1] as const,
    drawDuration: 24,
    markerDuration: 12,
  },

  layout: {
    safeMargin: 88, // px @1080 wide
    maxTextWidth: 1120,
    align: "left" as const,
  },

  treatment: {
    shadow: "0 1px 2px rgba(20, 38, 77, 0.10)",
    border: "2.5px solid #14264D",
    radius: 12,
    grain: false,
    // Very light graph paper. Remove if a diagram gets busy.
    gradient:
      "repeating-linear-gradient(0deg, rgba(40,120,229,0.055) 0 1px, transparent 1px 52px), repeating-linear-gradient(90deg, rgba(40,120,229,0.055) 0 1px, transparent 1px 52px)",
  },

  // Style-specific tokens (read by the sketchnote components).
  sketchnote: {
    stroke: 4, // standard ink line
    strokeBold: 6, // hero outline / diagram frame
    strokeHair: 2.5, // detail + label leader lines
    dash: "12 9", // dashed connectors (async / optional)
    wobble: 2.2, // px of hand-drawn irregularity
    arrowHead: 15, // px arrow head
    titleSize: 88,
    headingSize: 44,
    labelSize: 27,
    bodySize: 30,
    noteSize: 24,
    highlightPad: 10, // px the marker highlight bleeds past the glyphs
    nodeMinWidth: 232,
  },
} as const;

export type Theme = typeof THEME;