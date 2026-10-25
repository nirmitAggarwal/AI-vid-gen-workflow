// Line Art Illustration — scene composer.
// Draws a scene from structured data: icons placed in normalised boxes,
// dotted trails joining them, headline + handwritten annotation. Three
// compositions — hero, flow, steps — pick the arrangement.

import React from "react";
import { AbsoluteFill, useVideoConfig } from "remotion";
import { THEME } from "../tokens";
import { fitSize, stagger } from "../lib/anim";
import {
  Annotation,
  CheckMark,
  CurvedArrow,
  DottedTrail,
  IconLabel,
  LineCaption,
  LineHeadline,
  LineIcon,
  Sparkle,
  Swoosh,
  WashPanel,
  stepDelay,
  type LineIconName,
} from "./primitives";

// ------------------------------------------------------------- scene schema

export type LineArtIcon = {
  id: string;
  icon: LineIconName;
  /** Normalised box (0..1) — sized against the frame, reusable anywhere. */
  at: { x: number; y: number; s?: number };
  label?: string;
  delay?: number;
  accent?: boolean;
  check?: boolean;
  seed?: number;
};

export type LineArtComposition = "hero" | "flow" | "steps";

export type LineArtSceneData = {
  composition: LineArtComposition;
  headline?: string;
  caption?: string;
  /** Handwritten margin note. */
  annotation?: string;
  icons?: LineArtIcon[];
  /** Dotted trails between icon indexes (flow composition default). */
  trails?: { from: number; to: number; bow?: number }[];
  /** Swoosh underline under the headline. */
  underline?: boolean;
  accent?: string;
};

export type LineArtSceneProps = {
  data?: Partial<LineArtSceneData>;
  line?: { text?: string };
};

// ---------------------------------------------------------------- composer

export const LineArtScene: React.FC<LineArtSceneProps> = ({ data, line }) => {
  const { width, height } = useVideoConfig();
  const m = THEME.layout.safeMargin;

  const d: LineArtSceneData = {
    composition: data?.composition ?? "flow",
    headline: data?.headline ?? line?.text ?? "",
    caption: data?.caption,
    annotation: data?.annotation,
    icons: data?.icons,
    trails: data?.trails,
    underline: data?.underline ?? true,
    accent: data?.accent ?? THEME.colors.teal,
  };

  const body = (() => {
    switch (d.composition) {
      case "hero":
        return <HeroComposition d={d} />;
      case "steps":
        return <StepsComposition d={d} />;
      default:
        return <FlowComposition d={d} />;
    }
  })();

  return (
    <AbsoluteFill style={{ backgroundColor: THEME.colors.background, overflow: "hidden" }}>
      {body}
    </AbsoluteFill>
  );
};

// -------------------------------------------------------------- icon util

/** Renders icons at normalised coordinates + optional labels + checks. */
const IconLayer: React.FC<{ d: LineArtSceneData; baseDelay?: number }> = ({ d, baseDelay = 0 }) => {
  const { width, height } = useVideoConfig();
  const icons = d.icons ?? [];
  return (
    <>
      {icons.map((it, i) => {
        const size = Math.round((it.at.s ?? 0.22) * width);
        const x = Math.round(it.at.x * width);
        const y = Math.round(it.at.y * height);
        const delay = baseDelay + (it.delay ?? stagger(i));
        return (
          <div key={it.id}>
            <LineIcon name={it.icon} x={x} y={y} size={size} delay={delay} accentLast={it.accent} seed={it.seed ?? i} />
            {it.check ? <CheckMark x={x + size - Math.round(size * 0.18)} y={y + Math.round(size * 0.62)} size={Math.round(size * 0.3)} delay={delay + 16} /> : null}
            {it.label ? (
              <IconLabel
                text={it.label}
                x={x - Math.round(size * 0.2)}
                y={y + size + 14}
                width={Math.round(size * 1.4)}
                delay={delay + 10}
                color={it.accent ? d.accent : THEME.colors.textSecondary}
              />
            ) : null}
          </div>
        );
      })}
    </>
  );
};

/** Headline + swoosh + caption, the shared type block. */
const TypeLayer: React.FC<{ d: LineArtSceneData; x?: number; y: number; width?: number; align?: "left" | "center"; delay?: number }> = ({
  d,
  x,
  y,
  width,
  align = "left",
  delay = 4,
}) => {
  const { width: vw } = useVideoConfig();
  const m = THEME.layout.safeMargin;
  const w = width ?? vw - m * 2;
  const lines = d.headline?.split("\n") ?? [];
  const sz = d.headline ? fitSize(d.headline, w, THEME.lineArt.headlineMax, THEME.lineArt.headlineMin, THEME.lineArt.charRatio, 3) : 90;
  const headH = Math.round(lines.length * sz * THEME.fonts.lineHeights.heading);
  return (
    <>
      {d.headline ? <LineHeadline text={d.headline} x={x} y={y} width={w} size={sz} align={align} delay={delay} /> : null}
      {d.underline && d.headline ? <Swoosh x={x ?? m} y={y + headH + 6} w={Math.min(w, Math.round(sz * 6))} delay={delay + 10} color={d.accent} flip={lines.length % 2 === 0} /> : null}
      {d.caption ? <LineCaption text={d.caption} x={x} y={y + headH + 40} width={Math.min(w, 720)} delay={delay + 16} /> : null}
    </>
  );
};

// ------------------------------------------------------------- compositions

