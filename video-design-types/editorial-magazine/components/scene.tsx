// Editorial Magazine — scene composer.
// Builds a spread from structured data at the real frame size: rubric, masked
// headline, standfirst, duotone photo, cascading body columns, pull quote,
// folio. `layout` picks the composition; missing parts fall back gracefully.

import React from "react";
import { AbsoluteFill, useVideoConfig } from "remotion";
import { THEME } from "../tokens";
import { fitSize, wrapText } from "../lib/anim";
import { BodyColumns, Folio, GrainOverlay, Headline, Masthead, PhotoBlock, PullQuote, Rubric, Rule, Standfirst } from "./primitives";

// ------------------------------------------------------------- scene schema

export type MagazineLayout = "cover" | "feature" | "columns" | "quote";

export type MagazineSceneData = {
  layout: MagazineLayout;
  /** Section rubric, top-left. */
  kicker?: string;
  /** Headline — \n breaks are respected, otherwise it wraps deterministically. */
  headline: string;
  /** Deck/summary under the headline. */
  standfirst?: string;
  /** Article text — set in columns; first paragraph can open with a drop cap. */
  body?: string;
  pullQuote?: string;
  /** Duotone photo block (gradient field, no external assets). */
  photo?: { caption?: string; tone?: "ink" | "red" | "blue"; at?: { x: number; y: number; w: number; h: number } };
  masthead?: { title?: string; issue?: string };
  folio?: { page?: number | string; section?: string };
  accent?: string;
};

export type MagazineSceneProps = {
  data?: Partial<MagazineSceneData>;
  line?: { text?: string };
};

// ---------------------------------------------------------------- composer

