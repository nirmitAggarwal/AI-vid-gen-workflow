// Example scenes — Comic Book.
// The same subject ("how a distributed system assigns work to multiple
// computers") staged as a splash page, a three-panel strip and a shout burst.

import React from "react";
import { ComicScene, type ComicSceneData, type ComicSceneProps } from "./scene";

/** Splash — one big panel, title lettering, action word, caption box. */
export const splashPageData: ComicSceneData = {
  layout: "splash",
  title: "The Dispatcher",
  caption: "Meanwhile, inside the queue…",
  action: { word: "SPLIT!", at: { y: 0.3 }, color: "#FF2E2E", rotate: -7, delay: 14 },
  field: "#00A3E0",
  balloons: [{ id: "b1", text: "One job. Three machines.", at: { x: 0.46, y: 0.6, w: 0.44 }, tail: "left" }],
};

/** Strip — three panels with balloons, caption on top. */
export const stripPageData: ComicSceneData = {
  layout: "strip",
  caption: "Task one: fan out.",
  action: { word: "WHAM!", at: { y: 0.66 }, color: "#FFD400", rotate: 5, delay: 20 },
  balloons: [
    { id: "b1", text: "You take a third!", at: { x: 0.07, y: 0.12, w: 0.36 }, tail: "bottom" },
    { id: "b2", text: "And you take a third!", at: { x: 0.54, y: 0.12, w: 0.36 }, tail: "bottom", kind: "shout" },
    { id: "b3", text: "Merge. Done. Nobody saw the whole thing.", at: { x: 0.14, y: 0.54, w: 0.5 }, tail: "right" },
  ],
};

/** Burst — jagged shout star owning the frame. */
export const burstPageData: ComicSceneData = {
  layout: "burst",
  shout: "THREE?!",
  caption: "The coordinator never blinks.",
  action: { word: "POW!", at: { y: 0.76 }, color: "#FF2E2E", rotate: -8, delay: 16 },
  speedLines: true,
};

/** Default export — the splash page (the style's home layout). */
export const ExampleScene: React.FC<ComicSceneProps> = (props) => (
  <ComicScene {...props} data={{ ...splashPageData, ...props.data }} />
);

export const StripExample: React.FC<ComicSceneProps> = (props) => (
  <ComicScene {...props} data={{ ...stripPageData, ...props.data }} />
);

export const BurstExample: React.FC<ComicSceneProps> = (props) => (
  <ComicScene {...props} data={{ ...burstPageData, ...props.data }} />
);
