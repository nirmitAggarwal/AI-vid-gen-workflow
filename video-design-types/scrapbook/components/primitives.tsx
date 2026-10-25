// Scrapbook — page kit.
// Journal primitives: washi tape, polaroids with handwritten captions,
// stickers, ticket stubs, blanket-stitch frames, hand-written notes.
// Everything drops in at a casual angle and sways during the hold.

import React from "react";
import { useVideoConfig } from "remotion";
import { THEME } from "../tokens";
import { fitSize, grainCss, stagger, tilt, useDrop, useSway, useSticker, useStitch, useTape, useWrite, wrapText } from "../lib/anim";

// ------------------------------------------------------------------ polaroid

/** Photo field inside a polaroid — tinted gradient, no external assets. */
const photoTone = (tone: string): [string, string] => {
  switch (tone) {
    case "rose":
      return ["#D06B6B", "#F3D9D4"];
    case "sage":
      return ["#8AA88B", "#DEE8DC"];
    case "mustard":
      return ["#E5B84B", "#F7EAC8"];
    case "sky":
      return ["#8FB8D6", "#DCEAF4"];
    default:
      return ["#D9C2A0", "#F2E7D6"];
  }
};

/** A polaroid: white border, gradient photo, handwritten caption. Drops in. */
export const Polaroid: React.FC<{
  x: number;
  y: number;
  w?: number;
  h?: number;
  caption?: string;
  tone?: string;
  rotate?: number;
  seed?: number;
  delay?: number;
  sway?: boolean;
  tape?: boolean;
}> = ({ x, y, w, h, caption, tone = "sky", rotate, seed = 1, delay = 0, sway = true, tape = true }) => {
  const bw = w ?? 360;
  const bh = h ?? Math.round(bw * 1.18);
  const rot = rotate ?? tilt(seed, 5);
  const drop = useDrop(delay, rot);
  const swayT = sway ? useSway(delay + 24, seed) : "translateY(0px)";
  const [c0, c1] = photoTone(tone);
  const b = THEME.scrap.polaroidBorder;
  const photoH = bh - b * 2 - THEME.scrap.polaroidBottom;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: bw, opacity: drop.opacity, transform: `${drop.transform} ${swayT}` }}>
      <div
        style={{
          position: "relative",
          background: THEME.colors.white,
          padding: b,
          paddingBottom: THEME.scrap.polaroidBottom,
          boxShadow: THEME.treatment.shadow,
          boxSizing: "border-box",
        }}
      >
        <div style={{ width: "100%", height: photoH, background: `linear-gradient(148deg, ${c1} 0%, ${c0} 72%, ${c1} 100%)`, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, ...grainCss(0.07) }} />
          {/* simple "landscape" bands, purely decorative */}
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: "34%", background: c0, opacity: 0.65 }} />
        </div>
        {caption ? (
          <div
            style={{
              position: "absolute",
              left: b,
              right: b,
              bottom: Math.round(THEME.scrap.polaroidBottom * 0.24),
              fontFamily: THEME.fonts.heading,
              fontWeight: THEME.fonts.headingWeight,
              fontSize: THEME.scrap.polaroidCaption,
              lineHeight: 1.1,
              color: THEME.colors.ink,
              textAlign: "center",
              transform: `rotate(${tilt(seed + 4, 1.6)}deg)`,
            }}
          >
            {caption}
          </div>
        ) : null}
        {tape ? <WashiTape x={Math.round(bw * 0.28)} y={-Math.round(THEME.scrap.tapeH * 0.42)} w={Math.round(bw * 0.5)} rotate={tilt(seed + 9, 6)} delay={delay + 5} color={seed % 2 === 0 ? THEME.colors.rose : THEME.colors.sage} /> : null}
      </div>
    </div>
  );
};

// --------------------------------------------------------------------- tape

/** Washi tape strip: semi-transparent, striped, wipes down from one end. */
export const WashiTape: React.FC<{
  x: number;
  y: number;
  w?: number;
  h?: number;
  rotate?: number;
  color?: string;
  delay?: number;
}> = ({ x, y, w, h = THEME.scrap.tapeH, rotate = -4, color = THEME.colors.rose, delay = 0 }) => {
  const tape = useTape(delay);
  const tw = w ?? THEME.scrap.tapeW;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: tw,
        height: h,
        transform: `rotate(${rotate}deg)`,
        clipPath: tape.clipPath,
        opacity: tape.opacity,
        background: `repeating-linear-gradient(45deg, ${color} 0 10px, rgba(255,255,255,0.55) 10px 16px)`,
        boxShadow: "0 3px 8px rgba(58,52,43,0.16)",
      }}
    />
  );
};

// ------------------------------------------------------------------ stickers

