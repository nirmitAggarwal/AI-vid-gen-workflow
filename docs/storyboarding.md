# Storyboarding

`projects/<name>/storyboard.md` is the visual contract: one section per audio
line, written so a scene can be built from it **alone** — no guessing. The
human edits it manually or asks you to rewrite parts; scenes are only built
once `storyboardApproved` is true.

## Format

```markdown
# Storyboard — <name>

## L1 — "Most teams start with a blank page."

**Visual:** ...detailed paragraph...
**Motion:** ...detailed paragraph...
**On-screen text:** ...
**Style notes:** ...
```

## What "VERY detailed" means

Each section must answer everything a coder needs:

- **Visual** — layout (what sits where on the frame), every element (shapes,
  cards, text, numbers, images), hierarchy (what's biggest), and the
  composition rule being used (center hero, lower-third, left-aligned column…).
- **Motion** — how each element enters (fade-up, stamp, slide, scale), timing
  in frames relative to line start (e.g. "title fades up frames 0–20, stat
  counts 20–70, everything exits 95–104"), stagger between elements, and the
  exit. Respect the style's motion vocabulary (from the style README) —
  a cinematic scene never SLAMS; a kinetic scene never gently fades.
- **On-screen text** — exact strings, sizes relative to frame, weight/color
  from THEME (e.g. "accent color for `30%`").
- **Style notes** — which THEME tokens matter here (accent block, gradient
  background, gold rule…), and any per-scene deviation the design phase blessed.
- **Audio cue** — which word/beat the emphasis lands on, when the line's key
  moment is ("punch lands on 'blank'").

Sections must cover **every** line in `script.json` (ids must match), in order.

## Worked example

```markdown
## L2 — "We start with a plan."

**Visual:** Full-bleed background in `background`. A single centered column:
a small uppercase label "OUR PROCESS" in `textSecondary`, 20px, letter-spaced,
sits 180px above a large heading "A PLAN." in Impact at 160px, `text` white.
Below it, a thick `accent` block (420×18px) will swipe across to underline the
word. Behind everything, a giant outlined word "PLAN" at 10% opacity, 340px,
slowly drifting left for depth.

**Motion:** Line starts at frame 0 of this scene. Label fades up 16px over
frames 0–14. "A" stamps in (scale 1.15→1.0 spring) frames 8–20; "PLAN." slams
in word after it, frames 14–26, with the accent block swiping left→right
frames 26–38 exactly on the narrator's stress of "plan". The watermark drifts
−40px horizontally across the whole scene. Exit: all content slides up 60px and
fades over the last 10 frames.

**On-screen text:** "OUR PROCESS" (label), "A PLAN." (hero).

**Style notes:** kinetic-typography — yellow accent used only on the underline
block (black text stays white); hard offset shadow on "A PLAN.".

**Audio cue:** emphasis on the word "plan" — the underline swipe must land
when it's spoken (~60% through the line).
```

## Edit loops

| Human says | You do |
|---|---|
| "Edit L4's paragraph myself" | Leave the file alone; they edit `storyboard.md`; re-read it before building |
| "Rewrite just L4, calmer" | Rewrite only that section in place; show the diff summary |
| "The whole thing feels off — try X mood" | Regenerate all sections around X; keep ids |
| "Add a line" | Add `L<n>` to `script.json`, run `video tts --only L<n>`, add its section |

After ANY script change post-approval, flip `storyboardApproved` to `false`
until the affected sections are re-agreed.

## Approval

Ask: "Storyboard ready? You can edit `storyboard.md` directly, or tell me what
to change." Only `storyboardApproved: true` unlocks scene building.
