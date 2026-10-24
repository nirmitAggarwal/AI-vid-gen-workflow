---
name: rendering
description: Render final MP4s — preview vs final quality, output locations, render-time pitfalls, only-on-request rule.
---

# Rendering

Full Remotion rendering reference: vendored skill
`templates/remotion-vertical/.agents/skills/remotion-render/` (and
`remotion-best-practices` router). This skill covers the studio's wrapper.

## Rule: render only when explicitly asked

"Render it" / "export the MP4" / "give me the video" → render. Otherwise
preview (`node tools/video.mjs dev <name>`) is the deliverable — humans steer
visually before committing to pixels.

## Commands

```bash
node tools/video.mjs render <name>                    # final quality
node tools/video.mjs render <name> --quality preview  # half-scale, quick
```

Output: `projects/<name>/output/<name>.mp4`.

## Pre-render checklist

- [ ] `video doctor` passes
- [ ] All four approvals true in `project.json` (script/audio/storyboard/design)
- [ ] Every storyboard section has a registered scene (no surprise
      `DefaultScene` fallbacks in the final video — check `video status`)
- [ ] Latest `tts`/`sync` ran after the last script edit
- [ ] Studio preview watched end-to-end by the human

## Pitfalls

- **Render is slow at full quality** — offer `--quality preview` first for
  review, final render last.
- **Duration/scene mismatch** — timeline comes from audio; re-run
  `video sync <name>` if audio changed after the last `tts`.
- **Missing scene = DefaultScene text** — if output shows raw line text where
  a scene should be, the registry entry is missing.
- **Audio out of sync** — never edit `timeline.ts` or add extra `<Audio>`;
  fix via re-running `video tts <name>`.

## Delivering

Report the output path, duration, resolution/fps, and file size. Offer the
`projects/<name>/output/` path; do not copy elsewhere unless asked.