/** Die-cut sticker (star / heart / flower / check) with a white outline. */
export const Sticker: React.FC<{
  kind?: "star" | "heart" | "flower" | "check";
  x: number;
  y: number;
  size?: number;
  color?: string;
  delay?: number;
  rotate?: number;
  seed?: number;
}> = ({ kind = "star", x, y, size = 120, color = THEME.colors.rose, delay = 0, seed = 2 }) => {
  const st = useSticker(delay);
  const outline = THEME.scrap.stickerOutline;
  const shapes: Record<string, string> = {
    star: "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
    heart: "polygon(50% 92%, 8% 52%, 4% 30%, 18% 10%, 38% 6%, 50% 20%, 62% 6%, 82% 10%, 96% 30%, 92% 52%)",
    flower: "polygon(50% 0%, 65% 20%, 92% 12%, 84% 40%, 100% 55%, 78% 66%, 84% 94%, 58% 84%, 42% 100%, 30% 76%, 4% 84%, 14% 56%, 0% 36%, 26% 30%)",
    check: "polygon(6% 38%, 22% 24%, 42% 52%, 84% 6%, 96% 20%, 44% 88%)",
  };
  const swayT = useSway(delay + 26, seed);
  return (
    <div style={{ position: "absolute", left: x, top: y, width: size, height: size, transform: `${st} ${swayT}` }}>
      <div
        style={{
          position: "absolute",
          inset: -outline,
          background: THEME.colors.white,
          clipPath: shapes[kind],
          transform: "scale(1.12)",
          filter: "drop-shadow(0 4px 8px rgba(58,52,43,0.22))",
        }}
      />
      <div style={{ position: "absolute", inset: 0, background: color, clipPath: shapes[kind] }} />
    </div>
  );
};

// -------------------------------------------------------------------- paper

/** Ticket stub: mustard card with a perforated edge and handwritten text. */
export const TicketStub: React.FC<{
  text: string;
  x: number;
  y: number;
  w?: number;
  h?: number;
  rotate?: number;
  seed?: number;
  delay?: number;
}> = ({ text, x, y, w, h = 120, rotate, seed = 6, delay = 0 }) => {
  const tw = w ?? 380;
  const rot = rotate ?? tilt(seed, 6);
  const drop = useDrop(delay, rot);
  const swayT = useSway(delay + 24, seed);
  return (
    <div style={{ position: "absolute", left: x, top: y, width: tw, opacity: drop.opacity, transform: `${drop.transform} ${swayT}` }}>
      <div
        style={{
          position: "relative",
          height: h,
          background: THEME.colors.mustard,
          border: `3px dashed ${THEME.colors.ink}`,
          boxShadow: THEME.treatment.shadow,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxSizing: "border-box",
          // punched notches, drawn with radial gradients on the stub itself
          maskImage: `radial-gradient(circle ${THEME.scrap.ticketNotch}px at 0 50%, transparent 98%, black 100%), radial-gradient(circle ${THEME.scrap.ticketNotch}px at 100% 50%, transparent 98%, black 100%)`,
          maskComposite: "intersect",
          WebkitMaskImage: `radial-gradient(circle ${THEME.scrap.ticketNotch}px at 0 50%, transparent 98%, black 100%), radial-gradient(circle ${THEME.scrap.ticketNotch}px at 100% 50%, transparent 98%, black 100%)`,
          WebkitMaskComposite: "source-in",
        }}
      >
        <span
          style={{
            fontFamily: THEME.fonts.accent,
            fontSize: 42,
            color: THEME.colors.ink,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            padding: "0 26px",
            textAlign: "center",
          }}
        >
          {text}
        </span>
      </div>
    </div>
  );
};

/** Blanket-stitch dashed frame that sews itself around a box. */
export const StitchFrame: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  color?: string;
  delay?: number;
  rotate?: number;
}> = ({ x, y, w, h, color = THEME.colors.rose, delay = 0, rotate = 0 }) => {
  const off = useStitch(delay);
  return (
    <svg
      style={{ position: "absolute", left: x, top: y, transform: `rotate(${rotate}deg)`, overflow: "visible" }}
      width={w}
      height={h}
    >
      <rect
        x={THEME.scrap.stitchWidth}
        y={THEME.scrap.stitchWidth}
        width={Math.max(0, w - THEME.scrap.stitchWidth * 2)}
        height={Math.max(0, h - THEME.scrap.stitchWidth * 2)}
        fill="none"
        stroke={color}
        strokeWidth={THEME.scrap.stitchWidth}
        strokeDasharray={THEME.scrap.stitchDash}
        strokeDashoffset={off}
        strokeLinecap="round"
      />
    </svg>
  );
};

