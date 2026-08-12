import { buildGuidanceExplanation } from "./explainability";
import { uniqueSourceReferences } from "./sourceReferences";
import type { GuidanceStatus } from "./status";
import type {
  GuidanceFailure,
  GuidanceResult,
  GuidanceResultMetadata,
  GuidanceRuleId,
  GuidanceSourceReference,
} from "./types";

export interface GuidanceResultBuilderInput<
  TPayload = Readonly<Record<string, unknown>>,
> {
  readonly status: GuidanceStatus;
  readonly summary: string;
  readonly ruleIds?: readonly GuidanceRuleId[];
  readonly facts?: readonly string[];
  readonly unresolvedConditions?: readonly string[];
  readonly sourceReferences?: readonly GuidanceSourceReference[];
  readonly failure?: GuidanceFailure;
  readonly payload?: TPayload;
  readonly metadata: GuidanceResultMetadata;
}

export function buildGuidanceResult<
  TPayload = Readonly<Record<string, unknown>>,
>(input: GuidanceResultBuilderInput<TPayload>): GuidanceResult<TPayload> {
  return {
    status: input.status,
    ...(input.payload !== undefined ? { payload: input.payload } : {}),
    explanation: buildGuidanceExplanation({
      summary: input.summary,
      ruleIds: input.ruleIds,
      facts: input.facts,
      unresolvedConditions: input.unresolvedConditions,
    }),
    sourceReferences: uniqueSourceReferences(
      input.sourceReferences ?? [],
    ),
    ...(input.failure ? { failure: input.failure } : {}),
    metadata: input.metadata,
  };
}

export function createGuidanceMetadata(input: {
  readonly correlationId: string;
  readonly engineName: string;
  readonly engineVersion: string;
  readonly generatedAt?: string;
}): GuidanceResultMetadata {
  return {
    generatedAt: input.generatedAt ?? new Date().toISOString(),
    correlationId: input.correlationId,
    engineName: input.engineName,
    engineVersion: input.engineVersion,
  };
}
