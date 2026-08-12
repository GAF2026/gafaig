import { cleanApplicantValue } from "@/lib/applicant/helpers";
import type { GuidanceExplanation, GuidanceRuleId } from "./types";

function cleanUnique(values: readonly unknown[] | undefined): string[] {
  const unique = new Set<string>();
  for (const value of values ?? []) {
    const cleaned = cleanApplicantValue(value);
    if (cleaned) unique.add(cleaned);
  }
  return Array.from(unique);
}

export interface GuidanceExplanationInput {
  readonly summary: string;
  readonly ruleIds?: readonly GuidanceRuleId[];
  readonly facts?: readonly string[];
  readonly unresolvedConditions?: readonly string[];
}

export function buildGuidanceExplanation(
  input: GuidanceExplanationInput,
): GuidanceExplanation {
  const summary = cleanApplicantValue(input.summary);
  if (!summary) {
    throw new TypeError("Guidance explanation summary is required.");
  }

  return {
    summary,
    ruleIds: cleanUnique(input.ruleIds),
    facts: cleanUnique(input.facts),
    unresolvedConditions: cleanUnique(input.unresolvedConditions),
  };
}

export function createGuidanceRuleId(
  ...segments: readonly unknown[]
): GuidanceRuleId {
  const normalized = segments
    .map((segment) =>
      cleanApplicantValue(segment)
        .toUpperCase()
        .replace(/[^A-Z0-9]+/g, "-")
        .replace(/^-+|-+$/g, ""),
    )
    .filter(Boolean);

  if (normalized.length === 0) {
    throw new TypeError(
      "At least one guidance rule identifier segment is required.",
    );
  }

  return normalized.join("-");
}

export function guidanceFact(value: unknown): string {
  const cleaned = cleanApplicantValue(value);
  if (!cleaned) throw new TypeError("Guidance fact cannot be empty.");
  return cleaned;
}

export function unresolvedCondition(value: unknown): string {
  const cleaned = cleanApplicantValue(value);
  if (!cleaned) {
    throw new TypeError("Unresolved guidance condition cannot be empty.");
  }
  return cleaned;
}
