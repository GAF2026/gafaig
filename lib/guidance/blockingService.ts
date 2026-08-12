import {
  executeGuidanceEngine,
  type GuidanceExecutionTrace,
} from "./executor";

import {
  operationalGuidanceRegistry,
} from "./guidanceServices";

import type {
  BlockingCondition,
  BlockingEngineInput,
  BlockingPayload,
} from "./blockingTypes";

import type {
  RepositoryContextPayload,
} from "./repositoryContextEngine";

import {
  resolveRepositoryContext,
  type RepositoryContextServiceResponse,
} from "./repositoryContextService";

import type {
  GuidanceContext,
  GuidanceResult,
} from "./types";

export interface BlockingServiceRequest {
  readonly context:
    GuidanceContext;

  /**
   * Empty-repository visibility is required for deterministic missing-record
   * blocker rules.
   *
   * The default remains true.
   */
  readonly includeEmptyRepositories?:
    boolean;

  /**
   * Optional authoritative blocking conditions supplied by a previously
   * validated source.
   *
   * The Blocking Service does not create, expand, reinterpret, or clear
   * these conditions.
   */
  readonly authoritativeConditions?:
    readonly BlockingCondition[];
}

export interface BlockingServiceResponse {
  readonly repositoryContext:
    RepositoryContextServiceResponse;

  readonly result:
    GuidanceResult<BlockingPayload>;

  readonly trace:
    GuidanceExecutionTrace;
}

async function executeBlockingWithoutRepositoryPayload(
  request:
    BlockingServiceRequest,

  repositoryContext:
    RepositoryContextServiceResponse,
): Promise<{
  readonly result:
    GuidanceResult<BlockingPayload>;

  readonly trace:
    GuidanceExecutionTrace;
}> {
  const engine =
    operationalGuidanceRegistry.get(
      "blocking",
    );

  const input:
    BlockingEngineInput = {
      repositoryContext:
        undefined,

      sourceReferences:
        repositoryContext.result
          .sourceReferences,

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
 * Canonical application-service entry point for Blocking Guidance.
 *
 * Execution order:
 *
 * 1. Resolve authenticated, organization-scoped Repository Context.
 * 2. Verify that an authoritative Repository Context payload is available.
 * 3. Pass the payload, source references, and any explicitly supplied
 *    authoritative blocking conditions to the registered Blocking Engine.
 * 4. Preserve both execution traces for deterministic auditability.
 *
 * This service does not:
 *
 * - query Snowflake directly;
 * - compute repository state;
 * - infer workflow state;
 * - infer protected governance reasoning;
 * - create or clear blocking conditions;
 * - create repository relationships;
 * - mutate workflow or repository records;
 * - create constitutional, governance, certification, publication,
 *   registry, or verification authority.
 */
export async function resolveBlocking(
  request:
    BlockingServiceRequest,
): Promise<BlockingServiceResponse> {
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
   * Fail closed through the registered Blocking Engine.
   *
   * Passing no Repository Context payload causes the engine to return its
   * canonical dependency-failure result and execution trace. This avoids
   * creating a second service-level failure contract.
   */
  if (!repositoryPayload) {
    const unavailable =
      await executeBlockingWithoutRepositoryPayload(
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
    BlockingEngineInput = {
      repositoryContext:
        repositoryPayload,

      sourceReferences:
        repositoryContext.result
          .sourceReferences,

      authoritativeConditions:
        request.authoritativeConditions,
    };

  const engine =
    operationalGuidanceRegistry.get(
      "blocking",
    );

  const blocking =
    await executeGuidanceEngine({
      engine,

      context:
        request.context,

      input,
    });

  return {
    repositoryContext,

    result:
      blocking.result,

    trace:
      blocking.trace,
  };
}