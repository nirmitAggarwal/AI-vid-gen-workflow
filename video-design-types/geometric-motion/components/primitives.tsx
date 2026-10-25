// Geometric Motion — shape kit.
// Bauhaus/Swiss primitives: circles, triangles, arcs, bars, dot grids,
// split fields, counting numerals, seam labels, registration marks.
// All coordinates snap to THEME.layout.gridUnit; all motion stops dead.

import React from "react";
import { useVideoConfig } from "remotion";
import { THEME } from "../tokens";
import { fitSize, useCount, useGrow, useOrbit, useProgress, useRotateIn, useScaleIn, useSettle, wrapText } from "../lib/anim";

// ---------------------------------------------------------------- shapes

/** Solid circle — scales in from 0 with a precise stop. */
export const ShapeCircle: React.FC<{
  x: number;
  y: number;
  d: number;
  color?: string;
  delay?: number;
  ring?: boolean;
}> = ({ x, y, d, color = THEME.colors.red, delay = 0, ring = false }) => {
  const pop = useScaleIn(delay);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: d,
        height: d,
        borderRadius: "50%",
        background: ring ? "transparent" : color,
        border: ring ? `${THEME.geo.ringThickness}px solid ${color}` : undefined,
        boxSizing: "border-box",
        transform: pop.transform,
        opacity: pop.opacity,
      }}
    />
  );
};

/** Circle that orbits a centre point — continuous, never rests. */
export const OrbitDot: React.FC<{
  cx: number;
  cy: number;
  radius: number;
  d?: number;
  color?: string;
  period?: number;
  offsetDeg?: number;
  centerColor?: string;
  centerD?: number;
  delay?: number;
}> = ({ cx, cy, radius, d = 44, color = THEME.colors.blue, period = THEME.motion.orbitPeriod, offsetDeg = 0, centerColor, centerD, delay = 0 }) => {
  const angle = useOrbit(period, offsetDeg);
  const rad = (angle * Math.PI) / 180;
  const x = cx + Math.cos(rad) * radius - d / 2;
  const y = cy + Math.sin(rad) * radius - d / 2;
  const centerIn = useScaleIn(delay);
  return (
    <>
      {centerColor && centerD ? (
        <div
          style={{
            position: "absolute",
            left: cx - centerD / 2,
            top: cy - centerD / 2,
            width: centerD,
            height: centerD,
            borderRadius: "50%",
            background: centerColor,
            transform: centerIn.transform,
            opacity: centerIn.opacity,
          }}
        />
      ) : null}
      <div style={{ position: "absolute", left: x, top: y, width: d, height: d, borderRadius: "50%", background: color }} />
    </>
  );
};

/** Equilateral triangle via clip-path — rotates into place. */
export const ShapeTriangle: React.FC<{
  x: number;
  y: number;
  w: number;
  color?: string;
  delay?: number;
  rotate?: number;
}> = ({ x, y, w, color = THEME.colors.yellow, delay = 0, rotate = 0 }) => {
  const h = Math.round(w * THEME.geo.triangleRatio);
  const pop = useScaleIn(delay);
  const rot = useRotateIn(delay, rotate - 60, rotate);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h,
        background: color,
        clipPath: "polygon(50% 0%, 100% 100%, 0% 100%)",
        transform: `${rot} ${pop.transform}`,
        opacity: pop.opacity,
      }}
    />
  );
};

/** Half or quarter arc (ring segment) that rotates in. */
export const ShapeArc: React.FC<{
  x: number;
  y: number;
  d: number;
  color?: string;
  thickness?: number;
  delay?: number;
  from?: number;
  to?: number;
  loop?: boolean;
  quarter?: boolean;
}> = ({ x, y, d, color = THEME.colors.red, thickness = THEME.geo.ringThickness, delay = 0, from = -90, to = 0, loop = false, quarter = false }) => {
  const rot = useRotateIn(delay, from, to, loop);
  const hidden = quarter ? "25%" : "50%";
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: d,
        height: d,
        transform: rot,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          border: `${thickness}px solid ${color}`,
          clipPath: quarter
            ? "polygon(50% 50%, 100% 50%, 100% 0%, 50% 0%)"
            : `inset(0 0 ${hidden} 0)`,
          boxSizing: "border-box",
        }}
      />
    </div>
  );
};

