// Editorial Magazine — drawing kit.
// Print furniture: rules, rubrics, masked headlines, drop caps, body columns,
// pull quotes, duotone photo blocks, folios. Nothing bounces; type is set.

import React from "react";
import { useVideoConfig } from "remotion";
import { THEME } from "../tokens";
import {
  fitSize,
  splitDropCap,
  toColumns,
  useFade,
  useLinear,
  useMaskReveal,
  usePhotoWipe,
  useProgress,
  useSettle,
  wrapText,
} from "../lib/anim";

// ------------------------------------------------------------------ rules

/** Horizontal rule that grows left → right. Thin first, thick second. */
export const Rule: React.FC<{
  y: number;
  x?: number;
  w?: number;
  weight?: number;
  color?: string;
  delay?: number;
}> = ({ y, x, w, weight = THEME.magazine.ruleHairline, color = THEME.colors.ink, delay = 0 }) => {
  const { width } = useVideoConfig();
  const m = THEME.layout.safeMargin;
  const grow = useRule(delay);
  return (
    <div
      style={{
        position: "absolute",
        left: x ?? m,
        top: y,
        width: (w ?? width - m * 2) + "px",
        height: weight,
        background: color,
        transformOrigin: "left center",
        transform: grow,
      }}
    />
  );
};

const useRule = (delay: number): string => `scaleX(${useLinear(delay).toFixed(4)})`;

/** Uppercase rubric label with a red dot — the section marker. */
export const Rubric: React.FC<{
  text: string;
  delay?: number;
  color?: string;
  x?: number;
  y?: number;
}> = ({ text, delay = 0, color = THEME.colors.red, x, y }) => {
  const { width } = useVideoConfig();
  const m = THEME.layout.safeMargin;
  const p = useProgress(delay, 10);
  return (
    <div
      style={{
        position: "absolute",
        left: x ?? m,
        top: y ?? m,
        display: "flex",
        alignItems: "center",
        gap: 14,
        opacity: p,
        transform: `translateX(${((1 - p) * -14).toFixed(2)}px)`,
      }}
    >
      <span style={{ width: 12, height: 12, borderRadius: 6, background: color, display: "block" }} />
      <span
        style={{
          fontFamily: THEME.fonts.kicker,
          fontSize: THEME.magazine.kickerSize,
          fontWeight: 700,
          letterSpacing: "0.32em",
          textTransform: "uppercase",
          color: THEME.colors.ink,
          maxWidth: width - m * 2 - 40,
        }}
      >
        {text}
      </span>
    </div>
  );
};

// -------------------------------------------------------------- headlines

/**
 * Headline set in the display serif, revealed from the baseline, one line at
 * a time. The signature move of this style.
 */
export const Headline: React.FC<{
  text: string;
  delay?: number;
  size?: number;
  color?: string;
  align?: "left" | "center";
  italic?: boolean;
  x?: number;
  y?: number;
  width?: number;
}> = ({ text, delay = 0, size, color = THEME.colors.ink, align = "left", italic = false, x, y, width }) => {
  const { width: vw } = useVideoConfig();
  const m = THEME.layout.safeMargin;
  const w = width ?? vw - m * 2;
  const lines = text.split("\n");
  const sz = size ?? fitSize(text, w, THEME.magazine.headlineMax, THEME.magazine.headlineMin, THEME.magazine.charRatio, 3);
  return (
    <div
      style={{
        position: "absolute",
        left: x ?? m,
        top: y,
        width: w,
        display: "flex",
        flexDirection: "column",
        alignItems: align === "center" ? "center" : "flex-start",
      }}
    >
      {lines.map((ln, i) => {
        const mask = useMaskReveal(delay + i * THEME.motion.stagger);
        return (
          <div
            key={i}
            style={{
              overflow: "hidden",
              clipPath: mask.clipPath,
              transform: mask.transform,
              opacity: mask.opacity,
            }}
          >
            <span
              style={{
                display: "block",
                fontFamily: italic ? THEME.fonts.display : THEME.fonts.heading,
                fontStyle: italic ? "italic" : "normal",
                fontWeight: THEME.fonts.headingWeight,
                fontSize: sz,
                lineHeight: THEME.fonts.lineHeights.heading,
                letterSpacing: THEME.fonts.headingLetterSpacing,
                color,
                whiteSpace: "pre",
              }}
            >
              {ln}
            </span>
          </div>
        );
      })}
    </div>
  );
};

