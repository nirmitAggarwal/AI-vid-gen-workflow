// Geometric Motion — scene composer.
// Builds grid-locked compositions from structured data: shapes snap to
// gridUnit, numerals count, bars grow, orbits loop. Four compositions —
// orbit, stack, grid, split — pick the layout; shapes[] is data.

import React from "react";
import { AbsoluteFill, useVideoConfig } from "remotion";
import { THEME } from "../tokens";
import { snap, stagger } from "../lib/anim";
import {
  Bar,
  DotGrid,
  GeoCaption,
  GeoHeadline,
  Numeral,
  OrbitDot,
  RegistrationMark,
  SeamLabel,
  ShapeArc,
  ShapeCircle,
  ShapeTriangle,
  SplitField,
} from "./primitives";

// ------------------------------------------------------------- scene schema

export type GeoShape = {
  id: string;
  kind: "circle" | "ring" | "triangle" | "arc" | "bar";
  color?: string;
  /** Grid-snapped anchor (px). Defaults derive from the composition. */
  x?: number;
  y?: number;
  size?: number;
  delay?: number;
  label?: string;
  dir?: "right" | "left" | "down" | "up";
};

export type GeoComposition = "orbit" | "stack" | "grid" | "split";

export type GeometricSceneData = {
  composition: GeoComposition;
  /** Small mono label above the headline. */
  kicker?: string;
  headline?: string;
  caption?: string;
  /** Counting numeral — lands on the narrator's quantity. */
  numeral?: { value: number; suffix?: string; label?: string };
  /** Extra shapes; omit to get the composition's default arrangement. */
  shapes?: GeoShape[];
  /** Colours for split fields (split composition). */
  fields?: { left?: string; right?: string };
  accent?: string;
};

export type GeometricSceneProps = {
  data?: Partial<GeometricSceneData>;
  line?: { text?: string };
};

// ---------------------------------------------------------------- composer

