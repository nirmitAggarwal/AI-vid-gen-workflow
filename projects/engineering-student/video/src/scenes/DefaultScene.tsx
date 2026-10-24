import React from "react";
import { AbsoluteFill } from "remotion";
import { THEME } from "../data/theme";
import { useFadeUp } from "../lib/motion";
import type { SceneProps } from "./index";

/**
 * DefaultScene — fallback when a line has no custom scene yet.
 * Shows the spoken line as themed text, so previews work from day one.
 */
const ALIGN: Record<string, "center" | "flex-start"> = {
  center: "center",
  left: "flex-start",
};

export const DefaultScene: React.FC<SceneProps> = ({ line }) => {
  const enter = useFadeUp();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: THEME.colors.background,
        justifyContent: "center",
        alignItems: ALIGN[THEME.layout.align] ?? "center",
        padding: THEME.layout.safeMargin,
      }}
    >
      <p
        style={{
          ...enter,
          maxWidth: THEME.layout.maxTextWidth,
          margin: 0,
          color: THEME.colors.text,
          fontFamily: THEME.fonts.heading,
          fontWeight: THEME.fonts.headingWeight,
          fontSize: 72,
          lineHeight: THEME.fonts.lineHeights.heading,
          letterSpacing: THEME.fonts.headingLetterSpacing,
        }}
      >
        {line.text}
      </p>
    </AbsoluteFill>
  );
};