/** Standfirst / deck — the serif or sans summary under a headline. */
export const Standfirst: React.FC<{
  text: string;
  delay?: number;
  size?: number;
  color?: string;
  x?: number;
  y?: number;
  width?: number;
  tint?: boolean;
}> = ({ text, delay = 0, size = THEME.magazine.standfirstSize, color = THEME.colors.textSecondary, x, y, width, tint = false }) => {
  const { width: vw } = useVideoConfig();
  const m = THEME.layout.safeMargin;
  const w = width ?? Math.min(vw - m * 2, 760);
  const settle = useSettle(delay, 12);
  const chars = Math.max(18, Math.floor(w / (size * 0.5)));
  const lines = wrapText(text, chars);
  return (
    <div
      style={{
        position: "absolute",
        left: x ?? m,
        top: y ?? undefined,
        width: w,
        padding: tint ? "18px 22px" : 0,
        background: tint ? THEME.colors.surfaceAlt : "transparent",
        fontFamily: THEME.fonts.subheading,
        fontSize: size,
        lineHeight: 1.32,
        color,
        opacity: settle.opacity,
        transform: settle.transform,
      }}
    >
      {lines.join("\n")}
    </div>
  );
};

// ------------------------------------------------------------------ body

/** Opening letter sized to hang into the first body lines. */
export const DropCap: React.FC<{
  letter: string;
  size?: number;
  color?: string;
  delay?: number;
}> = ({ letter, size = THEME.magazine.dropCapSize, color = THEME.colors.red, delay = 0 }) => {
  const mask = useMaskReveal(delay, 10);
  return (
    <span
      style={{
        float: "left",
        fontFamily: THEME.fonts.heading,
        fontWeight: THEME.fonts.headingWeight,
        fontSize: size,
        lineHeight: 0.78,
        paddingRight: 14,
        paddingTop: 6,
        color,
        overflow: "hidden",
        clipPath: mask.clipPath,
        transform: mask.transform,
        opacity: mask.opacity,
      }}
    >
      {letter}
    </span>
  );
};

/** Body copy set in columns — cascades in reading order. */
export const BodyColumns: React.FC<{
  text: string;
  delay?: number;
  size?: number;
  color?: string;
  x?: number;
  y?: number;
  width?: number;
  columns?: number;
  dropCap?: boolean;
  justify?: boolean;
}> = ({ text, delay = 0, size = 30, color = THEME.colors.ink, x, y, width, columns = THEME.layout.columns, dropCap = false, justify = true }) => {
  const { width: vw } = useVideoConfig();
  const m = THEME.layout.safeMargin;
  const w = width ?? vw - m * 2;
  const gutter = THEME.layout.gutter;
  const colW = (w - gutter * (columns - 1)) / columns;
  const chars = Math.max(12, Math.floor(colW / (size * 0.5)));

  const cap = dropCap ? splitDropCap(text) : null;
  const source = cap ? cap.rest : text;
  const cols = toColumns(source, chars, columns);

  return (
    <div
      style={{
        position: "absolute",
        left: x ?? m,
        top: y ?? undefined,
        width: w,
        display: "flex",
        gap: gutter,
        alignItems: "flex-start",
      }}
    >
      {cols.map((col, i) => {
        const settle = useSettle(delay + i * THEME.motion.columnStagger, 14);
        const isFirst = i === 0;
        return (
          <div
            key={i}
            style={{
              width: colW,
              fontFamily: THEME.fonts.body,
              fontWeight: THEME.fonts.bodyWeight,
              fontSize: size,
              lineHeight: THEME.fonts.lineHeights.body,
              color,
              textAlign: justify ? "justify" : "left",
              opacity: settle.opacity,
              transform: settle.transform,
            }}
          >
            {isFirst && cap ? <DropCap letter={cap.cap} delay={delay} /> : null}
            {col.join(" ")}
          </div>
        );
      })}
    </div>
  );
};

// ----------------------------------------------------------- pull quotes

/** Oversized pull quote with hanging quote marks. */
export const PullQuote: React.FC<{
  text: string;
  delay?: number;
  size?: number;
  color?: string;
  accent?: string;
  x?: number;
  y?: number;
  width?: number;
  align?: "left" | "center";
}> = ({ text, delay = 0, size = THEME.magazine.pullQuoteSize, color = THEME.colors.ink, accent = THEME.colors.red, x, y, width, align = "left" }) => {
  const { width: vw } = useVideoConfig();
  const m = THEME.layout.safeMargin;
  const w = width ?? vw - m * 2;
  const rule = useLinear(delay, THEME.motion.ruleFrames);
  const fade = useProgress(delay + 4, 12);
  const chars = Math.max(10, Math.floor(w / (size * 0.46)));
  const lines = wrapText(text, chars);
  return (
    <div style={{ position: "absolute", left: x ?? m, top: y ?? undefined, width: w, textAlign: align }}>
      <div
        style={{
          fontFamily: THEME.fonts.heading,
          fontWeight: THEME.fonts.headingWeight,
          fontSize: size * 1.6,
          lineHeight: 0.6,
          color: accent,
          opacity: fade,
          height: size * 0.8,
        }}
      >
        &ldquo;
      </div>
      <div
        style={{
          fontFamily: THEME.fonts.heading,
          fontStyle: "italic",
          fontWeight: THEME.fonts.headingWeight,
          fontSize: size,
          lineHeight: 1.08,
          letterSpacing: THEME.fonts.headingLetterSpacing,
          color,
          opacity: fade,
        }}
      >
        {lines.join("\n")}
      </div>
      <div
        style={{
          marginTop: 22,
          height: THEME.magazine.ruleThick,
          background: accent,
          transformOrigin: "left center",
          transform: `scaleX(${rule.toFixed(4)})`,
          width: Math.round(w * 0.5),
        }}
      />
    </div>
  );
};

