import {
  executeGuidanceEngine,
  type GuidanceExecutionTrace,
} from "./executor";

import type {
  GuidanceEngine,
} from "./engine";

import type {
  GuidanceContext,
  GuidanceResult,
} from "./types";

const PIPELINE_FAILURE_STATUSES = new Set<
  GuidanceResult["status"]
>([
  "UNRESOLVED",
  "UNAVAILABLE",
  "UNAUTHORIZED",
  "NOT_VISIBLE",
  "INCONSISTENT",
  "STALE",
  "ERROR",
]);

export interface GuidancePipelineStep<
  TInput = Readonly<Record<string, unknown>>,
  TPayload = Readonly<Record<string, unknown>>,
> {
  readonly id: string;
  readonly engine:
    GuidanceEngine<TInput, TPayload> | null;
  readonly input: TInput;
}

export interface GuidancePipelineStepOutcome {
  readonly stepId: string;
  readonly result: GuidanceResult<unknown>;
  readonly trace: GuidanceExecutionTrace;
}

export interface GuidancePipelineOutcome {
  readonly ok: boolean;
  readonly steps:
    readonly GuidancePipelineStepOutcome[];
  readonly traces:
    readonly GuidanceExecutionTrace[];
}

export function isGuidancePipelineFailureStatus(
  status: GuidanceResult["status"],
): boolean {
  return PIPELINE_FAILURE_STATUSES.has(status);
}

export async function executeGuidancePipeline(
  input: {
    readonly context: GuidanceContext;
    readonly steps:
      readonly GuidancePipelineStep[];
    readonly stopOnFailure?: boolean;
  },
): Promise<GuidancePipelineOutcome> {
  const outcomes:
    GuidancePipelineStepOutcome[] = [];

  const stopOnFailure =
    input.stopOnFailure ?? true;

  for (const step of input.steps) {
    const execution =
      await executeGuidanceEngine({
        engine: step.engine,
        context: input.context,
        input: step.input,
      });

    outcomes.push({
      stepId: step.id,
      result:
        execution.result as GuidanceResult<unknown>,
      trace: execution.trace,
    });

    if (
      stopOnFailure &&
      isGuidancePipelineFailureStatus(
        execution.result.status,
      )
    ) {
      break;
    }
  }

  return {
    ok:
      outcomes.length === input.steps.length &&
      outcomes.every(
        (outcome) =>
          !isGuidancePipelineFailureStatus(
            outcome.result.status,
          ),
      ),
    steps: outcomes,
    traces: outcomes.map(
      (outcome) => outcome.trace,
    ),
  };
}
