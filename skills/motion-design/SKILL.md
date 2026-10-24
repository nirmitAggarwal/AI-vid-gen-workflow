---
name: motion-design
description: Design and build Remotion scenes — storyboards to THEME-driven components, motion vocabulary, scene registry, previews.
---

# Motion Design

Two layers of knowledge:

1. **This project's system** — read **`docs/storyboarding.md`** and
   **`docs/remotion-guide.md`** first. They define the scene contract, THEME
   tokens, motion helpers, and the registry.
2. **Remotion craft** — vendored in the template at
   `templates/remotion-vertical/.agents/skills/remotion-best-practices/`
   (router → markup, create, multimedia, captions, studio, render…). Load the
   relevant reference when going beyond basic scenes. **Never reinstall these
   skills**; they ship inside every scaffolded project.

## Scene building checklist

- [ ] Storyboard section for this line exists and is approved
- [ ] Component in `video/src/scenes/<Name>.tsx` typed `React.FC<SceneProps>`
- [ ] Registered in `scenes/index.ts` (`SCENES = { L1: ... }`)
- [ ] Zero hardcoded colors/fonts/margins — all from `THEME`
- [ ] Motion uses `lib/motion.ts` helpers + theme easing/durations
- [ ] Fits exactly `line.durationFrames` (local frame 0 = line start)
- [ ] Previewed in Studio and approved by the human

## Design languages

Styles live in `video-design-types/<style>/` (`style.json`, `tokens.ts`,
`README.md`). The README is the design law for that style: palette table,
typography rules, motion vocabulary, composition guidance, example scenes.
Applying: `node tools/video.mjs style <name> --set <style>` → writes
`data/theme.ts`; every scene picks it up with zero edits.

Creating a new style: follow `video-design-types/README.md`'s contract
(same THEME keys, system font stacks, plain data only).

## Motion principles (all styles)

- Audio leads: emphasis lands on the stressed word (see storyboard's
  "Audio cue").
- One idea per scene; entrances stagger, never simultaneous.
- Exits are as designed as entrances — scenes don't just vanish.
- Respect `THEME.motion.maxAnimationsPerScene` — it's the style's density law.
- Motion conveys meaning (count-ups for stats, stamps for punchlines); motion
  for its own sake reads as noise.

## Preview loop

```bash
node tools/video.mjs dev <name>   # Studio, shared install
```
Build one scene → scrub to its frames → ask verdict → next. Batch approvals
only for trivial scenes; get sign-off on hero scenes individually.
