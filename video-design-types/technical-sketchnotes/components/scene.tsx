// Technical Sketchnotes — scene composer.
//
// Takes structured scene data (title, nodes, edges, steps, notes) and lays out
// a sketchnote for the actual frame size. Layout is derived at render time from
// useVideoConfig(), so the same data works in 1080×1920 and 1920×1080.

import React from "react";
import { AbsoluteFill, useVideoConfig } from "remotion";
import { THEME } from "../tokens";
import { fitSize, stagger, tone, useEnter, useProgress, type Tone } from "../lib/anim";
import {
  CircledNumber,
  Icon,
  MarginNote,
  SectionTitle,
  SketchArrow,
  SketchBox,
  type IconName,
} from "./primitives";

// ------------------------------------------------------------- scene schema

export type SketchNode = {
  id: string;
  label: string;
  sub?: string;
  icon?: IconName;
  tone?: Tone;
};

export type SketchEdge = {
  from: string;
  to: string;
  label?: string;
  kind?: "solid" | "dashed";
};

export type SketchnoteSceneData = {
  title: string;
  subtitle?: string;
  /** Circled section number in the header. */
  section?: number | string;
  layout?: "diagram" | "flow" | "sections";
  nodes?: SketchNode[];
  edges?: SketchEdge[];
  /** Ordered process for the "flow" layout. */
  steps?: string[];
  /** Handwritten margin notes. */
  notes?: string[];
  /** Node id to push the camera toward. */
  focus?: string;
  /** Marker highlight colour behind the title. */
  highlight?: string;
};

export type SketchnoteSceneProps = {
  data?: Partial<SketchnoteSceneData>;
  /** Timeline line — supplies the title when `data.title` is absent. */
  line?: { text?: string };
};

/** Page surface: warm paper plus the style's faint graph grid. */
export const pageBackground: React.CSSProperties = {
  backgroundColor: THEME.colors.background,
  ...(THEME.treatment.gradient ? { backgroundImage: THEME.treatment.gradient } : {}),
};

// --------------------------------------------------------------- placement

type Box = { x: number; y: number; w: number; h: number; cx: number; cy: number };

const box = (x: number, y: number, w: number, h: number): Box => ({
  x,
  y,
  w,
  h,
  cx: x + w / 2,
  cy: y + h / 2,
});

/** Point on `to`'s rectangle edge, approached from `from` (so arrows land on the border). */
const shrink = (from: Box, to: Box): [number, number] => {
  const dx = to.cx - from.cx;
  const dy = to.cy - from.cy;
  if (dx === 0 && dy === 0) return [to.cx, to.cy];
  const sx = dx !== 0 ? to.w / 2 / Math.abs(dx) : Number.POSITIVE_INFINITY;
  const sy = dy !== 0 ? to.h / 2 / Math.abs(dy) : Number.POSITIVE_INFINITY;
  const s = Math.min(sx, sy);
  return [to.cx - dx * s, to.cy - dy * s];
};

const place = (n: number, area: Box, mode: "row" | "column" | "ring", bw: number, bh: number): Box[] => {
  if (n <= 0) return [];
  if (n === 1) return [box(area.cx - bw / 2, area.cy - bh / 2, bw, bh)];
  if (mode === "ring") {
    const cx = area.cx;
    const cy = area.cy;
    const rx = Math.max(60, area.w / 2 - bw / 2 - 6);
    const ry = Math.max(60, area.h / 2 - bh / 2 - 6);
    return Array.from({ length: n }, (_, i) => {
      const a = -Math.PI / 2 + (i * 2 * Math.PI) / n;
      return box(cx + Math.cos(a) * rx - bw / 2, cy + Math.sin(a) * ry - bh / 2, bw, bh);
    });
  }
  const gap = mode === "column" ? 58 : 44;
  if (mode === "column") {
    const total = n * bh + (n - 1) * gap;
    const startY = area.cy - total / 2;
    return Array.from({ length: n }, (_, i) => box(area.cx - bw / 2, startY + i * (bh + gap), bw, bh));
  }
  const total = n * bw + (n - 1) * gap;
  const startX = area.x + Math.max(0, (area.w - total) / 2);
  const y = area.cy - bh / 2;
  return Array.from({ length: n }, (_, i) => box(startX + i * (bw + gap), y, bw, bh));
};

