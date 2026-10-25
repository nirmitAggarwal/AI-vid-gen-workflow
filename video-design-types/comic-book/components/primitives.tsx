// Comic Book — drawing kit.
// Pop-art primitives: bordered panels, speech/shout balloons with tails,
// jagged bursts, slam-in action words, narrator caption boxes, speed lines,
// halftone. Every element bounces in; the big hits shake the frame.

import React from "react";
import { useVideoConfig } from "remotion";
import { THEME } from "../tokens";
import {
  actionTypeStyle,
  burstPolygon,
  fitSize,
  halftoneCss,
  usePop,
  useProgress,
  useShake,
  useSlam,
  useSpeedLines,
  useTail,
  wrapText,
} from "../lib/anim";

// ------------------------------------------------------------------ panels

/** Black-bordered panel that pops in with a bounce. Fills a normalised box. */
export const Panel: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  fill?: string;
  delay?: number;
  halftone?: boolean;
  children?: React.ReactNode;
  index?: number;
}> = ({ x, y, w, h, fill = THEME.colors.blue, delay = 0, halftone = true, children, index = 0 }) => {
  const pop = usePop(delay + index * THEME.motion.panelStagger);
  const shake = useShake(delay + index * THEME.motion.panelStagger, index + 2);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h,
        background: fill,
        border: `${THEME.comic.panelBorder}px solid ${THEME.colors.black}`,
        borderRadius: THEME.treatment.radius,
        boxShadow: THEME.treatment.shadow,
        boxSizing: "border-box",
        overflow: "hidden",
        transform: pop.transform,
        opacity: pop.opacity,
      }}
    >
      {halftone ? <div style={{ position: "absolute", inset: 0, ...halftoneCss(THEME.colors.black) }} /> : null}
      {children}
    </div>
  );
};

/** Halftone overlay layer (outside panels — over the whole page). */
export const HalftoneOverlay: React.FC<{ color?: string; opacity?: number }> = ({ color = THEME.colors.black, opacity }) => (
  <div style={{ position: "absolute", inset: 0, pointerEvents: "none", ...halftoneCss(color, opacity ?? THEME.comic.halftoneOpacity) }} />
);

/** Streaking speed lines behind everything — runs forever. */
export const SpeedLines: React.FC<{
  delay?: number;
  color?: string;
  angle?: number;
  opacity?: number;
}> = ({ delay = 0, color = THEME.colors.black, angle = 72, opacity = 0.14 }) => {
  const off = useSpeedLines(delay);
  return (
    <div
      style={{
        position: "absolute",
        inset: -60,
        opacity,
        backgroundImage: `repeating-linear-gradient(${angle}deg, ${color} 0 ${THEME.comic.speedWidth}px, transparent ${THEME.comic.speedWidth}px ${THEME.comic.speedGap}px)`,
        backgroundPosition: `${off.toFixed(2)}px 0`,
        pointerEvents: "none",
      }}
    />
  );
};

/** Full-bleed colour field (splash backgrounds). */
export const ColorField: React.FC<{ color?: string; delay?: number }> = ({ color = THEME.colors.yellow, delay = 0 }) => {
  const p = useProgress(delay, 10);
  return <div style={{ position: "absolute", inset: 0, background: color, opacity: p * 0.5 }} />;
};

// --------------------------------------------------------------- balloons