/** Hand-written note block — the journal entry itself. */
export const HandNote: React.FC<{
  text: string;
  x?: number;
  y?: number;
  width?: number;
  size?: number;
  color?: string;
  rotate?: number;
  delay?: number;
  align?: "left" | "center";
}> = ({ text, x, y, width, size = THEME.scrap.noteSize, color = THEME.colors.ink, rotate = -1.4, delay = 0, align = "left" }) => {
  const { width: vw } = useVideoConfig();
  const m = THEME.layout.safeMargin;
  const w = width ?? Math.min(vw - m * 2, 760);
  const write = useWrite(delay);
  const swayT = useSway(delay + 30, 3);
  const lines = wrapText(text, Math.max(12, Math.floor(w / (size * 0.5))));
  return (
    <div
      style={{
        position: "absolute",
        left: x ?? m,
        top: y,
        width: w,
        textAlign: align,
        fontFamily: THEME.fonts.annotation,
        fontSize: size,
        lineHeight: THEME.fonts.lineHeights.heading,
        color,
        opacity: write.opacity,
        transform: `rotate(${rotate}deg) ${write.transform} ${swayT}`,
      }}
    >
      {lines.join("\n")}
    </div>
  );
};

/** Journal title — big handwriting with a washi underline. */
export const ScrapTitle: React.FC<{
  text: string;
  x?: number;
  y?: number;
  width?: number;
  size?: number;
  color?: string;
  delay?: number;
  underline?: boolean;
}> = ({ text, x, y, width, size, color = THEME.colors.ink, delay = 0, underline = true }) => {
  const { width: vw } = useVideoConfig();
  const m = THEME.layout.safeMargin;
  const w = width ?? vw - m * 2;
  const sz = size ?? fitSize(text, w, THEME.scrap.titleMax, THEME.scrap.titleMin, THEME.scrap.charRatio, 3);
  const drop = useDrop(delay, tilt(text.length, 2));
  const lines = text.split("\n");
  const headH = Math.round(lines.length * sz * THEME.fonts.lineHeights.heading);
  return (
    <div style={{ position: "absolute", left: x ?? m, top: y, width: w, opacity: drop.opacity, transform: drop.transform }}>
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
            transform: `rotate(${tilt(i * 7 + text.length, 1.2)}deg)`,
          }}
        >
          {ln}
        </div>
      ))}
      {underline ? <WashiTape x={6} y={headH + 2} w={Math.min(w, Math.round(sz * 4.6))} h={26} rotate={-1.2} delay={delay + 8} color={THEME.colors.mustard} /> : null}
    </div>
  );
};

/** Small label written on a piece of tape (kicker). */
export const TapeLabel: React.FC<{
  text: string;
  x: number;
  y: number;
  rotate?: number;
  color?: string;
  textColor?: string;
  delay?: number;
}> = ({ text, x, y, rotate = -3, color = THEME.colors.sage, textColor = THEME.colors.white, delay = 0 }) => {
  const write = useWrite(delay);
  const pad = 20;
  const fontSize = 34;
  const w = Math.round(text.length * fontSize * 0.56) + pad * 2;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        padding: `8px ${pad}px`,
        background: color,
        opacity: write.opacity * THEME.scrap.tapeOpacity,
        transform: `rotate(${rotate}deg) ${write.transform}`,
        boxShadow: "0 3px 8px rgba(58,52,43,0.16)",
      }}
    >
      <span style={{ fontFamily: THEME.fonts.accent, fontSize, color: textColor, whiteSpace: "nowrap", letterSpacing: "0.04em" }}>{text}</span>
    </div>
  );
};

/** Doodle spark (little pen burst) — pops with a sticker spin. */
export const DoodleSpark: React.FC<{
  x: number;
  y: number;
  size?: number;
  color?: string;
  delay?: number;
  seed?: number;
}> = ({ x, y, size = 70, color = THEME.colors.rose, delay = 0, seed = 1 }) => {
  const st = useSticker(delay, THEME.motion.stickerSpin * 0.5);
  const half = size / 2;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ position: "absolute", left: x, top: y, transform: st, overflow: "visible" }}>
      <g stroke={color} strokeWidth={7} strokeLinecap="round" fill="none">
        <path d="M50 6 V26" />
        <path d="M50 74 V94" />
        <path d="M6 50 H26" />
        <path d="M74 50 H94" />
        <path d="M20 20 L34 34" />
        <path d="M66 66 L80 80" />
        <path d="M80 20 L66 34" />
        <path d="M34 66 L20 80" />
      </g>
      <circle cx={half} cy={half} r={12} fill={color} />
    </svg>
  );
};

/** Quiet supporting line in the body sans (the non-handwritten voice). */
export const ScrapCaption: React.FC<{
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
  const write = useWrite(delay);
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
        opacity: write.opacity,
        transform: write.transform,
      }}
    >
      {lines.join("\n")}
    </div>
  );
};

/** Shared stagger for scattered pieces. */
export const pieceDelay = (i: number): number => stagger(i);
