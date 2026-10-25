// Paper Collage — the paper kit.
// Torn and cut paper pieces, bands, labels, numerals and cut-paper arrows.
// Depth (z-order + entrance delay) is driven by the `depth` prop.

import React from "react";
import { useVideoConfig } from "remotion";
import { THEME } from "../tokens";
import { grainCss, inkOn, layerDelay, stock, tornPolygon, useEnter, usePlace, useProgress, type Stock } from "../lib/anim";

type Sides = { t?: boolean; r?: boolean; b?: boolean; l?: boolean };

const SHADOW: Record<"lift" | "piece" | "flat", string> = {
  lift: "drop-shadow(0 10px 16px rgba(41,43,50,0.24))",
  piece: "drop-shadow(0 5px 9px rgba(41,43,50,0.18))",
  flat: "drop-shadow(0 2px 4px rgba(41,43,50,0.12))",
};

/**
 * One piece of paper: clipped, seeded rotation, place-in animation.
 * Coordinates are pixels in scene space; `depth` 0 (background) → 4 (accent).
 */
export const PaperPiece: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  color?: string;
  stockName?: Stock;
  rotate?: number;
  depth?: number;
  index?: number;
  seed?: number;
  torn?: Sides | false;
  shadow?: "lift" | "piece" | "flat";
  delay?: number;
  dx?: number;
  dy?: number;
  padding?: number;
  align?: "flex-start" | "center" | "flex-end";
  children?: React.ReactNode;
}> = ({
  x,
  y,
  w,
  h,
  color,
  stockName = "white",
  rotate = 0,
  depth = 2,
  index = 0,
  seed = 1,
  torn = { t: true, b: true },
  shadow = "piece",
  delay,
  dx = 0,
  dy = depth <= 1 ? 64 : 44,
  padding = 28,
  align = "flex-start",
  children,
}) => {
  const d = delay ?? layerDelay(depth, index);
  const place = usePlace(d, { dx, dy, rot: rotate });
  const bg = color ?? stock(stockName);
  const clip = torn === false ? undefined : tornPolygon(w, h, seed, torn);

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h,
        opacity: place.opacity,
        transform: place.transform,
        transformOrigin: "50% 50%",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: bg,
          backgroundImage: grainCss(),
          clipPath: clip,
          filter: SHADOW[shadow],
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          padding,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: align,
          color: inkOn(stockName),
        }}
      >
        {children}
      </div>
    </div>
  );
};

/** Full-bleed torn divider strip. */
export const TornBand: React.FC<{
  /** 0..1 vertical position of the band's top edge. */
  at: number;
  h?: number;
  color?: string;
  stockName?: Stock;
  seed?: number;
  delay?: number;
  children?: React.ReactNode;
}> = ({ at, h = 150, color, stockName = "terracotta", seed = 7, delay, children }) => {
  const { width, height } = useVideoConfig();
  return (
    <PaperPiece
      x={0}
      y={Math.round(height * at)}
      w={width}
      h={h}
      color={color}
      stockName={stockName}
      depth={1}
      seed={seed}
      torn={{ t: true, b: true }}
      shadow="piece"
      delay={delay}
      dy={80}
      padding={0}
    >
      {children ? (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            padding: `0 ${THEME.layout.safeMargin}px`,
            color: inkOn(stockName),
          }}
        >
          {children}
        </div>
      ) : null}
    </PaperPiece>
  );
};

/** Circle cut-out — the stand-in for an object, photo or emphasis. */
export const CutCircle: React.FC<{
  x: number;
  y: number;
  d: number;
  color?: string;
  stockName?: Stock;
  depth?: number;
  index?: number;
  seed?: number;
  delay?: number;
  rotate?: number;
  children?: React.ReactNode;
}> = ({ x, y, d, color, stockName = "blue", depth = 3, index = 0, seed = 5, delay, rotate = 0, children }) => {
  const place = usePlace(delay ?? layerDelay(depth, index), { dx: 0, dy: 40, rot: rotate, spin: rotate + 10 });
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: d,
        height: d,
        borderRadius: "50%",
        backgroundColor: color ?? stock(stockName),
        backgroundImage: grainCss(),
        filter: SHADOW.piece,
        opacity: place.opacity,
        transform: place.transform,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: inkOn(stockName),
        textAlign: "center",
      }}
    >
      {children}
    </div>
  );
};

/** Small printed label — the "sticker" face, tracked uppercase. */
export const LabelStrip: React.FC<{
  x: number;
  y: number;
  text: string;
  color?: string;
  stockName?: Stock;
  rotate?: number;
  depth?: number;
  index?: number;
  delay?: number;
  size?: number;
}> = ({ x, y, text, color, stockName = "mustard", rotate = -1.4, depth = 4, index = 0, delay, size = THEME.paper.labelSize }) => {
  const place = usePlace(delay ?? layerDelay(depth, index), { dx: -24, dy: 16, rot: rotate, spin: rotate + 5 });
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        padding: "10px 18px",
        backgroundColor: color ?? stock(stockName),
        backgroundImage: grainCss(),
        color: inkOn(stockName),
        fontFamily: THEME.fonts.label,
        fontWeight: THEME.fonts.labelWeight,
        fontSize: size,
        letterSpacing: "0.16em",
        textTransform: "uppercase",
        whiteSpace: "nowrap",
        boxShadow: THEME.paper.shadowFlat,
        opacity: place.opacity,
        transform: place.transform,
      }}
    >
      {text}
    </div>
  );
};