/** Speech balloon with a tail. Pops in; tail arrives a beat later. */
export const SpeechBalloon: React.FC<{
  text: string;
  x: number;
  y: number;
  w?: number;
  delay?: number;
  tail?: "left" | "right" | "bottom";
  kind?: "speech" | "shout";
  fill?: string;
  rotate?: number;
}> = ({ text, x, y, w, delay = 0, tail = "left", kind = "speech", fill = THEME.colors.white, rotate = 0 }) => {
  const { width: vw } = useVideoConfig();
  const m = THEME.layout.safeMargin;
  const boxW = w ?? Math.min(620, vw - m * 2);
  const sz = 40;
  const lines = wrapText(text, Math.max(8, Math.floor(boxW / (sz * 0.62))));
  const pad = THEME.comic.balloonPad;
  const pop = usePop(delay);
  const tailPop = useTail(delay + 4);
  const tailStyle: React.CSSProperties =
    tail === "bottom"
      ? { left: "22%", bottom: -THEME.comic.tailSize * 0.72 }
      : tail === "right"
        ? { right: -THEME.comic.tailSize * 0.7, bottom: -8 }
        : { left: -THEME.comic.tailSize * 0.7, bottom: -8 };
  const shout = kind === "shout";
  return (
    <div style={{ position: "absolute", left: x, top: y, width: boxW, transform: `rotate(${rotate}deg)`, opacity: pop.opacity }}>
      <div
        style={{
          position: "relative",
          background: fill,
          border: `${THEME.comic.panelBorder}px solid ${THEME.colors.black}`,
          borderRadius: shout ? 6 : 999,
          boxShadow: THEME.treatment.shadow,
          padding: `${pad}px ${pad + 6}px`,
          boxSizing: "border-box",
          transform: pop.transform,
        }}
      >
        <div
          style={{
            fontFamily: THEME.fonts.balloon,
            fontWeight: THEME.fonts.headingWeight,
            fontSize: sz,
            lineHeight: THEME.fonts.lineHeights.body,
            textTransform: "uppercase",
            letterSpacing: "0.02em",
            color: THEME.colors.black,
            textAlign: "center",
          }}
        >
          {lines.join("\n")}
        </div>
        {/* tail: triangle in the balloon's ink colour */}
        <div
          style={{
            position: "absolute",
            ...tailStyle,
            width: 0,
            height: 0,
            borderLeft: `${THEME.comic.tailSize / 2}px solid transparent`,
            borderRight: `${THEME.comic.tailSize / 2}px solid transparent`,
            borderTop: `${THEME.comic.tailSize}px solid ${THEME.colors.black}`,
            transformOrigin: tail === "right" ? "top right" : "top left",
            transform: tailPop.transform,
            opacity: tailPop.opacity,
          }}
        />
      </div>
    </div>
  );
};

/** Jagged shout burst with the line inside — the POW panel. */
export const ShoutBurst: React.FC<{
  text: string;
  x: number;
  y: number;
  w?: number;
  h?: number;
  delay?: number;
  fill?: string;
  color?: string;
  seed?: number;
  rotate?: number;
}> = ({ text, x, y, w, h, delay = 0, fill = THEME.colors.yellow, color = THEME.colors.black, seed = 7, rotate = -3 }) => {
  const { width: vw } = useVideoConfig();
  const bw = w ?? Math.round(vw * 0.78);
  const bh = h ?? Math.round(bw * 0.62);
  const pop = usePop(delay, 0.3);
  const sz = fitSize(text, bw * 0.6, THEME.comic.actionMax, THEME.comic.actionMin, THEME.comic.charRatio, 2);
  return (
    <div style={{ position: "absolute", left: x, top: y, width: bw, height: bh, transform: `rotate(${rotate}deg) ${pop.transform}`, opacity: pop.opacity }}>
      <div style={{ position: "absolute", inset: 0, background: fill, clipPath: burstPolygon(bw, bh, seed), border: 0 }} />
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", padding: bw * 0.12 }}>
        <div
          style={{
            fontFamily: THEME.fonts.display,
            fontSize: sz,
            lineHeight: 0.94,
            textAlign: "center",
            textTransform: "uppercase",
            ...actionTypeStyle(color),
          }}
        >
          {text}
        </div>
      </div>
    </div>
  );
};

