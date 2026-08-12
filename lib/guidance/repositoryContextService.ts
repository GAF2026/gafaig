import {
  executeGuidanceEngine,
  type GuidanceExecutionTrace,
} from "./executor";

import type {
  RepositoryContextEngineInput,
  RepositoryContextPayload,
} from "./repositoryContextEngine";

import {
  operationalGuidanceRegistry,
} from "./guidanceServices";

import type {
  GuidanceContext,
  GuidanceResult,
} from "./types";

export interface RepositoryContextServiceRequest {
  readonly context: GuidanceContext;
  readonly includeEmptyRepositories?: boolean;
}

export interface RepositoryContextServiceResponse {
  readonly result:
    GuidanceResult<RepositoryContextPayload>;
  readonly trace:
    GuidanceExecutionTrace;
}

/**
 * Canonical application-service entry point for Repository Context Guidance.
 *
 * This service delegates all operational resolution to the registered
 * Repository Context Engine. It does not query Snowflake directly, compute
 * workflow state, infer relationships, or mutate authoritative records.
 */
export async function resolveRepositoryContext(
  request: RepositoryContextServiceRequest,
): Promise<RepositoryContextServiceResponse> {
  const input: RepositoryContextEngineInput = {
    includeEmptyRepositories:
      request.includeEmptyRepositories ?? true,
  };

  const engine =
  operationalGuidanceRegistry.get(
    "repository-context",
  );

return executeGuidanceEngine({
  engine,
  context: request.context,
  input,
});
}
