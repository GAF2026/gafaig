-- ============================================================
-- 23_GRANTS_REGISTRY_AI_SYSTEMS_PUBLIC.sql
--
-- Purpose:
-- Grant application role access to public registry views used by
-- registry pages, explorer surfaces, and public API endpoints.
--
-- Safe to run multiple times.
-- ============================================================

USE ROLE ACCOUNTADMIN;
USE DATABASE GAFAIG_DB;
USE SCHEMA CORE;

-- ------------------------------------------------------------
-- Base access
-- ------------------------------------------------------------
GRANT USAGE ON DATABASE GAFAIG_DB TO ROLE GAFAIG_APP_ROLE;
GRANT USAGE ON SCHEMA GAFAIG_DB.CORE TO ROLE GAFAIG_APP_ROLE;

-- ------------------------------------------------------------
-- Public registry views
-- ------------------------------------------------------------

-- Public AI systems explorer
GRANT SELECT
ON VIEW GAFAIG_DB.CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC
TO ROLE GAFAIG_APP_ROLE;

-- Public certified entities registry
GRANT SELECT
ON VIEW GAFAIG_DB.CORE.V_REGISTRY_PUBLIC
TO ROLE GAFAIG_APP_ROLE;

-- ------------------------------------------------------------
-- Diagnostics
-- ------------------------------------------------------------
SHOW GRANTS ON VIEW GAFAIG_DB.CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC;
SHOW GRANTS ON VIEW GAFAIG_DB.CORE.V_REGISTRY_PUBLIC;