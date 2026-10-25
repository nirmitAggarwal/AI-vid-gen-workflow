// Technical Sketchnotes — drawing kit.
// Reusable hand-drawn primitives: boxes, marker highlights, arrows, icons,
// circled numbers. All wobble is seeded, so renders are reproducible.

import React from "react";
import { THEME } from "../tokens";
import {
  roughArrow,
  roughEllipse,
  roughLine,
  roughRect,
  tone,
  useDraw,
  useEnter,
  usePop,
  useProgress,
  type Tone,
} from "../lib/anim";

/** A path that draws itself on (pathLength-normalised, no DOM measuring). */
export const DrawPath: React.FC<{
  d: string;
  delay?: number;
  color?: string;
  width?: number;
  fill?: string;
}> = ({ d, delay = 0, color = THEME.colors.text, width = THEME.sketchnote.stroke, fill = "none" }) => {
  const draw = useDraw(delay);
  return (
    <path
      d={d}
      fill={fill}
      stroke={color}
      strokeWidth={width}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...draw}
    />
  );
};

/** A dashed connector that fades in (dashes + draw-on cannot share a dasharray). */
export const DashedPath: React.FC<{
  d: string;
  delay?: number;
  color?: string;
  width?: number;
  dash?: string;
}> = ({ d, delay = 0, color = THEME.colors.accent, width = THEME.sketchnote.strokeHair, dash = THEME.sketchnote.dash }) => {
  const p = useProgress(delay, 10);
  return (
    <path
      d={d}
      fill="none"
      stroke={color}
      strokeWidth={width}
      strokeLinecap="round"
      strokeDasharray={dash}
      opacity={p}
    />
  );
};

/**
 * Hand-drawn box: pastel/wash fill, wobbly navy outline drawn on, children
 * laid out inside with flex. Positioned absolutely in scene coordinates.
 */
export const SketchBox: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  seed?: number;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  delay?: number;
  align?: "flex-start" | "center";
  children?: React.ReactNode;
}> = ({
  x,
  y,
  w,
  h,
  seed = 1,
  fill = THEME.colors.surface,
  stroke = THEME.colors.text,
  strokeWidth = THEME.sketchnote.stroke,
  delay = 0,
  align = "flex-start",
  children,
}) => {
  const draw = useDraw(delay);
  const enter = useEnter(delay, 14);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h,
        opacity: enter.opacity,
        transform: enter.transform,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: fill,
          borderRadius: THEME.treatment.radius,
        }}
      />
      <svg
        width={w}
        height={h}
        viewBox={`0 0 ${w} ${h}`}
        style={{ position: "absolute", inset: 0, overflow: "visible" }}
      >
        <path
          d={roughRect(3, 3, w - 6, h - 6, seed)}
          fill="none"
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          {...draw}
        />
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          padding: `16px 18px`,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: align,
          gap: 6,
        }}
      >
        {children}
      </div>
    </div>
  );
};

/** Pastel marker sweep behind a phrase — organic left-to-right wipe. */
export const MarkerHighlight: React.FC<{
  children: React.ReactNode;
  color?: string;
  delay?: number;
  duration?: number;
  pad?: number;
}> = ({ children, color = THEME.colors.highlightYellow, delay = 0, duration = THEME.motion.markerDuration, pad = THEME.sketchnote.highlightPad }) => {
  const p = useProgress(delay, duration);
  return (
    <span style={{ position: "relative", display: "inline-block" }}>
      <span
        aria-hidden
        style={{
          position: "absolute",
          left: -pad,
          right: -pad,
          top: "10%",
          bottom: "0%",
          background: color,
          borderRadius: 5,
          transform: "rotate(-0.4deg)",
          clipPath: `inset(0 ${((1 - p) * 100).toFixed(2)}% 0 0)`,
        }}
      />
      <span style={{ position: "relative" }}>{children}</span>
    </span>
  );
};

