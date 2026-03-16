/**
 * GAFAIG Snowflake Query Registry
 *
 * Centralized definitions for canonical Snowflake objects and shared SELECT/JOIN
 * fragments used by registry query helpers.
 */

export const SNOWFLAKE = {
  database: "GAFAIG_DB",
  schema: "CORE",

  views: {
    publicRegistry: "GAFAIG_DB.CORE.V_REGISTRY_PUBLIC",
    publicAiSystems: "GAFAIG_DB.CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC",
  },
} as const;

export const SELECT_REGISTRY_AI_SYSTEM = `
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

  NULL AS GOVERNANCE_MATURITY_SCORE,
  NULL AS CONTROLS_PCT,
  NULL AS COVERAGE_PCT,
  NULL AS FRESHNESS_PCT,
  NULL AS SUMMARY_PCT,

  r.LAST_ACTIVITY_AT,
  s.PUBLIC_SUMMARY,
  s.DISPLAY_ORDER
`;

export const JOIN_REGISTRY = `
  LEFT JOIN ${SNOWFLAKE.views.publicRegistry} r
    ON s.REGISTRY_ID = r.REGISTRY_ID
`;