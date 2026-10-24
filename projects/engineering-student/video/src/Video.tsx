import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { HAS_AUDIO, LINES } from "./data/timeline";
import { THEME } from "./data/theme";
import { getScene } from "./scenes";

/**
 * Video — the root composition body.
 *
 * Plays the full voiceover and lays every timeline line's scene into its
 * audio slot. Scenes are pure visuals; timing comes from the timeline data
 * written by `video sync`, so audio and visuals never drift.
 */
export const Video: React.FC = () => {
  const background = THEME.treatment.gradient
    ? THEME.treatment.gradient
    : THEME.colors.background;

  return (
    <AbsoluteFill style={{ backgroundColor: THEME.colors.background }}>
      <AbsoluteFill style={{ background }} />

      {HAS_AUDIO && <Audio src={staticFile("audio/voiceover.wav")} />}

      {LINES.map((line) => {
        const Scene = getScene(line.id);
        return (
          <Sequence
            key={line.id}
            from={line.startFrame}
            durationInFrames={line.durationFrames}
            name={line.id}
          >
            <Scene line={line} />
          </Sequence>
        );
      })}

      {/* Pre-audio placeholder so the template renders something meaningful */}
      {!HAS_AUDIO && LINES.length === 0 && (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            fontFamily: THEME.fonts.body,
            color: THEME.colors.textSecondary,
            fontSize: 36,
          }}
        >
          No audio yet — run the voice phase.
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
