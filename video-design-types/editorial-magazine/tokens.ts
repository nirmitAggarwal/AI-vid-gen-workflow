// Design tokens — Editorial Magazine
// Copied to <project>/video/src/data/theme.ts by `video style <name> --set editorial-magazine`.
// Plain data only. Scenes read colors/fonts/motion from THEME, never hardcode them.

export const THEME = {
  id: "editorial-magazine",
  name: "Editorial Magazine",

  colors: {
    background: "#F7F4EF", // warm uncoated paper
    surface: "#FFFFFF",
    surfaceAlt: "#EDE7DD", // tint block behind standfirsts
    text: "#14120F", // press ink
    textSecondary: "#5C564D",
    accent: "#D0342C", // editorial red — the ONE accent
    accentSoft: "rgba(208, 52, 44, 0.10)",
    line: "rgba(20, 18, 15, 0.24)",

    ink: "#14120F",
    red: "#D0342C",
    blue: "#1B3A6B", // secondary editorial blue — duotones only
    cream: "#F7F4EF",
    grey: "#5C564D",
  },

  fonts: {
    // High-contrast didone display over quiet sans body — magazine voice.
    display: "'Vogue', 'BodoniXT', Georgia, serif",
    heading: "'BodoniXT', Georgia, 'Times New Roman', serif",
    subheading: "'Liberation Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif",
    body: "'Liberation Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif",
    kicker: "'Liberation Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif",
    mono: "'SF Mono', Consolas, monospace",
    headingWeight: 700,
    bodyWeight: 400,
    headingLetterSpacing: "-0.02em",
    lineHeights: { heading: 1.0, body: 1.5 },
    // Real files these families resolve to (repo-root relative). Register them
    // with @font-face before rendering; every stack falls back to Georgia /
    // Helvetica so a missing face never breaks the frame.
    faces: [
      { family: "Vogue", weight: 400, style: "normal", file: "assets/fonts/serif/Vogue-Regular.otf", note: "verify licence before commercial use" },
      { family: "BodoniXT", weight: 400, style: "normal", file: "assets/fonts/serif/BodoniXT.ttf" },
    ],
  },

  motion: {
    // Long, eased, confident — type slides into place, nothing bounces.
    easing: [0.22, 1, 0.36, 1] as const,
    durations: { enter: 16, exit: 10, hold: 28 }, // frames @30fps
    stagger: 4,
    spring: { damping: 200, stiffness: 90, mass: 1 }, // critically damped — no overshoot
    maxAnimationsPerScene: 5,
    revealFrames: 12, // headline baseline reveal
    ruleFrames: 14, // rule grows across the measure
    columnStagger: 6, // column-to-column cascade
  },

  layout: {
    safeMargin: 84,
    maxTextWidth: 912,
    align: "left" as const,
    columns: 2,
    gutter: 48,
  },

  treatment: {
    shadow: "0 1px 0 rgba(20, 18, 15, 0.12)",
    border: "1px solid rgba(20, 18, 15, 0.85)",
    radius: 0,
    grain: true,
    gradient: false,
  },

  // Style-specific tokens (read by the magazine components).
  magazine: {
    ruleThick: 6, // section-break rule
    ruleHairline: 1, // column / header rules
    dropCapSize: 170, // opening letter, in px
    pullQuoteSize: 78,
    folioSize: 22,
    captionSize: 22,
    kickerSize: 24,
    standfirstSize: 40,
    headlineMax: 260,
    headlineMin: 64,
    charRatio: 0.5, // didone avg glyph width ÷ font size — fitting only
    hyphenate: false,
    grainOpacity: 0.05,
  },
} as const;

export type Theme = typeof THEME;
