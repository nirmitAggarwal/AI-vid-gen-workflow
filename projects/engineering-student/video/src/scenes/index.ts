// Scene registry — maps audio line ids to the component that visualizes them.

import type React from "react";
import type { TimelineLine } from "../data/timeline";
import { DefaultScene } from "./DefaultScene";
import { L1Scene, L2Scene } from "./hook";
import { L3Scene, L4Scene } from "./hook2";
import { L5Scene, L6Scene } from "./hook3";
import { L7Scene, L8Scene, L9Scene } from "./info";
import { L10Scene, L11Scene, L12Scene } from "./info2";
import { L13Scene, L14Scene, L15Scene, L16Scene, L17Scene } from "./jobs";
import { L18Scene, L19Scene, L20Scene, L21Scene, L22Scene } from "./jobs2";
import {
  L23Scene,
  L24Scene,
  L25Scene,
  L26Scene,
  L27Scene,
  L28Scene,
  L29Scene,
  L30Scene,
} from "./turn";

export type SceneProps = {
  line: TimelineLine;
};

export const SCENES: Record<string, React.FC<SceneProps>> = {
  L1: L1Scene,
  L2: L2Scene,
  L3: L3Scene,
  L4: L4Scene,
  L5: L5Scene,
  L6: L6Scene,
  L7: L7Scene,
  L8: L8Scene,
  L9: L9Scene,
  L10: L10Scene,
  L11: L11Scene,
  L12: L12Scene,
  L13: L13Scene,
  L14: L14Scene,
  L15: L15Scene,
  L16: L16Scene,
  L17: L17Scene,
  L18: L18Scene,
  L19: L19Scene,
  L20: L20Scene,
  L21: L21Scene,
  L22: L22Scene,
  L23: L23Scene,
  L24: L24Scene,
  L25: L25Scene,
  L26: L26Scene,
  L27: L27Scene,
  L28: L28Scene,
  L29: L29Scene,
  L30: L30Scene,
};

export const getScene = (lineId: string): React.FC<SceneProps> =>
  SCENES[lineId] ?? DefaultScene;
