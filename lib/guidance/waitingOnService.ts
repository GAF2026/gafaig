import {
  executeGuidanceEngine,
  type GuidanceExecutionTrace,
} from "./executor";

import {
  operationalGuidanceRegistry,
} from "./guidanceServices";

import type {
  BlockingCondition,
} from "./blockingTypes";

import type {
  RepositoryContextPayload,
} from "./repositoryContextEngine";

import {
  resolveRepositoryContext,
  type RepositoryContextServiceResponse,
} from "./repositoryContextService";

import type {
  WaitingOnCondition,
  WaitingOnEngineInput,
  WaitingOnPayload,
} from "./waitingOnTypes";

import type {
  GuidanceContext,
  GuidanceResult,
} from "./types";

export interface WaitingOnServiceRequest {
  readonly context:
    GuidanceContext;

  /**
   * Waiting-On rules require visibility into empty repository categories.
   *
   * The default remains true.
   */
  readonly includeEmptyRepositories?:
    boolean;

  /**
   * Optional Blocking conditions produced by a previously validated
   * Blocking Engine execution.
   *
   * This service does not create, reinterpret, expand, or clear them.
   * Passing them avoids recursively executing the Blocking Service and
   * avoids duplicating Repository Context loading.
   */
  readonly certifiedBlockingConditions?:
    readonly BlockingCondition[];

  /**
   * Optional authoritative Waiting-On conditions supplied by a previously
   * validated operational source.
   *
   * The service preserves them exactly as supplied.
   */
  readonly authoritativeConditions?:
    readonly WaitingOnCondition[];
}

export interface WaitingOnServiceResponse {
  readonly repositoryContext:
    RepositoryContextServiceResponse;

  readonly result:
    GuidanceResult<WaitingOnPayload>;

  readonly trace:
    GuidanceExecutionTrace;
}

function blockingConditionsForEngine(
  conditions:
    readonly BlockingCondition[] | undefined,
): WaitingOnEngineInput["blockingConditions"] {
  if (!conditions) {
    return undefined;
  }

  return conditions.map(
    (condition) => ({
      conditionId:
        condition.conditionId,

      responsibleParticipant:
        condition.responsibleParticipant,

      relatedRepository:
        condition.relatedRepository,
    }),
  );
}

async function executeWaitingOnWithoutRepositoryPayload(
  request:
    WaitingOnServiceRequest,

  repositoryContext:
    RepositoryContextServiceResponse,
): Promise<{
  readonly result:
    GuidanceResult<WaitingOnPayload>;

  readonly trace:
    GuidanceExecutionTrace;
}> {
  const engine =
    operationalGuidanceRegistry.get(
      "waiting-on",
    );

  const input:
    WaitingOnEngineInput = {
      repositoryContext:
        undefined,

      sourceReferences:
        repositoryContext.result
          .sourceReferences,

      blockingConditions:
        blockingConditionsForEngine(
          request.certifiedBlockingConditions,
        ),

      authoritativeConditions:
        request.authoritativeConditions,
    };

  return executeGuidanceEngine({
    engine,

    context:
      request.context,

    input,
  });
}

/**
 * Canonical application-service entry point for Waiting-On Guidance.
 *
 * Execution order:
 *
 * 1. Resolve authenticated, organization-scoped Repository Context.
 * 2. Verify that an authoritative Repository Context payload is available.
 * 3. Pass that payload, its source references, and any previously certified
 *    Blocking or Waiting-On conditions to the registered Waiting-On Engine.
 * 4. Preserve the Repository Context and Waiting-On execution traces.
 *
 * This service deliberately does not call the Blocking Service itself.
 * Certified Blocking conditions may be supplied by a higher-level
 * orchestrator without recursively reloading Repository Context.
 *
 * This service does not:
 *
 * - query Snowflake directly;
 * - recompute Repository Context;
 * - create or reinterpret Blocking conditions;
 * - infer workflow ownership;
 * - assign or reassign participants;
 * - create or clear waiting conditions;
 * - infer repository relationships;
 * - mutate workflow or repository records;
 * - create constitutional, governance, certification, publication,
 *   registry, or verification authority.
 */
export async function resolveWaitingOn(
  request:
    WaitingOnServiceRequest,
): Promise<WaitingOnServiceResponse> {
  const repositoryContext =
    await resolveRepositoryContext({
      context:
        request.context,

      includeEmptyRepositories:
        request.includeEmptyRepositories ??
        true,
    });

  const repositoryPayload:
    RepositoryContextPayload | undefined =
      repositoryContext.result.payload;

  /*
   * Fail closed through the registered Waiting-On Engine.
   *
   * Passing no Repository Context payload causes the engine to return its
   * canonical dependency-failure result and execution trace. This preserves
   * one engine-level failure contract.
   */
  if (!repositoryPayload) {
    const unavailable =
      await executeWaitingOnWithoutRepositoryPayload(
        request,
        repositoryContext,
      );

    return {
      repositoryContext,

      result:
        unavailable.result,

      trace:
        unavailable.trace,
    };
  }

  const input:
    WaitingOnEngineInput = {
      repositoryContext:
        repositoryPayload,

      sourceReferences:
        repositoryContext.result
          .sourceReferences,

      blockingConditions:
        blockingConditionsForEngine(
          request.certifiedBlockingConditions,
        ),

      authoritativeConditions:
        request.authoritativeConditions,
    };

  const engine =
    operationalGuidanceRegistry.get(
      "waiting-on",
    );

  const waitingOn =
    await executeGuidanceEngine({
      engine,

      context:
        request.context,

      input,
    });

  return {
    repositoryContext,

    result:
      waitingOn.result,

    trace:
      waitingOn.trace,
  };
}