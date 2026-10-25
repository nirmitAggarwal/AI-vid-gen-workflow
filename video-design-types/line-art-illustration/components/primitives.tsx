// Line Art Illustration — drawing kit.
// One-weight line primitives: a hand-written icon library that draws itself,
// dotted marching trails, curved arrows, swoosh underlines, handwritten
// annotations. No fills, no shadows, no boxes.

import React from "react";
import { useVideoConfig } from "remotion";
import { THEME } from "../tokens";
import { curvedArrow, fitSize, stagger, useDraw, useFade, useFloat, usePop, useSettle, useTrail, wrapText } from "../lib/anim";

// ------------------------------------------------------------------ icons

/** 24-unit viewBox line icons — uniform weight, round caps, no fills. */
export type LineIconName =
  | "document"
  | "machine"
  | "gear"
  | "bulb"
  | "cloud"
  | "magnifier"
  | "clock"
  | "flag"
  | "people"
  | "chart";

const ICON_PATHS: Record<LineIconName, string[]> = {
  document: ["M7 3 h7 l4 4 v14 a1 1 0 0 1 -1 1 H7 a1 1 0 0 1 -1 -1 V4 a1 1 0 0 1 1 -1 z", "M14 3 v4 h4", "M9 12 h7", "M9 16 h5"],
  machine: ["M4 5 h16 v6 H4 z", "M4 13 h16 v6 H4 z", "M7.5 8 h0.01", "M7.5 16 h0.01", "M11 8 h5", "M11 16 h5"],
  gear: ["M12 8.5 a3.5 3.5 0 1 0 0 7 a3.5 3.5 0 1 0 0 -7 z", "M12 3 v2.4", "M12 18.6 V21", "M3 12 h2.4", "M18.6 12 H21", "M5.6 5.6 l1.7 1.7", "M16.7 16.7 l1.7 1.7", "M18.4 5.6 l-1.7 1.7", "M7.3 16.7 l-1.7 1.7"],
  bulb: ["M9 17 a6 6 0 1 1 6 0 v2 H9 z", "M10 21.5 h4", "M10.5 19 h3"],
  cloud: ["M7.5 18 a4.2 4.2 0 0 1 0.6 -8.3 a5.4 5.4 0 0 1 10.2 1.6 a3.6 3.6 0 0 1 -0.8 6.7 z"],
  magnifier: ["M10.5 4.5 a6 6 0 1 0 0 12 a6 6 0 1 0 0 -12 z", "M15 15 l5 5"],
  clock: ["M12 3.5 a8.5 8.5 0 1 0 0 17 a8.5 8.5 0 1 0 0 -17 z", "M12 7.5 V12 l3.2 2"],
  flag: ["M6 21 V4", "M6 4.5 h11 l-2.2 3.6 L17 12 H6"],
  people: ["M9 11 a3.4 3.4 0 1 0 0 -6.8 a3.4 3.4 0 1 0 0 6.8 z", "M3.5 20 a5.6 5.6 0 0 1 11 0", "M16 5.5 a3.1 3.1 0 0 1 0 6.2", "M17 14.6 a5.4 5.4 0 0 1 3.5 5.4"],
  chart: ["M4 4 V20 H21", "M8 16 v-4", "M12.5 16 V8", "M17 16 v-6"],
};

/** Single line icon that draws itself on. */
export const LineIcon: React.FC<{
  name: LineIconName;
  x?: number;
  y?: number;
  size?: number;
  delay?: number;
  color?: string;
  accentColor?: string;
  /** Draw the final path in teal (the emphasis stroke). */
  accentLast?: boolean;
  float?: boolean;
  seed?: number;
}> = ({ name, x = 0, y = 0, size = 200, delay = 0, color = THEME.colors.ink, accentColor = THEME.colors.teal, accentLast = false, float = true, seed = 0 }) => {
  const paths = ICON_PATHS[name] ?? ICON_PATHS.document;
  const draw = useDraw(delay);
  const floater = useFloat(delay + THEME.lineArt.floatDelay, seed);
  const floatY = float ? floater : "translateY(0px)";
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      style={{ position: "absolute", left: x, top: y, overflow: "visible", transform: floatY }}
    >
      <g
        fill="none"
        stroke={color}
        strokeWidth={THEME.lineArt.iconStroke}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {paths.map((d, i) => (
          <path
            key={i}
            d={d}
            stroke={accentLast && i === paths.length - 1 ? accentColor : color}
            {...draw}
          />
        ))}
      </g>
    </svg>
  );
};

// ---------------------------------------------------------------- trails

