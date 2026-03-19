-- ============================================================
-- 99_ENVIRONMENT_DIAGNOSTICS.sql
--
-- Purpose:
--   Broad environment diagnostics for GAFAIG Snowflake setup.
--
-- Use cases:
--   - Confirm core database objects exist
--   - Confirm application role / user exist
--   - Inspect grants to GAFAIG_APP_ROLE
--   - Verify application role can assume expected context
--
-- Safe to rerun.
-- ============================================================

USE ROLE ACCOUNTADMIN;

-- ------------------------------------------------------------
-- 1) Core platform objects
-- ------------------------------------------------------------
SHOW DATABASES LIKE 'GAFAIG_DB';
SHOW SCHEMAS IN DATABASE GAFAIG_DB;
SHOW WAREHOUSES LIKE 'GAFAIG_WH';

-- ------------------------------------------------------------
-- 2) Security principals
-- ------------------------------------------------------------
SHOW ROLES LIKE 'GAFAIG_APP_ROLE';
SHOW USERS LIKE 'GAFAIG_APP_USER';

-- ------------------------------------------------------------
-- 3) Grants
-- ------------------------------------------------------------
SHOW GRANTS TO ROLE GAFAIG_APP_ROLE;

-- ------------------------------------------------------------
-- 4) Verify app role context
-- ------------------------------------------------------------
USE ROLE GAFAIG_APP_ROLE;
USE DATABASE GAFAIG_DB;
USE SCHEMA CORE;

SELECT
  CURRENT_ROLE()     AS ROLE_NAME,
  CURRENT_DATABASE() AS DATABASE_NAME,
  CURRENT_SCHEMA()   AS SCHEMA_NAME;

-- ------------------------------------------------------------
-- 5) Verify core read access (critical runtime check)
-- ------------------------------------------------------------
SELECT COUNT(*) AS submissions_count
FROM GAFAIG_DB.CORE.SUBMISSIONS;

SELECT COUNT(*) AS participants_count
FROM GAFAIG_DB.CORE.PARTICIPANTS;

SELECT COUNT(*) AS registry_ai_systems_count
FROM GAFAIG_DB.CORE.REGISTRY_AI_SYSTEMS;