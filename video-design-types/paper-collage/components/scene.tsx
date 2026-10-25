// Paper Collage — scene composer.
// Builds an art-directed collage from structured piece data at the real frame
// size. Missing pieces fall back to a text-led arrangement, never a blank frame.

import React from "react";
import { AbsoluteFill, useVideoConfig } from "remotion";
import { THEME } from "../tokens";
import { fitSize, wrapText, type Stock } from "../lib/anim";
import {
  Caption,
  CollageArrow,
  CutCircle,
  CutOutNumeral,
  FoldCard,
  GrainOverlay,
  HandNote,
  LabelStrip,
  PaperPiece,
  TornBand,
} from "./primitives";

// ------------------------------------------------------------- scene schema

export type CollagePiece = {
  id: string;
  kind: "text" | "card" | "circle" | "numeral" | "label" | "arrow" | "note" | "caption";
  text?: string;
  sub?: string;
  color?: string;
  stockName?: Stock;
  /** Normalised frame box: x, y, w, h as 0..1 fractions (w/h optional for auto-sized pieces). */
  at: { x: number; y: number; w?: number; h?: number };
  rotate?: number;
  depth?: number;
  dir?: "right" | "down" | "left";
};

export type CollageSceneData = {
  title: string;
  kicker?: string;
  subtitle?: string;
  field?: { color?: string; stockName?: Stock; side?: "left" | "right" | "top" | "bottom" | "none" };
  tornBand?: { color?: string; stockName?: Stock; at?: number; h?: number };
  pieces?: CollagePiece[];
  notes?: string[];
};

export type CollageSceneProps = {
  data?: Partial<CollageSceneData>;
  line?: { text?: string };
};

// ---------------------------------------------------------------- composer

