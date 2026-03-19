-- ============================================================
-- 21_VIEWS_PUBLIC_REGISTRY.sql
--
-- Purpose:
--   Canonical public registry views
--   - Uses stable REGISTRY_ID from REGISTRY_ENTITIES
--   - Built on approved registry snapshots
--   - Provides public-facing registry surfaces
-- ============================================================

USE ROLE ACCOUNTADMIN;
USE WAREHOUSE GAFAIG_WH;
USE DATABASE GAFAIG_DB;
USE SCHEMA CORE;

-- ------------------------------------------------------------
-- 1) Canonical public registry view (stable IDs)
-- ------------------------------------------------------------
CREATE OR REPLACE VIEW GAFAIG_DB.CORE.V_REGISTRY_PUBLIC AS
SELECT
  re.REGISTRY_ID                                   AS REGISTRY_ID,
  v.APPLICATION_ID                                 AS APPLICATION_ID,
  v.CASE_ID                                        AS CASE_ID,

  -- Entity
  COALESCE(re.ENTITY_NAME, p.NAME)                AS ENTITY_NAME,
  re.ENTITY_TYPE                                   AS ENTITY_TYPE,
  re.COUNTRY                                       AS COUNTRY,

  -- Certification outcome
  v.TIER                                           AS CERTIFIED_TIER,
  v.BAND                                           AS CERTIFIED_BAND,
  v.FINAL_SCORE                                    AS CERTIFIED_SCORE,
  v.APPROVED_AT                                    AS CERTIFIED_AT,
  v.CASE_STATUS                                    AS DECISION_STATUS,

  -- Validity
  v.APPROVED_AT                                    AS VALID_FROM,
  NULL                                             AS VALID_TO,

  -- Metadata
  v.LAST_ACTIVITY_AT                               AS LAST_ACTIVITY_AT,
  v.SNAPSHOT_ID                                    AS SNAPSHOT_ID

FROM GAFAIG_DB.CORE.REGISTRY_ENTITIES re
JOIN GAFAIG_DB.CORE.V_REGISTRY_LATEST_APPROVED v
  ON v.APPLICATION_ID = re.APPLICATION_ID
LEFT JOIN GAFAIG_DB.CORE.VERIFICATION_CASES vc
  ON vc.CASE_ID = v.CASE_ID
LEFT JOIN GAFAIG_DB.CORE.PARTICIPANTS p
  ON p.PARTICIPANT_ID = vc.PARTICIPANT_ID

WHERE UPPER(v.CASE_STATUS) = 'APPROVED';

-- ------------------------------------------------------------
-- 2) Public-facing simplified view
-- ------------------------------------------------------------
CREATE OR REPLACE VIEW GAFAIG_DB.CORE.V_PUBLIC_REGISTRY AS
SELECT
  REGISTRY_ID                                     AS REGISTRY_RECORD_ID,
  ENTITY_NAME,
  ENTITY_TYPE,
  COUNTRY,

  CERTIFIED_TIER,
  CERTIFIED_BAND,
  CERTIFIED_SCORE,

  CERTIFIED_AT,
  DECISION_STATUS,

  VALID_FROM,
  VALID_TO,
  LAST_ACTIVITY_AT
FROM GAFAIG_DB.CORE.V_REGISTRY_PUBLIC;

-- ------------------------------------------------------------
-- 3) Export view (optional)
-- ------------------------------------------------------------
CREATE OR REPLACE VIEW GAFAIG_DB.CORE.V_REGISTRY_EXPORT_V1 AS
SELECT *
FROM GAFAIG_DB.CORE.V_REGISTRY_PUBLIC;

-- ------------------------------------------------------------
-- 4) Grants
-- ------------------------------------------------------------
GRANT SELECT ON VIEW GAFAIG_DB.CORE.V_REGISTRY_PUBLIC
TO ROLE GAFAIG_APP_ROLE;

GRANT SELECT ON VIEW GAFAIG_DB.CORE.V_PUBLIC_REGISTRY
TO ROLE GAFAIG_APP_ROLE;

GRANT SELECT ON VIEW GAFAIG_DB.CORE.V_REGISTRY_EXPORT_V1
TO ROLE GAFAIG_APP_ROLE;

-- ============================================================
-- END
-- ============================================================