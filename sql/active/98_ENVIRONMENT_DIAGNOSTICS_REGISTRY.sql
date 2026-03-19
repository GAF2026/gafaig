-- ============================================================
-- 98_ENVIRONMENT_DIAGNOSTICS_REGISTRY.sql
--
-- Purpose:
--   Quick diagnostics for registry-related objects in Snowflake.
--
-- Use cases:
--   - Confirm current session context
--   - Inspect canonical registry view structure
--   - List registry-related tables and views
--   - Preview registry rows
--
-- Safe to rerun.
-- ============================================================

USE ROLE ACCOUNTADMIN;
USE WAREHOUSE GAFAIG_WH;
USE DATABASE GAFAIG_DB;
USE SCHEMA CORE;

-- ------------------------------------------------------------
-- 1) Current session context
-- ------------------------------------------------------------
SELECT
  CURRENT_USER()      AS USER_NAME,
  CURRENT_ROLE()      AS ROLE_NAME,
  CURRENT_WAREHOUSE() AS WAREHOUSE_NAME,
  CURRENT_DATABASE()  AS DATABASE_NAME,
  CURRENT_SCHEMA()    AS SCHEMA_NAME;

-- ------------------------------------------------------------
-- 2) Inspect canonical registry views
-- ------------------------------------------------------------
DESC VIEW GAFAIG_DB.CORE.V_REGISTRY_LATEST_APPROVED;
DESC VIEW GAFAIG_DB.CORE.V_REGISTRY_PUBLIC_SEARCH;

-- ------------------------------------------------------------
-- 3) List registry-related tables
-- ------------------------------------------------------------
SHOW TABLES LIKE '%REGISTRY%' IN SCHEMA GAFAIG_DB.CORE;

-- ------------------------------------------------------------
-- 4) List registry-related views
-- ------------------------------------------------------------
SHOW VIEWS LIKE '%REGISTRY%' IN SCHEMA GAFAIG_DB.CORE;

-- ------------------------------------------------------------
-- 5) Preview canonical registry rows
-- ------------------------------------------------------------
SELECT *
FROM GAFAIG_DB.CORE.V_REGISTRY_LATEST_APPROVED
LIMIT 10;

SELECT *
FROM GAFAIG_DB.CORE.V_REGISTRY_PUBLIC_SEARCH
LIMIT 10;