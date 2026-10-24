import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { THEME } from "../data/theme";

/* ---------- tokens ---------- */

export const SAFE = THEME.layout.safeMargin;
export const INK = THEME.colors.text;
export const PAPER = THEME.colors.background;
export const SURFACE = THEME.colors.surface;
export const AGED = THEME.colors.surfaceAlt;
export const GREY = THEME.colors.textSecondary;
export const YELLOW = THEME.colors.accent;
export const RED = THEME.colors.accentAlt;
export const BLUE = THEME.colors.accentBlue;

const EASE = THEME.motion.easing as unknown as [number, number, number, number];
export const ease = Easing.bezier(...EASE);

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/* ---------- animation hooks ---------- */

export const useAnim = (delay = 0, duration = 12): number => {
  const frame = useCurrentFrame();
  return interpolate(frame, [delay, delay + duration], [0, 1], { ...clamp, easing: ease });
};

export const usePop = (delay = 0, from = 0.55): number => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({
    frame: frame - delay,
    fps,
    config: THEME.motion.spring,
    durationInFrames: 18,
    from,
    to: 1,
  });
};

/** Small impact shake, decaying over `frames` after `at`. */
export const useJolt = (at = 0, frames = 8, amount = 4): number => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [at, at + frames], [1, 0], clamp);
  return Math.sin((frame - at) * 2.4) * amount * p;
};

/* ---------- paper ---------- */

export const Paper: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill
    style={{
      backgroundColor: PAPER,
      backgroundImage: `radial-gradient(circle, ${THEME.illustration.dotGrid} 1.6px, transparent 1.7px)`,
      backgroundSize: "34px 34px",
      overflow: "hidden",
      fontFamily: THEME.fonts.body,
      color: INK,
    }}
  >
    {children}
  </AbsoluteFill>
);

export const Fig: React.FC<{ n: number; note?: string }> = ({ n, note }) => (
  <div
    style={{
      position: "absolute",
      left: SAFE,
      top: 44,
      fontFamily: THEME.fonts.mono,
      fontSize: 21,
      letterSpacing: "0.16em",
      color: GREY,
      transform: "rotate(-1.4deg)",
      zIndex: 40,
    }}
  >
    FIG. {String(n).padStart(2, "0")}
    {note ? ` — ${note}` : ""}
  </div>
);

/* ---------- ink ---------- */

type InkProps = {
  d: string;
  delay?: number;
  dur?: number;
  w?: number;
  color?: string;
  fill?: string;
  dashed?: boolean;
  opacity?: number;
  dashArray?: string;
  dashOffset?: number;
};

export const Ink: React.FC<InkProps> = ({
  d,
  delay = 0,
  dur = 12,
  w = THEME.illustration.stroke,
  color = INK,
  fill,
  dashed = false,
  opacity = 1,
  dashArray,
  dashOffset,
}) => {
  const p = useAnim(delay, dur);
  const fillP = useAnim(delay + Math.round(dur * 0.45), Math.round(dur * 0.8));
  return (
    <path
      d={d}
      fill={fill ?? "none"}
      fillOpacity={fill ? fillP : undefined}
      stroke={color}
      strokeWidth={w}
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity={dashed ? p * opacity : opacity}
      {...(dashed
        ? {
            strokeDasharray: dashArray ?? THEME.illustration.dash,
            strokeDashoffset: dashOffset,
          }
        : { pathLength: 1, strokeDasharray: "1", strokeDashoffset: 1 - p })}
    />
  );
};

/* ---------- type blocks ---------- */

export const Marker: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  delay?: number;
  rotate?: number;
  color?: string;
  opacity?: number;
  dur?: number;
}> = ({ x, y, w, h, delay = 0, rotate = 0, color = YELLOW, opacity = 0.88, dur = 7 }) => {
  const p = useAnim(delay, dur);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h,
        background: color,
        opacity,
        transform: `rotate(${rotate}deg) scaleX(${p}) skewX(-1.5deg)`,
        transformOrigin: "left center",
        zIndex: 0,
      }}
    />
  );
};

/** Mono/body text that reveals like it is being typed. */
export const Type: React.FC<{
  text: string;
  delay?: number;
  dur?: number;
  style?: React.CSSProperties;
}> = ({ text, delay = 0, dur = 18, style }) => {
  const p = useAnim(delay, dur);
  return (
    <div
      style={{
        clipPath: `inset(-10% ${(1 - p) * 100}% -10% -2%)`,
        whiteSpace: "pre-wrap",
        ...style,
      }}
    >
      {text}
    </div>
  );
};

