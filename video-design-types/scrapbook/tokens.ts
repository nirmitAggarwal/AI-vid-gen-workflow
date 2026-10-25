// Design tokens — Scrapbook
// Copied to <project>/video/src/data/theme.ts by `video style <name> --set scrapbook`.
// Plain data only. Scenes read colors/fonts/motion from THEME, never hardcode them.

export const THEME = {
  id: "scrapbook",
  name: "Scrapbook",

  colors: {
    background: "#F6EEE2", // soft cream page
    surface: "#FFFFFF", // polaroid borders, note cards
    surfaceAlt: "#EFE3D0", // page pockets / mats
    text: "#3A342B", // warm ink
    textSecondary: "#7A7062",
    accent: "#D06B6B", // dusty rose — the leading accent
    accentSoft: "rgba(208, 107, 107, 0.14)",
    line: "rgba(58, 52, 43, 0.28)",

    ink: "#3A342B",
    rose: "#D06B6B",
    sage: "#8AA88B",
    mustard: "#E5B84B",
    sky: "#8FB8D6",
    kraft: "#D9C2A0",
    cream: "#F6EEE2",
    white: "#FFFFFF",
  },

  fonts: {
    // Handwriting leads; a quiet sans handles body copy.
    heading: "'Papernotes', 'SimpleHandmade', 'Segoe UI', Helvetica, Arial, sans-serif",
    display: "'Papernotes', 'SimpleHandmade', 'Segoe UI', Helvetica, Arial, sans-serif",
    annotation: "'SimpleHandmade', 'Papernotes', 'Segoe UI', Helvetica, Arial, sans-serif",
    body: "'Designer', 'Helvetica Neue', Helvetica, Arial, sans-serif",
    accent: "'Stay With Me', 'Papernotes', cursive",
    mono: "'SF Mono', Consolas, monospace",
    headingWeight: 700,
    bodyWeight: 400,
    headingLetterSpacing: "0.01em",
    lineHeights: { heading: 1.16, body: 1.5 },
    // Real files these families resolve to (repo-root relative). Register them
    // with @font-face before rendering; every stack falls back to a script /
    // system face so a missing font never breaks the frame.
    faces: [
      { family: "Papernotes", weight: 400, style: "normal", file: "assets/fonts/handwritten/Papernotes.ttf" },
      { family: "Papernotes", weight: 700, style: "normal", file: "assets/fonts/handwritten/Papernotes Bold.ttf" },
      { family: "SimpleHandmade", weight: 400, style: "normal", file: "assets/fonts/handwritten/SimpleHandmade.ttf" },
      { family: "Stay With Me", weight: 400, style: "normal", file: "assets/fonts/handwritten/Stay With Me.otf" },
      { family: "Designer", weight: 400, style: "normal", file: "assets/fonts/sans serif/Designer.otf" },
    ],
  },

  motion: {
    // Pieces DROP onto the page: quick fall, soft bounce, settle at an angle.
    easing: [0.34, 1.3, 0.42, 1] as const, // slight overshoot in the curve itself
    durations: { enter: 16, exit: 10, hold: 34 }, // frames @30fps
    stagger: 5,
    spring: { damping: 12, stiffness: 180, mass: 0.9 }, // visible, gentle bounce
    maxAnimationsPerScene: 6,
    dropHeight: 90, // px a piece falls from
    tapeFrames: 10, // tape wipes on
    stickerSpin: 140, // degrees a sticker turns while popping
    stitchFrames: 24, // blanket-stitch draw-on
    floatAmp: 4, // px idle sway on holds
    floatPeriod: 88, // frames per sway cycle
  },

  layout: {
    safeMargin: 84,
    maxTextWidth: 900,
    align: "left" as const,
  },

  treatment: {
    shadow: "0 10px 24px rgba(58, 52, 43, 0.18)", // soft paper lift
    border: "none",
    radius: 6,
    grain: true,
    gradient: false,
  },

  // Style-specific tokens (read by the scrapbook components.
  scrap: {
    tapeW: 150, // default washi strip length
    tapeH: 44,
    tapeOpacity: 0.82,
    polaroidBorder: 22,
    polaroidCaption: 40,
    polaroidBottom: 92,
    stitchDash: "14 12",
    stitchWidth: 4,
    ticketNotch: 16,
    stickerOutline: 8,
    noteSize: 46,
    titleMax: 170,
    titleMin: 64,
    charRatio: 0.54, // handwriting avg glyph width ÷ font size — fitting only
    grainOpacity: 0.05,
  },
} as const;

export type Theme = typeof THEME;