export const MagazineScene: React.FC<MagazineSceneProps> = ({ data, line }) => {
  const { width, height } = useVideoConfig();
  const m = THEME.layout.safeMargin;
  const usableW = width - m * 2;

  const d: MagazineSceneData = {
    layout: data?.layout ?? "feature",
    kicker: data?.kicker,
    headline: data?.headline ?? line?.text ?? "Untitled",
    standfirst: data?.standfirst,
    body: data?.body,
    pullQuote: data?.pullQuote,
    photo: data?.photo,
    masthead: data?.masthead,
    folio: data?.folio,
    accent: data?.accent,
  };

  // Deterministic headline sizing up front so every layout positions from
  // the same measured stack.
  const headlineLines = d.headline.split("\n");
  const headlineSize = fitSize(d.headline, usableW, THEME.magazine.headlineMax, THEME.magazine.headlineMin, THEME.magazine.charRatio, 3);
  const headlineH = Math.round(headlineLines.length * headlineSize * THEME.fonts.lineHeights.heading);
  const standfirstChars = d.standfirst ? wrapText(d.standfirst, Math.max(20, Math.floor(Math.min(usableW, 760) / (THEME.magazine.standfirstSize * 0.5)))) : [];
  const standfirstH = d.standfirst ? Math.round(standfirstChars.length * THEME.magazine.standfirstSize * 1.32) + 36 : 0;

  const bodyTop = m + 150 + headlineH + (d.standfirst ? standfirstH + 24 : 0);

  const body = (() => {
    switch (d.layout) {
      case "cover":
        return <CoverLayout d={d} headlineSize={headlineSize} headlineH={headlineH} />;
      case "quote":
        return <QuoteLayout d={d} headlineSize={headlineSize} />;
      case "columns":
        return <ColumnsLayout d={d} bodyTop={bodyTop} />;
      default:
        return <FeatureLayout d={d} headlineSize={headlineSize} headlineH={headlineH} bodyTop={bodyTop} />;
    }
  })();

  return (
    <AbsoluteFill style={{ backgroundColor: THEME.colors.background, overflow: "hidden" }}>
      {/* 1 · running head */}
      {d.layout === "cover" ? (
        <Masthead title={d.masthead?.title ?? "The Dispatch"} issue={d.masthead?.issue} delay={0} />
      ) : (
        <Rule y={m - 16} weight={THEME.magazine.ruleThick} delay={0} />
      )}

      {/* 2 · rubric */}
      {d.kicker && d.layout !== "cover" ? <Rubric text={d.kicker} delay={4} y={m + 8} /> : null}
      {d.kicker && d.layout === "cover" ? <Rubric text={d.kicker} delay={18} y={Math.round(height * 0.46)} /> : null}

      {/* 3 · the spread */}
      {body}

      {/* 4 · folio */}
      <Folio page={d.folio?.page} section={d.folio?.section} delay={38} />

      <GrainOverlay />
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------ layouts

/** Cover — masthead, giant masked headline, standfirst on a tint block. */
const CoverLayout: React.FC<{ d: MagazineSceneData; headlineSize: number; headlineH: number }> = ({ d, headlineSize, headlineH }) => {
  const { width, height } = useVideoConfig();
  const m = THEME.layout.safeMargin;
  const top = Math.round(height * 0.3);
  return (
    <>
      <Headline text={d.headline} delay={10} size={headlineSize} y={top} width={width - m * 2} />
      <Rule y={top + headlineH + 30} weight={THEME.magazine.ruleThick} delay={22} />
      {d.standfirst ? (
        <Standfirst text={d.standfirst} delay={26} y={top + headlineH + 54} width={Math.min(width - m * 2, 820)} tint />
      ) : null}
      {d.photo ? (
        <PhotoBlock
          x={m}
          y={Math.round(height * 0.62)}
          w={width - m * 2}
          h={Math.round(height * 0.22)}
          tone={d.photo.tone ?? "blue"}
          caption={d.photo.caption}
          delay={30}
        />
      ) : null}
    </>
  );
};

/** Feature — rubric, headline, photo right, two body columns beneath. */
const FeatureLayout: React.FC<{ d: MagazineSceneData; headlineSize: number; headlineH: number; bodyTop: number }> = ({
  d,
  headlineSize,
  headlineH,
  bodyTop,
}) => {
  const { width, height } = useVideoConfig();
  const m = THEME.layout.safeMargin;
  const top = m + 70;
  const photoBox = d.photo?.at ?? { x: Math.round(width * 0.56), y: top, w: Math.round(width * 0.44) - m, h: Math.round(height * 0.26) };
  const headW = d.photo ? photoBox.x - m - 40 : width - m * 2;
  return (
    <>
      <Headline text={d.headline} delay={8} size={Math.min(headlineSize, 210)} y={top + 30} width={headW} />
      <PhotoBlock x={photoBox.x} y={photoBox.y} w={photoBox.w} h={photoBox.h} tone={d.photo?.tone ?? "ink"} caption={d.photo?.caption} delay={18} />
      {d.standfirst ? <Standfirst text={d.standfirst} delay={24} y={top + 40 + headlineH + 10} width={Math.min(width - m * 2, 900)} /> : null}
      {d.body ? <BodyColumns text={d.body} delay={30} y={Math.max(bodyTop, top + 140 + headlineH)} columns={THEME.layout.columns} dropCap /> : null}
      {!d.body && d.pullQuote ? <PullQuote text={d.pullQuote} delay={30} y={Math.max(bodyTop, top + 160 + headlineH)} /> : null}
    </>
  );
};

/** Columns — drop-capped article body is the star, small headline on top. */
const ColumnsLayout: React.FC<{ d: MagazineSceneData; bodyTop: number }> = ({ d, bodyTop }) => {
  const { width, height } = useVideoConfig();
  const m = THEME.layout.safeMargin;
  return (
    <>
      <Headline text={d.headline} delay={6} size={Math.min(fitSize(d.headline, width - m * 2, 150, 64, THEME.magazine.charRatio, 2), 150)} y={m + 70} width={width - m * 2} />
      <Rule y={m + 70 + Math.round(d.headline.split("\n").length * 150 * THEME.fonts.lineHeights.heading) + 18} weight={THEME.magazine.ruleHairline} delay={16} />
      {d.standfirst ? <Standfirst text={d.standfirst} delay={18} y={m + 260} width={Math.min(width - m * 2, 860)} size={THEME.magazine.standfirstSize - 6} /> : null}
      {d.body ? (
        <BodyColumns text={d.body} delay={24} y={Math.max(bodyTop, Math.round(height * 0.42))} columns={THEME.layout.columns} dropCap />
      ) : null}
      {d.pullQuote ? <PullQuote text={d.pullQuote} delay={34} y={Math.round(height * 0.76)} size={THEME.magazine.pullQuoteSize - 16} /> : null}
    </>
  );
};

/** Quote — the pull quote owns the page; headline is a small kicker above. */
const QuoteLayout: React.FC<{ d: MagazineSceneData; headlineSize: number }> = ({ d, headlineSize }) => {
  const { width, height } = useVideoConfig();
  const m = THEME.layout.safeMargin;
  return (
    <>
      <Headline text={d.headline} delay={6} size={Math.min(headlineSize, 96)} y={Math.round(height * 0.2)} width={width - m * 2} />
      <PullQuote text={d.pullQuote ?? d.standfirst ?? d.headline} delay={16} y={Math.round(height * 0.4)} size={THEME.magazine.pullQuoteSize} width={width - m * 2} />
      {d.photo ? (
        <PhotoBlock x={m} y={Math.round(height * 0.7)} w={width - m * 2} h={Math.round(height * 0.14)} tone={d.photo.tone ?? "red"} caption={d.photo.caption} delay={28} />
      ) : null}
      {d.body ? <BodyColumns text={d.body} delay={30} y={Math.round(height * 0.66)} columns={1} size={28} /> : null}
    </>
  );
};