export const Stamp: React.FC<{
  text: string;
  x: number;
  y: number;
  size?: number;
  rotate?: number;
  color?: string;
  delay?: number;
  filled?: boolean;
  pad?: string;
  border?: number;
  opacity?: number;
}> = ({
  text,
  x,
  y,
  size = 64,
  rotate = -6,
  color = RED,
  delay = 0,
  filled = false,
  pad = "14px 26px",
  border = 6,
  opacity = 1,
}) => {
  const s = usePop(delay, 1.9);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `rotate(${rotate}deg) scale(${s})`,
        transformOrigin: "center",
        border: `${border}px solid ${color}`,
        borderRadius: 4,
        padding: pad,
        fontFamily: THEME.fonts.heading,
        fontWeight: THEME.fonts.headingWeight,
        fontSize: size,
        lineHeight: 0.9,
        letterSpacing: "0.02em",
        color: filled ? PAPER : color,
        background: filled ? color : "transparent",
        opacity: s * opacity,
        textTransform: "uppercase",
        whiteSpace: "nowrap",
        zIndex: 20,
      }}
    >
      {text}
    </div>
  );
};

/* ---------- sheets / notes ---------- */

export const Sheet: React.FC<{
  x: number;
  y: number;
  w: number;
  h?: number;
  rotate?: number;
  delay?: number;
  fill?: string;
  children?: React.ReactNode;
  border?: number;
  style?: React.CSSProperties;
}> = ({
  x,
  y,
  w,
  h,
  rotate = 0,
  delay = 0,
  fill = SURFACE,
  children,
  border = 4,
  style,
}) => {
  const s = usePop(delay, 0.82);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h,
        background: fill,
        border: `${border}px solid ${INK}`,
        boxShadow: THEME.treatment.shadow,
        transform: `rotate(${rotate}deg) scale(${s})`,
        transformOrigin: "center",
        padding: 26,
        boxSizing: "border-box",
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export const Sticky: React.FC<{
  x: number;
  y: number;
  w: number;
  rotate?: number;
  bg?: string;
  delay?: number;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ x, y, w, rotate = -4, bg = YELLOW, delay = 0, children, style }) => {
  const s = usePop(delay, 0.5);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        background: bg,
        padding: "20px 22px",
        boxShadow: "6px 7px 0 rgba(20,20,20,0.28)",
        transform: `rotate(${rotate}deg) scale(${s})`,
        fontFamily: THEME.fonts.body,
        fontWeight: 700,
        color: INK,
        boxSizing: "border-box",
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/* ---------- UI chrome ---------- */

export const Win: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  url?: string;
  delay?: number;
  children?: React.ReactNode;
  accent?: string;
  rotate?: number;
}> = ({ x, y, w, h, url = "", delay = 0, children, accent = INK, rotate = 0 }) => {
  const s = usePop(delay, 0.9);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h,
        background: SURFACE,
        border: `4px solid ${accent}`,
        boxShadow: THEME.treatment.shadow,
        transform: `rotate(${rotate}deg) scale(${s})`,
        overflow: "hidden",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          height: 46,
          borderBottom: `3px solid ${accent}`,
          background: AGED,
          display: "flex",
          alignItems: "center",
          padding: "0 14px",
          gap: 9,
        }}
      >
        {[RED, YELLOW, BLUE].map((c) => (
          <div
            key={c}
            style={{ width: 13, height: 13, borderRadius: 99, border: `2px solid ${accent}`, background: c }}
          />
        ))}
        <div
          style={{
            marginLeft: 12,
            flex: 1,
            fontFamily: THEME.fonts.mono,
            fontSize: 20,
            color: GREY,
            whiteSpace: "nowrap",
            overflow: "hidden",
          }}
        >
          {url}
        </div>
      </div>
      <div style={{ position: "relative", height: `calc(100% - 46px)` }}>{children}</div>
    </div>
  );
};

/* ---------- shapes ---------- */

export const Arrow: React.FC<{
  from: [number, number];
  to: [number, number];
  curve?: number;
  delay?: number;
  dur?: number;
  w?: number;
  color?: string;
  dashed?: boolean;
}> = ({ from, to, curve = 0, delay = 0, dur = 12, w = 5, color = INK, dashed = false }) => {
  const [x1, y1] = from;
  const [x2, y2] = to;
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy) || 1;
  const cx = mx + (-dy / len) * curve;
  const cy = my + (dx / len) * curve;
  const angle = Math.atan2(y2 - cy, x2 - cx);
  const h = 16;
  const a1 = angle + Math.PI - 0.5;
  const a2 = angle + Math.PI + 0.5;
  return (
    <g>
      <Ink
        d={`M${x1} ${y1} Q${cx} ${cy} ${x2} ${y2}`}
        delay={delay}
        dur={dur}
        w={w}
        color={color}
        dashed={dashed}
      />
      <Ink
        d={`M${x2} ${y2} L${x2 + h * Math.cos(a1)} ${y2 + h * Math.sin(a1)}`}
        delay={delay + Math.round(dur * 0.75)}
        dur={6}
        w={w}
        color={color}
      />
      <Ink
        d={`M${x2} ${y2} L${x2 + h * Math.cos(a2)} ${y2 + h * Math.sin(a2)}`}
        delay={delay + Math.round(dur * 0.75)}
        dur={6}
        w={w}
        color={color}
      />
    </g>
  );
};

