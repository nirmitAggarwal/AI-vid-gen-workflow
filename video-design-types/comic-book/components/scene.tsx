// Comic Book — scene composer.
// Assembles a comic page from structured data: panels, balloons, caption
// boxes, an action word that shakes the frame. Three layouts — splash, strip,
// burst — pick the page; positions are normalised so any subject fits.

import React from "react";
import { AbsoluteFill, useVideoConfig } from "remotion";
import { THEME } from "../tokens";
import { useShake, stagger } from "../lib/anim";
import { ActionWord, CaptionBox, ColorField, ComicTitle, HalftoneOverlay, Panel, ShoutBurst, SpeechBalloon, SpeedLines } from "./primitives";

// ------------------------------------------------------------- scene schema

export type ComicBalloon = {
  id: string;
  text: string;
  /** Normalised anchor (0..1). */
  at: { x: number; y: number; w?: number };
  tail?: "left" | "right" | "bottom";
  kind?: "speech" | "shout";
  delay?: number;
  rotate?: number;
};

export type ComicPanel = {
  id: string;
  at: { x: number; y: number; w: number; h: number };
  fill?: string;
  delay?: number;
};

export type ComicLayout = "splash" | "strip" | "burst";

export type ComicSceneData = {
  layout: ComicLayout;
  /** Narrator caption box (first read on the page). */
  caption?: string;
  /** The impact word — slams in and shakes the frame. */
  action?: { word: string; at?: { x?: number; y?: number }; color?: string; rotate?: number; delay?: number };
  balloons?: ComicBalloon[];
  panels?: ComicPanel[];
  /** Only for `burst`: the shout inside the jagged star. */
  shout?: string;
  /** Only for `splash`: comic title lettering. */
  title?: string;
  speedLines?: boolean;
  field?: string;
  accent?: string;
};

export type ComicSceneProps = {
  data?: Partial<ComicSceneData>;
  line?: { text?: string };
};

// ---------------------------------------------------------------- composer

export const ComicScene: React.FC<ComicSceneProps> = ({ data, line }) => {
  const { width, height } = useVideoConfig();
  const m = THEME.layout.safeMargin;

  const d: ComicSceneData = {
    layout: data?.layout ?? "splash",
    caption: data?.caption,
    action: data?.action,
    balloons: data?.balloons,
    panels: data?.panels,
    shout: data?.shout,
    title: data?.title,
    speedLines: data?.speedLines ?? true,
    field: data?.field,
    accent: data?.accent ?? THEME.colors.red,
  };

  // The frame shake belongs to the page, not the word — it starts when the
  // action word lands and decays to zero.
  const shakeAt = d.action ? (d.action.delay ?? 12) : 999;
  const pageShake = useShake(shakeAt, 5);

  const px = (v: number, total: number): number => Math.round(v * total);

  const defaultPanels: ComicPanel[] =
    d.layout === "strip"
      ? [
          { id: "p1", at: { x: 0.06, y: 0.1, w: 0.42, h: 0.34 }, fill: THEME.colors.blue },
          { id: "p2", at: { x: 0.52, y: 0.1, w: 0.42, h: 0.34 }, fill: THEME.colors.yellow },
          { id: "p3", at: { x: 0.06, y: 0.48, w: 0.88, h: 0.4 }, fill: THEME.colors.red },
        ]
      : d.layout === "splash"
        ? [{ id: "p1", at: { x: 0.05, y: 0.16, w: 0.9, h: 0.66 }, fill: THEME.colors.blue }]
        : [];
  const panels = d.panels?.length ? d.panels : defaultPanels;

  const defaultBalloons: ComicBalloon[] =
    d.layout === "strip"
      ? [
          { id: "b1", text: "One job in!", at: { x: 0.08, y: 0.14, w: 0.34 }, tail: "bottom" },
          { id: "b2", text: "Three machines out!", at: { x: 0.55, y: 0.14, w: 0.34 }, tail: "bottom", kind: "shout" },
        ]
      : d.layout === "splash"
        ? [{ id: "b1", text: "Nobody holds the whole job!", at: { x: 0.5, y: 0.58, w: 0.4 }, tail: "left" }]
        : [];
  const balloons = d.balloons?.length ? d.balloons : defaultBalloons;

  const actionDelay = d.action?.delay ?? 12;

  return (
    <AbsoluteFill style={{ backgroundColor: THEME.colors.background, overflow: "hidden" }}>
      {/* 1 · page furniture */}
      {d.field ? <ColorField color={d.field} delay={0} /> : null}
      {d.speedLines ? <SpeedLines delay={6} opacity={d.layout === "burst" ? 0.2 : 0.12} /> : null}

      {/* 2 · the page (everything that shakes with the impact) */}
      <AbsoluteFill style={{ transform: pageShake }}>
        {/* panels */}
        {panels.map((p, i) => (
          <Panel
            key={p.id}
            x={px(p.at.x, width)}
            y={px(p.at.y, height)}
            w={px(p.at.w, width)}
            h={px(p.at.h, height)}
            fill={p.fill ?? THEME.colors.blue}
            delay={(p.delay ?? 0) + i * 1.5}
            index={i}
          />
        ))}

        {/* burst layout owns the centre */}
        {d.layout === "burst" ? (
          <ShoutBurst
            text={d.shout ?? d.action?.word ?? "POW!"}
            x={Math.round(width * 0.11)}
            y={Math.round(height * 0.24)}
            w={Math.round(width * 0.78)}
            h={Math.round(height * 0.42)}
            fill={THEME.colors.yellow}
            delay={4}
            seed={11}
          />
        ) : null}

        {/* splash title lettering */}
        {d.layout === "splash" && d.title ? <ComicTitle text={d.title} y={Math.round(height * 0.2)} size={Math.round(width * 0.16)} delay={6} /> : null}

        {/* 3 · halftone over panels, under lettering */}
        <HalftoneOverlay />

        {/* balloons */}
        {balloons.map((b, i) => (
          <SpeechBalloon
            key={b.id}
            text={b.text}
            x={px(b.at.x, width)}
            y={px(b.at.y, height)}
            w={b.at.w ? px(b.at.w, width) : undefined}
            tail={b.tail ?? "left"}
            kind={b.kind ?? "speech"}
            delay={(b.delay ?? 0) + 18 + stagger(i, THEME.motion.panelStagger)}
            rotate={b.rotate}
          />
        ))}

        {/* narrator caption — top read */}
        {d.caption ? <CaptionBox text={d.caption} x={m} y={m} w={Math.min(width - m * 2, 640)} delay={2} /> : null}

        {/* 4 · the action word (last on top) */}
        {d.action ? (
          <ActionWord
            text={d.action.word}
            x={d.action.at?.x != null ? px(d.action.at.x, width) : undefined}
            y={d.action.at?.y != null ? px(d.action.at.y, height) : Math.round(height * (d.layout === "burst" ? 0.7 : 0.44))}
            color={d.action.color ?? d.accent}
            delay={actionDelay}
            rotate={d.action.rotate ?? -6}
          />
        ) : null}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