/** Dotted trail between two points — dashes march for the whole hold. */
export const DottedTrail: React.FC<{
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  bow?: number;
  delay?: number;
  color?: string;
  dashed?: boolean;
}> = ({ x1, y1, x2, y2, bow = 36, delay = 0, color = THEME.colors.ink, dashed = true }) => {
  const { shaft } = curvedArrow(x1, y1, x2, y2, bow);
  const march = useTrail(delay);
  const reveal = useDraw(delay, THEME.motion.trailFrames);
  const appear = useFade(delay, 0);
  return (
    <svg
      style={{ position: "absolute", left: 0, top: 0, overflow: "visible", pointerEvents: "none" }}
      width={1}
      height={1}
    >
      <path
        d={shaft}
        fill="none"
        stroke={color}
        strokeWidth={THEME.lineArt.stroke}
        strokeLinecap="round"
        opacity={appear.opacity}
        strokeDasharray={dashed ? THEME.lineArt.trailDash : undefined}
        strokeDashoffset={dashed ? march : reveal.strokeDashoffset}
        pathLength={dashed ? undefined : reveal.pathLength}
      />
    </svg>
  );
};

/** Smooth curved arrow with a head — draws on, points at things. */
export const CurvedArrow: React.FC<{
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  bow?: number;
  delay?: number;
  color?: string;
  headDelay?: number;
}> = ({ x1, y1, x2, y2, bow = 48, delay = 0, color = THEME.colors.teal }) => {
  const { shaft, head } = curvedArrow(x1, y1, x2, y2, bow);
  const draw = useDraw(delay, 18);
  const headFade = useFade(delay + 14);
  const [hx, hy, a1x, a1y, a2x, a2y] = head;
  return (
    <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible", pointerEvents: "none" }} width={1} height={1}>
      <path d={shaft} fill="none" stroke={color} strokeWidth={THEME.lineArt.accentThick} strokeLinecap="round" {...draw} />
      <g opacity={headFade.opacity} fill="none" stroke={color} strokeWidth={THEME.lineArt.accentThick} strokeLinecap="round" strokeLinejoin="round">
        <path d={`M ${a1x} ${a1y} L ${hx} ${hy} L ${a2x} ${a2y}`} />
      </g>
    </svg>
  );
};

/** Hand-drawn-feel swoosh underline — draws left → right beneath a line. */
export const Swoosh: React.FC<{
  x: number;
  y: number;
  w: number;
  delay?: number;
  color?: string;
  flip?: boolean;
}> = ({ x, y, w, delay = 0, color = THEME.colors.teal, flip = false }) => {
  const draw = useDraw(delay, 16);
  const dip = flip ? -14 : 14;
  return (
    <svg style={{ position: "absolute", left: x, top: y - 20, overflow: "visible" }} width={w} height={44}>
      <path
        d={`M 2 22 Q ${w * 0.5} ${22 + dip} ${w - 2} 18`}
        fill="none"
        stroke={color}
        strokeWidth={THEME.lineArt.accentThick}
        strokeLinecap="round"
        {...draw}
      />
    </svg>
  );
};

/** Teal check mark that pops in — the confirmation accent. */
export const CheckMark: React.FC<{
  x: number;
  y: number;
  size?: number;
  delay?: number;
  color?: string;
}> = ({ x, y, size = 64, delay = 0, color = THEME.colors.teal }) => {
  const pop = usePop(delay);
  const draw = useDraw(delay + 3, 12);
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ position: "absolute", left: x, top: y, overflow: "visible", transform: pop }}>
      <path
        d="M4 13 l5 5 L20 6"
        fill="none"
        stroke={color}
        strokeWidth={2.4}
        strokeLinecap="round"
        strokeLinejoin="round"
        {...draw}
      />
    </svg>
  );
};

/** Small crossing sparkle lines — a pen's emphasis marks. */
export const Sparkle: React.FC<{
  x: number;
  y: number;
  size?: number;
  delay?: number;
  color?: string;
}> = ({ x, y, size = 44, delay = 0, color = THEME.colors.teal }) => {
  const draw = useDraw(delay, 10);
  const half = size / 2;
  return (
    <svg width={size} height={size} style={{ position: "absolute", left: x, top: y, overflow: "visible" }}>
      <g fill="none" stroke={color} strokeWidth={2.4} strokeLinecap="round" {...draw}>
        <path d={`M ${half} 0 V ${size}`} />
        <path d={`M 0 ${half} H ${size}`} />
      </g>
    </svg>
  );
};

// ------------------------------------------------------------------- type