// ---------------------------------------------------------------- composer

export const SketchnoteScene: React.FC<SketchnoteSceneProps> = ({ data, line }) => {
  const { width, height } = useVideoConfig();
  const m = THEME.layout.safeMargin;
  const d: SketchnoteSceneData = {
    title: data?.title ?? line?.text ?? "Untitled sketchnote",
    subtitle: data?.subtitle,
    section: data?.section,
    layout: data?.layout ?? "sections",
    nodes: data?.nodes,
    edges: data?.edges,
    steps: data?.steps,
    notes: data?.notes,
    focus: data?.focus,
    highlight: data?.highlight ?? THEME.colors.highlightYellow,
  };

  const portrait = height >= width;
  const contentW = width - m * 2;
  const titleSize = fitSize(d.title, contentW, THEME.sketchnote.titleSize, 40, 0.5, 2);
  const headerH = titleSize * 1.6 + (d.subtitle ? 70 : 30);
  const area = box(m, m + headerH, contentW, Math.max(200, height - m * 2 - headerH));

  const isDiagram = d.layout === "diagram";
  const items: Array<{ key: string; node?: SketchNode; step?: string }> = isDiagram
    ? (d.nodes ?? []).map((n) => ({ key: n.id, node: n }))
    : (d.steps ?? []).map((s, i) => ({ key: `s${i}`, step: s }));
  const count = items.length;

  const mode: "row" | "column" | "ring" =
    count === 0 ? "row" : isDiagram ? (count > 3 ? "ring" : "row") : portrait ? "column" : "row";

  const bw =
    mode === "ring"
      ? Math.min(330, Math.max(230, Math.floor(Math.min(contentW, area.h) / 3.2)))
      : Math.max(190, Math.min(360, Math.floor((contentW - 44 * (count - 1)) / Math.max(1, count))));
  const bh = isDiagram ? 138 : 118;
  const boxes = place(count, area, mode, bw, bh);

  const nodeDelay = (i: number) => 16 + stagger(i, THEME.motion.stagger * 3);
  const focusIndex = d.focus ? (d.nodes ?? []).findIndex((n) => n.id === d.focus) : -1;
  const focusBox = focusIndex >= 0 ? boxes[focusIndex] : undefined;
  const focusP = useProgress(46, 30) * (focusBox ? 1 : 0);
  const scale = 1 + focusP * 0.12;

  const sub = useEnter(10, 12);

  return (
    <AbsoluteFill style={{ ...pageBackground, overflow: "hidden" }}>
      <AbsoluteFill
        style={
          focusBox
            ? {
                transform: `translate(${width / 2 - focusBox.cx}px, ${height / 2 - focusBox.cy}px) scale(${scale})`,
                transformOrigin: `${focusBox.cx}px ${focusBox.cy}px`,
              }
            : undefined
        }
      >
        <header style={{ position: "absolute", left: m, top: m, width: contentW }}>
          <SectionTitle
            title={d.title}
            index={d.section}
            highlight={d.highlight}
            delay={0}
            size={titleSize}
            maxWidth={contentW}
          />
          {d.subtitle ? (
            <div
              style={{
                ...sub,
                marginTop: 14,
                maxWidth: THEME.layout.maxTextWidth,
                fontFamily: THEME.fonts.body,
                fontWeight: THEME.fonts.bodyWeight,
                fontSize: THEME.sketchnote.bodySize,
                lineHeight: THEME.fonts.lineHeights.body,
                color: THEME.colors.textSecondary,
              }}
            >
              {d.subtitle}
            </div>
          ) : null}
        </header>

        {/* connectors */}
        {isDiagram && d.edges
          ? d.edges.map((e, i) => {
              const fi = (d.nodes ?? []).findIndex((n) => n.id === e.from);
              const ti = (d.nodes ?? []).findIndex((n) => n.id === e.to);
              if (fi < 0 || ti < 0 || !boxes[fi] || !boxes[ti]) return null;
              const start = shrink(boxes[fi], boxes[ti]);
              const end = shrink(boxes[ti], boxes[fi]);
              const delay = Math.max(nodeDelay(fi), nodeDelay(ti)) + THEME.motion.drawDuration * 0.6 + i * 2;
              return (
                <SketchArrow
                  key={`${e.from}->${e.to}-${i}`}
                  from={start}
                  to={end}
                  delay={delay}
                  dashed={e.kind === "dashed"}
                  label={e.label}
                  color={THEME.colors.accent}
                  seed={30 + i}
                />
              );
            })
          : null}

        {/* diagram nodes / process steps */}
        {items.map((it, i) => {
          const b = boxes[i];
          if (!b) return null;
          const n = it.node;
          const colors = tone(n?.tone ?? "default");
          return (
            <React.Fragment key={it.key}>
              {n ? (
                <SketchBox x={b.x} y={b.y} w={b.w} h={b.h} seed={100 + i} fill={colors.wash} delay={nodeDelay(i)}>
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    {n.icon ? (
                      <Icon name={n.icon} size={46} delay={nodeDelay(i) + 6} toneName={n.tone ?? "default"} />
                    ) : null}
                    <div style={{ minWidth: 0 }}>
                      <div
                        style={{
                          fontFamily: THEME.fonts.heading,
                          fontWeight: THEME.fonts.headingWeight,
                          fontSize: THEME.sketchnote.labelSize,
                          lineHeight: 1.15,
                          color: THEME.colors.text,
                        }}
                      >
                        {n.label}
                      </div>
                      {n.sub ? (
                        <div
                          style={{
                            marginTop: 4,
                            fontFamily: THEME.fonts.mono,
                            fontSize: THEME.sketchnote.noteSize,
                            letterSpacing: "0.08em",
                            textTransform: "uppercase",
                            color: THEME.colors.textSecondary,
                          }}
                        >
                          {n.sub}
                        </div>
                      ) : null}
                    </div>
                  </div>
                </SketchBox>
              ) : (
                <SketchBox x={b.x} y={b.y} w={b.w} h={b.h} seed={200 + i} delay={nodeDelay(i)}>
                  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <CircledNumber n={i + 1} size={52} delay={nodeDelay(i) + 4} />
                    <div
                      style={{
                        fontFamily: THEME.fonts.body,
                        fontSize: THEME.sketchnote.bodySize - 2,
                        lineHeight: 1.3,
                        color: THEME.colors.text,
                      }}
                    >
                      {it.step}
                    </div>
                  </div>
                </SketchBox>
              )}
              {boxes[i + 1] ? (
                <SketchArrow
                  from={mode === "column" ? [b.cx, b.y + b.h] : [b.x + b.w, b.cy]}
                  to={mode === "column" ? [boxes[i + 1].cx, boxes[i + 1].y] : [boxes[i + 1].x, boxes[i + 1].cy]}
                  delay={nodeDelay(i + 1) - 8}
                  seed={400 + i}
                  color={isDiagram ? THEME.colors.accent : THEME.colors.text}
                />
              ) : null}
            </React.Fragment>
          );
        })}

        {/* margin notes */}
        {d.notes?.length ? (
          <div
            style={{
              position: "absolute",
              left: m,
              bottom: m,
              width: contentW,
              display: "flex",
              flexWrap: "wrap",
              gap: 22,
              alignItems: "flex-end",
            }}
          >
            {d.notes.map((n, i) => (
              <MarginNote key={i} delay={54 + stagger(i, 8)}>
                {n}
              </MarginNote>
            ))}
          </div>
        ) : null}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};