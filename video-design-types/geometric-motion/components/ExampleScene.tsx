// Example scenes — Geometric Motion.
// The same subject ("how a distributed system assigns work to multiple
// computers") staged in all four compositions. Structure is data; the
// composition does the art direction.

import React from "react";
import { GeometricScene, type GeometricSceneData, type GeometricSceneProps } from "./scene";

/** Orbit — ringed core, counting numeral, type bottom-left. */
export const orbitData: GeometricSceneData = {
  composition: "orbit",
  kicker: "01 · Distribution",
  headline: "One job.\nMany machines.",
  numeral: { value: 3, suffix: "×", label: "workers" },
  caption: "Tasks fan out to whichever machine has spare capacity.",
};

/** Stack — three growing bars: split, run, merge. */
export const stackData: GeometricSceneData = {
  composition: "stack",
  kicker: "02 · Pipeline",
  headline: "Split.\nRun. Merge.",
  numeral: { value: 60, suffix: "%", label: "less idle time" },
  caption: "Every bar is a phase; every phase hands off on completion.",
  shapes: [
    { id: "s1", kind: "bar", color: "#111111", label: "Split" },
    { id: "s2", kind: "bar", color: "#E63329", label: "Run" },
    { id: "s3", kind: "bar", color: "#0B4FD9", label: "Merge" },
  ],
};

/** Grid — dot field with a highlighted cell and positioned shapes. */
export const gridData: GeometricSceneData = {
  composition: "grid",
  kicker: "03 · Capacity",
  headline: "One cell works\nwhile others wait",
  numeral: { value: 42, label: "tasks" },
  caption: "The highlighted cell is the worker picked for the next task.",
  shapes: [
    { id: "g1", kind: "triangle", color: "#FFC90E", x: 120, y: 320, size: 140 },
    { id: "g2", kind: "ring", color: "#0B4FD9", x: 780, y: 300, size: 190 },
  ],
};

/** Split — colour fields from both sides, seam label, numeral on the seam. */
export const splitData: GeometricSceneData = {
  composition: "split",
  kicker: "Coordinator / Workers",
  headline: "Nobody holds\nthe whole job.",
  numeral: { value: 3, label: "machines" },
  caption: "Left: the coordinator. Right: everyone else.",
  fields: { left: "#0B4FD9", right: "#F5F3EE" },
};

/** Default export — the orbit composition (the style's home layout). */
export const ExampleScene: React.FC<GeometricSceneProps> = (props) => (
  <GeometricScene {...props} data={{ ...orbitData, ...props.data }} />
);

export const StackExample: React.FC<GeometricSceneProps> = (props) => (
  <GeometricScene {...props} data={{ ...stackData, ...props.data }} />
);

export const GridExample: React.FC<GeometricSceneProps> = (props) => (
  <GeometricScene {...props} data={{ ...gridData, ...props.data }} />
);

export const SplitExample: React.FC<GeometricSceneProps> = (props) => (
  <GeometricScene {...props} data={{ ...splitData, ...props.data }} />
);
