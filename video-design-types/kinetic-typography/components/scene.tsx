// Kinetic Typography — scene composer.
// Renders a mode-driven type performance from structured line data. The same
// subject can be performed as minimal, editorial or energetic just by changing
// `mode` in the data — layout, pacing and furniture all follow the mode.

import React from "react";
import { AbsoluteFill, useVideoConfig } from "remotion";
import { THEME } from "../tokens";
import { fitSize, stagger } from "../lib/anim";
import {
  Caption,
  CharLine,
  FlashFrame,
  GhostWord,
  Kicker,
  OutlinedWord,
  SlamWord,
  SplitPanel,
  Ticker,
  TrackedWord,
  UnderlineSwipe,
  lineDelay,
  tilt,
} from "./primitives";

// ------------------------------------------------------------- scene schema

export type KineticLine = {
  text: string;
  /** Word indexes to colour with the accent (0-based, spaces excluded). */
  keywords?: number[];
  /** Per-line colour override. */
  color?: string;
  /** Put the first keyword on a filled accent block. */
  block?: boolean;
};

export type KineticMode = "minimal" | "editorial" | "energetic";

export type KineticSceneData = {
  mode: KineticMode;
  /** Headline stack — one entry per phrase of the audio line. */
  lines: KineticLine[];
  /** Small-caps label, top-left. */
  kicker?: string;
  /** Quiet supporting sentence. */
  caption?: string;
  /** Giant watermark word behind the stack. */
  ghost?: string;
  /** Accent colour — defaults to cobalt. */
  accent?: string;
  /** Marquee text (energetic mode default; set explicitly anywhere). */
  ticker?: string;
  /** Outlined ghost headline behind the solid stack (editorial). */
  outline?: string;
  /** Impact flash: accent background flip for a few frames. */
  flash?: { at?: number; duration?: number; color?: string };
  /** Keyword colour when not using the main accent. */
  keywordColor?: string;
};

export type KineticSceneProps = {
  data?: Partial<KineticSceneData>;
  line?: { text?: string };
};

// ---------------------------------------------------------------- helpers

const words = (text: string): string[] => text.split(/\s+/).filter(Boolean);

/** Colour for word `wi` of line `l` — keyword accent or plain text. */
const wordColor = (d: KineticSceneData, l: KineticLine, wi: number): string => {
  if (l.keywords?.includes(wi)) return l.color ?? d.keywordColor ?? d.accent ?? THEME.colors.accent;
  return l.color ?? THEME.colors.text;
};

// ---------------------------------------------------------------- composer

