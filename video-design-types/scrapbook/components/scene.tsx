// Scrapbook — scene composer.
// Lays out a journal page from structured data: polaroids, tape, stickers,
// ticket stubs, stitch frames and handwritten notes, all at casual angles.
// Three layouts — album, board, spread — pick the arrangement.

import React from "react";
import { AbsoluteFill, useVideoConfig } from "remotion";
import { THEME } from "../tokens";
import { grainCss, stagger, tilt } from "../lib/anim";
import { DoodleSpark, HandNote, Polaroid, ScrapCaption, ScrapTitle, Sticker, StitchFrame, TicketStub, TapeLabel, WashiTape, pieceDelay } from "./primitives";

// ------------------------------------------------------------- scene schema

export type ScrapPolaroid = {
  id: string;
  /** Normalised anchor (0..1). */
  at: { x: number; y: number; w?: number };
  caption?: string;
  tone?: "rose" | "sage" | "mustard" | "sky" | "kraft";
  rotate?: number;
  delay?: number;
  seed?: number;
};

export type ScrapSticker = {
  id: string;
  kind?: "star" | "heart" | "flower" | "check";
  at: { x: number; y: number };
  size?: number;
  color?: string;
  delay?: number;
};

export type ScrapTape = {
  id: string;
  at: { x: number; y: number; w?: number };
  rotate?: number;
  color?: string;
  delay?: number;
};

export type ScrapLayout = "album" | "board" | "spread";

export type ScrapbookSceneData = {
  layout: ScrapLayout;
  /** Handwritten page title. */
  title?: string;
  /** Handwritten journal entry. */
  note?: string;
  /** Small body-sans supporting line. */
  caption?: string;
  /** Tape label acting as the section kicker. */
  kicker?: string;
  polaroids?: ScrapPolaroid[];
  stickers?: ScrapSticker[];
  tapes?: ScrapTape[];
  ticket?: { text: string; at: { x: number; y: number }; rotate?: number };
  /** Blanket-stitch frame around the page (spread layout default). */
  stitch?: { at?: { x: number; y: number; w: number; h: number }; delay?: number };
  accent?: string;
};

export type ScrapbookSceneProps = {
  data?: Partial<ScrapbookSceneData>;
  line?: { text?: string };
};

// ---------------------------------------------------------------- composer

