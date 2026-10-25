// Example scenes — Line Art Illustration.
// The same subject ("how a distributed system assigns work to multiple
// computers") drawn as a hero, a flow of icons, and three washed steps.

import React from "react";
import { LineArtScene, type LineArtSceneData, type LineArtSceneProps } from "./scene";

/** Hero — one large drawn illustration + headline + pointed annotation. */
export const heroData: LineArtSceneData = {
  composition: "hero",
  headline: "One job,\nhanded off.",
  caption: "The coordinator draws the plan; machines do the drawing.",
  annotation: "only the spare ones get a task",
  underline: true,
  icons: [{ id: "hero", icon: "bulb", at: { x: 0.58, y: 0.1, s: 0.3 }, accent: true }],
};

/** Flow — document → gear → machines, joined by marching dotted trails. */
export const flowData: LineArtSceneData = {
  composition: "flow",
  headline: "Split. Run. Merge.",
  caption: "Every arrow is a handoff; every handoff is one line of the script.",
  annotation: "the trail keeps moving while it waits",
  underline: true,
  icons: [
    { id: "a", icon: "document", at: { x: 0.08, y: 0.3, s: 0.18 }, label: "Job" },
    { id: "b", icon: "gear", at: { x: 0.41, y: 0.3, s: 0.18 }, label: "Split", accent: true },
    { id: "c", icon: "machine", at: { x: 0.74, y: 0.3, s: 0.18 }, label: "Machines", check: true },
  ],
  trails: [{ from: 0, to: 1, bow: 30 }, { from: 1, to: 2, bow: -30 }],
};

/** Steps — three washed panels with icons and labels. */
export const stepsData: LineArtSceneData = {
  composition: "steps",
  headline: "Three quiet moves",
  caption: "Nothing waits for anything else to finish.",
  annotation: "drawn once, repeated forever",
  underline: true,
  icons: [
    { id: "s1", icon: "document", at: { x: 0.08, y: 0.48, s: 0.14 }, label: "Split" },
    { id: "s2", icon: "people", at: { x: 0.42, y: 0.48, s: 0.14 }, label: "Run", accent: true },
    { id: "s3", icon: "chart", at: { x: 0.76, y: 0.48, s: 0.14 }, label: "Merge", check: true },
  ],
};

/** Default export — the flow composition (the style's home layout). */
export const ExampleScene: React.FC<LineArtSceneProps> = (props) => (
  <LineArtScene {...props} data={{ ...flowData, ...props.data }} />
);

export const HeroExample: React.FC<LineArtSceneProps> = (props) => (
  <LineArtScene {...props} data={{ ...heroData, ...props.data }} />
);

export const StepsExample: React.FC<LineArtSceneProps> = (props) => (
  <LineArtScene {...props} data={{ ...stepsData, ...props.data }} />
);