export const KineticScene: React.FC<KineticSceneProps> = ({ data, line }) => {
  const { width, height } = useVideoConfig();
  const m = THEME.layout.safeMargin;
  const mode: KineticMode = data?.mode ?? "minimal";
  const accent = data?.accent ?? THEME.colors.accent;

  const d: KineticSceneData = {
    mode,
    lines: data?.lines?.length ? data.lines : [{ text: line?.text ?? "Untitled" }],
    kicker: data?.kicker,
    caption: data?.caption,
    ghost: data?.ghost,
    accent,
    ticker: data?.ticker,
    outline: data?.outline,
    flash: data?.flash,
    keywordColor: data?.keywordColor,
  };

  // Deterministic stack sizing: fit the longest line to the frame.
  const longest = d.lines.reduce((a, b) => (b.text.length > a.text.length ? b : a), d.lines[0]);
  const maxStackW = width - m * 2;
  const baseSize =
    mode === "minimal"
      ? fitSize(longest.text, Math.round(maxStackW * 0.9), 190, 64, THEME.type.wordRatio, 2)
      : fitSize(longest.text, maxStackW, THEME.type.hugeMax, THEME.type.hugeMin, THEME.type.wordRatio, 2);

  const body = (() => {
    switch (mode) {
      case "editorial":
        return <EditorialStack d={d} size={baseSize} width={maxStackW} />;
      case "energetic":
        return <EnergeticStack d={d} size={baseSize} width={maxStackW} />;
      default:
        return <MinimalStack d={d} size={baseSize} width={maxStackW} />;
    }
  })();

  return (
    <AbsoluteFill style={{ backgroundColor: THEME.colors.background, overflow: "hidden" }}>
      {/* 1 · background layers */}
      {mode === "editorial" && d.outline ? (
        <OutlinedWord text={d.outline} size={Math.round(baseSize * 1.5)} delay={4} top={Math.round(height * 0.3)} rotate={-2} />
      ) : null}
      {d.ghost ? <GhostWord text={d.ghost} size={Math.round(width * 0.62)} seed={mode === "energetic" ? 2 : 5} /> : null}

      {/* 2 · mode furniture */}
      {mode === "editorial" ? <SplitPanel side="left" frac={0.06} color={accent} delay={0} /> : null}
      {mode === "minimal" ? <div style={{ position: "absolute", left: m, top: m, width: 64, height: 4, background: accent }} /> : null}

      {/* 3 · the type performance */}
      <div
        style={{
          position: "absolute",
          left: mode === "editorial" ? m + 36 : m,
          right: m,
          top: 0,
          bottom: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: mode === "minimal" ? "center" : "flex-start",
        }}
      >
        {body}
      </div>

      {/* 4 · kicker + caption + ticker */}
      {d.kicker ? (
        <Kicker
          text={d.kicker}
          delay={2}
          color={accent}
          x={mode === "editorial" ? m + 36 : m}
          y={mode === "minimal" ? m + 26 : m}
        />
      ) : null}
      {d.caption ? <Caption text={d.caption} delay={30} x={mode === "minimal" ? undefined : m} y={mode === "minimal" ? Math.round(height * 0.72) : undefined} align={mode === "minimal" ? "center" : "left"} /> : null}
      {d.ticker ? <Ticker text={d.ticker} delay={14} bg={accent} color={THEME.colors.black} /> : null}

      {/* 5 · impact flash */}
      {d.flash ? <FlashFrame color={d.flash.color ?? accent} at={d.flash.at ?? 0} duration={d.flash.duration ?? 6} /> : null}
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------- modes

/** Minimal — centred stack, wide negative space, one tracked-in accent line. */
const MinimalStack: React.FC<{ d: KineticSceneData; size: number; width: number }> = ({ d, size, width }) => (
  <div style={{ width, display: "flex", flexDirection: "column", gap: Math.round(size * 0.12), alignItems: "center" }}>
    {d.lines.map((l, li) => {
      const delay = lineDelay(li, 6);
      const kw = l.keywords?.[0];
      if (kw != null && li === 0) {
        // First line with a keyword: split so the keyword can track in alone.
        const ws = words(l.text);
        return (
          <div key={li} style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0.28em" }}>
            {ws.map((w, wi) =>
              wi === kw ? (
                <TrackedWord key={wi} text={w} delay={delay + stagger(wi, 3)} size={size} color={wordColor(d, l, wi)} from={0.24} />
              ) : (
                <TrackedWord key={wi} text={w} delay={delay + stagger(wi, 3)} size={size} color={wordColor(d, l, wi)} from={0.1} />
              )
            )}
          </div>
        );
      }
      return (
        <div key={li} style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0.28em" }}>
          {words(l.text).map((w, wi) => (
            <TrackedWord key={wi} text={w} delay={delay + stagger(wi, 3)} size={size} color={wordColor(d, l, wi)} from={0.16} />
          ))}
        </div>
      );
    })}
  </div>
);

/** Editorial — left-aligned stack, hard cuts, outlined ghost behind. */
const EditorialStack: React.FC<{ d: KineticSceneData; size: number; width: number }> = ({ d, size, width }) => {
  const gap = Math.round(size * 0.04);
  const lineH = (l: KineticLine): number =>
    fitSize(l.text, width, size, 44, THEME.type.wordRatio, 2) * THEME.fonts.lineHeights.heading;
  const stackH = d.lines.reduce((a, l) => a + lineH(l), 0) + gap * (d.lines.length - 1);
  return (
  <div style={{ width, position: "relative", display: "flex", flexDirection: "column", gap }}>
    {d.lines.map((l, li) => {
      const ws = words(l.text);
      const sz = fitSize(l.text, width, size, 44, THEME.type.wordRatio, 2);
      return (
        <div key={li} style={{ display: "flex", flexWrap: "wrap", gap: "0.22em", transform: `rotate(${tilt(li * 7 + 3, 0.6)}deg)` }}>
          {ws.map((w, wi) => {
            const delay = lineDelay(li, 8) + stagger(wi, THEME.motion.stagger);
            const isKw = l.keywords?.includes(wi);
            if (isKw && l.block) {
              return <SlamWord key={wi} text={w} delay={delay} size={sz} block blockColor={wordColor(d, l, wi)} index={0} />;
            }
            return <SlamWord key={wi} text={w} delay={delay} size={sz} color={wordColor(d, l, wi)} index={0} />;
          })}
        </div>
      );
    })}
    {d.lines.some((l) => l.keywords?.length) ? (
      <UnderlineSwipe
        x={0}
        y={Math.round(stackH + 8)}
        w={Math.round(width * 0.42)}
        color={d.keywordColor ?? accent(d)}
        delay={lineDelay(d.lines.length, 8) + 6}
        thickness={12}
      />
    ) : null}
  </div>
  );
};

/** Energetic — char cascade first line, slams after, ticker + flash beats. */
const EnergeticStack: React.FC<{ d: KineticSceneData; size: number; width: number }> = ({ d, size, width }) => {
  return (
    <div style={{ width, display: "flex", flexDirection: "column", gap: Math.round(size * 0.06), alignItems: "flex-start" }}>
      {d.lines.map((l, li) => {
        const ws = words(l.text);
        const sz = fitSize(l.text, width, size, 44, THEME.type.wordRatio, 2);
        if (li === 0 && ws.length <= 3) {
          return (
            <div key={li}>
              <CharLine text={l.text} delay={4} size={sz} color={wordColor(d, l, 0)} />
            </div>
          );
        }
        return (
          <div key={li} style={{ display: "flex", flexWrap: "wrap", gap: "0.2em" }}>
            {ws.map((w, wi) => {
              const delay = lineDelay(li, li === 0 ? 4 : 14) + stagger(wi, THEME.motion.stagger);
              const isKw = l.keywords?.includes(wi);
              return (
                <SlamWord
                  key={wi}
                  text={w}
                  delay={delay}
                  size={sz}
                  color={wordColor(d, l, wi)}
                  block={isKw && (l.block ?? li === d.lines.length - 1)}
                  blockColor={wordColor(d, l, wi)}
                  rotate={tilt(li * 13 + wi * 5, 1.6)}
                  index={0}
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

const accent = (d: KineticSceneData): string => d.accent ?? THEME.colors.accent;