/** Rectangle that grows from one edge. `dir` picks the growing edge. */
export const Bar: React.FC<{
  x: number;
  y: number;
  w: number;
  h?: number;
  color?: string;
  delay?: number;
  dir?: "right" | "left" | "down" | "up";
  label?: string;
}> = ({ x, y, w, h = THEME.geo.barHeight, color = THEME.colors.black, delay = 0, dir = "right", label }) => {
  const grow = useGrow(delay, dir);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h,
        background: color,
        transform: grow.transform,
        transformOrigin: grow.transformOrigin,
        display: "flex",
        alignItems: "center",
        justifyContent: dir === "right" ? "flex-start" : "flex-end",
        padding: `0 ${Math.round(h * 0.3)}px`,
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      {label ? (
        <span
          style={{
            fontFamily: THEME.fonts.mono,
            fontSize: Math.round(h * 0.34),
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: THEME.colors.paper,
            whiteSpace: "nowrap",
          }}
        >
          {label}
        </span>
      ) : null}
    </div>
  );
};

/** Dot grid that cascades cell-by-cell along reading order. */
export const DotGrid: React.FC<{
  x: number;
  y: number;
  cols: number;
  rows: number;
  color?: string;
  delay?: number;
  size?: number;
  gap?: number;
  highlight?: { col: number; row: number; color?: string };
}> = ({ x, y, cols, rows, color = THEME.colors.black, delay = 0, size = THEME.geo.dotSize, gap = THEME.geo.dotGap, highlight }) => {
  const cells: React.ReactNode[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const i = r * cols + c;
      const p = useScaleIn(delay + i * THEME.motion.gridStagger);
      const isHi = highlight && highlight.col === c && highlight.row === r;
      cells.push(
        <div
          key={i}
          style={{
            position: "absolute",
            left: c * gap,
            top: r * gap,
            width: size,
            height: size,
            borderRadius: "50%",
            background: isHi ? highlight!.color ?? THEME.colors.red : color,
            transform: p.transform,
            opacity: p.opacity,
          }}
        />
      );
    }
  }
  return <div style={{ position: "absolute", left: x, top: y, width: cols * gap, height: rows * gap }}>{cells}</div>;
};

/** Flat colour field wiping in from one side — split compositions. */
export const SplitField: React.FC<{
  side: "left" | "right" | "top" | "bottom";
  frac?: number;
  color?: string;
  delay?: number;
}> = ({ side, frac = 0.5, color = THEME.colors.blue, delay = 0 }) => {
  const p = useProgress(delay);
  const grow = side === "left" || side === "right" ? `scaleX(${p.toFixed(4)})` : `scaleY(${p.toFixed(4)})`;
  const origin = side === "left" ? "left center" : side === "right" ? "right center" : side === "top" ? "center top" : "center bottom";
  const box: React.CSSProperties =
    side === "left"
      ? { left: 0, top: 0, bottom: 0, width: `${frac * 100}%` }
      : side === "right"
        ? { right: 0, top: 0, bottom: 0, width: `${frac * 100}%` }
        : side === "top"
          ? { left: 0, right: 0, top: 0, height: `${frac * 100}%` }
          : { left: 0, right: 0, bottom: 0, height: `${frac * 100}%` };
  return <div style={{ position: "absolute", ...box, background: color, transform: grow, transformOrigin: origin }} />;
};

// ------------------------------------------------------------------ type