/** Card with a folded corner. */
export const FoldCard: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  fold?: number;
  color?: string;
  stockName?: Stock;
  rotate?: number;
  depth?: number;
  index?: number;
  seed?: number;
  delay?: number;
  children?: React.ReactNode;
}> = ({ x, y, w, h, fold = 46, color, stockName = "white", rotate = 1.2, depth = 3, index = 0, seed = 9, delay, children }) => {
  const d = delay ?? layerDelay(depth, index);
  const place = usePlace(d, { dx: 0, dy: 52, rot: rotate, spin: rotate + 6 });
  const f = Math.min(fold, Math.min(w, h) / 3);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h,
        opacity: place.opacity,
        transform: place.transform,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: color ?? stock(stockName),
          backgroundImage: grainCss(),
          clipPath: `polygon(0px 0px, ${(w - f).toFixed(1)}px 0px, ${w}px ${f}px, ${w}px ${h}px, 0px ${h}px)`,
          filter: SHADOW.lift,
        }}
      />
      {/* the fold itself */}
      <div
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          width: f,
          height: f,
          background: THEME.colors.kraft,
          clipPath: `polygon(0px 0px, ${f}px ${f}px, 0px ${f}px)`,
          opacity: 0.9,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          padding: 30,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 10,
          color: inkOn(stockName),
        }}
      >
        {children}
      </div>
    </div>
  );
};

/** Oversized paper numeral with a backing scrap. */
export const CutOutNumeral: React.FC<{
  n: string | number;
  x: number;
  y: number;
  size?: number;
  color?: string;
  stockName?: Stock;
  rotate?: number;
  depth?: number;
  index?: number;
  delay?: number;
}> = ({ n, x, y, size = 240, color, stockName = "terracotta", rotate = -3, depth = 3, index = 0, delay }) => {
  const place = usePlace(delay ?? layerDelay(depth, index), { dx: 0, dy: 60, rot: rotate, spin: rotate + 9 });
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        opacity: place.opacity,
        transform: place.transform,
        fontFamily: THEME.fonts.heading,
        fontWeight: THEME.fonts.headingWeight,
        fontSize: size,
        lineHeight: 0.86,
        color: color ?? stock(stockName),
        textShadow: THEME.paper.shadowPiece,
        letterSpacing: "-0.03em",
      }}
    >
      {n}
    </div>
  );
};

/** Chunky cut-paper arrow. */
export const CollageArrow: React.FC<{
  x: number;
  y: number;
  w?: number;
  h?: number;
  dir?: "right" | "down" | "left";
  color?: string;
  rotate?: number;
  depth?: number;
  index?: number;
  delay?: number;
}> = ({ x, y, w = 260, h = 74, dir = "right", color, rotate = -4, depth = 4, index = 0, delay }) => {
  const place = usePlace(delay ?? layerDelay(depth, index), { dx: dir === "left" ? -40 : 40, dy: dir === "down" ? 40 : 0, rot: rotate, spin: rotate + 6 });
  const flip = dir === "left" ? " scaleX(-1)" : "";
  const down = dir === "down" ? " rotate(90deg)" : "";
  return (
    <svg
      width={w}
      height={h}
      viewBox="0 0 260 74"
      style={{
        position: "absolute",
        left: x,
        top: y,
        overflow: "visible",
        opacity: place.opacity,
        transform: `${place.transform}${down}${flip}`,
        transformOrigin: "50% 50%",
      }}
    >
      <path
        d="M0 26 H168 V4 L258 37 L168 70 V48 H0 Z"
        fill={color ?? stock("ink")}
        stroke="none"
      />
    </svg>
  );
};

/** The occasional handwritten annotation. */
export const HandNote: React.FC<{
  x: number;
  y: number;
  children: React.ReactNode;
  rotate?: number;
  color?: string;
  size?: number;
  delay?: number;
}> = ({ x, y, children, rotate = -1.6, color = THEME.colors.text, size = 30, delay }) => {
  const p = useProgress(delay ?? 62, 18);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        maxWidth: 520,
        fontFamily: THEME.fonts.annotation,
        fontSize: size,
        lineHeight: 1.3,
        color,
        transform: `rotate(${rotate}deg) translateY(${((1 - p) * 14).toFixed(2)}px)`,
        opacity: p,
      }}
    >
      {children}
    </div>
  );
};

/** Small printed caption in the body serif. */
export const Caption: React.FC<{
  x: number;
  y: number;
  w: number;
  children: React.ReactNode;
  delay?: number;
  size?: number;
}> = ({ x, y, w, children, delay = 40, size = THEME.paper.captionSize }) => {
  const enter = useEnter(delay, 16);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        fontFamily: THEME.fonts.body,
        fontSize: size,
        lineHeight: 1.45,
        letterSpacing: "0.01em",
        color: THEME.colors.textSecondary,
        opacity: enter.opacity,
        transform: enter.transform,
      }}
    >
      {children}
    </div>
  );
};

/** Full-frame procedural grain — guarded by THEME.treatment.grain. */
export const GrainOverlay: React.FC<{ opacity?: number }> = ({ opacity = THEME.paper.grainOpacity * 1.6 }) => {
  if (!THEME.treatment.grain) return null;
  return <div aria-hidden style={{ position: "absolute", inset: 0, pointerEvents: "none", ...grainCss(opacity) }} />;
};