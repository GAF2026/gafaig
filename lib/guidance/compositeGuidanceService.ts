import {
  executeGuidanceEngine,
} from "./executor";

import {
  operationalGuidanceRegistry,
} from "./guidanceServices";

import {
  resolveRepositoryContext,
} from "./repositoryContextService";

import type {
  NextActionEngineInput,
  NextActionPayload,
} from "./nextActionTypes";

import type {
  BlockingEngineInput,
  BlockingPayload,
} from "./blockingTypes";

import type {
  WaitingOnEngineInput,
  WaitingOnPayload,
} from "./waitingOnTypes";

import type {
  CompositeGuidanceComponents,
  CompositeGuidanceEngineInput,
  CompositeGuidanceExecution,
  CompositeGuidancePayload,
} from "./compositeGuidanceTypes";

import type {
  GuidanceContext,
  GuidanceResult,
} from "./types";

export interface CompositeGuidanceServiceRequest {
  readonly context:
    GuidanceContext;

  readonly includeEmptyRepositories?:
    boolean;
}

/**
 * Canonical Composite Operational Guidance orchestration service.
 *
 * Repository Context is resolved exactly once. Its authoritative payload
 * is then passed to Next Action, Blocking, and Waiting-On without recursively
 * executing their individual services.
 *
 * Every component result and trace is preserved, including fail-closed
 * dependency results.
 */
export async function resolveCompositeGuidance(
  request:
    CompositeGuidanceServiceRequest,
): Promise<CompositeGuidanceExecution> {
  const repositoryContext =
    await resolveRepositoryContext({
      context:
        request.context,

      includeEmptyRepositories:
        request.includeEmptyRepositories ??
        true,
    });

  const repositoryPayload =
    repositoryContext.result.payload;

  const sourceReferences =
    repositoryContext.result
      .sourceReferences;

  const nextActionEngine =
    operationalGuidanceRegistry.get(
      "next-action",
    );

  const blockingEngine =
    operationalGuidanceRegistry.get(
      "blocking",
    );

  const waitingOnEngine =
    operationalGuidanceRegistry.get(
      "waiting-on",
    );

  const compositeEngine =
    operationalGuidanceRegistry.get(
      "composite-guidance",
    );

  const nextActionInput:
    NextActionEngineInput = {
      repositoryContext:
        repositoryPayload,

      sourceReferences,
    };

  const nextAction =
    await executeGuidanceEngine({
      engine:
        nextActionEngine,

      context:
        request.context,

      input:
        nextActionInput,
    });

  const blockingInput:
    BlockingEngineInput = {
      repositoryContext:
        repositoryPayload,

      sourceReferences,
    };

  const blocking =
    await executeGuidanceEngine({
      engine:
        blockingEngine,

      context:
        request.context,

      input:
        blockingInput,
    });

  const certifiedBlockingConditions =
    blocking.result.payload
      ?.blockingConditions ?? [];

  const waitingOnInput:
    WaitingOnEngineInput = {
      repositoryContext:
        repositoryPayload,

      sourceReferences,

      blockingConditions:
        certifiedBlockingConditions.map(
          (
            condition:
              BlockingPayload[
                "blockingConditions"
              ][number],
          ) => ({
            conditionId:
              condition.conditionId,

            responsibleParticipant:
              condition
                .responsibleParticipant,

            relatedRepository:
              condition.relatedRepository,
          }),
        ),
    };

  const waitingOn =
    await executeGuidanceEngine({
      engine:
        waitingOnEngine,

      context:
        request.context,

      input:
        waitingOnInput,
    });

  const components:
    CompositeGuidanceComponents = {
      repositoryContext:
        repositoryContext.result,

      nextAction:
        nextAction.result as
          GuidanceResult<NextActionPayload>,

      blocking:
        blocking.result as
          GuidanceResult<BlockingPayload>,

      waitingOn:
        waitingOn.result as
          GuidanceResult<WaitingOnPayload>,
    };

  const compositeInput:
    CompositeGuidanceEngineInput = {
      repositoryContext:
        components.repositoryContext,

      nextAction:
        components.nextAction,

      blocking:
        components.blocking,

      waitingOn:
        components.waitingOn,

      sourceReferences,
    };

  const composite =
    await executeGuidanceEngine({
      engine:
        compositeEngine,

      context:
        request.context,

      input:
        compositeInput,
    });

  return {
    components,

    result:
      composite.result as
        GuidanceResult<CompositeGuidancePayload>,

    traces: {
      repositoryContext:
        repositoryContext.trace,

      nextAction:
        nextAction.trace,

      blocking:
        blocking.trace,

      waitingOn:
        waitingOn.trace,

      composite:
        composite.trace,
    },
  };
}