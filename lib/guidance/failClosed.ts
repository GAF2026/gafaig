import { normalizeGuidanceFailure } from "./errors";
import { buildGuidanceResult } from "./resultBuilders";
import type {
  GuidanceFailure,
  GuidanceResult,
  GuidanceResultMetadata,
  GuidanceRuleId,
  GuidanceSourceReference,
} from "./types";

export interface FailClosedGuidanceInput {
  readonly summary: string;
  readonly metadata: GuidanceResultMetadata;
  readonly ruleIds?: readonly GuidanceRuleId[];
  readonly facts?: readonly string[];
  readonly unresolvedConditions?: readonly string[];
  readonly sourceReferences?: readonly GuidanceSourceReference[];
  readonly failure?: GuidanceFailure;
}

function failClosed(
  status:
    | "UNRESOLVED"
    | "UNAVAILABLE"
    | "INCONSISTENT"
    | "UNAUTHORIZED"
    | "NOT_VISIBLE"
    | "STALE",
  input: FailClosedGuidanceInput,
): GuidanceResult {
  return buildGuidanceResult({
    status,
    summary: input.summary,
    metadata: input.metadata,
    ruleIds: input.ruleIds,
    facts: input.facts,
    unresolvedConditions: input.unresolvedConditions,
    sourceReferences: input.sourceReferences,
    failure: input.failure,
  });
}

export const unresolvedGuidance = (
  input: FailClosedGuidanceInput,
): GuidanceResult => failClosed("UNRESOLVED", input);

export const unavailableGuidance = (
  input: FailClosedGuidanceInput,
): GuidanceResult => failClosed("UNAVAILABLE", input);

export const inconsistentGuidance = (
  input: FailClosedGuidanceInput,
): GuidanceResult => failClosed("INCONSISTENT", input);

export const unauthorizedGuidance = (
  input: FailClosedGuidanceInput,
): GuidanceResult => failClosed("UNAUTHORIZED", input);

export const notVisibleGuidance = (
  input: FailClosedGuidanceInput,
): GuidanceResult => failClosed("NOT_VISIBLE", input);

export const staleGuidance = (
  input: FailClosedGuidanceInput,
): GuidanceResult => failClosed("STALE", input);

export function errorGuidance(input: {
  readonly error: unknown;
  readonly summary?: string;
  readonly metadata: GuidanceResultMetadata;
  readonly ruleIds?: readonly GuidanceRuleId[];
  readonly facts?: readonly string[];
  readonly unresolvedConditions?: readonly string[];
  readonly sourceReferences?: readonly GuidanceSourceReference[];
}): GuidanceResult {
  return buildGuidanceResult({
    status: "ERROR",
    summary: input.summary ?? "Operational guidance could not be produced.",
    metadata: input.metadata,
    ruleIds: input.ruleIds,
    facts: input.facts,
    unresolvedConditions:
      input.unresolvedConditions ??
      ["A runtime failure prevented deterministic guidance resolution."],
    sourceReferences: input.sourceReferences,
    failure: normalizeGuidanceFailure(input.error),
  });
}