/** Hand-drawn curved arrow drawn shaft-then-head, optional label on the shaft. */
export const SketchArrow: React.FC<{
  from: [number, number];
  to: [number, number];
  delay?: number;
  color?: string;
  width?: number;
  dashed?: boolean;
  curve?: number;
  seed?: number;
  label?: string;
}> = ({ from, to, delay = 0, color = THEME.colors.accent, width = THEME.sketchnote.stroke, dashed = false, curve = 0.14, seed = 7, label }) => {
  const g = roughArrow(from[0], from[1], to[0], to[1], seed, curve);
  const draw = useDraw(delay);
  const headP = useProgress(delay + THEME.motion.drawDuration * 0.75, 6);
  const fade = useProgress(delay, 8);

  return (
    <>
      <svg
        width={g.box.w}
        height={g.box.h}
        viewBox={`${g.box.x} ${g.box.y} ${g.box.w} ${g.box.h}`}
        style={{ position: "absolute", left: g.box.x, top: g.box.y, overflow: "visible" }}
      >
        <path
          d={g.shaft}
          fill="none"
          stroke={color}
          strokeWidth={width}
          strokeLinecap="round"
          {...(dashed ? { opacity: fade, strokeDasharray: THEME.sketchnote.dash } : draw)}
        />
        <path
          d={g.head}
          fill="none"
          stroke={color}
          strokeWidth={width}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={headP}
          transform={`translate(${g.mid[0]} ${g.mid[1]}) scale(${0.7 + headP * 0.3}) translate(${-g.mid[0]} ${-g.mid[1]})`}
        />
      </svg>
      {label ? (
        <div
          style={{
            position: "absolute",
            left: g.mid[0],
            top: g.mid[1],
            transform: "translate(-50%, -50%)",
            background: THEME.colors.background,
            padding: "2px 8px",
            fontFamily: THEME.fonts.body,
            fontSize: THEME.sketchnote.noteSize,
            color: THEME.colors.textSecondary,
            whiteSpace: "nowrap",
            opacity: fade,
          }}
        >
          {label}
        </div>
      ) : null}
    </>
  );
};

// ------------------------------------------------------------------ icons

export type IconName =
  | "database"
  | "server"
  | "cloud"
  | "user"
  | "brain"
  | "gear"
  | "doc"
  | "warning"
  | "check"
  | "clock"
  | "queue";

/** Icons are authored in a 48×48 box; strokes stay navy, fills use tone washes. */
const ICONS: Record<IconName, { lines: string[]; dots?: [number, number, number][] }> = {
  database: {
    lines: [
      "M6 13c0-3.9 8.5-7 18-7s18 3.1 18 7-8.5 7-18 7S6 16.9 6 13Z",
      "M6 13v22c0 3.9 8.5 7 18 7s18-3.1 18-7V13",
      "M6 24c0 3.9 8.5 7 18 7s18-3.1 18-7",
    ],
  },
  server: {
    lines: ["M7 8h34v10H7z", "M7 19h34v10H7z", "M7 30h34v10H7z"],
    dots: [
      [14, 13, 2],
      [14, 24, 2],
      [14, 35, 2],
    ],
  },
  cloud: {
    lines: [
      "M15 37h19a8 8 0 0 0 1-15.9A11.5 11.5 0 0 0 13.6 18 7.5 7.5 0 0 0 15 37Z",
    ],
  },
  user: {
    lines: ["M11 41c1.6-6.8 7-11 13-11s11.4 4.2 13 11"],
    dots: [[24, 17, 7.5]],
  },
  brain: {
    lines: [
      "M24 8c-5 0-9 3.2-9 7.2-3.2 1-5.4 3.9-5.4 7.2 0 3 1.7 5.7 4.4 6.8.2 4.2 3.9 7.8 8.4 7.8h4.2c4.5 0 8.2-3.6 8.4-7.8 2.7-1.1 4.4-3.8 4.4-6.8 0-3.3-2.2-6.2-5.4-7.2C33 11.2 29 8 24 8Z",
      "M24 12v24",
      "M18.5 19c1.9 1 3.6 1 5.5 0",
      "M24 27c1.9 1 3.6 1 5.5 0",
    ],
  },
  gear: {
    lines: [
      "M24 15.5a8.5 8.5 0 1 0 0 17 8.5 8.5 0 0 0 0-17Z",
      "M24 6.5v5",
      "M24 36.5v5",
      "M6.5 24h5",
      "M36.5 24h5",
      "M11.6 11.6l3.6 3.6",
      "M32.8 32.8l3.6 3.6",
      "M36.4 11.6l-3.6 3.6",
      "M15.2 32.8l-3.6 3.6",
    ],
  },
  doc: {
    lines: [
      "M12 6h16l8 8v28H12z",
      "M28 6v8h8",
      "M18 26h13",
      "M18 33h13",
    ],
  },
  warning: {
    lines: ["M24 8 44 40H4z", "M24 20v9"],
    dots: [[24, 34, 2]],
  },
  check: { lines: ["M9 25.5 19 35.5 39.5 13"] },
  clock: {
    lines: ["M24 10a14 14 0 1 0 0 28 14 14 0 0 0 0-28Z", "M24 16.5V25l6.5 4"],
  },
  queue: {
    lines: ["M9 13h30", "M9 24h30", "M9 35h20"],
    dots: [[41, 13, 2]],
  },
};

