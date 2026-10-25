// Example scenes — Scrapbook.
// The same subject ("how a distributed system assigns work to multiple
// computers") staged as an album page, a scattered board and a stitched
// spread. Structure is data; the layout does the memory-keeping.

import React from "react";
import { ScrapbookScene, type ScrapbookSceneData, type ScrapbookSceneProps } from "./scene";

/** Album — one big taped polaroid with a handwritten title and note. */
export const albumPageData: ScrapbookSceneData = {
  layout: "album",
  kicker: "project diary",
  title: "the day we\nshared one job",
  note: "the coordinator cut it into three pieces and just… let go.",
  caption: "Three machines later, nobody held the whole thing.",
  polaroids: [{ id: "p1", at: { x: 0.55, y: 0.26, w: 0.36 }, caption: "worker ×3", tone: "sky", seed: 3 }],
};

/** Board — three polaroids scattered, stickers, ticket stub. */
export const boardPageData: ScrapbookSceneData = {
  layout: "board",
  kicker: "three steps",
  title: "split · run · merge",
  note: "each machine only ever sees its own slice of the work.",
  caption: "One merged result, back where it started.",
  polaroids: [
    { id: "p1", at: { x: 0.06, y: 0.16, w: 0.26 }, caption: "queue", tone: "mustard", seed: 4 },
    { id: "p2", at: { x: 0.37, y: 0.12, w: 0.26 }, caption: "workers", tone: "sky", seed: 7 },
    { id: "p3", at: { x: 0.68, y: 0.18, w: 0.26 }, caption: "merged!", tone: "rose", seed: 11 },
  ],
  ticket: { text: "admit 3 tasks", at: { x: 0.66, y: 0.78 }, rotate: -5 },
};

/** Spread — stitched frame around the written entry. */
export const spreadPageData: ScrapbookSceneData = {
  layout: "spread",
  kicker: "entry no. 42",
  title: "nobody holds the whole job",
  note: "split it, hand it out, fold the answers back together — same result every time, even when a machine dies mid-run.",
  caption: "Failure at one step is just a retry.",
  polaroids: [{ id: "p1", at: { x: 0.66, y: 0.74, w: 0.26 }, caption: "one result", tone: "sage", seed: 5 }],
};

/** Default export — the album page (the style's home layout). */
export const ExampleScene: React.FC<ScrapbookSceneProps> = (props) => (
  <ScrapbookScene {...props} data={{ ...albumPageData, ...props.data }} />
);

export const BoardExample: React.FC<ScrapbookSceneProps> = (props) => (
  <ScrapbookScene {...props} data={{ ...boardPageData, ...props.data }} />
);

export const SpreadExample: React.FC<ScrapbookSceneProps> = (props) => (
  <ScrapbookScene {...props} data={{ ...spreadPageData, ...props.data }} />
);