/** Serif headline with a slow settle — the calm anchor of every scene. */
export const LineHeadline: React.FC<{
  text: string;
  x?: number;
  y?: number;
  width?: number;
  size?: number;
  color?: string;
  align?: "left" | "center";
  delay?: number;
}> = ({ text, x, y, width, size, color = THEME.colors.ink, align = "left", delay = 0 }) => {
  const { width: vw } = useVideoConfig();
  const m = THEME.layout.safeMargin;
  const w = width ?? vw - m * 2;
  const sz = size ?? fitSize(text, w, THEME.lineArt.headlineMax, THEME.lineArt.headlineMin, THEME.lineArt.charRatio, 3);
  const settle = useSettle(delay, 16);
  const lines = text.split("\n");
  return (
    <div
      style={{
        position: "absolute",
        left: x ?? m,
        top: y,
        width: w,
        textAlign: align,
        opacity: settle.opacity,
        transform: settle.transform,
      }}
    >
      {lines.map((ln, i) => (
        <div
          key={i}
          style={{
            fontFamily: THEME.fonts.heading,
            fontWeight: THEME.fonts.headingWeight,
            fontSize: sz,
            lineHeight: THEME.fonts.lineHeights.heading,
            letterSpacing: THEME.fonts.headingLetterSpacing,
            color,
          }}
        >
          {ln}
        </div>
      ))}
    </div>
  );
};

/** Handwritten annotation — the margin note that points at the drawing. */
export const Annotation: React.FC<{
  text: string;
  x?: number;
  y?: number;
  width?: number;
  rotate?: number;
  delay?: number;
  color?: string;
}> = ({ text, x, y, width, rotate = -2, delay = 0, color = THEME.colors.ink }) => {
  const { width: vw } = useVideoConfig();
  const m = THEME.layout.safeMargin;
  const w = width ?? Math.min(vw - m * 2, 560);
  const fade = useFade(delay, 8);
  const lines = wrapText(text, Math.max(14, Math.floor(w / (THEME.lineArt.annotationSize * 0.52))));
  return (
    <div
      style={{
        position: "absolute",
        left: x ?? m,
        top: y,
        width: w,
        transform: `rotate(${rotate}deg) ${fade.transform}`,
        fontFamily: THEME.fonts.annotation,
        fontSize: THEME.lineArt.annotationSize,
        lineHeight: 1.35,
        color,
        opacity: fade.opacity,
      }}
    >
      {lines.join("\n")}
    </div>
  );
};

/** Quiet supporting line under the headline. */
export const LineCaption: React.FC<{
  text: string;
  x?: number;
  y?: number;
  width?: number;
  size?: number;
  color?: string;
  delay?: number;
}> = ({ text, x, y, width, size = 30, color = THEME.colors.textSecondary, delay = 0 }) => {
  const { width: vw } = useVideoConfig();
  const m = THEME.layout.safeMargin;
  const w = width ?? Math.min(vw - m * 2, 720);
  const fade = useFade(delay, 10);
  const lines = wrapText(text, Math.max(16, Math.floor(w / (size * 0.5))));
  return (
    <div
      style={{
        position: "absolute",
        left: x ?? m,
        top: y,
        width: w,
        fontFamily: THEME.fonts.body,
        fontSize: size,
        lineHeight: THEME.fonts.lineHeights.body,
        color,
        opacity: fade.opacity,
        transform: fade.transform,
      }}
    >
      {lines.join("\n")}
    </div>
  );
};

/** Soft wash panel — the only filled surface, behind step content. */
export const WashPanel: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  delay?: number;
  color?: string;
}> = ({ x, y, w, h, delay = 0, color = THEME.colors.surfaceAlt }) => {
  const settle = useSettle(delay, 8);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h,
        background: color,
        borderRadius: THEME.treatment.radius,
        opacity: settle.opacity * 0.9,
        transform: settle.transform,
      }}
    />
  );
};

/** Small uppercase label under an icon. */
export const IconLabel: React.FC<{
  text: string;
  x: number;
  y: number;
  width?: number;
  delay?: number;
  color?: string;
}> = ({ text, x, y, width, delay = 0, color = THEME.colors.textSecondary }) => {
  const fade = useFade(delay, 6);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width,
        textAlign: "center",
        fontFamily: THEME.fonts.body,
        fontSize: THEME.lineArt.labelSize,
        letterSpacing: "0.16em",
        textTransform: "uppercase",
        color,
        opacity: fade.opacity,
        transform: fade.transform,
      }}
    >
      {text}
    </div>
  );
};

/** Stagger helper re-export so scene code shares one cadence. */
export const stepDelay = (i: number): number => stagger(i);
