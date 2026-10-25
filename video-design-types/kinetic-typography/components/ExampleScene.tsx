// Example scenes — Kinetic Typography.
// The same subject ("how a distributed system assigns work to multiple
// computers") performed in all three modes: minimal, editorial, energetic.
// Swapping `mode` + line data is all it takes to restage any subject.

import React from "react";
import { KineticScene, type KineticSceneData, type KineticSceneProps } from "./scene";

/** Minimal — quiet tracked-in stack, huge negative space, one accent word. */
export const kineticMinimalData: KineticSceneData = {
  mode: "minimal",
  kicker: "Distributed systems",
  ghost: "WORK",
  lines: [{ text: "One job in." }, { text: "Machines out.", keywords: [1] }],
  caption: "The coordinator splits the work; nobody holds the whole job.",
};

/** Editorial — left-aligned slam stack, outlined ghost word, block keyword. */
export const kineticEditorialData: KineticSceneData = {
  mode: "editorial",
  kicker: "Distributed systems",
  outline: "PARALLEL",
  lines: [
    { text: "One job in.", keywords: [0] },
    { text: "Machines out.", keywords: [1], block: true },
    { text: "Nobody holds it all.", keywords: [4] },
  ],
  caption: "Coordinator, queue, workers — one merged result.",
};

/** Energetic — char cascade, slamming blocks, ticker, impact flash. */
export const kineticEnergeticData: KineticSceneData = {
  mode: "energetic",
  kicker: "Distributed systems",
  ghost: "SPLIT",
  ticker: "Split · Queue · Run · Merge",
  flash: { at: 34, duration: 5, color: "#2457FF" },
  lines: [{ text: "Split it." }, { text: "Run it in parallel.", keywords: [0, 3], block: true }],
};

/** Default export — the energetic performance (hooks and punchlines). */
export const ExampleScene: React.FC<KineticSceneProps> = (props) => (
  <KineticScene {...props} data={{ ...kineticEnergeticData, ...props.data }} />
);

export const MinimalExample: React.FC<KineticSceneProps> = (props) => (
  <KineticScene {...props} data={{ ...kineticMinimalData, ...props.data }} />
);

export const EditorialExample: React.FC<KineticSceneProps> = (props) => (
  <KineticScene {...props} data={{ ...kineticEditorialData, ...props.data }} />
);
