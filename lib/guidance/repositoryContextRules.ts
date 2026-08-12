import {
  createGuidanceRuleId,
} from "./explainability";

export const REPOSITORY_CONTEXT_RULES = {
  CASE_SCOPE_REQUIRED:
    createGuidanceRuleId(
      "OG",
      "REPOSITORY_CONTEXT",
      "CASE_SCOPE_REQUIRED",
    ),

  ORGANIZATION_SCOPE_PRESERVED:
    createGuidanceRuleId(
      "OG",
      "REPOSITORY_CONTEXT",
      "ORGANIZATION_SCOPE_PRESERVED",
    ),

  AUTHORITATIVE_RECORDS_ONLY:
    createGuidanceRuleId(
      "OG",
      "REPOSITORY_CONTEXT",
      "AUTHORITATIVE_RECORDS_ONLY",
    ),

  RELATIONSHIPS_NOT_INFERRED:
    createGuidanceRuleId(
      "OG",
      "REPOSITORY_CONTEXT",
      "RELATIONSHIPS_NOT_INFERRED",
    ),

  SOURCE_REFERENCES_REQUIRED:
    createGuidanceRuleId(
      "OG",
      "REPOSITORY_CONTEXT",
      "SOURCE_REFERENCES_REQUIRED",
    ),
} as const;
