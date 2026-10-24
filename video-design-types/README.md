# Video Design Types

Pre-made design languages the AI can apply to any project with one command:

```
node tools/video.mjs style <project> --set cinematic
node tools/video.mjs style            # list all styles
```

Applying a style copies its `tokens.ts` into the project as
`video/src/data/theme.ts`, so every scene reads colors, fonts and motion
settings from `THEME` instead of hardcoding them.

## Available styles

| Style | Feel |
|---|---|
| `minimal-tech` | Clean, calm, Apple-keynote whitespace, one accent |
| `cinematic` | Dark film-title mood, gold accents, slow reveals |
| `kinetic-typography` | Words as visuals, hi-contrast, fast and punchy |

## Folder format

Each style folder contains:

- `style.json` — `{ id, name, description }` (shown by `video style`)
- `tokens.ts` — exports `THEME` with sections: `colors`, `fonts`, `motion`, `layout`, `treatment`
- `README.md` — human/AI-facing design guide: palette rules, typography rules,
  motion vocabulary, scene composition guidance, and an example scene breakdown

## Creating a new style with AI

1. Copy the `_template` folder and name it (lowercase-with-dashes).
2. Ask the AI: *"Create a design style called <name> for <mood/reference>.
   Fill style.json, tokens.ts and README.md following the conventions of the
   other styles."*
3. The AI must keep the same `THEME` keys (`colors`, `fonts`, `motion`,
   `layout`, `treatment`) so scenes compile against any style.
4. Verify: `node tools/video.mjs style` should list it.

Rules for token files:
- `tokens.ts` must only use plain data (strings/numbers/arrays/objects) — it is
  copied verbatim into projects.
- Fonts must be system font stacks (no font files to download/install).
- `motion.durations` are in frames at 30fps; scale if the project fps differs.
- Never reference other styles' tokens; each folder is self-contained.
