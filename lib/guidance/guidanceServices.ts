import {
  createGuidanceEngineRegistry,
  type GuidanceEngineRegistry,
} from "./registry";

import {
  repositoryContextEngine,
} from "./repositoryContextEngine";

import {
  nextActionEngine,
} from "./nextActionEngine";

import {
  blockingEngine,
} from "./blockingEngine";

import {
  waitingOnEngine,
} from "./waitingOnEngine";

import {
  compositeGuidanceEngine,
} from "./compositeGuidanceEngine";

import {
  operationalSummaryEngine,
} from "./operationalSummaryEngine";

/**
 * Creates the canonical registry for currently implemented Guidance engines.
 *
 * Registration is explicit and deterministic. Future engines must be added
 * intentionally through an authorized implementation pass.
 */
export function createOperationalGuidanceRegistry():
  GuidanceEngineRegistry {
  return createGuidanceEngineRegistry([
    repositoryContextEngine,
    nextActionEngine,
    blockingEngine,
    waitingOnEngine,
    compositeGuidanceEngine,
    operationalSummaryEngine,
  ]);
}

export const operationalGuidanceRegistry =
  createOperationalGuidanceRegistry();