export const CollageScene: React.FC<CollageSceneProps> = ({ data, line }) => {
  const { width, height } = useVideoConfig();
  const m = THEME.layout.safeMargin;
  const px = (v: number, total: number): number => Math.round(v * total);

  const d: CollageSceneData = {
    title: data?.title ?? line?.text ?? "Untitled",
    kicker: data?.kicker,
    subtitle: data?.subtitle,
    field: data?.field,
    tornBand: data?.tornBand,
    pieces: data?.pieces,
    notes: data?.notes,
  };

  const fieldSide = d.field?.side ?? "none";
  const fieldStock: Stock = d.field?.stockName ?? "blue";
  const fieldBox =
    fieldSide === "left"
      ? { x: 0, y: 0, w: Math.round(width * 0.44), h: height }
      : fieldSide === "right"
        ? { x: Math.round(width * 0.56), y: 0, w: Math.round(width * 0.44), h: height }
        : fieldSide === "top"
          ? { x: 0, y: 0, w: width, h: Math.round(height * 0.42) }
          : fieldSide === "bottom"
            ? { x: 0, y: Math.round(height * 0.56), w: width, h: Math.round(height * 0.44) }
            : null;

  const titleSize = fitSize(d.title, width - m * 2 - 80, THEME.paper.headlineSize, 46, 0.5, 4);
  const titleLines = wrapText(d.title, Math.max(8, Math.floor((width - m * 2 - 80) / (titleSize * 0.5))));
  const titleH = Math.round(titleLines.length * titleSize * THEME.fonts.lineHeights.heading) + 64;
  const titleW = Math.min(width - m * 2, Math.round(width * 0.78));

  const hasPieces = (d.pieces?.length ?? 0) > 0;

  // Text-led fallback: kicker + headline piece + subtitle, composed by hand.
  const fallback: CollagePiece[] = [
    {
      id: "title",
      kind: "text",
      text: d.title,
      at: { x: m / width, y: 0.24, w: titleW / width, h: titleH / height },
      rotate: -1.1,
      depth: 3,
    },
  ];
  if (d.subtitle) {
    fallback.push({
      id: "sub",
      kind: "caption",
      text: d.subtitle,
      at: { x: (m + 10) / width, y: 0.24 + titleH / height + 0.02, w: Math.min(720, titleW) / width, h: 0.1 },
      depth: 4,
    });
  }
  const pieces = hasPieces ? d.pieces! : fallback;

  return (
    <AbsoluteFill style={{ backgroundColor: THEME.colors.background, overflow: "hidden" }}>
      {/* 1 · background field */}
      {fieldBox ? (
        <PaperPiece
          x={fieldBox.x}
          y={fieldBox.y}
          w={fieldBox.w}
          h={fieldBox.h}
          color={d.field?.color}
          stockName={fieldStock}
          depth={0}
          seed={3}
          torn={{ t: fieldSide === "bottom", b: fieldSide === "top", l: fieldSide === "right", r: fieldSide === "left" }}
          shadow="flat"
          rotate={0}
          dy={0}
          dx={fieldSide === "left" ? -60 : fieldSide === "right" ? 60 : 0}
          padding={0}
        />
      ) : null}

      {/* 2 · torn divider */}
      {d.tornBand ? (
        <TornBand at={d.tornBand.at ?? 0.62} h={d.tornBand.h ?? 150} color={d.tornBand.color} stockName={d.tornBand.stockName} seed={17} />
      ) : null}

      {/* 3 · kicker label */}
      {d.kicker ? <LabelStrip x={m} y={m} text={d.kicker} stockName="mustard" rotate={-1.8} depth={4} index={0} /> : null}

      {/* 4 · pieces */}
      {pieces.map((p, i) => {
        const bx = px(p.at.x, width);
        const by = px(p.at.y, height);
        const bw = px(p.at.w ?? 0.3, width);
        const bh = px(p.at.h ?? 0.15, height);
        const common = { seed: 40 + i, rotate: p.rotate, depth: p.depth ?? 2, index: i };
        switch (p.kind) {
          case "card":
            return (
              <FoldCard key={p.id} x={bx} y={by} w={bw} h={bh} color={p.color} stockName={p.stockName ?? "white"} {...common}>
                <div
                  style={{
                    fontFamily: THEME.fonts.subheading,
                    fontWeight: THEME.fonts.subWeight,
                    fontSize: Math.min(46, Math.round(bh * 0.24)),
                    lineHeight: 1.1,
                    color: THEME.colors.ink,
                  }}
                >
                  {p.text}
                </div>
                {p.sub ? (
                  <div
                    style={{
                      fontFamily: THEME.fonts.body,
                      fontSize: Math.min(26, Math.round(bh * 0.14)),
                      lineHeight: 1.4,
                      color: THEME.colors.textSecondary,
                    }}
                  >
                    {p.sub}
                  </div>
                ) : null}
              </FoldCard>
            );
          case "circle":
            return (
              <CutCircle key={p.id} x={bx} y={by} d={bw} color={p.color} stockName={p.stockName ?? "blue"} {...common}>
                <span
                  style={{
                    fontFamily: THEME.fonts.heading,
                    fontSize: Math.round(bw * 0.34),
                    lineHeight: 1,
                    color: THEME.colors.ink,
                  }}
                >
                  {p.text}
                </span>
              </CutCircle>
            );
          case "numeral":
            return (
              <CutOutNumeral
                key={p.id}
                n={p.text ?? ""}
                x={bx}
                y={by}
                size={bh}
                color={p.color}
                stockName={p.stockName ?? "terracotta"}
                rotate={p.rotate ?? -3}
                depth={p.depth ?? 3}
                index={i}
              />
            );
          case "label":
            return (
              <LabelStrip
                key={p.id}
                x={bx}
                y={by}
                text={p.text ?? ""}
                color={p.color}
                stockName={p.stockName ?? "mustard"}
                rotate={p.rotate}
                depth={p.depth ?? 4}
                index={i}
              />
            );
          case "arrow":
            return (
              <CollageArrow
                key={p.id}
                x={bx}
                y={by}
                w={bw}
                h={Math.round((bw * 74) / 260)}
                dir={p.dir ?? "right"}
                color={p.color}
                rotate={p.rotate ?? -4}
                depth={p.depth ?? 4}
                index={i}
              />
            );
          case "note":
            return (
              <HandNote key={p.id} x={bx} y={by} rotate={p.rotate} color={p.color} delay={48 + i * 4}>
                {p.text}
              </HandNote>
            );
          case "caption":
            return (
              <Caption key={p.id} x={bx} y={by} w={bw} delay={40 + i * 4}>
                {p.text}
              </Caption>
            );
          default: {
            const size = fitSize(p.text ?? "", bw - 64, THEME.paper.headlineSize, 30, 0.5, 4);
            const lines = wrapText(p.text ?? "", Math.max(6, Math.floor((bw - 64) / (size * 0.5))));
            return (
              <PaperPiece
                key={p.id}
                x={bx}
                y={by}
                w={bw}
                h={bh}
                color={p.color}
                stockName={p.stockName ?? "white"}
                {...common}
                padding={32}
              >
                <div
                  style={{
                    fontFamily: THEME.fonts.heading,
                    fontWeight: THEME.fonts.headingWeight,
                    fontSize: size,
                    lineHeight: THEME.fonts.lineHeights.heading,
                    letterSpacing: THEME.fonts.headingLetterSpacing,
                    color: THEME.colors.ink,
                    whiteSpace: "pre-line",
                  }}
                >
                  {lines.join("\n")}
                </div>
              </PaperPiece>
            );
          }
        }
      })}

      {/* 5 · handwritten notes on top */}
      {d.notes?.map((n, i) => (
        <div
          key={`note-${i}`}
          style={{
            position: "absolute",
            left: m,
            bottom: m + i * 54,
            maxWidth: width - m * 2,
            fontFamily: THEME.fonts.annotation,
            fontSize: 30,
            lineHeight: 1.3,
            color: THEME.colors.text,
            transform: `rotate(${-1.4 + i * 0.6}deg)`,
          }}
        >
          {n}
        </div>
      ))}

      <GrainOverlay />
    </AbsoluteFill>
  );
};