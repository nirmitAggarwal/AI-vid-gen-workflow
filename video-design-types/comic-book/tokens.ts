// Design tokens — Comic Book
// Copied to <project>/video/src/data/theme.ts by `video style <name> --set comic-book`.
// Plain data only. Scenes read colors/fonts/motion from THEME, never hardcode them.

export const THEME = {
  id: "comic-book",
  name: "Comic Book",

  colors: {
    background: "#FDF1DC", // newsprint cream
    surface: "#FFFFFF", // speech balloons
    surfaceAlt: "#FFE9B8", // narrator caption boxes
    text: "#0E0E0E", // ink — panel borders, lettering
    textSecondary: "#4A4A4A",
    accent: "#FF2E2E", // comic red — the leading accent
    accentSoft: "rgba(255, 46, 46, 0.14)",
    line: "#0E0E0E",

    black: "#0E0E0E",
    red: "#FF2E2E",
    blue: "#00A3E0",
    yellow: "#FFD400",
    cream: "#FDF1DC",
    white: "#FFFFFF",
  },

  fonts: {
    // Round fat display for action words, heavy comic lettering everywhere else.
    display: "'Titan One', 'Arial Black', Impact, sans-serif",
    heading: "'Barge Black', Impact, 'Arial Black', sans-serif",
    balloon: "'Barge Black', Impact, 'Arial Black', sans-serif",
    caption: "'Designer', 'Helvetica Neue', Helvetica, Arial, sans-serif",
    body: "'Designer', 'Helvetica Neue', Helvetica, Arial, sans-serif",
    mono: "'SF Mono', Consolas, monospace",
    headingWeight: 900,
    bodyWeight: 700,
    headingLetterSpacing: "0.01em",
    lineHeights: { heading: 0.98, body: 1.32 },
    // Real files these families resolve to (repo-root relative). Register them
    // with @font-face before rendering; every stack falls back to Impact /
    // Arial Black so a missing face never breaks the frame.
    faces: [
      { family: "Titan One", weight: 400, style: "normal", file: "assets/fonts/sans serif/TitanOne-Regular.ttf" },
      { family: "Barge Black", weight: 900, style: "normal", file: "assets/fonts/sans serif/Barge-Black.otf" },
      { family: "Barge Black", weight: 900, style: "italic", file: "assets/fonts/sans serif/Barge-BlackItalic.otf" },
      { family: "Designer", weight: 400, style: "normal", file: "assets/fonts/sans serif/Designer.otf" },
    ],
  },

  motion: {
    // Snappy with a real overshoot — comics bounce, then lock.
    easing: [0.16, 1, 0.3, 1] as const,
    durations: { enter: 10, exit: 6, hold: 24 }, // frames @30fps
    stagger: 4,
    spring: { damping: 10, stiffness: 300, mass: 0.7 }, // visible overshoot
    maxAnimationsPerScene: 7,
    slamFrames: 9, // action word arrives
    shakeFrames: 12, // impact shake decay
    shakeAmp: 16, // px at frame 0 of the shake
    balloonPop: 8,
    speedPeriod: 14, // frames per speed-line cycle
    panelStagger: 6,
  },

  layout: {
    safeMargin: 72,
    maxTextWidth: 936,
    align: "center" as const,
    panelGap: 28,
  },

  treatment: {
    shadow: "8px 8px 0 #0E0E0E", // hard offset ink shadow
    border: "7px solid #0E0E0E",
    radius: 14,
    grain: false,
    gradient: false,
  },

  // Style-specific tokens (read by the comic components.
  comic: {
    panelBorder: 9,
    balloonSize: 40,
    captionSize: 26,
    actionMax: 300,
    actionMin: 96,
    actionStroke: 6, // outline stroke on action words
    burstTeeth: 26, // polygon points around a shout burst
    halftoneDot: 12, // px spacing of the Ben-Day grid
    halftoneSize: 5,
    halftoneOpacity: 0.18,
    speedGap: 30,
    speedWidth: 10,
    tailSize: 44,
    charRatio: 0.56, // heavy display avg glyph width ÷ font size — fitting only
    balloonPad: 34,
  },
} as const;

export type Theme = typeof THEME;
