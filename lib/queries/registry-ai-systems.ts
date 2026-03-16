import { sfQueryResult } from "@/lib/snowflake";
import { SNOWFLAKE } from "@/lib/platform-contracts";

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
  s.SYSTEM_ID,
  s.REGISTRY_ID,
  s.APPLICATION_ID,
  s.CASE_ID,

  r.ENTITY_NAME,

  s.SYSTEM_NAME,
  s.SYSTEM_TYPE,
  s.INTENDED_USE,
  s.DEPLOYMENT_STATUS,
  s.OVERSIGHT_LEVEL,
  s.RISK_TIER,

  s.DEVELOPER_ORGANIZATION,
  s.TRAINING_DATA_CATEGORY,
  s.OVERSIGHT_MODEL,
  s.HUMAN_REVIEW_REQUIRED,
  s.EVALUATION_PROTOCOL,
  s.AUDIT_FREQUENCY,

  r.DECISION_STATUS,
  r.CERTIFIED_TIER,
  r.CERTIFIED_BAND,

  r.LAST_ACTIVITY_AT,
  s.PUBLIC_SUMMARY,
  s.DISPLAY_ORDER

FROM ${SNOWFLAKE.views.publicAiSystems} s
LEFT JOIN ${SNOWFLAKE.views.publicRegistry} r
  ON s.REGISTRY_ID = r.REGISTRY_ID

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
  s.SYSTEM_ID,
  s.REGISTRY_ID,
  s.APPLICATION_ID,
  s.CASE_ID,

  r.ENTITY_NAME,

  s.SYSTEM_NAME,
  s.SYSTEM_TYPE,
  s.INTENDED_USE,
  s.DEPLOYMENT_STATUS,
  s.OVERSIGHT_LEVEL,
  s.RISK_TIER,

  s.DEVELOPER_ORGANIZATION,
  s.TRAINING_DATA_CATEGORY,
  s.OVERSIGHT_MODEL,
  s.HUMAN_REVIEW_REQUIRED,
  s.EVALUATION_PROTOCOL,
  s.AUDIT_FREQUENCY,

  r.DECISION_STATUS,
  r.CERTIFIED_TIER,
  r.CERTIFIED_BAND,

  r.LAST_ACTIVITY_AT,
  s.PUBLIC_SUMMARY,
  s.DISPLAY_ORDER

FROM ${SNOWFLAKE.views.publicAiSystems} s
LEFT JOIN ${SNOWFLAKE.views.publicRegistry} r
  ON s.REGISTRY_ID = r.REGISTRY_ID

WHERE s.REGISTRY_ID = ?
LIMIT 1
`,
    [registryId]
  );
}