export const ScrapbookScene: React.FC<ScrapbookSceneProps> = ({ data, line }) => {
  const { width, height } = useVideoConfig();
  const m = THEME.layout.safeMargin;

  const d: ScrapbookSceneData = {
    layout: data?.layout ?? "album",
    title: data?.title ?? line?.text,
    note: data?.note,
    caption: data?.caption,
    kicker: data?.kicker,
    polaroids: data?.polaroids,
    stickers: data?.stickers,
    tapes: data?.tapes,
    ticket: data?.ticket,
    stitch: data?.stitch,
    accent: data?.accent ?? THEME.colors.rose,
  };

  const body = (() => {
    switch (d.layout) {
      case "board":
        return <BoardLayout d={d} />;
      case "spread":
        return <SpreadLayout d={d} />;
      default:
        return <AlbumLayout d={d} />;
    }
  })();

  return (
    <AbsoluteFill style={{ backgroundColor: THEME.colors.background, overflow: "hidden" }}>
      {/* page texture */}
      <div style={{ position: "absolute", inset: 0, ...grainCss() }} />
      {body}
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------- compositions

/** Normalised → pixels helper shared by every layout. */
const px = (v: number, total: number): number => Math.round(v * total);

/** Album — one big taped polaroid, title above, note below. */
const AlbumLayout: React.FC<{ d: ScrapbookSceneData }> = ({ d }) => {
  const { width, height } = useVideoConfig();
  const m = THEME.layout.safeMargin;
  const pol =
    d.polaroids?.[0] ??
    ({ id: "p1", at: { x: 0.54, y: 0.3, w: 0.34 }, caption: "worker ×3", tone: "sky", seed: 3 } as ScrapPolaroid);
  return (
    <>
      {d.kicker ? <TapeLabel text={d.kicker} x={m} y={m} rotate={-3} color={THEME.colors.sage} delay={2} /> : null}
      {d.title ? <ScrapTitle text={d.title} x={m} y={m + 90} width={Math.round(width * 0.52)} delay={5} /> : null}
      <Polaroid
        x={px(pol.at.x, width)}
        y={px(pol.at.y, height)}
        w={px(pol.at.w ?? 0.34, width)}
        caption={pol.caption}
        tone={pol.tone}
        rotate={pol.rotate}
        seed={pol.seed ?? 3}
        delay={pol.delay ?? 10}
      />
      {d.note ? <HandNote text={d.note} x={m} y={Math.round(height * 0.72)} width={Math.round(width * 0.52)} rotate={-1.6} delay={18} /> : null}
      {d.caption ? <ScrapCaption text={d.caption} x={m} y={Math.round(height * 0.86)} width={Math.round(width * 0.7)} delay={26} /> : null}
      {(d.tapes ?? defaultTapes()).map((t, i) => (
        <WashiTape
          key={t.id}
          x={px(t.at.x, width)}
          y={px(t.at.y, height)}
          w={t.at.w ? px(t.at.w, width) : undefined}
          rotate={t.rotate ?? tilt(i * 5 + 2, 7)}
          color={t.color ?? (i % 2 === 0 ? THEME.colors.rose : THEME.colors.mustard)}
          delay={(t.delay ?? 0) + 14 + stagger(i, 4)}
        />
      ))}
      {(d.stickers ?? [{ id: "st1", kind: "heart", at: { x: 0.86, y: 0.24 }, size: 130 } as ScrapSticker]).map((s) => (
        <Sticker key={s.id} kind={s.kind ?? "star"} x={px(s.at.x, width)} y={px(s.at.y, height)} size={s.size ?? 120} color={s.color ?? d.accent} delay={(s.delay ?? 0) + 22} />
      ))}
      <DoodleSpark x={Math.round(width * 0.44)} y={Math.round(height * 0.26)} size={80} color={d.accent} delay={30} />
    </>
  );
};

/** Board — several scattered polaroids + stickers + a ticket stub. */
const BoardLayout: React.FC<{ d: ScrapbookSceneData }> = ({ d }) => {
  const { width, height } = useVideoConfig();
  const m = THEME.layout.safeMargin;
  const pols =
    d.polaroids ??
    ([
      { id: "p1", at: { x: 0.06, y: 0.18, w: 0.26 }, caption: "queue", tone: "mustard", seed: 4 },
      { id: "p2", at: { x: 0.37, y: 0.14, w: 0.26 }, caption: "workers", tone: "sky", seed: 7 },
      { id: "p3", at: { x: 0.68, y: 0.2, w: 0.26 }, caption: "merged!", tone: "rose", seed: 11 },
    ] as ScrapPolaroid[]);
  return (
    <>
      {d.kicker ? <TapeLabel text={d.kicker} x={m} y={Math.round(m * 0.7)} rotate={-2} color={d.accent} delay={2} /> : null}
      {pols.map((p, i) => (
        <Polaroid
          key={p.id}
          x={px(p.at.x, width)}
          y={px(p.at.y, height)}
          w={px(p.at.w ?? 0.26, width)}
          caption={p.caption}
          tone={p.tone}
          rotate={p.rotate ?? tilt(i * 11 + 1, 5)}
          seed={p.seed ?? i + 2}
          delay={(p.delay ?? 0) + pieceDelay(i) * 2}
        />
      ))}
      {d.title ? <ScrapTitle text={d.title} x={m} y={Math.round(height * 0.62)} width={width - m * 2} size={Math.round(THEME.scrap.titleMax * 0.72)} delay={14} /> : null}
      {d.note ? <HandNote text={d.note} x={m} y={Math.round(height * 0.76)} width={Math.round(width * 0.62)} rotate={-1.2} delay={20} /> : null}
      {d.ticket ? (
        <TicketStub text={d.ticket.text} x={px(d.ticket.at.x, width)} y={px(d.ticket.at.y, height)} rotate={d.ticket.rotate ?? tilt(9, 6)} delay={24} />
      ) : (
        <TicketStub text="Admit one task" x={Math.round(width * 0.64)} y={Math.round(height * 0.78)} rotate={-4} delay={24} />
      )}
      {(d.stickers ?? [
        { id: "s1", kind: "star", at: { x: 0.3, y: 0.11 }, size: 110 },
        { id: "s2", kind: "check", at: { x: 0.9, y: 0.17 }, size: 120, color: "#8AA88B" },
      ] as ScrapSticker[]).map((s) => (
        <Sticker key={s.id} kind={s.kind ?? "star"} x={px(s.at.x, width)} y={px(s.at.y, height)} size={s.size ?? 110} color={s.color ?? d.accent} delay={(s.delay ?? 0) + 26} />
      ))}
      {d.caption ? <ScrapCaption text={d.caption} x={m} y={Math.round(height * 0.9)} width={width - m * 2} delay={30} /> : null}
    </>
  );
};

/** Spread — stitched frame around a written entry + a taped corner. */
const SpreadLayout: React.FC<{ d: ScrapbookSceneData }> = ({ d }) => {
  const { width, height } = useVideoConfig();
  const m = THEME.layout.safeMargin;
  const box = d.stitch?.at ?? { x: m, y: Math.round(height * 0.2), w: width - m * 2, h: Math.round(height * 0.56) };
  const pol = d.polaroids?.[0];
  return (
    <>
      {d.kicker ? <TapeLabel text={d.kicker} x={m} y={Math.round(m * 0.7)} rotate={-3} color={THEME.colors.mustard} textColor={THEME.colors.ink} delay={2} /> : null}
      <StitchFrame x={box.x} y={box.y} w={box.w} h={box.h} color={d.accent} delay={d.stitch?.delay ?? 4} />
      {d.title ? <ScrapTitle text={d.title} x={m + 40} y={box.y + 46} width={box.w - 80} delay={8} underline={false} /> : null}
      {d.note ? <HandNote text={d.note} x={m + 40} y={box.y + 200} width={box.w - 80} size={THEME.scrap.noteSize + 6} rotate={-0.8} delay={14} /> : null}
      {d.caption ? <ScrapCaption text={d.caption} x={m + 40} y={box.y + box.h - 110} width={box.w - 80} delay={22} /> : null}
      {pol ? (
        <Polaroid x={px(pol.at.x, width)} y={px(pol.at.y, height)} w={px(pol.at.w ?? 0.3, width)} caption={pol.caption} tone={pol.tone} rotate={pol.rotate} seed={pol.seed ?? 5} delay={16} />
      ) : (
        <Polaroid x={Math.round(width * 0.66)} y={Math.round(height * 0.74)} w={Math.round(width * 0.26)} caption="one result" tone="sage" seed={5} delay={16} />
      )}
      {(d.tapes ?? defaultTapes(2)).map((t, i) => (
        <WashiTape key={t.id} x={px(t.at.x, width)} y={px(t.at.y, height)} w={t.at.w ? px(t.at.w, width) : undefined} rotate={t.rotate ?? tilt(i * 7 + 3, 6)} color={t.color ?? THEME.colors.rose} delay={(t.delay ?? 0) + 18} />
      ))}
      <Sticker kind="flower" x={Math.round(width * 0.1)} y={Math.round(height * 0.8)} size={120} color={THEME.colors.sage} delay={28} />
    </>
  );
};

/** Two corner tapes shared by layouts that don't specify their own. */
function defaultTapes(n = 2): ScrapTape[] {
  const base: ScrapTape[] = [
    { id: "t1", at: { x: 0.04, y: 0.06 }, rotate: -8, color: THEME.colors.rose },
    { id: "t2", at: { x: 0.8, y: 0.08, w: 0.16 }, rotate: 7, color: THEME.colors.sage },
  ];
  return base.slice(0, n);
}