/** Counting numeral — 0 → value, the data-as-motion signature. */
export const Numeral: React.FC<{
  value: number;
  suffix?: string;
  label?: string;
  x?: number;
  y?: number;
  size?: number;
  color?: string;
  delay?: number;
  align?: "left" | "right" | "center";
}> = ({ value, suffix = "", label, x, y, size = THEME.geo.numeralSize, color = THEME.colors.red, delay = 0, align = "left" }) => {
  const n = useCount(value, delay);
  const settle = useSettle(delay, 24);
  const fit = Math.max(THEME.geo.numeralMin, Math.min(size, 1080 / Math.max(2, String(value).length + suffix.length) / 0.66));
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        textAlign: align,
        opacity: settle.opacity,
        transform: settle.transform,
        ...(align === "right" ? { transform: `${settle.transform} translateX(-100%)` } : {}),
      }}
    >
      <div
        style={{
          fontFamily: THEME.fonts.display,
          fontSize: fit,
          lineHeight: 0.9,
          letterSpacing: "0.02em",
          color,
          whiteSpace: "nowrap",
        }}
      >
        {n}
        {suffix}
      </div>
      {label ? (
        <div
          style={{
            fontFamily: THEME.fonts.mono,
            fontSize: THEME.geo.labelSize,
            letterSpacing: "0.26em",
            textTransform: "uppercase",
            color: THEME.colors.textSecondary,
            marginTop: 10,
            whiteSpace: "nowrap",
          }}
        >
          {label}
        </div>
      ) : null}
    </div>
  );
};

/** Uppercase display headline on the grid — settles precisely. */
export const GeoHeadline: React.FC<{
  text: string;
  x?: number;
  y?: number;
  width?: number;
  size?: number;
  color?: string;
  align?: "left" | "center" | "right";
  delay?: number;
  outline?: boolean;
}> = ({ text, x, y, width, size, color = THEME.colors.black, align = "left", delay = 0, outline = false }) => {
  const { width: vw } = useVideoConfig();
  const m = THEME.layout.safeMargin;
  const w = width ?? vw - m * 2;
  const sz = size ?? fitSize(text.toUpperCase(), w, THEME.geo.headlineMax, THEME.geo.headlineMin, THEME.geo.charRatio, 3);
  const settle = useSettle(delay, 18);
  const lines = text.toUpperCase().split("\n");
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
            textTransform: "uppercase",
            color: outline ? "transparent" : color,
            WebkitTextStroke: outline ? `2px ${color}` : undefined,
            whiteSpace: "pre",
          }}
        >
          {ln}
        </div>
      ))}
    </div>
  );
};

/** Mono axis label — often rotated 90° along a split seam. */
export const SeamLabel: React.FC<{
  text: string;
  x: number;
  y: number;
  rotate?: number;
  color?: string;
  delay?: number;
}> = ({ text, x, y, rotate = -90, color = THEME.colors.textSecondary, delay = 0 }) => {
  const p = useProgress(delay, 12);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `rotate(${rotate}deg)`,
        transformOrigin: "left top",
        fontFamily: THEME.fonts.mono,
        fontSize: THEME.geo.labelSize,
        letterSpacing: "0.3em",
        textTransform: "uppercase",
        color,
        whiteSpace: "nowrap",
        opacity: p,
      }}
    >
      {text}
    </div>
  );
};

/** Quiet supporting line under a headline. */
export const GeoCaption: React.FC<{
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
  const w = width ?? Math.min(vw - m * 2, 760);
  const settle = useSettle(delay, 12);
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
        opacity: settle.opacity,
        transform: settle.transform,
      }}
    >
      {lines.join("\n")}
    </div>
  );
};

/** Printer's registration mark at a corner — the anchor detail. */
export const RegistrationMark: React.FC<{
  x: number;
  y: number;
  size?: number;
  color?: string;
  delay?: number;
}> = ({ x, y, size = 44, color = THEME.colors.textSecondary, delay = 0 }) => {
  const p = useScaleIn(delay, 0.4);
  return (
    <div style={{ position: "absolute", left: x, top: y, width: size, height: size, transform: `translate(-50%, -50%) ${p.transform}`, opacity: p.opacity }}>
      <div style={{ position: "absolute", left: size / 2 - 1, top: 0, width: 2, height: size, background: color }} />
      <div style={{ position: "absolute", top: size / 2 - 1, left: 0, height: 2, width: size, background: color }} />
      <div
        style={{
          position: "absolute",
          inset: size * 0.2,
          borderRadius: "50%",
          border: `2px solid ${color}`,
          boxSizing: "border-box",
        }}
      />
    </div>
  );
};