export const GeometricScene: React.FC<GeometricSceneProps> = ({ data, line }) => {
  const { width, height } = useVideoConfig();
  const m = THEME.layout.safeMargin;

  const d: GeometricSceneData = {
    composition: data?.composition ?? "orbit",
    kicker: data?.kicker,
    headline: data?.headline ?? line?.text ?? "",
    caption: data?.caption,
    numeral: data?.numeral,
    shapes: data?.shapes,
    fields: data?.fields,
    accent: data?.accent ?? THEME.colors.red,
  };

  const body = (() => {
    switch (d.composition) {
      case "stack":
        return <StackComposition d={d} />;
      case "grid":
        return <GridComposition d={d} />;
      case "split":
        return <SplitComposition d={d} />;
      default:
        return <OrbitComposition d={d} />;
    }
  })();

  const markDelay = 30;

  return (
    <AbsoluteFill style={{ backgroundColor: THEME.colors.background, overflow: "hidden" }}>
      {body}

      {/* registration marks — corners, last to arrive */}
      <RegistrationMark x={m * 0.6} y={m * 0.6} delay={markDelay} />
      <RegistrationMark x={width - m * 0.6} y={m * 0.6} delay={markDelay + 2} />
      <RegistrationMark x={m * 0.6} y={height - m * 0.6} delay={markDelay + 4} />
      <RegistrationMark x={width - m * 0.6} y={height - m * 0.6} delay={markDelay + 6} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- helpers

/** Kicker + headline + caption block, grid-anchored. */
const TypeBlock: React.FC<{
  d: GeometricSceneData;
  x?: number;
  y: number;
  width?: number;
  align?: "left" | "center" | "right";
  delay?: number;
}> = ({ d, x, y, width, align = "left", delay = 0 }) => {
  const { width: vw } = useVideoConfig();
  const m = THEME.layout.safeMargin;
  const w = width ?? vw - m * 2;
  const headDelay = delay + 6;
  const captionDelay = headDelay + 14;
  return (
    <>
      {d.kicker ? (
        <div
          style={{
            position: "absolute",
            left: x ?? m,
            top: y - 44,
            fontFamily: THEME.fonts.mono,
            fontSize: THEME.geo.labelSize,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: d.accent,
            textAlign: align,
            width: align === "left" ? undefined : w,
          }}
        >
          {d.kicker}
        </div>
      ) : null}
      {d.headline ? <GeoHeadline text={d.headline} x={x} y={y} width={w} align={align} delay={headDelay} color={THEME.colors.black} /> : null}
      {d.caption ? (
        <GeoCaption text={d.caption} x={x} y={y + 180} width={Math.min(w, 720)} delay={captionDelay} />
      ) : null}
    </>
  );
};

// ------------------------------------------------------------- compositions

/** Orbit — ringed core top-right, numeral counts, type bottom-left. */
const OrbitComposition: React.FC<{ d: GeometricSceneData }> = ({ d }) => {
  const { width, height } = useVideoConfig();
  const m = THEME.layout.safeMargin;
  const u = THEME.layout.gridUnit;
  const cx = snap(width * 0.66);
  const cy = snap(height * 0.34);
  const core = Math.round(u * 2.4);
  return (
    <>
      <OrbitDot
        cx={cx}
        cy={cy}
        radius={Math.round(u * 2.1)}
        d={56}
        color={THEME.colors.blue}
        centerColor={d.accent}
        centerD={core}
        delay={4}
        period={THEME.motion.orbitPeriod}
      />
      <ShapeArc x={cx - u * 3} y={cy - u * 3} d={u * 6} color={THEME.colors.black} delay={10} from={-140} to={-40} loop={false} />
      <ShapeTriangle x={snap(width * 0.78)} y={snap(height * 0.6)} w={Math.round(u * 1.4)} color={THEME.colors.yellow} delay={16} />
      {d.numeral ? (
        <Numeral value={d.numeral.value} suffix={d.numeral.suffix} label={d.numeral.label} x={m} y={Math.round(height * 0.52)} size={THEME.geo.numeralSize} color={d.accent} delay={8} />
      ) : null}
      <TypeBlock d={d} y={Math.round(height * 0.74)} />
    </>
  );
};

/** Stack — bars grow in sequence, numeral right, type over the stack. */
const StackComposition: React.FC<{ d: GeometricSceneData }> = ({ d }) => {
  const { width, height } = useVideoConfig();
  const m = THEME.layout.safeMargin;
  const u = THEME.layout.gridUnit;
  const bars =
    d.shapes ??
    ([
      { id: "b1", kind: "bar", color: THEME.colors.black, label: "Split" },
      { id: "b2", kind: "bar", color: d.accent, label: "Run" },
      { id: "b3", kind: "bar", color: THEME.colors.blue, label: "Merge" },
    ] as GeoShape[]);
  const barW = width - m * 2 - u;
  return (
    <>
      {bars.map((b, i) => (
        <Bar
          key={b.id}
          x={m + (i % 2 === 1 ? u : 0)}
          y={Math.round(height * 0.42) + i * Math.round(u * 0.9)}
          w={barW - (i % 2 === 1 ? 0 : u)}
          h={THEME.geo.barHeight}
          color={b.color ?? THEME.colors.black}
          delay={6 + stagger(i, 5)}
          dir={i % 2 === 1 ? "left" : "right"}
          label={b.label}
        />
      ))}
      {d.numeral ? (
        <Numeral value={d.numeral.value} suffix={d.numeral.suffix} label={d.numeral.label} x={width - m} y={Math.round(height * 0.2)} size={Math.round(THEME.geo.numeralSize * 0.6)} color={d.accent} delay={4} align="right" />
      ) : null}
      <TypeBlock d={d} y={Math.round(height * 0.24)} />
      <ShapeCircle x={snap(width * 0.12)} y={snap(height * 0.78)} d={Math.round(u * 1.2)} color={THEME.colors.yellow} delay={20} />
    </>
  );
};

/** Grid — dot field with a highlighted cell, shapes on intersections. */
const GridComposition: React.FC<{ d: GeometricSceneData }> = ({ d }) => {
  const { width, height } = useVideoConfig();
  const m = THEME.layout.safeMargin;
  const u = THEME.layout.gridUnit;
  const gap = THEME.geo.dotGap;
  const cols = Math.min(9, Math.floor((width - m * 2) / gap));
  const rows = 7;
  const gx = Math.round((width - (cols - 1) * gap) / 2);
  const gy = Math.round(height * 0.4);
  return (
    <>
      <DotGrid x={gx} y={gy} cols={cols} rows={rows} color={THEME.colors.black} delay={4} highlight={{ col: Math.floor(cols / 2), row: Math.floor(rows / 2), color: d.accent }} />
      <ShapeCircle x={gx + Math.floor(cols / 2) * gap - THEME.geo.dotSize / 2} y={gy + Math.floor(rows / 2) * gap - THEME.geo.dotSize / 2} d={THEME.geo.dotSize} color={d.accent} delay={18} />
      {d.shapes?.map((s, i) => {
        const sx = s.x ?? snap(width * (0.2 + i * 0.2));
        const sy = s.y ?? snap(height * 0.3);
        if (s.kind === "triangle") return <ShapeTriangle key={s.id} x={sx} y={sy} w={s.size ?? Math.round(u * 1.2)} color={s.color ?? THEME.colors.yellow} delay={s.delay ?? 14 + stagger(i)} />;
        if (s.kind === "ring") return <ShapeCircle key={s.id} x={sx} y={sy} d={s.size ?? Math.round(u * 1.6)} color={s.color ?? THEME.colors.blue} ring delay={s.delay ?? 14 + stagger(i)} />;
        if (s.kind === "arc") return <ShapeArc key={s.id} x={sx} y={sy} d={s.size ?? Math.round(u * 2)} color={s.color ?? d.accent} delay={s.delay ?? 14 + stagger(i)} from={-90} to={0} />;
        if (s.kind === "bar") return <Bar key={s.id} x={sx} y={sy} w={s.size ?? Math.round(u * 3)} color={s.color ?? THEME.colors.black} delay={s.delay ?? 14 + stagger(i)} dir={s.dir ?? "right"} label={s.label} />;
        return <ShapeCircle key={s.id} x={sx} y={sy} d={s.size ?? Math.round(u * 1.4)} color={s.color ?? THEME.colors.red} delay={s.delay ?? 14 + stagger(i)} />;
      })}
      {d.numeral ? (
        <Numeral value={d.numeral.value} suffix={d.numeral.suffix} label={d.numeral.label} x={m} y={Math.round(height * 0.2)} color={d.accent} delay={6} />
      ) : null}
      <TypeBlock d={d} y={Math.round(height * 0.74)} align="center" />
    </>
  );
};

/** Split — colour fields from opposite sides, seam label, numeral on seam. */
const SplitComposition: React.FC<{ d: GeometricSceneData }> = ({ d }) => {
  const { width, height } = useVideoConfig();
  const m = THEME.layout.safeMargin;
  const seam = Math.round(width * 0.5);
  return (
    <>
      <SplitField side="left" frac={0.5} color={d.fields?.left ?? THEME.colors.blue} delay={0} />
      <SplitField side="right" frac={0.5} color={d.fields?.right ?? THEME.colors.paper} delay={4} />
      <div style={{ position: "absolute", left: seam - 1, top: 0, bottom: 0, width: 2, background: THEME.colors.black, opacity: 0.4 }} />
      <SeamLabel text={d.kicker ?? "Systems"} x={seam - 24} y={Math.round(height * 0.16)} color={THEME.colors.textSecondary} delay={12} />
      {d.numeral ? (
        <Numeral value={d.numeral.value} suffix={d.numeral.suffix} label={d.numeral.label} x={seam - 60} y={Math.round(height * 0.38)} size={Math.round(THEME.geo.numeralSize * 0.7)} color={d.accent} delay={8} />
      ) : null}
      <TypeBlock d={d} x={m} y={Math.round(height * 0.68)} width={width - m * 2} />
      <ShapeTriangle x={seam + 80} y={Math.round(height * 0.24)} w={140} color={THEME.colors.yellow} delay={20} />
    </>
  );
};