export const Cross: React.FC<{
  x: number;
  y: number;
  size: number;
  delay?: number;
  color?: string;
  w?: number;
}> = ({ x, y, size, delay = 0, color = RED, w = 9 }) => (
  <g>
    <Ink d={`M${x} ${y} L${x + size} ${y + size}`} delay={delay} dur={7} w={w} color={color} />
    <Ink
      d={`M${x + size} ${y} L${x} ${y + size}`}
      delay={delay + 5}
      dur={7}
      w={w}
      color={color}
    />
  </g>
);

export const Check: React.FC<{
  x: number;
  y: number;
  size?: number;
  delay?: number;
  color?: string;
  w?: number;
}> = ({ x, y, size = 26, delay = 0, color = INK, w = 6 }) => (
  <Ink
    d={`M${x} ${y} L${x + size * 0.35} ${y + size * 0.38} L${x + size} ${y - size * 0.3}`}
    delay={delay}
    dur={8}
    w={w}
    color={color}
  />
);

export const CircleScribble: React.FC<{
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  rotate?: number;
  delay?: number;
  dur?: number;
  color?: string;
  w?: number;
}> = ({ cx, cy, rx, ry, rotate = -4, delay = 0, dur = 20, color = RED, w = 6 }) => {
  const d = `M${cx - rx} ${cy} C${cx - rx} ${cy - ry} ${cx + rx * 0.9} ${cy - ry * 1.15} ${cx + rx} ${cy - ry * 0.1} C${cx + rx * 1.05} ${cy + ry} ${cx - rx * 0.85} ${cy + ry * 1.1} ${cx - rx * 0.95} ${cy + ry * 0.05}`;
  return (
    <g transform={`rotate(${rotate} ${cx} ${cy})`}>
      <Ink d={d} delay={delay} dur={dur} color={color} w={w} />
    </g>
  );
};

export const Bubble: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  delay?: number;
  tail?: "left" | "right" | "bottom" | "none";
  children?: React.ReactNode;
  fill?: string;
  rotate?: number;
}> = ({ x, y, w, h, delay = 0, tail = "bottom", children, fill = SURFACE, rotate = 0 }) => {
  const s = usePop(delay, 0.6);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h,
        background: fill,
        border: `5px solid ${INK}`,
        borderRadius: 26,
        transform: `rotate(${rotate}deg) scale(${s})`,
        boxSizing: "border-box",
        padding: 34,
        zIndex: 10,
      }}
    >
      {children}
      {tail !== "none" && (
        <div
          style={{
            position: "absolute",
            width: 34,
            height: 34,
            background: fill,
            borderRight: `5px solid ${INK}`,
            borderBottom: `5px solid ${INK}`,
            ...(tail === "bottom"
              ? { left: 70, bottom: -21, transform: "rotate(45deg)" }
              : tail === "right"
                ? { right: -21, top: 50, transform: "rotate(-45deg)" }
                : { left: -21, top: 50, transform: "rotate(135deg)" }),
          }}
        />
      )}
    </div>
  );
};

/* ---------- Rohan ---------- */

const ROHAN = {
  shoulders:
    "M42 344 C48 302 86 280 126 274 L128 262 L178 262 L180 274 C220 280 258 302 264 344 Z",
  head: "M66 150 C62 86 102 50 154 50 C208 50 244 88 242 150 C240 214 206 252 152 252 C98 252 64 214 66 150 Z",
  hair: "M58 148 C48 82 96 30 158 30 C220 30 258 74 250 142 C240 116 226 98 208 90 C196 108 176 116 152 114 C126 112 108 102 96 86 C82 100 68 120 58 148 Z",
  earL: "M66 152 C52 148 50 176 68 180",
  earR: "M242 150 C256 146 258 174 240 178",
  glassesL:
    "M88 142 C88 132 100 128 116 128 L142 128 C150 128 154 134 154 142 L154 168 C154 178 146 182 136 182 L104 182 C94 182 88 176 88 168 Z",
  glassesR:
    "M166 142 C166 132 174 128 184 128 L210 128 C224 128 232 134 232 142 L232 168 C232 178 226 182 214 182 L182 182 C172 182 166 176 166 168 Z",
  bridge: "M154 150 C158 146 162 146 166 150",
  templeL: "M88 150 L68 152",
  templeR: "M232 150 L242 150",
  eyeL: "M118 159 L121 159",
  eyeR: "M199 159 L202 159",
  bagL: "M108 178 C116 184 126 184 134 178",
  bagR: "M184 178 C192 184 202 184 210 178",
  nose: "M152 170 L148 191 C151 194 156 194 159 191",
  neckL: "M130 250 L126 278",
  neckR: "M176 250 L180 278",
  collar: "M116 276 C132 300 174 300 190 276",
  stringL: "M146 292 L144 326",
  stringR: "M162 292 L164 326",
  pocket: "M112 344 C114 324 132 318 150 318 C168 318 188 324 190 344",
};

