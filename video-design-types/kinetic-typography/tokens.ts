// Design tokens — Kinetic Typography
// Copied to <project>/video/src/data/theme.ts by `video style <name> --set kinetic-typography`.
// Plain data only. Scenes read colors/fonts/motion from THEME, never hardcode them.

export const THEME = {
  id: "kinetic-typography",
  name: "Kinetic Typography",

  colors: {
    background: "#111111", // near-black stage
    surface: "#1A1A1A", // block behind a word
    surfaceAlt: "#242424", // secondary block / split panel
    text: "#FFFFFF",
    textSecondary: "#A6A6A6",
    accent: "#2457FF", // cobalt — default keyword colour
    accentSoft: "rgba(36, 87, 255, 0.22)",
    line: "rgba(255, 255, 255, 0.16)",

    // The full accent set. Use one or two per scene — never all of them.
    black: "#111111",
    white: "#FFFFFF",
    cobalt: "#2457FF",
    cyan: "#56D7FF",
    orange: "#FF7438",
    yellow: "#F8E34A",
    magenta: "#F45AA6",
    grey: "#A6A6A6",
  },

  fonts: {
    // A bold display face dominates; the supporting sans stays quiet.
    heading: "'Barge Black', Impact, 'Arial Black', sans-serif",
    headingItalic: "'Barge Black', Impact, 'Arial Black', sans-serif",
    display: "'Titan One', 'Arial Black', Impact, sans-serif",
    expressive: "'Milker', 'Barge Black', Impact, sans-serif",
    accent: "'Newake', 'Barge Black', Impact, sans-serif",
    body: "'Designer', 'Helvetica Neue', Helvetica, Arial, sans-serif",
    mono: "'SF Mono', 'Cascadia Code', Consolas, monospace",
    headingWeight: 900,
    bodyWeight: 500,
    headingLetterSpacing: "-0.01em",
    lineHeights: { heading: 0.92, body: 1.3 },
    // Real files these families resolve to (repo-root relative). Register them
    // with @font-face before rendering; every stack falls back to Impact /
    // Arial Black so a missing face never breaks the frame.
    // NOTE: NewakeFont-Demo.otf is a DEMO font — check its licence before any
    // commercial distribution; the fallback stack covers you if you drop it.
    faces: [
      { family: "Barge Black", weight: 900, style: "normal", file: "assets/fonts/sans serif/Barge-Black.otf" },
      { family: "Barge Black", weight: 900, style: "italic", file: "assets/fonts/sans serif/Barge-BlackItalic.otf" },
      { family: "Titan One", weight: 400, style: "normal", file: "assets/fonts/sans serif/TitanOne-Regular.ttf" },
      { family: "Milker", weight: 400, style: "normal", file: "assets/fonts/sans serif/Milker.otf" },
      { family: "Newake", weight: 400, style: "normal", file: "assets/fonts/sans serif/NewakeFont-Demo.otf", note: "demo licence — verify before commercial use" },
      { family: "Designer", weight: 400, style: "normal", file: "assets/fonts/sans serif/Designer.otf" },
    ],
  },

  motion: {
    // Snappy out-ease — instant arrival, no soft landing.
    easing: [0.19, 1, 0.22, 1] as const,
    durations: { enter: 9, exit: 6, hold: 22 }, // frames @30fps
    stagger: 2, // word-to-word cascade
    spring: { damping: 13, stiffness: 260, mass: 0.6 }, // punchy overshoot
    maxAnimationsPerScene: 6,
    charStagger: 1, // character-level cascade
    punchFrames: 8, // scale-punch length on landing
    trackingDuration: 14, // letter-spacing settle
    watermarkDrift: 18, // px of slow drift for the background word
  },

  layout: {
    safeMargin: 72,
    maxTextWidth: 936,
    align: "center" as const,
  },

  treatment: {
    shadow: "6px 6px 0 rgba(0,0,0,0.9)", // hard offset, no blur
    border: "3px solid #FFFFFF",
    radius: 0,
    grain: false,
    gradient: false,
  },

  // Style-specific tokens (read by the kinetic components).
  type: {
    outlineStroke: 5, // -webkit-text-stroke width for outlined lettering
    blockPadX: 20,
    blockPadY: 8,
    hugeMin: 76, // px — smallest an "enormous" word may go
    hugeMax: 320,
    watermarkOpacity: 0.07,
    repeatGap: 30,
    charRatio: 0.56, // avg glyph width ÷ font size (Barge Black) — fitting only
    wordRatio: 0.62,
    minReadable: 26, // never go below this for supporting text
    gridColumns: 3,
  },
} as const;

export type Theme = typeof THEME;