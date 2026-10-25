// Example scenes — Paper Collage.
// Same subject ("how a distributed system assigns work to multiple computers")
// shown as a full layered collage and as a single-paper composition.

import React from "react";
import { CollageScene, type CollageSceneData, type CollageSceneProps } from "./scene";

/** A layered collage: field, torn band, headline piece, labels, numeral, note. */
export const distributedCollageData: CollageSceneData = {
  title: "One job in.\nMachines out.",
  kicker: "Distributed systems",
  subtitle: "The coordinator splits the work; nobody holds the whole job.",
  field: { stockName: "kraft", side: "right" },
  tornBand: { stockName: "terracotta", at: 0.56, h: 168 },
  pieces: [
    {
      id: "headline",
      kind: "text",
      text: "One job in.\nMachines out.",
      at: { x: 0.05, y: 0.16, w: 0.6, h: 0.26 },
      rotate: -1.2,
      depth: 3,
    },
    {
      id: "sub",
      kind: "caption",
      text: "The coordinator splits the work; nobody holds the whole job.",
      at: { x: 0.06, y: 0.45, w: 0.48, h: 0.08 },
      depth: 4,
    },
    {
      id: "parallel",
      kind: "circle",
      text: "\u00d73",
      stockName: "blue",
      at: { x: 0.64, y: 0.12, w: 0.26, h: 0.26 },
      rotate: 0,
      depth: 3,
    },
    { id: "l1", kind: "label", text: "Coordinator", at: { x: 0.08, y: 0.66 }, rotate: -2.2, depth: 4 },
    { id: "l2", kind: "label", text: "Queue", stockName: "white", at: { x: 0.4, y: 0.66 }, rotate: 1.6, depth: 4 },
    {
      id: "arrow",
      kind: "arrow",
      dir: "right",
      stockName: "ink",
      at: { x: 0.08, y: 0.74, w: 0.26, h: 0.05 },
      rotate: -3,
      depth: 4,
    },
    {
      id: "one",
      kind: "numeral",
      text: "1",
      stockName: "mustard",
      at: { x: 0.7, y: 0.64, w: 0.14, h: 0.2 },
      rotate: -5,
      depth: 3,
    },
  ],
  notes: ["three machines, one result"],
};

/** The same subject reduced to a single paper layer + headline. */
export const singleLayerData: CollageSceneData = {
  title: "Split the work.\nRun it in parallel.",
  subtitle: "One coordinator, several workers, one merged result.",
  field: { stockName: "blue", side: "bottom" },
  tornBand: { stockName: "mustard", at: 0.5, h: 130 },
};

export const ExampleScene: React.FC<CollageSceneProps> = (props) => (
  <CollageScene {...props} data={{ ...distributedCollageData, ...props.data }} />
);

export const SingleLayerExample: React.FC<CollageSceneProps> = (props) => (
  <CollageScene {...props} data={{ ...singleLayerData, ...props.data }} />
);