// Example scenes — Technical Sketchnotes.
// Same subject ("how a distributed system assigns work to multiple computers")
// expressed two ways, to show the style adapting to different scene data.

import React from "react";
import { SketchnoteScene, type SketchnoteSceneData, type SketchnoteSceneProps } from "./scene";

/** A five-node architecture diagram with connectors and margin notes. */
export const distributedDiagramData: SketchnoteSceneData = {
  title: "Who does the work?",
  subtitle: "One job goes in, several machines share it.",
  section: 1,
  layout: "diagram",
  nodes: [
    { id: "client", label: "Client", sub: "sends a job", icon: "user", tone: "default" },
    { id: "coord", label: "Coordinator", sub: "splits the job", icon: "brain", tone: "info" },
    { id: "queue", label: "Queue", sub: "pending pieces", icon: "queue", tone: "decision" },
    { id: "worker", label: "Workers ×3", sub: "run in parallel", icon: "server", tone: "success" },
    { id: "store", label: "Result store", sub: "merged output", icon: "database", tone: "success" },
  ],
  edges: [
    { from: "client", to: "coord", label: "job" },
    { from: "coord", to: "queue", label: "split" },
    { from: "queue", to: "worker", label: "assign", kind: "dashed" },
    { from: "worker", to: "store", label: "results" },
  ],
  notes: ["retries are cheap", "one machine fails, the rest still finish"],
  focus: "worker",
};

/** The same subject as a numbered process flow instead of a diagram. */
export const distributedFlowData: SketchnoteSceneData = {
  title: "Assigning work across machines",
  subtitle: "Four steps, no single point of genius.",
  section: 2,
  layout: "flow",
  steps: [
    "A client submits one job to the coordinator.",
    "The coordinator splits it into independent pieces.",
    "Each piece is handed to a free worker.",
    "Workers report back and the results are merged.",
  ],
  notes: ["slow worker? another machine picks up the slack"],
};

/** Diagram example — drop into scenes/index.ts for any line id. */
export const ExampleScene: React.FC<SketchnoteSceneProps> = (props) => (
  <SketchnoteScene {...props} data={{ ...distributedDiagramData, ...props.data }} />
);

/** Flow example — same subject, different composition. */
export const FlowExampleScene: React.FC<SketchnoteSceneProps> = (props) => (
  <SketchnoteScene {...props} data={{ ...distributedFlowData, ...props.data }} />
);