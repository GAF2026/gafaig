-- ============================================================
-- GAFAIG — Public Registry Surface (true global registry)
-- Creates:
--   CORE.V_REGISTRY_PUBLIC
-- Purpose:
--   Public registry surface using stable REGISTRY_ID
--   Only shows APPROVED + currently valid certifications
-- ============================================================

USE ROLE ACCOUNTADMIN;
USE WAREHOUSE GAFAIG_WH;
USE DATABASE GAFAIG_DB;
USE SCHEMA CORE;

CREATE OR REPLACE VIEW CORE.V_REGISTRY_PUBLIC AS
SELECT
  re.registry_id                                  AS registry_id,
  v.application_id                                AS application_id,

  -- Entity (prefer registry identity; fallback to application surface)
  COALESCE(re.entity_name, v.org_name)            AS entity_name,
  re.entity_type                                  AS entity_type,
  re.country                                      AS country,

  -- Certification outcome
  v.certification_tier                            AS certified_tier,
  v.certification_band                            AS certified_band,
  v.valid_from                                    AS valid_from,
  v.valid_to                                      AS valid_to,
  v.decision_status                               AS decision_status,

  -- Useful public metadata
  v.certified_at                                  AS certified_at,
  v.last_activity_at                              AS last_activity_at

FROM CORE.REGISTRY_ENTITIES re
JOIN CORE.V_VERIFICATION_CASE_DETAIL v
  ON v.application_id = re.application_id

WHERE
  LOWER(v.decision_status) = 'approved'
  AND (v.valid_from IS NULL OR v.valid_from <= CURRENT_TIMESTAMP())
  AND (v.valid_to   IS NULL OR v.valid_to   >  CURRENT_TIMESTAMP())
;

-- Quick test (single “registry query”)
SELECT *
FROM CORE.V_REGISTRY_PUBLIC
ORDER BY certified_at DESC NULLS LAST, last_activity_at DESC NULLS LAST
LIMIT 50;

-- Grant for app role (safe to re-run)
GRANT SELECT ON VIEW CORE.V_REGISTRY_PUBLIC TO ROLE GAFAIG_APP_ROLE;