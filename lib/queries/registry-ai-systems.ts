import { sfQueryResult } from "@/lib/snowflake";
import {
  SNOWFLAKE,
  SELECT_REGISTRY_AI_SYSTEM,
  JOIN_REGISTRY,
} from "./registry";

export type RegistryAiSystemRow = {
  SYSTEM_ID: string;
  REGISTRY_ID: string;
  APPLICATION_ID: string | null;
  CASE_ID: string | null;

  ENTITY_NAME: string | null;

  SYSTEM_NAME: string;
  SYSTEM_TYPE: string | null;
  INTENDED_USE: string | null;
  DEPLOYMENT_STATUS: string | null;
  OVERSIGHT_LEVEL: string | null;
  RISK_TIER: string | null;

  DEVELOPER_ORGANIZATION: string | null;
  TRAINING_DATA_CATEGORY: string | null;
  OVERSIGHT_MODEL: string | null;
  HUMAN_REVIEW_REQUIRED: string | null;
  EVALUATION_PROTOCOL: string | null;
  AUDIT_FREQUENCY: string | null;

  DECISION_STATUS: string | null;
  CERTIFIED_TIER: string | null;
  CERTIFIED_BAND: string | null;

  GOVERNANCE_MATURITY_SCORE: number | null;
  CONTROLS_PCT: number | null;
  COVERAGE_PCT: number | null;
  FRESHNESS_PCT: number | null;
  SUMMARY_PCT: number | null;

  LAST_ACTIVITY_AT: string | null;
  PUBLIC_SUMMARY: string | null;
  DISPLAY_ORDER: number | null;
};

/**
 * Canonical query: list all AI systems in the public registry.
 */
export async function getRegistryAiSystems() {
  return sfQueryResult<RegistryAiSystemRow>(
    `
    SELECT
      ${SELECT_REGISTRY_AI_SYSTEM}
    FROM ${SNOWFLAKE.views.publicAiSystems} s
    ${JOIN_REGISTRY}
    ORDER BY
      s.REGISTRY_ID ASC,
      s.DISPLAY_ORDER ASC NULLS LAST,
      s.SYSTEM_NAME ASC
    `
  );
}

/**
 * Canonical query: single AI system certificate.
 */
export async function getRegistryAiSystemByRegistryId(registryId: string) {
  return sfQueryResult<RegistryAiSystemRow>(
    `
    SELECT
      ${SELECT_REGISTRY_AI_SYSTEM}
    FROM ${SNOWFLAKE.views.publicAiSystems} s
    ${JOIN_REGISTRY}
    WHERE s.REGISTRY_ID = ?
    LIMIT 1
    `,
    [registryId]
  );
}