export type RohanMood = "flat" | "sad" | "happy";

export const Rohan: React.FC<{
  x: number;
  y: number;
  scale?: number;
  delay?: number;
  mood?: RohanMood;
  crossed?: boolean;
  opacity?: number;
}> = ({ x, y, scale = 1, delay = 0, mood = "flat", crossed = false, opacity = 1 }) => {
  const mouth =
    mood === "happy"
      ? "M130 212 C144 226 162 226 176 212"
      : mood === "sad"
        ? "M132 221 C144 212 162 212 174 221"
        : "M134 217 L170 217";
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} opacity={opacity}>
      <Ink d={ROHAN.shoulders} delay={delay} dur={12} fill={AGED} />
      <Ink d={ROHAN.neckL} delay={delay + 2} dur={6} />
      <Ink d={ROHAN.neckR} delay={delay + 2} dur={6} />
      <Ink d={ROHAN.head} delay={delay + 4} dur={14} fill={SURFACE} />
      <Ink d={ROHAN.earL} delay={delay + 8} dur={5} />
      <Ink d={ROHAN.earR} delay={delay + 8} dur={5} />
      <Ink d={ROHAN.hair} delay={delay + 6} dur={12} fill={INK} />
      <Ink d={ROHAN.templeL} delay={delay + 12} dur={4} w={THEME.illustration.strokeHair} />
      <Ink d={ROHAN.templeR} delay={delay + 12} dur={4} w={THEME.illustration.strokeHair} />
      <Ink d={ROHAN.glassesL} delay={delay + 12} dur={8} w={5} />
      <Ink d={ROHAN.glassesR} delay={delay + 12} dur={8} w={5} />
      <Ink d={ROHAN.bridge} delay={delay + 16} dur={4} w={5} />
      <Ink d={ROHAN.eyeL} delay={delay + 18} dur={3} w={9} />
      <Ink d={ROHAN.eyeR} delay={delay + 18} dur={3} w={9} />
      <Ink d={ROHAN.bagL} delay={delay + 20} dur={6} w={THEME.illustration.strokeHair} color={GREY} />
      <Ink d={ROHAN.bagR} delay={delay + 20} dur={6} w={THEME.illustration.strokeHair} color={GREY} />
      <Ink d={ROHAN.nose} delay={delay + 18} dur={6} w={4} />
      <Ink d={mouth} delay={delay + 22} dur={5} w={5} />
      <Ink d={ROHAN.collar} delay={delay + 14} dur={8} />
      <Ink d={ROHAN.stringL} delay={delay + 18} dur={5} w={4} />
      <Ink d={ROHAN.stringR} delay={delay + 19} dur={5} w={4} />
      <Ink d={ROHAN.pocket} delay={delay + 16} dur={8} w={4} color={GREY} />
      {crossed && (
        <>
          <Ink d="M56 330 C92 304 130 304 154 322" delay={delay + 24} dur={6} w={7} />
          <Ink d="M248 330 C214 304 176 304 154 322" delay={delay + 26} dur={6} w={7} />
          <ellipse cx={154} cy={322} rx={13} ry={9} fill={SURFACE} stroke={INK} strokeWidth={5} />
        </>
      )}
    </g>
  );
};

/* ---------- misc ---------- */

export const Num: React.FC<{
  value: number;
  delay?: number;
  dur?: number;
  prefix?: string;
  suffix?: string;
  format?: (n: number) => string;
  style?: React.CSSProperties;
}> = ({ value, delay = 0, dur = 30, prefix = "", suffix = "", format, style }) => {
  const p = useAnim(delay, dur);
  const n = Math.round(value * p);
  return (
    <div style={style}>
      {prefix}
      {format ? format(n) : n.toLocaleString("en-US")}
      {suffix}
    </div>
  );
};

/** Tiny hanging tape strip for pasted sheets. */
export const Tape: React.FC<{ x: number; y: number; rotate?: number; w?: number }> = ({
  x,
  y,
  rotate = -8,
  w = 90,
}) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: w,
      height: 30,
      background: "rgba(255,212,0,0.55)",
      transform: `rotate(${rotate}deg)`,
      zIndex: 30,
    }}
  />
);
