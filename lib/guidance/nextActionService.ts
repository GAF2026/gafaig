import {
  executeGuidanceEngine,
  type GuidanceExecutionTrace,
} from "./executor";

import {
  operationalGuidanceRegistry,
} from "./guidanceServices";

import type {
  NextActionEngineInput,
  NextActionPayload,
} from "./nextActionTypes";

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

export interface NextActionServiceRequest {
  readonly context: GuidanceContext;

  /**
   * Controls whether the Repository Context dependency includes empty
   * repository categories.
   *
   * Next Action resolution requires empty-repository visibility for
   * deterministic missing-record rules, so the default remains true.
   */
  readonly includeEmptyRepositories?: boolean;
}

export interface NextActionServiceResponse {
  readonly repositoryContext:
    RepositoryContextServiceResponse;

  readonly result:
    GuidanceResult<NextActionPayload>;

  readonly trace:
    GuidanceExecutionTrace;
}

function repositoryContextUnavailableResult(
  request: NextActionServiceRequest,
  repositoryContext:
    RepositoryContextServiceResponse,
): Promise<{
  readonly result:
    GuidanceResult<NextActionPayload>;

  readonly trace:
    GuidanceExecutionTrace;
}> {
  const engine =
    operationalGuidanceRegistry.get(
      "next-action",
    );

  const input: NextActionEngineInput = {
    repositoryContext:
      undefined,

    sourceReferences:
      repositoryContext.result
        .sourceReferences,
  };

  return executeGuidanceEngine({
    engine,
    context:
      request.context,

    input,
  });
}

/**
 * Canonical application-service entry point for Next Action Guidance.
 *
 * Execution order:
 *
 * 1. Resolve authenticated, organization-scoped Repository Context.
 * 2. Verify that an authoritative Repository Context payload is available.
 * 3. Pass that payload and its source references to the registered
 *    Next Action Engine.
 * 4. Preserve both execution traces for deterministic auditability.
 *
 * This service does not:
 *
 * - query Snowflake directly;
 * - compute repository state;
 * - infer workflow state;
 * - create repository relationships;
 * - mutate workflow records;
 * - execute the returned action;
 * - create governance, certification, publication, or registry authority.
 */
export async function resolveNextAction(
  request: NextActionServiceRequest,
): Promise<NextActionServiceResponse> {
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
   * Fail closed through the Next Action Engine itself.
   *
   * Passing no dependency payload causes the registered engine to return
   * its canonical dependency-failure result and execution trace. This
   * avoids creating a second service-level failure contract.
   */
  if (!repositoryPayload) {
    const unavailable =
      await repositoryContextUnavailableResult(
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

  const input: NextActionEngineInput = {
    repositoryContext:
      repositoryPayload,

    sourceReferences:
      repositoryContext.result
        .sourceReferences,
  };

  const engine =
    operationalGuidanceRegistry.get(
      "next-action",
    );

  const nextAction =
    await executeGuidanceEngine({
      engine,
      context:
        request.context,

      input,
    });

  return {
    repositoryContext,

    result:
      nextAction.result,

    trace:
      nextAction.trace,
  };
}