/** Action word: slams in oversized, outlined, shaking the frame. */
export const ActionWord: React.FC<{
  text: string;
  x?: number;
  y?: number;
  size?: number;
  color?: string;
  stroke?: string;
  delay?: number;
  rotate?: number;
  shake?: boolean;
  align?: "left" | "center" | "right";
}> = ({ text, x, y, size, color = THEME.colors.red, stroke, delay = 0, rotate = -6, shake = true, align = "center" }) => {
  const { width: vw, height: vh } = useVideoConfig();
  const m = THEME.layout.safeMargin;
  const sz = size ?? fitSize(text, vw - m * 2, THEME.comic.actionMax, THEME.comic.actionMin, THEME.comic.charRatio, 2);
  const slam = useSlam(delay, rotate);
  const shakeT = useShake(delay, 5);
  const left = align === "center" ? 0 : align === "right" ? undefined : x ?? m;
  const right = align === "right" ? m : undefined;
  return (
    <div
      style={{
        position: "absolute",
        left: left ?? 0,
        right,
        top: y ?? Math.round(vh * 0.4),
        textAlign: align,
        transform: shake ? shakeT : "translate(0px, 0px) rotate(0deg)",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          display: "inline-block",
          fontFamily: THEME.fonts.display,
          fontSize: sz,
          lineHeight: 0.92,
          textTransform: "uppercase",
          letterSpacing: "0.01em",
          transform: slam.transform,
          opacity: slam.opacity,
          ...actionTypeStyle(color, stroke),
        }}
      >
        {text}
      </div>
    </div>
  );
};

/** Narrator caption box — yellow rectangle, first thing the reader sees. */
export const CaptionBox: React.FC<{
  text: string;
  x?: number;
  y?: number;
  w?: number;
  delay?: number;
  rotate?: number;
  fill?: string;
}> = ({ text, x, y, w, delay = 0, rotate = -1.5, fill = THEME.colors.surfaceAlt }) => {
  const { width: vw } = useVideoConfig();
  const m = THEME.layout.safeMargin;
  const boxW = w ?? Math.min(700, vw - m * 2);
  const sz = THEME.comic.captionSize;
  const lines = wrapText(text, Math.max(14, Math.floor(boxW / (sz * 0.55))));
  const pop = usePop(delay, 0.7);
  return (
    <div
      style={{
        position: "absolute",
        left: x ?? m,
        top: y ?? m,
        width: boxW,
        background: fill,
        border: `5px solid ${THEME.colors.black}`,
        boxShadow: THEME.treatment.shadow,
        padding: "16px 20px",
        boxSizing: "border-box",
        transform: `rotate(${rotate}deg) ${pop.transform}`,
        opacity: pop.opacity,
      }}
    >
      <div
        style={{
          fontFamily: THEME.fonts.caption,
          fontSize: sz,
          lineHeight: THEME.fonts.lineHeights.body,
          color: THEME.colors.black,
        }}
      >
        {lines.join("\n")}
      </div>
    </div>
  );
};

/** Comic title lettering (Barge Black, stacked, outlined). */
export const ComicTitle: React.FC<{
  text: string;
  x?: number;
  y?: number;
  size?: number;
  color?: string;
  delay?: number;
  align?: "left" | "center";
}> = ({ text, x, y, size = 150, color = THEME.colors.yellow, delay = 0, align = "center" }) => {
  const m = THEME.layout.safeMargin;
  const slam = useSlam(delay, -3, 1.6);
  return (
    <div
      style={{
        position: "absolute",
        left: align === "center" ? 0 : x ?? m,
        right: align === "center" ? 0 : undefined,
        top: y ?? undefined,
        textAlign: align,
        transform: align === "center" ? `translateX(0)` : undefined,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          display: "inline-block",
          fontFamily: THEME.fonts.heading,
          fontWeight: THEME.fonts.headingWeight,
          fontSize: size,
          lineHeight: THEME.fonts.lineHeights.heading,
          textTransform: "uppercase",
          transform: slam.transform,
          opacity: slam.opacity,
          ...actionTypeStyle(color),
        }}
      >
        {text}
      </div>
    </div>
  );
};