export const Icon: React.FC<{
  name: IconName;
  size?: number;
  delay?: number;
  toneName?: Tone;
  draw?: boolean;
  showWash?: boolean;
}> = ({ name, size = 56, delay = 0, toneName = "default", draw = true, showWash = true }) => {
  const def = ICONS[name];
  const colors = tone(toneName);
  const strokeW = (THEME.sketchnote.stroke * 48) / size;
  const drawProps = useDraw(delay, THEME.motion.drawDuration * 0.7);

  return (
    <svg width={size} height={size} viewBox="0 0 48 48" style={{ display: "block", overflow: "visible" }}>
      {showWash ? <circle cx={24} cy={24} r={22} fill={colors.wash} /> : null}
      <g fill="none" stroke={THEME.colors.text} strokeWidth={strokeW} strokeLinecap="round" strokeLinejoin="round">
        {def.lines.map((d, i) => (
          // pathLength lives on the path itself — it does not inherit from <g>.
          <path key={i} d={d} {...(draw ? drawProps : {})} />
        ))}
      </g>
      {def.dots?.map(([cx, cy, r], i) => (
        <circle key={i} cx={cx} cy={cy} r={r} fill={THEME.colors.text} opacity={drawProps.strokeDashoffset < 0.6 ? 1 : 0} />
      ))}
    </svg>
  );
};

/** Hand-drawn circle with a number inside — pops in. */
export const CircledNumber: React.FC<{
  n: number | string;
  size?: number;
  delay?: number;
  color?: string;
}> = ({ n, size = 62, delay = 0, color = THEME.colors.accent }) => {
  const pop = usePop(delay, 0.55);
  const draw = useDraw(delay, 14);
  const s = size * 0.9;
  return (
    <div
      style={{
        position: "relative",
        width: size,
        height: size,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transform: `scale(${pop})`,
      }}
    >
      <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} style={{ position: "absolute", left: (size - s) / 2, top: (size - s) / 2, overflow: "visible" }}>
        <path
          d={roughEllipse(s / 2, s / 2, s / 2 - 4, s / 2 - 5, 11)}
          fill="none"
          stroke={color}
          strokeWidth={THEME.sketchnote.stroke}
          strokeLinecap="round"
          {...draw}
        />
      </svg>
      <span
        style={{
          position: "relative",
          fontFamily: THEME.fonts.heading,
          fontWeight: THEME.fonts.headingWeight,
          fontSize: size * 0.46,
          lineHeight: 1,
          color,
        }}
      >
        {n}
      </span>
    </div>
  );
};

/** Loose hand-drawn underline drawn left → right. */
export const HandUnderline: React.FC<{
  w: number;
  delay?: number;
  color?: string;
  thickness?: number;
}> = ({ w, delay = 0, color = THEME.colors.accent, thickness = THEME.sketchnote.stroke }) => {
  const draw = useDraw(delay, 16);
  const h = 16;
  return (
    <svg width={w} height={h} viewBox={`0 -8 ${w} ${h}`} style={{ display: "block", overflow: "visible" }}>
      <path
        d={roughLine(2, 0, w - 2, 0, 21, 2.6, 6)}
        fill="none"
        stroke={color}
        strokeWidth={thickness}
        strokeLinecap="round"
        {...draw}
      />
    </svg>
  );
};

/** Section heading: circled number + marker-highlighted title + underline. */
export const SectionTitle: React.FC<{
  title: string;
  index?: number | string;
  highlight?: string;
  delay?: number;
  size?: number;
  underline?: boolean;
  /** Caps the underline and lets long titles wrap instead of overflowing. */
  maxWidth?: number;
}> = ({ title, index, highlight = THEME.colors.highlightYellow, delay = 0, size = THEME.sketchnote.headingSize, underline = true, maxWidth }) => {
  const enter = useEnter(delay, 12);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 18,
        opacity: enter.opacity,
        transform: enter.transform,
      }}
    >
      {index !== undefined ? <CircledNumber n={index} delay={delay} size={size * 1.35} /> : null}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          alignItems: "flex-start",
          maxWidth: maxWidth ?? "100%",
        }}
      >
        <div
          style={{
            fontFamily: THEME.fonts.heading,
            fontWeight: THEME.fonts.headingWeight,
            fontSize: size,
            lineHeight: THEME.fonts.lineHeights.heading,
            color: THEME.colors.text,
          }}
        >
          <MarkerHighlight color={highlight} delay={delay + 4}>
            {title}
          </MarkerHighlight>
        </div>
        {underline ? (
          <HandUnderline
            w={Math.min(maxWidth ?? 1e6, Math.max(60, size * title.length * 0.5))}
            delay={delay + 8}
          />
        ) : null}
      </div>
    </div>
  );
};

/** Short handwritten margin note in the annotation face. */
export const MarginNote: React.FC<{
  children: React.ReactNode;
  delay?: number;
  color?: string;
  size?: number;
  rotate?: number;
}> = ({ children, delay = 0, color = THEME.colors.coral, size = THEME.sketchnote.noteSize, rotate = -1.5 }) => {
  const p = useProgress(delay, 14);
  return (
    <span
      style={{
        display: "inline-block",
        fontFamily: THEME.fonts.annotation,
        fontSize: size,
        lineHeight: 1.25,
        color,
        transform: `rotate(${rotate}deg)`,
        opacity: p,
        borderBottom: `2px solid ${color}`,
        paddingBottom: 2,
      }}
    >
      {children}
    </span>
  );
};