/** Hero — one large illustration, headline beside/below, annotation + arrow. */
const HeroComposition: React.FC<{ d: LineArtSceneData }> = ({ d }) => {
  const { width, height } = useVideoConfig();
  const m = THEME.layout.safeMargin;
  const icons = d.icons ?? [{ id: "hero", icon: "bulb" as LineIconName, at: { x: 0.56, y: 0.14, s: 0.34 }, accent: true }];
  const hero = icons[0];
  const size = Math.round((hero.at.s ?? 0.34) * width);
  const hx = Math.round(hero.at.x * width);
  const hy = Math.round(hero.at.y * height);
  return (
    <>
      <LineIcon name={hero.icon} x={hx} y={hy} size={size} delay={2} accentLast={hero.accent} seed={3} />
      <Sparkle x={hx + size - 20} y={hy - 10} size={44} delay={20} color={d.accent} />
      <TypeLayer d={d} y={Math.round(height * 0.56)} />
      {d.annotation ? (
        <>
          <CurvedArrow x1={Math.round(width * 0.24)} y1={Math.round(height * 0.66)} x2={hx + Math.round(size * 0.5)} y2={hy + size + 10} bow={70} delay={22} color={d.accent} />
          <Annotation text={d.annotation} x={m} y={Math.round(height * 0.68)} width={Math.min(width - m * 2, 520)} rotate={-2.4} delay={26} />
        </>
      ) : null}
      {icons.slice(1).map((it, i) => (
        <LineIcon key={it.id} name={it.icon} x={Math.round(it.at.x * width)} y={Math.round(it.at.y * height)} size={Math.round((it.at.s ?? 0.16) * width)} delay={12 + stagger(i)} seed={i + 1} />
      ))}
    </>
  );
};

/** Flow — icons in a row joined by marching dotted trails. */
const FlowComposition: React.FC<{ d: LineArtSceneData }> = ({ d }) => {
  const { width, height } = useVideoConfig();
  const m = THEME.layout.safeMargin;
  const icons =
    d.icons ??
    ([
      { id: "a", icon: "document" as LineIconName, at: { x: 0.1, y: 0.3, s: 0.18 }, label: "Job" },
      { id: "b", icon: "gear" as LineIconName, at: { x: 0.41, y: 0.3, s: 0.18 }, label: "Split", accent: true },
      { id: "c", icon: "machine" as LineIconName, at: { x: 0.72, y: 0.3, s: 0.18 }, label: "Machines", check: true },
    ] as LineArtIcon[]);
  const trails: { from: number; to: number; bow?: number }[] =
    d.trails ?? icons.slice(0, -1).map((_, i) => ({ from: i, to: i + 1 }));
  const pts = icons.map((it) => ({
    cx: Math.round(it.at.x * width) + Math.round((it.at.s ?? 0.18) * width) / 2,
    cy: Math.round(it.at.y * height) + Math.round((it.at.s ?? 0.18) * width) / 2,
  }));
  return (
    <>
      <IconLayer d={{ ...d, icons }} baseDelay={4} />
      {trails.map((t, i) =>
        pts[t.from] && pts[t.to] ? (
          <DottedTrail
            key={i}
            x1={pts[t.from].cx + Math.round((icons[t.from].at.s ?? 0.18) * width) * 0.55}
            y1={pts[t.from].cy}
            x2={pts[t.to].cx - Math.round((icons[t.to].at.s ?? 0.18) * width) * 0.55}
            y2={pts[t.to].cy}
            bow={t.bow ?? 26}
            delay={10 + stagger(i, 8)}
            color={THEME.colors.ink}
          />
        ) : null
      )}
      <TypeLayer d={d} y={Math.round(height * 0.62)} />
      {d.annotation ? <Annotation text={d.annotation} x={width - m - Math.min(460, width * 0.4)} y={Math.round(height * 0.18)} width={Math.min(460, width * 0.4)} rotate={2} delay={26} color={d.accent} /> : null}
    </>
  );
};

/** Steps — washed panels, one icon + label each, numbered by cadence. */
const StepsComposition: React.FC<{ d: LineArtSceneData }> = ({ d }) => {
  const { width, height } = useVideoConfig();
  const m = THEME.layout.safeMargin;
  const icons =
    d.icons ??
    ([
      { id: "s1", icon: "document" as LineIconName, at: { x: 0.08, y: 0.46, s: 0.14 }, label: "Split" },
      { id: "s2", icon: "people" as LineIconName, at: { x: 0.42, y: 0.46, s: 0.14 }, label: "Run", accent: true },
      { id: "s3", icon: "chart" as LineIconName, at: { x: 0.76, y: 0.46, s: 0.14 }, label: "Merge", check: true },
    ] as LineArtIcon[]);
  const panelW = Math.round((width - m * 2 - 40) / icons.length);
  return (
    <>
      {icons.map((it, i) => {
        const x = m + i * (panelW + 20);
        return (
          <WashPanel key={`p-${it.id}`} x={x} y={Math.round(height * 0.42)} w={panelW} h={Math.round(height * 0.3)} delay={stepDelay(i) * 2} />
        );
      })}
      <IconLayer d={{ ...d, icons }} baseDelay={8} />
      <TypeLayer d={d} y={Math.round(height * 0.18)} />
      {d.annotation ? <Annotation text={d.annotation} x={m} y={Math.round(height * 0.8)} width={Math.min(width - m * 2, 560)} rotate={-1.4} delay={30} /> : null}
    </>
  );
};