// ------------------------------------------------------------------ photo

/**
 * Duotone "photo" block — abstract gradient field with a caption, revealed by
 * a top-down wipe. No external assets; colour comes from the token palette.
 */
export const PhotoBlock: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  tone?: "ink" | "red" | "blue";
  caption?: string;
  delay?: number;
  seed?: number;
}> = ({ x, y, w, h, tone = "ink", caption, delay = 0, seed = 1 }) => {
  const wipe = usePhotoWipe(delay);
  const capFade = useFade(delay + 14);
  const tones: Record<string, [string, string]> = {
    ink: ["#14120F", "#8A8377"],
    red: ["#D0342C", "#F1C9C3"],
    blue: ["#1B3A6B", "#C7D4E6"],
  };
  const [c0, c1] = tones[tone] ?? tones.ink;
  const angle = 120 + ((seed * 37) % 60);
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w }}>
      <div style={{ width: w, height: h, overflow: "hidden", clipPath: wipe }}>
        <div
          style={{
            width: w,
            height: h,
            backgroundImage: `linear-gradient(${angle}deg, ${c0} 0%, ${c1} 62%, ${c0} 100%)`,
          }}
        />
      </div>
      <div style={{ height: THEME.magazine.ruleHairline, background: THEME.colors.ink, marginTop: 10, opacity: capFade }} />
      {caption ? (
        <div
          style={{
            marginTop: 8,
            fontFamily: THEME.fonts.body,
            fontSize: THEME.magazine.captionSize,
            lineHeight: 1.35,
            color: THEME.colors.textSecondary,
            opacity: capFade,
          }}
        >
          {caption}
        </div>
      ) : null}
    </div>
  );
};

// ------------------------------------------------------------- page marks

/** Running head / folio along the bottom of the spread. */
export const Folio: React.FC<{
  page?: number | string;
  section?: string;
  delay?: number;
}> = ({ page, section, delay = 0 }) => {
  const { width } = useVideoConfig();
  const m = THEME.layout.safeMargin;
  const fade = useFade(delay);
  return (
    <div
      style={{
        position: "absolute",
        left: m,
        right: m,
        bottom: Math.round(m * 0.6),
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-end",
        fontFamily: THEME.fonts.kicker,
        fontSize: THEME.magazine.folioSize,
        letterSpacing: "0.24em",
        textTransform: "uppercase",
        color: THEME.colors.textSecondary,
        opacity: fade,
        width: width - m * 2,
      }}
    >
      <span>{section ?? ""}</span>
      <span style={{ color: THEME.colors.ink, fontWeight: 700 }}>{page ?? ""}</span>
    </div>
  );
};

/** Masthead — title between two rules, issue line beneath. */
export const Masthead: React.FC<{
  title: string;
  issue?: string;
  delay?: number;
  color?: string;
}> = ({ title, issue, delay = 0, color = THEME.colors.ink }) => {
  const { width } = useVideoConfig();
  const m = THEME.layout.safeMargin;
  const p = useProgress(delay, 12);
  return (
    <div style={{ position: "absolute", left: m, top: m - 18, width: width - m * 2 }}>
      <div style={{ height: THEME.magazine.ruleThick, background: color, transformOrigin: "left center", transform: `scaleX(${useLinear(delay).toFixed(4)})` }} />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          padding: "14px 0 10px",
          opacity: p,
        }}
      >
        <span
          style={{
            fontFamily: THEME.fonts.display,
            fontSize: 84,
            lineHeight: 1,
            letterSpacing: "-0.03em",
            color,
          }}
        >
          {title}
        </span>
        {issue ? (
          <span
            style={{
              fontFamily: THEME.fonts.kicker,
              fontSize: THEME.magazine.kickerSize,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: THEME.colors.red,
            }}
          >
            {issue}
          </span>
        ) : null}
      </div>
      <div style={{ height: THEME.magazine.ruleHairline, background: color, transformOrigin: "left center", transform: `scaleX(${useLinear(delay + 4).toFixed(4)})` }} />
    </div>
  );
};

/** Subtle paper grain — two crossing gradients, no raster texture. */
export const GrainOverlay: React.FC = () => {
  const o = THEME.magazine.grainOpacity;
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        backgroundImage: [
          `repeating-linear-gradient(0deg, rgba(20,18,15,${o}) 0 1px, transparent 1px 3px)`,
          `repeating-linear-gradient(90deg, rgba(20,18,15,${o * 0.7}) 0 1px, transparent 1px 4px)`,
        ].join(", "),
      }}
    />
  );
};
