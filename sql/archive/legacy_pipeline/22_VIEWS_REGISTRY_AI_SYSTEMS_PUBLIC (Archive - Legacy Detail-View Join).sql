-- ============================================================
-- 22_VIEWS_REGISTRY_AI_SYSTEMS_PUBLIC.sql
--
-- Purpose:
--   Public AI systems view for registry + explorer pages.
--
-- Notes:
--   - Surfaces only public AI systems tied to approved cases
--   - Enriches systems with certification + governance scoring data
--   - Safe to rerun
-- ============================================================

USE ROLE ACCOUNTADMIN;
USE WAREHOUSE GAFAIG_WH;
USE DATABASE GAFAIG_DB;
USE SCHEMA CORE;

CREATE OR REPLACE VIEW GAFAIG_DB.CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC COPY GRANTS AS
SELECT
  s.SYSTEM_ID,
  s.REGISTRY_ID,
  s.APPLICATION_ID,
  s.CASE_ID,

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

  v.DECISION_STATUS,
  v.CERTIFICATION_TIER AS CERTIFIED_TIER,
  v.CERTIFICATION_BAND AS CERTIFIED_BAND,

  -- Governance maturity + subscore surfaces
  COALESCE(
    v.FINAL_SCORE,
    CASE
      WHEN v.CERTIFICATION_BAND = 'A' THEN 95
      WHEN v.CERTIFICATION_BAND = 'B' THEN 85
      WHEN v.CERTIFICATION_BAND = 'C' THEN 75
      ELSE 70
    END
  ) AS GOVERNANCE_MATURITY_SCORE,

  v.CONTROLS_PCT,
  v.COVERAGE_PCT,
  v.FRESHNESS_PCT,
  v.SUMMARY_PCT,
  v.LAST_ACTIVITY_AT,

  s.PUBLIC_SUMMARY,
  s.IS_PUBLIC,
  s.DISPLAY_ORDER,
  s.CREATED_AT,
  s.UPDATED_AT,

  CURRENT_TIMESTAMP() AS LAST_UPDATED

FROM GAFAIG_DB.CORE.REGISTRY_AI_SYSTEMS s
JOIN GAFAIG_DB.CORE.V_VERIFICATION_CASE_DETAIL v
  ON v.APPLICATION_ID = s.APPLICATION_ID
WHERE LOWER(COALESCE(v.DECISION_STATUS, '')) = 'approved'
  AND COALESCE(s.IS_PUBLIC, TRUE) = TRUE;

-- ------------------------------------------------------------
-- Diagnostics
-- ------------------------------------------------------------
SELECT *
FROM GAFAIG_DB.CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC
LIMIT 10;