import {
  executeGuidanceEngine,
} from "./executor";

import {
  operationalGuidanceRegistry,
} from "./guidanceServices";

import type {
  CompositeGuidanceExecution,
} from "./compositeGuidanceTypes";

import type {
  OperationalSummaryEngineInput,
  OperationalSummaryExecution,
  OperationalSummaryPayload,
} from "./operationalSummaryTypes";

import type {
  GuidanceContext,
  GuidanceResult,
} from "./types";

export interface OperationalSummaryServiceRequest {
  readonly context:
    GuidanceContext;

  /**
   * Already-resolved Composite Guidance execution.
   *
   * This service deliberately does not call resolveCompositeGuidance().
   * The caller must supply the certified dependency result.
   */
  readonly composite:
    CompositeGuidanceExecution;
}

/**
 * Canonical Operational Summary service.
 *
 * It delegates aggregation to the registered Operational Summary Engine
 * and does not recursively rerun Composite Guidance or any component engine.
 */
export async function resolveOperationalSummary(
  request:
    OperationalSummaryServiceRequest,
): Promise<
  OperationalSummaryExecution
> {
  const engine =
    operationalGuidanceRegistry.get(
      "operational-summary",
    );

  const input:
    OperationalSummaryEngineInput = {
    composite:
      request.composite.result,

    components:
      request.composite
        .components,

    sourceReferences:
      request.composite.result
        .sourceReferences,
  };

  const execution =
    await executeGuidanceEngine({
      engine,
      context:
        request.context,
      input,
    });

  return {
    result:
      execution.result as
        GuidanceResult<
          OperationalSummaryPayload
        >,

    trace:
      execution.trace,
  };
}